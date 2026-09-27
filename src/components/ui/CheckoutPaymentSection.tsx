"use client";

import Image from "next/image";
import type { useCheckout } from "@/hooks/use-checkout";

type Props = {
  checkout: ReturnType<typeof useCheckout>;
  disabled: boolean;
  disabledLabel: string;
  onSubmit: () => void;
};

/** Selector de método de pago + botón de submit, compartido entre CartDrawer
    y CarritoPageClient (ver useCheckout). GoCuotas necesita mail y teléfono
    del comprador antes de crear el checkout — Mercado Pago los pide en su
    propia página, así que esos campos solo aparecen si se elige GoCuotas. */
export function CheckoutPaymentSection({ checkout, disabled, disabledLabel, onSubmit }: Props) {
  const { provider, setProvider, buyerEmail, setBuyerEmail, buyerPhone, setBuyerPhone, isLoading, error, buyerDataIncomplete } = checkout;

  return (
    <div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setProvider("mercadopago")}
          className={`flex min-h-11 items-center justify-center rounded-xl border-2 px-3 py-2 text-sm font-bold transition-colors ${
            provider === "mercadopago" ? "border-navy-900 bg-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          Mercado Pago
        </button>
        <button
          type="button"
          onClick={() => setProvider("gocuotas")}
          className={`flex min-h-11 items-center justify-center rounded-xl border-2 px-3 py-2 text-sm font-black transition-colors ${
            provider === "gocuotas" ? "border-black bg-white text-black" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          GoCuotas
        </button>
      </div>

      {provider === "gocuotas" && (
        <div className="mb-3 space-y-2">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Tu email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-navy-400"
          />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Tu teléfono (ej: 3511234567)"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-navy-400"
          />
        </div>
      )}

      {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}

      <button
        onClick={onSubmit}
        disabled={disabled || isLoading || buyerDataIncomplete}
        className={`w-full flex items-center justify-center gap-2 rounded-xl font-black py-3.5 transition-colors disabled:opacity-60 ${
          provider === "gocuotas" ? "bg-black hover:bg-neutral-800 text-white" : "bg-[#FFE600] hover:bg-[#f5dc00] text-navy-900"
        }`}
      >
        {isLoading ? (
          "Redirigiendo al pago…"
        ) : disabled ? (
          disabledLabel
        ) : provider === "gocuotas" ? (
          "Pagar con GoCuotas"
        ) : (
          <>
            Pagar con
            <Image src="/images/mercadopago-logo.svg" alt="Mercado Pago" width={180} height={45} className="h-9 w-auto" />
          </>
        )}
      </button>
    </div>
  );
}
