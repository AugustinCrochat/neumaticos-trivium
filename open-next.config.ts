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
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  // Sin tagCache a propósito: el sitio no usa revalidateTag ni revalidatePath
  // (todo revalida por tiempo), así que sumar D1/KV solo agregaría latencia.
  //
  // Cola de revalidación ISR. Sin esto OpenNext usa la "dummy queue", que
  // tira `FatalError: Dummy queue is not implemented` apenas una entrada del
  // caché se pone stale y hay que revalidarla en background: la request
  // moría con 500 en vez de servir el HTML viejo. Se comió /catalogo,
  // /marcas, /neumaticos/*, /servicios/*, /blog/* y /tuercas-antirrobo,
  // cada una al vencer su `revalidate`.
  //
  // memory-queue alcanza y no suma infra: usa el service binding
  // WORKER_SELF_REFERENCE que ya está en wrangler.jsonc y hace un HEAD a la
  // propia ruta. El dedupe es por isolate (no global como el do-queue), lo
  // que a lo sumo dispara alguna revalidación de más — barato al lado de
  // agregar un Durable Object.
  queue: memoryQueue,
  // Sirve el HTML cacheado antes de arrancar el server de Next — es el que
  // evita el render completo en el Worker. No usamos PPR, así que es seguro.
  enableCacheInterception: true,
});
