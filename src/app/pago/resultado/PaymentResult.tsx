"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/gtag";
import { useBranch } from "@/contexts/branch-context";
import { useCart } from "@/contexts/cart-context";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

export function PaymentResult({ status }: { status?: string }) {
  const { items, total, clearCart, deliveryMethod, shippingAddress } = useCart();
  const { selectedBranch } = useBranch();
  const approved = status === "aprobado";
  const pending = status === "pendiente";
  const isShipping = deliveryMethod === "shipping";
  // Compra aprobada para GA4. El carrito todavía está lleno (se vacía recién
  // al coordinar por WhatsApp); sessionStorage evita contarla dos veces si se
  // recarga la página.
  useEffect(() => {
    if (!approved || items.length === 0) return;
    try {
      if (sessionStorage.getItem("ga4-purchase-sent")) return;
      sessionStorage.setItem("ga4-purchase-sent", "1");
    } catch {}
    trackEvent("purchase", {
      currency: "ARS",
      value: total,
      items: items.map((it) => ({ item_id: it.id, item_name: it.kind === "tire" ? it.model : it.nombre, price: it.price, quantity: it.quantity })),
    });
  }, [approved, items, total]);

  const title = approved ? "¡Pago recibido!" : pending ? "Tu pago está pendiente" : "No se completó el pago";
  const message = approved
    ? isShipping
      ? "Para coordinar el envío, envianos el detalle de tu compra por WhatsApp. Confirmaremos el stock antes de despachar."
      : "Para coordinar el retiro, envianos el detalle de tu compra por WhatsApp. Confirmaremos el stock antes de la entrega."
    : pending
      ? "Cuando Mercado Pago confirme la acreditación, coordinaremos la entrega."
      : "No se realizó ningún cobro. Podés volver a intentarlo cuando quieras.";

  const direccionText = isShipping && shippingAddress
    ? `\n\nEnvío a: ${shippingAddress.fullName}\n${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.province} (CP ${shippingAddress.postalCode})\nTel: ${shippingAddress.phone}`
    : "";
  const whatsappText = encodeURIComponent(`Hola Trivium ${selectedBranch.shortName}, realicé una compra online.${items.length ? `\n\nProductos:\n${items.map((item) => `• ${item.quantity} × ${item.kind === "tire" ? item.model : item.nombre}`).join("\n")}\n\nTotal: $${total.toLocaleString("es-AR")}` : ""}${direccionText}\n\nQuiero coordinar ${isShipping ? "el envío" : "el retiro"}.`);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <section className="max-w-lg w-full rounded-3xl bg-white border border-slate-200 p-8 text-center shadow-xl shadow-slate-200/60">
        <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${approved ? "bg-emerald-100 text-emerald-600" : pending ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"}`}>
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={approved ? "m5 13 4 4L19 7" : "M12 8v4m0 4h.01"} /></svg>
        </div>
        <h1 className="text-2xl font-black text-navy-900">{title}</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">{message}</p>
        {approved && (
          <WhatsAppLink href={`https://wa.me/${selectedBranch.whatsapp}?text=${whatsappText}`} onClick={clearCart} className="mt-6 inline-flex w-full justify-center rounded-xl bg-[#25d366] px-5 py-3.5 font-black text-white hover:bg-[#1fbd59]">
            Coordinar {isShipping ? "envío" : "retiro"} por WhatsApp
          </WhatsAppLink>
        )}
        <Link href="/catalogo" className="mt-4 inline-flex font-bold text-navy-700 underline underline-offset-4">Volver al catálogo</Link>
      </section>
    </div>
  );
}
