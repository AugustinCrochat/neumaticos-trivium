"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useBranch } from "@/contexts/branch-context";
import { useCart } from "@/contexts/cart-context";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export function CartDrawer() {
  const { items, total, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const { selectedBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: selectedBranch.id,
          items: items.map(({ id, quantity }) => ({ id, quantity })),
        }),
      });
      const data = await response.json() as { initPoint?: string; error?: string };
      if (!response.ok || !data.initPoint) throw new Error(data.error || "No pudimos iniciar el pago.");
      window.location.assign(data.initPoint);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "No pudimos iniciar el pago.");
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <button aria-label="Cerrar carrito" onClick={closeCart} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-xl font-black text-navy-900">Tu carrito</h2>
          <button onClick={closeCart} className="p-2 text-slate-500 hover:text-slate-900" aria-label="Cerrar">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="font-bold text-navy-900">Tu carrito está vacío.</p>
            <Link href="/catalogo" onClick={closeCart} className="mt-4 text-orange-600 font-bold underline underline-offset-4">Ver neumáticos</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-slate-100 pb-4">
                  <div className="relative w-16 h-16 bg-slate-50 rounded-lg shrink-0">
                    <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-navy-900 leading-snug line-clamp-2">{item.model}</p>
                    <p className="text-sm font-black text-red-600 mt-1">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-slate-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50" aria-label="Reducir cantidad">−</button>
                        <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50" aria-label="Aumentar cantidad">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs font-bold text-slate-400 hover:text-red-600">Quitar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 p-5 bg-slate-50">
              <div className="flex justify-between text-lg font-black text-navy-900 mb-1"><span>Total</span><span>{formatPrice(total)}</span></div>
              <p className="text-xs text-slate-500 mb-4">Retirás en Sucursal {selectedBranch.shortName}. Precio sujeto a validación de stock al confirmar el pedido.</p>
              {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
              <button onClick={checkout} disabled={isLoading} className="w-full rounded-xl bg-[#009ee3] hover:bg-[#008dcc] disabled:opacity-60 text-white font-black py-3.5 transition-colors">
                {isLoading ? "Redirigiendo al pago…" : "Pagar con Mercado Pago"}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
