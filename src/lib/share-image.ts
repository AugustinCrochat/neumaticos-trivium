import { SITE_URL } from "./config";

/**
 * Imágenes que se ven al compartir un link. Son JPEG que genera
 * scripts/generate-og-share-images.mjs en el prebuild (public/og-cache/share/),
 * a partir de las fotos .webp del repo.
 */
const BASE = `${SITE_URL}/og-cache/share`;

export const SHARE_SIZE = { width: 1200, height: 630 };

/** Fotos del local y el taller para páginas sin foto propia (medidas, rodados). */
const POOL = [
  "branches/arguello-fachada",
  "local/fachada-local-neumaticos-trivium-cordoba",
  "local/camionetas-en-elevador-taller-neumaticos-trivium-cordoba",
  "local/taxi-en-el-taller-neumaticos-trivium-cordoba",
  "local/pickup-4x4-en-elevador-alineacion-neumaticos-trivium-cordoba",
  "local/rotacion-de-neumaticos-pirelli-rueda-desmontada-trivium",
  "local/cubierta-perfil-bajo-grenlander-colocada-neumaticos-trivium",
  "local/neumatico-grenlander-kingpro-one-pickup-trivium",
];

function withImage(url: string, size?: { width: number; height: number }) {
  return {
    openGraph: { images: [{ url, ...size }] },
    twitter: { card: "summary_large_image" as const, images: [url] },
  };
}

/** Foto del producto sin recortar; null si no es una foto local del catálogo. */
export function productShare(imageUrl: string) {
  const m = imageUrl.match(/\/images\/products\/([^/?#]+)\.webp$/i);
  return m ? withImage(`${BASE}/products/${m[1]}.jpg`) : null;
}

/** Miniatura de una foto de /images/{local,blog,servicios,branches}/. */
export function siteShare(src: string) {
  const m = src.match(/\/images\/(local|blog|servicios|branches)\/([^/?#]+)\.webp$/i);
  return m ? withImage(`${BASE}/site/${m[1]}/${m[2]}.jpg`, SHARE_SIZE) : null;
}

/** Una foto del local elegida de forma estable a partir de una clave (p. ej. la medida). */
export function poolShare(key: string) {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return withImage(`${BASE}/site/${POOL[h % POOL.length]}.jpg`, SHARE_SIZE);
}

/** Imagen por defecto del sitio (la misma que app/opengraph-image.jpg), para JSON-LD. */
export const DEFAULT_SHARE_URL = `${BASE}/site/branches/arguello-fachada.jpg`;
