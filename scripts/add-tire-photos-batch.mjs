#!/usr/bin/env node
/**
 * Versión en lote de add-tire-photo.mjs: procesa todas las fotos de una
 * carpeta de una sola vez. Cada archivo debe llamarse "<marca>-<modelo>.ext"
 * en formato slug (ej: "grenlander-kingpro-one.jpg"), igual al nombre de
 * archivo sugerido al listar los modelos pendientes.
 *
 * Uso:
 *   node --env-file=.env.local scripts/add-tire-photos-batch.mjs <carpeta>
 *
 * Requiere la variable de entorno POS_API_URL (ya está en .env.local).
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import path from "path";
import { generateImageManifest } from "./lib/generate-image-manifest.mjs";
import {
  SITE_URL,
  OUTPUT_DIR,
  slugify,
  fetchProductos,
  compositeOnWhite,
  groupBySize,
} from "./lib/tire-photos.mjs";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

async function main() {
  const [, , folder] = process.argv;

  if (!folder) {
    console.error("Uso: node --env-file=.env.local scripts/add-tire-photos-batch.mjs <carpeta>");
    process.exit(1);
  }
  if (!existsSync(folder)) {
    console.error(`No existe la carpeta: ${folder}`);
    process.exit(1);
  }

  const files = readdirSync(folder).filter((f) => IMAGE_EXT.test(f));
  if (files.length === 0) {
    console.error(`No hay imágenes (.jpg/.png/.webp) en ${folder}`);
    process.exit(1);
  }

  const productos = await fetchProductos();

  // Agrupar productos del POS por slug "marca-modelo"
  const byModelSlug = new Map();
  for (const p of productos) {
    if (!p.neumatico_ancho || !p.neumatico_perfil || !p.neumatico_diametro) continue;
    const marca = (p.marca || "").trim();
    const modelo = (p.modelo || "").trim();
    if (!marca || !modelo) continue;
    const key = `${slugify(marca)}-${slugify(modelo)}`;
    if (!byModelSlug.has(key)) byModelSlug.set(key, { marca, modelo, productos: [] });
    byModelSlug.get(key).productos.push(p);
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const allRows = [];
  const noMatch = [];

  for (const file of files) {
    const fileSlug = path.parse(file).name.toLowerCase();
    const entry = byModelSlug.get(fileSlug);

    if (!entry) {
      noMatch.push(file);
      continue;
    }

    const composed = await compositeOnWhite(path.join(folder, file));
    const bySize = groupBySize(entry.productos);
    const brandSlug = slugify(entry.marca);
    const modelSlug = slugify(entry.modelo);

    for (const [sizeKey, prods] of bySize) {
      const [width, profile, rim] = sizeKey.split("-");
      const filename = `${brandSlug}-${modelSlug}-${width}-${profile}-r${rim}.webp`;
      const outPath = path.join(OUTPUT_DIR, filename);
      const publicUrl = `${SITE_URL}/images/products/${filename}`;

      writeFileSync(outPath, composed);

      for (const p of prods) {
        allRows.push({
          modelo: `${entry.marca} ${entry.modelo}`,
          codigo_tango: p.codigo_tango ?? p.id,
          medida: `${width}/${profile} R${rim}`,
          url: publicUrl,
        });
      }
    }

    console.log(`✓ ${file} → ${entry.marca} ${entry.modelo} (${bySize.size} medida(s))`);
  }

  console.log(`\nPegá cada URL en el campo de foto del código Tango correspondiente:\n`);
  console.table(allRows);

  if (noMatch.length > 0) {
    console.log(`\nArchivos que no matchearon ningún modelo del POS (revisar el nombre):`);
    for (const f of noMatch) console.log(`  - ${f}`);
  }

  const manifestCount = generateImageManifest();
  console.log(`Manifiesto de fotos actualizado (${manifestCount} archivos).`);

  console.log(
    `\n${allRows.length} código(s) actualizados con foto. Subí las mismas fotos también al catálogo de Meta Business Suite.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
