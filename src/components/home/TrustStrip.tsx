"use client";

import { useBranch } from "@/contexts/branch-context";

const ARGUMENTOS = ["Importación directa", "Garantía de 1 año", "Colocación incluida"];

/**
 * Franja debajo del hero: el recorrido en tres pasos, dibujado como flechas
 * que se empujan (elegí → vení → salí). La rapidez se comunica con la forma
 * —dirección, números grandes, el último paso en rojo— y no con un texto que
 * diga "somos rápidos". Abajo, en una línea, los argumentos de confianza que
 * antes ocupaban toda la franja.
 *
 * Sigue a la sucursal elegida: un local que todavía no abrió no promete
 * "sin turno" ni colocación en el acto.
 */
export function TrustStrip() {
  const { selectedBranch: b } = useBranch();
  const abierta = !b.apertura && !b.provisorio;
  const pasos = abierta
    ? [
        { titulo: "Elegí tu medida", detalle: "Precio y stock publicados" },
        { titulo: "Vení sin turno", detalle: "Por orden de llegada" },
        { titulo: "Salí andando", detalle: "Colocación sin cargo en el acto" },
      ]
    : [
        { titulo: "Elegí tu medida", detalle: "Precios ya publicados" },
        { titulo: "Dejá tu consulta", detalle: "Por WhatsApp" },
        { titulo: "Te avisamos", detalle: b.apertura ? `Abrimos ${b.apertura}` : "Cuando abra el local" },
      ];
  const fondos = ["bg-tire-700", "bg-tire-600", "bg-orange-500"];

  return (
    <section className="bg-black">
      <ol className="mx-auto flex max-w-7xl 2xl:max-w-[96rem] md:px-4">
        {pasos.map((p, n) => (
          <li
            key={p.titulo}
            className={`paso-flecha flex min-w-0 flex-1 items-center gap-1.5 py-2.5 pl-5 pr-3 text-white md:gap-4 md:py-4 md:pl-12 ${n > 0 ? "-ml-2 md:-ml-4" : "!pl-3 md:!pl-6"} ${fondos[n]}`}
          >
            <span aria-hidden="true" className={`font-display text-4xl font-extrabold italic leading-none md:text-6xl ${n === 2 ? "text-white" : "text-precio-400"}`}>
              {n + 1}
            </span>
            <span className="min-w-0">
              <span className="font-display block text-[15px] font-bold uppercase italic leading-[1.05] tracking-wide min-[400px]:text-base md:text-2xl">
                {p.titulo}
              </span>
              <span className={`mt-0.5 hidden text-sm md:block ${n === 2 ? "text-white/90" : "text-slate-300"}`}>{p.detalle}</span>
            </span>
          </li>
        ))}
      </ol>
      <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-b border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-navy-900 md:gap-x-10 md:text-sm">
        {(abierta ? ARGUMENTOS : ARGUMENTOS.slice(0, 2)).map((t) => (
          <li key={t} className="flex items-center gap-1.5">
            <svg aria-hidden="true" className="h-3.5 w-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
              <path strokeLinecap="square" d="M4 12l5 5L20 6" />
            </svg>
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
