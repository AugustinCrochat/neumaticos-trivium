import { BRANCHES, DEFAULT_BRANCH_ID } from "./config";

/**
 * Sucursal a usar en Server Components / route handlers.
 *
 * Antes esto leía la cookie de sucursal con `cookies()`. El problema: llamar a
 * `cookies()` marca la página como dinámica, así que /catalogo, /buscar,
 * /productos/[slug], /marcas/[slug], /tuercas-antirrobo y compañía salían con
 * `cache-control: private, no-cache, no-store` y se renderizaban enteras en el
 * Worker en cada request — el `export const revalidate = 300` de esas páginas
 * era letra muerta. Todo eso para leer una cookie que hoy siempre devuelve lo
 * mismo, porque BRANCHES tiene una sola sucursal (Argüello).
 *
 * Sigue siendo `async` para no tocar los ~12 call sites, y el `if` de abajo
 * hace que el día que se agregue una segunda sucursal el build falle acá y no
 * en silencio con precios de la sucursal equivocada. Cuando llegue ese día hay
 * que volver a la cookie, pero moviendo el catálogo a un slot/segmento
 * dinámico para no volver a tirar el caché de todo el sitio.
 */
export async function getSelectedBranchSlug(): Promise<string> {
  if (BRANCHES.length > 1) {
    throw new Error(
      "Hay más de una sucursal: getSelectedBranchSlug() tiene que volver a leer la cookie de sucursal (ver el comentario de este archivo)."
    );
  }
  return DEFAULT_BRANCH_ID;
}
