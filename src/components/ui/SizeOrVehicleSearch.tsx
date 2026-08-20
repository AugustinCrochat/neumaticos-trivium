"use client";

import { useEffect, useState } from "react";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { VehicleSizeSearch } from "@/components/ui/VehicleSizeSearch";
import { useVehicle } from "@/contexts/vehicle-context";

export function SizeOrVehicleSearch({
  compact = false,
  initialMedida,
  forceVoiceButton = false,
  hideLearnLink = false,
}: {
  compact?: boolean;
  initialMedida?: string;
  forceVoiceButton?: boolean;
  hideLearnLink?: boolean;
}) {
  const { selectedVehicle, loadVehiculos } = useVehicle();
  // null = sin elección manual: sigue el default (pestaña "Por mi auto" si ya
  // tenemos un vehículo recordado de localStorage, "Por medida" si no).
  const [manualMode, setManualMode] = useState<"medida" | "vehiculo" | null>(null);
  const mode = manualMode ?? (selectedVehicle ? "vehiculo" : "medida");

  // El listado completo del POS solo hace falta acá. Se pide al entrar a la
  // pestaña, no en cada carga de página del sitio.
  useEffect(() => {
    if (mode === "vehiculo") loadVehiculos();
  }, [mode, loadVehiculos]);

  return (
    <div className={`bg-slate-100 rounded-2xl border border-slate-200 ${compact ? "p-4" : "p-6"} shadow-xl shadow-slate-300/40 w-full`}>
      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 mb-4">
        <button
          onClick={() => setManualMode("medida")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "medida" ? "bg-navy-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
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
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "vehiculo" ? "bg-navy-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          Por mi auto
        </button>
      </div>

      {mode === "medida" ? (
        <TireSizeSearch
          embedded
          compact={compact}
          initialMedida={initialMedida}
          forceVoiceButton={forceVoiceButton}
          hideLearnLink={hideLearnLink}
        />
      ) : (
        <VehicleSizeSearch initialMedida={initialMedida} />
      )}
    </div>
  );
}
