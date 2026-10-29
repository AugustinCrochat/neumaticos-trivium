"use client";

import { useState } from "react";
import { MapPin, MessageCircle } from "lucide-react";
import Link from "@/components/ui/Link";
import { BRANCHES } from "@/lib/config";
import { getBranchStatus } from "@/lib/branch-status";
import { useRelojCordoba } from "@/lib/reloj-cordoba";
import {
  AFLUENCIA_HORA_INICIO,
  AFLUENCIA_SEMANAS,
  DIAS_ABREVIADOS,
  DIAS_NOMBRES,
  NIVELES,
  mejoresTramos,
  nivelEnHora,
  nivelesDelDia,
  type Nivel,
} from "@/lib/afluencia";

const branch = BRANCHES.find((b) => b.id === "arguello")!;
const DIAS = [1, 2, 3, 4, 5, 6];

const COLOR_BARRA = ["bg-green-500", "bg-yellow-400", "bg-orange-500"];
const COLOR_TEXTO = ["text-green-700", "text-yellow-700", "text-orange-600"];
const ALTURA = ["h-10", "h-20", "h-32"];

const SERVICIOS = [
  {
    id: "alineado",
    label: "Alineado y balanceado",
    texto:
      "Dura alrededor de 50 minutos en un auto y 1 h 20 en una camioneta. Si hay cola, se suma a la espera: conviene ir en un horario tranquilo y con tiempo antes del cierre.",
    link: { href: "/servicios/alineacion", label: "Ver alineación y balanceo" },
    wa: "alinear y balancear",
  },
  {
    id: "tuercas",
    label: "Tuercas antirrobo",
    texto:
      "Si ya sabés qué juego necesitás, es un trabajo corto. Traé la llave de la tuerca de seguridad si ya tenés una puesta, y si la perdiste avisanos antes de venir.",
    link: { href: "/tuercas-antirrobo", label: "Ver tuercas antirrobo" },
    wa: "colocar tuercas antirrobo",
  },
  {
    id: "neumaticos",
    label: "Cambiar neumáticos",
    texto:
      "Confirmá la medida y el stock antes de venir para no perder el viaje. Si querés alineación y balanceo en el mismo turno, contá con más tiempo.",
    link: { href: "/buscador", label: "Buscar mi medida" },
    wa: "cambiar neumáticos",
  },
  {
    id: "pinchadura",
    label: "Pinchadura",
    texto: "Revisamos la cubierta por dentro y te decimos si se repara. Es de los trabajos más rápidos; en un horario movido igual hay que esperar el turno de llegada.",
    link: { href: "/servicios/reparacion-de-pinchaduras", label: "Ver reparación de pinchaduras" },
    wa: "reparar una pinchadura",
  },
];

const rango = (d: number, h: number) => `${d} a ${h} h`;

export function MejorHorario() {
  const reloj = useRelojCordoba();
  const dia = reloj?.dia ?? null;
  const hora = reloj?.hora ?? null;
  const [elegido, setElegido] = useState<number | null>(null);
  const [servicio, setServicio] = useState(SERVICIOS[0].id);

  // Hoy si abre; si hoy es domingo (o no se sabe todavía), el lunes.
  const diaVisible = elegido ?? (dia && DIAS.includes(dia) ? dia : 1);
  const niveles = nivelesDelDia(diaVisible);
  const tramos = mejoresTramos(diaVisible);
  const ahora = dia !== null && hora !== null ? nivelEnHora(dia, hora) : null;
  const abierto = reloj ? getBranchStatus(branch).isOpen : false;
  const svc = SERVICIOS.find((s) => s.id === servicio) ?? SERVICIOS[0];
  const waTexto = `Hola, quiero ir a ${svc.wa} el ${DIAS_NOMBRES[diaVisible]}. ¿Cómo está la espera?`;

  return (
    <div>
      {reloj && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Ahora en Argüello</p>
          {abierto && ahora !== null ? (
            <p className="mt-1 text-xl font-black text-tire-950">
              Movimiento <span className={COLOR_TEXTO[ahora]}>{NIVELES[ahora].toLowerCase()}</span> para esta hora
            </p>
          ) : (
            <p className="mt-1 text-xl font-black text-tire-950">Cerrado ahora · {branch.hours}</p>
          )}
          <p className="mt-1 text-sm text-slate-600">
            Es lo habitual para {abierto ? "este día y esta hora" : "los días de atención"}, no un conteo en vivo. Para ver cómo está en este momento, mirá «En vivo» en la ficha de Google Maps.
          </p>
        </div>
      )}

      <h2 className="text-lg font-black text-tire-950">¿Qué día pensás venir?</h2>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Día de la semana">
        {DIAS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setElegido(d)}
            aria-pressed={diaVisible === d}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              diaVisible === d ? "border-tire-950 bg-tire-950 text-white" : "border-slate-200 bg-white text-tire-950 hover:border-orange-500"
            }`}
          >
            {DIAS_ABREVIADOS[d]}
            {dia === d && <span className="ml-1 text-xs font-medium opacity-70">hoy</span>}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-end gap-1.5 sm:gap-2" role="img" aria-label={`Movimiento por hora el ${DIAS_NOMBRES[diaVisible]}`}>
        {niveles.map((n, i) => {
          const h = AFLUENCIA_HORA_INICIO + i;
          const actual = dia === diaVisible && hora === h;
          return (
            <div key={h} className="flex flex-1 flex-col items-center gap-1">
              <div className={`w-full rounded-t-md ${COLOR_BARRA[n]} ${ALTURA[n]} ${actual ? "ring-2 ring-tire-950 ring-offset-2" : ""}`} title={`${h} h: ${NIVELES[n].toLowerCase()}`} />
              <span className={`text-xs ${actual ? "font-black text-tire-950" : "text-slate-500"}`}>{h}</span>
            </div>
          );
        })}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        {NIVELES.map((nombre, n) => (
          <li key={nombre} className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm ${COLOR_BARRA[n as Nivel]}`} />
            {nombre}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-base text-slate-700">
        {tramos.length > 0 ? (
          <>
            El {DIAS_NOMBRES[diaVisible]} es más {tramos[0].nivel === 0 ? "tranquilo" : tramos[0].nivel === 1 ? "parejo" : "movido a toda hora"}{" "}
            {tramos[0].nivel === 2 ? "" : <strong>{tramos.map((t) => rango(t.desde, t.hasta)).join(" y de ")}</strong>}
            {tramos[0].nivel === 2 ? ". Si podés, probá otro día." : "."}
          </>
        ) : null}
      </p>

      <h2 className="mt-8 text-lg font-black text-tire-950">¿Qué vas a hacer?</h2>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Servicio">
        {SERVICIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setServicio(s.id)}
            aria-pressed={servicio === s.id}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              servicio === s.id ? "border-tire-950 bg-tire-950 text-white" : "border-slate-200 bg-white text-tire-950 hover:border-orange-500"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-slate-700">{svc.texto}</p>
        <Link href={svc.link.href} className="mt-2 inline-block text-sm font-bold text-orange-600 hover:underline">
          {svc.link.label} →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-tire-950 px-5 py-3 text-sm font-bold text-white hover:bg-black"
        >
          <MapPin className="h-4 w-4" aria-hidden /> Ver movimiento en vivo en Google Maps
        </a>
        <a
          href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(waTexto)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> Consultar la espera por WhatsApp
        </a>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Basado en cuándo ingresaron los trabajos al taller en las últimas {AFLUENCIA_SEMANAS} semanas. Atendemos por orden de llegada, sin turnos.
      </p>
    </div>
  );
}
