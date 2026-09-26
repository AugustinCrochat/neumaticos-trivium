"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isVisaMasterPromoDay } from "@/lib/promo-day";
import { InstallmentCalculator } from "./InstallmentCalculator";

/**
 * Medios de pago con recargo/beneficio, para la ficha de producto.
 *
 * El bloque de "hoy 3 cuotas" sólo se calcula en el cliente (ver
 * isVisaMasterPromoDay) para no quedar congelado con el día del último
 * build. Arranca en `false` y se corrige al montar, así que en la primera
 * pintura (server y cliente) coincide siempre — sin eso, un miércoles
 * generaría un mismatch de hidratación.
 */
export function PaymentMethodsSection({ price }: { price: number }) {
  const [isPromoDay, setIsPromoDay] = useState(false);
  useEffect(() => {
    const update = () => setIsPromoDay(isVisaMasterPromoDay());
    update();
  }, []);

  return (
    <section id="metodos-pago" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-black uppercase tracking-wide text-navy-900">Medios de pago</h2>

      {isPromoDay && (
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex shrink-0 items-center gap-2">
            <Image src="/images/payments/visa.svg" alt="Visa" width={48} height={32} className="h-8 w-auto" />
            <Image src="/images/payments/mastercard.svg" alt="Mastercard" width={48} height={32} className="h-9 w-auto" />
          </div>
          <p className="text-sm font-bold text-emerald-800">
            Hoy: 3 cuotas sin interés con Visa o Mastercard bancarizada
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
          <Image src="/images/payments/naranja-x.svg" alt="Tarjeta Naranja" width={40} height={26} className="h-7 w-auto shrink-0" />
          <p className="text-sm font-semibold text-slate-700">Plan Z con Tarjeta Naranja, sin recargo</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
          <Image src="/images/payments/gocuotas.svg" alt="GOcuotas" width={40} height={26} className="h-7 w-auto shrink-0" />
          <p className="text-sm font-semibold text-slate-700">Cuotas con GOcuotas, sin recargo</p>
        </div>
      </div>

      <div className="mt-3">
        <InstallmentCalculator basePrice={price} />
      </div>
    </section>
  );
}
