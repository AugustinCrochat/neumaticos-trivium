"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

const CONTADO_ID = "__contado__";
const MERCADO_PAGO_GRUPO = "Mercado Pago";

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

/** El grupo de un plan puede venir cargado en el POS como "...MiPyme" (la
    categoría de tarifa del comercio) — es un dato interno que no le dice
    nada al cliente, así que en la web se muestra genérico. */
function displayGrupoLabel(grupo: string): string {
  return /mipyme/i.test(grupo) ? "Visa o Master de banco" : grupo;
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

  const gruposPOS = useMemo(() => {
    if (!recargos) return [];
    return Array.from(new Set(recargos.map((r) => r.grupo)));
  }, [recargos]);
  const grupos = [MERCADO_PAGO_GRUPO, ...gruposPOS];

  const grupoActual = grupoSel && grupos.includes(grupoSel) ? grupoSel : grupos[0];
  const planesDelGrupo =
    grupoActual === MERCADO_PAGO_GRUPO
      ? mercadoPagoPlanes(basePrice)
      : [
          { id: CONTADO_ID, cuotas: "1 pago", coeficiente: 1 },
          ...(recargos ?? []).filter((r) => r.grupo === grupoActual),
        ];
  const planActual = planesDelGrupo.find((p) => p.id === cuotaId) ?? planesDelGrupo[0];
  const coeficiente = planActual.coeficiente ?? 1;
  const total = Math.round(basePrice * coeficiente);
  const recargo = total - basePrice;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wide text-navy-900">Calculá tus cuotas</h3>
        {grupoActual === MERCADO_PAGO_GRUPO && (
          <Image src="/images/payments/mercadopago.svg" alt="Mercado Pago" width={140} height={40} className="h-5 w-auto" />
        )}
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
