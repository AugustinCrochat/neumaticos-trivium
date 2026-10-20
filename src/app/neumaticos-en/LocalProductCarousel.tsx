"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import type { TireProduct } from "@/lib/types";

/**
 * Carrusel de neumáticos con stock para las landings locales: el objetivo es
 * que quien llega buscando "neumáticos en <zona>" caiga en un producto con
 * precio en el primer scroll, sin pasar por el catálogo. Los chips de rodado
 * acotan la lista; el scroll es nativo (snap) y las flechas son un extra para
 * escritorio.
 */
export function LocalProductCarousel({
  productos,
  mejores,
  titulo,
}: {
  productos: TireProduct[];
  /** id -> medida del tag "Mejor precio" (Map no serializa entre server y client). */
  mejores: [string, string][];
  titulo: string;
}) {
  const [rim, setRim] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const mejoresMap = useMemo(() => new Map(mejores), [mejores]);

  const rodados = useMemo(
    () => [...new Set(productos.map((p) => p.size.rim))].sort((a, b) => a - b),
    [productos]
  );
  const lista = rim === null ? productos : productos.filter((p) => p.size.rim === rim);

  const mover = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const pill = (activo: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors ${
      activo
        ? "border-[#ff1e00] bg-[#ff1e00] text-white"
        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
    }`;

  if (productos.length === 0) return null;

  return (
    <section className="mb-12" aria-label={titulo}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-black text-navy-900">{titulo}</h2>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => mover(-1)}
            aria-label="Anteriores"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-black text-navy-900 hover:border-slate-500"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            aria-label="Siguientes"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-black text-navy-900 hover:border-slate-500"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button type="button" className={pill(rim === null)} onClick={() => setRim(null)}>
          Todos
        </button>
        {rodados.map((r) => (
          <button key={r} type="button" className={pill(rim === r)} onClick={() => setRim(r)}>
            Rodado {r}
          </button>
        ))}
      </div>

      <div
        ref={scroller}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 py-3"
      >
        {lista.map((p) => (
          <div key={p.id} className="w-[68vw] max-w-[260px] shrink-0 snap-start md:w-[250px]">
            <ProductCard
              product={p}
              isCheapest={mejoresMap.has(p.id)}
              cheapestLabel={mejoresMap.get(p.id)}
            />
          </div>
        ))}
        <Link
          href="/catalogo"
          className="flex w-[68vw] max-w-[260px] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-lg font-black text-navy-900 hover:border-[#ff1e00] md:w-[250px]"
        >
          Ver todo el catálogo →
        </Link>
      </div>
    </section>
  );
}
