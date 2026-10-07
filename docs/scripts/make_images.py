"""Webové verze fotek Capella Nostra -> assets/img/ (popis v assets/img/README.md).
Originály v Podklady/ se jen čtou. Spuštění: python docs/scripts/make_images.py
assets/og-cover.jpg se dělá zvlášť (výřez 1200 × 630 ze snímku 09, JPEG q84)."""
import io, os
import numpy as np
from PIL import Image, ImageFilter

ROOT = r"C:\Users\pavla\Desktop\Capella Nostra"
SRC_F = os.path.join(ROOT, "Podklady", "fotky")
SRC_S = os.path.join(ROOT, "Podklady", "vybrane-snimky")
OUT = os.path.join(ROOT, "assets", "img")
REPORT = []

def src_photo(name):
    p = os.path.join(SRC_F, "Kopie souboru %s.jpg" % name)
    if not os.path.exists(p):
        p = os.path.join(SRC_F, name + ".jpg")
    return Image.open(p).convert("RGB")

# ---------- barevné dorovnání (LAB, numpy) ----------
def _srgb_to_lin(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def _lin_to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)
M = np.array([[0.4124564, 0.3575761, 0.1804375],
              [0.2126729, 0.7151522, 0.0721750],
              [0.0193339, 0.1191920, 0.9503041]])
Minv = np.linalg.inv(M)
WP = np.array([0.95047, 1.0, 1.08883])
def _f(t):
    d = 6 / 29
    return np.where(t > d ** 3, np.cbrt(t), t / (3 * d * d) + 4 / 29)
def _finv(t):
    d = 6 / 29
    return np.where(t > d, t ** 3, 3 * d * d * (t - 4 / 29))
def to_lab(img):
    a = np.asarray(img, dtype=np.float64) / 255.0
    xyz = _srgb_to_lin(a) @ M.T / WP
    fx, fy, fz = _f(xyz[..., 0]), _f(xyz[..., 1]), _f(xyz[..., 2])
    return np.stack([116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)], -1)
def from_lab(lab):
    fy = (lab[..., 0] + 16) / 116
    fx = fy + lab[..., 1] / 500
    fz = fy - lab[..., 2] / 200
    xyz = np.stack([_finv(fx), _finv(fy), _finv(fz)], -1) * WP
    rgb = _lin_to_srgb(xyz @ Minv.T)
    return Image.fromarray((rgb * 255 + 0.5).clip(0, 255).astype(np.uint8))
def grade(img, strength=1.0):
    """Tónové dorovnání Stehna k hlavnímu focení: hlubší černá s modravým nádechem,
    jasnější světla, lehce prosvětlené středy, utlumené teplé tóny dřeva."""
    lab = to_lab(img)
    L = lab[..., 0]
    x = np.clip((L - 9.0) / (94.5 - 9.0), 0, 1) ** 0.9
    L2 = 4.0 + x * (98.0 - 4.0)
    w = np.clip((40.0 - L2) / 40.0, 0, 1)                # váha stínů
    warm = np.clip(lab[..., 2] / 20.0, 0, 1)             # teplé (žluto-červené) plochy
    a2 = lab[..., 1] * (0.95 - 0.10 * warm) + 5.0 * w
    b2 = lab[..., 2] * (0.95 - 0.15 * warm) - 1.0 * w
    out = np.stack([L2, a2, b2], -1)
    return from_lab(lab + (out - lab) * strength)

# ---------- ořezy a zápis ----------
def crop_ratio(img, rw, rh, cx=0.5, cy=0.5):
    W, H = img.size
    if W / H > rw / rh:          # širší než cíl -> ořez do šířky, plná výška
        w, h = round(H * rw / rh), H
    else:
        w, h = W, round(W * rh / rw)
    x = int(min(max(cx * W - w / 2, 0), W - w))
    y = int(min(max(cy * H - h / 2, 0), H - h))
    return img.crop((x, y, x + w, y + h))

def resize_w(img, w):
    h = round(img.height * w / img.width)
    out = img.resize((w, h), Image.LANCZOS)
    return out.filter(ImageFilter.UnsharpMask(radius=0.6, percent=35, threshold=2))

def save_webp(img, rel, max_kb, q0=82, qmin=55):
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    q = q0
    while True:
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= max_kb * 1024 or q <= qmin:
            break
        q -= 3
    with open(path, "wb") as fh:
        fh.write(buf.getvalue())
    REPORT.append((rel.replace("\\", "/"), img.width, img.height, round(buf.tell() / 1024), q))

# ---------- portréty ----------
# slug: (zdrojový soubor, horizontální střed výřezu 0–1)
MAIN = {
    "suk": ("suk1", 0.5), "plavec": ("plavec", 0.5), "zdvihalova": ("zdvihalova", 0.5),
    "majvaldova": ("majvaldova", 0.5), "kabrt": ("kabrt", 0.5), "janicek": ("janicek", 0.5),
    "jadrny": ("jadrny", 0.5), "svetlikova": ("svetlikova2", 0.5), "rykr": ("rykr", 0.5),
    "linkova": ("linkova", 0.5), "stehno": ("Stehno", 0.5),
}
ALT = {"suk-alt": ("suk2", 0.5), "rykr-alt": ("rykr2", 0.5), "svetlikova-alt": ("svetlikova1", 0.5)}

def build(only=None, stehno_strength=1.0):

    for slug, (src, cx) in list(MAIN.items()) + list(ALT.items()):
        if only and slug not in only:
            continue
        full = src_photo(src)
        if src == "Stehno":
            # dorovnání barev na menší kopii (rychlost), 1600 px stačí pro všechny výstupy
            full = full.resize((2400, round(full.height * 2400 / full.width)), Image.LANCZOS)
            full = grade(full, stehno_strength)
        por = crop_ratio(full, 4, 5, cx)
        save_webp(resize_w(por, 960), os.path.join("clenove", slug + "-960.webp"), 150)
        save_webp(resize_w(por, 480), os.path.join("clenove", slug + "-480.webp"), 50)
        save_webp(resize_w(full, 1600), os.path.join("foceni", slug + "-1600.webp"), 220)

    if not only:
        # společná fotka
        sb = src_photo("souborovka")
        for w, kb in ((1200, 180), (2400, 450)):
            save_webp(resize_w(sb, w), os.path.join("soubor", "souborovka-%d.webp" % w), kb)
            save_webp(resize_w(crop_ratio(sb, 16, 9, 0.5, 0.52), w),
                      os.path.join("soubor", "souborovka-16x9-%d.webp" % w), kb)
        # snímky z videí
        for f in sorted(os.listdir(SRC_S)):
            if not f.endswith(".jpg"):
                continue
            slug = f.split("_video")[0].replace("_", "-")      # 01-hlavni-lod-siroky-celek
            im = Image.open(os.path.join(SRC_S, f)).convert("RGB")
            for w, kb in ((960, 90), (1600, 200), (2560, 400)):
                save_webp(resize_w(im, w), os.path.join("snimky", "%s-%d.webp" % (slug, w)), kb)

if __name__ == "__main__":
    build()
    for r in REPORT:
        print("%-52s %5dx%-5d %4d kB  q%d" % r)
