"use client";

import Link from "@/components/ui/Link";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import { useBranch } from "@/contexts/branch-context";
import { MENSAJE_GENERICO, mensajeAvisameApertura, waHref } from "@/lib/whatsapp";

/**
 * Franja roja que abre el pie de todas las páginas: el último llamado antes de
 * los enlaces. Sigue a la sucursal elegida; una que todavía no abrió ofrece el
 * "Avisame" en vez de "Cómo llegar" y no promete atención sin turno.
 */
export function FooterCTA() {
  const { selectedBranch: b } = useBranch();
  const abierta = !b.apertura && !b.provisorio;
  const boton = "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-black !no-underline transition-transform hover:-translate-y-0.5 active:translate-y-0.5";
  return (
    <div className="bg-orange-500 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between md:py-10 2xl:max-w-[96rem]">
        <div>
          <p className="font-display text-4xl font-extrabold uppercase italic leading-[0.95] md:text-5xl">
            {abierta ? "Vení sin turno. Salí andando." : `${b.shortName} abre ${b.apertura ?? "pronto"}`}
          </p>
          <p className="mt-2 text-base font-semibold text-white/90">
            {b.address}, {b.city}
            {abierta ? ` · ${b.hours}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {abierta ? (
            <Link href={`/sucursales/${b.id}`} className={`${boton} bg-black !text-white `}>
              <DirectionsIcon className="h-5 w-5" />
              Cómo llegar
            </Link>
          ) : (
            <WhatsAppLink href={waHref(b.whatsapp, mensajeAvisameApertura(b.shortName))} className={`${boton} bg-black !text-white `}>
              Avisame cuando abra
            </WhatsAppLink>
          )}
          <Link href="/neumaticos" className={`${boton} bg-white !text-black `}>
            Buscar mi medida
          </Link>
          {abierta && (
            <WhatsAppLink href={waHref(b.whatsapp, MENSAJE_GENERICO)} className={`${boton} border-2 border-white !text-white`}>
              WhatsApp
            </WhatsAppLink>
          )}
        </div>
      </div>
    </div>
  );
}
