"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";
import { isVisaMasterPromoDay } from "@/lib/promo-day";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

const CONTADO_ID = "__contado__";
const MERCADO_PAGO_GRUPO = "Mercado Pago";
const GOCUOTAS_GRUPO = "GOcuotas";

/**
 * Cuotas de Mercado Pago con tarjeta de crédito Mercado Pago: no vienen de
 * recargos_tarjeta (esa tabla es para tarjetas cobradas en el local), así
 * que van hardcodeadas acá según las reglas vigentes:
 * - 2 cuotas sin interés se activan a partir de $50.000.
 * - 3 cuotas sin interés se activan a partir de $150.000; por debajo de eso
 *   sigue habiendo 3 cuotas, pero con el coeficiente 1.027 (con interés).
 * - 6 y 12 cuotas son siempre con interés (1.089 y 1.188), no hay monto que
 *   las vuelva sin interés.
 */
function mercadoPagoPlanes(amount: number) {
  const planes: { id: string; cuotas: string; coeficiente: number | null }[] = [
    { id: "mp-1", cuotas: "1 pago", coeficiente: 1 },
  ];
  if (amount > 50000) {
    planes.push({ id: "mp-2", cuotas: "2 cuotas sin interés", coeficiente: 1 });
  }
  planes.push({
    id: "mp-3",
    cuotas: amount > 150000 ? "3 cuotas sin interés" : "3 cuotas",
    coeficiente: amount > 150000 ? 1 : 1.027,
  });
  planes.push({ id: "mp-6", cuotas: "6 cuotas", coeficiente: 1.089 });
  planes.push({ id: "mp-12", cuotas: "12 cuotas", coeficiente: 1.188 });
  return planes;
}

/** El grupo de un plan puede venir cargado en el POS como "Cuota Mipyme" (la
    categoría de tarifa del comercio) — es un dato interno que no le dice
    nada al cliente, así que en la web se muestra genérico. */
function displayGrupoLabel(grupo: string): string {
  return esBanco(grupo) ? "Visa o Master de banco" : grupo;
}

function esBanco(grupo: string): boolean {
  return /mipyme/i.test(grupo);
}

/** El grupo viejo, dedicado, de "3 cuotas sin interés" quedó sin uso en el
    POS al pasar esa lógica a un override por día (ver aplicarOverrides) —
    filtrarlo acá evita mostrar un método de pago fantasma mientras no lo
    borren de recargos_tarjeta. */
function esGrupoObsoleto(grupo: string): boolean {
  // El viejo grupo dedicado de "3 cuotas sin interés" (ver aplicarOverrides).
  if (/sin\s*inter[eé]s/i.test(grupo)) return true;
  // "Cuotas" a secas es el genérico que en el POS es sólo la fuente de la
  // que Visa/Master "toma prestada" la tasa a 12 cuotas (ver planesDelGrupo)
  // — no es un medio de pago que el cliente pueda elegir por su cuenta acá,
  // así que no se lista como grupo propio.
  if (grupo.trim().toLowerCase() === "cuotas") return true;
  return false;
}

/** Logo(s) del medio de pago seleccionado, mismo criterio que ya se usaba
    para Mercado Pago — el banco muestra Visa y Mastercard juntas porque el
    plan de "mipyme" aplica a ambas. */
function logosDelGrupo(grupo: string): string[] {
  if (grupo === MERCADO_PAGO_GRUPO) return ["/images/payments/mercadopago.svg"];
  if (grupo === GOCUOTAS_GRUPO) return ["/images/payments/gocuotas.svg"];
  if (/naranja/i.test(grupo)) return ["/images/payments/naranja-x.svg"];
  if (esBanco(grupo)) return ["/images/payments/visa.svg", "/images/payments/mastercard.svg"];
  return [];
}

type Plan = { id: string; cuotas: string; coeficiente: number | null };

/**
 * "3 cuotas sin interés" sólo existe como tal en dos casos puntuales, así
 * que se fuerza acá en vez de depender de cómo esté cargado el coeficiente
 * en el POS:
 * - Visa/Master de banco ("mipyme"): únicamente los miércoles y sábados.
 * - Plan Z de Naranja: siempre, es la definición del plan.
 * Cualquier otro día, el plan de 3 cuotas de banco se muestra tal cual está
 * cargado (con su recargo real).
 */
