"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
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
  type Plan,
} from "@/lib/cuotas";

/** Pago en efectivo en el local: no viene del POS, es un descuento fijo sobre
    el precio publicado. Se modela como un "grupo" más para reutilizar el
    acordeón de medios de pago. */
export const EFECTIVO_GRUPO = "Efectivo";
export const DESCUENTO_EFECTIVO = 0.1;
const EFECTIVO_PLAN: Plan = { id: "efectivo", cuotas: "Un pago", coeficiente: 1 - DESCUENTO_EFECTIVO };

export type PagoElegido = { total: number; medio: string; cuotas: string; esEfectivo: boolean };

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

/** Los SVG de cada medio vienen con proporciones muy distintas entre sí — a
    una altura pareja se ven desparejos entre ellos (Visa es un logo más
    alargado que Mastercard, y Mercado Pago/GOcuotas quedan chicos al lado de
    Visa/Mastercard/Naranja), así que cada uno tiene su propia altura acá. */
function logoClassName(logo: string): string {
  if (logo === "/images/payments/mercadopago.svg") return "h-7 w-auto sm:h-9";
  if (logo === "/images/payments/gocuotas.svg") return "h-4 w-auto sm:h-5";
  if (logo === "/images/payments/visa.svg") return "h-2.5 w-auto min-w-0 sm:h-3.5";
  if (logo === "/images/payments/mastercard.svg") return "h-4 w-auto min-w-0 sm:h-7";
  return "h-4 w-auto sm:h-5";
}

/** Mayor cantidad de cuotas sin interés del medio (0 si no tiene). */
function maxSinInteres(planes: Plan[]): number {
  return planes.reduce((max, p) => {
    const n = parseInt(p.cuotas, 10) || 1;
    return p.coeficiente === 1 && n > 1 ? Math.max(max, n) : max;
  }, 0);
}

/** Aclaración de cómo se accede a las cuotas sin interés de cada medio. */
function notaSinInteres(g: string): string | null {
  if (g === MERCADO_PAGO_GRUPO) return "Las cuotas sin interés son pagando con la tarjeta de crédito Mercado Pago.";
  if (g === GOCUOTAS_GRUPO) return "Se paga con GOcuotas, sin interés.";
  if (esNaranja(g)) return "Es el Plan Z de Tarjeta Naranja.";
  if (esBanco(g)) return "Promo con Visa o Mastercard de banco, miércoles y sábados.";
  return null;
}

/** Orden en que se muestran los medios: banco, Mercado Pago, Naranja,
    GOcuotas y, si el POS carga alguno más, al final. */
