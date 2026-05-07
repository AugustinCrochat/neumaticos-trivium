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
          <div className="bg-navy-900 rounded-2xl border border-navy-800 px-6 py-6 shadow-2xl relative overflow-visible group z-30">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 32 33">
                <path d="m 13.5,14.5 c -1.5,-0.2 -2.8,-0.7 -3.8,-1.7 -0.7,-0.7 -1.9,-2.3 -1.6,-2.3 0,0 0.3,0.2 0.6,0.4 0.5,0.3 2.3,1.5 3.4,2.1 1,0.6 -1.2,-1 -2.8,-2.1 -1.4,-0.9 -1.6,-1.1 -1.9,-1.8 -0.2,-0.5 -0.7,-2.2 -0.7,-2.4 0,-0.1 0.9,0.6 2.4,2.1 0.8,0.8 1.4,1.3 1.3,1.2 -0.3,-0.5 -1,-1.4 -2.4,-2.7 -1.7,-1.6 -1.6,-1.4 -1.6,-3.4 -0.1,-1.5 0,-1.6 0.5,-1.1 0.5,0.5 1.5,1.8 2,2.6 0.2,0.4 0.4,0.6 0.4,0.6 0.1,-0.1 -0.3,-0.9 -0.5,-1.4 -0.4,-0.7 -0.9,-1.4 -1.7,-2.3 -0.6,-0.6 -0.6,-0.7 -0.6,-1.1 0,-0.6 0.4,-2.6 0.5,-2.7 0.1,-0.1 0.7,0.4 1.1,0.9 0.2,0.3 0.6,0.9 0.8,1.3 l 0.4,0.9 -0.1,-0.5 c -0.1,-0.9 -0.9,-2.4 -1.7,-3 l -0.4,-0.3 0.2,-0.5 c 0.2,-0.6 0.7,-1.6 0.8,-1.8 0.3,-0.4 1.1,0.3 1.5,1.4 0.3,0.8 0.4,0.9 0.4,0.4 0,-0.9 -0.5,-1.8 -1.1,-2.2 l -0.4,-0.2 0.2,-0.3 c 0.4,-0.6 1.2,-1.3 1.4,-1.3 0.4,0 0.8,0.3 0.9,0.8 0.2,0.6 0.3,0.6 0.3,0.2 0.1,-0.5 -0.1,-0.9 -0.5,-1.1 -0.2,-0.1 -0.3,-0.2 -0.3,-0.2 0,-0.1 1,-0.6 1.7,-0.8 0.4,-0.1 1.1,-0.2 1.6,-0.3 1.1,-0.1 5.2,-0.1 5.6,0.1 0.3,0.1 0.3,0.1 -0.1,0.1 -0.5,0 -1.4,0.2 -1.9,0.5 -0.5,0.3 -1.3,1.1 -1.8,1.8 -0.8,1.1 -1.6,3.1 -1.9,4.8 -0.1,0.4 -0.2,0.7 -0.2,0.8 0,0.1 -0.4,0.4 -0.8,0.7 -1.5,1 -2.5,2.5 -2.6,3.5 l 0,0.4 0.3,-0.6 c 0.5,-1 0.9,-1.5 2.2,-2.7 0.4,-0.4 0.7,-0.6 0.8,-0.6 0.1,0 0.1,0.1 0,0.6 0,0.3 -0.1,1.1 -0.1,1.8 l 0,1.2 -0.8,0.9 c -1.2,1.3 -1.7,2.3 -1.7,3.3 0,0.6 0.1,0.5 0.3,-0.2 0.1,-0.3 0.3,-0.7 0.4,-1 0.3,-0.6 1.7,-2.4 1.8,-2.3 0,0 0.1,0.2 0.1,0.3 0,0.4 0.2,1.9 0.4,2.6 0.1,0.3 0.1,0.6 0.1,0.7 0,0.1 -0.3,0.4 -0.5,0.7 -0.5,0.6 -1.1,1.6 -1.1,2.2 0,0.2 0,0.5 0.1,0.6 0.1,0.3 0.1,0.3 0.1,0 -0.1,-0.5 0.4,-1.3 1,-2.2 0.3,-0.5 0.6,-0.9 0.6,-0.9 0,0 0.1,0.3 0.2,0.6 0.2,0.7 0.9,2 1.3,2.6 0.4,0.6 1.2,1.3 1.7,1.5 0.2,0.1 0.7,0.2 0.9,0.3 0.5,0.1 0.5,0.1 0.2,-0.1 -0.6,-0.2 -0.9,-0.4 -1.5,-1 -2,-1.9 -3.1,-5.4 -3.1,-9.6 0,-4.2 1.1,-7.7 3,-9.6 0.9,-1 1.6,-1.3 2.7,-1.3 0.7,0 0.9,0 1.4,0.3 2.4,1.2 4.3,5.5 4.3,10.1 v 0.8 l -0.3,0 c -0.2,0 -0.3,0 -0.4,0 0,0 -0.2,-0.3 -0.4,-0.6 -0.3,-0.5 -0.3,-0.7 -0.4,-1.4 -0.2,-2.2 -1,-4.6 -2.1,-5.7 -2.8,-2.9 -6.1,1 -6.1,7.2 0,3.9 1.2,7 3,7.9 0.6,0.3 1.2,0.4 1.7,0.2 0.2,-0.1 0.5,-0.2 0.5,-0.2 0.1,0 0.2,0.2 0.5,1 l 0.3,1.1 -0.2,0.2 c -0.3,0.3 -0.9,0.5 -1.5,0.6 -0.7,0.3 -2.3,0.5 -3.4,0.5 -1.3,0 -2.7,0 -3.1,-0.1 z m -2.1,-15.5 c 0.2,-0.3 0.7,-0.7 1,-0.9 0.8,-0.5 1.7,-1.3 1.6,-1.3 0,0 -0.4,0.1 -0.8,0.3 -1.3,0.6 -2.3,1.6 -2.8,2.5 -0.3,0.6 -0.3,0.7 0.1,0.2 0.2,-0.2 0.5,-0.6 0.8,-0.9 z m 1.5,-3.7 c 0.3,-0.2 1,-0.6 1.4,-0.8 1.3,-0.6 1.1,-0.7 -0.3,-0.2 -1,0.3 -2.2,1.3 -2.6,1.9 -0.2,0.3 -0.2,0.3 0.4,-0.1 0.3,-0.2 0.8,-0.6 1.1,-0.8 z m 1.1,-2.1 c 0.5,-0.2 1.3,-0.5 1.8,-0.7 l 0.9,-0.3 -0.6,0.1 c -1,0.1 -2.2,0.6 -2.9,1.2 -0.3,0.3 -0.3,0.3 0.8,-0.3 z m 5.4,17.7 c -0.7,-0.2 -1.3,-0.6 -1.7,-1.4 l -0.3,-0.5 0.3,-0.6 c 0.7,-1.4 1,-3.1 1,-5.3 0,-2.2 -0.3,-3.7 -1,-5.1 l -0.3,-0.6 0.2,-0.4 c 0.6,-1 1.6,-1.6 2.3,-1.5 1,0.1 1.8,0.8 2.5,2.2 0.2,0.5 0.5,1.3 0.7,1.7 0.2,0.9 0.5,2.5 0.4,2.6 -0.2,-0.2 -0.4,-0.2 -0.7,-0.2 -0.7,0 -1.1,0.8 -0.8,1.8 l 0.1,0.6 -0.2,0.2 c -0.1,0.1 -0.6,0.8 -1,1.5 -0.7,1.1 -0.8,1.4 -0.8,1.7 0,0.2 0.2,0.9 0.4,1.7 l 0.4,1.3 -0.2,0.1 c -0.4,0.2 -0.9,0.3 -1.3,0.2 z" />
              </svg>
            </div>
            <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-orange-400"></span>
              Encontrá tu medida
            </p>
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
