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
 * Argüello a otra), y "sin turno"/"colocación sin cargo" sólo en un local
 * abierto con servicios confirmados. Una sucursal por abrir muestra la fecha y
 * el "Avisame".
 */
export function HeroChips({ anclas }: { anclas: { href: string; texto: string }[] }) {
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
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {b.googleRating && <GoogleRatingBadge branchId={b.id} className={chip} />}
      {anclas.length > 0 && (
        // Todas las medidas apiladas en la misma celda (las que no tocan, invisibles):
        // la píldora mide lo que la más larga y los chips vecinos no saltan.
        <Link
          ref={pastilla}
          href={anclas[i].href}
          onPointerEnter={pausar(Infinity, true)}
          onPointerLeave={pausar(600, true)}
          onFocus={pausar(Infinity)}
          onBlur={pausar(600)}
          onTouchStart={pausar(3000)}
          className="inline-grid rounded-full bg-orange-500 px-3 py-1.5 text-sm font-black !text-white !no-underline transition-colors hover:bg-orange-600"
        >
          {anclas.map((a, n) => (
            <span
              key={a.href}
              aria-hidden={n !== i}
              className={`col-start-1 row-start-1 text-center transition-opacity duration-500 motion-reduce:transition-none ${n === i ? "opacity-100" : "opacity-0"}`}
            >
              {a.texto}
            </span>
          ))}
        </Link>
      )}
      {abierta ? (
        <>
          <span className={chip}>Colocación sin cargo en el acto</span>
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
  );
}
