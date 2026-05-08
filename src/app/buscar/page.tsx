import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { SearchBar } from "./SearchBar";
import type { TireProduct, TireSize } from "@/lib/types";

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

function formatSizeLabel(size: { width: number | null; profile: number | null; rim: number | null }) {
  const firstParts = [];
  if (size.width) firstParts.push(size.width);
  if (size.profile) firstParts.push(size.profile);

  const label = firstParts.join("/");
  if (size.rim) return label ? `${label} R${size.rim}` : `R${size.rim}`;
  return label || null;
}

function tireDiameter(size: TireSize) {
  return size.rim * 25.4 + 2 * (size.width * (size.profile / 100));
}

function diameterDifferencePercent(productSize: TireSize, searchedSize: TireSize) {
  const searchedDiameter = tireDiameter(searchedSize);
  const productDiameter = tireDiameter(productSize);
  return ((productDiameter - searchedDiameter) / searchedDiameter) * 100;
}

function isExactMatch(product: TireProduct, size: { width: number | null; profile: number | null; rim: number | null }) {
  if (size.width && product.size.width !== size.width) return false;
  if (size.profile && product.size.profile !== size.profile) return false;
  if (size.rim && product.size.rim !== size.rim) return false;
  return true;
}

function isCompatibleSize(product: TireProduct, size: { width: number | null; profile: number | null; rim: number | null }) {
  if (!size.width || !size.profile || !size.rim) return false;
  if (product.size.rim !== size.rim) return false;
  if (isExactMatch(product, size)) return false;

  const searchedDiameter = tireDiameter({
    width: size.width,
    profile: size.profile,
    rim: size.rim,
  });
  const productDiameter = tireDiameter(product.size);

  return Math.abs(productDiameter - searchedDiameter) / searchedDiameter <= 0.03;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { medida } = await searchParams;
  if (!medida) return { title: "Buscar neumáticos — Trivium" };
  const parsed = parseMedida(medida);
  if (!parsed) return { title: "Buscar neumáticos — Trivium" };
  
  const label = formatSizeLabel(parsed);
  
  return {
    title: `Neumáticos ${label} — Trivium`,
    description: `Encontrá neumáticos en medida ${label} al mejor precio. Outlet de neumáticos importados.`,
  };
}

export default async function BuscarPage({ searchParams }: Props) {
  const { medida } = await searchParams;
  const parsed = medida ? parseMedida(medida) : null;

  const exactResults = parsed
    ? PRODUCTS.filter((p) => isExactMatch(p, parsed))
    : [];

  const compatibleResults = parsed
    ? PRODUCTS.filter((p) => isCompatibleSize(p, parsed))
    : [];
  const searchedSize = parsed?.width && parsed.profile && parsed.rim
    ? { width: parsed.width, profile: parsed.profile, rim: parsed.rim }
    : null;

  const resultsCount = exactResults.length + compatibleResults.length;
  const label = parsed ? formatSizeLabel(parsed) : null;

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
              {exactResults.length} resultado{exactResults.length !== 1 ? "s" : ""} exacto{exactResults.length !== 1 ? "s" : ""}
              {compatibleResults.length > 0 ? ` y ${compatibleResults.length} compatible${compatibleResults.length !== 1 ? "s" : ""}` : ""}
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

        {parsed && resultsCount === 0 && (
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

        {exactResults.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-navy-900 mb-4">
              Medida buscada
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {exactResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {compatibleResults.length > 0 && (
          <section className={exactResults.length > 0 ? "mt-16 border-t border-slate-200 pt-10" : "border-t border-slate-200 pt-10"}>
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-black text-emerald-950">
                    Medidas compatibles
                  </h2>
                  <p className="text-sm text-emerald-800 mt-1">
                    No son la medida buscada: mantienen el mismo rodado y un diámetro total dentro de ±3%.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {compatibleResults.map((product) => {
                const diameterDiff = searchedSize
                  ? diameterDifferencePercent(product.size, searchedSize)
                  : null;

                return (
                  <div key={product.id} className="relative">
                    <div className="absolute left-1/2 top-[calc(60%-0.75rem)] z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-emerald-900/20">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Compatible
                    </div>
                    <ProductCard product={product} />
                    {diameterDiff !== null && (
                      <p className="mt-2 text-center text-xs font-semibold text-emerald-800">
                        Diámetro {diameterDiff >= 0 ? "+" : ""}{diameterDiff.toFixed(1)}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
