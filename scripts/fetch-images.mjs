#!/usr/bin/env node
/**
 * Busca imágenes de producto via Serper (Google Images) y actualiza data.ts.
 * Uso: SERPER_API_KEY=xxx node scripts/fetch-images.mjs
 *
 * Para packs x2 o x4 busca imágenes de pack para que ya muestren la cantidad correcta.
 * Rate limit: ~100ms entre requests (Serper free: 2500 req/mes).
 */

import { readFileSync, writeFileSync } from "fs";
import { setTimeout as sleep } from "timers/promises";

const SERPER_KEY = process.env.SERPER_API_KEY;
if (!SERPER_KEY) {
  console.error("Error: falta SERPER_API_KEY");
  console.error("Uso: SERPER_API_KEY=tu_clave node scripts/fetch-images.mjs");
  process.exit(1);
}

const DATA_PATH = "./src/lib/data.ts";
let text = readFileSync(DATA_PATH, "utf-8");

// Extraer productos del archivo TS con regex
function parseProducts(src) {
  const products = [];
  const idRegex = /id:\s*"(\d[^"]+)"/g;
  let m;
  while ((m = idRegex.exec(src)) !== null) {
    const id = m[1];
    // Leer hasta ~800 chars para capturar todos los campos del producto
    const section = src.slice(m.index, m.index + 800);

    const brand = section.match(/brand:\s*"([^"]+)"/)?.[1];
    const width = section.match(/width:\s*(\d+)/)?.[1];
    const profile = section.match(/profile:\s*(\d+)/)?.[1];
    const rim = section.match(/rim:\s*(\d+)/)?.[1];
    const tagsStr = section.match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? "";
    const tags = tagsStr
      .split(",")
      .map((t) => t.replace(/"/g, "").trim())
      .filter(Boolean);

    if (brand && width && profile && rim) {
      products.push({
        id,
        brand,
        width: Number(width),
        profile: Number(profile),
        rim: Number(rim),
        tags,
      });
    }
  }
  return products;
}

function getPackQty(tags) {
  for (const tag of tags) {
    const m = tag.match(/pack\s*x(\d+)/i);
    if (m) return parseInt(m[1]);
  }
  return 1;
}

async function searchImage(query) {
  const res = await fetch("https://google.serper.dev/images", {
    method: "POST",
    headers: {
      "X-API-KEY": SERPER_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 5, gl: "ar", hl: "es" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Serper ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();

  // Intentar encontrar una imagen que no sea SVG ni icono pequeño
  const images = data.images ?? [];
  for (const img of images) {
    const url = img.imageUrl ?? "";
    if (url && !url.endsWith(".svg") && (img.imageWidth ?? 0) >= 100) {
      return url;
    }
  }
  return images[0]?.imageUrl ?? null;
}

function replaceImageUrl(src, productId, newUrl) {
  const escaped = productId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idMatch = new RegExp(`id:\\s*"${escaped}"`).exec(src);
  if (!idMatch) return src;

  // Buscar imageUrl dentro de los próximos ~900 chars del producto
  const searchSection = src.slice(idMatch.index, idMatch.index + 900);
  const imageUrlMatch = /imageUrl:\s*\n?\s*"[^"]*"/.exec(searchSection);
  if (!imageUrlMatch) return src;

  const absStart = idMatch.index + imageUrlMatch.index;
  const absEnd = absStart + imageUrlMatch[0].length;

  return (
    src.slice(0, absStart) +
    `imageUrl:\n      "${newUrl}"` +
    src.slice(absEnd)
  );
}

async function main() {
  const products = parseProducts(text);
  console.log(`Productos encontrados: ${products.length}\n`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const qty = getPackQty(p.tags);

    // Siempre buscar imagen de neumático individual para poder replicarla en la UI
    const query = `${p.brand} ${p.width}/${p.profile} R${p.rim} neumatico`;

    process.stdout.write(
      `[${String(i + 1).padStart(3)}/${products.length}] ${p.id} | ${query.padEnd(60).slice(0, 60)} `
    );

    try {
      const imageUrl = await searchImage(query);
      if (imageUrl) {
        text = replaceImageUrl(text, p.id, imageUrl);
        updated++;
        console.log(`✓`);
      } else {
        console.log(`— sin resultado`);
        failed++;
      }
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }

    // Respetar rate limit (~10 req/s es seguro)
    if (i < products.length - 1) await sleep(120);
  }

  writeFileSync(DATA_PATH, text, "utf-8");
  console.log(`\nListo. Actualizados: ${updated} | Fallidos: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
