"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { isVisaMasterPromoDay, VISA_MASTER_PROMO_ACTIVA } from "@/lib/promo-day";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";
import { MERCADO_PAGO_GRUPO, GOCUOTAS_GRUPO, esBanco, esNaranja, planesParaGrupo, type Plan } from "@/lib/cuotas";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

function cantidadCuotas(plan: Plan): number {
  return parseInt(plan.cuotas, 10) || 1;
}

/** Sólo opciones en cuotas (el pago único no aporta nada acá, ya se ve en el
    precio de la ficha) — primero las sin interés, después las que sí tienen
    recargo. */
function ordenarPlanes(planes: Plan[]): Plan[] {
  const conCuotas = planes.filter((p) => p.coeficiente != null && cantidadCuotas(p) > 1);
  const sinInteres = conCuotas.filter((p) => p.coeficiente === 1);
  const conRecargo = conCuotas.filter((p) => p.coeficiente !== 1);
  return [...sinInteres, ...conRecargo];
}

/** Una línea por plan con el monto real de cada cuota (para 1 neumático,
    basePrice) y al lado el total final con el recargo ya aplicado — así el
    hover contesta directamente "cuánto pago por mes y en total" sin tener
    que abrir el cotizador de más abajo. Antes iba todo junto separado por
    "·" y con varias opciones (típico en Mercado Pago, que tiene hasta 4) se
    hacía ilegible en una sola línea. */
function lineasCuotas(planes: Plan[], basePrice: number): string[] {
  return ordenarPlanes(planes).map((p) => {
    const total = Math.round(basePrice * (p.coeficiente ?? 1));
    const monto = Math.round(total / cantidadCuotas(p));
    return `${p.cuotas} de ${formatPrice(monto)} (total ${formatPrice(total)})`;
  });
}

type Metodo = {
  id: string;
  logo: string;
  alt: string;
  logoClassName: string;
};

const METODOS: Metodo[] = [
  { id: "visa", logo: "/images/payments/visa.svg", alt: "Visa", logoClassName: "h-4 w-auto" },
  { id: "mastercard", logo: "/images/payments/mastercard.svg", alt: "Mastercard", logoClassName: "h-8 w-auto" },
  { id: "mercadopago", logo: "/images/payments/mercadopago.svg", alt: "Mercado Pago", logoClassName: "h-10 w-auto" },
  { id: "naranja", logo: "/images/payments/naranja-x.svg", alt: "Tarjeta Naranja", logoClassName: "h-6 w-auto" },
  { id: "gocuotas", logo: "/images/payments/gocuotas.svg", alt: "GOcuotas", logoClassName: "h-7 w-auto" },
];

