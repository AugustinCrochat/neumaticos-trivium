"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import { getSizesForVehicle, type VehicleDBEntry } from "@/lib/vehicles";
import { medidasParaAnio } from "@/lib/patente";
import { VehicleCombobox } from "@/components/ui/VehicleCombobox";
import { VersionSelect } from "@/components/ui/VersionSelect";
import type { VehiculoOption } from "@/lib/pos-api";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { irA } from "@/lib/navigate";

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

export function VehicleSizeSearch({ initialMedida, economicos = false, anio, desdePatente = false, versionPatente, versionSugerida = false, onClear, onNavigate }: { initialMedida?: string; economicos?: boolean; /** Año del auto (viene de la patente): deja sólo las medidas de esa generación. */ anio?: number | null; /** El auto vino de una patente: se muestra la tarjeta "Vehículo encontrado". */ desdePatente?: boolean; /** Versión que escribe el registro ("PRIVILEGE NAV"); se muestra en la tarjeta. */ versionPatente?: string; /** La medida marcada es una propuesta (la versión base), no una coincidencia exacta. */ versionSugerida?: boolean; onClear?: () => void; onNavigate?: () => void }) {
  const { selectedBranch } = useBranch();
  const { vehiculos, selectedVehicle, setSelectedVehicle, clearSelectedVehicle } = useVehicle();

  const todasLasMedidas = selectedVehicle ? getSizesForVehicle(selectedVehicle.marca, selectedVehicle.modelo) : null;
  const { sizes, filtrado } = todasLasMedidas ? medidasParaAnio(todasLasMedidas, anio) : { sizes: null, filtrado: false };

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
  const [eligioVersion, setEligioVersion] = useState(false);
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
    setEligioVersion(true);
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
    onNavigate?.();
    irA(`/buscar?medida=${medida}&marca=${encodeURIComponent(selectedVehicle.marca)}&modelo=${encodeURIComponent(selectedVehicle.modelo)}${economicos ? "&economicos=1" : ""}`);
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
      {desdePatente ? (
        <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-white px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-emerald-700">
              <Check className="h-3 w-3" aria-hidden="true" /> Vehículo encontrado
            </span>
            <button
              type="button"
              onClick={() => {
                onClear?.();
                clearSelectedVehicle();
              }}
              aria-label="Volver a ingresar la patente"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-black text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Otra patente
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Marca</p>
              <p className="text-sm font-black leading-tight text-navy-900">{selectedVehicle.marca}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Año</p>
              <p className="text-sm font-black leading-tight text-navy-900">{anio ?? "—"}</p>
            </div>
            <div className="col-span-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modelo</p>
              <p className="break-words text-sm font-black leading-tight text-navy-900">{selectedVehicle.modelo}</p>
            </div>
            {versionPatente && (
              <div className="col-span-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Versión</p>
                <p className="break-words text-sm font-black leading-tight text-navy-900">{versionPatente}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 mb-3 rounded-xl border-2 border-orange-500 bg-orange-50 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Tu vehículo</p>
            <p className="text-base font-bold text-navy-900 truncate">{selectedVehicle.marca} {selectedVehicle.modelo}{anio ? ` · ${anio}` : ""}</p>
          </div>
          <button
            onClick={() => {
              onClear?.();
              clearSelectedVehicle();
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors shrink-0"
          >
            Cambiar
          </button>
        </div>
      )}

      {sizes && sizes.length > 0 ? (
        <>
          {filtrado && (
            <p className="mb-2 text-xs font-semibold text-slate-500">Mostramos las medidas de tu año ({anio}).</p>
          )}
          {sizes.length > 1 && (
            <div className="mb-3">
              <VersionSelect
                key={versionKey}
                options={sizes.map(versionLabel)}
                value={versionIndex}
                onChange={changeVersion}
                autoOpen={freshPick && versionIndex === null}
              />
              {versionSugerida && !eligioVersion && versionIndex !== null && (
                <p className="mt-1.5 text-xs font-semibold text-slate-500">
                  No pudimos identificar tu versión: te proponemos la base. Si es otra, elegila en la lista.
                </p>
              )}
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
