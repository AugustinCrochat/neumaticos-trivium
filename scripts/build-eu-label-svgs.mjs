#!/usr/bin/env node
/**
 * Baja de EPREL la etiqueta en SVG de cada neumático de eu-tire-labels-map.json
 * y la deja liviana en public/images/eu-labels/<slug>.svg, para mostrarla en
 * la ficha del producto (la galería sigue usando el PNG).
 *
 * El SVG oficial pesa ~900 KB porque el código QR viene como ~10.000 <rect>
 * de 1x1. Acá se juntan en un solo <path> (con trazo en none: el grupo del
 * QR hereda stroke blanco y lo dejaba grisáceo) y los textos se pasan a
 * trazos con inkscape para que la etiqueta no dependa de las tipografías
 * del dispositivo (Verdana/Calibri). Queda en ~90 KB (~18 KB comprimido).
 *
 * Uso: node scripts/build-eu-label-svgs.mjs [--force]
 * Requiere el binario `inkscape`. Se corre a mano, igual que
 * fetch-eu-tire-labels.mjs; el resultado se commitea.
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");
const MAP = JSON.parse(readFileSync(path.join(ROOT, "src/lib/eu-tire-labels-map.json"), "utf-8"));
const OUT_DIR = path.join(ROOT, "public/images/eu-labels");
const REFERER = { Referer: "https://eprel.ec.europa.eu/screen/search" };
const force = process.argv.includes("--force");

const QR_CELL = /<rect fill="black" x="(\d+)" width="1" height="1" y="(\d+)" stroke="none"\s*\/>/g;

function collapseQr(svg) {
  const cells = [...svg.matchAll(QR_CELL)].map((m) => [Number(m[1]), Number(m[2])]);
  if (cells.length === 0) return svg;
  const rows = new Map();
  for (const [x, y] of cells) rows.set(y, [...(rows.get(y) ?? []), x]);
  let d = "";
  for (const y of [...rows.keys()].sort((a, b) => a - b)) {
    const xs = rows.get(y).sort((a, b) => a - b);
    for (let i = 0; i < xs.length; ) {
      let j = i;
      while (j + 1 < xs.length && xs[j + 1] === xs[j] + 1) j++;
      const w = xs[j] - xs[i] + 1;
      d += `M${xs[i]} ${y}h${w}v1h-${w}z`;
      i = j + 1;
    }
  }
  const first = svg.search(QR_CELL);
  return svg.slice(0, first) + `<path fill="black" stroke="none" d="${d}"/>` + svg.slice(first).replace(QR_CELL, "");
}

function clean(svg) {
  return svg
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<sodipodi:namedview[^>]*\/>/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/g, "")
    .replace(/\s+xmlns:(formattingHelper|inkscape|sodipodi|rdf|cc|dc)="[^"]*"/g, "")
    .replace(/\s+(inkscape|sodipodi):[\w-]+="[^"]*"/g, "")
    .replace(/>\s+</g, "><")
    .trim();
}

async function build(slug, eprelId) {
  const res = await fetch(`https://eprel.ec.europa.eu/api/products/tyres/${eprelId}/labels?format=SVG`, {
    headers: REFERER,
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`EPREL respondió ${res.status}`);
  const raw = await res.text();
  if (!raw.includes("<svg")) throw new Error("la respuesta no es un SVG");

  const tmp = path.join(os.tmpdir(), `eprel-svg-${eprelId}`);
  mkdirSync(tmp, { recursive: true });
  const src = path.join(tmp, "in.svg");
  const dst = path.join(tmp, "out.svg");
  writeFileSync(src, collapseQr(raw));
  execFileSync("inkscape", [src, "--export-text-to-path", "--export-plain-svg", "-o", dst], { stdio: "ignore" });
  writeFileSync(path.join(OUT_DIR, `${slug}.svg`), clean(readFileSync(dst, "utf-8")));
  rmSync(tmp, { recursive: true, force: true });
}

mkdirSync(OUT_DIR, { recursive: true });
let ok = 0;
let fail = 0;
for (const [slug, { eprelId }] of Object.entries(MAP)) {
  if (!force && existsSync(path.join(OUT_DIR, `${slug}.svg`))) continue;
  try {
    await build(slug, eprelId);
    ok++;
  } catch (e) {
    fail++;
    console.error(`✗ ${slug} (${eprelId}): ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 300));
}
console.log(`SVG generados: ${ok}, fallidos: ${fail}`);
