import { readdirSync, writeFileSync } from "fs";
import path from "path";

const PRODUCTS_DIR = "./public/images/products";
const MANIFEST_PATH = "./src/lib/product-images-manifest.json";

// Lista de archivos que existen hoy en public/images/products, para que
// pos-api.ts pueda resolver el fallback de foto en build-time (import JSON)
// en vez de con fs.existsSync en runtime, que no funciona en Cloudflare Workers.
export function generateImageManifest() {
  const files = readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".webp"));
  writeFileSync(MANIFEST_PATH, JSON.stringify(files.sort(), null, 2) + "\n");
  return files.length;
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  const count = generateImageManifest();
  console.log(`Manifiesto actualizado: ${count} archivos en ${MANIFEST_PATH}`);
}
