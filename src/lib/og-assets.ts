import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Los logos se leen como SVG y se embeben como data URI: las imágenes
// generadas con ImageResponse (satori) no pueden hacer fetch a rutas
// relativas de /public, así que hay que pasarles el binario directo.
// Se cachean en memoria del proceso porque no cambian entre requests.
let wordmarkDataUri: string | null = null;
let iconDataUri: string | null = null;

async function toDataUri(relativePath: string) {
  const svg = await readFile(join(process.cwd(), relativePath), "utf-8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Isologo completo (ícono + "NEUMÁTICOS TRIVIUM"), texto en blanco. */
export async function getBrandWordmarkDataUri() {
  if (!wordmarkDataUri) {
    wordmarkDataUri = await toDataUri("public/logo-neumaticos-trivium.svg");
  }
  return wordmarkDataUri;
}

/** Sólo el isotipo (la cubierta), sin texto — para espacios chicos. */
export async function getBrandIconDataUri() {
  if (!iconDataUri) {
    iconDataUri = await toDataUri("src/app/icon.svg");
  }
  return iconDataUri;
}

const brandLogoCache = new Map<string, string | null>();

/** Logo de la marca del neumático (no de Trivium) para la og-image de
    producto — sólo unas pocas marcas tienen SVG propio en public/brands/
    (ver BRANDS.logoUrl en data.ts); null para el resto, que cae al nombre
    en texto. */
export async function getTireBrandLogoDataUri(brandId: string): Promise<string | null> {
  if (brandLogoCache.has(brandId)) return brandLogoCache.get(brandId) ?? null;
  try {
    const dataUri = await toDataUri(`public/brands/${brandId}.svg`);
    brandLogoCache.set(brandId, dataUri);
    return dataUri;
  } catch {
    brandLogoCache.set(brandId, null);
    return null;
  }
}

const branchPhotoCache = new Map<string, string | null>();

/** Foto de fachada de una sucursal, ya convertida a PNG por
    scripts/generate-og-branch-photos.mjs (ver ese script: next/og no sabe
    decodificar webp). Se usa como fondo de las og-image "genéricas" (home,
    medida) — null si esa sucursal todavía no tiene foto o no corrió el
    prebuild (ej. en dev sin haber corrido `npm run prebuild` a mano). */
export async function getBranchPhotoDataUri(fileBaseName: string): Promise<string | null> {
  if (branchPhotoCache.has(fileBaseName)) return branchPhotoCache.get(fileBaseName) ?? null;
  try {
    const png = await readFile(join(process.cwd(), "public", "og-cache", "branches", `${fileBaseName}.png`));
    const dataUri = `data:image/png;base64,${png.toString("base64")}`;
    branchPhotoCache.set(fileBaseName, dataUri);
    return dataUri;
  } catch {
    branchPhotoCache.set(fileBaseName, null);
    return null;
  }
}
