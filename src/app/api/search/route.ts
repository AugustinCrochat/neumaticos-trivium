import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { searchCatalog, type ScoredMatch } from "@/lib/search-catalog";

export type SearchResult = {
  type: "tire" | "accessory";
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  imageUrl: string | null;
  enStock: boolean;
};

// El dropdown del header muestra una vista previa corta; la lista completa
// vive en /busqueda, que llama a searchCatalog directo sin este límite.
const PREVIEW_LIMIT = 8;

function toSearchResult(match: ScoredMatch): SearchResult {
  if (match.type === "tire") {
    const p = match.item;
    return { type: "tire", id: p.id, slug: p.slug, title: p.model, subtitle: p.brand, price: p.price, imageUrl: p.imageUrl, enStock: !!p.enStock };
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
  if (!query) return Response.json({ results: [], total: 0 });
  if (query.length > 80) return Response.json({ results: [], total: 0 });

  const norm = query.toLowerCase().replace(/\s+/g, " ");
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
  const results = matches.slice(0, PREVIEW_LIMIT).map(toSearchResult);
  const body = JSON.stringify({ results, total: matches.length });

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
