#!/usr/bin/env node
/**
 * Fotos adicionales (otros ángulos) de los modelos Grenlander, bajadas del
 * sitio oficial del fabricante (Zodo Tire Group — el mismo grupo que fabrica
 * Grenlander, ver src/lib/data.ts) en es.zodotiregroup.com/zodo-pcr/grenlander.html.
 *
 * Se corrió una sola vez a mano (no es parte del build): se identificaron a
 * ojo las fotos de flanco/banda de cada modelo en su página de detalle
 * (ids numéricos de Zodo) y se llevaron acá con la URL en tamaño 1600x1200
 * (el CDN de Zodo permite pedir ese tamaño cambiando el sufijo _WxH de la URL
 * del thumbnail 800x600 que trae la página).
 *
 * Usa la misma normalización que las fotos principales (compositeOnWhite:
 * recorte + cuadrado 1200x1200 con fondo blanco) para que se vean parejas en
 * la galería junto a la foto que ya carga el POS.
 */
import { writeFileSync, mkdirSync } from "node:fs";
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
};

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const manifest = {};

  for (const [slug, photos] of Object.entries(SOURCES)) {
    manifest[slug] = [];
    for (let i = 0; i < photos.length; i++) {
      const { url, angulo } = photos[i];
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) {
        console.log(`✗ ${slug} (${angulo}): HTTP ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const outName = `${slug}-${i + 1}.webp`;
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
