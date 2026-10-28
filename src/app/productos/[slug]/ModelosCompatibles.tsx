"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { MarcaLogo } from "@/components/ui/MarcaLogo";

export type ModeloCompatible = {
  brand: string;
  model: string;
  /** Años de las generaciones que usan esta medida (texto corto del chip). */
  detail: string;
  /** Generación / años / versión completos, para el tooltip. */
  full: string;
  /** Ficha del modelo (/vehiculos/<slug>). */
  href: string;
  /** Página de la marca (/vehiculos/marca/<slug>). */
  brandHref: string;
};

const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const VISIBLES = 12;

/**
 * "Modelos de auto compatibles" de la ficha de un neumático: agrupados por
 * marca (con logo y enlace a la página de la marca), con un buscador de modelo
 * y atajos por marca, porque en medidas comunes (185/65 R15, 205/55 R16) la
 * lista pasa los cien modelos y a ojo no se encuentra el propio.
 */
export function ModelosCompatibles({ items }: { items: ModeloCompatible[] }) {
  const [q, setQ] = useState("");
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set());
  const query = norm(q.trim());

  const filtrados = query ? items.filter((i) => norm(`${i.brand} ${i.model}`).includes(query)) : items;
  const porMarca = new Map<string, ModeloCompatible[]>();
  for (const i of filtrados) porMarca.set(i.brand, [...(porMarca.get(i.brand) ?? []), i]);
  const marcas = [...porMarca.keys()].sort((a, b) => a.localeCompare(b, "es"));
  const idDe = (b: string) => `compat-${norm(b).replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <label htmlFor="buscar-modelo-compatible" className="sr-only">
        Buscá tu modelo
      </label>
      <input
        id="buscar-modelo-compatible"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Buscá tu modelo entre ${items.length}: Cronos, Corsa, 208...`}
        className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-navy-900 outline-none focus:border-navy-400"
      />

      {marcas.length > 1 && (
        <ul className="mb-6 flex flex-wrap gap-2" aria-label="Ir a una marca">
          {marcas.map((b) => (
            <li key={b}>
              <a
                href={`#${idDe(b)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2 pr-3 text-xs font-bold text-navy-900 hover:border-navy-300"
              >
                <MarcaLogo brand={b} className="h-4 w-4" />
                {b}
                <span className="font-normal text-slate-400">{porMarca.get(b)!.length}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {marcas.length === 0 && <p className="text-sm text-slate-600">No hay un modelo con ese nombre para esta medida.</p>}

      <div className="space-y-6">
        {marcas.map((b) => {
          const lista = porMarca.get(b)!;
          const abierta = abiertas.has(b) || !!query;
          const visibles = abierta ? lista : lista.slice(0, VISIBLES);
          return (
            <section key={b} id={idDe(b)} className="scroll-mt-24">
              <h3 className="mb-2 flex items-center gap-2 text-base font-black text-navy-900">
                <MarcaLogo brand={b} className="h-6 w-6" />
                <Link href={lista[0].brandHref} className="hover:text-orange-600">
                  {b}
                </Link>
                <span className="text-sm font-normal text-slate-400">
                  {lista.length} {lista.length === 1 ? "modelo" : "modelos"}
                </span>
                <Link href={lista[0].brandHref} className="ml-auto text-xs font-bold text-navy-700 underline underline-offset-4 hover:text-navy-900">
                  Ver todos los {b} →
                </Link>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {visibles.map((v) => (
                  <li key={`${v.model}-${v.detail}`}>
                    <Link
                      href={v.href}
                      title={v.full || undefined}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-bold text-navy-900 hover:border-navy-300"
                    >
                      {v.model}
                      {v.detail && <span className="text-xs font-normal text-slate-500">{v.detail}</span>}
                    </Link>
                  </li>
                ))}
                {!abierta && lista.length > VISIBLES && (
                  <li>
                    <button
                      type="button"
                      onClick={() => setAbiertas(new Set(abiertas).add(b))}
                      className="rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-600 hover:border-navy-300 hover:text-navy-900"
                    >
                      + {lista.length - VISIBLES} más
                    </button>
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
