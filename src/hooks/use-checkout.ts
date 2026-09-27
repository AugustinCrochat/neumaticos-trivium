"use client";

import { useState } from "react";
import type { CartItem, DeliveryMethod, ShippingAddress } from "@/contexts/cart-context";

export type PaymentProvider = "mercadopago" | "gocuotas";

type CheckoutArgs = {
  branchId: string;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  shippingAddress: ShippingAddress | null;
};

/** Estado y submit del checkout, compartido entre CartDrawer y
    CarritoPageClient — antes cada uno tenía su propia copia de este mismo
    fetch a /api/checkout, y agregar GoCuotas ahí hubiera significado
    duplicar la lógica de mail/teléfono dos veces. */
export function useCheckout() {
  const [provider, setProvider] = useState<PaymentProvider>("mercadopago");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const buyerDataIncomplete =
    provider === "gocuotas" &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail) || buyerPhone.replace(/\D/g, "").length < 8);

  async function submit(args: CheckoutArgs) {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: args.branchId,
          items: args.items.map(({ kind, id, quantity }) => ({ kind, id, quantity })),
          deliveryMethod: args.deliveryMethod,
          shippingAddress: args.deliveryMethod === "shipping" ? args.shippingAddress : undefined,
          provider,
          buyerEmail: provider === "gocuotas" ? buyerEmail : undefined,
          buyerPhone: provider === "gocuotas" ? buyerPhone : undefined,
        }),
      });
      const data = (await response.json()) as { initPoint?: string; error?: string };
      if (!response.ok || !data.initPoint) throw new Error(data.error || "No pudimos iniciar el pago.");
      window.location.assign(data.initPoint);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "No pudimos iniciar el pago.");
      setIsLoading(false);
    }
  }

  return {
    provider,
    setProvider,
    buyerEmail,
    setBuyerEmail,
    buyerPhone,
    setBuyerPhone,
    isLoading,
    error,
    buyerDataIncomplete,
    submit,
  };
}
