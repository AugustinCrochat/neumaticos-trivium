"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, BRANDS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { useBranch } from "@/contexts/branch-context";
import type { TireProduct, TireSize, VehicleType } from "@/lib/types";

const PRICE_RANGES = [
  { label: "Hasta $100.000", min: 0, max: 100000 },
  { label: "$100.000 – $150.000", min: 100000, max: 150000 },
  { label: "Más de $150.000", min: 150000, max: Infinity },
];

function parseMedida(medida: string) {
  const parts = medida.toLowerCase().split("-");
  const width = parts[0] ? Number(parts[0]) : null;
  const profile = parts[1] ? Number(parts[1]) : null;
  const rim = parts[2] && parts[2].startsWith("r") ? Number(parts[2].substring(1)) : null;
  if (!width && !profile && !rim) return null;
  return { width, profile, rim };
}

function formatSizeLabel(size: { width: number | null; profile: number | null; rim: number | null }) {
  const parts: (string | number)[] = [];
  if (size.width) parts.push(size.width);
  if (size.profile) parts.push(size.profile);
  const label = parts.join("/");
  if (size.rim) return label ? `${label} R${size.rim}` : `R${size.rim}`;
  return label || null;
}

function tireDiameter(size: TireSize) {
  return size.rim * 25.4 + 2 * (size.width * (size.profile / 100));
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
  const searchedDiameter = tireDiameter({ width: size.width, profile: size.profile, rim: size.rim });
  const productDiameter = tireDiameter(product.size);
  return Math.abs(productDiameter - searchedDiameter) / searchedDiameter <= 0.03;
}

function diameterDifferencePercent(productSize: TireSize, searchedSize: TireSize) {
  const d = tireDiameter(searchedSize);
  return ((tireDiameter(productSize) - d) / d) * 100;
}

function getUnitPrice(product: TireProduct) {
  const packTag = product.tags.find(t => t.toLowerCase().startsWith("pack"));
  if (packTag) {
    const match = packTag.match(/x(\d+)/i);
    if (match && match[1]) return product.price / parseInt(match[1], 10);
  }
  return product.price;
}

