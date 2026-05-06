import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { SearchBar } from "./SearchBar";

type Props = { searchParams: Promise<{ medida?: string }> };

function parseMedida(medida: string) {
  // Format: "195-55-r15" or partials like "195--r15" or "195-55-r"
  const parts = medida.toLowerCase().split("-");
  const width = parts[0] ? Number(parts[0]) : null;
  const profile = parts[1] ? Number(parts[1]) : null;
  const rim = parts[2] && parts[2].startsWith("r") ? Number(parts[2].substring(1)) : null;
  
  if (!width && !profile && !rim) return null;
  return { width, profile, rim };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { medida } = await searchParams;
  if (!medida) return { title: "Buscar neumáticos — Trivium" };
  const parsed = parseMedida(medida);
  if (!parsed) return { title: "Buscar neumáticos — Trivium" };
  
  const parts = [];
  if (parsed.width) parts.push(parsed.width);
  if (parsed.profile) parts.push(parsed.profile);
  if (parsed.rim) parts.push(`R${parsed.rim}`);
  const label = parts.join("/");
  
  return {
    title: `Neumáticos ${label} — Trivium`,
    description: `Encontrá neumáticos en medida ${label} al mejor precio. Outlet de neumáticos importados.`,
  };
}

export default async function BuscarPage({ searchParams }: Props) {
  const { medida } = await searchParams;
  const parsed = medida ? parseMedida(medida) : null;

  const results = parsed
    ? PRODUCTS.filter((p) => {
        if (parsed.width && p.size.width !== parsed.width) return false;
        if (parsed.profile && p.size.profile !== parsed.profile) return false;
        if (parsed.rim && p.size.rim !== parsed.rim) return false;
        return true;
      })
    : [];

  const parts = [];
  if (parsed?.width) parts.push(parsed.width);
  if (parsed?.profile) parts.push(parsed.profile);
  if (parsed?.rim) parts.push(`R${parsed.rim}`);
  const label = parts.length > 0 ? parts.join("/") : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-navy-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Inicio
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
            {label ? (
              <>
                Neumáticos{" "}
                <span className="text-orange-400 font-mono">{label}</span>
              </>
            ) : (
              "Buscar neumáticos"
            )}
          </h1>
          {label && (
            <p className="text-navy-300 text-sm">
              {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* Search form inline */}
          <div className="mt-6">
            <SearchBar initialMedida={medida} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {!parsed && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg font-medium">
              Seleccioná una medida para buscar.
            </p>
          </div>
        )}

        {parsed && results.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-600 font-semibold text-lg mb-2">
              No encontramos neumáticos en medida {label}
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Consultanos por WhatsApp, es posible que tengamos stock no publicado.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors"
            >
              Ver catálogo completo
            </Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
