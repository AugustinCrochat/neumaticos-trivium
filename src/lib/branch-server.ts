import { DEFAULT_BRANCH_ID } from "./config";

/**
 * Sucursal a usar en Server Components / route handlers.
 *
 * Siempre devuelve la sucursal por defecto, a propósito. Leer la cookie con
 * `cookies()` marca la página como dinámica: /catalogo, /productos/[slug] y
 * compañía salían con `cache-control: private, no-cache, no-store` y se
 * renderizaban enteras en el Worker en cada request (y eso empujó los 1102).
 *
 * Con más de una sucursal el HTML estático se hornea con el catálogo de
 * Argüello, y la sucursal que el visitante eligió se aplica en el cliente:
 * LiveStockProvider (/api/catalogo-vivo?sucursal=) y ProductPageClient
 * (/api/stock/[id]?sucursal=) corrigen stock y precio de la sucursal elegida.
 * Límite conocido: un producto que existe sólo en otra sucursal no aparece en
 * las grillas, y /api/search y /api/accesorios siguen devolviendo Argüello.
 * Cuando haya ecommerce o stock propio en San Justo hay que resolver eso
 * (p. ej. un segmento dinámico por sucursal) en vez de leer la cookie.
 */
export async function getSelectedBranchSlug(): Promise<string> {
  return DEFAULT_BRANCH_ID;
}
