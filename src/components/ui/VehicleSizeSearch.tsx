"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import { getSizesForVehicle, type VehicleDBEntry } from "@/lib/vehicles";
import { VehicleCombobox } from "@/components/ui/VehicleCombobox";
import type { VehiculoOption } from "@/lib/pos-api";

function findVersionIndex(sizes: VehicleDBEntry["sizes"] | null, initialMedida?: string): number {
  if (!sizes || !initialMedida) return 0;
  const parts = initialMedida.toLowerCase().split("-");
  const w = parts[0];
  const p = parts[1];
  const r = parts[2]?.startsWith("r") ? parts[2].substring(1) : parts[2];
  const idx = sizes.findIndex((s) => s.w === w && s.p === p && s.r === r);
  return idx >= 0 ? idx : 0;
}

export function VehicleSizeSearch({ initialMedida }: { initialMedida?: string }) {
  const router = useRouter();
  const { selectedBranch } = useBranch();
  const { vehiculos, selectedVehicle, setSelectedVehicle, clearSelectedVehicle } = useVehicle();

  const sizes = selectedVehicle ? getSizesForVehicle(selectedVehicle.marca, selectedVehicle.modelo) : null;
  const [versionIndex, setVersionIndex] = useState(() => findVersionIndex(sizes, initialMedida));
  const selectedSize = sizes?.[versionIndex];

  function selectVehicle(vehicle: VehiculoOption) {
    setSelectedVehicle(vehicle);
    setVersionIndex(0);
  }

  function verNeumaticos() {
    if (!selectedVehicle || !selectedSize) return;
    const medida = `${selectedSize.w}-${selectedSize.p}-r${selectedSize.r}`;
    router.push(`/buscar?medida=${medida}&marca=${encodeURIComponent(selectedVehicle.marca)}&modelo=${encodeURIComponent(selectedVehicle.modelo)}`);
  }

  const waText = selectedVehicle
    ? encodeURIComponent(`Hola, quiero saber la medida de neumático de mi ${selectedVehicle.marca} ${selectedVehicle.modelo}`)
    : "";

  if (!selectedVehicle) {
    return (
      <div className="w-full">
        <VehicleCombobox vehiculos={vehiculos} onSelect={selectVehicle} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-3 rounded-xl border-2 border-orange-500 bg-orange-50 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Tu vehículo</p>
          <p className="text-base font-bold text-navy-900 truncate">{selectedVehicle.marca} {selectedVehicle.modelo}</p>
        </div>
        <button
          onClick={clearSelectedVehicle}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors shrink-0"
        >
          Cambiar
        </button>
      </div>

      {sizes && sizes.length > 0 ? (
        <>
          {sizes.length > 1 && (
            <select
              value={versionIndex}
              onChange={(e) => setVersionIndex(Number(e.target.value))}
              className="w-full mb-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-navy-500/10 outline-none"
            >
              {sizes.map((s, i) => (
                <option key={i} value={i}>{s.version || `${s.w}/${s.p} R${s.r}`}</option>
              ))}
            </select>
          )}
          <button
            onClick={verNeumaticos}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl text-base transition-colors"
          >
            Ver neumáticos {selectedSize!.w}/{selectedSize!.p} R{selectedSize!.r}
          </button>
        </>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm font-semibold text-slate-600 mb-2">
            Todavía no tenemos cargada la medida de este modelo.
          </p>
          <a
            href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline"
          >
            Consultanos por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
