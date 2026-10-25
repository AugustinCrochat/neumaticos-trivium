"use client";

import { useEffect, useState } from "react";
import { useBranch } from "@/contexts/branch-context";
import { BranchStatusBadge } from "@/app/sucursales/[id]/BranchStatusBadge";
import { PaymentMethodsSection } from "@/components/ui/PaymentMethodsSection";
import { getPickupLabel, type PickupTiming } from "@/lib/branch-status";
import type { Accessory } from "@/lib/types";
import { isLowStock, stockLabel } from "@/lib/stock";
import { WhatsAppLink } from "./WhatsAppLink";

export function AccessoryConsult({ accessory }: { accessory: Accessory }) {
  const { selectedBranch } = useBranch();
  const [pickup, setPickup] = useState<PickupTiming | null>(null);
  useEffect(() => {
    const update = () => setPickup(getPickupLabel(selectedBranch));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [selectedBranch]);
  const waText = encodeURIComponent(`Hola, quiero consultar por ${accessory.nombre}`);

  return (
    <div className="space-y-4">
      <div>
      {accessory.enStock && (
        <p className={`text-[11px] font-bold mb-2 flex items-center gap-1.5 ${isLowStock(accessory.stock) ? "text-amber-600" : "text-emerald-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLowStock(accessory.stock) ? "bg-amber-500" : "bg-emerald-500"}`} />
          {stockLabel(accessory.stock)}
        </p>
      )}
      {accessory.enStock ? (
        <WhatsAppLink
          href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          Consultar en {selectedBranch.shortName}
        </WhatsAppLink>
      ) : (
        <button disabled className="w-full bg-slate-300 text-white font-semibold py-2.5 rounded-xl text-sm">
          Sin stock
        </button>
      )}
      </div>

      {/* Mismo bloque que la ficha de neumáticos, sin la parte de válvulas
          (una tuerca no lleva): colocación gratis, horario y si está abierto. */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-600/30">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-navy-900 text-base leading-snug">Colocación en {selectedBranch.shortName} sin cargo</p>
            {accessory.enStock ? (
              <p className={`text-sm font-bold mt-0.5 ${pickup && !pickup.sameDay ? "text-amber-600" : "text-emerald-700"}`}>
                {pickup?.label ?? "Retiro el mismo día"}
              </p>
            ) : (
              <p className="text-sm font-bold text-red-600 mt-0.5">Sin stock para retiro</p>
            )}
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              {selectedBranch.address}, {selectedBranch.city} · <span className="font-bold">{selectedBranch.hours}</span>
            </p>
            <div className="mt-2">
              <BranchStatusBadge branch={selectedBranch} />
            </div>
          </div>
        </div>
      </div>

      <PaymentMethodsSection basePrice={accessory.price} />
    </div>
  );
}
