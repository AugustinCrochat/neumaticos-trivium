import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { searchCatalog, type ScoredMatch } from "@/lib/search-catalog";
import { searchContent } from "@/lib/search-content";

export type SearchResult = {
  type: "tire" | "accessory";
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  imageUrl: string | null;
  enStock: boolean;
  /** Solo neumáticos: marca, modelo, medida ("175/65 R14") e índice ("82T"), para que el buscador muestre lo que la gente compara. */
  marca?: string;
  modelo?: string;
  medida?: string;
  indice?: string;
};

// El dropdown del header muestra una vista previa corta; la lista completa
// vive en /busqueda, que llama a searchCatalog directo sin este límite.
const PREVIEW_LIMIT = 8;

function toSearchResult(match: ScoredMatch): SearchResult {
  if (match.type === "tire") {
    const p = match.item;
    return {
      type: "tire", id: p.id, slug: p.slug, title: p.model, subtitle: p.brand, price: p.price, imageUrl: p.imageUrl, enStock: !!p.enStock,
      marca: p.brand, modelo: p.model,
      medida: `${p.size.width}/${p.size.profile} R${p.size.rim}${p.isCarga ? "C" : ""}`,
      indice: `${p.loadIndex ?? ""}${p.speedRating ?? ""}` || undefined,
    };
  }
  const a = match.item;
  return { type: "accessory", id: a.id, slug: a.slug, title: a.nombre, subtitle: a.descripcion ?? "Tuerca antirrobo", price: a.price, imageUrl: a.imageUrl, enStock: a.enStock };
}

// Cada tecla del buscador llega acá: armar el catálogo y puntuar todos los
// productos dentro del Worker por cada pedido empuja el límite de recursos
// (Cloudflare 1102). El resultado se guarda por consulta normalizada, 5 min
// por isolate y en la Cache API (compartida entre isolates del datacenter);
// los precios/stock del buscador ya tienen hasta 2h de atraso por el build.
const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { body: string; expires: number }>();
const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=60, s-maxage=300",
};

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query || query.length > 80) return Response.json({ results: [], matches: [], content: [], total: 0 });

  // `full=1` es para /busqueda: devuelve los productos completos (sin recorte)
  // para que la página los dibuje en el cliente en vez de renderizarlos en el Worker.
  const full = new URL(request.url).searchParams.get("full") === "1";
  const norm = (full ? "full:" : "") + query.toLowerCase().replace(/\s+/g, " ");
  const hit = cache.get(norm);
  if (hit && hit.expires > Date.now()) return new Response(hit.body, { headers: HEADERS });

  const edge = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;
  const key = new Request(`https://cache.internal/search/${encodeURIComponent(norm)}`);
  if (edge) {
    try {
      const cached = await edge.match(key);
      if (cached) {
        const body = await cached.text();
        cache.set(norm, { body, expires: Date.now() + TTL_MS });
        return new Response(body, { headers: HEADERS });
      }
    } catch {
      // Sin Cache API (dev local): se sigue con la búsqueda normal.
    }
  }

  const sucursal = await getSelectedBranchSlug();
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(sucursal), getAccesoriosDesdePOS(sucursal)]);
  const matches = searchCatalog(query, productos, accesorios);
  const body = full
    ? JSON.stringify({ matches: matches.map(({ type, item }) => ({ type, item })), content: searchContent(query, 24), total: matches.length })
    : JSON.stringify({ results: matches.slice(0, PREVIEW_LIMIT).map(toSearchResult), content: searchContent(query, 5), total: matches.length });

  // Catálogo vacío = falla del POS, no "sin resultados": no se cachea.
  if (productos.length > 0) {
    if (cache.size > 200) cache.clear();
    cache.set(norm, { body, expires: Date.now() + TTL_MS });
    if (edge) {
      try {
        await edge.put(key, new Response(body, { headers: HEADERS }));
      } catch {}
    }
  }
  return new Response(body, { headers: HEADERS });
}
