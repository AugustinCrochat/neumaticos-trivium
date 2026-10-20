#!/usr/bin/env node
/**
 * Fotos adicionales (otros ángulos) de modelos puntuales del catálogo,
 * bajadas de sitios de terceros a falta de una fuente propia con galería:
 *
 * - Grenlander: sitio oficial del fabricante (Zodo Tire Group — el mismo
 *   grupo que fabrica Grenlander, ver src/lib/data.ts) en
 *   es.zodotiregroup.com/zodo-pcr/grenlander.html. Maga A/T Two y
 *   Greentour A/S no estaban ahí, se bajaron de grenlander.ca (Shopify).
 * - Pirelli: pirelli.com sólo expone una foto de estudio por modelo (sin
 *   galería pública), así que estas se bajaron de neumaticosmartin.com.ar
 *   (revendedor con fichas de producto completas para Cinturato P1/P7,
 *   Powergy y Scorpion).
 *
 * Se corrió a mano (no es parte del build): se identificaron a ojo las
 * fotos de flanco/banda de cada modelo en su página de detalle y se
 * llevaron acá con la URL en la mayor resolución que el sitio ofrece.
 *
 * Usa la misma normalización que las fotos principales (compositeOnWhite:
 * recorte + cuadrado 1200x1200 con fondo blanco) para que se vean parejas en
 * la galería junto a la foto que ya carga el POS.
 *
 * La key es "<brandId>-<modeloBase normalizado>": para Pirelli, distintas
 * variantes de homologación del mismo modelo físico (P1CINT (KS), (KA), RT,
 * etc.) se pliegan a la misma key en normalizeModelKey() más abajo, porque
 * son la misma foto — a diferencia de la etiqueta UE, que sí cambia por
 * medida exacta.
 */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { compositeOnWhite } from "./lib/tire-photos.mjs";

const OUT_DIR = "./public/images/products-extra";

