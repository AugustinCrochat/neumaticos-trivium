"use client";

import { useLiveStock } from "@/contexts/live-stock-context";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

// El precio de la ficha viene horneado en el HTML del último build (hasta 2h
// de atraso). Igual que ProductCard, se corrige con el catálogo vivo.
export function LivePrice({ id, price, priceOld }: { id: string; price: number; priceOld?: number }) {
  const live = useLiveStock(id);
  const current = live?.price ?? price;

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
      <span className="text-4xl font-black text-red-600">{formatPrice(current)}</span>
      <p className="text-xs text-slate-400 mt-1">
        Precio por unidad · Precio sin impuestos nacionales: {formatPrice(current / 1.21)}
      </p>
    </>
  );
}
