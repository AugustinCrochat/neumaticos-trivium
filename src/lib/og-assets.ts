import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Los logos se leen como SVG y se embeben como data URI: las imágenes
// generadas con ImageResponse (satori) no pueden hacer fetch a rutas
// relativas de /public, así que hay que pasarles el binario directo.
// Se cachean en memoria del proceso porque no cambian entre requests.
let wordmarkDataUri: string | null = null;
let iconDataUri: string | null = null;

// Los archivos que se generan con generateStaticParams (opengraph-image.tsx
// de producto/medida) corren ENTERO en build time (Node.js con filesystem
// completo) y el resultado queda como PNG estático — ahí readFile siempre
// encuentra el archivo. Pero una ruta que responde en vivo en el Worker de
// Cloudflare (ej. /api/og/equivalencia, que no se puede pre-renderizar
// porque acepta cualquier combinación de medidas por query string) no tiene
// /public en su filesystem: readFile tira ENOENT ahí. `baseUrl` (la URL de
// la propia request) es el fallback para ese caso — trae el SVG por HTTP,
// que sí sirve el binding de assets del Worker.
async function toDataUri(relativePath: string, baseUrl?: string) {
  try {
    const svg = await readFile(join(process.cwd(), relativePath), "utf-8");
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  } catch (err) {
    if (!baseUrl) throw err;
    const publicPath = relativePath.replace(/^(public\/|src\/app\/)/, "");
    const res = await fetch(new URL(`/${publicPath}`, baseUrl));
    if (!res.ok) throw err;
    const svg = await res.text();
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}

/** Isologo completo (ícono + "NEUMÁTICOS TRIVIUM"), texto en blanco.
    `baseUrl` sólo hace falta desde una ruta que corre en vivo en el Worker
    (ver comentario de `toDataUri`) — pasar `request.url`. */
export async function getBrandWordmarkDataUri(baseUrl?: string) {
  if (!wordmarkDataUri) {
    wordmarkDataUri = await toDataUri("public/logo-neumaticos-trivium.svg", baseUrl);
  }
  return wordmarkDataUri;
}

/** Sólo el isotipo (la cubierta), sin texto — para espacios chicos. Ídem
    `baseUrl` que en getBrandWordmarkDataUri. */
export async function getBrandIconDataUri(baseUrl?: string) {
  if (!iconDataUri) {
    iconDataUri = await toDataUri("src/app/icon.svg", baseUrl);
  }
  return iconDataUri;
}

const brandLogoCache = new Map<string, string | null>();

/** Logo de la marca del neumático (no de Trivium) para la og-image de
    producto — sólo unas pocas marcas tienen SVG propio en public/brands/
    (ver BRANDS.logoUrl en data.ts); null para el resto, que cae al nombre
    en texto. */
export async function getTireBrandLogoDataUri(brandId: string, baseUrl?: string): Promise<string | null> {
  if (brandLogoCache.has(brandId)) return brandLogoCache.get(brandId) ?? null;
  try {
    const dataUri = await toDataUri(`public/brands/${brandId}.svg`, baseUrl);
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
