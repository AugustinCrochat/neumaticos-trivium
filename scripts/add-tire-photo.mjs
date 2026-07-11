#!/usr/bin/env node
/**
 * Genera las fotos de producto (una por medida, a partir de una sola foto real
 * del modelo) y arma el listado de URLs para cargar en el POS (campo
 * imagen_url de cada codigo_tango) y en el catálogo de Meta / WhatsApp Business.
 *
 * El dibujo de la banda de rodamiento es el mismo para todas las medidas de un
 * mismo modelo, así que no hace falta una foto distinta por medida: solo un
 * nombre de archivo distinto (para SEO) que apunte a la misma imagen fuente.
 *
 * Uso:
 *   node --env-file=.env.local scripts/add-tire-photo.mjs <ruta-foto> "<marca>" "<modelo>"
 *
 * Ejemplo:
 *   node --env-file=.env.local scripts/add-tire-photo.mjs ~/Descargas/kingpro.jpg "Grenlander" "Kingpro One"
 *
 * Requiere la variable de entorno POS_API_URL (ya está en .env.local).
 */

import { existsSync, mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";

const SITE_URL = "https://neumaticos.trivium.ar";
const OUTPUT_DIR = "./public/images/products";
const POS_API_URL = process.env.POS_API_URL;

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchProductos() {
  const res = await fetch(`${POS_API_URL}/productos`);
  if (!res.ok) throw new Error(`POS respondió ${res.status}`);
  const data = await res.json();
  return data.productos;
}

async function main() {
  const [, , sourcePhoto, marca, modelo] = process.argv;

  if (!sourcePhoto || !marca || !modelo) {
    console.error(
      'Uso: node --env-file=.env.local scripts/add-tire-photo.mjs <ruta-foto> "<marca>" "<modelo>"'
    );
    process.exit(1);
  }
  if (!POS_API_URL) {
    console.error("Falta POS_API_URL. Corré con: node --env-file=.env.local scripts/add-tire-photo.mjs ...");
    process.exit(1);
  }
  if (!existsSync(sourcePhoto)) {
    console.error(`No se encontró el archivo: ${sourcePhoto}`);
    process.exit(1);
  }

  const productos = await fetchProductos();
  const marcaLower = marca.toLowerCase();
  const modeloLower = modelo.toLowerCase();

  const matches = productos.filter(
    (p) =>
      (p.marca || "").toLowerCase().includes(marcaLower) &&
      (p.modelo || "").toLowerCase().includes(modeloLower) &&
      p.neumatico_ancho &&
      p.neumatico_perfil &&
      p.neumatico_diametro
  );

  if (matches.length === 0) {
    console.error(`No se encontraron productos en el POS para "${marca}" "${modelo}".`);
    process.exit(1);
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const brandSlug = slugify(marca);
  const modelSlug = slugify(modelo);

  // Agrupar por medida real (puede haber más de un codigo_tango con la misma medida)
  const bySize = new Map();
  for (const p of matches) {
    const sizeKey = `${p.neumatico_ancho}-${p.neumatico_perfil}-${p.neumatico_diametro}`;
    if (!bySize.has(sizeKey)) bySize.set(sizeKey, []);
    bySize.get(sizeKey).push(p);
  }

  console.log(`Modelo: ${marca} ${modelo}`);
  console.log(`Medidas encontradas: ${bySize.size} (${matches.length} códigos Tango)\n`);

  const rows = [];

  for (const [sizeKey, prods] of bySize) {
    const [width, profile, rim] = sizeKey.split("-");
    const filename = `${brandSlug}-${modelSlug}-${width}-${profile}-r${rim}.webp`;
    const outPath = path.join(OUTPUT_DIR, filename);
    const publicUrl = `${SITE_URL}/images/products/${filename}`;

    await sharp(sourcePhoto)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);

    for (const p of prods) {
      rows.push({
        codigo_tango: p.codigo_tango ?? p.id,
        medida: `${width}/${profile} R${rim}`,
        url: publicUrl,
      });
    }
  }

  console.log("Pegá esta URL en el campo de foto del POS para cada código:\n");
  console.table(rows);

  console.log(
    `\n${bySize.size} archivo(s) generado(s) en ${OUTPUT_DIR}/. Subí este mismo archivo también en el catálogo de Meta Business Suite.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
