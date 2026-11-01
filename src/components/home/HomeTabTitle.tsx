"use client";

import { useEffect } from "react";
import { useBranch } from "@/contexts/branch-context";

/*
 * Título de la pestaña de la home según la sucursal elegida. El <title> del
 * HTML (el que indexa Google) queda en Córdoba, la sucursal por defecto; esto
 * sólo corrige lo que ve quien eligió —o recibió por IP— otra sucursal.
 */
export function HomeTabTitle() {
  const { selectedBranch: b } = useBranch();
  useEffect(() => {
    if (b.province === "Córdoba") return;
    const previo = document.title;
    document.title = b.apertura
      ? `Neumáticos baratos en ${b.shortName} — abrimos ${b.apertura} | Neumáticos Trivium`
      : `Neumáticos baratos en ${b.shortName} — Cubiertas al mejor precio`;
    return () => {
      document.title = previo;
    };
  }, [b]);
  return null;
}
