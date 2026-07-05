// Genera un QR en SVG por sucursal, apuntando a su pagina en el sitio.
//
// El SVG se emite "lo menos compacto posible": un <rect> por modulo (sin fusionar
// en paths), con indentacion legible, para que sea facil de editar, recolorear y
// escalar sin perder nitidez. Alta correccion de errores (nivel H) para que siga
// escaneando aunque el impreso se manche o se pegue un logo encima.
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
  const rects = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y * size + x]) {
        const px = (x + QUIET_ZONE) * MODULE_PX;
        const py = (y + QUIET_ZONE) * MODULE_PX;
        rects.push(
          `    <rect x="${px}" y="${py}" width="${MODULE_PX}" height="${MODULE_PX}" />`
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges" role="img">
  <rect width="${dim}" height="${dim}" fill="${LIGHT}" />
  <g fill="${DARK}">
${rects.join("\n")}
  </g>
</svg>
`;
}

const outDir = join(ROOT, "public/qr");
mkdirSync(outDir, { recursive: true });

for (const branch of branches) {
  const url = `${siteUrl}/sucursales/${branch.id}`;
  const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
  const svg = buildSvg(qr.modules.data, qr.modules.size);
  const file = join(outDir, `sucursal-${branch.id}.svg`);
  writeFileSync(file, svg);
  console.log(`✓ ${branch.shortName.padEnd(14)} ${url}\n  → public/qr/sucursal-${branch.id}.svg (${qr.modules.size}×${qr.modules.size} módulos)`);
}

console.log(`\n${branches.length} QR generados en public/qr/`);
