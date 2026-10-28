#!/usr/bin/env node
// Avisa si una nota publicada enlaza a una nota que todavía no se publicó
// (daría 404 hasta su fecha). Sólo avisa: no corta el build.
//   node scripts/check-blog-links.mjs
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { leerNotas, hoyCordoba } from "./lib/blog-posts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const hoy = hoyCordoba();
const notas = leerNotas(ROOT);
const fecha = new Map(notas.map((n) => [n.slug, n.date]));
let avisos = 0;
for (const n of notas.filter((n) => n.date <= hoy)) {
  const f = join(ROOT, "src", "app", "blog", n.slug, "page.tsx");
  if (!existsSync(f)) continue;
  for (const m of readFileSync(f, "utf8").matchAll(/\/blog\/([a-z0-9-]+)/g)) {
    const d = fecha.get(m[1]);
    if (d && d > hoy) {
      console.warn(`[check-blog-links] ${n.slug} enlaza a ${m[1]}, que se publica el ${d}.`);
      avisos++;
    }
  }
}
console.log(`[check-blog-links] ${avisos} avisos.`);
