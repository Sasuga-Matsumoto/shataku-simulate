import asyncio
import subprocess
import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

FF = r"C:\Users\matsu\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
FP = r"C:\Users\matsu\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffprobe.exe"
D = r"C:\Users\matsu\shataku\employee\slides"

import edge_tts

# Narration texts - kanji version for natural reading speed
# (hiragana-only forces TTS to read syllable-by-syllable, making it slower)
NARRATIONS = {
    1: "年間二十万円の手取りアップ。福利厚生社宅なら、契約の名義を切り替えるだけ。お引っ越し不要で、手間なく実現できます。",
    2: "月収に応じて、年間十五万円から五十万円の手取りアップが見込めます。利用している人としていない人とでは、五年間で百万円以上の差がつきます。",
    3: "物件の名義を、個人から法人に変更するだけで、社会保険料や税金が下がり、手取りが増えます。",
    4: "ご利用の申請はスマホで完結。簡単スリーステップで、五分で完了します。ぜひ、従業員説明会にご参加ください。",
}

# Slide timings (seconds)
SLIDE_TIMES = {1: (0, 12), 2: (12, 24), 3: (24, 33), 4: (33, 45)}
VOICE = "ja-JP-NanamiNeural"
DELAY = 0.5  # natural delay before narration starts

def get_duration(filepath):
    result = subprocess.run(
        [FP, "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", filepath],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())

async def generate_audio(text, voice, rate, out_file):
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(out_file)
    return get_duration(out_file)

async def main():
    print(f"Voice: {VOICE}")
    print()

    # Step 1: Generate at default rate to measure base durations
    print("Step 1: Measuring base durations (kanji text)...")
    base_durations = {}
    for slide_num, text in NARRATIONS.items():
        tmp = os.path.join(D, f"narr_{slide_num}_tmp.mp3")
        dur = await generate_audio(text, VOICE, "+0%", tmp)
        base_durations[slide_num] = dur
        os.remove(tmp)
        start, end = SLIDE_TIMES[slide_num]
        available = (end - start) - DELAY - 0.5
        status = "OK" if dur <= available else "NEEDS SPEEDUP"
        print(f"  Slide {slide_num}: base={dur:.1f}s, available={available:.1f}s [{status}]")

    # Step 2: Calculate rate adjustment per slide
    print("\nStep 2: Calculating optimal rates...")
    rates = {}
    for slide_num in NARRATIONS:
        start, end = SLIDE_TIMES[slide_num]
        available = (end - start) - DELAY - 0.5
        base = base_durations[slide_num]
        if base > available:
            speedup = (base / available - 1) * 100
            speedup = min(speedup, 12)  # cap at +12% for naturalness
            rates[slide_num] = f"+{int(speedup)}%"
        else:
            rates[slide_num] = "+0%"
        print(f"  Slide {slide_num}: rate={rates[slide_num]}")

    # Step 3: Generate final audio
    print("\nStep 3: Generating final narration...")
    final_durations = {}
    for slide_num, text in NARRATIONS.items():
        out_file = os.path.join(D, f"narr_{slide_num}.mp3")
        dur = await generate_audio(text, VOICE, rates[slide_num], out_file)
        final_durations[slide_num] = dur
        start, end = SLIDE_TIMES[slide_num]
        margin = (end - start) - DELAY - dur
        status = "OK" if margin >= 0 else "TRIMMED"
        print(f"  Slide {slide_num}: {dur:.1f}s (rate={rates[slide_num]}, margin={margin:.1f}s) [{status}]")

    # Step 4: Build combined narration
    print("\nStep 4: Building combined narration track...")
    segments = []
    for slide_num in sorted(SLIDE_TIMES.keys()):
        start, end = SLIDE_TIMES[slide_num]
        slide_dur = end - start
        narr_file = os.path.join(D, f"narr_{slide_num}.mp3")
        padded_file = os.path.join(D, f"narr_{slide_num}_padded.wav")

        subprocess.run([
            FF, "-y",
            "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=mono",
            "-i", narr_file,
            "-filter_complex",
            f"[0]atrim=0:{DELAY}[silence];[silence][1:a]concat=n=2:v=0:a=1[combined];[combined]apad=whole_dur={slide_dur}[padded];[padded]atrim=0:{slide_dur}[out]",
            "-map", "[out]",
            "-ar", "44100", "-ac", "1",
            padded_file
        ], capture_output=True)
        segments.append(padded_file)

    concat_list = os.path.join(D, "concat_narr.txt")
    with open(concat_list, "w") as f:
        for seg in segments:
            f.write(f"file '{seg}'\n")

    combined_audio = os.path.join(D, "narration_combined.wav")
    subprocess.run([
        FF, "-y", "-f", "concat", "-safe", "0", "-i", concat_list,
        "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "1",
        combined_audio
    ], capture_output=True)

    # Step 5: Merge with video
    print("\nStep 5: Merging with video...")
    video_file = os.path.join(D, "slide_motion_noaudio_ext.mp4")
    output_file = os.path.join(D, "slide_01_motion.mp4")

    subprocess.run([
        FF, "-y",
        "-i", video_file,
        "-i", combined_audio,
        "-c:v", "copy", "-c:a", "aac", "-b:a", "128k",
        "-shortest",
        output_file
    ], capture_output=True)

    final_dur = get_duration(output_file)
    fsize = os.path.getsize(output_file) / (1024 * 1024)
    print(f"\nFinal: {output_file}")
    print(f"  Duration: {final_dur:.1f}s | Size: {fsize:.1f}MB")
    print("Done!")

asyncio.run(main())
