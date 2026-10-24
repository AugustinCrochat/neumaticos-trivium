#!/usr/bin/env node
/**
 * Genera la tarjeta "Compatible con" de cada tuerca antirrobo
 * (public/images/tuercas-antirrobo/<slug>-compatibles.webp): una imagen con
 * el logo, el nombre, los vehículos compatibles y el dato de que el juego trae
 * dos llaves. Va en la galería de la ficha y en el JSON-LD / sitemap de
 * imágenes, así que tiene que ser un archivo real y no un bloque de HTML.
 *
 * Los vehículos salen de src/lib/tuercas-vehiculos.ts (curado a mano) y el
 * nombre y las aclaraciones, del POS. La tarjeta no lleva precio ni stock para
 * no quedar vieja: se regenera sólo si cambia la compatibilidad.
 *
 * Uso: node --env-file=.env.local scripts/build-tuercas-cards.mjs
 * Necesita POS_API_BASE_URL y conexión para bajar la tipografía de la marca
 * (Barlow Condensed, de Google Fonts) la primera vez. Se commitea el resultado.
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import React from "react";
import sharp from "sharp";
import { ImageResponse } from "next/og.js";
import ts from "typescript";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/tuercas-antirrobo");
const BASE = process.env.POS_API_BASE_URL;
const FONT_URL = (w) => `https://github.com/google/fonts/raw/main/ofl/barlowcondensed/BarlowCondensed-${w}.ttf`;
const h = React.createElement;

// tuercas-vehiculos.ts es TypeScript y Node no lo ejecuta directo: se transpila al vuelo.
const { outputText } = ts.transpileModule(readFileSync(path.join(ROOT, "src/lib/tuercas-vehiculos.ts"), "utf-8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { TUERCAS_VEHICULOS } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const slugify = (t) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function font(weightName) {
  const file = path.join(os.tmpdir(), "trivium-fonts", `BarlowCondensed-${weightName}.ttf`);
  if (!existsSync(file)) {
    mkdirSync(path.dirname(file), { recursive: true });
    const res = await fetch(FONT_URL(weightName));
    if (!res.ok) throw new Error(`no se pudo bajar la tipografía (${res.status})`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return readFileSync(file);
}

const dataUri = (file) => `data:image/svg+xml;base64,${readFileSync(path.join(ROOT, file)).toString("base64")}`;
const WORDMARK = dataUri("public/logo-neumaticos-trivium.svg");
const ICON = dataUri("src/app/icon.svg");

const MARCA = { Citroen: "Citroën", Seat: "SEAT" };
const marcaNombre = (m) => MARCA[m] ?? m;

/** "ANTIRROBO FIAT 500/DOBLO PREMIUM Z3 (66090)" -> { nombre: "FIAT 500/DOBLO", codigo: "66090" } */
function limpiarNombre(nombre) {
  const codigo = nombre.match(/\((\d+)\)\s*$/)?.[1];
  const limpio = nombre
    .replace(/\(\d+\)\s*$/, "")
    .replace(/^ANTIRROBO\s+/i, "")
    .replace(/\s*PREMIUM\s*(Z3)?\s*/i, " ")
    .replace(/\s*\/\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
  return { nombre: limpio, codigo };
}

function agrupar(vehiculos) {
  const modelos = new Map();
  const completas = [];
  for (const v of vehiculos) {
    if (!v.modelo) completas.push(marcaNombre(v.marca));
    else modelos.set(marcaNombre(v.marca), [...(modelos.get(marcaNombre(v.marca)) ?? []), v.modelo]);
  }
  return { modelos: [...modelos.entries()], completas };
}

function tarjeta({ nombre, codigo, grupos, notas }) {
  const n = grupos.modelos.reduce((s, [, m]) => s + m.length, 0) + grupos.modelos.length + (grupos.completas.length ? 2 : 0);
  const fs = n <= 7 ? 62 : n <= 13 ? 54 : n <= 19 ? 48 : 40;
  const gap = fs <= 40 ? 14 : 20;

  const fila = (etiqueta, texto) =>
    h(
      "div",
      { style: { display: "flex", flexWrap: "wrap", alignItems: "baseline", marginBottom: gap } },
      h("span", { style: { fontSize: fs, fontWeight: 700, color: "#ff1e00", textTransform: "uppercase", marginRight: 18, letterSpacing: 1 } }, etiqueta),
      h("span", { style: { fontSize: fs, fontWeight: 600, color: "#ffffff" } }, texto),
    );

  return h(
    "div",
    { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#050505", position: "relative", padding: "64px 72px 56px", fontFamily: "Barlow" } },
    h("div", { style: { display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 10, background: "#ff1e00" } }),
    h("img", { src: ICON, width: 640, height: 640, style: { position: "absolute", right: -150, bottom: -140, opacity: 0.1 } }),

    h(
      "div",
      { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 } },
      h("img", { src: WORDMARK, width: 230, height: 79 }),
      h("span", { style: { fontSize: 30, fontWeight: 700, color: "#94a3b8", letterSpacing: 3, textTransform: "uppercase" } }, "Tuercas de seguridad"),
    ),

    h("div", { style: { display: "flex", fontSize: 104, fontWeight: 700, color: "#ffffff", lineHeight: 0.95, textTransform: "uppercase" } }, "Tuercas antirrobo"),
    h(
      "div",
      { style: { display: "flex", alignItems: "baseline", marginTop: 14, marginBottom: 36 } },
      h("span", { style: { fontSize: 56, fontWeight: 700, color: "#ff1e00", textTransform: "uppercase" } }, nombre),
      codigo ? h("span", { style: { fontSize: 30, fontWeight: 600, color: "#94a3b8", marginLeft: 20 } }, `Ref. ${codigo}`) : null,
    ),

    h("div", { style: { display: "flex", fontSize: 28, fontWeight: 700, color: "#94a3b8", letterSpacing: 4, textTransform: "uppercase", marginBottom: 22 } }, "Compatible con"),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", flex: 1 } },
      ...grupos.modelos.map(([marca, modelos]) => fila(marca, modelos.join(" · "))),
      grupos.completas.length ? fila("Toda la marca", grupos.completas.join(" · ")) : null,
      ...notas.map((t) => h("div", { style: { display: "flex", fontSize: 30, fontWeight: 600, color: "#cbd5e1", marginTop: 4 } }, `• ${t}`)),
    ),

    h(
      "div",
      { style: { display: "flex", alignItems: "center", background: "#ff1e00", borderRadius: 24, padding: "26px 40px", marginTop: 20 } },
      h("span", { style: { fontSize: 72, fontWeight: 700, color: "#ffffff", textTransform: "uppercase", lineHeight: 1 } }, "Incluye 2 llaves"),
      h("span", { style: { fontSize: 34, fontWeight: 600, color: "#ffffff", marginLeft: 32, lineHeight: 1.05, maxWidth: 380 } }, "Una de repuesto por si perdés la otra"),
    ),
    h(
      "div",
      { style: { display: "flex", justifyContent: "space-between", marginTop: 24, fontSize: 28, fontWeight: 600, color: "#94a3b8" } },
      h("span", null, "Colocación sin cargo · Argüello, Córdoba"),
      h("span", { style: { color: "#ffffff", fontWeight: 700 } }, "neumaticos.trivium.ar"),
    ),
  );
}

