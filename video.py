import subprocess
from pathlib import Path
import math

# ============================================================
# CONFIG
# ============================================================

VIDEO_DIR = Path("/home/nav/Desktop/Bhavishyashakti/public/videos")
OUTPUT_DIR = VIDEO_DIR / "compressed"

MAX_SIZE_BYTES = 1 * 1024 * 1024  # 1 MB

VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
    ".m4v",
    ".flv",
    ".wmv",
}

# Audio bitrate in kbps
AUDIO_BITRATE = 32

# Small safety margin so the final file stays below 1 MB
SAFETY_MARGIN = 0.90


# ============================================================
# GET VIDEO DURATION
# ============================================================

def get_duration(video):
    command = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(video),
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        raise RuntimeError(result.stderr)

    return float(result.stdout.strip())


# ============================================================
# COMPRESS VIDEO
# ============================================================

def compress_video(input_file):
    output_file = OUTPUT_DIR / f"{input_file.stem}.mp4"

    duration = get_duration(input_file)

    if duration <= 0:
        print(f"❌ Invalid duration: {input_file.name}")
        return

    # Target total bitrate in bits/sec
    target_total_bitrate = (
        MAX_SIZE_BYTES * 8 * SAFETY_MARGIN
    ) / duration

    # Convert to kbps
    target_total_kbps = target_total_bitrate / 1000

    # Video bitrate after audio
    video_bitrate = target_total_kbps - AUDIO_BITRATE

    # Minimum sensible bitrate
    video_bitrate = max(video_bitrate, 20)

    print()
    print("=" * 60)
    print(f"Video       : {input_file.name}")
    print(f"Duration    : {duration:.2f} sec")
    print(f"Video bitrate: {video_bitrate:.0f} kbps")
    print("=" * 60)

    # --------------------------------------------------------
    # First pass
    # --------------------------------------------------------

    null_output = "/dev/null"

    pass1_command = [
        "ffmpeg",
        "-y",
        "-i", str(input_file),

        "-c:v", "libx264",
        "-b:v", f"{video_bitrate:.0f}k",

        "-pass", "1",
        "-passlogfile", str(OUTPUT_DIR / "ffmpeg2pass"),

        "-an",

        "-f", "mp4",
        null_output,
    ]

    result = subprocess.run(pass1_command)

    if result.returncode != 0:
        print(f"❌ First pass failed: {input_file.name}")
        return

    # --------------------------------------------------------
    # Second pass
    # --------------------------------------------------------

    pass2_command = [
        "ffmpeg",
        "-y",
        "-i", str(input_file),

        "-c:v", "libx264",
        "-preset", "slow",
        "-b:v", f"{video_bitrate:.0f}k",

        "-pass", "2",
        "-passlogfile", str(OUTPUT_DIR / "ffmpeg2pass"),

        "-c:a", "aac",
        "-b:a", f"{AUDIO_BITRATE}k",

        "-movflags", "+faststart",

        str(output_file),
    ]

    result = subprocess.run(pass2_command)

    if result.returncode != 0:
        print(f"❌ Second pass failed: {input_file.name}")
        return

    # --------------------------------------------------------
    # Check final size
    # --------------------------------------------------------

    final_size = output_file.stat().st_size
    final_size_mb = final_size / (1024 * 1024)

    print(f"✅ Output: {output_file.name}")
    print(f"📦 Size  : {final_size_mb:.3f} MB")

    # --------------------------------------------------------
    # If still > 1 MB, retry with lower bitrate
    # --------------------------------------------------------

    if final_size > MAX_SIZE_BYTES:

        print("⚠️ Still above 1 MB. Compressing again...")

        reduction_factor = MAX_SIZE_BYTES / final_size
        new_video_bitrate = max(
            int(video_bitrate * reduction_factor * 0.90),
            15
        )

        retry_command = [
            "ffmpeg",
            "-y",
            "-i", str(input_file),

            "-c:v", "libx264",
            "-preset", "slow",
            "-b:v", f"{new_video_bitrate}k",

            "-c:a", "aac",
            "-b:a", "24k",

            "-movflags", "+faststart",

            str(output_file),
        ]

        result = subprocess.run(retry_command)

        if result.returncode == 0:

            final_size = output_file.stat().st_size
            final_size_mb = final_size / (1024 * 1024)

            print(f"🔄 Retried size: {final_size_mb:.3f} MB")

    # --------------------------------------------------------
    # Final check
    # --------------------------------------------------------

    final_size = output_file.stat().st_size

    if final_size <= MAX_SIZE_BYTES:
        print(f"✅ SUCCESS: {final_size / 1024:.1f} KB")
    else:
        print(
            f"⚠️ Could not reach 1 MB: "
            f"{final_size / (1024 * 1024):.3f} MB"
        )


# ============================================================
# MAIN
# ============================================================

def main():

    if not VIDEO_DIR.exists():
        print(f"❌ Folder does not exist: {VIDEO_DIR}")
        return

    OUTPUT_DIR.mkdir(exist_ok=True)

    videos = [
        f for f in VIDEO_DIR.iterdir()
        if f.is_file()
        and f.suffix.lower() in VIDEO_EXTENSIONS
    ]

    if not videos:
        print("❌ No videos found.")
        return

    print(f"Found {len(videos)} videos.")

    for video in videos:

        try:
            compress_video(video)

        except Exception as e:
            print(f"❌ Error processing {video.name}: {e}")

    print()
    print("=" * 60)
    print("DONE")
    print(f"Compressed videos are in:")
    print(OUTPUT_DIR)
    print("=" * 60)


if __name__ == "__main__":
    main()