"""Další snímky z natáčení pro galerii -> assets/img/galerie/ (960 a 1600 px, WebP).
Doplňují 15 snímků z assets/img/snimky/ (ty dělá make_images.py).
Ze 4K videí v Podklady/Videa/beztit/ se v okolí ±0,6 s kolem zadaného času
vezme pět snímků a uloží se ten nejostřejší (rozptyl Laplaceova operátoru).
Originály se jen čtou. Spuštění: python docs/scripts/make_gallery_stills.py
(potřebuje ffmpeg v PATH nebo v winget složce Gyan.FFmpeg)."""
import glob, io, os, shutil, subprocess, sys, tempfile
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
import make_images as mi  # resize_w, save_webp, REPORT, ROOT

VIDEO_DIR = os.path.join(mi.ROOT, "Podklady", "Videa", "beztit")

# slug: (číslo videa, čas v s)
SHOTS = {
    "soubor-celek-zepredu": ("02", 147.0),
    "cembalo-zboku": ("02", 166.0),
    "cembalo-violoncello": ("02", 174.0),
    "cembalo-pult-celek": ("03", 39.0),
    "housle-tma-hloubka": ("04", 15.0),
    "housle-tma-smycce": ("04", 27.0),
    "cembalo-tma": ("05", 21.0),
    "hoboj-housle-solo": ("05", 4.5),
}
# Snímky, které slouží i jako celoplošné pozadí (hero galerie) -> navíc 2560 px.
WIDE = {"housle-tma-hloubka"}

def ffmpeg_bin():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    pat = os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg*\*\bin\ffmpeg.exe")
    hits = glob.glob(pat)
    if not hits:
        sys.exit("ffmpeg nenalezen")
    return hits[0]

def sharpness(img):
    g = np.asarray(img.convert("L").resize((1920, 1080)), dtype=np.float64)
    lap = g[1:-1, 2:] + g[1:-1, :-2] + g[2:, 1:-1] + g[:-2, 1:-1] - 4 * g[1:-1, 1:-1]
    return lap.var()

def best_frame(video, t, tmp):
    best, best_s = None, -1
    for i, dt in enumerate((-0.6, -0.3, 0.0, 0.3, 0.6)):
        out = os.path.join(tmp, "f%d.png" % i)
        subprocess.run([FFMPEG, "-v", "error", "-y", "-ss", "%.2f" % (t + dt), "-i", video,
                        "-frames:v", "1", out], check=True)
        img = Image.open(out).convert("RGB")
        s = sharpness(img)
        if s > best_s:
            best, best_s = img, s
    return best

FFMPEG = ffmpeg_bin()

if __name__ == "__main__":
    with tempfile.TemporaryDirectory() as tmp:
        for slug, (num, t) in SHOTS.items():
            video = glob.glob(os.path.join(VIDEO_DIR, num + "_*.mp4"))[0]
            frame = best_frame(video, t, tmp)
            mi.save_webp(mi.resize_w(frame, 960), os.path.join("galerie", slug + "-960.webp"), 120)
            mi.save_webp(mi.resize_w(frame, 1600), os.path.join("galerie", slug + "-1600.webp"), 240)
            if slug in WIDE:
                mi.save_webp(mi.resize_w(frame, 2560), os.path.join("galerie", slug + "-2560.webp"), 400)
    for rel, w, h, kb, q in mi.REPORT:
        print("%-46s %4d x %4d  %4d kB  q%d" % (rel, w, h, kb, q))
