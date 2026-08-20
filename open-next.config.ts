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
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import withCachedQueue from "@opennextjs/cloudflare/overrides/queue/queue-cache";

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  // Sin tagCache a propósito: el sitio no usa revalidateTag ni revalidatePath
  // (todo revalida por tiempo), así que sumar D1/KV solo agregaría latencia.
  //
  // Cola de revalidación ISR. Sin `queue` OpenNext usa la dummy queue, que
  // tira `FatalError: Dummy queue is not implemented` apenas vence un
  // `revalidate` — eso tiraba el sitio entero con 500.
  //
  // Tiene que ser el queue de Durable Object, NO memory-queue. OpenNext hace
  // `await queue.send(...)` DENTRO de la request del usuario (ver
  // cacheInterceptor). memory-queue resuelve ese send haciendo un fetch a la
  // propia ruta y esperándolo, así que el render completo de la página se
  // paga en la request que lo disparó: probado en producción, daba
  // `exceededCpu` / error 1102 y hasta 503 en la home.
  //
  // DOQueueHandler.revalidate() en cambio agenda el trabajo con
  // `ctx.waitUntil` del propio Durable Object y devuelve enseguida: el render
  // corre fuera de la request y con el presupuesto de CPU del DO. Además
  // dedupea entre isolates (memory-queue solo dentro de uno) y reintenta con
  // backoff si falla.
  //
  // El wrapper `withCachedQueue` suma dos cosas: no vuelve a encolar la misma
  // ruta durante 30s (menos llamadas al DO), y atrapa cualquier excepción del
  // send. Eso último es el seguro de vida: si la revalidación falla, la
  // request sirve el HTML viejo (que es lo que stale-while-revalidate
  // promete) en vez de devolver 500.
  queue: withCachedQueue(doQueue, { regionalCacheTtlSec: 30 }),
  // Sirve el HTML cacheado antes de arrancar el server de Next — es el que
  // evita el render completo en el Worker. No usamos PPR, así que es seguro.
  enableCacheInterception: true,
});
