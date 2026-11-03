"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { useLiveStockMap } from "@/contexts/live-stock-context";
import { restoDelDia } from "@/lib/fin-del-dia";

export type Relampago = {
  id: string;
  slug: string;
  titulo: string;
  medida: string;
  imageUrl: string;
  price: number;
  priceOld: number;
  pct: number;
  stock: number;
};

const dos = (n: number) => String(n).padStart(2, "0");
const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

/**
 * Tres medidas destacadas con cuenta regresiva hasta el fin del día. Se calcula en
 * el navegador (el sitio es estático) y arranca vacía para no desfasar la hidratación.
 * Las unidades salen del stock real: "última unidad" solo si queda una.
 */
export function OfertaRelampago({ items }: { items: Relampago[] }) {
  const [resto, setResto] = useState<number | null>(null);
  const live = useLiveStockMap();
  useEffect(() => {
    const tick = () => setResto(restoDelDia());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const h = resto == null ? null : Math.floor(resto / 3600_000);
  const m = resto == null ? null : Math.floor((resto % 3600_000) / 60_000);
  const s = resto == null ? null : Math.floor((resto % 60_000) / 1000);
  const caja = (v: number | null, et: string) => (
    <div className="flex min-w-[3.6rem] flex-col items-center rounded-lg bg-black px-2 py-1.5">
      <span className="font-display text-3xl font-bold leading-none text-white tabular-nums">{v == null ? "--" : dos(v)}</span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">{et}</span>
    </div>
  );

  return (
    <section id="relampago" className="scroll-mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff1e00] to-[#b30f00] p-5 text-white shadow-xl md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-md bg-white px-3 py-1 text-xs font-black uppercase tracking-widest text-[#ff1e00]">
            Oferta del día
          </span>
          <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none tracking-wide md:text-5xl">
            Tres medidas, hoy
          </h2>
          <p className="mt-1 text-sm text-white/85">Hasta agotar stock o hasta las 23:59.</p>
        </div>
        <div role="timer" aria-label="Tiempo que queda de la oferta del día" className="flex items-center gap-1.5">
          {caja(h, "hs")}
          <span className="font-display text-3xl font-bold">:</span>
          {caja(m, "min")}
          <span className="font-display text-3xl font-bold">:</span>
          {caja(s, "seg")}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((p) => {
          const stock = live[p.id]?.stock ?? p.stock;
          return (
            <Link
              key={p.id}
              href={`/productos/${p.slug}`}
              className="group flex gap-4 rounded-2xl bg-white p-4 text-slate-900 transition-transform hover:-translate-y-0.5 md:flex-col"
            >
              <span className="relative block h-28 w-28 shrink-0 md:h-44 md:w-full">
                <span className="absolute left-0 top-0 z-10 rounded-md bg-[#ff1e00] px-2 py-1 text-xs font-black text-white">
                  -{p.pct}%
                </span>
                <Image src={p.imageUrl} alt={p.titulo} fill className="object-contain" sizes="(max-width: 768px) 112px, 30vw" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-2xl font-bold uppercase leading-tight">{p.medida}</span>
                <span className="block truncate text-sm font-bold text-slate-500">{p.titulo}</span>
                <span className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#ff1e00]">{fmt(p.price)}</span>
                  <span className="text-sm text-slate-400 line-through">{fmt(p.priceOld)}</span>
                </span>
                <span className="mt-1 block text-xs font-black uppercase tracking-wide text-slate-600">
                  {stock === 1 ? "Última unidad" : stock > 1 && stock <= 10 ? `Quedan ${stock}` : "Colocación sin cargo"}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
