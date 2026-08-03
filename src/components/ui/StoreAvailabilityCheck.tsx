"use client";

import { useState } from "react";
import type { Branch } from "@/lib/config";

/**
 * Buscador de disponibilidad en tienda por código postal, requerido por el
 * complemento de Merchant Center "Páginas de producto con disponibilidad en
 * tienda". Con una sola sucursal no hay ubicaciones para comparar: cualquier
 * CP resuelve siempre a la misma sucursal, mostrando el stock real del
 * producto en ese local.
 */
export function StoreAvailabilityCheck({
  branch,
  enStock,
}: {
  branch: Branch;
  enStock?: boolean;
}) {
  const [postalCode, setPostalCode] = useState("");
  const [checked, setChecked] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (postalCode.trim()) setChecked(true);
        }}
        className="flex gap-2"
      >
        <label htmlFor="store-availability-cp" className="sr-only">
          Código postal
        </label>
        <input
          id="store-availability-cp"
          type="text"
          inputMode="numeric"
          placeholder="Tu código postal"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          maxLength={8}
          className="flex-1 min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold px-4 py-2 transition-colors"
        >
          Ver disponibilidad
        </button>
      </form>
      {checked && (
        <p className="text-xs text-slate-600 mt-2 leading-snug">
          {enStock
            ? `Disponible para retirar en ${branch.name} — ${branch.address}, ${branch.city} (CP ${branch.postalCode}).`
            : `Sin stock por el momento en ${branch.name}. Consultanos por reposición.`}
        </p>
      )}
    </div>
  );
}
