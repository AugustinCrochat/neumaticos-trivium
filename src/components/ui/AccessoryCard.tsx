"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { isLowStock, stockLabel } from "@/lib/stock";
import type { Accessory } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

const LOCK_SVG = (
  <svg
    className="w-full h-full text-slate-300 group-hover:text-slate-400 transition-colors"
    viewBox="0 0 100 100"
    fill="none"
  >
    <rect x="25" y="45" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="8" />
    <path d="M35 45V32a15 15 0 0 1 30 0v13" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <circle cx="50" cy="63" r="6" fill="currentColor" />
  </svg>
);

export function AccessoryCard({ accessory }: { accessory: Accessory }) {
  const { addAccessory } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <article className="group bg-white rounded-2xl border border-slate-100 hover:border-navy-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative bg-white pt-[95%] overflow-hidden">
        <div className="absolute inset-0 p-4">
          {accessory.imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={accessory.imageUrl}
                alt={accessory.nombre}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full max-h-32">{LOCK_SVG}</div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 text-sm mb-3 line-clamp-2" title={accessory.nombre}>
          {accessory.nombre}
        </h3>

        <div className="mt-auto">
          <span className="text-2xl font-black text-red-600">{formatPrice(accessory.price)}</span>

          {accessory.enStock && (
            <p className={`text-[11px] font-bold mt-1.5 flex items-center gap-1.5 ${isLowStock(accessory.stock) ? "text-amber-600" : "text-emerald-600"}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLowStock(accessory.stock) ? "bg-amber-500" : "bg-emerald-500"}`} />
              {stockLabel(accessory.stock)}
            </p>
          )}

          {accessory.enStock ? (
            <div className="mt-3 flex items-center gap-2">
              <div className="inline-flex items-center rounded-xl border border-slate-200">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-slate-600 hover:bg-slate-50" aria-label="Reducir cantidad">−</button>
                <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(8, q + 1))} className="px-3 py-2.5 text-slate-600 hover:bg-slate-50" aria-label="Aumentar cantidad">+</button>
              </div>
              <button
                onClick={() => addAccessory(accessory, quantity)}
                className="flex-1 bg-navy-800 hover:bg-navy-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Agregar
              </button>
            </div>
          ) : (
            <button disabled className="mt-3 w-full bg-slate-300 text-white font-semibold py-2.5 rounded-xl text-sm">
              Sin stock
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
