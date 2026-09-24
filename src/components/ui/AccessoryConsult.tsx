"use client";

import { useBranch } from "@/contexts/branch-context";
import type { Accessory } from "@/lib/types";
import { isLowStock, stockLabel } from "@/lib/stock";

export function AccessoryConsult({ accessory }: { accessory: Accessory }) {
  const { selectedBranch } = useBranch();
  const waText = encodeURIComponent(`Hola, quiero consultar por ${accessory.nombre}`);

  return (
    <div>
      {accessory.enStock && (
        <p className={`text-[11px] font-bold mb-2 flex items-center gap-1.5 ${isLowStock(accessory.stock) ? "text-amber-600" : "text-emerald-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLowStock(accessory.stock) ? "bg-amber-500" : "bg-emerald-500"}`} />
          {stockLabel(accessory.stock)}
        </p>
      )}
      {accessory.enStock ? (
        <a
          href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          Consultar en {selectedBranch.shortName}
        </a>
      ) : (
        <button disabled className="w-full bg-slate-300 text-white font-semibold py-2.5 rounded-xl text-sm">
          Sin stock
        </button>
      )}
    </div>
  );
}
