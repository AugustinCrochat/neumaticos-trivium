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
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const hoy = new Date().getDay();
  const orden = [1, 2, 3, 4, 5, 6, 0];
  return (
    <div className="group relative hidden xl:block">
      <Link href={`/sucursales/${b.id}`} className="flex items-center gap-2 py-1 text-xs font-bold !text-zinc-200 !no-underline hover:!text-white">
        <span className={`h-2.5 w-2.5 rounded-full ${estado.isOpen ? "bg-emerald-400" : "bg-zinc-500"}`} />
        <span className="flex flex-col leading-tight">
          <span className="font-black uppercase tracking-wide text-white">{estado.label}</span>
          {estado.detail && <span className="text-[11px] font-semibold text-zinc-400">{estado.detail}</span>}
        </span>
      </Link>
      {/* Horarios: aparece al pasar el mouse o al enfocar con teclado. El padding superior evita que se cierre al cruzar el hueco. */}
      <div className="invisible absolute right-0 top-full z-50 w-64 pt-3 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="border-2 border-black bg-white p-4 text-black">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#d11800]">{b.shortName}</p>
          <p className="mt-0.5 text-xs text-slate-500">{b.address}</p>
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {orden.map((d) => {
              const regla = b.schedule.find((r) => r.days.includes(d));
              return (
                <li key={d} className={`flex justify-between py-1.5 ${d === hoy ? "font-black" : "text-slate-600"}`}>
                  <span>{DIAS[d]}{d === hoy ? " · hoy" : ""}</span>
                  <span>{regla ? `${regla.open} a ${regla.close}` : "Cerrado"}</span>
                </li>
              );
            })}
          </ul>
          <Link href={`/sucursales/${b.id}`} className="mt-3 flex min-h-10 items-center justify-center bg-[#ff1e00] px-4 text-sm font-black !text-white !no-underline transition-colors hover:bg-[#e01a00]">
            Ver sucursal {b.shortName}
          </Link>
        </div>
      </div>
    </div>
  );
}
