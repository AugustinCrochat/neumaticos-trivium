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
const cache = new Map<string, { data: Record<string, Entry>; expires: number }>();
const inflight = new Map<string, Promise<Record<string, Entry>>>();

async function cargar(branchId: string): Promise<Record<string, Entry>> {
  const productos = await getProductosDesdePOS(branchId, { fresh: true });
  const data: Record<string, Entry> = {};
  for (const p of productos) {
    data[p.id] = { enStock: p.enStock ?? false, stock: p.stock ?? 0, price: p.price };
  }
  // Un catálogo vacío es una falla del POS, no "se vendió todo": no cachearlo.
  if (productos.length > 0) cache.set(branchId, { data, expires: Date.now() + TTL_MS });
  return data;
}

export async function GET(request: Request) {
  const sucursalParam = new URL(request.url).searchParams.get("sucursal");
  const branch =
    BRANCHES.find((b) => b.id === sucursalParam) ??
    BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID) ??
    BRANCHES[0];

  const hit = cache.get(branch.id);
  let data: Record<string, Entry>;
  if (hit && hit.expires > Date.now()) {
    data = hit.data;
  } else {
    let pending = inflight.get(branch.id);
    if (!pending) {
      pending = cargar(branch.id).finally(() => inflight.delete(branch.id));
      inflight.set(branch.id, pending);
    }
    data = await pending;
  }

  return Response.json(data, { headers: { "Cache-Control": "no-store" } });
}
