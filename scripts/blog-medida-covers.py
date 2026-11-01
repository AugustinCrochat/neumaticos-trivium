#!/usr/bin/env python3
"""Portada (1200x600) y figura (1280x800) de las notas /blog/neumaticos-<medida>-autos-que-la-usan.

Toma los autos de la página de cada nota (primero la tabla de los más
conocidos, después el resto de la lista) y se queda con los que ya tienen foto
en public/images/vehiculos. Uso:  python3 scripts/blog-medida-covers.py [slug-medida ...]

La portada se ve recortada según el lugar (grilla del blog en celular ~2,2:1,
nota en celular 16:9, escritorio 2:1), así que todo lo importante va dentro de
una zona segura: 100 px a los costados y 55 px arriba y abajo.
"""
import glob, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
F = "/usr/share/fonts/truetype/liberation/LiberationSans-"
font = lambda style, size: ImageFont.truetype(F + style + ".ttf", size)
RED = (255, 38, 8)
LOGO = Image.open("public/images/brand/logo-trivium-pdf.png").convert("RGBA")
LOGO = LOGO.crop(LOGO.getbbox())

# fotos de vehículos ya commiteadas (las sin seguimiento son de otra tarea)
sin_seguir = set(subprocess.run(["git", "ls-files", "--others", "--exclude-standard", "public/images/vehiculos"],
                                capture_output=True, text=True).stdout.split())

# fotos que no representan a los años de la nota (generación actual / eléctrico)
EXCLUIR = {"renault-megane", "volkswagen-bora"}

def fondo(w, h, glow):
    y, x = np.mgrid[0:h, 0:w]
    d = np.sqrt(((x - glow[0]) / (w * 0.55)) ** 2 + ((y - glow[1]) / (h * 0.9)) ** 2)
    k = np.clip(1 - d, 0, 1) ** 1.6
    base = np.array([6, 6, 8], float)
    rojo = np.array([62, 10, 6], float)
    img = base + (rojo - base) * k[..., None]
    return Image.fromarray(img.astype("uint8"))

def auto(slug, ancho):
    im = Image.open(f"public/images/vehiculos/{slug}.webp").convert("RGBA")
    im = im.crop(im.getchannel("A").getbbox())
    return im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)

def logo(ancho):
    return LOGO.resize((ancho, round(LOGO.height * ancho / LOGO.width)), Image.LANCZOS)

def pegar(out, im, x, y):
    # sombra suave bajo el auto
    sh = Image.new("RGBA", out.size, (0, 0, 0, 0))
    ell = Image.new("L", out.size, 0)
    ImageDraw.Draw(ell).ellipse((x + im.width * 0.06, y + im.height - 26, x + im.width * 0.94, y + im.height + 6), fill=150)
    sh.putalpha(ell.filter(ImageFilter.GaussianBlur(9)))
    out.alpha_composite(sh)
    out.alpha_composite(im, (x, y))

def autos_de(medida):
    src = open(f"src/app/blog/neumaticos-{medida}-autos-que-la-usan/page.tsx").read()
    vistos, res = set(), []
    for slug, nombre in re.findall(r'href="/vehiculos/([a-z0-9-]+)">([^<]+)</Link>', src):
        if slug in vistos or slug in EXCLUIR:
            continue
        vistos.add(slug)
        f = f"public/images/vehiculos/{slug}.webp"
        if os.path.exists(f) and f not in sin_seguir:
            res.append((slug, nombre))
    n = re.search(r"los (\d+) modelos|(\d+) (?:modelos|autos|pickups)", src)
    return res, int(next(g for g in n.groups() if g)) if n else None

def portada(medida, autos, total, pickups):
    W, H = 1200, 600
    out = fondo(W, H, (900, 330)).convert("RGBA")
    lg = logo(250)
    out.alpha_composite(lg, (100, 55))
    d = ImageDraw.Draw(out)
    label = "MEDIDA DE NEUMÁTICO"
    d.text((100, 195), " ".join(label), font=font("Bold", 24), fill=RED) if False else d.text((100, 195), label, font=font("Bold", 26), fill=RED)
    nombre = medida.replace("-r", " R").replace("-", "/", 1).upper()
    d.text((100, 238), nombre, font=font("BoldItalic", 92), fill=(255, 255, 255))
    d.text((100, 372), "Qué pickups la usan" if pickups else "Qué autos la usan", font=font("Bold", 36), fill=(205, 208, 216))
    if total:
        d.text((100, 424), f"{total} modelos de la base de Trivium", font=font("Regular", 26), fill=(150, 154, 166))
    a = [auto(s, w) for (s, _), w in zip(autos[:3], (430, 350, 290))]
    # el de atrás arriba a la derecha, los otros dos delante y más abajo
    pegar(out, a[0], 1100 - a[0].width, 90)
    pegar(out, a[1], 610, 545 - a[1].height)
    pegar(out, a[2], 1100 - a[2].width, 545 - a[2].height)
    d.rectangle((0, H - 8, W, H), fill=RED)
    return out.convert("RGB")

def figura(medida, autos, pickups):
    W, H = 1280, 800
    out = fondo(W, H, (W * 0.8, H * 0.55)).convert("RGBA")
    d = ImageDraw.Draw(out)
    nombre = medida.replace("-r", " R").replace("-", "/", 1).upper()
    f1, f2 = font("BoldItalic", 64), font("Regular", 28)
    d.text((W / 2, 62), nombre, font=f1, fill=(255, 255, 255), anchor="mm")
    d.text((W / 2, 113), "Algunas de las camionetas que la llevan" if pickups else "Algunos de los autos que la llevan", font=f2, fill=(240, 120, 100), anchor="mm")
    cw, ch, y0 = 380, 290, 150
    for i, (slug, nom) in enumerate(autos[:6]):
        cx = 260 + (i % 3) * 380
        top = y0 + (i // 3) * 275
        im = auto(slug, 340)
        if im.height > 190:
            im = im.resize((round(im.width * 190 / im.height), 190), Image.LANCZOS)
        pegar(out, im, cx - im.width // 2, top + 190 - im.height)
        d.text((cx, top + 235), nom, font=font("Bold", 28), fill=(255, 255, 255), anchor="mm")
    lg = logo(210)
    out.alpha_composite(lg, (W - 210 - 50, H - lg.height - 40))
    d.rectangle((0, H - 8, W, H), fill=RED)
    return out.convert("RGB")

def main():
    pedidas = sys.argv[1:]
    for p in sorted(glob.glob("src/app/blog/neumaticos-*-autos-que-la-usan/page.tsx")):
        medida = re.search(r"neumaticos-(\d+-\d+-r\d+)-autos", p).group(1)
        if pedidas and medida not in pedidas:
            continue
        autos, total = autos_de(medida)
        pickups = medida == "265-65-r17"
        print(medida, total, [s for s, _ in autos[:6]])
        portada(medida, autos, total, pickups).save(f"public/images/blog/medida-{medida}-portada.webp", quality=88)
        figura(medida, autos, pickups).save(f"public/images/blog/medida-{medida}-autos.webp", quality=88)

main()
