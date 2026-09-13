"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { isLowStock, stockLabel } from "@/lib/stock";
import type { Accessory } from "@/lib/types";

export function AccessoryAddToCart({ accessory }: { accessory: Accessory }) {
  const { addAccessory } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      {accessory.enStock && (
        <p className={`text-[11px] font-bold mb-2 flex items-center gap-1.5 ${isLowStock(accessory.stock) ? "text-amber-600" : "text-emerald-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLowStock(accessory.stock) ? "bg-amber-500" : "bg-emerald-500"}`} />
          {stockLabel(accessory.stock)}
        </p>
      )}

      {accessory.enStock ? (
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-xl border border-slate-200">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-slate-600 hover:bg-slate-50" aria-label="Reducir cantidad">−</button>
            <span className="w-6 text-center text-sm font-bold">{quantity}</span>
            <button onClick={() => setQuantity((q) => Math.min(8, q + 1))} className="px-3 py-2.5 text-slate-600 hover:bg-slate-50" aria-label="Aumentar cantidad">+</button>
          </div>
          <button
            onClick={() => addAccessory(accessory, quantity)}
            className="flex-1 bg-black hover:bg-neutral-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Agregar
          </button>
        </div>
      ) : (
        <button disabled className="w-full bg-slate-300 text-white font-semibold py-2.5 rounded-xl text-sm">
          Sin stock
        </button>
      )}
    </div>
  );
}
