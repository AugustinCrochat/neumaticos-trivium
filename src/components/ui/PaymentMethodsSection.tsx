"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isVisaMasterPromoDay } from "@/lib/promo-day";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";
import { InstallmentCalculator } from "./InstallmentCalculator";

function recargoPct(coeficiente: number | null): string | null {
  if (coeficiente == null) return null;
  const pct = Math.round((coeficiente - 1) * 100);
  return pct > 0 ? `+${pct}%` : null;
}

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

  // Fuera de los días de promo, mostramos el recargo normal de Visa/Master de
  // banco en 3 y 6 cuotas en vez de no decir nada — "mipyme" es el nombre
  // interno de esa tarifa en el POS, ver displayGrupoLabel en
  // InstallmentCalculator (mismo criterio acá).
  const recargos = useRecargosTarjeta();
  const planesBanco = recargos?.filter((r) => /mipyme/i.test(r.grupo)) ?? [];
  const plan3 = planesBanco.find((r) => parseInt(r.cuotas, 10) === 3);
  const plan6 = planesBanco.find((r) => parseInt(r.cuotas, 10) === 6);
  const recargo3 = recargoPct(plan3?.coeficiente ?? null);
  const recargo6 = recargoPct(plan6?.coeficiente ?? null);

  return (
    <section id="metodos-pago" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-black uppercase tracking-wide text-navy-900">Medios de pago</h2>

      {/* Franja de logos siempre visible: Visa/Mastercard/Mercado Pago al
          mismo tamaño, una debajo del "sello" de marca reconocible en vez de
          amontonados con Naranja/GOcuotas en la grilla de abajo. */}
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 p-3">
        <Image src="/images/payments/visa.svg" alt="Visa" width={48} height={32} className="h-8 w-auto" />
        <Image src="/images/payments/mastercard.svg" alt="Mastercard" width={48} height={32} className="h-9 w-auto" />
        <Image src="/images/payments/mercadopago.svg" alt="Mercado Pago" width={48} height={32} className="h-8 w-auto" />
      </div>

      {isPromoDay ? (
        <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-sm font-bold text-emerald-800">
            Hoy: 3 cuotas sin interés con Visa o Master de banco
          </p>
          <p className="text-xs text-emerald-700">Todos los miércoles y sábados.</p>
        </div>
      ) : (
        (recargo3 || recargo6) && (
          <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-700">
              3 y 6 cuotas con Visa o Master de banco, con recargo
            </p>
            <p className="text-xs text-slate-500">
              {[recargo3 && `3 cuotas ${recargo3}`, recargo6 && `6 cuotas ${recargo6}`].filter(Boolean).join(" · ")}
              {" — "}sin interés los miércoles y sábados.
            </p>
          </div>
        )
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
