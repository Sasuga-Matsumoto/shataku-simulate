import subprocess
import sys
sys.stdout.reconfigure(encoding='utf-8')

FF = r"C:\Users\matsu\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
D = r"C:\Users\matsu\shataku\employee\slides"

W, H, FPS = 160, 90, 30
FRAME_SIZE = W * H

proc = subprocess.Popen(
    [FF, "-i", f"{D}\\video_raw.mp4", "-vf", f"scale={W}:{H}", "-pix_fmt", "gray", "-f", "rawvideo", "-"],
    stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
)

brightnesses = []
while True:
    data = proc.stdout.read(FRAME_SIZE)
    if len(data) < FRAME_SIZE:
        break
    brightnesses.append(sum(data) / len(data))
proc.wait()

# Slide 2 range: ~12.1s to ~24.3s
print("=== Slide 2 full scan (12s - 24.5s) ===")
print("Frames with significant brightness change (delta > 5):")
f_start = int(12.0 * FPS)
f_end = int(24.5 * FPS)
for i in range(f_start, min(f_end, len(brightnesses))):
    diff = brightnesses[i] - brightnesses[i-1] if i > 0 else 0
    if abs(diff) > 5:
        t = i / FPS
        print(f"  {t:6.2f}s (f{i:4d}): {brightnesses[i]:6.1f}  delta={diff:+6.1f}")

# Show detailed around frame 511 area
print("\n=== Detail around 17s (frame 500-520) ===")
for i in range(500, min(520, len(brightnesses))):
    diff = brightnesses[i] - brightnesses[i-1] if i > 0 else 0
    t = i / FPS
    marker = " <<<" if abs(diff) > 5 else ""
    print(f"  {t:6.2f}s (f{i:4d}): {brightnesses[i]:6.1f}  delta={diff:+6.1f}{marker}")
