#!/usr/bin/env node
/**
 * Foto de las dos llaves del juego de tuercas antirrobo con un cartel "x2".
 * El cartel va horneado en la imagen (no es HTML) para que se vea igual en la
 * galería, en el lightbox y en la búsqueda de imágenes.
 *
 * Uso: node scripts/build-tuercas-dos-llaves.mjs [foto.png]
 * Por defecto toma "~/Downloads/Chrome Wheel Lock Sockets on White.png".
 * Escribe public/images/tuercas-antirrobo/dos-llaves-incluidas-tuercas-antirrobo-trivium-cordoba.webp
 * y usa Barlow Condensed (se baja la primera vez). Se commitea el resultado.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import React from "react";
import sharp from "sharp";
import { ImageResponse } from "next/og.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = process.argv[2] ?? path.join(os.homedir(), "Downloads", "Chrome Wheel Lock Sockets on White.png");
const OUT = path.join(ROOT, "public/images/tuercas-antirrobo/dos-llaves-incluidas-tuercas-antirrobo-trivium-cordoba.webp");
const h = React.createElement;

async function font(w) {
  const file = path.join(os.tmpdir(), "trivium-fonts", `BarlowCondensed-${w}.ttf`);
  if (!existsSync(file)) {
    mkdirSync(path.dirname(file), { recursive: true });
    const res = await fetch(`https://github.com/google/fonts/raw/main/ofl/barlowcondensed/BarlowCondensed-${w}.ttf`);
    if (!res.ok) throw new Error(`tipografía ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return readFileSync(file);
}

const foto = await sharp(SRC).resize({ height: 860 }).png().toBuffer();
const meta = await sharp(foto).metadata();
const uri = `data:image/png;base64,${foto.toString("base64")}`;

const el = h(
  "div",
  { style: { width: "100%", height: "100%", display: "flex", background: "#ffffff", position: "relative", fontFamily: "Barlow" } },
  h("div", { style: { display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 10, background: "#ff1e00" } }),
  h("img", { src: uri, width: meta.width, height: meta.height, style: { position: "absolute", left: (1200 - meta.width) / 2 - 40, top: 60 } }),
  // Cartel "x2"
  h(
    "div",
    { style: { position: "absolute", right: 70, top: 70, width: 300, height: 300, borderRadius: 150, background: "#ff1e00", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" } },
    h("span", { style: { fontSize: 230, fontWeight: 700, color: "#ffffff", lineHeight: 1 } }, "×2"),
  ),
  h(
    "div",
    { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: 210, background: "#050505", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" } },
    h("span", { style: { fontSize: 92, fontWeight: 700, color: "#ffffff", textTransform: "uppercase", lineHeight: 1 } }, "Incluye 2 llaves"),
    h("span", { style: { fontSize: 44, fontWeight: 600, color: "#ff1e00", marginTop: 10 } }, "Una de repuesto por si perdés la otra"),
  ),
);

const fonts = [
  { name: "Barlow", data: await font("Bold"), weight: 700, style: "normal" },
  { name: "Barlow", data: await font("SemiBold"), weight: 600, style: "normal" },
];
const png = await new ImageResponse(el, { width: 1200, height: 1200, fonts }).arrayBuffer();
await sharp(Buffer.from(png)).webp({ quality: 88 }).toFile(OUT);
console.log("OK", OUT);
