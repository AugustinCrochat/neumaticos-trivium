"use client";

import Link from "@/components/ui/Link";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { useBranch } from "@/contexts/branch-context";
import { BRANCHES } from "@/lib/config";
import { formatPrecio } from "@/lib/servicios";
import { mensajeAvisameApertura, waHref } from "@/lib/whatsapp";

/** Ver ServicioHoyCTA. Los precios son del taller de Argüello: con una
    sucursal que todavía no abrió se aclara y se ofrece el "Avisame". */
export function ServicioHoyBox({ href, auto, camioneta }: { href: string; auto?: number; camioneta?: number }) {
  const { selectedBranch: b } = useBranch();
  const taller = BRANCHES.find((x) => x.id === "arguello") ?? BRANCHES[0];
  const cordoba = b.province === "Córdoba";
  const servicio = cordoba ? "Alineado y balanceado" : "Alineación y balanceo";
  const precio = auto
    ? `${formatPrecio(auto)} el auto${camioneta ? ` y ${formatPrecio(camioneta)} la camioneta` : ""}`
    : null;

  return (
    <aside className="not-prose my-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
      <p className="text-xs font-black uppercase tracking-widest text-orange-700">¿Lo necesitás hoy?</p>
      <p className="mt-1 text-lg font-black leading-snug text-navy-900">
        {servicio} de las 4 ruedas con rotación{precio ? `: ${precio}` : ""}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {b.apertura
          ? `En ${taller.shortName} (Córdoba), sin turno. ${b.shortName} abre ${b.apertura}.`
          : `En ${taller.shortName}, ${taller.address}. Sin turno, en unos 40 minutos.`}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={href} className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black !text-white !no-underline hover:bg-orange-600">
          Ver precio y qué incluye
        </Link>
        {b.apertura ? (
          <WhatsAppLink
            href={waHref(b.whatsapp, mensajeAvisameApertura(b.shortName))}
            className="rounded-xl border-2 border-navy-900 bg-white px-4 py-2 text-sm font-black text-navy-900 hover:bg-navy-900 hover:text-white"
          >
            Avisame cuando abra
          </WhatsAppLink>
        ) : (
          <WhatsAppLink
            href={waHref(b.whatsapp, `Hola! Quiero hacer ${servicio.toLowerCase()}. ¿Cuánto hay de espera hoy?`)}
            className="rounded-xl border-2 border-navy-900 bg-white px-4 py-2 text-sm font-black text-navy-900 hover:bg-navy-900 hover:text-white"
          >
            Consultar la espera de hoy
          </WhatsAppLink>
        )}
      </div>
    </aside>
  );
}
