// Entrada del Worker: pone la Cache API del datacenter delante del Worker de
// OpenNext para las páginas prearmadas.
//
// Por qué acá y no con una Cache Rule de Cloudflare: las Cache Rules no se
// aplican a respuestas que genera un Worker (solo a lo que el Worker pide a un
// origen), y el sitio entero es un Worker. Sin esto cada visita arrancaba el
// Worker de OpenNext —en frío, 0,5 a 2 s— aunque la página fuera estática.
//
// Seguridad ante deploys: la clave de caché lleva el id de la versión
// desplegada (binding CF_VERSION_METADATA), así que cada deploy arranca con la
// caché vacía y el HTML nunca apunta a chunks de un build anterior. No hace
// falta purgar.
//
// Solo se cachea lo que es seguro: GET de navegación (sin RSC ni prefetch),
// HTML con 200, que el origen marcó como cacheable en el borde (`s-maxage`, o
// sea prearmado) y sin `Set-Cookie`. Todo lo dinámico —/api, /stock, /feed,
// carrito, pago, admin— pasa de largo.
// @ts-ignore: lo genera `opennextjs-cloudflare build`, no existe al chequear tipos.
import openNext from "./.open-next/worker.js";
// @ts-ignore: idem.
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

// La clave ya lleva la versión desplegada y el sitio se redespliega al menos cada
// 2 h (o al cambiar un producto), así que un TTL largo no deja datos viejos: las
// entradas de un build anterior simplemente dejan de usarse. Más TTL = menos MISS.
const TTL_SEGUNDOS = 6 * 60 * 60;
const NO_CACHEAR = ["/api/", "/admin", "/carrito", "/pago", "/stock/", "/feed/", "/_next/", "/cdn-cgi/"];
const HEADERS_DE_NEXT = ["rsc", "next-router-prefetch", "next-router-state-tree", "next-router-segment-prefetch", "next-url"];

type Contexto = { waitUntil(p: Promise<unknown>): void };
type Entorno = { CF_VERSION_METADATA?: { id?: string }; ASSETS?: { fetch(r: Request): Promise<Response> } };
type EdgeCache = { match(r: Request): Promise<Response | undefined>; put(r: Request, res: Response): Promise<void> };

function edgeCache(): EdgeCache | undefined {
  return (globalThis as unknown as { caches?: { default?: EdgeCache } }).caches?.default;
}

function esCacheable(request: Request, url: URL): boolean {
  if (request.method !== "GET") return false;
  if (request.headers.has("range") || request.headers.has("authorization")) return false;
  if (HEADERS_DE_NEXT.some((h) => request.headers.has(h))) return false;
  if (url.searchParams.has("_rsc")) return false;
  return !NO_CACHEAR.some((p) => url.pathname.startsWith(p));
}

// Lo que nunca puede salir de un archivo estático: lo arma el Worker en cada pedido.
const SOLO_WORKER = ["/api/", "/admin", "/carrito", "/pago", "/stock/", "/cdn-cgi/"];

/**
 * El deploy copia el HTML prearmado, los feeds y las listas del buscador a
 * `.open-next/assets` (scripts/copy-prerendered-html.mjs). En producción esos
 * archivos existían pero el Worker de OpenNext respondía igual (pagina vía
 * caché R2, 1102 en frío, /datos/*.json en 404). Acá se prueban primero: si el
 * archivo existe y da 200 se devuelve tal cual, sin arrancar OpenNext; si no
 * (ruta dinámica, 404, redirect) se sigue como siempre.
 */
async function desdeAssets(request: Request, env: Entorno, url: URL): Promise<Response | null> {
  if (!env.ASSETS) return null;
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  if (request.headers.has("range") || request.headers.has("authorization")) return null;
  if (HEADERS_DE_NEXT.some((h) => request.headers.has(h)) || url.searchParams.has("_rsc")) return null;
  if (SOLO_WORKER.some((p) => url.pathname.startsWith(p))) return null;
  try {
    const r = await env.ASSETS.fetch(request);
    return r.status === 200 ? r : null;
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Entorno, ctx: Contexto): Promise<Response> {
    const url = new URL(request.url);
    const estatica = await desdeAssets(request, env, url);
    if (estatica) return estatica;
    const cache = edgeCache();
    if (!cache || !esCacheable(request, url)) {
      return (openNext as { fetch: (r: Request, e: unknown, c: Contexto) => Promise<Response> }).fetch(request, env, ctx);
    }

    const version = env.CF_VERSION_METADATA?.id ?? "sin-version";
    const clave = new Request(`https://cache.internal/pagina/${version}${url.pathname}${url.search}`);

    try {
      const guardada = await cache.match(clave);
      if (guardada) {
        const headers = new Headers(guardada.headers);
        headers.set("cache-control", `public, max-age=0, s-maxage=${TTL_SEGUNDOS}`);
        headers.set("x-trivium-edge", "HIT");
        return new Response(guardada.body, { status: guardada.status, headers });
      }
    } catch {
      // Cache API caída: se sigue como si no hubiera caché.
    }

    const respuesta = await (openNext as { fetch: (r: Request, e: unknown, c: Contexto) => Promise<Response> }).fetch(request, env, ctx);

    const cc = respuesta.headers.get("cache-control") ?? "";
    const cacheable =
      respuesta.status === 200 &&
      (respuesta.headers.get("content-type") ?? "").startsWith("text/html") &&
      /s-maxage=\d+/.test(cc) &&
      !/private|no-store|no-cache/.test(cc) &&
      !respuesta.headers.has("set-cookie");

    if (!cacheable) return respuesta;

    // La copia guardada lleva su propio Cache-Control (la Cache API lo usa para
    // el vencimiento) y sin Vary: solo guardamos navegaciones sin headers de RSC.
    const aGuardar = new Headers(respuesta.headers);
    aGuardar.set("cache-control", `public, max-age=${TTL_SEGUNDOS}`);
    aGuardar.delete("vary");
    ctx.waitUntil(
      cache.put(clave, new Response(respuesta.clone().body, { status: 200, headers: aGuardar })).catch(() => {})
    );

    const headers = new Headers(respuesta.headers);
    headers.set("x-trivium-edge", "MISS");
    return new Response(respuesta.body, { status: respuesta.status, headers });
  },
};
