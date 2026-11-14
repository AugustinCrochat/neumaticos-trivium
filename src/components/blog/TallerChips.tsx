"use client";

import { useBranch } from "@/contexts/branch-context";

const chip = "rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold text-white";

/** Lo que el taller promete, según la sucursal elegida: un local que todavía no abrió no dice "sin turno". */
export function TallerChips() {
  const { selectedBranch: b } = useBranch();
  const abierta = !b.apertura && !b.provisorio;
  return (
    <ul className="flex flex-wrap gap-2">
      {abierta ? (
        <>
          <li className={chip}>Sin turno</li>
          <li className={chip}>Por orden de llegada</li>
        </>
      ) : (
        <li className={chip}>{b.apertura ? `${b.shortName} abre ${b.apertura}` : "Precio de referencia"}</li>
      )}
      <li className={chip}>Alineadora 3D</li>
    </ul>
  );
}
