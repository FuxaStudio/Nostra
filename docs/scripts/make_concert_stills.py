"""Další snímky z natáčení (16–34, bez 19 – vyřazena), hlavně pro karty koncertů -> assets/img/snimky/
(960, 1600 a 2560 px, WebP) + 4K JPEG do Podklady/vybrane-snimky/ (stejně jako 01–15,
takže je případně převezme i make_images.py).
Z 4K videí v Podklady/Videa/beztit/ se v okolí ±0,2 s kolem zadaného času vezmou
všechny snímky (25 fps) a uloží se ten nejostřejší (rozptyl Laplaceova operátoru).
Výběr časů: náhledové archy po střizích, viz assets/img/README.md, oddíl 4.
Originály se jen čtou. Spuštění: python docs/scripts/make_concert_stills.py"""
import glob, os, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
import make_images as mi                       # resize_w, save_webp, REPORT, ROOT
from make_gallery_stills import FFMPEG, VIDEO_DIR, sharpness

SRC_S = os.path.join(mi.ROOT, "Podklady", "vybrane-snimky")

# slug: (číslo videa, čas v s)
SHOTS = {
    "16-housle-u-pultu": ("01", 12.2),
    "17-housle-trojice": ("01", 47.3),
    "18-cembalo-kontrabas": ("02", 4.35),
    "20-housle-sekce-pult": ("02", 23.15),
    "21-violoncello-kontrabas-hoboj": ("02", 78.6),
    "22-pohled-od-cembala": ("02", 101.3),
    "23-housle-sekce-popredi": ("02", 114.95),
    "24-violoncello-kontrabas-zblizka": ("02", 119.65),
    "25-soubor-za-cembalem": ("02", 136.25),
    "26-housle-hoboje": ("02", 140.35),
    "27-kontrabas-violoncello-duo": ("02", 154.0),
    "28-soubor-presbytar-zboku": ("02", 201.05),
    "29-housle-trojice-pohyb": ("03", 27.6),
    "30-housle-tma-dvojice": ("04", 68.55),
    "31-housle-tma-trojice": ("04", 77.35),
    "32-cembalo-tma": ("05", 24.5),
    "33-soubor-slunce-ulicka": ("05", 37.1),
    "34-soubor-slunce-presbytar": ("05", 84.65),
}

def best_frame(video, t, tmp):
    subprocess.run([FFMPEG, "-v", "error", "-y", "-ss", "%.2f" % (t - 0.2), "-i", video,
                    "-t", "0.4", os.path.join(tmp, "f%02d.png")], check=True)
    frames = [Image.open(f).convert("RGB") for f in sorted(glob.glob(os.path.join(tmp, "f*.png")))]
    return max(frames, key=sharpness)

def one(item):
    slug, (num, t) = item
    video = glob.glob(os.path.join(VIDEO_DIR, num + "_*.mp4"))[0]
    with tempfile.TemporaryDirectory() as tmp:
        frame = best_frame(video, t, tmp)
    num_s, desc = slug.split("-", 1)
    frame.save(os.path.join(SRC_S, "%s_%s_video%s_t%.1fs.jpg" % (num_s, desc, num, t)), quality=95)
    for w, kb in ((960, 90), (1600, 200), (2560, 400)):
        mi.save_webp(mi.resize_w(frame, w), os.path.join("snimky", "%s-%d.webp" % (slug, w)), kb)

if __name__ == "__main__":
    with ThreadPoolExecutor(4) as ex:
        list(ex.map(one, SHOTS.items()))
    for r in sorted(mi.REPORT):
        print("%-52s %5dx%-5d %4d kB  q%d" % r)
