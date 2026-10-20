import argparse
import json
import subprocess
from pathlib import Path

import imageio_ffmpeg
import yt_dlp

parser = argparse.ArgumentParser()
parser.add_argument("catalog", type=Path)
options = parser.parse_args()
root = Path(__file__).resolve().parent.parent
source = root / "media-source"
output = root / "public" / "manifest" / "audio"
source.mkdir(exist_ok=True)
output.mkdir(parents=True, exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
failures = []
for track in json.loads(options.catalog.read_text(encoding="utf-8-sig")):
    try:
        destination = output / f"{track['id']}.mp3"
        candidates = [file for file in source.glob(f"{track['id']}.*") if file.suffix in {".webm", ".m4a", ".mp4"}]
        if candidates:
            original = candidates[0]
        else:
            with yt_dlp.YoutubeDL({"format": "bestaudio", "outtmpl": str(source / f"{track['id']}.%(ext)s"), "noplaylist": True, "quiet": True, "noprogress": True, "no_warnings": True, "socket_timeout": 15}) as downloader:
                info = downloader.extract_info(f"https://www.youtube.com/watch?v={track['video']}", download=True)
                original = Path(downloader.prepare_filename(info))
        subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-ss", str(track["start"]), "-i", str(original), "-t", "12", "-vn", "-af", "loudnorm=I=-16:TP=-1.5:LRA=7,afade=t=in:st=0:d=0.15,afade=t=out:st=11.5:d=0.5", "-ac", "2", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k", str(destination)], check=True)
        print(f"OK {track['title']}", flush=True)
    except Exception as error:
        failures.append(track["title"])
        print(f"FAIL {track['title']}: {error}", flush=True)
if failures:
    raise SystemExit(f"Missing clips: {', '.join(failures)}")
