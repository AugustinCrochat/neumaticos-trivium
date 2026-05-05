#!/usr/bin/env node
/**
 * Corrige imágenes faltantes/incorrectas buscando por modelo (no por medida).
 * Un solo resultado de Serper se aplica a todos los IDs del mismo modelo.
 * Uso: SERPER_API_KEY=xxx node scripts/fix-images.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { setTimeout as sleep } from "timers/promises";

const SERPER_KEY = process.env.SERPER_API_KEY;
if (!SERPER_KEY) {
  console.error("Falta SERPER_API_KEY");
  process.exit(1);
}

const DATA_PATH = "./src/lib/data.ts";
let text = readFileSync(DATA_PATH, "utf-8");

// ─── Grupos: una query por modelo, varios IDs comparten la imagen ─────────────
const GROUPS = [
  {
    query: "Michelin Pilot Sport 4 neumatico",
    ids: [
      "1010046-4", "1010684-4", "1010191-2", "1010627-2", "1010621-2",
      "1010218-2", "1010207-2", "1010629-2", "1010220-2",
    ],
  },
  {
    query: "Michelin Pilot Sport 4 S neumatico",
    ids: [
      "1010150-2", "1010962", "1010152-2", "1010199-2", "1010201-2",
      "1010208-2", "1010181-2", "1010904-4", "1010904-2", "1010184-2",
    ],
  },
  {
    query: "Michelin Pilot Sport 3 neumatico",
    ids: ["1010033-2"],
  },
  {
    query: "Michelin Pilot Sport 4 SUV neumatico",
    ids: ["1010839-2"],
  },
  {
    query: "Michelin Pilot Alpin 5 SUV neumatico",
    ids: ["1010651-2"],
  },
  {
    query: "Michelin Pilot Sport PS2 neumatico",
    ids: ["1010958-2"],
  },
  {
    query: "Michelin Pilot Super Sport neumatico",
    ids: ["1010682-2", "1010813-2"],
  },
  {
    query: "Michelin Pilot Sport Cup 2 neumatico",
    ids: ["1010770-2", "1010961"],
  },
  {
    query: "Michelin LTX Trail neumatico",
    ids: ["1011001"],
  },
  {
    query: "Michelin MXV-P neumatico",
    ids: ["1010654-4"],
  },
  {
    query: "Michelin Primacy SUV neumatico",
    ids: ["1010317-4", "1010317"],
  },
  {
    query: "Nexen N-Fera neumatico",
    ids: ["1011091-2"],
  },
  {
    query: "Nexen N-Fera SU4 neumatico",
    ids: ["1011103"],
  },
  {
    query: "BFGoodrich Mud Terrain KM3 neumatico",
    ids: ["1010636-4"],
  },
  {
    query: "Continental Vanco neumatico furgon",
    ids: ["1010889-2"],
  },
  {
    query: "Kumho KC55 neumatico",
    ids: ["1010891-2"],
  },
  {
    query: "Michelin MXV neumatico clasico",
    ids: ["1011053-4"],
  },
  {
    query: "Michelin XZX neumatico clasico",
    ids: ["1011055-4", "1010548-4"],
  },
];

// ─── Serper ───────────────────────────────────────────────────────────────────
async function searchImage(query) {
  const res = await fetch("https://google.serper.dev/images", {
    method: "POST",
    headers: {
      "X-API-KEY": SERPER_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 5, gl: "ar", hl: "es" }),
  });
  if (!res.ok) throw new Error(`Serper ${res.status}`);
  const data = await res.json();
  const images = data.images ?? [];
  for (const img of images) {
    const url = img.imageUrl ?? "";
    if (url && !url.endsWith(".svg") && (img.imageWidth ?? 0) >= 100) return url;
  }
  return images[0]?.imageUrl ?? null;
}

// ─── Reemplazar imageUrl en data.ts ──────────────────────────────────────────
function replaceImageUrl(src, productId, newUrl) {
  const escaped = productId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idMatch = new RegExp(`id:\\s*"${escaped}"`).exec(src);
  if (!idMatch) return src;

  const searchSection = src.slice(idMatch.index, idMatch.index + 900);
  // Soporta tanto una línea (imageUrl: "url") como dos líneas (imageUrl:\n  "url")
  const imgMatch = /imageUrl:\s*\n?\s*"[^"]*"/.exec(searchSection);
  if (!imgMatch) return src;

  const absStart = idMatch.index + imgMatch.index;
  const absEnd = absStart + imgMatch[0].length;

  return src.slice(0, absStart) + `imageUrl:\n      "${newUrl}"` + src.slice(absEnd);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  let updated = 0;

  for (let g = 0; g < GROUPS.length; g++) {
    const { query, ids } = GROUPS[g];
    process.stdout.write(`[${g + 1}/${GROUPS.length}] ${query.padEnd(55).slice(0, 55)} `);

    try {
      const url = await searchImage(query);
      if (!url) {
        console.log("— sin resultado");
        continue;
      }
      console.log(`✓  ${url.slice(0, 70)}`);

      for (const id of ids) {
        text = replaceImageUrl(text, id, url);
        updated++;
      }
    } catch (err) {
      console.log(`✗  ${err.message}`);
    }

    if (g < GROUPS.length - 1) await sleep(150);
  }

  writeFileSync(DATA_PATH, text, "utf-8");
  console.log(`\nListo. ${updated} productos actualizados.`);
}

main().catch(console.error);
