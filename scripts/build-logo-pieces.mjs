#!/usr/bin/env node
/**
 * Parte public/logo-neumaticos-trivium.svg en dos piezas para el header:
 * el ícono (neumático con su etiqueta) y el texto. Así el ícono puede ser
 * más grande que el texto y sobresalir de la barra.
 * Uso: node scripts/build-logo-pieces.mjs
 */
import fs from "fs";
import sharp from "sharp";

const s = fs.readFileSync("public/logo-neumaticos-trivium.svg", "utf8");
const g1Start = s.indexOf('<g transform="translate(0.0000,0.0000) scale(1.00000)">');
const g1 = s.slice(g1Start, s.indexOf("</g>", g1Start) + 4);
const g2Start = s.indexOf('<g transform="translate(0.0000,0.0000)">');
const g2 = s.slice(g2Start, s.indexOf("</g>", g2Start) + 4);
const pieces = { icono: g1, texto: g2 };

const K = 60;
const out = {};
for (const [name, inner] of Object.entries(pieces)) {
  const wrap = `<g transform="translate(0.2,0.2)">${inner}</g>`;
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" width="${60 * K}" height="${30 * K}" viewBox="0 0 60 30">${wrap}</svg>`;
  const { info } = await sharp(Buffer.from(probe)).png().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  const x = -info.trimOffsetLeft / K, y = -info.trimOffsetTop / K, w = info.width / K, h = info.height / K;
  const pad = 0.05;
  const vb = [x - pad, y - pad, w + 2 * pad, h + 2 * pad].map((n) => +n.toFixed(3));
  fs.writeFileSync(
    `public/logo-trivium-${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}"><title>Neumáticos Trivium</title>${wrap}</svg>\n`,
  );
  out[name] = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
}
console.log(JSON.stringify(out, null, 1));
