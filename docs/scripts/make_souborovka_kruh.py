"""Čtvercový výřez společné fotky pro kruhový rámeček na úvodní stránce.

V kruhu musí být vidět celý soubor (i hlavice kontrabasu a krajní hráči).
Kruh kolem celé řady je ale vyšší než fotka, proto se plátno nahoře
a dole prodlouží: strop i podlaha jsou skoro jednolité, takže se doplní
rozmazaným průměrem krajních řádků fotky a plynule navážou. Lidí ani
nástrojů se doplnění netýká. Originál v Podklady/ se nemění.

Spuštění z kořene webu:  python docs/scripts/make_souborovka_kruh.py
Výstup: assets/img/soubor/souborovka-kruh-{600,1200}.webp
"""
import os

import numpy as np
from PIL import Image, ImageFilter, ImageOps

SRC = os.path.join("Podklady", "fotky", "Kopie souboru souborovka.jpg")
OUT = os.path.join("assets", "img", "soubor")

# Střed řady hráčů a poloměr kruhu jako podíl šířky fotky
# (změřeno na fotce: krajní body jsou hlavice kontrabasu a nohy krajních hráčů).
CX, CY, R = 0.504, 0.55, 0.49
BAND = 0.05    # výška pruhu u horního/dolního okraje, ze kterého se bere barva
FEATHER = 0.06  # přechod mezi fotkou a doplněním


def edge_fill(strip, height, width, away_from_photo_down):
    """Pruh z průměru sloupců okrajového pásu: u fotky drží její průběh,
    dál od ní silně rozmazaný do jednolitého tónu (bez svislých pruhů
    z odlesků podlahy)."""
    col = strip.mean(axis=0, keepdims=True)  # 1 × W × 3
    row = Image.fromarray(np.clip(col, 0, 255).astype("uint8"))
    near = np.asarray(row.filter(ImageFilter.GaussianBlur(radius=width * 0.02)), dtype=np.float32)[0]
    far = np.asarray(row.filter(ImageFilter.GaussianBlur(radius=width * 0.15)), dtype=np.float32)[0]
    t = np.linspace(0, 1, height, dtype=np.float32) ** 0.6
    if not away_from_photo_down:
        t = t[::-1]
    fill = near[None] * (1 - t[:, None, None]) + far[None] * t[:, None, None]
    # Jemné zrno, ať doplněná plocha nepůsobí jako vybarvená.
    rng = np.random.default_rng(7)
    return fill + rng.normal(0, 1.2, fill.shape).astype(np.float32)


def main():
    im = ImageOps.exif_transpose(Image.open(SRC)).convert("RGB")
    w, h = im.size
    a = np.asarray(im, dtype=np.float32)

    side = int(round(2 * R * w))
    left = int(round(CX * w - side / 2))
    top = int(round(CY * h - side / 2))
    pad_top = max(0, -top)
    pad_bottom = max(0, top + side - h)
    band = int(h * BAND)

    canvas = np.concatenate([
        edge_fill(a[:band], pad_top, w, False),
        a,
        edge_fill(a[-band:], pad_bottom, w, True),
    ], axis=0)

    # Měkký přechod: kousek fotky u okraje se prolne s doplněním.
    f = int(h * FEATHER)
    for start, fill_row, sign in ((pad_top, pad_top - 1, 1), (pad_top + h - 1, pad_top + h, -1)):
        fill = canvas[fill_row].copy()
        for i in range(f):
            t = (i / f) ** 1.5
            r = start + sign * i
            canvas[r] = canvas[r] * t + fill * (1 - t)

    y0 = top + pad_top
    crop = canvas[y0:y0 + side, left:left + side]
    sq = Image.fromarray(np.clip(crop, 0, 255).astype("uint8"))

    for size, q in ((600, 82), (1200, 80)):
        out = sq.resize((size, size), Image.LANCZOS).filter(
            ImageFilter.UnsharpMask(radius=0.6, percent=35, threshold=2))
        path = os.path.join(OUT, "souborovka-kruh-%d.webp" % size)
        out.save(path, "WEBP", quality=q, method=6)
        print(path, out.size, os.path.getsize(path) // 1024, "kB")


if __name__ == "__main__":
    main()
