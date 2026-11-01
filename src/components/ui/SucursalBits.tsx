"use client";

import type { ReactNode } from "react";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { useBranch } from "@/contexts/branch-context";
import { waHref } from "@/lib/whatsapp";

/*
 * Piezas sueltas de texto y contacto que dependen de la sucursal elegida, para
 * las páginas que se prerenderizan con la sucursal por defecto (Argüello). En
 * el HTML del build sale Argüello —lo que indexa Google—; en el navegador se
 * reemplaza por la sucursal elegida o sugerida por IP.
 */

/** "Atendemos de lunes a sábado de 8 a 18 en Av. …, Córdoba." / "Abrimos en … en diciembre." */
export function AtencionLocal({ conHorario = true }: { conHorario?: boolean }) {
  const { selectedBranch: b } = useBranch();
  if (b.apertura) {
    return <>Abrimos en {b.shortName} {b.apertura}, en {b.address}.</>;
  }
  return (
    <>
      Atendemos{conHorario ? ` de ${b.hours.toLowerCase()}` : ""} en {b.address}, {b.city}.
    </>
  );
}

/** Nombre del lugar del local ("Córdoba", "Lomas del Mirador"), para frases como "el local de …". */
export function LugarLocal() {
  const { selectedBranch: b } = useBranch();
  return <>{b.province === "Córdoba" ? b.city : b.shortName}</>;
}

/** Enlace a WhatsApp con el número de la sucursal elegida. */
export function WhatsAppSucursal({ texto, className, children }: { texto: string; className?: string; children: ReactNode }) {
  const { selectedBranch: b } = useBranch();
  return (
    <WhatsAppLink href={waHref(b.whatsapp, texto)} className={className}>
      {children}
    </WhatsAppLink>
  );
}
