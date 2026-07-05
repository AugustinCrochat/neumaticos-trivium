"use client";

import { useEffect, useState } from "react";
import type { Branch } from "@/lib/config";
import { getBranchStatus, type BranchStatus } from "@/lib/branch-status";

export function BranchStatusBadge({ branch }: { branch: Branch }) {
  // Se calcula en el cliente para usar la hora real y evitar mismatch de hidratacion.
  const [status, setStatus] = useState<BranchStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getBranchStatus(branch, new Date()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [branch]);

  if (!status) {
    return (
      <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">
        <span className="h-2 w-2 shrink-0 rounded-full bg-slate-300" />
        Horarios
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold ${
        status.isOpen
          ? "bg-green-100 text-green-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          status.isOpen ? "bg-green-500 animate-pulse" : "bg-slate-400"
        }`}
      />
      {status.label}
      {status.detail && (
        <span className="font-medium text-current/80">· {status.detail}</span>
      )}
    </span>
  );
}
