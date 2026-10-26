"use client";

import { useEffect, useState } from "react";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { VehicleSizeSearch } from "@/components/ui/VehicleSizeSearch";
import { EconomicChip } from "@/components/ui/EconomicChip";
import { useVehicle } from "@/contexts/vehicle-context";

export function SizeOrVehicleSearch({
  compact = false,
  initialMedida,
  forceVoiceButton = false,
  hideLearnLink = false,
  initialEconomicos = false,
  onLiveChange,
}: {
  compact?: boolean;
  initialMedida?: string;
  forceVoiceButton?: boolean;
  hideLearnLink?: boolean;
  initialEconomicos?: boolean;
  onLiveChange?: (v: { w: string; p: string; r: string }) => void;
}) {
  const { selectedVehicle, restaurado, loadVehiculos } = useVehicle();
  // null = sin elección manual: sigue el default (pestaña "Por mi auto" si ya
  // tenemos un vehículo recordado de localStorage, "Por medida" si no).
  const [manualMode, setManualMode] = useState<"medida" | "vehiculo" | null>(null);
  // Apagado por defecto: sólo se enciende si el visitante lo pide (o si la
  // búsqueda que está viendo ya venía filtrada, ver ShopPage).
  const [economicos, setEconomicos] = useState(initialEconomicos);
  // El default se fija una sola vez, al leer el auto recordado. Si después se
  // elige un auto desde otro lado (menú, modal) la pestaña no cambia sola: eso
  // desmontaba el buscador de medida en pleno uso y parecía una recarga.
  const [pestañaInicial, setPestañaInicial] = useState<"medida" | "vehiculo" | null>(null);
  if (restaurado && pestañaInicial === null) setPestañaInicial(selectedVehicle ? "vehiculo" : "medida");
  const mode = manualMode ?? pestañaInicial ?? "medida";

  // El listado completo del POS solo hace falta acá. Se pide al entrar a la
  // pestaña, no en cada carga de página del sitio.
  useEffect(() => {
    if (mode === "vehiculo") loadVehiculos();
  }, [mode, loadVehiculos]);

  return (
    <div className={`bg-slate-100 rounded-2xl border border-slate-200 ${compact ? "p-4" : "p-6"} w-full`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
        <button
          onClick={() => setManualMode("medida")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "medida" ? "bg-black text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          Por medida
        </button>
        <button
          onClick={() => setManualMode("vehiculo")}
          // Adelantar el fetch al primer indicio de intención, así la lista ya
          // está cuando el usuario efectivamente cambia de pestaña.
          onMouseEnter={loadVehiculos}
          onFocus={loadVehiculos}
          onTouchStart={loadVehiculos}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "vehiculo" ? "bg-black text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          Por mi auto
        </button>
      </div>

      {/* En el catálogo (compact) el filtro ya está en los filtros del escritorio. */}
      <div className={compact ? "lg:hidden" : undefined}>
        <EconomicChip checked={economicos} onChange={setEconomicos} />
      </div>
      </div>

      {mode === "medida" ? (
        <TireSizeSearch
          embedded
          compact={compact}
          initialMedida={initialMedida}
          forceVoiceButton={forceVoiceButton}
          hideLearnLink={hideLearnLink}
          economicos={economicos}
          onLiveChange={onLiveChange}
        />
      ) : (
        // Al quitar el auto se queda en esta pestaña (sin esto el modo por defecto
        // vuelve a "Por medida" porque ya no hay vehículo).
        <VehicleSizeSearch initialMedida={initialMedida} economicos={economicos} onClear={() => setManualMode("vehiculo")} />
      )}
    </div>
  );
}
