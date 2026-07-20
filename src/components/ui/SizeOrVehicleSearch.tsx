"use client";

import { useState } from "react";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { VehicleSizeSearch } from "@/components/ui/VehicleSizeSearch";
import { useVehicle } from "@/contexts/vehicle-context";

export function SizeOrVehicleSearch({
  compact = false,
  initialMedida,
  forceVoiceButton = false,
  hideLearnLink = false,
  showTabs = true,
}: {
  compact?: boolean;
  initialMedida?: string;
  forceVoiceButton?: boolean;
  hideLearnLink?: boolean;
  /** false = solo búsqueda por vehículo, sin la pestaña "Por medida" (home). */
  showTabs?: boolean;
}) {
  const { selectedVehicle } = useVehicle();
  // null = sin elección manual: sigue el default (pestaña "Por mi auto" si ya
  // tenemos un vehículo recordado de localStorage, "Por medida" si no).
  const [manualMode, setManualMode] = useState<"medida" | "vehiculo" | null>(null);
  const mode = showTabs ? manualMode ?? (selectedVehicle ? "vehiculo" : "medida") : "vehiculo";

  return (
    <div className={`bg-slate-100 rounded-2xl border border-slate-200 ${compact ? "p-4" : "p-6"} shadow-xl shadow-slate-300/40 w-full`}>
      {showTabs && (
        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 mb-4">
          <button
            onClick={() => setManualMode("medida")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "medida" ? "bg-navy-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            Por medida
          </button>
          <button
            onClick={() => setManualMode("vehiculo")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "vehiculo" ? "bg-navy-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            Por mi auto
          </button>
        </div>
      )}

      {mode === "medida" ? (
        <TireSizeSearch
          embedded
          compact={compact}
          initialMedida={initialMedida}
          forceVoiceButton={forceVoiceButton}
          hideLearnLink={hideLearnLink}
        />
      ) : (
        <VehicleSizeSearch />
      )}
    </div>
  );
}
