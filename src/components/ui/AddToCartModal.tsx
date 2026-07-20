"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/contexts/cart-context";
import type { TireProduct } from "@/lib/types";

export function AddToCartModal({ product, onClose }: { product: TireProduct; onClose: () => void }) {
  const { addTire } = useCart();
  const [quantity, setQuantity] = useState(2);

  function addAndClose(qty: number) {
    addTire(product, qty);
    onClose();
  }

  // Portal a document.body: la card "más barata" tiene scale-[1.02], y un
  // transform en un ancestro convierte a ESE elemento en el contenedor de
  // los descendientes fixed — sin el portal, el modal quedaba atrapado
  // dentro de la tarjeta en vez de cubrir toda la pantalla.
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Elegir cantidad">
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Agregar al carrito</p>
          <h2 className="text-navy-900 font-black leading-snug mt-0.5">{product.brand} {product.model}</h2>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-sm font-bold text-slate-600 mb-2">Cantidad</p>
            <div className="flex gap-2 mb-3">
              <button onClick={() => addAndClose(2)} className={`flex-1 rounded-xl border-2 py-2.5 font-black transition-colors ${quantity === 2 ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                2
              </button>
              <button onClick={() => addAndClose(4)} className={`flex-1 rounded-xl border-2 py-2.5 font-black transition-colors ${quantity === 4 ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                4
              </button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold" aria-label="Reducir cantidad">−</button>
              <span className="w-8 text-center font-black text-navy-900 text-lg">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(8, q + 1))} className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold" aria-label="Aumentar cantidad">+</button>
            </div>
          </div>

          <p className="text-xs text-slate-500 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            Colocación y cambio de válvulas sin cargo en nuestra sucursal.
          </p>
        </div>

        <div className="p-5 pt-0">
          <button onClick={() => addAndClose(quantity)} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 transition-colors">
            Agregar {quantity} al carrito
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
