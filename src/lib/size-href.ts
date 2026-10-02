/**
 * A dónde mandar una búsqueda por medida hecha desde el buscador interactivo
 * (TireSizeSearch).
 *
 * Con los tres valores completos va a la landing estática /neumaticos/205-55-r16:
 * se renderiza en el servidor (precio y stock reales en el HTML, sin esperar
 * JS) y es indexable. /buscar en cambio filtra en el cliente con
 * useSearchParams — el HTML que recibe cualquier bot que no ejecuta
 * JavaScript (ChatGPT, Perplexity, Google-Extended, etc.) es una cáscara sin
 * precios, así que mandar ahí una medida completa la hacía invisible para esos
 * bots (confirmado: un cliente reportó que ChatGPT no podía traerle el precio
 * de una medida que sí estaba en stock). Con una medida parcial (sólo ancho, o
 * ancho y perfil) sigue yendo a /buscar, que sabe filtrar por coincidencia
 * parcial y no tiene equivalente estático indexable de todos modos.
 *
 * Con `economicos` va siempre a /buscar?...&economicos=1, aunque la medida
 * esté completa: ese filtro vive en el cliente y la landing estática no lo
 * conoce.
 *
 * Vive en su propio módulo, sin imports, porque lo usan componentes cliente:
 * si estuviera en tire-sizes.ts arrastraría VEHICLE_DB entero al bundle.
 */
export function sizeSearchHref(width: string, profile: string, rim: string, economicos = false): string {
  const completa = width.length === 3 && profile.length === 2 && rim.length === 2;
  const medida = `${width}-${profile}-r${rim}`;
  if (economicos) return `/buscar?medida=${medida}&economicos=1`;
  return completa ? `/neumaticos/${medida}` : `/buscar?medida=${medida}`;
}
