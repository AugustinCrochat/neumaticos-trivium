"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import { useCart, itemKey } from "@/contexts/cart-context";
import { useUpsellCombo } from "@/hooks/use-upsell-combo";
import { useAccesorios } from "@/hooks/use-accesorios";
import { getCompatibleAccessory } from "@/lib/tuercas-vehiculos";
import { AlineacionBalanceoIcon } from "@/components/ui/AlineacionBalanceoIcon";
import { DeliveryMethodSelector, isShippingAddressComplete } from "@/components/ui/DeliveryMethodSelector";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export function CarritoPageClient() {
  const { items, itemsTotal, shippingCost, total, removeItem, updateQuantity, addService, addAccessory, deliveryMethod, shippingAddress } = useCart();
  const { selectedBranch } = useBranch();
  const { selectedVehicle } = useVehicle();
  const [isLoading, setIsLoading] = useState<false | "mercadopago" | "gocuotas">(false);
  const [error, setError] = useState("");
  const combo = useUpsellCombo();
  const accesorios = useAccesorios();
  const shippingIncomplete = deliveryMethod === "shipping" && !isShippingAddressComplete(shippingAddress);

  const hasTires = items.some((item) => item.kind === "tire");
  const hasCombo = items.some((item) => item.kind === "service" && item.id === combo?.id);
  const showCartUpsell = hasTires && !hasCombo && !!combo;

  const compatibleAccessory = selectedVehicle
    ? getCompatibleAccessory(selectedVehicle.marca, selectedVehicle.modelo, accesorios)
    : null;
  const hasAccessoryInCart = items.some((item) => item.kind === "accessory" && item.id === compatibleAccessory?.id);
  const showAccessoryUpsell = hasTires && !!compatibleAccessory && !hasAccessoryInCart;

  async function checkout(gateway: "mercadopago" | "gocuotas") {
    setError("");
    setIsLoading(gateway);
    try {
      const endpoint = gateway === "gocuotas" ? "/api/checkout-gocuotas" : "/api/checkout";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: selectedBranch.id,
          items: items.map(({ kind, id, quantity }) => ({ kind, id, quantity })),
          deliveryMethod,
          shippingAddress: deliveryMethod === "shipping" ? shippingAddress : undefined,
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-6">Tu carrito</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="font-bold text-navy-900">Tu carrito está vacío.</p>
          <Link href="/catalogo" className="mt-4 text-orange-600 font-bold underline underline-offset-4">
            Ver neumáticos
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => {
              const key = itemKey(item);
              return (
                <div key={key} className="flex gap-4 bg-white border border-slate-100 rounded-2xl p-4">
                  {item.kind === "tire" || (item.kind === "accessory" && item.imageUrl) ? (
                    <div className="relative w-20 h-20 bg-slate-50 rounded-xl shrink-0">
                      <Image src={item.imageUrl!} alt="" fill sizes="80px" className="object-contain p-1" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-navy-50 rounded-xl shrink-0 flex items-center justify-center">
                      <AlineacionBalanceoIcon size={28} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-navy-900 leading-snug">{item.kind === "tire" ? item.model : item.nombre}</p>
                    <p className="font-black text-red-600 mt-1">{formatPrice(item.price)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-slate-200">
                        <button onClick={() => updateQuantity(key, item.quantity - 1)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-50" aria-label="Reducir cantidad">−</button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, item.quantity + 1)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-50" aria-label="Aumentar cantidad">+</button>
                      </div>
                      <button onClick={() => removeItem(key)} className="text-xs font-bold text-slate-400 hover:text-red-600">Quitar</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {showCartUpsell && (
              <button
                onClick={() => addService({ id: combo!.id, nombre: combo!.nombre, price: combo!.precio }, 1)}
                className="w-full flex items-center gap-3 rounded-xl border border-dashed border-orange-300 bg-orange-50 p-4 text-left hover:border-orange-400 transition-colors"
              >
                <AlineacionBalanceoIcon size={28} />
                <span className="text-sm flex-1">
                  <span className="font-bold text-navy-900 block">¿Sumamos {combo!.nombre.toLowerCase()}?</span>
                  <span className="text-slate-500">+{formatPrice(combo!.precio)}</span>
                </span>
                <span className="text-xs font-black text-orange-600 shrink-0">Agregar</span>
              </button>
            )}

            {showAccessoryUpsell && (
              <button
                onClick={() => addAccessory(compatibleAccessory!, 1)}
                className="w-full flex items-center gap-3 rounded-xl border border-dashed border-orange-300 bg-orange-50 p-4 text-left hover:border-orange-400 transition-colors"
              >
                <div className="relative w-8 h-8 bg-white rounded-lg shrink-0 overflow-hidden">
                  {compatibleAccessory!.imageUrl && (
                    <Image src={compatibleAccessory!.imageUrl} alt="" fill sizes="32px" className="object-contain p-0.5" />
                  )}
                </div>
                <span className="text-sm flex-1">
                  <span className="font-bold text-navy-900 block">¿Sumamos una tuerca antirrobo para tu {selectedVehicle!.marca} {selectedVehicle!.modelo}?</span>
                  <span className="text-slate-500">+{formatPrice(compatibleAccessory!.price)}</span>
                </span>
                <span className="text-xs font-black text-orange-600 shrink-0">Agregar</span>
              </button>
            )}
          </div>

          {/* Summary */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:sticky md:top-8">
            <div className="mb-4">
              <DeliveryMethodSelector />
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between text-sm text-slate-600 mb-1"><span>Subtotal</span><span>{formatPrice(itemsTotal)}</span></div>
            )}
            {shippingCost > 0 && (
              <div className="flex justify-between text-sm text-slate-600 mb-1"><span>Envío</span><span>{formatPrice(shippingCost)}</span></div>
            )}
            <div className="flex justify-between text-lg font-black text-navy-900 mb-1">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Los neumáticos tienen 1 año de garantía. Precio sujeto a validación de stock al confirmar el pedido.
            </p>
            {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
            <button
              onClick={() => checkout("mercadopago")}
              disabled={!!isLoading || shippingIncomplete}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFE600] hover:bg-[#f5dc00] disabled:opacity-60 text-navy-900 font-black py-3.5 transition-colors mb-3"
            >
              {isLoading === "mercadopago" ? (
                "Redirigiendo al pago…"
              ) : shippingIncomplete ? (
                "Completá la dirección de envío"
              ) : (
                <>
                  Pagar con
                  <Image src="/images/mercadopago-logo.svg" alt="Mercado Pago" width={180} height={45} className="h-9 w-auto" />
                </>
              )}
            </button>
            <button
              onClick={() => checkout("gocuotas")}
              disabled={!!isLoading || shippingIncomplete}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#001D4A] hover:bg-[#002766] text-white disabled:opacity-60 font-black py-3.5 transition-colors"
            >
              {isLoading === "gocuotas" ? (
                "Redirigiendo a GOcuotas…"
              ) : shippingIncomplete ? (
                "Completá la dirección de envío"
              ) : (
                "Pagar con GOcuotas (Débito en Cuotas)"
              )}
            </button>
            <Link href="/catalogo" className="block text-center mt-4 text-sm font-bold text-navy-700 hover:text-navy-900 transition-colors">
              Seguir comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
