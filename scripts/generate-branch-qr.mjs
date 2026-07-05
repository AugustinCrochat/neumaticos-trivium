// Genera un QR en SVG por sucursal, apuntando a su pagina en el sitio.
//
// El codigo se dibuja como un unico <path>: los modulos contiguos de cada fila se
// fusionan en un solo rectangulo y todo va en un mismo relleno, asi los cuadrados
// que se tocan quedan unidos sin costura (no se ve la linea de separacion que dejan
// los <rect> sueltos por el anti-aliasing). Nivel de correccion "M" (15%) para que
// la matriz sea menos densa; suficiente para un impreso limpio.
//
// Uso:  node scripts/generate-branch-qr.mjs
// (o)   corepack npm run generate-qr

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import QRCode from "qrcode";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// --- Fuente unica de verdad: leemos sucursales y URL desde src/lib/config.ts ---
const config = readFileSync(join(ROOT, "src/lib/config.ts"), "utf8");

const siteUrl = config.match(/SITE_URL\s*=\s*"([^"]+)"/)?.[1];
if (!siteUrl) throw new Error("No se encontro SITE_URL en src/lib/config.ts");

const ids = [...config.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
const shortNames = [...config.matchAll(/\bshortName:\s*"([^"]+)"/g)].map((m) => m[1]);
const branches = ids.map((id, i) => ({ id, shortName: shortNames[i] ?? id }));

// --- Parametros del QR ---
const MODULE_PX = 20; // tamaño de cada modulo en px (grande, para impresion nitida)
const QUIET_ZONE = 4; // margen obligatorio alrededor del codigo, en modulos
const DARK = "#0a1a30"; // navy de la marca
const LIGHT = "#ffffff";

function buildSvg(matrix, size) {
  const total = size + QUIET_ZONE * 2;
  const dim = total * MODULE_PX;
  const runs = [];

  // Fusiona modulos negros contiguos de cada fila en un solo rectangulo.
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (!matrix[y * size + x]) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < size && matrix[y * size + x + run]) run++;
      const px = (x + QUIET_ZONE) * MODULE_PX;
      const py = (y + QUIET_ZONE) * MODULE_PX;
      const w = run * MODULE_PX;
      runs.push(`M${px} ${py}h${w}v${MODULE_PX}h-${w}z`);
      x += run;
    }
  }

  // Un unico path (un solo relleno) -> los cuadrados que se tocan quedan unidos.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges" role="img">
  <rect width="${dim}" height="${dim}" fill="${LIGHT}" />
  <path fill="${DARK}" d="${runs.join("")}" />
</svg>
`;
}

const outDir = join(ROOT, "public/qr");
mkdirSync(outDir, { recursive: true });

for (const branch of branches) {
  const url = `${siteUrl}/sucursales/${branch.id}`;
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const svg = buildSvg(qr.modules.data, qr.modules.size);
  const file = join(outDir, `sucursal-${branch.id}.svg`);
  writeFileSync(file, svg);
  console.log(`✓ ${branch.shortName.padEnd(14)} ${url}\n  → public/qr/sucursal-${branch.id}.svg (${qr.modules.size}×${qr.modules.size} módulos)`);
}

console.log(`\n${branches.length} QR generados en public/qr/`);
