"use client";

import { useEffect, useState } from "react";
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
  useEffect(() => {
    if (anclas.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % anclas.length), 3000);
    return () => clearInterval(t);
  }, [anclas.length]);
  const abierta = !b.apertura && !b.provisorio;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {b.googleRating && <GoogleRatingBadge branchId={b.id} className={chip} />}
      {anclas.length > 0 && (
        // Todas las medidas apiladas en la misma celda (las que no tocan, invisibles):
        // la píldora mide lo que la más larga y los chips vecinos no saltan.
        <Link
          href={anclas[i].href}
          className="inline-grid rounded-full bg-orange-500 px-3 py-1.5 text-sm font-black !text-white !no-underline transition-colors hover:bg-orange-600"
        >
          {anclas.map((a, n) => (
            <span
              key={a.href}
              aria-hidden={n !== i}
              className={`col-start-1 row-start-1 text-center transition-opacity duration-500 ${n === i ? "opacity-100" : "opacity-0"}`}
            >
              {a.texto}
            </span>
          ))}
        </Link>
      )}
      {abierta ? (
        <>
          <span className={chip}>Colocación sin cargo</span>
          <span className={chip}>Sin turno</span>
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
