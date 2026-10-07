"""Smyčka pro hero s videem na index.html -> assets/video/.
Video 05 30–34,5 s + video 02 123,95–131,75 s (tvrdý střih), 25 fps, bez zvuku.
hero-soubor-1080.mp4 = 1920 × 1080, hero-soubor-mobil.mp4 = středový výřez 720 × 1280.
H.264 CRF 22 / 24 (veryslow, tune film): kamenná zeď v pozadí je na data náročná,
s pevným nízkým datovým tokem se rozmazává. Originály se jen čtou.
Spuštění: python docs/scripts/make_hero_video.py (ffmpeg viz make_gallery_stills.py)."""
import glob, os, subprocess

import make_images as mi
from make_gallery_stills import FFMPEG, VIDEO_DIR

# (číslo videa, začátek v s, počet snímků)
CUTS = [("05", 30.0, 113), ("02", 123.95, 195)]
# název souboru: (filtr velikosti, CRF, H.264 level)
OUTPUTS = {
    "hero-soubor-1080.mp4": ("scale=1920:1080:flags=lanczos", 22, "4.1"),
    "hero-soubor-mobil.mp4": ("crop=ih*9/16:ih,scale=720:1280:flags=lanczos", 24, "4.0"),
}

def encode(name, size, crf, level):
    args, chains = [FFMPEG, "-v", "error", "-y"], []
    for i, (num, start, frames) in enumerate(CUTS):
        video = glob.glob(os.path.join(VIDEO_DIR, num + "_*.mp4"))[0]
        args += ["-ss", "%.2f" % start, "-t", "%.2f" % (frames / 25 + 0.1), "-i", video]
        chains.append("[%d:v]trim=end_frame=%d,setpts=PTS-STARTPTS,%s[c%d]" % (i, frames, size, i))
    graph = ";".join(chains) + ";" + "".join("[c%d]" % i for i in range(len(CUTS)))
    graph += "concat=n=%d:v=1:a=0,format=yuv420p[v]" % len(CUTS)
    out = os.path.join(mi.ROOT, "assets", "video", name)
    subprocess.run(args + ["-filter_complex", graph, "-map", "[v]", "-an",
                           "-c:v", "libx264", "-preset", "veryslow", "-tune", "film",
                           "-crf", str(crf), "-profile:v", "high", "-level", level,
                           "-g", "50", "-movflags", "+faststart", out], check=True)
    print("%-24s %5.1f MB" % (name, os.path.getsize(out) / 1e6))

if __name__ == "__main__":
    for name, (size, crf, level) in OUTPUTS.items():
        encode(name, size, crf, level)
