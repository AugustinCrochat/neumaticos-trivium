"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isVisaMasterPromoDay } from "@/lib/promo-day";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";

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
  { id: "visa", logo: "/images/payments/visa.svg", alt: "Visa", logoClassName: "h-5 w-auto" },
  { id: "mastercard", logo: "/images/payments/mastercard.svg", alt: "Mastercard", logoClassName: "h-7 w-auto" },
  { id: "mercadopago", logo: "/images/payments/mercadopago.svg", alt: "Mercado Pago", logoClassName: "h-10 w-auto" },
  { id: "naranja", logo: "/images/payments/naranja-x.svg", alt: "Tarjeta Naranja", logoClassName: "h-6 w-auto" },
  { id: "gocuotas", logo: "/images/payments/gocuotas.svg", alt: "GOcuotas", logoClassName: "h-7 w-auto" },
];

/**
 * Medios de pago con recargo/beneficio, para la ficha de producto. El
 * cálculo de cuotas en sí (con coeficiente real) vive únicamente en el
 * cotizador de más abajo — acá solo se muestra qué hay disponible.
 *
 * Los 5 logos van en una sola franja: al pasar el mouse (o enfocar con
 * teclado) cada uno muestra su detalle abajo, y se oculta apenas el mouse
 * sale — no queda "pegado" el último que se tocó. En touch, el tap alterna
 * mostrar/ocultar, porque ahí no existe el hover.
 *
 * El bloque de "hoy 3 cuotas" sólo se calcula en el cliente (ver
 * isVisaMasterPromoDay) para no quedar congelado con el día del último
 * build. Arranca en `false` y se corrige al montar, así que en la primera
 * pintura (server y cliente) coincide siempre — sin eso, un miércoles
 * generaría un mismatch de hidratación.
 */
export function PaymentMethodsSection() {
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
    naranja: "Plan Z con Tarjeta Naranja: 3 cuotas sin interés.",
    gocuotas: "Cuotas con GOcuotas: 3 cuotas sin interés.",
  };

  const [activo, setActivo] = useState<string | null>(null);

  function mostrar(id: string) {
    setActivo(id);
  }
  function ocultar(id: string) {
    setActivo((prev) => (prev === id ? null : prev));
  }

  return (
    <section id="metodos-pago" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-black uppercase tracking-wide text-navy-900">Medios de pago</h2>

      <div className="rounded-lg border border-slate-200 p-3">
        <div className="flex flex-nowrap items-center justify-between gap-2 overflow-x-auto sm:gap-3">
          {METODOS.map((m) => (
            <button
              key={m.id}
              type="button"
              onMouseEnter={() => mostrar(m.id)}
              onMouseLeave={() => ocultar(m.id)}
              onFocus={() => mostrar(m.id)}
              onBlur={() => ocultar(m.id)}
              onClick={() => setActivo((prev) => (prev === m.id ? null : m.id))}
              className={`shrink-0 rounded-md p-1.5 transition-colors ${activo === m.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
              aria-expanded={activo === m.id}
            >
              <Image src={m.logo} alt={m.alt} width={80} height={40} className={m.logoClassName} />
            </button>
          ))}
        </div>
        {activo && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-bold text-orange-900">{detalles[activo]}</p>
          </div>
        )}
      </div>
    </section>
  );
}
