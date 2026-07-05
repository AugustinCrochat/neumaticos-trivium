"use client";

import { useEffect } from "react";
import { BRANCHES } from "@/lib/config";
import { useBranch } from "@/contexts/branch-context";

/**
 * Al llegar a la pagina de una sucursal (tipicamente escaneando su QR en el local),
 * la fijamos como sucursal activa para que el resto del sitio -catalogo, WhatsApp,
 * precios- use esa sucursal sin volver a preguntar.
 */
export function SetActiveBranch({ branchId }: { branchId: string }) {
  const { selectedBranch, setSelectedBranch } = useBranch();

  useEffect(() => {
    if (selectedBranch.id === branchId) return;
    const branch = BRANCHES.find((b) => b.id === branchId);
    if (branch) setSelectedBranch(branch);
  }, [branchId, selectedBranch.id, setSelectedBranch]);

  return null;
}
