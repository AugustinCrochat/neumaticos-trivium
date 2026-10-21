import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TRIVIUM_WORDMARK_SVG_BASE64, TRIVIUM_ICON_SVG_BASE64 } from "./og-assets-data";
import { BRANDS } from "./data";

// El wordmark y el ícono de Trivium van embebidos como constantes (ver
// og-assets-data.ts) en vez de leerse con fs.readFile: una ruta API dinámica
// como /api/og/equivalencia corre en vivo en el Worker de Cloudflare, donde
// /public no existe en el filesystem (readFile tira ENOENT ahí). Se probó
// un fallback con fetch() a la propia URL del sitio y quedó colgado en
// producción (el Worker haciéndose fetch a sí mismo no resuelve) — mejor no
// depender de I/O en absoluto para dos SVG que nunca cambian.

/** Isologo completo (ícono + "NEUMÁTICOS TRIVIUM"), texto en blanco. */
export async function getBrandWordmarkDataUri() {
  return `data:image/svg+xml;base64,${TRIVIUM_WORDMARK_SVG_BASE64}`;
}

/** Sólo el isotipo (la cubierta), sin texto — para espacios chicos. */
export async function getBrandIconDataUri() {
  return `data:image/svg+xml;base64,${TRIVIUM_ICON_SVG_BASE64}`;
}

const brandLogoCache = new Map<string, string | null>();

/** Logo de la marca del neumático (no de Trivium) para la og-image de
    producto — sólo unas pocas marcas tienen SVG propio en public/brands/
    (ver BRANDS.logoUrl en data.ts); null para el resto, que cae al nombre
    en texto. Sólo se usa desde la og-image de producto, que se pre-renderiza
    entera en build time (generateStaticParams + dynamicParams=false), así
    que fs.readFile ahí es seguro — nunca corre en vivo en el Worker. */
export async function getTireBrandLogoDataUri(brandId: string): Promise<string | null> {
  if (brandLogoCache.has(brandId)) return brandLogoCache.get(brandId) ?? null;
  try {
    const logoUrl = BRANDS.find((b) => b.id === brandId)?.logoUrl;
    // next/og sólo decodifica SVG/PNG/JPEG de forma confiable: el resto (webp) cae al nombre en texto.
    if (!logoUrl?.endsWith(".svg")) {
      brandLogoCache.set(brandId, null);
      return null;
    }
    const svg = await readFile(join(process.cwd(), "public", logoUrl), "utf-8");
    const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
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
    prebuild (ej. en dev sin haber corrido `npm run prebuild` a mano). Igual
    que getTireBrandLogoDataUri, sólo se usa desde og-images que se
    pre-renderizan en build time. */
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