// slug de modelo (brandId-modeloBase) -> lista de fotos [{url, angulo}]
const SOURCES = {
  "grenlander-colo-h02": [
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/en/20230307/ec183e7e87b84887.jpg_20230307102331_1600x1200.jpeg", angulo: "banda" },
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/en/20230307/0f47f5390a7139ac.jpg_20230307102332_1600x1200.jpeg", angulo: "flanco" },
  ],
  "grenlander-kingpro-one": [
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/en/20230301/b99284654d2f54af.jpg_20230301152109_1600x1200.jpeg", angulo: "flanco" },
  ],
  "grenlander-stratour-e1": [
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/es/20250429/2_b6ad09c2.jpg_20250429172313_1600x1200.jpeg", angulo: "flanco" },
  ],
  "grenlander-l-zeal56": [
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/en/20230307/9ff570bf775c5a8f.jpg_20230307132920_1600x1200.jpeg", angulo: "banda" },
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/en/20230307/ed660d3a49ec8ac3.jpg_20230307132922_1600x1200.jpeg", angulo: "flanco" },
  ],
  "grenlander-estrella-88": [
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/es/20251201/0_f6cf9b37.jpg_20251201094813_1600x1200.jpeg", angulo: "flanco" },
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/es/20251201/90_fdafaea0.jpg_20251201094814_1600x1200.jpeg", angulo: "llanta" },
  ],
  "grenlander-l-max9": [
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/en/20230307/c8eb5c4df0c85578.jpg_20230307141151_1600x1200.jpeg", angulo: "banda" },
    { url: "https://aliyun-hk02-cdn.hcwebsite.com/76d1771ca63008b45f0948968cc4f09f/data/thumb/res/en/20230307/d105d640531e176b.jpg_20230307141154_1600x1200.jpeg", angulo: "llanta" },
  ],
  // Maga A/T Two y Greentour A/S no estaban en el sitio de Zodo — se bajaron
  // del sitio propio de Grenlander (grenlander.ca), que tiene su ficha de
  // producto en Shopify con 3 fotos de estudio a 0°/22.5°/90°.
  "grenlander-maga-a-t-two": [
    { url: "https://grenlander.ca/cdn/shop/files/MAGA_AT_TWO_0_-_Edited.png?v=1749756684&width=1200", angulo: "flanco" },
    { url: "https://grenlander.ca/cdn/shop/files/MAGA_AT_TWO_90_-_Edited.png?v=1749756684&width=1200", angulo: "banda" },
  ],
  "grenlander-greentour-a-s": [
    { url: "https://grenlander.ca/cdn/shop/files/GREENTOR_AS_0_-_Edited.png?v=1749756684&width=1200", angulo: "flanco" },
    { url: "https://grenlander.ca/cdn/shop/files/GREENTOR_AS_90_-_Edited.png?v=1749756684&width=1200", angulo: "banda" },
  ],

  "pirelli-p1-cinturato": [
    { url: "https://neumaticosmartin.com.ar/tienda/wp-content/uploads/2020/09/cinturato-p1-img-2.jpg", angulo: "flanco" },
    { url: "https://neumaticosmartin.com.ar/tienda/wp-content/uploads/2020/09/cinturato-p1-img-3.jpg", angulo: "banda" },
  ],
  "pirelli-p7-cinturato": [
    { url: "https://neumaticosmartin.com.ar/tienda/wp-content/uploads/2020/09/cinturato-p7-img-2.jpg", angulo: "flanco" },
  ],
  "pirelli-powergy": [
    { url: "https://neumaticosmartin.com.ar/tienda/wp-content/uploads/2023/11/powergy-img-2.jpg", angulo: "flanco" },
  ],
  "pirelli-scorpion": [
    { url: "https://neumaticosmartin.com.ar/tienda/wp-content/uploads/2022/06/scorpion-img-2.jpg", angulo: "flanco" },
  ],
  // S/A/T+ y S-I S-ATR (all-terrain/highway, 1 SKU cada uno) no están en el
  // catálogo de neumaticosmartin.com.ar ni encontramos otro revendedor con
  // ficha propia — quedan sin fotos extra por ahora.
  // Yokohama Geolandar A/T4 (G018): ficha de Central Tire, que trae banda y
  // flanco de estudio. La key sigue siendo la del POS (marca + "G018"), pero los
  // archivos llevan el nombre completo del modelo para SEO.
  "yokohama-g018": [
    { url: "https://centraltire.com.ar/wp-content/uploads/2026/05/G018-1.png", angulo: "banda", file: "yokohama-geolandar-at-g018-banda" },
    { url: "https://centraltire.com.ar/wp-content/uploads/2026/05/G018-2.jpg", angulo: "flanco", file: "yokohama-geolandar-at-g018-flanco" },
  ],
  "pirelli-p400ev": [
    { url: "https://neumaticosmartin.com.ar/tienda/wp-content/uploads/2022/06/p400-evo-img-2.jpg", angulo: "flanco" },
    { url: "https://neumaticosmartin.com.ar/tienda/wp-content/uploads/2022/06/p400-evo-img-3.jpg", angulo: "banda" },
  ],
};

// Las keys de SOURCES ya están escritas en su forma normalizada final (ej.
// "pirelli-p1-cinturato", sin el sufijo de homologación). El que hace el
// pliegue de variantes (XL, paréntesis, RT/R) al leer product.modeloBase en
// runtime es normalizeModelKey() en src/lib/product-extra-photos.ts — tocar
// la lógica ahí, no acá, si aparece un caso nuevo.

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  // Con slugs como argumentos solo se bajan esos modelos y se suman al
  // manifiesto existente, sin volver a bajar (ni pisar) el resto.
  const only = process.argv.slice(2);
  const manifest = only.length
    ? JSON.parse(readFileSync("./src/lib/product-extra-photos.json", "utf8"))
    : {};

  for (const [slug, photos] of Object.entries(SOURCES)) {
    if (only.length && !only.includes(slug)) continue;
    manifest[slug] = [];
    for (let i = 0; i < photos.length; i++) {
      const { url, angulo, file } = photos[i];
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) {
        console.log(`✗ ${slug} (${angulo}): HTTP ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const outName = file ? `${file}.webp` : `${slug}-${i + 1}.webp`;
      const webp = await compositeOnWhite(buffer);
      writeFileSync(path.join(OUT_DIR, outName), webp);
      manifest[slug].push(`/images/products-extra/${outName}`);
      console.log(`✓ ${slug} (${angulo}) -> ${outName}`);
    }
  }

  writeFileSync(
    "./src/lib/product-extra-photos.json",
    JSON.stringify(manifest, null, 2) + "\n"
  );
  console.log("\nManifest en src/lib/product-extra-photos.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
