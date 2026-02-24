import subprocess
import sys
sys.stdout.reconfigure(encoding='utf-8')

FF = r"C:\Users\matsu\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
D = r"C:\Users\matsu\shataku\employee\slides"

W, H, FPS = 1920, 1080, 30
FRAME_SIZE = W * H * 3
SMALL_W, SMALL_H = 160, 90
SMALL_SIZE = SMALL_W * SMALL_H * 3

# Step 1: Scan all frames at small resolution
print("Scanning all frames...")
proc_scan = subprocess.Popen(
    [FF, "-i", f"{D}\\video_raw.mp4", "-vf", f"scale={SMALL_W}:{SMALL_H}", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"],
    stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
)

frame_data = []
while True:
    data = proc_scan.stdout.read(SMALL_SIZE)
    if len(data) < SMALL_SIZE:
        break
    pixels = len(data) // 3
    r = sum(data[i*3] for i in range(pixels)) / pixels
    g = sum(data[i*3+1] for i in range(pixels)) / pixels
    b = sum(data[i*3+2] for i in range(pixels)) / pixels
    gray = (r + g + b) / 3
    color_dev = max(r, g, b) - min(r, g, b)
    frame_data.append((r, g, b, gray, color_dev))
proc_scan.wait()
print(f"Scanned {len(frame_data)} frames")

# Step 2: Find all frames to replace
flash_frames = set()

# Color anomalies (purple flash etc)
for i in range(1, len(frame_data)):
    if frame_data[i][4] > 80:
        flash_frames.add(i)
        print(f"  Color anomaly f{i} ({i/FPS:.2f}s): dev={frame_data[i][4]:.0f}")

# Find transition spikes and expand to cover the full white fade
for i in range(1, len(frame_data)):
    gray_diff = frame_data[i][3] - frame_data[i-1][3]
    if gray_diff > 10:
        spike = i
        # Find next slide's stable brightness (look 45-60 frames ahead)
        look_s = min(spike + 45, len(frame_data) - 1)
        look_e = min(spike + 60, len(frame_data))
        target = sum(frame_data[j][3] for j in range(look_s, look_e)) / max(1, look_e - look_s)

        # Replace all frames brighter than target + 3
        j = spike
        while j < len(frame_data) and frame_data[j][3] > target + 3:
            flash_frames.add(j)
            j += 1
        print(f"  Transition f{spike}-f{j-1} ({spike/FPS:.2f}s-{(j-1)/FPS:.2f}s): {j-spike} frames, target={target:.0f}")

print(f"\nTotal frames to replace: {len(flash_frames)}")

# Step 3: Replace in full resolution (hold last good frame)
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
