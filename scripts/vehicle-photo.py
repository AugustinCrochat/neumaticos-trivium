#!/usr/bin/env python3
"""
Foto de un auto para las fichas de /vehiculos: de una URL o archivo a
public/images/vehiculos/<slug>.webp (sin fondo, mirando a la izquierda, lienzo
fijo 1000x560 con superficie parecida entre modelos) + su tarjeta de 1200x630
para compartir (public/images/vehiculos/share/<slug>.jpg) + alta en la lista de
src/lib/vehicle-photos.ts.

Uso (desde la raíz del repo):
  python scripts/vehicle-photo.py <slug> <url|archivo> [--flip] [--keep-alpha]
  python scripts/vehicle-photo.py --cards            # regenera todas las tarjetas
  python scripts/vehicle-photo.py --fix-plate <slug> x0,y0,x1,y1 [--dark] [--blank]  # patente de una foto ya espejada

  --flip        la foto mira a la derecha: se da vuelta. Con --blank en vez de espejar el texto lo borra. Si tiene patente o chapa
                con texto, agregar --plate=x0,y0,x1,y1 (caja aproximada en el lienzo
                1000x560) para que el texto quede legible y no espejado
                (--dark si es texto claro sobre chapa oscura).
  --keep-alpha  la imagen ya trae fondo transparente (PNG): no pasa por rembg.

Requiere: pip install "rembg[cpu]" pillow numpy scipy
Después de cambiar una foto hay que regenerar lo que la usa fuera de la ficha
(portadas de blog con autos): ver scripts/vehicle-photo.md.
"""
import io, os, re, sys, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageOps

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIR = os.path.join(ROOT, "public/images/vehiculos")
CARDS = os.path.join(DIR, "share")
LIST = os.path.join(ROOT, "src/lib/vehicle-photos.ts")
LOGO = os.path.join(ROOT, "public/images/brand/logo-trivium-pdf.png")
CW, CH = 1000, 560
AREA = 0.38 * CW * CH


def load(src):
    if re.match(r"https?://", src):
        req = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"})
        return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=60).read()))
    return Image.open(src)


def fix_text(im, rough, inverse=False):
    """Vuelve a dar vuelta el texto de una patente/chapa espejada por --flip. `rough`
    es una caja aproximada (x0,y0,x1,y1) en el lienzo de 1000x560 que contiene el
    texto; dentro de ella se toman sólo los píxeles de texto (oscuros rodeados de
    fondo claro; con inverse=True, claros sobre chapa oscura) y se espeja esa región
    ajustada, para no dejar cortes en el paragolpes. Devuelve (imagen, caja)."""
    from scipy.ndimage import uniform_filter
    g = np.asarray(im.convert("L")).astype(float)
    a = np.asarray(im.getchannel("A")) > 200
    fondo = (g < 110) if inverse else (g > 150)
    dens = uniform_filter(fondo.astype(float), size=7)
    texto = ((g > 150) if inverse else (g < 115)) & a & (dens > 0.25)
    x0, y0, x1, y1 = rough
    sub = texto[y0:y1, x0:x1]
    ys, xs = np.where(sub)
    if len(ys) < 15:
        return im, None
    box = (int(x0 + xs.min() - 1), int(y0 + ys.min() - 1), int(x0 + xs.max() + 2), int(y0 + ys.max() + 2))
    im.paste(ImageOps.mirror(im.crop(box)), box[:2])
    return im, box


