"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isVisaMasterPromoDay } from "@/lib/promo-day";
import { useRecargosTarjeta } from "@/hooks/use-recargos-tarjeta";
import {
  MERCADO_PAGO_GRUPO,
  GOCUOTAS_GRUPO,
  esBanco,
  esNaranja,
  logosDelGrupo,
  planesParaGrupo,
  type Plan,
} from "@/lib/cuotas";

export type ItemCotizable = { id: string; label: string; price: number };

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

function cantidadCuotas(plan: Plan): number {
  return parseInt(plan.cuotas, 10) || 1;
}

/** "+4,7%" a partir del coeficiente (1.0471 -> 4,7%). */
function recargoLabel(coef: number): string {
  return `+${(Math.round((coef - 1) * 1000) / 10).toLocaleString("es-AR")}%`;
}

function soloCuotas(planes: Plan[]): Plan[] {
  return planes
    .filter((p) => p.coeficiente != null && cantidadCuotas(p) > 1)
    .sort((a, b) => cantidadCuotas(a) - cantidadCuotas(b));
}

// Con 150.000 o más, Mercado Pago ofrece 2 y 3 cuotas sin interés; la vista
// general usa ese piso y lo aclara en una nota (ver mercadoPagoPlanes).
const MP_PRECIO_GENERAL = 150001;

/**
 * Medios de pago a nivel general para /ofertas: por cada medio, las cuotas
 * con su recargo en %. Con un producto elegido en el selector, cada cuota
 * pasa a mostrar también el monto real y el total de ese producto.
 */
export function OfertasMediosPago({ items }: { items: ItemCotizable[] }) {
  const [itemId, setItemId] = useState("");
  const [isPromoDay, setIsPromoDay] = useState(false);
  useEffect(() => {
    const update = () => setIsPromoDay(isVisaMasterPromoDay());
    update();
  }, []);

  const recargos = useRecargosTarjeta();
  const item = items.find((i) => i.id === itemId);
  const precio = item?.price ?? null;

  const grupoBanco = recargos?.find((r) => esBanco(r.grupo))?.grupo ?? null;
  const grupoNaranja = recargos?.find((r) => esNaranja(r.grupo))?.grupo ?? null;

  const grupos = [
    { id: "banco", titulo: "Visa o Master de banco", grupo: grupoBanco },
    { id: "mp", titulo: "Mercado Pago", grupo: MERCADO_PAGO_GRUPO },
    { id: "naranja", titulo: "Tarjeta Naranja", grupo: grupoNaranja },
    { id: "goc", titulo: "GOcuotas", grupo: GOCUOTAS_GRUPO },
  ]
    .filter((g): g is { id: string; titulo: string; grupo: string } => !!g.grupo)
    .map((g) => ({
      ...g,
      logos: logosDelGrupo(g.grupo),
      planes: soloCuotas(
        planesParaGrupo(g.grupo, g.grupo === MERCADO_PAGO_GRUPO ? (precio ?? MP_PRECIO_GENERAL) : (precio ?? 1), recargos, isPromoDay)
      ),
    }))
    .filter((g) => g.planes.length > 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Contado y transferencia: precio de lista, sin recargo.</p>
          <p className="text-sm text-slate-500">En cuotas, el recargo depende del medio y de la cantidad.</p>
        </div>
        <label className="block md:w-80">
          <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
            Cotizá un producto
          </span>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#ff1e00] focus:outline-none"
          >
            <option value="">Ver porcentajes generales</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label} — {formatPrice(i.price)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {recargos === null ? (
        <p className="py-6 text-center text-sm text-slate-500">Cargando medios de pago…</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {grupos.map((g) => (
            <div key={g.id} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex shrink-0 items-center gap-2">
                  {g.logos.map((src) => (
                    <Image key={src} src={src} alt="" width={64} height={32} className="h-6 w-auto" />
                  ))}
                </div>
                <h3 className="text-sm font-black text-slate-900">{g.titulo}</h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {g.planes.map((p) => {
                  const sinInteres = p.coeficiente === 1;
                  const n = cantidadCuotas(p);
                  const total = precio != null ? Math.round(precio * (p.coeficiente ?? 1)) : null;
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-2">
                      <span className="text-sm font-bold text-slate-800">{n} cuotas</span>
                      <span className="flex items-center gap-2 text-right">
                        {total != null && (
                          <span className="text-xs text-slate-500">
                            {n} de <b className="text-slate-900">{formatPrice(Math.round(total / n))}</b> · total{" "}
                            {formatPrice(total)}
                          </span>
                        )}
                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-black ${
                            sinInteres ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {sinInteres ? "Sin interés" : recargoLabel(p.coeficiente as number)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              {g.id === "mp" && precio == null && (
                <p className="mt-2 text-xs text-slate-500">
                  2 cuotas sin interés desde $50.000 y 3 desde $150.000; por debajo, 3 cuotas con recargo.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">
        Los recargos se calculan sobre el precio de lista. Elegí un producto para ver el monto exacto de cada cuota.
      </p>
    </div>
  );
}