function ordenGrupo(grupo: string): number {
  if (grupo === EFECTIVO_GRUPO) return -1;
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
export function InstallmentCalculator({
  basePrice,
  notaPrecio,
  onShare,
  onPago,
  totalRef,
}: {
  basePrice: number;
  notaPrecio?: string;
  onShare?: (pago: PagoElegido) => void;
  /** Avisa el total con el medio elegido cada vez que cambia (para mostrarlo en una barra fija). */
  onPago?: (pago: PagoElegido) => void;
  /** Referencia al bloque del total, para saber si está a la vista. */
  totalRef?: RefObject<HTMLDivElement | null>;
}) {
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
  const grupos = [EFECTIVO_GRUPO, MERCADO_PAGO_GRUPO, GOCUOTAS_GRUPO, ...gruposPOS].sort((a, b) => ordenGrupo(a) - ordenGrupo(b));
  const planesDe = (g: string) => (g === EFECTIVO_GRUPO ? [EFECTIVO_PLAN] : planesParaGrupo(g, basePrice, recargos, esDiaPromo));

  // Sin medio elegido de entrada: el total es el precio de lista hasta que el
  // cliente toca uno. Al elegir un medio queda marcada su primera opción.
  const grupoActual = grupoSel && grupos.includes(grupoSel) ? grupoSel : null;
  const esEfectivo = grupoActual === EFECTIVO_GRUPO;
  const planesDelGrupo = grupoActual ? planesDe(grupoActual) : [];
  const planActual = grupoActual ? (planesDelGrupo.find((p) => p.id === cuotaId) ?? planesDelGrupo[0]) : null;
  const coeficiente = planActual?.coeficiente ?? 1;
  const total = Math.round(basePrice * coeficiente);
  const recargo = total - basePrice;
  const descuento = basePrice - total;
  const nCuotas = planActual ? parseInt(planActual.cuotas, 10) || 1 : 1;
  const sinInteres = nCuotas > 1 && recargo === 0;
  const nombreMedio = grupoActual ? (esEfectivo ? "Efectivo" : displayGrupoLabel(grupoActual)) : "";

  useEffect(() => {
    onPago?.({ total, medio: grupoActual ? nombreMedio : "", cuotas: planActual?.cuotas ?? "", esEfectivo });
  }, [onPago, total, grupoActual, nombreMedio, planActual?.cuotas, esEfectivo]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-xs font-black uppercase tracking-wide text-navy-900">Elegí cómo pagar</h3>
      <p className="mt-0.5 text-xs text-slate-500">Tocá un medio para ver las cuotas y el total.</p>

      {/* Medios: mosaico parejo; el elegido muestra abajo sus cuotas. */}
      <div className="mt-3 grid auto-cols-fr grid-flow-col gap-1.5 sm:gap-2" role="radiogroup" aria-label="Medio de pago">
        {grupos.map((g) => {
          const elegido = g === grupoActual;
          const sinInteresMax = g === EFECTIVO_GRUPO ? 0 : maxSinInteres(planesDe(g));
          return (
            <button
              key={g}
              type="button"
              role="radio"
              aria-checked={elegido}
              aria-label={g === EFECTIVO_GRUPO ? "Efectivo" : displayGrupoLabel(g)}
              onClick={() => {
                // Tocar el medio ya elegido lo deselecciona.
                setGrupoSel(elegido ? null : g);
                setCuotaId(null);
              }}
              className={`flex h-[72px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border-2 px-0.5 transition-colors sm:h-[76px] sm:gap-1.5 sm:px-1 ${
                elegido ? "border-navy-900 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="flex h-8 max-w-full items-center justify-center gap-1 overflow-hidden sm:h-9 sm:gap-1.5">
                {g === EFECTIVO_GRUPO ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-lg font-black leading-none text-white" aria-hidden="true">
                    $
                  </span>
                ) : (
                  logosDelGrupo(g).map((logo) => (
                    <Image key={logo} src={logo} alt="" width={140} height={40} className={logoClassName(logo)} />
                  ))
                )}
              </span>
              <span
                className={`text-center text-[10px] font-bold leading-tight sm:text-[11px] ${
                  g === EFECTIVO_GRUPO || sinInteresMax > 0 ? "text-emerald-700" : "text-slate-500"
                } ${sinInteresMax > 0 ? "font-black" : ""}`}
              >
                {/* "x3 sin interés" a la vista en el mosaico: que se entienda de entrada cuántas cuotas son sin interés. */}
                {g === EFECTIVO_GRUPO ? "10% OFF" : sinInteresMax > 0 ? `x${sinInteresMax} sin interés` : "En cuotas"}
              </span>
            </button>
          );
        })}
      </div>

      {grupoActual && planActual && (() => {
        const g = grupoActual;
        const planes = planesDelGrupo;
        const nombre = nombreMedio;
        const nota = maxSinInteres(planes) > 0 ? notaSinInteres(g) : null;
        return (
          <div className="mt-3 rounded-xl bg-slate-50 p-3">
            <p className="text-sm font-black text-navy-900">{nombre}</p>
            {planes.length === 1 ? (
              (() => {
                const p = planes[0];
                const n = parseInt(p.cuotas, 10) || 1;
                const t = Math.round(basePrice * (p.coeficiente ?? 1));
                const sinInt = n > 1 && p.coeficiente === 1;
                return (
                  <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                    <p className="text-base font-black text-navy-900">
                      {n > 1 ? `${n} cuotas de ${formatPrice(t / n)}` : formatPrice(t)}
                    </p>
                    <p className={`text-xs font-semibold ${sinInt || g === EFECTIVO_GRUPO ? "text-emerald-700" : "text-slate-500"}`}>
                      {g === EFECTIVO_GRUPO
                        ? "10% de descuento pagando en el local"
                        : sinInt
                          ? `Sin interés · total ${formatPrice(t)}`
                          : `Total ${formatPrice(t)}`}
                    </p>
                  </div>
                );
              })()
            ) : (
              <div role="radiogroup" aria-label={`Cuotas ${nombre}`} className={`mt-2 grid gap-2 ${planes.length % 3 === 0 ? "grid-cols-3" : "grid-cols-2"}`}>
                {planes.map((p, idx) => {
                  const seleccionado = p.id === planActual.id;
                  const n = parseInt(p.cuotas, 10) || 1;
                  const t = Math.round(basePrice * (p.coeficiente ?? 1));
                  const sinInt = n > 1 && p.coeficiente === 1;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={seleccionado}
                      disabled={p.coeficiente == null}
                      onClick={() => setCuotaId(p.id)}
                      className={`${planes.length % 3 !== 0 && planes.length % 2 === 1 && idx === planes.length - 1 ? "col-span-2 " : ""}flex flex-col gap-0.5 rounded-lg border-2 px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        seleccionado ? "border-navy-900 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="text-sm font-black leading-tight text-navy-900">
                        {p.coeficiente == null ? `${n} cuotas (consultar)` : n > 1 ? `${n} cuotas` : "1 pago"}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">{n > 1 ? `${formatPrice(t / n)} c/u` : formatPrice(t)}</span>
                      <span className={`text-[11px] font-bold ${sinInt ? "text-emerald-700" : "text-slate-400"}`}>
                        {sinInt ? "Sin interés" : n > 1 ? `Total ${formatPrice(t)}` : "\u00a0"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {nota && <p className="mt-2 text-xs font-semibold text-emerald-700">{nota}</p>}
          </div>
        );
      })()}

      <div ref={totalRef} className="mt-4 scroll-mt-24 overflow-hidden rounded-2xl border-2 border-navy-900 bg-white" aria-live="polite">
        <div className="flex items-center justify-between gap-3 bg-navy-900 px-4 py-2 text-white">
          <p className="text-xs font-black uppercase tracking-widest">Total a pagar</p>
          <p className="truncate text-xs font-bold text-white/80">{grupoActual ? nombreMedio : "Precio de lista"}</p>
        </div>
        <div className="px-4 pb-4 pt-3">
          <p className="text-5xl font-black leading-none tracking-tight text-navy-900">{formatPrice(total)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
            {grupoActual && planActual ? (
              <>
                <span className="font-black text-navy-900">
                  {nCuotas > 1 ? `${nCuotas} cuotas de ${formatPrice(total / nCuotas)}` : esEfectivo ? "Pagando en el local" : "1 pago"}
                </span>
                {sinInteres && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-emerald-700">Sin interés</span>}
                {esEfectivo && descuento > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-emerald-700">Ahorrás {formatPrice(descuento)}</span>
                )}
                {recargo > 0 && <span className="text-xs font-medium text-slate-500">incluye {formatPrice(recargo)} de financiación</span>}
              </>
            ) : (
              <span>Elegí un medio de pago para ver las cuotas.</span>
            )}
          </div>
        </div>
      </div>

      {(notaPrecio || esEfectivo) && (
        <p className="mt-3 text-xs text-slate-500">
          {notaPrecio}
          {esEfectivo && " El descuento por efectivo aplica pagando en el local."}
        </p>
      )}
      {onShare && (
        <button
          type="button"
          onClick={() =>
            onShare({
              total,
              medio: grupoActual ? nombreMedio : "",
              cuotas: planActual?.cuotas ?? "",
              esEfectivo,
            })
          }
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3.5 text-center text-sm font-black leading-snug text-white transition-colors hover:bg-[#1ebe57] sm:text-base"
        >
          <svg className="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>Compartir por WhatsApp</span>
        </button>
      )}
    </div>
  );
}
