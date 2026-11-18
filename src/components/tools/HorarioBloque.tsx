"use client";

import { MapPin } from "lucide-react";
import Link from "@/components/ui/Link";
import { useBranch } from "@/contexts/branch-context";
import type { Branch } from "@/lib/config";
import { getBranchStatus } from "@/lib/branch-status";
import { useRelojCordoba } from "@/lib/reloj-cordoba";
import { toolPath } from "@/lib/tools";
import {
  AFLUENCIA_HORA_INICIO,
  DIAS_NOMBRES,
  NIVELES,
  diasPorTranquilidad,
  nivelEnHora,
  nivelesDelDia,
  tieneAfluencia,
} from "@/lib/afluencia";

const COLOR_BARRA = ["bg-green-600", "bg-slate-400", "bg-orange-500"];
const ALTURA = ["h-4", "h-8", "h-14"];
const mayus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type Tramo = { desde: number; hasta: number };

/** Los tramos más tranquilos del día entre `desdeHora` y el cierre (si ya pasó la mejor franja, la mejor de lo que queda). */
function tramosDesde(niveles: number[], desdeHora: number): Tramo[] {
  const horas = niveles.map((n, i) => ({ n, h: AFLUENCIA_HORA_INICIO + i })).filter((x) => x.h >= desdeHora);
  if (!horas.length) return [];
  const min = Math.min(...horas.map((x) => x.n));
  const tramos: Tramo[] = [];
  for (const x of horas) {
    if (x.n !== min) continue;
    const u = tramos[tramos.length - 1];
    if (u && u.hasta === x.h) u.hasta = x.h + 1;
    else tramos.push({ desde: x.h, hasta: x.h + 1 });
  }
  return tramos;
}

/**
 * Qué día mostrar: hoy mientras quede algo del día; si ya pasó la hora de cierre
 * (o es domingo), el próximo día que abre: "mañana" o, si cae después, "el lunes".
 */
function elegirDia(reloj: { dia: number; hora: number } | null) {
  if (!reloj) return { dia: diasPorTranquilidad()[0], cuando: "dia" as const, desdeHora: 0 };
  const fin = AFLUENCIA_HORA_INICIO + nivelesDelDia(Math.max(1, reloj.dia)).length;
  if (reloj.dia >= 1 && reloj.dia <= 6 && reloj.hora < fin) return { dia: reloj.dia, cuando: "hoy" as const, desdeHora: reloj.hora };
  for (let o = 1; o <= 7; o++) {
    const d = (reloj.dia + o) % 7;
    if (d >= 1) return { dia: d, cuando: o === 1 ? ("manana" as const) : ("dia" as const), desdeHora: 0 };
  }
  return { dia: 1, cuando: "dia" as const, desdeHora: 0 };
}

/**
 * Resumen corto de cuándo está más tranquilo el taller de Argüello, para poner
 * en las páginas de servicios, contacto y sucursal sin mandar a la herramienta
 * completa. Hoy mientras abra; si ya cerró, mañana (o el lunes si es sábado a la
 * noche o domingo). Antes de hidratar muestra el día más tranquilo de la semana.
 */
