// Config de @opennextjs/cloudflare.
//
// El caché incremental va contra un bucket R2 (`neumaticos-trivium-cache`).
// Antes se dejaba el default, que guarda en memoria del isolate: los isolates
// de Cloudflare viven segundos, así que `x-nextjs-cache` daba MISS en TODAS
// las requests y hasta la home `force-static` se re-renderizaba de cero en
// cada visita. Ver https://opennext.js.org/cloudflare/caching
//
// `withRegionalCache` pone el Cache API del datacenter delante de R2 para no
// pagar un round-trip a R2 en cada hit. "long-lived" porque el contenido es
// catálogo con revalidate de 5–15 min, no datos por usuario.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  // Sin tagCache a propósito: el sitio no usa revalidateTag ni revalidatePath
  // (todo revalida por tiempo), así que sumar D1/KV solo agregaría latencia.
  //
  // Sirve el HTML cacheado antes de arrancar el server de Next — es el que
  // evita el render completo en el Worker. No usamos PPR, así que es seguro.
  enableCacheInterception: true,
});
