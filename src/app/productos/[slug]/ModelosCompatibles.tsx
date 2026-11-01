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
  /** Foto del auto sin fondo, si la tiene. */
  foto: string | null;
  /** Posición en la lista de modelos populares (0 = el más popular), -1 si no está. */
  rank: number;
};

const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const POPULARES = 8;
const VISIBLES = 36;

/**
 * "Modelos de auto compatibles" de la ficha de un neumático: primero los autos
 * más populares con su foto, y el resto en una sola lista (sin separar por
 * marca). Un buscador filtra ambos, porque en medidas comunes (185/65 R15,
 * 205/55 R16) la lista pasa los cien modelos y a ojo no se encuentra el propio.
 */
export function ModelosCompatibles({ items }: { items: ModeloCompatible[] }) {
  const [q, setQ] = useState("");
  const [todos, setTodos] = useState(false);
  const query = norm(q.trim());

  const populares = items
    .filter((i) => i.rank >= 0 && i.foto)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, POPULARES);
  const esPopular = new Set(populares.map((i) => i.href));
  const resto = items
    .filter((i) => !esPopular.has(i.href))
    .sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`, "es", { numeric: true }));

  const coincide = (i: ModeloCompatible) => norm(`${i.brand} ${i.model}`).includes(query);
  const popFiltrados = query ? populares.filter(coincide) : populares;
  const restoFiltrado = query ? resto.filter(coincide) : resto;
  const abierta = todos || !!query;
  const visibles = abierta ? restoFiltrado : restoFiltrado.slice(0, VISIBLES);

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
        className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-navy-900 outline-none focus:border-navy-400"
      />

      {popFiltrados.length === 0 && restoFiltrado.length === 0 && (
        <p className="text-sm text-slate-600">No hay un modelo con ese nombre para esta medida.</p>
      )}

      {popFiltrados.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {popFiltrados.map((v) => (
            <li key={v.href}>
              <Link
                href={v.href}
                title={v.full || undefined}
                className="group flex h-full flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center transition-colors hover:border-orange-400"
              >
                <span className="flex h-20 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.foto!} alt={`${v.brand} ${v.model}`} loading="lazy" decoding="async" className="max-h-20 w-auto max-w-full object-contain" />
                </span>
                <span className="mt-2 flex items-center justify-center gap-1.5 text-sm font-black text-navy-900">
                  <MarcaLogo brand={v.brand} className="h-4 w-4" />
                  {v.brand} {v.model}
                </span>
                {v.detail && <span className="mt-0.5 text-xs text-slate-500">{v.detail}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {restoFiltrado.length > 0 && (
        <div className={popFiltrados.length > 0 ? "mt-6" : ""}>
          {popFiltrados.length > 0 && <p className="mb-2 text-sm font-black text-navy-900">Más modelos</p>}
          <ul className="flex flex-wrap gap-2">
            {visibles.map((v) => (
              <li key={v.href}>
                <Link
                  href={v.href}
                  title={v.full || undefined}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-bold text-navy-900 hover:border-navy-300"
                >
                  {v.brand} {v.model}
                  {v.detail && <span className="text-xs font-normal text-slate-500">{v.detail}</span>}
                </Link>
              </li>
            ))}
            {!abierta && restoFiltrado.length > VISIBLES && (
              <li>
                <button
                  type="button"
                  onClick={() => setTodos(true)}
                  className="rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-600 hover:border-navy-300 hover:text-navy-900"
                >
                  + {restoFiltrado.length - VISIBLES} más
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
