// Lee las notas de src/lib/data.ts (título, fecha, slug) sin importar TypeScript.
import { readFileSync } from "node:fs";

export function leerNotas(root) {
  const src = readFileSync(`${root}/src/lib/data.ts`, "utf8");
  const desde = src.indexOf("const BLOG_POSTS_BASE");
  const bloque = src.slice(desde, src.indexOf("export const BLOG_POSTS:", desde));
  const notas = [];
  for (const m of bloque.matchAll(/title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?date:\s*"(\d{4}-\d{2}-\d{2})"[\s\S]*?slug:\s*"([^"]+)"/g)) {
    notas.push({ title: JSON.parse(`"${m[1]}"`), date: m[2], slug: m[3] });
  }
  return notas;
}

export const hoyCordoba = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Cordoba" });
