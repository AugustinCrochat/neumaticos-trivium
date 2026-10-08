import { getProductosDesdePOS } from "@/lib/pos-api";
import { BRANCHES, DEFAULT_BRANCH_ID } from "@/lib/config";

// Igual que /api/stock/[id] pero para el catálogo entero en una sola llamada:
// el stock/precio de `TireProduct` viene horneado en el HTML del último build
// (sitio 100% estático, ver memoria del proyecto), con hasta 2h de atraso.
// ProductCard usa esta ruta (vía LiveStockProvider) para corregirse apenas
// carga la página, en vez de pedir /api/stock/[id] una vez por tarjeta —eso
// dispararía un fetch "fresh" al POS por cada producto listado en una grilla.
export const dynamic = "force-dynamic";

type Entry = { enStock: boolean; stock: number; price: number };

// Cada visita a CUALQUIER página del sitio termina acá (LiveStockProvider vive
// en el layout raíz). Con `fresh: true` directo, cada visita era un fetch al
// POS + mapear todo el catálogo dentro del Worker, y con tráfico de Ads eso
// reventaba el límite de recursos (Cloudflare 1102, 2026-09-30). Por eso la
// respuesta ya armada se reusa 60s por isolate y los pedidos simultáneos
// comparten un único fetch al POS.
const TTL_MS = 60 * 1000;
// Se guarda el JSON ya serializado: reusarlo es devolver un string, sin
// parsear ni volver a stringify el catálogo entero en cada visita.
const cache = new Map<string, { body: string; expires: number }>();
const inflight = new Map<string, Promise<string>>();

// `max-age` hace que el navegador no vuelva a pedirlo en 60s (recargas,
// navegación entre páginas completas); `s-maxage` deja que el edge lo sirva.
const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=60, s-maxage=60",
};

async function cargar(branchId: string): Promise<string> {
  const productos = await getProductosDesdePOS(branchId, { fresh: true });
  const data: Record<string, Entry> = {};
  for (const p of productos) {
    data[p.id] = { enStock: p.enStock ?? false, stock: p.stock ?? 0, price: p.price };
  }
  const body = JSON.stringify(data);
  // Un catálogo vacío es una falla del POS, no "se vendió todo": no cachearlo.
  if (productos.length > 0) cache.set(branchId, { body, expires: Date.now() + TTL_MS });
  return body;
}

export async function GET(request: Request) {
  const sucursalParam = new URL(request.url).searchParams.get("sucursal");
  const branch =
    BRANCHES.find((b) => b.id === sucursalParam) ??
    BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID) ??
    BRANCHES[0];

  const hit = cache.get(branch.id);
  if (hit && hit.expires > Date.now()) return new Response(hit.body, { headers: HEADERS });

  // El caché por isolate no alcanza: con tráfico Cloudflare levanta muchos
  // isolates y cada uno rearmaba el catálogo entero (1102 de nuevo el
  // 2026-09-30 13:52 UTC). La Cache API se comparte entre isolates del mismo
  // datacenter.
  const edge = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;
  const key = new Request(`https://cache.internal/catalogo-vivo/${branch.id}`);
  if (edge) {
    try {
      const cached = await edge.match(key);
      if (cached) {
        const body = await cached.text();
        cache.set(branch.id, { body, expires: Date.now() + TTL_MS });
        return new Response(body, { headers: HEADERS });
      }
    } catch {
      // Sin Cache API (dev local): se sigue con el fetch normal.
    }
  }

  let pending = inflight.get(branch.id);
  if (!pending) {
    pending = cargar(branch.id).finally(() => inflight.delete(branch.id));
    inflight.set(branch.id, pending);
  }
  const body = await pending;

  if (edge && body !== "{}") {
    try {
      await edge.put(key, new Response(body, { headers: HEADERS }));
    } catch {}
  }

  return new Response(body, { headers: HEADERS });
}
