import { PDFDocument, PDFName, PDFString, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { BRANCHES, DEFAULT_BRANCH_ID, SITE_URL } from "@/lib/config";
import { BRANDS } from "@/lib/data";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getTireLabel } from "@/lib/tire-labels";
import { getUtqg } from "@/lib/utqg";
import { LOAD_INDEX_KG, SPEED_RATING_KMH, formatSize, vehiclesUsingSize } from "@/lib/tire-sizes";

// Ficha técnica en PDF de cada neumático, para que rankee como documento y
// para que el cliente la guarde o la mande. Se genera en el build (los
// productos del POS al buildear); no lleva precio ni stock porque el PDF queda
// cacheado: apunta a la ficha web, que es la que se mantiene al día.
// Lee las imágenes con fs, así que solo puede correr en el build: nada de
// generación on-demand en el Worker (dynamicParams = false).
export const dynamic = "force-static";
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  return productos.map((p) => ({ slug: p.slug }));
}

const NAVY = rgb(0.024, 0.067, 0.122);
const RED = rgb(1, 0.118, 0);
const INK = rgb(0.06, 0.09, 0.16);
const MUTED = rgb(0.4, 0.45, 0.53);
const LINE = rgb(0.88, 0.9, 0.93);
const SOFT = rgb(0.96, 0.97, 0.98);

const W = 595.28;
const H = 841.89;
const M = 40;

// Helvetica estándar solo codifica WinAnsi: se reemplaza lo que queda afuera.
const clean = (s: string) =>
  s
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E -ÿ]/g, "");

async function readPublic(rel: string): Promise<Uint8Array | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    return new Uint8Array(await readFile(join(process.cwd(), "public", rel)));
  } catch {
    return null;
  }
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of clean(text).split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function link(page: PDFPage, doc: PDFDocument, x: number, y: number, w: number, h: number, url: string) {
  const ctx = doc.context;
  const annot = ctx.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y, x + w, y + h],
    Border: [0, 0, 0],
    A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
  });
  page.node.set(PDFName.of("Annots"), ctx.obj([...(page.node.Annots()?.asArray() ?? []), ctx.register(annot)]));
}

