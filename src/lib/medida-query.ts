import { sizeCatalogHref } from "./size-href";

/**
 * Si lo escrito en el buscador general es una medida de neumático completa
 * ("1756514", "175 65 14", "175/65R14", "175-65-r14"), devuelve el enlace al
 * catálogo por medida; si no, null y se busca como texto libre.
 */
export function medidaQueryHref(query: string): string | null {
  const m = query.trim().match(/^(\d{3})\s*[/\-x ]?\s*(\d{2})\s*[/\-x ]?\s*(?:zr|r)?\s*-?\s*(\d{2})$/i);
  if (!m) return null;
  const [w, p, r] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (w < 115 || w > 355 || p < 20 || p > 90 || r < 12 || r > 26) return null;
  return sizeCatalogHref(m[1], m[2], m[3]);
}
