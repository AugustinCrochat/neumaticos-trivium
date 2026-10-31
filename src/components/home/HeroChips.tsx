"use client";

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
export function HeroChips({ ancla }: { ancla: { href: string; texto: string } | null }) {
  const { selectedBranch: b } = useBranch();
  const abierta = !b.apertura && !b.provisorio;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {b.googleRating && <GoogleRatingBadge branchId={b.id} className={chip} />}
      {ancla && (
        <Link
          href={ancla.href}
          className="rounded-full bg-orange-500 px-3 py-1.5 text-sm font-black !text-white !no-underline transition-colors hover:bg-orange-600"
        >
          {ancla.texto}
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