export async function GET(_req: Request, { params }: Props) {
  const { slug } = await params;
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const p = productos.find((x) => x.slug === slug);
  if (!p) return new Response("No encontrado", { status: 404 });

  const brand = BRANDS.find((b) => b.id === p.brandId);
  const label = getTireLabel(p.slug);
  const utqg = getUtqg(p.brandId, p.modeloBase, p.slug);
  const branch = BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID) ?? BRANCHES[0];
  const url = `${SITE_URL}/productos/${p.slug}`;
  const sizeText = formatSize(p.size);
  const tipo = p.isCarga ? "Carga (serie C)" : p.isAT ? "A/T (All Terrain)" : "H/T (Highway Terrain), de calle";
  const linea = p.modeloBase.replace(new RegExp(`^${p.brand}\\s+`, "i"), "");

  const pdf = await PDFDocument.create();
  pdf.setTitle(`Ficha técnica ${p.brand} ${linea} ${sizeText}`);
  pdf.setAuthor("Neumáticos Trivium");
  pdf.setSubject(`Ficha técnica del neumático ${p.brand} ${linea} ${sizeText}`);
  pdf.setKeywords([p.brand, linea, sizeText, "neumático", "ficha técnica"]);
  pdf.setCreator("Neumáticos Trivium");
  let page = pdf.addPage([W, H]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const text = (s: string, x: number, y: number, size: number, opts: { font?: PDFFont; color?: ReturnType<typeof rgb> } = {}) =>
    page.drawText(clean(s), { x, y, size, font: opts.font ?? regular, color: opts.color ?? INK });

  const header = async () => {
  page.drawRectangle({ x: 0, y: H - 86, width: W, height: 86, color: NAVY });
  page.drawRectangle({ x: 0, y: H - 90, width: W, height: 4, color: RED });
  const logoBytes = await readPublic("images/brand/logo-trivium-pdf.png");
  if (logoBytes) {
    const logo = await pdf.embedPng(logoBytes);
    const lh = 54;
    page.drawImage(logo, { x: M, y: H - 70, width: lh * (logo.width / logo.height), height: lh });
  }
  const tag = "FICHA TECNICA";
  text(tag, W - M - bold.widthOfTextAtSize(tag, 16), H - 50, 16, { font: bold, color: rgb(1, 1, 1) });

  };
  await header();

  const footer = () => {
  // Garantía y pie.
  const gy = 150;
  page.drawRectangle({ x: M, y: gy - 6, width: W - 2 * M, height: 52, color: rgb(1, 0.95, 0.9), borderColor: rgb(0.96, 0.62, 0.04), borderWidth: 1 });
  text("Garantía de 1 año por defecto de fabricación", M + 12, gy + 28, 10.5, { font: bold });
  const g = wrap("No cubre desgaste por uso, pinchaduras, cortes ni daños por golpes, baches o falta de alineación. Se gestiona en el local con la factura de compra.", regular, 8.5, W - 2 * M - 24);
  g.forEach((l, i) => text(l, M + 12, gy + 14 - i * 10.5, 8.5, { color: MUTED }));

  // Botón a la ficha principal (con precio y stock al día).
  const bw = W - 2 * M;
  page.drawRectangle({ x: M, y: 84, width: bw, height: 44, color: RED });
  const cta = "Ver precio, stock y comprar en la web";
  text(cta, M + (bw - bold.widthOfTextAtSize(cta, 13)) / 2, 108, 13, { font: bold, color: rgb(1, 1, 1) });
  const u = url.replace("https://", "");
  text(u, M + (bw - regular.widthOfTextAtSize(u, 8.5)) / 2, 93, 8.5, { color: rgb(1, 0.9, 0.88) });
  link(page, pdf, M, 84, bw, 44, url);

  page.drawLine({ start: { x: M, y: 70 }, end: { x: W - M, y: 70 }, thickness: 0.8, color: LINE });
  text(`${branch.name} - ${branch.address}, ${branch.city}`, M, 56, 8.5, { color: MUTED });
  text(`WhatsApp ${branch.phone ?? ""} - ${SITE_URL.replace("https://", "")}`, M, 44, 8.5, { color: MUTED });
  text("Datos del fabricante. Los precios y el stock vigentes figuran en la ficha web.", M, 32, 8, { color: MUTED });

  };

  // Título.
  let y = H - 128;
  text(p.brand.toUpperCase(), M, y, 11, { font: bold, color: RED });
  y -= 28;
  const titleLines = wrap(linea, bold, 24, W - 2 * M);
  for (const l of titleLines.slice(0, 2)) {
    text(l, M, y, 24, { font: bold });
    y -= 28;
  }
  text(`Neumático ${sizeText}${p.loadIndex ? ` ${p.loadIndex}${p.loadIndexDual ? `/${p.loadIndexDual}` : ""}${p.speedRating ?? ""}` : ""}`, M, y, 14, { color: MUTED });
  y -= 24;

  // Foto del producto (JPEG del prebuild) a la izquierda.
  const m = p.imageUrl.match(/\/images\/products\/([^/?#]+)\.webp$/i);
  const photoBytes = m ? await readPublic(`og-cache/share/products/${m[1]}.jpg`) : null;
  const boxTop = y;
  const boxW = 215;
  const boxH = 215;
  page.drawRectangle({ x: M, y: boxTop - boxH, width: boxW, height: boxH, color: rgb(1, 1, 1), borderColor: LINE, borderWidth: 1 });
  if (photoBytes) {
    const img: PDFImage = await pdf.embedJpg(photoBytes);
    const s = Math.min((boxW - 16) / img.width, (boxH - 16) / img.height);
    page.drawImage(img, { x: M + (boxW - img.width * s) / 2, y: boxTop - boxH + (boxH - img.height * s) / 2, width: img.width * s, height: img.height * s });
  }

  // Datos clave a la derecha de la foto.
  const section = (title: string, x: number, yy: number, w: number) => {
    text(title.toUpperCase(), x, yy, 9.5, { font: bold, color: RED });
    page.drawLine({ start: { x, y: yy - 5 }, end: { x: x + w, y: yy - 5 }, thickness: 0.8, color: LINE });
    return yy - 20;
  };
  const rows = (items: [string, string][], x: number, yy: number, w: number) => {
    items.forEach(([k, v], i) => {
      if (i % 2 === 0) page.drawRectangle({ x, y: yy - 5, width: w, height: 19, color: SOFT });
      text(k, x + 8, yy, 9.5, { color: MUTED });
      text(v, x + w - 8 - bold.widthOfTextAtSize(clean(v), 9.5), yy, 9.5, { font: bold });
      yy -= 19;
    });
    return yy;
  };

  const rx = M + boxW + 24;
  const rw = W - M - rx;
  const diaRodado = p.size.rim * 25.4;
  const flanco = (p.size.width * p.size.profile) / 100;
  const diaTotal = diaRodado + 2 * flanco;
  const circ = Math.PI * diaTotal;
  const kg = p.loadIndex ? LOAD_INDEX_KG[p.loadIndex] : undefined;
  const kgDual = p.loadIndexDual ? LOAD_INDEX_KG[p.loadIndexDual] : undefined;
  const kmh = p.speedRating ? SPEED_RATING_KMH[p.speedRating] : undefined;

  let ry = section("Identificación", rx, boxTop - 8, rw);
  ry = rows(
    [
      ["Marca", p.brand],
      ["Línea", linea],
      ["Medida", sizeText],
      ["Tipo", tipo],
      ...(brand?.origin ? ([["Origen de la marca", brand.origin]] as [string, string][]) : []),
      ["Garantía", "1 año"],
    ],
    rx,
    ry,
    rw,
  );

  ry -= 8;
  ry = section("Capacidades", rx, ry, rw);
  ry = rows(
    [
      ...(p.loadIndex ? ([[p.loadIndexDual ? "Carga por rueda (simple)" : "Carga por rueda", `${p.loadIndex}${kg ? ` (${kg} kg)` : ""}`]] as [string, string][]) : []),
      ...(p.loadIndexDual ? ([["Carga por rueda (dual)", `${p.loadIndexDual}${kgDual ? ` (${kgDual} kg)` : ""}`]] as [string, string][]) : []),
      ...(p.speedRating ? ([["Velocidad máxima", `${p.speedRating}${kmh ? ` (${kmh} km/h)` : ""}`]] as [string, string][]) : []),
    ],
    rx,
    ry,
    rw,
  );

  // Medidas físicas (bajo la foto o bajo los datos, lo que quede más abajo).
  y = Math.min(boxTop - boxH, ry) - 26;
  const colW = (W - 2 * M - 24) / 2;
  let ly = section("Dimensiones", M, y, colW);
  ly = rows(
    [
      ["Ancho de sección", `${p.size.width} mm`],
      ["Perfil (alto / ancho)", `${p.size.profile}%`],
      ["Altura de flanco", `${flanco.toFixed(0)} mm`],
      ["Rodado (llanta)", `${p.size.rim}" (${diaRodado.toFixed(0)} mm)`],
      ["Diámetro total", `${diaTotal.toFixed(0)} mm`],
      ["Circunferencia de rodadura", `${circ.toFixed(0)} mm`],
      ["Vueltas por kilómetro", `${(1_000_000 / circ).toFixed(0)}`],
    ],
    M,
    ly,
    colW,
  );

  // Etiqueta UE / UTQG en la columna derecha.
  const cx = M + colW + 24;
  let cy = section("Etiqueta europea y UTQG", cx, y, colW);
  const comp: [string, string][] = [];
  if (label) {
    comp.push(["Eficiencia de combustible", `Clase ${label.energyClass}`], ["Frenado en mojado", `Clase ${label.wetGripClass}`], ["Ruido externo", `${label.noiseDb} dB (Clase ${label.noiseClass})`]);
  }
  if (utqg) comp.push(["UTQG (norma EE. UU.)", `${utqg.treadwear} ${utqg.traction} ${utqg.temperature}`]);
  if (!comp.length) comp.push(["Etiqueta europea / UTQG", "No declarados"]);
  cy = rows(comp, cx, cy, colW);
  if (utqg) {
    cy -= 2;
    for (const l of wrap(`UTQG ${utqg.treadwear} ${utqg.traction} ${utqg.temperature}: desgaste relativo ${utqg.treadwear}, traccion ${utqg.traction} y temperatura ${utqg.temperature}. Norma de EE. UU., distinta de la etiqueta europea.`, regular, 8.5, colW)) {
      text(l, cx, cy, 8.5, { color: MUTED });
      cy -= 11;
    }
  }
  footer();

  // Página 2: etiqueta europea ampliada, cómo leerla y vehículos compatibles.
  const vehiculos = [...new Set(vehiclesUsingSize(p.size).map((v) => `${v.brand} ${v.model}`))].slice(0, 60);
  const labelBytes = label ? await readPublic(`images/eu-labels/${p.slug}.png`) : null;
  if (labelBytes || vehiculos.length) {
    page = pdf.addPage([W, H]);
    await header();
    let y2 = H - 128;
    text(`${p.brand} ${linea} ${sizeText}`, M, y2, 14, { font: bold });
    y2 -= 30;
    if (labelBytes && label) {
      const li = await pdf.embedPng(labelBytes);
      const lw = 200;
      const lh = lw * (li.height / li.width);
      const lx = M;
      const lw2 = W - 2 * M - lw - 24;
      section("Etiqueta europea", M, y2, W - 2 * M);
      y2 -= 16;
      page.drawImage(li, { x: lx, y: y2 - lh, width: lw, height: lh });
      let ty = y2 - 8;
      const notes: [string, string][] = [
        ["Eficiencia de combustible", `Clase ${label.energyClass}: de A (la mejor) a E. Menos resistencia a la rodadura, menos consumo.`],
        ["Frenado en mojado", `Clase ${label.wetGripClass}: de A (la mejor) a E. Mide la distancia de frenado sobre pavimento mojado.`],
        ["Ruido externo", `${label.noiseDb} dB, clase ${label.noiseClass}: de A (el más silencioso) a C.`],
        ["Registro EPREL", `Número ${label.eprelId}, consultable en eprel.ec.europa.eu.`],
      ];
      for (const [k, v] of notes) {
        text(k, lx + lw + 24, ty, 10, { font: bold });
        ty -= 13;
        for (const l of wrap(v, regular, 9.5, lw2)) {
          text(l, lx + lw + 24, ty, 9.5, { color: MUTED });
          ty -= 12;
        }
        ty -= 8;
      }
      y2 = Math.min(y2 - lh, ty) - 28;
    }
    if (vehiculos.length) {
      y2 = section(`Vehículos que usan ${sizeText} de fábrica`, M, y2, W - 2 * M);
      for (const l of wrap(vehiculos.join("  ·  "), regular, 9.5, W - 2 * M).slice(0, 14)) {
        text(l, M, y2, 9.5);
        y2 -= 13;
      }
      y2 -= 4;
      for (const l of wrap("Según la medida original de cada modelo en alguna de sus versiones. Confirmá la medida de tu auto en el flanco del neumático o en la calcomanía de la puerta.", regular, 8.5, W - 2 * M)) {
        text(l, M, y2, 8.5, { color: MUTED });
        y2 -= 11;
      }
    }
    footer();
  }

  const bytes = await pdf.save();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="ficha-tecnica-${p.slug}.pdf"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
