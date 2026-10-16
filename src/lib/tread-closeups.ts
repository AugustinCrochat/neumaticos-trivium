/**
 * Primer plano de la banda de rodamiento de cada foto de producto con una sola
 * cubierta (se genera con scripts/generate-tread-closeups.mjs; la lista de
 * archivos existentes está en tread-closeups.json porque el Worker no lee disco).
 */
import closeups from "./tread-closeups.json";

const AVAILABLE = new Set(closeups as string[]);

/** Ruta pública del primer plano de la banda de `imageUrl`, o null si no hay. */
export function getTreadCloseup(imageUrl: string): string | null {
  const m = /\/images\/products\/([^/?#]+)\.[a-z0-9]+(?:[?#].*)?$/i.exec(imageUrl);
  if (!m || !AVAILABLE.has(m[1])) return null;
  return `/images/products-tread/${m[1]}.webp`;
}
