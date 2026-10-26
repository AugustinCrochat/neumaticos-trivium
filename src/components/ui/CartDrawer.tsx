"use client";

import Image from "next/image";
import Link from "@/components/ui/Link";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import { useCart, itemKey } from "@/contexts/cart-context";
import { useUpsellCombo } from "@/hooks/use-upsell-combo";
import { useAccesorios } from "@/hooks/use-accesorios";
import { useCheckout } from "@/hooks/use-checkout";
import { getCompatibleAccessory } from "@/lib/tuercas-vehiculos";
import { AlineacionBalanceoIcon } from "@/components/ui/AlineacionBalanceoIcon";
import { CheckoutPaymentSection } from "@/components/ui/CheckoutPaymentSection";
import { DeliveryMethodSelector, isShippingAddressComplete } from "@/components/ui/DeliveryMethodSelector";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export function CartDrawer() {
  const { items, itemsTotal, shippingCost, total, isOpen, closeCart, removeItem, updateQuantity, addService, addAccessory, deliveryMethod, shippingAddress } = useCart();
  const { selectedBranch } = useBranch();
  const { selectedVehicle } = useVehicle();
  const checkout = useCheckout();
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

  function handleCheckout() {
    checkout.submit({ branchId: selectedBranch.id, items, deliveryMethod, shippingAddress });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <button aria-label="Cerrar carrito" onClick={closeCart} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-xl font-black text-navy-900">Tu carrito</h2>
          <div className="flex items-center gap-4">
            {items.length > 0 && (
              <Link href="/carrito" onClick={closeCart} className="text-xs font-bold text-navy-600 hover:text-navy-800 underline underline-offset-4">
                Ver página completa
              </Link>
            )}
            <button onClick={closeCart} className="p-2 text-slate-500 hover:text-slate-900" aria-label="Cerrar">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="font-bold text-navy-900">Tu carrito está vacío.</p>
            <Link href="/catalogo" onClick={closeCart} className="mt-4 text-orange-600 font-bold underline underline-offset-4">Ver neumáticos</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => {
                const key = itemKey(item);
                return (
                  <div key={key} className="flex gap-3 border-b border-slate-100 pb-4">
                    {item.kind === "tire" || (item.kind === "accessory" && item.imageUrl) ? (
                      <div className="relative w-16 h-16 bg-slate-50 rounded-lg shrink-0">
                        <Image src={item.imageUrl!} alt="" fill sizes="64px" className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-navy-50 rounded-lg shrink-0 flex items-center justify-center">
                        <AlineacionBalanceoIcon size={22} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-navy-900 leading-snug line-clamp-2">{item.kind === "tire" ? item.model : item.nombre}</p>
                      <p className="text-sm font-black text-red-600 mt-1">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-slate-200">
                          <button onClick={() => updateQuantity(key, item.quantity - 1)} className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50" aria-label="Reducir cantidad">−</button>
                          <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(key, item.quantity + 1)} className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50" aria-label="Aumentar cantidad">+</button>
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
                  className="w-full flex items-center gap-3 rounded-xl border border-dashed border-orange-300 bg-orange-50 p-3 text-left hover:border-orange-400 transition-colors"
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
                  className="w-full flex items-center gap-3 rounded-xl border border-dashed border-orange-300 bg-orange-50 p-3 text-left hover:border-orange-400 transition-colors"
                >
                  <div className="relative w-7 h-7 bg-white rounded-lg shrink-0 overflow-hidden">
                    {compatibleAccessory!.imageUrl && (
                      <Image src={compatibleAccessory!.imageUrl} alt="" fill sizes="28px" className="object-contain p-0.5" />
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
            <div className="border-t border-slate-200 p-5 bg-slate-50">
              <div className="mb-4">
                <DeliveryMethodSelector />
              </div>
              {shippingCost > 0 && (
                <div className="flex justify-between text-sm text-slate-600 mb-1"><span>Subtotal</span><span>{formatPrice(itemsTotal)}</span></div>
              )}
              {shippingCost > 0 && (
                <div className="flex justify-between text-sm text-slate-600 mb-1"><span>Envío</span><span>{formatPrice(shippingCost)}</span></div>
              )}
              <div className="flex justify-between text-lg font-black text-navy-900 mb-1"><span>Total</span><span>{formatPrice(total)}</span></div>
              <p className="text-xs text-slate-500 mb-4">Los neumáticos tienen 1 año de garantía. Precio sujeto a validación de stock al confirmar el pedido.</p>
              <CheckoutPaymentSection
                checkout={checkout}
                disabled={shippingIncomplete}
                disabledLabel="Completá la dirección de envío"
                onSubmit={handleCheckout}
              />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
