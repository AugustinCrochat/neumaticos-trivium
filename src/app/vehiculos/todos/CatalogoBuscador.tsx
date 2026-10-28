"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { MarcaLogo } from "@/components/ui/MarcaLogo";

export type CatalogoMarca = {
  brand: string;
  anchor: string;
  href: string;
  models: { name: string; href: string; foto: string | null; medidas: string[] }[];
};

const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Buscador del catálogo completo: filtra por marca, modelo o medida (ej. "cronos", "vw gol", "185/65"). */
export function CatalogoBuscador({ marcas }: { marcas: CatalogoMarca[] }) {
  const [q, setQ] = useState("");
  const terms = norm(q.trim()).split(/\s+/).filter(Boolean);
  const coincide = (brand: string, m: CatalogoMarca["models"][number]) => {
    const hay = norm(`${brand} ${m.name} ${m.medidas.join(" ")}`).replace(/\s+r(\d\d)/g, " r$1");
    return terms.every((t) => hay.includes(t));
  };
  const visibles = marcas
    .map((m) => ({ ...m, models: terms.length ? m.models.filter((x) => coincide(m.brand, x)) : m.models }))
    .filter((m) => m.models.length > 0);
  const total = visibles.reduce((a, m) => a + m.models.length, 0);

  return (
    <div>
      <label htmlFor="buscar-modelo" className="sr-only">
        Buscá tu auto por marca, modelo o medida
      </label>
      <input
        id="buscar-modelo"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscá tu auto: Cronos, Hilux, Gol Trend, 185/65 R15…"
        className="mb-4 w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-lg text-black placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
      />
      {!terms.length && (
        <nav aria-label="Marcas" className="mb-10 flex flex-wrap gap-2">
          {marcas.map((m) => (
            <a key={m.anchor} href={`#${m.anchor}`} className="rounded-full bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-orange-600">
              {m.brand}
            </a>
          ))}
        </nav>
      )}
      {terms.length > 0 && (
        <p className="mb-6 text-sm text-slate-600" role="status">
          {total ? `${total} ${total === 1 ? "modelo" : "modelos"} para “${q.trim()}”` : `No encontramos “${q.trim()}”. Probá con la marca o con una parte del nombre.`}
        </p>
      )}
      {visibles.map((marca) => (
        <section key={marca.anchor} id={marca.anchor} className="mb-12 scroll-mt-24">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-300 pb-2">
            <h2 className="flex items-center gap-3 text-2xl font-black text-black">
              <MarcaLogo brand={marca.brand} className="h-9 w-9" />
              Neumáticos para {marca.brand}
            </h2>
            <Link href={marca.href} className="shrink-0 text-sm font-semibold text-orange-600 hover:underline">
              Página de {marca.brand} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {marca.models.map((v) => (
              <Link key={v.href} href={v.href} className="rounded-lg border border-slate-200 bg-white p-3 hover:border-orange-500">
                <div className="flex h-24 items-center justify-center">
                  {v.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.foto} alt={`${marca.brand} ${v.name}`} width={1000} height={560} loading="lazy" className="max-h-full w-auto object-contain" />
                  ) : (
                    <MarcaLogo brand={marca.brand} className="h-14 w-14 opacity-60" />
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-bold text-black">
                  {marca.brand} {v.name}
                </p>
                <p className="truncate text-xs text-slate-600">
                  {v.medidas.slice(0, 3).join(" · ")}
                  {v.medidas.length > 3 ? ` · +${v.medidas.length - 3}` : ""}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
