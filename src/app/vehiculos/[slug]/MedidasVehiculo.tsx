"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { useBranch } from "@/contexts/branch-context";

export type MedidaItem = {
  slug: string;
  label: string;
  versions: string[];
  years: string[];
  /** Precio mínimo con stock, ya formateado; null si hoy no hay. */
  desde: string | null;
  masElegida: boolean;
};

/**
 * Medidas del modelo como tarjetas que llevan a la landing de cada una. Si el
 * modelo tiene más de una medida y se conocen las versiones, un selector
 * ("¿Qué versión es el tuyo?") marca cuál le toca. No se guarda la elección:
 * vale solo para esta visita.
 */
export function MedidasVehiculo({ items }: { items: MedidaItem[] }) {
  const [version, setVersion] = useState<string | null>(null);
  // El dato sale del taller de Argüello: solo se nombra Córdoba si el visitante
  // eligió esa sucursal; con otra (o sin elegir) dice "nuestros locales".
  const { selectedBranch, hasConfirmedBranch } = useBranch();
  const dondeElegida = hasConfirmedBranch && selectedBranch.city === "Córdoba" ? "en Córdoba" : "en nuestros locales";
  const versiones = [...new Set(items.flatMap((i) => i.versions))];
  const conSelector = items.length > 1 && versiones.length > 1 && versiones.length <= 12;

  return (
    <div>
      {conSelector && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-bold text-navy-900">¿Qué versión es la tuya?</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Versión del auto">
            {versiones.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={version === v}
                onClick={() => setVersion(version === v ? null : v)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-bold transition-colors ${
                  version === v
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-slate-200 bg-white text-navy-900 hover:border-slate-400"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}
      <ul className="space-y-3">
        {items.map((m) => {
          const esLaTuya = version !== null && m.versions.includes(version);
          // Sin versiones conocidas no se puede descartar: queda neutra.
          const descartada = version !== null && m.versions.length > 0 && !esLaTuya;
          return (
            <li key={m.slug} className={descartada ? "opacity-50" : ""}>
              <Link
                href={`/neumaticos/${m.slug}`}
                className={`group flex items-center gap-4 rounded-2xl border-2 bg-white p-4 transition-colors hover:border-orange-500 hover:bg-orange-50/40 sm:p-5 ${
                  esLaTuya ? "border-emerald-500 bg-emerald-50/40" : "border-slate-200"
                }`}
              >
                <span className="min-w-0 flex-1">
                  {(esLaTuya || m.masElegida) && (
                    <span className="mb-1.5 flex flex-wrap gap-1.5">
                      {esLaTuya && (
                        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-white">
                          La de tu versión
                        </span>
                      )}
                      {m.masElegida && (
                        <span className="rounded-md bg-navy-900 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-white">
                          La más elegida {dondeElegida}
                        </span>
                      )}
                    </span>
                  )}
                  <span className="block text-2xl font-black text-navy-900 group-hover:text-orange-600">{m.label}</span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    {m.versions.join(", ") || "Varias versiones"}
                    {m.years.length > 0 ? ` · ${m.years.join(", ")}` : ""}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className={`block text-sm font-black ${m.desde ? "text-emerald-700" : "text-slate-500"}`}>
                    {m.desde ? `Desde ${m.desde}` : "Consultar stock"}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-black text-white group-hover:bg-orange-600">
                    Ver neumáticos <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
