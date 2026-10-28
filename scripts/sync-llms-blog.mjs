#!/usr/bin/env node
// Mantiene en public/llms.txt la lista de notas del blog posteriores al
// 2026-10-28 (las anteriores están a mano en el archivo): sólo las ya
// publicadas, para que una nota programada no aparezca antes de su fecha.
// Corre en el prebuild; reescribe el bloque entre los marcadores.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { leerNotas, hoyCordoba } from "./lib/blog-posts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVO = join(ROOT, "public", "llms.txt");
const INICIO = "<!-- notas-programadas:inicio -->";
const FIN = "<!-- notas-programadas:fin -->";
const CORTE = "2026-10-28";

const hoy = hoyCordoba();
const lineas = leerNotas(ROOT)
  .filter((n) => n.date > CORTE && n.date <= hoy)
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((n) => `- ${n.title}: https://neumaticos.trivium.ar/blog/${n.slug}`);

let txt = readFileSync(ARCHIVO, "utf8");
const bloque = `${INICIO}\n${lineas.join("\n")}\n${FIN}`;
if (txt.includes(INICIO)) txt = txt.replace(new RegExp(`${INICIO}[\\s\\S]*?${FIN}`), bloque);
else txt = `${txt.trimEnd()}\n${bloque}\n`;
writeFileSync(ARCHIVO, txt);
console.log(`[sync-llms-blog] ${lineas.length} notas nuevas en llms.txt (hoy ${hoy}).`);
