"use client";

import { useLiveStock, useLiveStockMap } from "@/contexts/live-stock-context";
import { useBranch } from "@/contexts/branch-context";
import { PrecioTag } from "@/components/ui/PrecioTag";
import { BestPriceBadge } from "@/components/ui/BestPriceBadge";
import { isBestPriceLive, type PricePeer } from "@/lib/best-price";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

// El precio de la ficha viene horneado en el HTML del último build (hasta 2h
// de atraso). Igual que ProductCard, se corrige con el catálogo vivo.
export function LivePrice({ id, price, priceOld, peers, groupLabel, juego = true }: { id: string; price: number; priceOld?: number; peers: PricePeer[]; groupLabel: string; /** Mostrar el total del juego de 4 (no aplica a packs). */ juego?: boolean }) {
  const { selectedBranch } = useBranch();
  // Un local que todavía no abrió no promete la colocación.
  const abierta = !selectedBranch.apertura && !selectedBranch.provisorio;
  const live = useLiveStock(id);
  const current = live?.price ?? price;
  const liveMap = useLiveStockMap();
  const best = isBestPriceLive(id, peers, liveMap);

  return (
    <>
      {priceOld && (
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="text-slate-400 line-through text-sm">{formatPrice(priceOld)}</span>
          <span className="bg-red-600 text-white text-sm font-black px-3 py-1 rounded-full shadow-md shadow-red-600/30 uppercase tracking-tighter animate-pulse">
            {Math.round(((priceOld - current) / priceOld) * 100)}% OFF
          </span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex items-end gap-2">
          <PrecioTag size="xl">{formatPrice(current)}</PrecioTag>
          <span className="pb-1 text-sm font-black uppercase tracking-wide text-slate-500">c/u</span>
        </span>
        {best && <BestPriceBadge label={groupLabel} />}
      </div>
      {/* La cuenta que todos hacen: cuánto sale el juego completo, ya colocado. */}
      {juego && (
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-base font-black text-black">
          <span className="font-display text-2xl font-extrabold italic leading-none">Los 4: {formatPrice(current * 4)}</span>
          {abierta && live?.enStock !== false && <span className="text-xs font-bold text-slate-500">colocados, con válvulas nuevas</span>}
        </p>
      )}
      <p className="text-xs text-slate-500 mt-2">
        Precio por unidad · Precio sin impuestos nacionales: {formatPrice(current / 1.21)}
      </p>
    </>
  );
}
