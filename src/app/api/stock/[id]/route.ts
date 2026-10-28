import { getProductosDesdePOS } from "@/lib/pos-api";
import { BRANCHES, DEFAULT_BRANCH_ID } from "@/lib/config";

// El sitio es 100% estático (ver memoria del proyecto: la cola de
// revalidación con Durable Object agotó el free tier de Cloudflare y bloqueó
// la cuenta) — el stock que trae cada ficha de producto queda grabado en el
// HTML del último build/deploy, que puede tener hasta 2h de atraso. Esta
// ruta, en cambio, es dinámica y saltea el caché del POS (fresh: true) como
// ya hace /stock/[medida], así que ProductPageClient la usa para corregir el
// botón de compra y el badge de stock apenas carga la página, sin tener que
// volver estática toda la ficha.
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sucursalParam = new URL(request.url).searchParams.get("sucursal");
  const branch = BRANCHES.find((b) => b.id === sucursalParam) ?? BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID) ?? BRANCHES[0];

  const productos = await getProductosDesdePOS(branch.id, { fresh: true });
  const product = productos.find((p) => p.id === id);
  if (!product) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json(
    { enStock: product.enStock ?? false, stock: product.stock ?? 0, vendidos: product.vendidos ?? 0 },
    { headers: { "Cache-Control": "no-store" } }
  );
}