def blank_text(im, rough, inverse=False):
    """Borra el texto de una patente/chapa (la deja lisa, del color del fondo de la
    chapa), para las que no se pueden espejar sin que se vea mal. Misma `rough` que fix_text."""
    from scipy.ndimage import uniform_filter, binary_dilation
    g = np.asarray(im.convert("L")).astype(float)
    a = np.asarray(im.getchannel("A")) > 200
    fondo = (g < 110) if inverse else (g > 150)
    dens = uniform_filter(fondo.astype(float), size=7)
    texto = ((g > 150) if inverse else (g < 115)) & a & (dens > 0.25)
    x0, y0, x1, y1 = rough
    reg = np.zeros_like(texto)
    reg[y0:y1, x0:x1] = True
    texto &= reg
    if texto.sum() < 15:
        return im, None
    texto = binary_dilation(texto, iterations=1) & a
    base = fondo & a & reg & ~texto
    if base.sum() < 20:
        return im, None
    arr = np.asarray(im).copy()
    arr[texto, :3] = np.median(arr[base][:, :3], axis=0).astype(np.uint8)
    ys, xs = np.where(texto)
    return Image.fromarray(arr, "RGBA"), (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))


def normalize(cut, flip):
    cut = cut.convert("RGBA")
    cut = cut.crop(cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    if flip:
        cut = ImageOps.mirror(cut)
    w, h = cut.size
    s = min((AREA / (w * h)) ** 0.5, 940 / w, 520 / h, 1.6)
    cut = cut.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    c = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    c.paste(cut, ((CW - cut.width) // 2, CH - 14 - cut.height), cut)
    return c


def card(slug):
    car = Image.open(os.path.join(DIR, slug + ".webp")).convert("RGBA")
    logo = Image.open(LOGO).convert("RGBA")
    logo.thumbnail((230, 80))
    bg = Image.new("RGB", (1200, 630), (0, 0, 0))
    bg.paste(car, (60, 20), car)
    bg.paste(logo, (1200 - logo.width - 36, 630 - logo.height - 24), logo)
    ImageDraw.Draw(bg).rectangle((0, 620, 1200, 630), fill=(255, 30, 0))
    os.makedirs(CARDS, exist_ok=True)
    bg.save(os.path.join(CARDS, slug + ".jpg"), quality=84, optimize=True)


def update_list():
    slugs = sorted(f[:-5] for f in os.listdir(DIR) if f.endswith(".webp"))
    s = open(LIST).read()
    body = "new Set([\n" + "".join(f'  "{x}",\n' for x in slugs) + "] as const)"
    s = re.sub(r"new Set\(\[.*?\] as const\)", body, s, flags=re.S)
    open(LIST, "w").write(s)
    return len(slugs)


def main(argv):
    if argv[:1] == ["--cards"]:
        for f in sorted(os.listdir(DIR)):
            if f.endswith(".webp"):
                card(f[:-5])
        print("tarjetas regeneradas")
        return
    if argv[:1] == ["--fix-plate"]:
        slug, rough = argv[1], tuple(int(v) for v in argv[2].split(","))
        p = os.path.join(DIR, slug + ".webp")
        im, box = (blank_text if "--blank" in argv else fix_text)(Image.open(p).convert("RGBA"), rough, "--dark" in argv)
        print(slug, "texto:", box)
        if box:
            im.save(p, "WEBP", quality=86, method=6)
            card(slug)
        return
    flip, keep = "--flip" in argv, "--keep-alpha" in argv
    plate = next((a.split("=", 1)[1] for a in argv if a.startswith("--plate=")), None)
    args = [a for a in argv if not a.startswith("--")]
    if len(args) != 2:
        sys.exit(__doc__)
    slug, src = args
    im = load(src)
    if keep and im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 10:
        cut = im
    else:
        from rembg import remove, new_session
        cut = remove(im.convert("RGB"), session=new_session("isnet-general-use"))
    if flip:
        # primero se normaliza dado vuelta y después se arregla la patente en el lienzo final
        out = normalize(cut, True)
        if plate:
            out, box = (blank_text if "--blank" in argv else fix_text)(out, tuple(int(v) for v in plate.split(",")), "--dark" in argv)
            print("texto de patente:", box)
    else:
        out = normalize(cut, False)
    out.save(os.path.join(DIR, slug + ".webp"), "WEBP", quality=86, method=6)
    card(slug)
    print(slug, "listo;", update_list(), "fotos en la lista")


if __name__ == "__main__":
    main(sys.argv[1:])
