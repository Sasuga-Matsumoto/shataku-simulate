import subprocess
import sys
sys.stdout.reconfigure(encoding='utf-8')

FF = r"C:\Users\matsu\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
D = r"C:\Users\matsu\shataku\employee\slides"

SMALL_W, SMALL_H = 160, 90
SMALL_SIZE = SMALL_W * SMALL_H * 3
FPS = 30

# Scan the CURRENT output file (after flash removal)
proc = subprocess.Popen(
    [FF, "-i", f"{D}\\slide_motion_noaudio.mp4", "-vf", f"scale={SMALL_W}:{SMALL_H}", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"],
    stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
)

frame_num = 0
prev_rgb = None
print("=== Color anomalies in current output (slide 2: 12-24.5s) ===")
while True:
    data = proc.stdout.read(SMALL_SIZE)
    if len(data) < SMALL_SIZE:
        break
    t = frame_num / FPS
    if 12.0 <= t <= 24.5:
        pixels = len(data) // 3
        r = sum(data[i*3] for i in range(pixels)) / pixels
        g = sum(data[i*3+1] for i in range(pixels)) / pixels
        b = sum(data[i*3+2] for i in range(pixels)) / pixels
        color_dev = max(r, g, b) - min(r, g, b)
        gray = (r + g + b) / 3

        if prev_rgb:
            pr, pg, pb = prev_rgb
            max_diff = max(abs(r-pr), abs(g-pg), abs(b-pb))
            if max_diff > 8 or color_dev > 50:
                print(f"  f{frame_num:4d} ({t:.2f}s): R={r:.0f} G={g:.0f} B={b:.0f} gray={gray:.0f} dev={color_dev:.0f} maxDiff={max_diff:.0f}")

        prev_rgb = (r, g, b)
    frame_num += 1
proc.wait()
print(f"Scanned {frame_num} frames")
