/**
 * A dónde mandar una búsqueda por medida hecha desde el buscador interactivo
 * (TireSizeSearch): siempre a /buscar, que muestra los resultados de catálogo
 * (precio, stock, agregar al carrito) para esa medida, sea completa o parcial.
 *
 * Las landings /neumaticos/205-55-r16 siguen existiendo para SEO (crawlers,
 * links internos del footer/sitemap), pero quien está buscando activamente en
 * la web espera ver el catálogo, no una ficha informativa — antes las medidas
 * completas mandaban ahí y parecía que "el buscador no andaba".
 *
 * Vive en su propio módulo, sin imports, porque lo usan componentes cliente:
 * si estuviera en tire-sizes.ts arrastraría VEHICLE_DB entero al bundle.
 */
export function sizeSearchHref(width: string, profile: string, rim: string): string {
  return `/buscar?medida=${width}-${profile}-r${rim}`;
}
