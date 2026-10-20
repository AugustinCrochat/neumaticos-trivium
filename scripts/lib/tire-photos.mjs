import sharp from "sharp";

export const SITE_URL = "https://neumaticos.trivium.ar";
export const OUTPUT_DIR = "./public/images/products";
export const SIZE = 1200;
export const PADDING = 40;

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function fetchProductos() {
  // POS_API_BASE_URL ya no lleva sucursal: el catálogo es el mismo en todas,
  // así que alcanza con la default.
  const base = process.env.POS_API_BASE_URL?.trim() || process.env.POS_API_URL;
  if (!base) throw new Error("Falta POS_API_BASE_URL (corré con node --env-file=.env.local ...)");
  const res = await fetch(`${base}/arguello/productos`);
  if (!res.ok) throw new Error(`POS respondió ${res.status}`);
  const data = await res.json();
  return data.productos;
}

// Tope de agrandamiento sobre el tamaño original: evita que una foto de baja
// resolución quede pixelada al forzarla a llenar el lienzo de 1200x1200.
const MAX_UPSCALE = 2.5;

// Normaliza cualquier foto (bajada de internet, con distinto tamaño/proporción
// y distinto margen blanco alrededor del neumático) a un cuadrado de 1200×1200
// con fondo blanco y el mismo margen parejo, para que el catálogo se vea parejo.
export async function compositeOnWhite(sourcePhoto) {
  const available = SIZE - PADDING * 2;

  // Recorta el margen propio de la foto original (blanco, gris o transparente,
  // que varía según la fuente) para partir siempre del mismo punto: el
  // neumático solo, sin borde. Sin indicar "background" sharp lo detecta solo
  // a partir del píxel de la esquina superior izquierda (funciona tanto con
  // fondo blanco como con PNGs de fondo transparente).
  const trimmed = await sharp(sourcePhoto)
    .trim({ threshold: 15 })
    .toBuffer({ resolveWithObject: true });

  const sourceMax = Math.max(trimmed.info.width, trimmed.info.height);
  const target = Math.min(available, Math.round(sourceMax * MAX_UPSCALE));
  const resized = await sharp(trimmed.data)
    .resize(target, target, { fit: "inside", withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });

  const left = PADDING + Math.floor((available - resized.info.width) / 2);
  const top = PADDING + Math.floor((available - resized.info.height) / 2);

  return sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([{ input: resized.data, left, top }])
    .webp({ quality: 85 })
    .toBuffer();
}

// Agrupa los productos del POS que matchean marca+modelo (búsqueda flexible por substring).
export function matchProducts(productos, marca, modelo) {
  const marcaLower = marca.toLowerCase();
  const modeloLower = modelo.toLowerCase();
  return productos.filter(
    (p) =>
      (p.marca || "").toLowerCase().includes(marcaLower) &&
      (p.modelo || "").toLowerCase().includes(modeloLower) &&
      p.neumatico_ancho &&
      p.neumatico_perfil &&
      p.neumatico_diametro
  );
}

// Agrupa una lista de productos matcheados por medida real (ancho-perfil-diametro).
export function groupBySize(matches) {
  const bySize = new Map();
  for (const p of matches) {
    const sizeKey = `${p.neumatico_ancho}-${p.neumatico_perfil}-${p.neumatico_diametro}`;
    if (!bySize.has(sizeKey)) bySize.set(sizeKey, []);
    bySize.get(sizeKey).push(p);
  }
  return bySize;
}
