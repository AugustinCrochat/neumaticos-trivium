#!/usr/bin/env node
/**
 * Descarga la etiqueta oficial de eficiencia energética (Reglamento UE
 * 2020/740) de cada neumático del catálogo desde EPREL (el registro europeo
 * público — https://eprel.ec.europa.eu), la base de datos que arma cada
 * fabricante/importador cuando declara un neumático para el mercado europeo.
 * Es el mismo documento que va pegado en el flanco de la cubierta física.
 *
 * Por qué no armamos el gráfico a mano: EPREL expone el PNG oficial (con
 * pictogramas, código QR y colores correctos — la escala de frenado en
 * mojado es AZUL, no semáforo verde-rojo como en un primer intento nuestro)
 * y es más preciso que transcribir la etiqueta a ojo: el ruido, por ejemplo,
 * cambia según la medida exacta dentro de un mismo modelo, no sólo según el
 * modelo.
 *
 * La API de búsqueda de EPREL no es pública/documentada (no tiene API key),
 * así que este script no es parte del build — se corre a mano cuando se
 * agregan medidas nuevas al catálogo, y el resultado (PNG) se commitea como
 * cualquier otra foto de producto.
 *
 * Uso:
 *   node scripts/fetch-eu-tire-labels.mjs                 (todo el catálogo)
 *   node scripts/fetch-eu-tire-labels.mjs --marca=grenlander   (una marca)
 *
 * Requiere POS_API_URL en el entorno (correr con --env-file=.env.local) y el
 * binario `unzip` del sistema (EPREL entrega la etiqueta en un .zip con
 * PNG+SVG+PDF).
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const EPREL_BASE = "https://eprel.ec.europa.eu";
const OUT_DIR = "./public/images/eu-labels";
const MAP_FILE = "./src/lib/eu-tire-labels-map.json";
const REFERER = { Referer: "https://eprel.ec.europa.eu/screen/search" };

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchProductos() {
  const base = process.env.POS_API_BASE_URL;
  if (!base) throw new Error("Falta POS_API_BASE_URL (corré con node --env-file=.env.local ...)");
  const res = await fetch(`${base}/arguello/productos`);
  if (!res.ok) throw new Error(`POS respondió ${res.status}`);
  const data = await res.json();
  return data.productos.filter((p) => p.neumatico_ancho && p.neumatico_perfil && p.neumatico_diametro);
}

// Réplica de fixBrandAndModel/fixModelName de src/lib/pos-api.ts: el POS
// tiene varios productos mal cargados (marca y modelo cruzados, abreviaturas)
// que ya sabíamos corregir para el sitio — EPREL tampoco los reconoce tal
// como están crudos en el POS.
function fixBrandAndModel(rawMarca, rawModelo) {
  const marcaUpper = rawMarca.trim().toUpperCase();
  if (marcaUpper === "ZMAX" && /greentour/i.test(rawModelo)) {
    return { marca: "Grenlander", modelo: fixModelName(rawModelo) };
  }
  if (/terra xplorer/i.test(rawMarca)) {
    return { marca: "Zmax", modelo: "Terra Xplorer" };
  }
  if (marcaUpper === "ZMAX") {
    if (/terra xplorer/i.test(rawModelo)) return { marca: "Zmax", modelo: "Terra Xplorer" };
    if (/landgema/i.test(rawModelo)) return { marca: "Zmax", modelo: "Landgema" };
  }
  return { marca: rawMarca, modelo: fixModelName(rawModelo) };
}

function fixModelName(modelo) {
  return modelo
    .replace(/\s*cint\b/gi, " Cinturato")
    .replace(/\s*\([A-Z]{1,3}\d?\)\s*/gi, " ")
    .replace(/\s+(RT|R)$/i, "")
    .replace(/^XL\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Candidatos alternativos de nombre comercial para reintentar cuando la
// búsqueda con el nombre "corregido" no encuentra nada — el POS abrevia o
// pega sufijos (KS, KA, RT, código de homologación de auto) que EPREL no
// tiene en el commercialName.
function commercialNameCandidates(modelo) {
  const out = new Set([modelo]);
  const sinXL = modelo.replace(/^XL\s+/i, "").trim();
  out.add(sinXL);
  const sinParentesis = sinXL.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  out.add(sinParentesis);
  // "P1 Cinturato" en el POS vs "Cinturato P1" (nombre real de línea Pirelli)
  const cintMatch = sinParentesis.match(/^(P\d[A-Z]*)\s+Cinturato$/i);
  if (cintMatch) out.add(`Cinturato ${cintMatch[1]}`);
  // Sacar sufijos sueltos de una letra/código pegados al final (ej. "ARZ1RT" -> "ARZ1")
  out.add(sinParentesis.replace(/\s*(RT|R)$/i, "").trim());
  return [...out].filter(Boolean);
}

// Alias de marca: el POS carga "ARIVO PREMIO" como si la línea "Premio" fuera
// la marca — en EPREL el trademark es "ARIVO" a secas.
const TRADEMARK_ALIASES = {
  "ARIVO PREMIO": "ARIVO",
};

async function searchEprel({ trademark, commercialName, width, profile, rim }) {
  const params = new URLSearchParams({
    supplierOrTrademark: trademark,
    commercialName,
    tyreSection: String(width),
    aspectRatio: String(profile),
    rimDiameter: String(rim),
  });
  const res = await fetch(`${EPREL_BASE}/api/products/tyres?${params}`, { headers: REFERER });
  if (!res.ok) return [];
  const data = await res.json();
  return data.hits ?? [];
}

function pickBestHit(hits, loadIndex, speedRating) {
  if (hits.length === 0) return null;
  if (loadIndex && speedRating) {
    const exact = hits.find(
      (h) => String(h.loadCapacityIndex) === String(loadIndex) && h.speedCategorySymbol === speedRating
    );
    if (exact) return exact;
  }
  return hits[0];
}

async function downloadLabel(registrationNumber, destSlug) {
  const res = await fetch(`${EPREL_BASE}/api/products/tyres/${registrationNumber}/labels`, {
    headers: REFERER,
  });
  if (!res.ok) throw new Error(`labels endpoint respondió ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const tmpDir = path.join(os.tmpdir(), `eprel-${registrationNumber}`);
  mkdirSync(tmpDir, { recursive: true });
  const zipPath = path.join(tmpDir, "label.zip");
  writeFileSync(zipPath, buffer);
  execFileSync("unzip", ["-o", "-j", zipPath, `Label_${registrationNumber}.png`, `Label_${registrationNumber}_thumb.png`, "-d", tmpDir]);

  const pngSrc = path.join(tmpDir, `Label_${registrationNumber}.png`);
  const thumbSrc = path.join(tmpDir, `Label_${registrationNumber}_thumb.png`);
  const pngDest = path.join(OUT_DIR, `${destSlug}.png`);
  const thumbDest = path.join(OUT_DIR, `${destSlug}-thumb.png`);
  execFileSync("cp", [pngSrc, pngDest]);
  execFileSync("cp", [thumbSrc, thumbDest]);
  rmSync(tmpDir, { recursive: true, force: true });
}

async function main() {
  const marcaFiltro = process.argv.find((a) => a.startsWith("--marca="))?.split("=")[1]?.toLowerCase();

  mkdirSync(OUT_DIR, { recursive: true });
  const productos = await fetchProductos();
  const map = existsSync(MAP_FILE) ? JSON.parse(readFileSync(MAP_FILE, "utf-8")) : {};

  const vistos = new Set();
  let ok = 0;
  let miss = 0;

  for (const p of productos) {
    const { marca, modelo } = fixBrandAndModel(p.marca || "", p.modelo || "");
    if (marcaFiltro && slugify(marca) !== marcaFiltro && !slugify(marca).includes(marcaFiltro)) continue;
    const key = `${marca}::${modelo}::${p.neumatico_ancho}-${p.neumatico_perfil}-${p.neumatico_diametro}`;
    if (vistos.has(key)) continue;
    vistos.add(key);

    const sinXL = (p.nombre || "").trim().replace(/\s*XL\s*$/i, "");
    const loadSpeedMatch = sinXL.match(/(\d{2,3})([A-Z]{1,2})\s*$/);
    const loadIndex = loadSpeedMatch?.[1];
    const speedRating = loadSpeedMatch?.[2];

    // Slug idéntico al que arma toTireProduct() en src/lib/pos-api.ts — si se
    // toca la fórmula ahí, tocar acá también (ver comentario en ese archivo).
    const loadSpeedSlug = loadIndex && speedRating ? `-${loadIndex}${speedRating}` : "";
    const rodadoSlug = `r${p.neumatico_diametro}${p.es_carga ? "c" : ""}`;
    const slug = slugify(`${marca}-${modelo}-${p.neumatico_ancho}-${p.neumatico_perfil}-${rodadoSlug}${loadSpeedSlug}`);

    const trademark = TRADEMARK_ALIASES[marca.toUpperCase()] || marca;
    let hit = null;
    for (const commercialName of commercialNameCandidates(modelo)) {
      const hits = await searchEprel({
        trademark,
        commercialName,
        width: p.neumatico_ancho,
        profile: p.neumatico_perfil,
        rim: p.neumatico_diametro,
      });
      hit = pickBestHit(hits, loadIndex, speedRating);
      if (hit) break;
    }

    if (!hit) {
      console.log(`✗ SIN MATCH: ${marca} ${modelo} ${p.neumatico_ancho}/${p.neumatico_perfil} R${p.neumatico_diametro}`);
      miss++;
      continue;
    }

    try {
      await downloadLabel(hit.eprelRegistrationNumber, slug);
      map[slug] = {
        eprelId: hit.eprelRegistrationNumber,
        energyClass: hit.energyClass,
        wetGripClass: hit.wetGripClass,
        noiseDb: hit.externalRollingNoiseValue,
        noiseClass: hit.externalRollingNoiseClass,
        tyreDesignation: hit.tyreDesignation,
      };
      console.log(`✓ ${marca} ${modelo} ${p.neumatico_ancho}/${p.neumatico_perfil} R${p.neumatico_diametro} -> EPREL ${hit.eprelRegistrationNumber} (${hit.energyClass}/${hit.wetGripClass}/${hit.externalRollingNoiseValue}dB)`);
      ok++;
    } catch (err) {
      console.log(`✗ ERROR bajando ${hit.eprelRegistrationNumber}: ${err.message}`);
      miss++;
    }
  }

  writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + "\n");
  console.log(`\n${ok} etiquetas descargadas, ${miss} sin match. Mapa en ${MAP_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
