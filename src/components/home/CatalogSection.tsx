"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, BRANDS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import type { VehicleType } from "@/lib/types";

const PRICE_RANGES = [
  { label: "Hasta $100.000", min: 0, max: 100000 },
  { label: "$100.000 – $150.000", min: 100000, max: 150000 },
  { label: "Más de $150.000", min: 150000, max: Infinity },
];

export function CatalogSection() {
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | "todos">("todos");
  const [brandFilter, setBrandFilter] = useState<string>("todos");
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [onlyEconomic, setOnlyEconomic] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (vehicleFilter !== "todos" && !p.vehicleType.includes(vehicleFilter))
        return false;
      if (brandFilter !== "todos" && p.brandId !== brandFilter) return false;
      if (priceRange !== null) {
        const range = PRICE_RANGES[priceRange];
        if (p.price < range.min || p.price > range.max) return false;
      }
      if (onlyEconomic && !p.isEconomic) return false;
      return true;
    });
  }, [vehicleFilter, brandFilter, priceRange, onlyEconomic]);

  return (
    <section id="catalogo" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-5">
            <div>
              <h2 className="text-3xl font-black text-navy-900 mb-1">
                Catálogo de Neumáticos
              </h2>
              <p className="text-slate-500">
                {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrados
              </p>
            </div>
          </div>
          {/* Buscador por medida */}
          <div className="relative z-30">
            <TireSizeSearch />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between w-full bg-white rounded-xl border border-slate-200 px-5 py-3 text-slate-700 font-bold shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>{showFilters ? "Ocultar filtros" : "Mostrar filtros"}</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Filters sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 lg:block ${showFilters ? "block" : "hidden"}`}>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                Filtros
              </h3>

              {/* Vehicle type */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Tipo de vehículo
                </p>
                <div className="space-y-1">
                  {[
                    { value: "todos", label: "Todos" },
                    { value: "auto", label: "Auto" },
                    { value: "camioneta", label: "Camioneta / SUV" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="vehicle"
                        value={opt.value}
                        checked={vehicleFilter === opt.value}
                        onChange={() => setVehicleFilter(opt.value as VehicleType | "todos")}
                        className="accent-navy-700"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Marca
                </p>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white focus:border-navy-400 outline-none"
                >
                  <option value="todos">Todas las marcas</option>
                  {BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Precio
                </p>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === null}
                      onChange={() => setPriceRange(null)}
                      className="accent-navy-700"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      Todos los precios
                    </span>
                  </label>
                  {PRICE_RANGES.map((range, i) => (
                    <label key={i} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === i}
                        onChange={() => setPriceRange(i)}
                        className="accent-navy-700"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Economic only */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setOnlyEconomic(!onlyEconomic)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      onlyEconomic ? "bg-navy-700" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        onlyEconomic ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Solo económicos
                  </span>
                </label>
              </div>

              {/* Reset */}
              {(vehicleFilter !== "todos" || brandFilter !== "todos" || priceRange !== null || onlyEconomic) && (
                <button
                  onClick={() => {
                    setVehicleFilter("todos");
                    setBrandFilter("todos");
                    setPriceRange(null);
                    setOnlyEconomic(false);
                  }}
                  className="text-sm text-navy-600 hover:text-navy-800 font-semibold w-full text-left transition-colors"
                >
                  ✕ Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-500 font-medium">
                  No hay productos con esos filtros.
                </p>
                <button
                  onClick={() => {
                    setVehicleFilter("todos");
                    setBrandFilter("todos");
                    setPriceRange(null);
                    setOnlyEconomic(false);
                  }}
                  className="mt-3 text-navy-600 hover:text-navy-800 font-semibold text-sm transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
