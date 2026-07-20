"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SearchResult } from "@/app/api/search/route";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

function hrefFor(r: SearchResult) {
  return r.type === "tire" ? `/productos/${r.slug}` : `/tuercas-antirrobo/${r.slug}`;
}

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!query.trim()) return;
    // Debounce: sincroniza con el endpoint de búsqueda 250ms después de que
    // el usuario deja de tipear, en vez de pegarle a la API en cada tecla.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data: { results: SearchResult[] }) => setResults(data.results))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28" role="dialog" aria-modal="true" aria-label="Buscar productos">
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Buscar por medida, marca, modelo, código..."
            className="flex-1 min-w-0 outline-none text-base text-navy-900 placeholder:text-slate-400"
          />
          <button onClick={onClose} aria-label="Cerrar búsqueda" className="text-slate-400 hover:text-slate-700 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto">
          {loading && <p className="p-6 text-center text-sm text-slate-400">Buscando…</p>}

          {!loading && query.trim().length > 0 && results.length === 0 && (
            <p className="p-6 text-center text-sm text-slate-400">No encontramos nada para &quot;{query}&quot;.</p>
          )}

          {!loading && results.map((r) => (
            <Link
              key={`${r.type}-${r.id}`}
              href={hrefFor(r)}
              onClick={onClose}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-50 last:border-b-0 transition-colors"
            >
              <div className="relative w-12 h-12 bg-slate-50 rounded-lg shrink-0 overflow-hidden">
                {r.imageUrl && <Image src={r.imageUrl} alt="" fill sizes="48px" className="object-contain p-1" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-navy-900 truncate">{r.title}</p>
                <p className="text-xs text-slate-500 truncate">{r.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-red-600">{formatPrice(r.price)}</p>
                {!r.enStock && <p className="text-[11px] text-slate-400">Sin stock</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
