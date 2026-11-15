"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { useBranch } from "@/contexts/branch-context";
import { getBranchStatus, type BranchStatus } from "@/lib/branch-status";

/**
 * Estado del local en el header de escritorio: "Abierto · cierra 19:00". Que
 * se vea si está abierto ahora, sin entrar a ninguna página, es parte de
 * comunicar atención rápida. La hora se calcula en el cliente (el sitio es
 * estático); hasta entonces no se dibuja nada.
 */
export function HeaderEstado() {
  const { selectedBranch: b, hasConfirmedBranch } = useBranch();
  const [estado, setEstado] = useState<BranchStatus | null>(null);
  useEffect(() => {
    const actualizar = () => setEstado(getBranchStatus(b, new Date()));
    actualizar();
    const t = setInterval(actualizar, 60_000);
    return () => clearInterval(t);
  }, [b]);
  if (!estado || !hasConfirmedBranch) return null;
  return (
    <Link href={`/sucursales/${b.id}`} className="hidden items-center gap-2 text-xs font-bold !text-zinc-200 !no-underline hover:!text-white xl:flex">
      <span className={`h-2.5 w-2.5 rounded-full ${estado.isOpen ? "bg-emerald-400" : "bg-zinc-500"}`} />
      <span className="flex flex-col leading-tight">
        <span className="font-black uppercase tracking-wide text-white">{estado.label}</span>
        {estado.detail && <span className="text-[11px] font-semibold text-zinc-400">{estado.detail}</span>}
      </span>
    </Link>
  );
}
