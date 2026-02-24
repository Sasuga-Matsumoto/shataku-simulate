import subprocess
import sys
sys.stdout.reconfigure(encoding='utf-8')

FF = r"C:\Users\matsu\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
D = r"C:\Users\matsu\shataku\employee\slides"

W, H, FPS = 160, 90, 30
FRAME_SIZE = W * H * 3  # RGB

proc = subprocess.Popen(
    [FF, "-i", f"{D}\\slide_motion_noaudio.mp4", "-vf", f"scale={W}:{H}", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"],
    stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
)

frames_data = []
while True:
    data = proc.stdout.read(FRAME_SIZE)
    if len(data) < FRAME_SIZE:
        break
    pixels = len(data) // 3
    r_avg = sum(data[i*3] for i in range(pixels)) / pixels
    g_avg = sum(data[i*3+1] for i in range(pixels)) / pixels
    b_avg = sum(data[i*3+2] for i in range(pixels)) / pixels
    gray_avg = (r_avg + g_avg + b_avg) / 3
    # Color deviation: how much the channels differ from each other
    color_dev = max(r_avg, g_avg, b_avg) - min(r_avg, g_avg, b_avg)
    frames_data.append((r_avg, g_avg, b_avg, gray_avg, color_dev))
proc.wait()

print(f"Total frames: {len(frames_data)}")

# Slide 2: ~12.1s to ~24.3s
print("\n=== Slide 2: Frames with sudden color changes ===")
f_start = int(12.0 * FPS)
f_end = int(24.5 * FPS)
for i in range(max(1, f_start), min(f_end, len(frames_data))):
    curr = frames_data[i]
    prev = frames_data[i-1]
    r_diff = abs(curr[0] - prev[0])
    g_diff = abs(curr[1] - prev[1])
    b_diff = abs(curr[2] - prev[2])
    max_diff = max(r_diff, g_diff, b_diff)
    if max_diff > 5:
        t = i / FPS
        print(f"  f{i:4d} ({t:.2f}s): R={curr[0]:.0f} G={curr[1]:.0f} B={curr[2]:.0f} colorDev={curr[4]:.1f} | dR={r_diff:+.1f} dG={g_diff:+.1f} dB={b_diff:+.1f}")

# Also check all frames for unusual color deviation
print("\n=== All frames with high color deviation (>30) in slide 2 ===")
for i in range(f_start, min(f_end, len(frames_data))):
    if frames_data[i][4] > 30:
        t = i / FPS
        r, g, b = frames_data[i][0], frames_data[i][1], frames_data[i][2]
        print(f"  f{i:4d} ({t:.2f}s): R={r:.0f} G={g:.0f} B={b:.0f} colorDev={frames_data[i][4]:.1f}")
