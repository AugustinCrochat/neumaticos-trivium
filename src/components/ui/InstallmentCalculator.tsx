"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";
import { isVisaMasterPromoDay } from "@/lib/promo-day";
import {
  MERCADO_PAGO_GRUPO,
  GOCUOTAS_GRUPO,
  displayGrupoLabel,
  esBanco,
  esGrupoObsoleto,
  esNaranja,
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

/** Orden en que se muestran los medios: banco, Mercado Pago, Naranja,
    GOcuotas y, si el POS carga alguno más, al final. */
function ordenGrupo(grupo: string): number {
  if (esBanco(grupo)) return 0;
  if (grupo === MERCADO_PAGO_GRUPO) return 1;
  if (esNaranja(grupo)) return 2;
  if (grupo === GOCUOTAS_GRUPO) return 3;
  return 4;
}

/**
 * Calculadora de cuotas. Cada medio de pago es un bloque siempre visible con
 * sus planes a mano, y el total queda abajo. Mercado Pago y GOcuotas siempre
 * están disponibles (reglas fijas, ver mercadoPagoPlanes); los planes de
 * tarjeta cobrada en el local vienen del POS (recargos_tarjeta) y se suman a
 * medida que cargan, sin bloquear el render mientras tanto.
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
  const grupos = [MERCADO_PAGO_GRUPO, GOCUOTAS_GRUPO, ...gruposPOS].sort((a, b) => ordenGrupo(a) - ordenGrupo(b));

  const grupoActual = grupoSel && grupos.includes(grupoSel) ? grupoSel : grupos[0];
  const planesDelGrupo = planesParaGrupo(grupoActual, basePrice, recargos, esDiaPromo);
  const planActual = planesDelGrupo.find((p) => p.id === cuotaId) ?? planesDelGrupo[0];
  const coeficiente = planActual.coeficiente ?? 1;
  const total = Math.round(basePrice * coeficiente);
  const recargo = total - basePrice;
  const nCuotas = parseInt(planActual.cuotas, 10) || 1;
  const sinInteres = nCuotas > 1 && recargo === 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-xs font-black uppercase tracking-wide text-navy-900">Elegí cómo pagar</h3>

      <div className="mt-3 space-y-3">
        {grupos.map((g) => {
          const planes = planesParaGrupo(g, basePrice, recargos, esDiaPromo);
          const activo = g === grupoActual;
          return (
            <section
              key={g}
              className={`rounded-lg border p-3 transition-colors ${activo ? "border-navy-900 bg-slate-50" : "border-slate-200"}`}
            >
              <div className="mb-2 flex min-h-9 items-center justify-between gap-2">
                <span className="text-sm font-bold text-navy-900">{displayGrupoLabel(g)}</span>
                <div className="flex items-center gap-2">
                  {logosDelGrupo(g).map((logo) => (
                    <Image key={logo} src={logo} alt="" width={140} height={40} className={logoClassName(logo)} />
                  ))}
                </div>
              </div>
              <div role="radiogroup" aria-label={displayGrupoLabel(g)} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {planes.map((p) => {
                  const seleccionado = activo && p.id === planActual.id;
                  const n = parseInt(p.cuotas, 10) || 1;
                  const t = Math.round(basePrice * (p.coeficiente ?? 1));
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={seleccionado}
                      disabled={p.coeficiente == null}
                      onClick={() => {
                        setGrupoSel(g);
                        setCuotaId(p.id);
                      }}
                      className={`rounded-lg border px-2.5 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        seleccionado
                          ? "border-navy-900 bg-navy-900 text-white"
                          : "border-slate-200 bg-white text-navy-900 hover:border-navy-400"
                      }`}
                    >
                      <span className="block text-xs font-bold leading-tight">{p.coeficiente == null ? `${p.cuotas} (consultar)` : p.cuotas}</span>
                      <span className={`mt-0.5 block text-xs ${seleccionado ? "text-white/80" : "text-slate-500"}`}>
                        {n > 1 ? `${formatPrice(t / n)} c/u` : formatPrice(t)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-navy-900 text-white" aria-live="polite">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
          <span className="text-xs font-bold uppercase tracking-wide text-white/70">Total a pagar</span>
          <span className="text-xs font-semibold text-white/90">
            {displayGrupoLabel(grupoActual)} · {planActual.cuotas}
          </span>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-3xl font-black tracking-tight">{formatPrice(total)}</span>
            {sinInteres && (
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">Sin interés</span>
            )}
          </div>
          {nCuotas > 1 && (
            <p className="mt-1 text-sm font-semibold text-white/90">
              {nCuotas} cuotas de {formatPrice(total / nCuotas)}
            </p>
          )}
          <dl className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs text-white/70">
            <div className="flex justify-between">
              <dt>Precio</dt>
              <dd>{formatPrice(basePrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Recargo por financiación</dt>
              <dd>{recargo > 0 ? formatPrice(recargo) : "Sin recargo"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
