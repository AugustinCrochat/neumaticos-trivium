import { getProductosDesdePOS } from "@/lib/pos-api";
import { BRANCHES, DEFAULT_BRANCH_ID } from "@/lib/config";

// Igual que /api/stock/[id] pero para el catálogo entero en una sola llamada:
// el stock/precio de `TireProduct` viene horneado en el HTML del último build
// (sitio 100% estático, ver memoria del proyecto), con hasta 2h de atraso.
// ProductCard usa esta ruta (vía LiveStockProvider) para corregirse apenas
// carga la página, en vez de pedir /api/stock/[id] una vez por tarjeta —eso
// dispararía un fetch "fresh" al POS por cada producto listado en una grilla.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sucursalParam = new URL(request.url).searchParams.get("sucursal");
  const branch =
    BRANCHES.find((b) => b.id === sucursalParam) ??
    BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID) ??
    BRANCHES[0];

  const productos = await getProductosDesdePOS(branch.id, { fresh: true });
  const data: Record<string, { enStock: boolean; stock: number; price: number }> = {};
  for (const p of productos) {
    data[p.id] = { enStock: p.enStock ?? false, stock: p.stock ?? 0, price: p.price };
  }

  return Response.json(data, { headers: { "Cache-Control": "no-store" } });
}
