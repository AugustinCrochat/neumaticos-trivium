"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/ui/Link";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { useBranch } from "@/contexts/branch-context";
import { mensajeAvisameApertura, waHref } from "@/lib/whatsapp";

const chip = "rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm";

/**
 * Chips de la fila de confianza, según la sucursal elegida: las estrellas de
 * Google sólo si esa sucursal tiene puntaje propio (no se le presta el de
 * Argüello a otra), y "sin turno"/"colocación y válvulas sin cargo" sólo en un local
 * abierto con servicios confirmados. Una sucursal por abrir muestra la fecha y
 * el "Avisame".
 */
export function HeroChips({ anclas }: { anclas: { href: string; medida: string; precio: string }[] }) {
  const { selectedBranch: b } = useBranch();
  const [i, setI] = useState(0);
  const pastilla = useRef<HTMLAnchorElement>(null);
  const pausaHasta = useRef(0);
  useEffect(() => {
    if (anclas.length < 2) return;
    // Con "reducir movimiento" la medida cambia sin fundido y más despacio (el CSS ya quita la transición).
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    const io = new IntersectionObserver(([x]) => (visible = x.isIntersecting));
    if (pastilla.current) io.observe(pastilla.current);
    const t = setInterval(() => {
      // No cambia mientras se la mira de cerca (mouse, foco, toque) ni si no se ve.
      if (!visible || document.hidden || performance.now() < pausaHasta.current) return;
      setI((n) => (n + 1) % anclas.length);
    }, quieto ? 4500 : 3000);
    return () => {
      clearInterval(t);
      io.disconnect();
    };
  }, [anclas.length]);
  const pausar = (ms: number, soloMouse = false) => (e?: { pointerType?: string } | object) => {
    // En celulares tocar dispara un "enter" falso sin "leave": sólo cuenta el mouse de verdad.
    if (soloMouse && (e as { pointerType?: string } | undefined)?.pointerType !== "mouse") return;
    pausaHasta.current = ms === Infinity ? Infinity : performance.now() + ms;
  };
  const abierta = !b.apertura && !b.provisorio;

  return (
    <div className="mt-6">
      {anclas.length > 0 && (
        // Etiqueta de precio: el número más grande de la primera pantalla. Amarillo
        // de góndola, inclinada como el logo y con sombra dura, como un sticker.
        // Todas las medidas apiladas en la misma celda (las que no tocan, invisibles):
        // la etiqueta mide lo que la más larga y lo de alrededor no salta.
        <Link
          ref={pastilla}
          href={anclas[i].href}
          onPointerEnter={pausar(Infinity, true)}
          onPointerLeave={pausar(600, true)}
          onFocus={pausar(Infinity)}
          onBlur={pausar(600)}
          onTouchStart={pausar(3000)}
          className="group ml-1 inline-flex -skew-x-6 items-stretch bg-precio-400 !text-black !no-underline transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="inline-grid skew-x-6 py-2 pl-4 pr-3 md:pl-5 md:pr-4">
            {anclas.map((a, n) => (
              <span
                key={a.href}
                aria-hidden={n !== i}
                className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-500 motion-reduce:transition-none ${n === i ? "opacity-100" : "opacity-0"}`}
              >
                <span className="text-[11px] font-black uppercase leading-none tracking-widest md:text-xs">{a.medida} desde</span>
                <span className="font-display text-5xl font-extrabold italic leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">{a.precio}</span>
              </span>
            ))}
          </span>
          <span className="flex items-center bg-black px-3 text-precio-400 md:px-4">
            <svg aria-hidden="true" className="h-7 w-7 skew-x-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="square" d="M5 5l7 7-7 7M13 5l7 7-7 7" />
            </svg>
            <span className="sr-only">Ver precios</span>
          </span>
        </Link>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-2">
      {b.googleRating && <GoogleRatingBadge branchId={b.id} className={chip} />}
      {abierta ? (
        <>
          <span className={chip}>Sin turno</span>
          <span className={chip}>Colocación <span className="underline decoration-orange-500 decoration-2 underline-offset-4">sin cargo</span> en el acto</span>
        </>
      ) : b.apertura ? (
        <>
          <span className={chip}>{b.shortName} abre {b.apertura}</span>
          <WhatsAppLink href={waHref(b.whatsapp, mensajeAvisameApertura(b.shortName))} className={`${chip} hover:bg-white/20`}>
            Avisame cuando abra
          </WhatsAppLink>
        </>
      ) : null}
      </div>
    </div>
  );
}
