"use client";

import { useMemo, useState } from "react";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

const CONTADO_ID = "__contado__";

/**
 * Calculadora de cuotas con el coeficiente real de recargos_tarjeta (POS),
 * no un porcentaje hardcodeado que se desactualiza. Si el POS todavía no
 * tiene planes cargados, no muestra nada en vez de una calculadora rota.
 */
export function InstallmentCalculator({ basePrice }: { basePrice: number }) {
  const recargos = useRecargosTarjeta();
  const [grupoSel, setGrupoSel] = useState<string | null>(null);
  const [cuotaId, setCuotaId] = useState<string | null>(null);

  const grupos = useMemo(() => {
    if (!recargos) return [];
    return Array.from(new Set(recargos.map((r) => r.grupo)));
  }, [recargos]);

  if (recargos === null) return null;
  if (grupos.length === 0) return null;

  const grupoActual = grupoSel && grupos.includes(grupoSel) ? grupoSel : grupos[0];
  const planesDelGrupo = [
    { id: CONTADO_ID, grupo: grupoActual, tarjetas: "", cuotas: "1 pago", coeficiente: 1 },
    ...recargos.filter((r) => r.grupo === grupoActual),
  ];
  const planActual = planesDelGrupo.find((p) => p.id === cuotaId) ?? planesDelGrupo[0];
  const coeficiente = planActual.coeficiente ?? 1;
  const total = Math.round(basePrice * coeficiente);
  const recargo = total - basePrice;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-navy-900">Calculá tus cuotas</h3>

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
              {g}
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
