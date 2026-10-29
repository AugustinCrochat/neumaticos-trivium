"use client";

import { MapPin } from "lucide-react";
import Link from "@/components/ui/Link";
import { BRANCHES } from "@/lib/config";
import { getBranchStatus } from "@/lib/branch-status";
import { useRelojCordoba } from "@/lib/reloj-cordoba";
import { toolPath } from "@/lib/tools";
import {
  AFLUENCIA_HORA_INICIO,
  DIAS_NOMBRES,
  NIVELES,
  diasPorTranquilidad,
  mejoresTramos,
  nivelEnHora,
  nivelesDelDia,
} from "@/lib/afluencia";

const branch = BRANCHES.find((b) => b.id === "arguello")!;
const COLOR_BARRA = ["bg-green-500", "bg-yellow-400", "bg-orange-500"];
const COLOR_TEXTO = ["!text-green-700", "!text-yellow-700", "!text-orange-600"];
const ALTURA = ["h-3", "h-6", "h-10"];
const mayus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Resumen corto de cuándo está más tranquilo el taller de Argüello, para poner
 * en las páginas de servicios, contacto y sucursal sin mandar a la herramienta
 * completa. Hoy si abre; si no (domingo, o antes de hidratar), el día más tranquilo.
 */
export function HorarioBloque({ className = "", titulo = "¿A qué hora conviene venir?" }: { className?: string; titulo?: string }) {
  const reloj = useRelojCordoba();
  const hoyAbre = reloj !== null && reloj.dia >= 1 && reloj.dia <= 6;
  const dia = hoyAbre ? reloj.dia : diasPorTranquilidad()[0];
  const niveles = nivelesDelDia(dia);
  const tramos = mejoresTramos(dia);
  const abierto = reloj !== null && getBranchStatus(branch).isOpen;
  const ahora = hoyAbre && abierto ? nivelEnHora(reloj.dia, reloj.hora) : null;

  return (
    <section className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6 ${className}`}>
      <h2 className="!mb-0 !mt-0 !text-xl font-black !text-navy-900">{titulo}</h2>
      <p className="!mb-0 mt-1 !text-sm !text-slate-700">
        Atendemos por orden de llegada, sin turnos.{" "}
        {ahora !== null ? (
          <>
            Ahora el movimiento suele ser <strong className={COLOR_TEXTO[ahora]}>{NIVELES[ahora].toLowerCase()}</strong>.
          </>
        ) : (
          <>
            El día más tranquilo es el <strong>{DIAS_NOMBRES[diasPorTranquilidad()[0]]}</strong>.
          </>
        )}
      </p>

      <div className="mt-4 flex items-end gap-1" role="img" aria-label={`Movimiento por hora ${hoyAbre ? "hoy" : `el ${DIAS_NOMBRES[dia]}`}`}>
        {niveles.map((n, i) => {
          const h = AFLUENCIA_HORA_INICIO + i;
          const actual = hoyAbre && reloj.hora === h;
          return (
            <div key={h} className="flex flex-1 flex-col items-center gap-0.5">
              <div className={`w-full rounded-t ${COLOR_BARRA[n]} ${ALTURA[n]} ${actual ? "ring-2 ring-navy-900 ring-offset-1" : ""}`} />
              <span className={`text-[10px] ${actual ? "font-black text-navy-900" : "text-slate-500"}`}>{h}</span>
            </div>
          );
        })}
      </div>
      <p className="!mb-0 mt-3 !text-sm !text-slate-700">
        {mayus(hoyAbre ? "hoy" : `el ${DIAS_NOMBRES[dia]}`)}, lo más tranquilo:{" "}
        <strong>{tramos.map((t) => `de ${t.desde} a ${t.hasta} h`).join(" y ")}</strong>.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold">
        <Link href={toolPath("mejor-horario-gomeria")} className="!text-emerald-800 underline underline-offset-4">
          Ver los otros días y qué conviene según el trabajo
        </Link>
        <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 !text-emerald-800 underline underline-offset-4">
          <MapPin className="h-4 w-4" aria-hidden /> En vivo en Google Maps
        </a>
      </div>
    </section>
  );
}
