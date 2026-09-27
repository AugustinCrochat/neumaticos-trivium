"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";
import { isVisaMasterPromoDay } from "@/lib/promo-day";
import {
  MERCADO_PAGO_GRUPO,
  GOCUOTAS_GRUPO,
  displayGrupoLabel,
  esGrupoObsoleto,
  logosDelGrupo,
  planesParaGrupo,
} from "@/lib/cuotas";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

/** Los SVG de cada medio vienen con proporciones muy distintas entre sí — a
    una altura pareja se ven desparejos entre ellos (Visa es un logo más
    alargado que Mastercard, y Mercado Pago/GOcuotas quedan chicos al lado de
    Visa/Mastercard/Naranja), así que cada uno tiene su propia altura acá. */
function logoClassName(logo: string): string {
  if (logo === "/images/payments/mercadopago.svg") return "h-9 w-auto";
  if (logo === "/images/payments/gocuotas.svg") return "h-6 w-auto";
  if (logo === "/images/payments/visa.svg") return "h-4 w-auto";
  if (logo === "/images/payments/mastercard.svg") return "h-8 w-auto";
  return "h-5 w-auto";
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
  const planesDelGrupo = planesParaGrupo(grupoActual, basePrice, recargos, esDiaPromo);
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
            <Image key={logo} src={logo} alt="" width={140} height={40} className={logoClassName(logo)} />
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
