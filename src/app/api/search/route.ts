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

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query) return Response.json({ results: [], total: 0 });

  const sucursal = await getSelectedBranchSlug();
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(sucursal), getAccesoriosDesdePOS(sucursal)]);
  const matches = searchCatalog(query, productos, accesorios);
  const results = matches.slice(0, PREVIEW_LIMIT).map(toSearchResult);

  return Response.json({ results, total: matches.length });
}
