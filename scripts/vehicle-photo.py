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
  --trivium-plate <slug> x0,y0,x1,y1,x2,y2,x3,y3   # pone una patente Trivium (negra, con el logo) sobre la de la foto; esquinas
                en el lienzo 1000x560, en orden sup-izq, sup-der, inf-der, inf-izq (sigue la perspectiva del auto)

  --keep-alpha  la imagen ya trae fondo transparente (PNG): no pasa por rembg.

Requiere: pip install "rembg[cpu]" pillow numpy scipy
Después de cambiar una foto hay que regenerar lo que la usa fuera de la ficha
(portadas de blog con autos): ver scripts/vehicle-photo.md.
"""
import functools, io, os, re, sys, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

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


def trivium_plate(slug, corners):
    """Tapa la patente de la foto con una patente Trivium: chapa negra con borde
    blanco y el logo. `corners` son las 4 esquinas de la patente en el lienzo
    1000x560 (sup-izq, sup-der, inf-der, inf-izq); la chapa se deforma con
    perspectiva para acompañar el ángulo del auto."""
    PW, PH, K = 400, 130, 4
    plate = Image.new("RGBA", (PW, PH), (0, 0, 0, 0))
    d = ImageDraw.Draw(plate)
    d.rounded_rectangle((0, 0, PW - 1, PH - 1), 12, fill=(235, 235, 235, 255))
    d.rounded_rectangle((5, 5, PW - 6, PH - 6), 9, fill=(10, 10, 12, 255))
    logo = Image.open(LOGO).convert("RGBA")
    logo = logo.crop(logo.getbbox())
    logo.thumbnail((PW - 56, PH - 34), Image.LANCZOS)
    plate.paste(logo, ((PW - logo.width) // 2, (PH - logo.height) // 2), logo)
    # coeficientes de la perspectiva destino -> origen (ampliado K veces para suavizar bordes)
    dst = [(x * K, y * K) for x, y in zip(corners[0::2], corners[1::2])]
    src = [(0, 0), (PW, 0), (PW, PH), (0, PH)]
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        b += [u, v]
    coef = np.linalg.solve(np.array(A, float), np.array(b, float))
    layer = plate.transform((CW * K, CH * K), Image.PERSPECTIVE, tuple(coef), Image.BICUBIC)
    layer = layer.resize((CW, CH), Image.LANCZOS)
    p = os.path.join(DIR, slug + ".webp")
    car = Image.open(p).convert("RGBA")
    car.alpha_composite(layer)
    car.save(p, "WEBP", quality=86, method=6)
    card(slug)


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


VEHICLES_TS = os.path.join(ROOT, "src/lib/vehicles.ts")
PRODUCTS = os.path.join(ROOT, "public/images/products")
FONTS = "/usr/share/fonts/truetype/noto/NotoSans-Condensed{}.ttf"
RED = (255, 30, 0)


@functools.lru_cache(maxsize=None)
def vehicle_sizes():
    """slug -> medidas únicas ("175/70 R14") en el orden de VEHICLE_DB; la primera es la principal."""
    out = {}
    src = open(VEHICLES_TS).read()
    for brand, model, body in re.findall(r'\{ brand: "([^"]+)", model: "([^"]+)", sizes: \[(.*?)\] \}', src):
        slug = re.sub(r"(^-|-$)+", "", re.sub(r"[^a-z0-9]+", "-", f"{brand} {model}".lower()))
        sizes = []
        for w, pr, r in re.findall(r'w: "(\d+)", p: "(\d+)", r: "(\d+)"', body):
            if (w, pr, r) not in sizes:
                sizes.append((w, pr, r))
        out[slug] = (f"{brand} {model}", sizes)
    return out


def pirelli_photo(size):
    """Foto de un Pirelli de la medida o, si no hay, el de rodado y ancho más cercanos (Trivium no trabaja otras marcas en estas fotos)."""
    found = []
    for f in sorted(os.listdir(PRODUCTS)):
        m = re.search(r"(\d{3})-?(\d{2})-?z?r(\d{2})", f) if "pirelli" in f else None
        if m:
            found.append((tuple(m.groups()), f))
    if not found:
        return None
    w, pr, r = (int(v) for v in size) if size else (185, 65, 15)
    best = min(found, key=lambda x: (x[0] != tuple(str(v) for v in (w, pr, r)), abs(int(x[0][2]) - r), abs(int(x[0][0]) - w), x[1]))
    return os.path.join(PRODUCTS, best[1])


def cutout_white(path):
    """Neumático sin su fondo blanco (relleno desde la esquina, así no se pierde el blanco de la llanta)."""
    t = Image.open(path).convert("RGB")
    m = Image.fromarray(((np.asarray(t).min(axis=2) > 236) * 255).astype("uint8")).copy()
    ImageDraw.floodfill(m, (0, 0), 100, thresh=0)
    a = Image.fromarray(((np.asarray(m) != 100) * 255).astype("uint8")).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    t = t.convert("RGBA")
    t.putalpha(a)
    return t.crop(t.getchannel("A").getbbox())


def fit_font(kind, text, size, max_w, min_size=34):
    while True:
        f = ImageFont.truetype(FONTS.format(kind), size)
        if f.getlength(text) <= max_w or size <= min_size:
            return f
        size -= 2


def card(slug):
    """Tarjeta 1200x630 de la ficha (miniatura en Google y al compartir): fondo blanco, el nombre, la medida
    principal en grande, las otras medidas en una lista chica, el auto y un neumático pegado a su parte trasera."""
    name, sizes = vehicle_sizes().get(slug, (slug.replace("-", " ").title(), []))
    fmt = lambda s: f"{s[0]}/{s[1]} R{s[2]}"
    out = Image.new("RGB", (1200, 630), (255, 255, 255))
    d = ImageDraw.Draw(out)

    car = Image.open(os.path.join(DIR, slug + ".webp")).convert("RGBA")
    car = car.crop(car.getchannel("A").getbbox())
    k = min(760 / car.width, 420 / car.height)
    car = car.resize((round(car.width * k), round(car.height * k)), Image.LANCZOS)
    cx, cy = 1200 - car.width - 20, 600 - car.height
    out.paste(car, (cx, cy), car)
    photo = pirelli_photo(sizes[0] if sizes else None)
    if photo:
        t = cutout_white(photo)
        t = t.resize((round(t.width * 300 / t.height), 300), Image.LANCZOS)
        out.paste(t, (cx + car.width - t.width + 10, 612 - t.height), t)

    d.text((40, 24), "NEUMÁTICOS PARA", font=fit_font("ExtraBold", "NEUMÁTICOS PARA", 54, 620), fill=(90, 90, 90))
    d.text((40, 76), name.upper(), font=fit_font("Black", name.upper(), 66, 620), fill=(0, 0, 0))
    if sizes:
        d.text((40, 150), fmt(sizes[0]), font=fit_font("Black", fmt(sizes[0]), 112, 560), fill=RED)
    if len(sizes) > 1:
        d.text((40, 282), "TAMBIÉN LLEVA", font=ImageFont.truetype(FONTS.format("Bold"), 24), fill=(110, 110, 110))
        for i, s in enumerate(sizes[1:4]):
            d.text((40, 312 + i * 38), "• " + fmt(s), font=ImageFont.truetype(FONTS.format("Bold"), 30), fill=(40, 40, 40))

    logo = Image.open(LOGO).convert("RGBA")
    logo = logo.crop(logo.getbbox())
    logo.thumbnail((190, 56))
    plate = Image.new("RGB", (210, 70), (0, 0, 0))
    plate.paste(logo, ((210 - logo.width) // 2, (70 - logo.height) // 2), logo)
    out.paste(plate, (30, 536))
    d.rectangle((0, 620, 1200, 630), fill=RED)
    os.makedirs(CARDS, exist_ok=True)
    out.save(os.path.join(CARDS, slug + ".jpg"), quality=84, optimize=True)


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
    if argv[:1] == ["--trivium-plate"]:
        trivium_plate(argv[1], [int(v) for v in argv[2].split(",")])
        print(argv[1], "patente Trivium lista")
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
