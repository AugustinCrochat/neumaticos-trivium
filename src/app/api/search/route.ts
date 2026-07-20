import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { matchScore } from "@/lib/fuzzy-search";

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

const MAX_RESULTS = 20;

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query) return Response.json({ results: [] });

  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(), getAccesoriosDesdePOS()]);

  const scored: (SearchResult & { score: number })[] = [];

  for (const p of productos) {
    const searchable = [
      p.brand,
      p.model,
      `${p.size.width}/${p.size.profile}`,
      `${p.size.width} ${p.size.profile}`,
      `r${p.size.rim}`,
      String(p.size.rim),
      p.loadIndex,
      p.speedRating,
      ...p.tags,
    ].filter(Boolean).join(" ");
    const score = matchScore(query, searchable);
    if (score > 0) {
      scored.push({
        type: "tire",
        id: p.id,
        slug: p.slug,
        title: p.model,
        subtitle: p.brand,
        price: p.price,
        imageUrl: p.imageUrl,
        enStock: !!p.enStock,
        score,
      });
    }
  }

  for (const a of accesorios) {
    const searchable = [a.nombre, a.descripcion, a.codigoTango].filter(Boolean).join(" ");
    const score = matchScore(query, searchable);
    if (score > 0) {
      scored.push({
        type: "accessory",
        id: a.id,
        slug: a.slug,
        title: a.nombre,
        subtitle: a.descripcion ?? "Tuerca antirrobo",
        price: a.price,
        imageUrl: a.imageUrl,
        enStock: a.enStock,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const results: SearchResult[] = scored.slice(0, MAX_RESULTS).map(
    ({ type, id, slug, title, subtitle, price, imageUrl, enStock }) => ({ type, id, slug, title, subtitle, price, imageUrl, enStock })
  );

  return Response.json({ results });
}
