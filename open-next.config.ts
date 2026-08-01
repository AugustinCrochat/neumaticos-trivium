import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

/**
 * Caché incremental sobre R2.
 *
 * Antes se usaba el caché por defecto, que no persiste entre isolates: cada
 * isolate frío de Cloudflare volvía a renderizar la página y, sobre todo, a
 * pedirle el catálogo al POS. Eso fue lo que hizo que la home tardara 3
 * segundos en el primer hit cuando se le agregó un fetch (ver el historial de
 * PopularSizesSection).
 *
 * El override cubre las dos capas que comparten este almacenamiento:
 *  - Páginas ISR (`revalidate`), como las 45 landings de /neumaticos/[medida].
 *  - El Data Cache de `fetch`, que es lo que usa getProductosDesdePOS con
 *    `next: { revalidate: 300 }`. Son 19 rutas las que dependen de ese fetch,
 *    incluidas /catalogo y las fichas de producto, que además leen la cookie de
 *    sucursal y por eso se renderizan por request: con esto, al menos dejan de
 *    salir a la red del POS en cada isolate nuevo.
 *
 * No se configura tagCache porque el proyecto no usa revalidateTag ni
 * revalidatePath. Si algún día se usan, hay que sumarlo o la invalidación por
 * tag no va a funcionar.
 *
 * Se podría envolver con `withRegionalCache(..., { mode: "long-lived" })` para
 * ahorrar el viaje a R2 dentro de cada región. Se deja afuera por ahora: agrega
 * una capa más de desincronización posible entre regiones y el problema que
 * había que resolver era la persistencia, no la latencia.
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
