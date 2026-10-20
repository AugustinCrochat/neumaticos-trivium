#!/usr/bin/env node
/**
 * Genera las fotos de producto (una por medida, a partir de una sola foto del
 * modelo bajada de internet) y arma el listado de URLs para cargar en el POS
 * (campo imagen_url de cada codigo_tango) y en el catálogo de Meta / WhatsApp
 * Business.
 *
 * La foto de origen se normaliza a un cuadrado de 1200×1200 con fondo blanco
 * (sea cual sea su tamaño u proporción original), para que el catálogo se vea
 * parejo aunque las fotos vengan de distintas fuentes.
 *
 * El dibujo de la banda de rodamiento es el mismo para todas las medidas de un
 * mismo modelo, así que no hace falta una foto distinta por medida: solo un
 * nombre de archivo distinto (para SEO) que apunte a la misma imagen fuente.
 *
 * Uso:
 *   node --env-file=.env.local scripts/add-tire-photo.mjs <ruta-foto> "<marca>" "<modelo>" [nombre-seo]
 *
 * nombre-seo (opcional) reemplaza "<marca>-<modelo>" en el nombre del archivo
 * (ej. "yokohama-geolandar-at-g018" cuando el POS solo dice "G018"). Si se usa,
 * hay que registrar el alias en IMAGE_NAME_ALIASES de src/lib/pos-api.ts para
 * que el sitio lo encuentre sin imagen_url en el POS.
 *
 * Ejemplo:
 *   node --env-file=.env.local scripts/add-tire-photo.mjs ~/Descargas/kingpro.jpg "Grenlander" "Kingpro One"
 *
 * Para cargar varios modelos de una carpeta de una sola vez, usar
 * scripts/add-tire-photos-batch.mjs en su lugar.
 *
 * Requiere la variable de entorno POS_API_URL (ya está en .env.local).
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { generateImageManifest } from "./lib/generate-image-manifest.mjs";
import {
  SITE_URL,
  OUTPUT_DIR,
  slugify,
  fetchProductos,
  compositeOnWhite,
  matchProducts,
  groupBySize,
} from "./lib/tire-photos.mjs";

async function main() {
  const [, , sourcePhoto, marca, modelo, fileBase] = process.argv;

  if (!sourcePhoto || !marca || !modelo) {
    console.error(
      'Uso: node --env-file=.env.local scripts/add-tire-photo.mjs <ruta-foto> "<marca>" "<modelo>"'
    );
    process.exit(1);
  }
  if (!existsSync(sourcePhoto)) {
    console.error(`No se encontró el archivo: ${sourcePhoto}`);
    process.exit(1);
  }

  const productos = await fetchProductos();
  const matches = matchProducts(productos, marca, modelo);

  if (matches.length === 0) {
    console.error(`No se encontraron productos en el POS para "${marca}" "${modelo}".`);
    process.exit(1);
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const brandSlug = slugify(marca);
  const modelSlug = slugify(modelo);
  const bySize = groupBySize(matches);

  console.log(`Modelo: ${marca} ${modelo}`);
  console.log(`Medidas encontradas: ${bySize.size} (${matches.length} códigos Tango)\n`);

  const rows = [];
  const composed = await compositeOnWhite(sourcePhoto);

  for (const [sizeKey, prods] of bySize) {
    const [width, profile, rim] = sizeKey.split("-");
    const filename = `${fileBase || `${brandSlug}-${modelSlug}`}-${width}-${profile}-r${rim}.webp`;
    const outPath = path.join(OUTPUT_DIR, filename);
    const publicUrl = `${SITE_URL}/images/products/${filename}`;

    writeFileSync(outPath, composed);

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

  const manifestCount = generateImageManifest();
  console.log(`Manifiesto de fotos actualizado (${manifestCount} archivos).`);

  console.log(
    `\n${bySize.size} archivo(s) generado(s) en ${OUTPUT_DIR}/. Subí este mismo archivo también en el catálogo de Meta Business Suite.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
