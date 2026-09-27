#!/usr/bin/env node
// Genera una copia PNG de cada foto de fachada de sucursal (.webp) en
// public/images/branches, para que las og-image "genéricas" (home, medida)
// la puedan usar como fondo sin decodificar webp en tiempo de ejecución.
// Mismo motivo que generate-og-product-photos.mjs: sharp es un binario
// nativo que no puede vivir en el bundle del Worker de Cloudflare, así que
// la conversión corre acá, en un script de Node plano, antes de `next build`
// (ver "prebuild" en package.json). La salida NO se commitea.

import { readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, "..", "public", "images", "branches");
const OUT_DIR = join(__dirname, "..", "public", "og-cache", "branches");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(SRC_DIR)).filter((f) => f.toLowerCase().endsWith(".webp"));

  let n = 0;
  for (const file of files) {
    const src = join(SRC_DIR, file);
    const outName = file.replace(/\.webp$/i, ".png");
    const out = join(OUT_DIR, outName);
    // object-fit: cover a 540x630 (el panel de foto de GenericOgLayout, ver
    // src/lib/og-layout.tsx) se resuelve acá en vez de en el layout: así el
    // PNG cacheado ya viene recortado al tamaño real que se usa, en vez de
    // mandarle a satori una foto de varios MB para que la escale ella.
    await sharp(src).resize(540, 630, { fit: "cover" }).png().toFile(out);
    n++;
  }
  console.log(`[generate-og-branch-photos] ${n} fotos convertidas a PNG en public/og-cache/branches/`);
}

main().catch((err) => {
  console.error("[generate-og-branch-photos] Error:", err);
  process.exit(1);
});
