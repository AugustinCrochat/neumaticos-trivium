"use client";

import { useBranch } from "@/contexts/branch-context";
import type { Branch } from "@/lib/config";

/*
 * Etiqueta y párrafo del hero según la sucursal elegida. El HTML del build
 * sale con la sucursal por defecto (Argüello, Córdoba), que es lo que indexa
 * Google; quien eligió —o recibió por IP— una sucursal de Buenos Aires ve su
 * local, y si todavía no abrió, la fecha en vez de prometer retiro y taller.
 *
 * En Córdoba se dice "alineado y balanceado"; en Buenos Aires, "alineación y
 * balanceo".
 */

const lugar = (b: Branch) => (b.province === "Córdoba" ? b.city : b.shortName);

export function HeroEtiqueta() {
  const { selectedBranch: b } = useBranch();
  return (
    <span className="mb-4 inline-flex w-fit rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
      Neumáticos baratos en {lugar(b)} · {b.apertura ? `Abrimos ${b.apertura}` : "Importación directa"}
    </span>
  );
}

export function HeroTexto() {
  const { selectedBranch: b } = useBranch();
  return (
    <p className="mt-4 max-w-md text-lg leading-snug text-slate-300">
      {b.apertura
        ? `Abrimos en ${b.shortName} ${b.apertura}. Mirá los precios y dejanos tu consulta.`
        : "Precio publicado, stock real y colocación sin cargo."}
    </p>
  );
}
