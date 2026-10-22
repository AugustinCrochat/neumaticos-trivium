#!/usr/bin/env node
// Genera las imágenes que se ven al compartir un link (WhatsApp, Facebook, X):
// JPEG livianos a partir de las fotos .webp del repo, en public/og-cache/share/.
//
// JPEG y no el .webp original: WhatsApp descarta las miniaturas pesadas (en la
// práctica por encima de ~300 KB) y no todas las redes decodifican webp.
// La salida NO se commitea; se regenera en cada build (ver "prebuild").
//
// - products/<archivo>.jpg: la foto del neumático tal cual, sin recortar.
// - site/<carpeta>/<archivo>.jpg: fotos del local y el taller en 1200x630, para
//   notas del blog y páginas sin foto propia.

import { readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = join(ROOT, "public", "images");
const OUT = join(ROOT, "public", "og-cache", "share");

async function convert(srcDir, outDir, pipeline) {
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(srcDir)).filter((f) => f.toLowerCase().endsWith(".webp"));
  for (const f of files) {
    await pipeline(sharp(join(srcDir, f))).toFile(join(outDir, f.replace(/\.webp$/i, ".jpg")));
  }
  return files.length;
}

const product = (img) =>
  img.flatten({ background: "#ffffff" }).resize(1000, 1000, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true });
const site = (img) =>
  img.resize(1200, 630, { fit: "cover", position: sharp.strategy.attention }).jpeg({ quality: 80, mozjpeg: true });

async function main() {
  const p = await convert(join(IMAGES, "products"), join(OUT, "products"), product);
  let s = 0;
  for (const dir of ["local", "blog", "servicios", "branches"]) {
    s += await convert(join(IMAGES, dir), join(OUT, "site", dir), site);
  }
  console.log(`[generate-og-share-images] ${p} fotos de producto y ${s} del local en public/og-cache/share/`);
}

main().catch((err) => {
  console.error("[generate-og-share-images] Error:", err);
  process.exit(1);
});
