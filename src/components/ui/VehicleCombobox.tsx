"use client";

import { useMemo, useState } from "react";
import type { VehiculoOption } from "@/lib/pos-api";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function matchVehiculos(vehiculos: VehiculoOption[], query: string): VehiculoOption[] {
  const q = normalize(query.trim());
  if (!q) return [];

  const starts: VehiculoOption[] = [];
  const includes: VehiculoOption[] = [];

  for (const v of vehiculos) {
    const modelo = normalize(v.modelo);
    const label = normalize(v.label);
    const marca = normalize(v.marca);
    if (modelo.startsWith(q) || label.startsWith(q) || marca.startsWith(q)) {
      starts.push(v);
    } else if (modelo.includes(q) || label.includes(q) || marca.includes(q)) {
      includes.push(v);
    }
  }

  return [...starts, ...includes].slice(0, 10);
}

export function VehicleCombobox({
  vehiculos,
  onSelect,
  placeholder = "Ej: Sandero, Corolla, Amarok, 208...",
  autoFocus = false,
}: {
  vehiculos: VehiculoOption[];
  onSelect: (vehicle: VehiculoOption) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const matches = useMemo(() => matchVehiculos(vehiculos, query), [vehiculos, query]);

  function select(vehicle: VehiculoOption) {
    onSelect(vehicle);
    setQuery("");
    setIsOpen(false);
  }

  function handleChange(value: string) {
    setQuery(value);
    setSelectedIndex(0);
    setIsOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || matches.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = matches[selectedIndex] || matches[0];
      if (target) select(target);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-navy-500/10 outline-none"
        />
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden py-1 max-h-72 overflow-y-auto">
          {matches.length > 0 ? (
            matches.map((v, idx) => (
              <button
                key={`${v.marca}-${v.modelo}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(v);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  idx === selectedIndex ? "bg-orange-50 text-navy-900 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="font-bold text-navy-900">{v.modelo}</span>{" "}
                <span className="text-slate-400">({v.marca})</span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-400">No encontramos ese modelo. Podés buscar por la medida grabada en tu neumático.</p>
          )}
        </div>
      )}
    </div>
  );
}
