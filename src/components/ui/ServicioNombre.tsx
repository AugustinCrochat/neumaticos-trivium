"use client";

import { useBranch } from "@/contexts/branch-context";
import { nombreServicio } from "@/lib/servicios";

/** Nombre de un servicio según la sucursal elegida ("alineado" en Argüello). */
export function ServicioNombre({ id, fallback }: { id: string; fallback: string }) {
  const { selectedBranch } = useBranch();
  return <>{nombreServicio(id, fallback, selectedBranch.id)}</>;
}

/** Texto que cambia según la sucursal: la variante cordobesa o la general. */
export function PorSucursal({ arguello, otras }: { arguello: string; otras: string }) {
  const { selectedBranch } = useBranch();
  return <>{selectedBranch.id === "arguello" ? arguello : otras}</>;
}
