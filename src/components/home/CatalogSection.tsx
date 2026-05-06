"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, BRANDS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-navy-900 mb-1">
              Catálogo de Neumáticos
            </h2>
            <p className="text-slate-500">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrados
            </p>
          </div>
          <a
            href="#hero"
            className="inline-flex items-center gap-2 text-navy-600 hover:text-navy-800 text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar por medida
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-6">
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
