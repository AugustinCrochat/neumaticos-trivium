"use client";

import { useBranch } from "@/contexts/branch-context";

/** Ciudad de la sucursal elegida; en el HTML estático sale la de la sucursal por defecto (Córdoba). */
export function CiudadSucursal() {
  const { selectedBranch } = useBranch();
  return <>{selectedBranch.city}</>;
}