export function HorarioBloque({ className = "", titulo = "¿A qué hora conviene venir?", sucursal }: { className?: string; titulo?: string; sucursal?: Branch }) {
  const { selectedBranch } = useBranch();
  const branch = sucursal ?? selectedBranch;
  const reloj = useRelojCordoba();
  const hayDatos = tieneAfluencia(branch.id);
  const { dia, cuando, desdeHora } = elegirDia(reloj);
  const niveles = nivelesDelDia(dia);
  const hoy = cuando === "hoy";
  const tramos = tramosDesde(niveles, desdeHora);
  const abierto = reloj !== null && getBranchStatus(branch).isOpen;
  const ahora = hoy && abierto ? nivelEnHora(reloj!.dia, reloj!.hora) : null;
  const cuandoTxt = hoy ? "hoy" : cuando === "manana" ? "mañana" : `el ${DIAS_NOMBRES[dia]}`;
  const tarjeta = `border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#ff1e00] sm:p-6 ${className}`;
  const enlace = "!text-black underline decoration-[#ff1e00] decoration-2 underline-offset-4 hover:!text-[#ff1e00]";

  if (!hayDatos) {
    return (
      <section className={tarjeta}>
        <h2 className="!mb-0 !mt-0 !text-xl font-black !text-navy-900">{titulo}</h2>
        <p className="!mb-0 mt-1 !text-sm !text-slate-700">
          {branch.apertura ? `${branch.shortName} abre ${branch.apertura}. ` : ""}
          Todavía no tenemos datos de movimiento de {branch.shortName}; consultá la espera por WhatsApp antes de ir.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold">
          <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 !text-black underline decoration-[#ff1e00] decoration-2 underline-offset-4">
            <MapPin className="h-4 w-4" aria-hidden /> Ver en Google Maps
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className={tarjeta}>
      <h2 className="!mb-0 !mt-0 !text-xl font-black !text-navy-900">{titulo}</h2>
      <p className="!mb-0 mt-1 !text-sm !text-slate-700">
        Atendemos por orden de llegada, sin turnos.{" "}
        {ahora !== null ? (
          <>
            Ahora suele estar <strong>{NIVELES[ahora].toLowerCase()}</strong> comparado con el resto del día.
          </>
        ) : reloj === null ? (
          <>
            El día más tranquilo es el <strong>{DIAS_NOMBRES[diasPorTranquilidad()[0]]}</strong>.
          </>
        ) : null}
      </p>

      <p className="font-display !mb-0 mt-4 !text-4xl font-extrabold uppercase italic leading-none !text-navy-900 sm:!text-5xl">
        {hoy ? "Hoy" : cuando === "manana" ? "Mañana" : "El"} <span className="not-italic text-slate-400">·</span> <span className="!text-[#ff1e00]">{DIAS_NOMBRES[dia]}</span>
      </p>

      <div className="mt-4 flex items-end gap-1" role="img" aria-label={`Movimiento por hora ${cuandoTxt}`}>
        {niveles.map((n, i) => {
          const h = AFLUENCIA_HORA_INICIO + i;
          const actual = hoy && reloj!.hora === h;
          const paso = hoy && h < reloj!.hora;
          return (
            <div key={h} className={`flex flex-1 flex-col items-center gap-1 ${paso ? "opacity-30" : ""}`}>
              <div className={`w-full ${COLOR_BARRA[n]} ${ALTURA[n]} ${actual ? "outline outline-2 outline-offset-2 outline-black" : ""}`} />
              <span className={`text-[11px] ${actual ? "font-black text-black" : "text-slate-500"}`}>{h}</span>
            </div>
          );
        })}
      </div>
      <p className="!mb-0 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-green-600" /> Tranquilo</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-slate-400" /> Normal</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-orange-500" /> Movido</span>
      </p>

      {tramos.length > 0 && (
        <p className="!mb-0 mt-4 bg-black px-4 py-3 !text-base !text-white">
          {mayus(cuandoTxt)}, lo más tranquilo:{" "}
          <strong className="!text-white">{tramos.map((t) => `de ${t.desde} a ${t.hasta} h`).join(" y ")}</strong>
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold">
        <Link href={toolPath("mejor-horario-gomeria")} className="!text-black underline decoration-[#ff1e00] decoration-2 underline-offset-4 hover:!text-[#ff1e00]">
          Ver los otros días y qué conviene según el trabajo
        </Link>
        <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 !text-black underline decoration-[#ff1e00] decoration-2 underline-offset-4 hover:!text-[#ff1e00]">
          <MapPin className="h-4 w-4" aria-hidden /> En vivo en Google Maps
        </a>
      </div>
    </section>
  );
}
