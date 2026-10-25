"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import { getSizesForVehicle, type VehicleDBEntry } from "@/lib/vehicles";
import { VehicleCombobox } from "@/components/ui/VehicleCombobox";
import { VersionSelect } from "@/components/ui/VersionSelect";
import type { VehiculoOption } from "@/lib/pos-api";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

type Sizes = VehicleDBEntry["sizes"];

function findVersionIndexByMedida(sizes: Sizes | null, medida?: string): number {
  if (!sizes || !medida) return -1;
  const parts = medida.toLowerCase().split("-");
  const w = parts[0];
  const p = parts[1];
  const r = parts[2]?.startsWith("r") ? parts[2].substring(1) : parts[2];
  return sizes.findIndex((s) => s.w === w && s.p === p && s.r === r);
}

function findVersionIndexBySize(sizes: Sizes | null, size?: Sizes[number]): number {
  if (!sizes || !size) return -1;
  return sizes.findIndex((s) => s.w === size.w && s.p === size.p && s.r === size.r);
}

export function VehicleSizeSearch({ initialMedida, economicos = false }: { initialMedida?: string; economicos?: boolean }) {
  const router = useRouter();
  const { selectedBranch } = useBranch();
  const { vehiculos, selectedVehicle, setSelectedVehicle, clearSelectedVehicle } = useVehicle();

  const sizes = selectedVehicle ? getSizesForVehicle(selectedVehicle.marca, selectedVehicle.modelo) : null;

  // Prioridad para la versión inicial: la medida de la URL actual (por si
  // vino de un link puntual) y si no, la última versión que el usuario
  // eligió y quedó guardada (ej. Golf Comfortline en vez de Trendline).
  // null = todavía no eligió versión (el modelo tiene varias): se le abre la
  // lista para que elija, en vez de asumir la primera.
  const [versionIndex, setVersionIndexState] = useState<number | null>(() => {
    const byUrl = findVersionIndexByMedida(sizes, initialMedida);
    if (byUrl >= 0) return byUrl;
    const bySaved = findVersionIndexBySize(sizes, selectedVehicle?.size);
    if (bySaved >= 0) return bySaved;
    return sizes && sizes.length === 1 ? 0 : null;
  });
  // Cambia al elegir otro auto para que el selector se vuelva a montar y se abra solo.
  const [versionKey, setVersionKey] = useState(0);
  // Sólo se abre sola al elegir el auto en este buscador, no al cargar la página con un auto recordado.
  const [freshPick, setFreshPick] = useState(false);
  const selectedSize = versionIndex !== null ? sizes?.[versionIndex] : undefined;

  function selectVehicle(vehicle: VehiculoOption) {
    const newSizes = getSizesForVehicle(vehicle.marca, vehicle.modelo);
    const single = newSizes && newSizes.length === 1 ? newSizes[0] : undefined;
    setSelectedVehicle(vehicle, single);
    setVersionIndexState(single ? 0 : null);
    setVersionKey((k) => k + 1);
    setFreshPick(true);
  }

  function changeVersion(index: number) {
    setVersionIndexState(index);
    if (selectedVehicle && sizes?.[index]) setSelectedVehicle(selectedVehicle, sizes[index]);
  }

  const versionLabel = (s: Sizes[number]) => {
    const gen = [s.generation, s.years && `(${s.years})`].filter(Boolean).join(" ");
    return [gen, s.version].filter(Boolean).join(" — ") || `${s.w}/${s.p} R${s.r}`;
  };

  function verNeumaticos() {
    if (!selectedVehicle || !selectedSize) return;
    const medida = `${selectedSize.w}-${selectedSize.p}-r${selectedSize.r}`;
    router.push(`/buscar?medida=${medida}&marca=${encodeURIComponent(selectedVehicle.marca)}&modelo=${encodeURIComponent(selectedVehicle.modelo)}${economicos ? "&economicos=1" : ""}`);
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
            <div className="mb-3">
              <VersionSelect
                key={versionKey}
                options={sizes.map(versionLabel)}
                value={versionIndex}
                onChange={changeVersion}
                autoOpen={freshPick && versionIndex === null}
              />
            </div>
          )}
          {selectedSize && (
            <button
              onClick={verNeumaticos}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl text-base transition-colors"
            >
              Ver neumáticos {selectedSize.w}/{selectedSize.p} R{selectedSize.r}
            </button>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm font-semibold text-slate-600 mb-2">
            Todavía no tenemos cargada la medida de este modelo.
          </p>
          <WhatsAppLink
            href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
            className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline"
          >
            Consultanos por WhatsApp
          </WhatsAppLink>
        </div>
      )}
    </div>
  );
}
