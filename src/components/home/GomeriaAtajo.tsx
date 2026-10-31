"use client";

import { useBranch } from "@/contexts/branch-context";

/** Texto de la tarjeta de gomería de la home según la sucursal elegida:
    "alineado y balanceado" en Córdoba, "alineación y balanceo" en Buenos
    Aires, y sin prometer orden de llegada en un local que no abrió. */
export function GomeriaAtajo() {
  const { selectedBranch: b } = useBranch();
  const cordoba = b.province === "Córdoba";
  return (
    <>
      <span className="block font-black text-navy-900">
        Gomería: {cordoba ? "alineado y balanceado" : "alineación y balanceo"}
      </span>
      <span className="mt-1 block text-sm text-slate-600">
        {b.apertura ? `${b.shortName} abre ${b.apertura}.` : `Por orden de llegada, en ${b.shortName}.`}
      </span>
    </>
  );
}