async function main() {
  if (!BASE) throw new Error("falta POS_API_BASE_URL (correr con --env-file=.env.local)");
  const res = await fetch(`${BASE}/arguello/accesorios`);
  if (!res.ok) throw new Error(`el POS respondió ${res.status}`);
  const { accesorios } = await res.json();
  const fonts = [
    { name: "Barlow", data: await font("Bold"), weight: 700, style: "normal" },
    { name: "Barlow", data: await font("SemiBold"), weight: 600, style: "normal" },
  ];
  mkdirSync(OUT_DIR, { recursive: true });

  const only = process.argv.find((a) => a.startsWith("--solo="))?.split("=")[1];
  let ok = 0;
  for (const a of accesorios) {
    const vehiculos = TUERCAS_VEHICULOS[a.codigo_tango];
    if (!vehiculos) {
      console.warn(`✗ ${a.nombre}: sin compatibilidad curada en tuercas-vehiculos.ts`);
      continue;
    }
    const slug = slugify(a.nombre);
    if (only && !slug.includes(only)) continue;
    const { nombre, codigo } = limpiarNombre(a.nombre);
    // Lo que va después del primer punto de la descripción es una aclaración
    // ("Para llanta de aleación no original", "Kit activo de 5 piezas...").
    const notas = (a.descripcion ?? "").split(/\.\s+/).slice(1).map((t) => t.replace(/\.$/, "").trim()).filter(Boolean);
    const png = await new ImageResponse(tarjeta({ nombre, codigo, grupos: agrupar(vehiculos), notas }), { width: 1200, height: 1200, fonts }).arrayBuffer();
    await sharp(Buffer.from(png)).webp({ quality: 88 }).toFile(path.join(OUT_DIR, `${slug}-compatibles.webp`));
    ok++;
  }
  console.log(`Tarjetas generadas: ${ok}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
