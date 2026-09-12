#!/usr/bin/env node
// Genera una copia PNG de cada foto de producto (.webp) en public/images/products,
// para que /productos/[slug]/opengraph-image.tsx las pueda leer sin decodificar
// webp en tiempo de ejecución.
//
// Por qué existe este script en vez de convertir adentro de la ruta: sharp es
// un binario nativo de Node, y ImageResponse/next-og NO sabe decodificar webp
// por su cuenta (se rompe con "u2 is not iterable"). Probamos importar sharp
// directo en opengraph-image.tsx y, aunque esa ruta queda 100% prerenderizada
// en build time, Next igual empaqueta su código en el bundle compartido del
// server — y ese bundle es justamente lo que después arma
// `opennextjs-cloudflare build` para el Worker de Cloudflare, donde sharp no
// puede resolverse (no hay filesystem/binarios nativos). Con sharp corriendo
// acá, en un script aparte de Node plano, nunca toca ese bundle.
//
// Se ejecuta antes de `next build` (ver "prebuild" en package.json y el paso
// del workflow de deploy). La salida NO se commitea: se regenera en cada
// build a partir de los .webp que sí están en git.

import { readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, "..", "public", "images", "products");
const OUT_DIR = join(__dirname, "..", "public", "og-cache", "products");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(SRC_DIR)).filter((f) => f.toLowerCase().endsWith(".webp"));

  let n = 0;
  for (const file of files) {
    const src = join(SRC_DIR, file);
    const outName = file.replace(/\.webp$/i, ".png");
    const out = join(OUT_DIR, outName);
    await sharp(src).png().toFile(out);
    n++;
  }
  console.log(`[generate-og-product-photos] ${n} fotos convertidas a PNG en public/og-cache/products/`);
}

main().catch((err) => {
  console.error("[generate-og-product-photos] Error:", err);
  process.exit(1);
});
