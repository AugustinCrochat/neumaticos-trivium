#!/usr/bin/env node
/**
 * Genera, para cada foto de producto con UNA sola cubierta, un primer plano de
 * la banda de rodamiento (el dibujo) en public/images/products-tread/, con el
 * mismo nombre de archivo. Se usa como segunda imagen en el feed de Merchant
 * Center y en la galería del producto.
 *
 * Detecta la cubierta por contraste con el fondo blanco y recorta el costado
 * de la banda (en estas fotos la cubierta está a la izquierda y la llanta a la
 * derecha). Se saltean los packs (varias cubiertas), las fotos muy chicas y
 * las que no son webp/jpg/png.
 *
 * Uso: node scripts/generate-tread-closeups.mjs [--dry] [--list]
 */
import { mkdirSync, readdirSync, writeFileSync } from "fs";
import path from "path";
import sharp from "sharp";

const SRC = "public/images/products";
const OUT = "public/images/products-tread";
const SIZE = 1200;
const dry = process.argv.includes("--dry");

mkdirSync(OUT, { recursive: true });
const skipped = [];
const generated = [];
let done = 0;

for (const file of readdirSync(SRC)) {
  if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
  const img = sharp(path.join(SRC, file));
  const meta = await img.metadata();
  if (!meta.width || !meta.height || meta.width < 600) { skipped.push([file, "chica"]); continue; }

  // Mascara de "no blanco" para hallar la caja de la cubierta.
  const { data, info } = await img.clone().flatten({ background: "#fff" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const colHas = new Uint32Array(w);
  const rowHas = new Uint32Array(h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[y * w + x] < 235) { colHas[x]++; rowHas[y]++; }
  const minC = Math.max(3, h * 0.01), minR = Math.max(3, w * 0.01);
  let x0 = 0, x1 = w - 1, y0 = 0, y1 = h - 1;
  while (x0 < w && colHas[x0] < minC) x0++;
  while (x1 > x0 && colHas[x1] < minC) x1--;
  while (y0 < h && rowHas[y0] < minR) y0++;
  while (y1 > y0 && rowHas[y1] < minR) y1--;
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1;

  // Una sola cubierta ocupa buena parte del alto y es más alta que ancha o casi cuadrada.
  if (bh < h * 0.6 || bw / bh > 1.05 || bw / bh < 0.45) { skipped.push([file, `caja ${bw}x${bh}`]); continue; }
  // Packs: un hueco vertical vacío en el medio de la caja.
  let gap = false;
  for (let x = x0 + Math.floor(bw * 0.3); x < x1 - bw * 0.3; x++) if (colHas[x] < minC) { gap = true; break; }
  if (gap) { skipped.push([file, "pack"]); continue; }

  // Costado de la banda: tercio-medio izquierdo de la cubierta, tramo central del alto.
  const side = Math.min(Math.round(Math.min(bh * 0.5, bw * 0.4)), w, h);
  const left = Math.max(0, Math.min(w - side, Math.round(x0 + bw * 0.03)));
  const top = Math.max(0, Math.min(h - side, Math.round(y0 + (bh - side) / 2)));
  if (!dry) {
    await sharp(path.join(SRC, file))
      .flatten({ background: "#fff" })
      .extract({ left, top, width: Math.round(side), height: Math.round(side) })
      .resize(SIZE, SIZE)
      .webp({ quality: 85 })
      .toFile(path.join(OUT, file.replace(/\.[^.]+$/, ".webp")));
  }
  generated.push(file.replace(/\.[^.]+$/, ""));
  done++;
}
if (!dry) writeFileSync("src/lib/tread-closeups.json", JSON.stringify(generated.sort(), null, 1) + "\n");
console.log(`generadas: ${done}, salteadas: ${skipped.length}`);
if (process.argv.includes("--list")) console.log(skipped.map((s) => s.join("  ")).join("\n"));
