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

type Metodo = {
  id: string;
  logo: string;
  alt: string;
  logoClassName: string;
};

const METODOS: Metodo[] = [
  { id: "visa", logo: "/images/payments/visa.svg", alt: "Visa", logoClassName: "h-8 w-auto" },
  { id: "mastercard", logo: "/images/payments/mastercard.svg", alt: "Mastercard", logoClassName: "h-9 w-auto" },
  { id: "mercadopago", logo: "/images/payments/mercadopago.svg", alt: "Mercado Pago", logoClassName: "h-9 w-auto" },
  { id: "naranja", logo: "/images/payments/naranja-x.svg", alt: "Tarjeta Naranja", logoClassName: "h-9 w-auto" },
  { id: "gocuotas", logo: "/images/payments/gocuotas.svg", alt: "GOcuotas", logoClassName: "h-8 w-auto" },
];

/**
 * Medios de pago con recargo/beneficio, para la ficha de producto.
 *
 * Los 5 logos van en una sola franja: al pasar el mouse (o tocar, en touch)
 * cada uno muestra su propio detalle abajo, en vez de una grilla de cajas
 * fijas — así entran todos parejos sin que Naranja/GOcuotas queden
 * apretados contra Visa/Master/Mercado Pago.
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

  // "mipyme" es el nombre interno de esa tarifa en el POS (ver también
  // displayGrupoLabel en InstallmentCalculator, mismo criterio) — al
  // cliente se le muestra "Visa o Master de banco".
  const recargos = useRecargosTarjeta();
  const planesBanco = recargos?.filter((r) => /mipyme/i.test(r.grupo)) ?? [];
  const plan3 = planesBanco.find((r) => parseInt(r.cuotas, 10) === 3);
  const plan6 = planesBanco.find((r) => parseInt(r.cuotas, 10) === 6);
  const recargo3 = recargoPct(plan3?.coeficiente ?? null);
  const recargo6 = recargoPct(plan6?.coeficiente ?? null);

  const detalleVisaMaster = isPromoDay
    ? "Hoy 3 cuotas sin interés (todos los miércoles y sábados)."
    : recargo3 || recargo6
      ? `${[recargo3 && `3 cuotas ${recargo3}`, recargo6 && `6 cuotas ${recargo6}`].filter(Boolean).join(" · ")}. Sin interés los miércoles y sábados.`
      : "Consultá cuotas disponibles.";

  const detalles: Record<string, string> = {
    visa: detalleVisaMaster,
    mastercard: detalleVisaMaster,
    mercadopago: "2 cuotas sin interés desde $50.000 · 3 cuotas sin interés desde $150.000.",
    naranja: "Plan Z con Tarjeta Naranja, sin recargo.",
    gocuotas: "Cuotas con GOcuotas, sin recargo.",
  };

  const [activo, setActivo] = useState<string | null>(null);

  return (
    <section id="metodos-pago" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-black uppercase tracking-wide text-navy-900">Medios de pago</h2>

      <div className="rounded-lg border border-slate-200 p-3">
        <div className="flex flex-wrap items-center gap-5">
          {METODOS.map((m) => (
            <button
              key={m.id}
              type="button"
              onMouseEnter={() => setActivo(m.id)}
              onFocus={() => setActivo(m.id)}
              onClick={() => setActivo((prev) => (prev === m.id ? null : m.id))}
              className={`shrink-0 rounded-md p-1 transition-colors ${activo === m.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
              aria-expanded={activo === m.id}
            >
              <Image src={m.logo} alt={m.alt} width={80} height={40} className={m.logoClassName} />
            </button>
          ))}
        </div>
        {activo && (
          <p className="mt-2.5 border-t border-slate-100 pt-2.5 text-xs font-semibold text-slate-600">
            {detalles[activo]}
          </p>
        )}
      </div>

      <div className="mt-3">
        <InstallmentCalculator basePrice={price} />
      </div>
    </section>
  );
}
