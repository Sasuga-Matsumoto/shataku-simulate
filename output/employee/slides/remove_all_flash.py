import subprocess
import sys
sys.stdout.reconfigure(encoding='utf-8')

FF = r"C:\Users\matsu\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
D = r"C:\Users\matsu\shataku\employee\slides"

W, H, FPS = 1920, 1080, 30
FRAME_SIZE = W * H * 3
SMALL_W, SMALL_H = 160, 90
SMALL_SIZE = SMALL_W * SMALL_H * 3

# Step 1: Detect all flash frames (brightness spike OR color anomaly)
print("Scanning for flash frames...")
proc_scan = subprocess.Popen(
    [FF, "-i", f"{D}\\video_raw.mp4", "-vf", f"scale={SMALL_W}:{SMALL_H}", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"],
    stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
)

prev_rgb = None
flash_frames = set()
frame_num = 0
while True:
    data = proc_scan.stdout.read(SMALL_SIZE)
    if len(data) < SMALL_SIZE:
        break
    pixels = len(data) // 3
    r = sum(data[i*3] for i in range(pixels)) / pixels
    g = sum(data[i*3+1] for i in range(pixels)) / pixels
    b = sum(data[i*3+2] for i in range(pixels)) / pixels
    color_dev = max(r, g, b) - min(r, g, b)

    if prev_rgb:
        pr, pg, pb = prev_rgb
        max_ch_diff = max(abs(r-pr), abs(g-pg), abs(b-pb))
        # Detect: pure white flash (brightness 255) or color anomaly (high deviation + sudden change)
        gray = (r + g + b) / 3
        if gray > 253 and max_ch_diff > 15:
            flash_frames.add(frame_num)
            t = frame_num / FPS
            print(f"  White flash: f{frame_num} ({t:.2f}s) R={r:.0f} G={g:.0f} B={b:.0f}")
        elif color_dev > 100:
            flash_frames.add(frame_num)
            t = frame_num / FPS
            print(f"  Color flash: f{frame_num} ({t:.2f}s) R={r:.0f} G={g:.0f} B={b:.0f} dev={color_dev:.0f}")

    prev_rgb = (r, g, b)
    frame_num += 1
proc_scan.wait()
print(f"Found {len(flash_frames)} flash frames")

# Step 2: Replace flash frames in full resolution
print("\nProcessing full resolution...")
proc_in = subprocess.Popen(
    [FF, "-i", f"{D}\\video_raw.mp4", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"],
    stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
)
proc_out = subprocess.Popen(
    [FF, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
     "-i", "-", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
     f"{D}\\slide_motion_noaudio.mp4"],
    stdin=subprocess.PIPE, stderr=subprocess.DEVNULL
)

prev_frame = None
frame_num = 0
replaced = 0
while True:
    data = proc_in.stdout.read(FRAME_SIZE)
    if len(data) < FRAME_SIZE:
        break
    if frame_num in flash_frames and prev_frame is not None:
        proc_out.stdin.write(prev_frame)
        replaced += 1
    else:
        proc_out.stdin.write(data)
        prev_frame = data
    frame_num += 1

proc_in.wait()
proc_out.stdin.close()
proc_out.wait()
print(f"Done! Replaced {replaced} frames out of {frame_num}")
