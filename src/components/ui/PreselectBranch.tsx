"use client";

import { useEffect } from "react";
import { useBranch } from "@/contexts/branch-context";
import { BRANCHES, BRANCH_COOKIE } from "@/lib/config";

/**
 * Deja elegida la sucursal que atiende esta zona (landings de /neumaticos-en)
 * para que el WhatsApp, el teléfono y "Cómo llegar" del resto del sitio —
 * encabezado, pie, botón flotante — sean los de ese local y no los de la
 * sucursal por defecto.
 *
 * Solo actúa si la persona todavía no eligió sucursal: si ya hay cookie, es una
 * elección explícita y no se pisa. No renderiza nada, así la landing sigue
 * siendo estática (la cookie se lee en el cliente, no en el servidor).
 */
export function PreselectBranch({ branchId, forzar }: { branchId: string; forzar?: boolean }) {
  const { setSelectedBranch } = useBranch();

  useEffect(() => {
    const hasCookie = document.cookie.split("; ").some((c) => c.startsWith(`${BRANCH_COOKIE}=`));
    // `forzar`: la URL misma es la elección (portal de región), así que pisa la cookie.
    if (hasCookie && !forzar) return;
    const branch = BRANCHES.find((b) => b.id === branchId);
    if (branch) setSelectedBranch(branch);
    // setSelectedBranch cambia en cada render del provider; solo importa al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, forzar]);

  return null;
}