function aplicarOverrides(grupo: string, planes: Plan[], esDiaPromo: boolean): Plan[] {
  const esNaranja = /naranja/i.test(grupo);
  if (!esBanco(grupo) && !esNaranja) return planes;
  return planes.map((p) => {
    if (esBanco(grupo) && esDiaPromo && parseInt(p.cuotas, 10) === 3) {
      return { ...p, cuotas: "3 cuotas sin interés", coeficiente: 1 };
    }
    if (esNaranja && /plan\s*z/i.test(p.cuotas)) {
      return { ...p, cuotas: "3 cuotas sin interés", coeficiente: 1 };
    }
    return p;
  });
}

/**
 * Calculadora de cuotas. Mercado Pago siempre está disponible (reglas fijas,
 * ver mercadoPagoPlanes); los planes de tarjeta cobrada en el local vienen
 * del POS (recargos_tarjeta) y se suman a la lista de grupos a medida que
 * cargan, sin bloquear el render mientras tanto.
 */
export function InstallmentCalculator({ basePrice }: { basePrice: number }) {
  const recargos = useRecargosTarjeta();
  const [grupoSel, setGrupoSel] = useState<string | null>(null);
  const [cuotaId, setCuotaId] = useState<string | null>(null);

  // Igual que en PaymentMethodsSection: se calcula en el cliente, no en el
  // build (página estática), así que arranca en false y se corrige al
  // montar para no quedar congelado con el día del último deploy.
  const [esDiaPromo, setEsDiaPromo] = useState(false);
  useEffect(() => {
    const update = () => setEsDiaPromo(isVisaMasterPromoDay());
    update();
  }, []);

  const gruposPOS = useMemo(() => {
    if (!recargos) return [];
    return Array.from(new Set(recargos.map((r) => r.grupo).filter((g) => !esGrupoObsoleto(g))));
  }, [recargos]);
  const grupos = [MERCADO_PAGO_GRUPO, GOCUOTAS_GRUPO, ...gruposPOS];

  const grupoActual = grupoSel && grupos.includes(grupoSel) ? grupoSel : grupos[0];
  const planesDelGrupo =
    grupoActual === MERCADO_PAGO_GRUPO
      ? mercadoPagoPlanes(basePrice)
      : grupoActual === GOCUOTAS_GRUPO
        ? [{ id: "goc-3", cuotas: "3 cuotas sin interés", coeficiente: 1 }]
        : aplicarOverrides(
            grupoActual,
            [
              { id: CONTADO_ID, cuotas: "1 pago", coeficiente: 1 },
              ...(recargos ?? []).filter((r) => r.grupo === grupoActual),
              // El banco (Visa/Master) no tiene tasa Mipyme propia a 12 cuotas
              // — el POS le presta la del grupo genérico "Cuotas" (mismo
              // criterio que planesTarjetaCredito en pos-neumaticos).
              ...(esBanco(grupoActual)
                ? (recargos ?? []).filter((r) => r.grupo === "Cuotas" && parseInt(r.cuotas, 10) === 12)
                : []),
            ],
            esDiaPromo
          );
  const planActual = planesDelGrupo.find((p) => p.id === cuotaId) ?? planesDelGrupo[0];
  const coeficiente = planActual.coeficiente ?? 1;
  const total = Math.round(basePrice * coeficiente);
  const recargo = total - basePrice;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wide text-navy-900">Calculá tus cuotas</h3>
        <div className="flex items-center gap-2">
          {logosDelGrupo(grupoActual).map((logo) => (
            <Image key={logo} src={logo} alt="" width={140} height={40} className="h-5 w-auto" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={grupoActual}
          onChange={(e) => {
            setGrupoSel(e.target.value);
            setCuotaId(null);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-navy-900 outline-none focus:border-navy-400"
        >
          {grupos.map((g) => (
            <option key={g} value={g}>
              {displayGrupoLabel(g)}
            </option>
          ))}
        </select>

        <select
          value={planActual.id}
          onChange={(e) => setCuotaId(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-navy-900 outline-none focus:border-navy-400"
        >
          {planesDelGrupo.map((p) => (
            <option key={p.id} value={p.id} disabled={p.coeficiente == null}>
              {p.cuotas}
              {p.coeficiente == null ? " (consultar)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-baseline justify-between rounded-lg bg-slate-50 px-3 py-2.5">
        <span className="text-sm font-bold text-slate-600">
          {planActual.cuotas === "1 pago" ? "Total" : `${planActual.cuotas} de ${formatPrice(total / (parseInt(planActual.cuotas, 10) || 1))}`}
        </span>
        <span className="text-lg font-black text-navy-900">{formatPrice(total)}</span>
      </div>
      {recargo > 0 && (
        <p className="mt-1.5 text-xs text-slate-400">Incluye {formatPrice(recargo)} de recargo por financiación.</p>
      )}
    </div>
  );
}
