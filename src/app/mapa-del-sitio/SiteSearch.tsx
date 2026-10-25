"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export type SearchEntry = { title: string; href: string; kind: string; text: string };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const MAX = 30;

/** Buscador de notas, herramientas y páginas: filtra mientras se escribe, sin pedir nada al servidor. */
export function SiteSearch({ entries }: { entries: SearchEntry[] }) {
  const [q, setQ] = useState("");
  const indexed = useMemo(() => entries.map((e) => ({ e, hay: norm(`${e.title} ${e.kind} ${e.text}`) })), [entries]);

  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return indexed
      .filter(({ hay }) => words.every((w) => hay.includes(w)))
      .map(({ e }) => ({ e, score: words.reduce((n, w) => n + (norm(e.title).includes(w) ? 2 : 1), 0) }))
      .sort((a, b) => b.score - a.score)
      .map((r) => r.e);
  }, [q, indexed]);

  return (
    <section aria-label="Buscar en el sitio" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <label htmlFor="site-search" className="mb-2 block text-sm font-black uppercase tracking-widest text-slate-500">
        Buscá una nota, herramienta o página
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          id="site-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: UTQG, presión, alineación, DOT, Grenlander…"
          autoComplete="off"
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-base font-bold text-tire-950 placeholder:font-medium placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none"
        />
      </div>
      {q.trim() && (
        <div aria-live="polite" className="mt-4">
          {results.length === 0 ? (
            <p className="text-slate-600">
              No encontramos nada para <strong>{q}</strong>. Probá con otra palabra o mirá las secciones de abajo.
            </p>
          ) : (
            <>
              <p className="mb-3 text-sm font-bold text-slate-500">
                {results.length} {results.length === 1 ? "resultado" : "resultados"}
                {results.length > MAX ? ` (se muestran ${MAX})` : ""}
              </p>
              <ul className="grid gap-2 md:grid-cols-2">
                {results.slice(0, MAX).map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="block h-full rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-orange-500 hover:bg-orange-50/40">
                      <span className="text-xs font-black uppercase tracking-wide text-orange-600">{r.kind}</span>
                      <span className="block font-black leading-snug text-tire-950">{r.title}</span>
                      {r.text && <span className="mt-0.5 line-clamp-2 block text-sm text-slate-500">{r.text}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
