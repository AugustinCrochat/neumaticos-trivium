import type { Metadata } from "next";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { searchCatalog } from "@/lib/search-catalog";
import { ProductCard } from "@/components/ui/ProductCard";
import { AccessoryCard } from "@/components/ui/AccessoryCard";

export const revalidate = 300;

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  return { title: query ? `Resultados para "${query}" — Trivium` : "Buscar — Trivium" };
}

export default async function BusquedaPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg font-medium">Ingresá un término de búsqueda.</p>
      </div>
    );
  }

  const sucursal = await getSelectedBranchSlug();
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(sucursal), getAccesoriosDesdePOS(sucursal)]);
  const matches = searchCatalog(query, productos, accesorios);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-1">
        Resultados para &quot;{query}&quot;
      </h1>
      <p className="text-slate-500 mb-6">
        {matches.length} resultado{matches.length !== 1 ? "s" : ""}
      </p>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500 font-medium">No encontramos nada para &quot;{query}&quot;.</p>
          <p className="text-sm text-slate-400 mt-1">Probá con otra marca, medida o código.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {matches.map((m) =>
            m.type === "tire" ? (
              <ProductCard key={`tire-${m.item.id}`} product={m.item} />
            ) : (
              <AccessoryCard key={`accessory-${m.item.id}`} accessory={m.item} />
            )
          )}
        </div>
      )}
    </div>
  );
}
