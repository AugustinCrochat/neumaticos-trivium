"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { SearchResult } from "@/app/api/search/route";
import type { ContentResult } from "@/lib/search-content";
import { medidaQueryHref } from "@/lib/medida-query";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

function hrefFor(r: SearchResult) {
  return r.type === "tire" ? `/productos/${r.slug}` : `/tuercas-antirrobo/${r.slug}`;
}

export function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [content, setContent] = useState<ContentResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setContent([]);
      setTotal(0);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!query.trim()) return;
    // Debounce: sincroniza con el endpoint de búsqueda 400ms después de que
    // el usuario deja de tipear, en vez de pegarle a la API en cada tecla.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // `cancelled` descarta respuestas de una búsqueda vieja que llegan después
    // de que el usuario siguió escribiendo.
    let cancelled = false;
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.json();
        })
        .then((data: { results: SearchResult[]; content?: ContentResult[]; total: number }) => {
          if (cancelled) return;
          setFailed(false);
          setResults(data.results);
          setContent(data.content ?? []);
          setTotal(data.total);
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          // Un error de red o del servidor no es "sin resultados": se avisa
          // aparte y se ofrece la página completa de búsqueda.
          setFailed(true);
          setResults([]);
          setContent([]);
          setTotal(0);
          setLoading(false);
        });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  function goToResultsPage() {
    if (!query.trim()) return;
    // Una medida completa ("1756514", "175 65 14") va directo al catálogo por medida.
    const medida = medidaQueryHref(query);
    if (medida) {
      router.push(medida);
      onClose();
      return;
    }
    router.push(`/busqueda?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28" role="dialog" aria-modal="true" aria-label="Buscar productos">
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToResultsPage();
          }}
          className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0"
        >
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
          <button type="button" onClick={onClose} aria-label="Cerrar búsqueda" className="text-slate-400 hover:text-slate-700 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>

        <div className="overflow-y-auto">
          {medidaQueryHref(query) && (
            <button onClick={goToResultsPage} className="w-full border-b border-slate-100 p-3 text-left text-sm font-black text-orange-600 hover:bg-slate-50">
              Ver neumáticos en esa medida &rarr;
            </button>
          )}

          {loading && <p className="p-6 text-center text-sm text-slate-400">Buscando…</p>}

          {!loading && failed && (
            <button onClick={goToResultsPage} className="w-full p-6 text-center text-sm text-slate-500 hover:bg-slate-50">
              No pudimos buscar ahora. Tocá acá para ver los resultados de &quot;{query}&quot;.
            </button>
          )}

          {!loading && !failed && query.trim().length > 0 && results.length === 0 && content.length === 0 && (
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

          {!loading && content.length > 0 && (
            <div className="border-t border-slate-100">
              <p className="px-3 pt-3 text-[11px] font-black uppercase tracking-wide text-slate-400">Notas y páginas</p>
              {content.map((c) => (
                <Link
                  key={c.href + c.title}
                  href={c.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-50 last:border-b-0 transition-colors"
                >
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">{c.kind}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-navy-900">{c.title}</span>
                    <span className="block truncate text-xs text-slate-500">{c.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          {!loading && total > results.length && (
            <button
              onClick={goToResultsPage}
              className="w-full p-3 text-center text-sm font-bold text-orange-600 hover:bg-slate-50 transition-colors"
            >
              Ver los {total} resultados
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