/**
 * Medios de pago con recargo/beneficio, para la ficha de producto. `basePrice`
 * es el precio de 1 sola cubierta — el detalle de cada medio se calcula con
 * ese monto (mismas reglas que InstallmentCalculator, ver lib/cuotas) para
 * contestar directo "cuánto pago por mes" sin abrir el cotizador de abajo.
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
export function PaymentMethodsSection({ basePrice }: { basePrice: number }) {
  const [isPromoDay, setIsPromoDay] = useState(false);
  useEffect(() => {
    const update = () => setIsPromoDay(isVisaMasterPromoDay());
    update();
  }, []);

  // "mipyme" es el nombre interno de esa tarifa en el POS (ver también
  // displayGrupoLabel en InstallmentCalculator, mismo criterio) — al
  // cliente se le muestra "Visa o Master de banco". El grupo exacto de
  // Naranja también varía según cómo esté cargado en el POS, así que se
  // busca por patrón en vez de asumir un nombre fijo.
  const recargos = useRecargosTarjeta();
  const grupoBanco = recargos?.find((r) => esBanco(r.grupo))?.grupo ?? null;
  const grupoNaranja = recargos?.find((r) => esNaranja(r.grupo))?.grupo ?? null;

  const bancoPlanes = grupoBanco ? planesParaGrupo(grupoBanco, basePrice, recargos, isPromoDay) : [];
  const mpPlanes = planesParaGrupo(MERCADO_PAGO_GRUPO, basePrice, recargos, isPromoDay);
  const naranjaPlanes = grupoNaranja ? planesParaGrupo(grupoNaranja, basePrice, recargos, isPromoDay) : [];
  const gocPlanes = planesParaGrupo(GOCUOTAS_GRUPO, basePrice, recargos, isPromoDay);

  const lineasBanco = lineasCuotas(bancoPlanes, basePrice);
  const detalleBanco =
    lineasBanco.length > 0
      ? VISA_MASTER_PROMO_ACTIVA
        ? [...lineasBanco, isPromoDay ? "Promo válida todos los miércoles y sábados." : "Sin interés los miércoles y sábados."]
        : lineasBanco
      : ["Consultá cuotas disponibles."];

  const lineasMp = lineasCuotas(mpPlanes, basePrice);
  const lineasNaranja = lineasCuotas(naranjaPlanes, basePrice);
  const lineasGocuotas = lineasCuotas(gocPlanes, basePrice);

  const detalles: Record<string, string[]> = {
    visa: detalleBanco,
    mastercard: detalleBanco,
    mercadopago: lineasMp.length > 0 ? lineasMp : ["Consultá cuotas disponibles."],
    naranja: lineasNaranja.length > 0 ? lineasNaranja : ["Plan Z con Tarjeta Naranja: 3 cuotas sin interés."],
    gocuotas: lineasGocuotas.length > 0 ? lineasGocuotas : ["Cuotas con GOcuotas: 3 cuotas sin interés."],
  };

  const [activo, setActivo] = useState<string | null>(null);
  // Se captura acá el `activo` de ANTES de este toque, en onPointerDown —
  // que dispara antes de que el navegador mueva el foco al botón tocado. Si
  // el onClick usara el `activo` del render (ya actualizado por el onFocus
  // de este mismo toque, que llega antes que el click), tocar un método B
  // mientras A estaba abierto hacía: focus(B) abre B, y el click de ESE
  // MISMO toque, al ver que B ya estaba "activo", lo cerraba de nuevo — en
  // celular quedaba todo cerrado y había que tocar una segunda vez.
  const activoAntesDelToqueRef = useRef<string | null>(null);

  function mostrar(id: string) {
    setActivo(id);
  }
  function ocultar(id: string) {
    setActivo((prev) => (prev === id ? null : prev));
  }

  return (
    <section id="metodos-pago" className="scroll-mt-36 rounded-xl border border-slate-200 bg-white px-3 py-2">
      {/* Sólo miércoles y sábados. Discreto a propósito: el detalle completo
          está al tocar Visa o Mastercard. */}
      {isPromoDay && VISA_MASTER_PROMO_ACTIVA && (
        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          Hoy 3 cuotas sin interés con Visa o Mastercard
        </p>
      )}
      <div>
        <div className="flex flex-nowrap items-center justify-between gap-2 overflow-x-auto sm:gap-3">
          {METODOS.map((m) => (
            <button
              key={m.id}
              type="button"
              onPointerDown={() => {
                activoAntesDelToqueRef.current = activo;
              }}
              onMouseEnter={() => mostrar(m.id)}
              onMouseLeave={() => ocultar(m.id)}
              onFocus={() => mostrar(m.id)}
              onBlur={() => ocultar(m.id)}
              onClick={() => setActivo(activoAntesDelToqueRef.current === m.id ? null : m.id)}
              className={`shrink-0 rounded-md p-1 transition-colors ${activo === m.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
              aria-expanded={activo === m.id}
            >
              <Image src={m.logo} alt={m.alt} width={80} height={40} className={m.logoClassName} />
            </button>
          ))}
        </div>
        {activo && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="space-y-0.5">
              {detalles[activo].map((linea, i) => (
                <p key={i} className="text-sm font-bold text-emerald-900">
                  {linea}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