function FilterBar({
  vehicleFilter, setVehicleFilter,
  brandFilter, setBrandFilter,
  priceRange, setPriceRange,
  onlyEconomic, setOnlyEconomic,
  hasActiveFilters, clearFilters,
  layout,
}: {
  vehicleFilter: VehicleType | "todos";
  setVehicleFilter: (v: VehicleType | "todos") => void;
  brandFilter: string;
  setBrandFilter: (v: string) => void;
  priceRange: number | null;
  setPriceRange: (v: number | null) => void;
  onlyEconomic: boolean;
  setOnlyEconomic: (v: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  layout: "horizontal" | "vertical";
}) {
  if (layout === "horizontal") {
    return (
      <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm mb-5">
        {/* Vehicle type pills */}
        <div className="flex items-center gap-1">
          {([
            { value: "todos", label: "Todos" },
            { value: "auto", label: "Auto" },
            { value: "camioneta", label: "Camioneta / SUV" },
          ] as const).map(opt => (
            <button
              key={opt.value}
              onClick={() => setVehicleFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                vehicleFilter === opt.value ? "bg-navy-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />
        <select
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:border-navy-400 outline-none"
        >
          <option value="todos">Todas las marcas</option>
          {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select
          value={priceRange ?? ""}
          onChange={e => setPriceRange(e.target.value === "" ? null : Number(e.target.value))}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:border-navy-400 outline-none"
        >
          <option value="">Todos los precios</option>
          {PRICE_RANGES.map((range, i) => <option key={i} value={i}>{range.label}</option>)}
        </select>
        <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => setOnlyEconomic(!onlyEconomic)}
            className={`w-8 h-4 rounded-full relative transition-colors ${onlyEconomic ? "bg-navy-700" : "bg-slate-200"}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${onlyEconomic ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm font-medium text-slate-700">Solo económicos</span>
        </label>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="ml-auto text-sm text-navy-600 hover:text-navy-800 font-semibold transition-colors">
            ✕ Limpiar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-6 shadow-sm">
      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Filtros</h3>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tipo de vehículo</p>
        <div className="space-y-1">
          {([
            { value: "todos", label: "Todos" },
            { value: "auto", label: "Auto" },
            { value: "camioneta", label: "Camioneta / SUV" },
          ] as const).map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="vehicle-m" value={opt.value} checked={vehicleFilter === opt.value}
                onChange={() => setVehicleFilter(opt.value)} className="accent-navy-700" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Marca</p>
        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white focus:border-navy-400 outline-none">
          <option value="todos">Todas las marcas</option>
          {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Precio</p>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="price-m" checked={priceRange === null} onChange={() => setPriceRange(null)} className="accent-navy-700" />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Todos los precios</span>
          </label>
          {PRICE_RANGES.map((range, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="price-m" checked={priceRange === i} onChange={() => setPriceRange(i)} className="accent-navy-700" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setOnlyEconomic(!onlyEconomic)}
            className={`w-10 h-5 rounded-full transition-colors relative ${onlyEconomic ? "bg-navy-700" : "bg-slate-200"}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${onlyEconomic ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm font-medium text-slate-700">Solo económicos</span>
        </label>
      </div>
      {hasActiveFilters && (
        <button onClick={clearFilters} className="text-sm text-navy-600 hover:text-navy-800 font-semibold w-full text-left transition-colors">
          ✕ Limpiar filtros
        </button>
      )}
    </div>
  );
}

export function ShopPage({ showCatalogTitle = false }: { showCatalogTitle?: boolean }) {
  const { selectedBranch, hasConfirmedBranch, openModalForAction } = useBranch();
  const searchParams = useSearchParams();
  const medida = searchParams.get("medida") ?? undefined;

  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | "todos">("todos");
  const [brandFilter, setBrandFilter] = useState("todos");
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [onlyEconomic, setOnlyEconomic] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const parsed = useMemo(() => (medida ? parseMedida(medida) : null), [medida]);

  const { exactResults, compatibleResults, allProducts } = useMemo(() => {
    const ok = (p: TireProduct) => {
      if (vehicleFilter !== "todos" && !p.vehicleType.includes(vehicleFilter as VehicleType)) return false;
      if (brandFilter !== "todos" && p.brandId !== brandFilter) return false;
      if (priceRange !== null) {
        const r = PRICE_RANGES[priceRange];
        if (p.price < r.min || p.price > r.max) return false;
      }
      if (onlyEconomic && !p.isEconomic) return false;
      return true;
    };

    if (!parsed) {
      return { exactResults: [], compatibleResults: [], allProducts: PRODUCTS.filter(ok) };
    }

    const exact = PRODUCTS.filter(p => isExactMatch(p, parsed) && ok(p))
      .sort((a, b) => getUnitPrice(a) - getUnitPrice(b));
    const compatible = PRODUCTS.filter(p => isCompatibleSize(p, parsed) && ok(p));

    return { exactResults: exact, compatibleResults: compatible, allProducts: [] };
  }, [parsed, vehicleFilter, brandFilter, priceRange, onlyEconomic]);

  const label = parsed ? formatSizeLabel(parsed) : null;
  const searchedSize: TireSize | null =
    parsed?.width && parsed.profile && parsed.rim
      ? { width: parsed.width, profile: parsed.profile, rim: parsed.rim }
      : null;
  const cheapestExactId = exactResults[0]?.id ?? null;
  const hasActiveFilters =
    vehicleFilter !== "todos" || brandFilter !== "todos" || priceRange !== null || onlyEconomic;

  const filterProps = {
    vehicleFilter, setVehicleFilter,
    brandFilter, setBrandFilter,
    priceRange, setPriceRange,
    onlyEconomic, setOnlyEconomic,
    hasActiveFilters,
    clearFilters() {
      setVehicleFilter("todos");
      setBrandFilter("todos");
      setPriceRange(null);
      setOnlyEconomic(false);
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sidebar — search widget only */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-8 lg:self-start">
            <TireSizeSearch compact />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Mobile: filter toggle + collapsible panel */}
            <div className="lg:hidden mb-4 flex flex-col gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full bg-white rounded-xl border border-slate-200 px-5 py-3 text-slate-700 font-bold shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>{showFilters ? "Ocultar filtros" : "Mostrar filtros"}</span>
                </div>
                <svg className={`w-5 h-5 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFilters && <FilterBar {...filterProps} layout="vertical" />}
            </div>

            {/* Desktop: horizontal filter bar */}
            <div className="hidden lg:block">
              <FilterBar {...filterProps} layout="horizontal" />
            </div>

            {/* ── Catalog mode (no medida) ── */}
            {!parsed && showCatalogTitle && (
              <>
                <div className="mb-4">
                  <h1 className="text-3xl font-black text-navy-900 mb-1">Catálogo de Neumáticos</h1>
                  <p className="text-slate-500">
                    {allProducts.length} producto{allProducts.length !== 1 ? "s" : ""} encontrados
                  </p>
                </div>
                {allProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-500 font-medium">No hay productos con esos filtros.</p>
                    <button onClick={filterProps.clearFilters} className="mt-3 text-navy-600 hover:text-navy-800 font-semibold text-sm transition-colors">
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Buscar mode — no medida entered ── */}
            {!parsed && !showCatalogTitle && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-slate-400 text-lg font-medium">Ingresá una medida para buscar.</p>
              </div>
            )}

            {/* ── Search results ── */}
            {parsed && exactResults.length === 0 && compatibleResults.length === 0 && (
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
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      const waUrl = (branch: typeof selectedBranch) =>
                        `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                          `Hola, no encontré neumáticos en medida ${label} en la web. ¿Tienen stock disponible?`
                        )}`;
                      if (hasConfirmedBranch) {
                        window.open(waUrl(selectedBranch), "_blank", "noopener,noreferrer");
                      } else {
                        openModalForAction((branch) =>
                          window.open(waUrl(branch), "_blank", "noopener,noreferrer")
                        );
                      }
                    }}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Consultar por WhatsApp</span>
                  </button>
                  <Link href="/catalogo" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-navy-800 border border-slate-200 font-semibold py-2.5 px-6 rounded-xl text-sm transition-all active:scale-[0.98]">
                    Ver catálogo completo
                  </Link>
                </div>
              </div>
            )}

            {parsed && exactResults.length > 0 && (
              <section>
                <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mb-4">
                  <h2 className="text-xl font-black text-navy-900">Medida buscada</h2>
                  {label && <span className="text-base font-bold text-slate-500">{label}</span>}
                  <span className="text-sm text-slate-400">
                    {exactResults.length} resultado{exactResults.length !== 1 ? "s" : ""}
                  </span>
                  {exactResults.length > 5 && (
                    <span className="text-sm text-slate-400 ml-auto">Mostrando 5 de {exactResults.length}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {exactResults.slice(0, 5).map(product => (
                    <ProductCard key={product.id} product={product} isCheapest={product.id === cheapestExactId} />
                  ))}
                </div>
              </section>
            )}

            {parsed && compatibleResults.length > 0 && (
              <section className={exactResults.length > 0 ? "mt-16 border-t border-slate-100 pt-10" : ""}>
                {/* No exact match notice */}
                {exactResults.length === 0 && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                    </svg>
                    <p className="text-sm text-slate-600">
                      No encontramos la medida exacta{label && <> <strong className="font-bold text-slate-800">{label}</strong></>}.
                      {" "}Pero hay medidas compatibles que pueden funcionar en tu vehículo.
                    </p>
                  </div>
                )}

                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <div className="flex items-baseline gap-3">
                        <h2 className="text-xl font-black text-emerald-950">Medidas compatibles</h2>
                        {compatibleResults.length > 5 && (
                          <span className="text-sm text-emerald-700">{compatibleResults.length} resultados</span>
                        )}
                      </div>
                      <p className="text-sm text-emerald-800 mt-1">
                        No son la medida buscada: mantienen el mismo rodado y un diámetro total dentro de ±3%.{" "}
                        <Link href="/blog/equivalencias" className="font-semibold underline hover:text-emerald-950">
                          Entendé cómo funcionan las equivalencias.
                        </Link>
                      </p>
                      <p className="text-xs text-yellow-900 mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2 shadow-sm">
                        <svg className="w-5 h-5 flex-shrink-0 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>
                          <span className="font-bold">Importante:</span> Para usar otra medida que la de fábrica, el auto tiene que ser de caja manual. Es necesario probar luego de la instalación que el neumático de medida distinta no toque partes del tren delantero o los plásticos del auto.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {compatibleResults.slice(0, 5).map(product => {
                    const diff = searchedSize ? diameterDifferencePercent(product.size, searchedSize) : null;
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        imageFooter={
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-white shadow-lg shadow-emerald-900/20">
                            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Compatible</span>
                            {diff !== null && (
                              <span className="border-l border-white/30 pl-1.5">
                                {diff >= 0 ? "+" : ""}{diff.toFixed(1)}%
                              </span>
                            )}
                          </span>
                        }
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
