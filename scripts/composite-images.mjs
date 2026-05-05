#!/usr/bin/env node
/**
 * Descarga cada imagen, compone cuadrado 1200×1200 fondo blanco
 * mostrando 1, 2 o 4 neumáticos según el pack, y guarda en
 * public/images/products/{id}.webp + actualiza data.ts.
 *
 * Uso: SERPER_API_KEY=xxx node scripts/composite-images.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { setTimeout as sleep } from "timers/promises";
import sharp from "sharp";
import path from "path";

const DATA_PATH = "./src/lib/data.ts";
const OUT_DIR = "./public/images/products";
const SIZE = 1200;
const PADDING = 40;

// CDNs que bloquean fetch server-side — se omiten y se re-busca en Serper
const BLOCKED_DOMAINS = ["acdn-us.mitiendanube.com", "mitiendanube.com"];

const SERPER_KEY = process.env.SERPER_API_KEY;

let text = readFileSync(DATA_PATH, "utf-8");

// ─── Parsear productos ────────────────────────────────────────────────────────
function parseProducts(src) {
  const products = [];
  const idRegex = /id:\s*"(\d[^"]+)"/g;
  let m;
  while ((m = idRegex.exec(src)) !== null) {
    const id = m[1];
    const section = src.slice(m.index, m.index + 900);
    const brand = section.match(/brand:\s*"([^"]+)"/)?.[1];
    const width = section.match(/width:\s*(\d+)/)?.[1];
    const profile = section.match(/profile:\s*(\d+)/)?.[1];
    const rim = section.match(/rim:\s*(\d+)/)?.[1];
    const imageUrl = section.match(/imageUrl:\s*\n?\s*"([^"]*)"/)?.[1];
    const tagsStr = section.match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? "";
    const tags = tagsStr.split(",").map((t) => t.replace(/"/g, "").trim()).filter(Boolean);
    if (brand && imageUrl) {
      products.push({ id, brand, width: Number(width), profile: Number(profile), rim: Number(rim), imageUrl, tags });
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

function isBlocked(url) {
  if (!url.startsWith("http")) return false;
  try {
    const host = new URL(url).hostname;
    return BLOCKED_DOMAINS.some((d) => host.includes(d));
  } catch {
    return false;
  }
}

// ─── Serper fallback ──────────────────────────────────────────────────────────
async function searchImage(query) {
  if (!SERPER_KEY) return null;
  const res = await fetch("https://google.serper.dev/images", {
    method: "POST",
    headers: { "X-API-KEY": SERPER_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ q: query, num: 8, gl: "ar", hl: "es" }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  // Preferir dominios confiables
  const preferred = ["mlstatic.com", "michelin.com", "mercadolibre", "tienda", "ebay"];
  const images = data.images ?? [];
  for (const img of images) {
    const url = img.imageUrl ?? "";
    if (!url || url.endsWith(".svg")) continue;
    if ((img.imageWidth ?? 0) < 100) continue;
    if (isBlocked(url)) continue;
    return url;
  }
  return images.find((i) => !isBlocked(i.imageUrl ?? ""))?.imageUrl ?? null;
}

// ─── Descargar imagen ─────────────────────────────────────────────────────────
async function fetchImage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TriviumBot/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error(`respuesta muy pequeña (${buf.length} bytes)`);
  return buf;
}

// ─── Composite 1200×1200 ─────────────────────────────────────────────────────
async function compositeImage(rawBuffer, qty) {
  const available = SIZE - PADDING * 2;

  let cols, rows, gapX, gapY;
  if (qty === 4) {
    cols = 2; rows = 2; gapX = 16; gapY = 16;
  } else if (qty === 2) {
    cols = 2; rows = 1; gapX = 24; gapY = 0;
  } else {
    cols = 1; rows = 1; gapX = 0; gapY = 0;
  }

  const cellW = Math.floor((available - gapX * (cols - 1)) / cols);
  const cellH = Math.floor((available - gapY * (rows - 1)) / rows);

  // Resize preservando formato original (no PNG intermedio que puede dar problemas)
  const { data: tileData, info: tileInfo } = await sharp(rawBuffer)
    .resize(cellW, cellH, { fit: "inside", withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });

  const tileW = tileInfo.width;
  const tileH = tileInfo.height;

  const composites = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellLeft = PADDING + c * (cellW + gapX);
      const cellTop = PADDING + r * (cellH + gapY);
      const left = cellLeft + Math.floor((cellW - tileW) / 2);
      const top = cellTop + Math.floor((cellH - tileH) / 2);
      composites.push({ input: tileData, left, top });
    }
  }

  return sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite(composites)
    .webp({ quality: 85 })
    .toBuffer();
}

// ─── Reemplazar imageUrl ──────────────────────────────────────────────────────
function replaceImageUrl(src, productId, newUrl) {
  const escaped = productId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idMatch = new RegExp(`id:\\s*"${escaped}"`).exec(src);
  if (!idMatch) return src;
  const section = src.slice(idMatch.index, idMatch.index + 900);
  const imgMatch = /imageUrl:\s*\n?\s*"[^"]*"/.exec(section);
  if (!imgMatch) return src;
  const absStart = idMatch.index + imgMatch.index;
  const absEnd = absStart + imgMatch[0].length;
  return src.slice(0, absStart) + `imageUrl:\n      "${newUrl}"` + src.slice(absEnd);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const products = parseProducts(text);
  const PLACEHOLDER = "/images/tire-placeholder.webp";

  // Resolver URL real para cada producto (reemplazar bloqueadas con Serper)
  const resolvedUrls = new Map(); // id → url
  let serperCount = 0;

  for (const p of products) {
    if (!p.imageUrl || p.imageUrl === PLACEHOLDER) continue;
    if (p.imageUrl.startsWith("/images/products/")) {
      // Ya es local — la URL original la perdemos, necesitamos re-buscar
      // si no tenemos la URL en el map, buscaremos por brand+size
      resolvedUrls.set(p.id, null); // marcar como "necesita búsqueda"
    } else if (isBlocked(p.imageUrl)) {
      resolvedUrls.set(p.id, null);
    } else {
      resolvedUrls.set(p.id, p.imageUrl);
    }
  }

  // Para los que necesitan búsqueda, usar Serper
  const needSearch = products.filter((p) => resolvedUrls.get(p.id) === null);
  if (needSearch.length > 0) {
    console.log(`\nBuscando imágenes para ${needSearch.length} productos via Serper...`);

    // Agrupar por brand+size para minimizar requests
    const searchGroups = new Map();
    for (const p of needSearch) {
      const key = `${p.brand} ${p.width}/${p.profile} R${p.rim}`;
      if (!searchGroups.has(key)) searchGroups.set(key, []);
      searchGroups.get(key).push(p);
    }

    for (const [query, group] of searchGroups) {
      const url = await searchImage(`${query} neumatico`);
      for (const p of group) resolvedUrls.set(p.id, url ?? null);
      process.stdout.write(url ? "." : "x");
      serperCount++;
      await sleep(130);
    }
    console.log(`\n${serperCount} búsquedas Serper\n`);
  }

  // Agrupar por URL resuelta
  const byUrl = new Map();
  for (const p of products) {
    const url = resolvedUrls.get(p.id);
    if (!url) continue;
    if (!byUrl.has(url)) byUrl.set(url, []);
    byUrl.get(url).push(p);
  }

  console.log(`Imágenes a descargar: ${byUrl.size}`);

  let done = 0, errors = 0;
  const total = byUrl.size;

  for (const [url, group] of byUrl) {
    done++;
    const label = group.map((p) => p.id).join(",").slice(0, 38);
    process.stdout.write(`[${String(done).padStart(3)}/${total}] ${label.padEnd(40)} `);

    let rawBuffer;
    try {
      rawBuffer = await fetchImage(url);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      errors++;
      continue;
    }

    const qtySeen = new Map();
    let ok = true;

    for (const p of group) {
      const qty = getPackQty(p.tags);
      const outFile = path.join(OUT_DIR, `${p.id}.webp`);

      if (!qtySeen.has(qty)) {
        try {
          qtySeen.set(qty, await compositeImage(rawBuffer, qty));
        } catch (err) {
          console.log(`✗ composite ${p.id}: ${err.message}`);
          ok = false;
          errors++;
          continue;
        }
      }

      writeFileSync(outFile, qtySeen.get(qty));
      text = replaceImageUrl(text, p.id, `/images/products/${p.id}.webp`);
    }

    if (ok) console.log("✓");
    await sleep(60);
  }

  writeFileSync(DATA_PATH, text, "utf-8");
  console.log(`\nListo. OK: ${done - errors}/${total} | Errores: ${errors}`);
}

main().catch(console.error);
