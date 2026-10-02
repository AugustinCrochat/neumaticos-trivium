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
  initialEconomicos = false,
}: {
  compact?: boolean;
  initialMedida?: string;
  forceVoiceButton?: boolean;
  hideLearnLink?: boolean;
  initialEconomicos?: boolean;
}) {
  const { selectedVehicle, loadVehiculos } = useVehicle();
  // null = sin elección manual: sigue el default (pestaña "Por mi auto" si ya
  // tenemos un vehículo recordado de localStorage, "Por medida" si no).
  const [manualMode, setManualMode] = useState<"medida" | "vehiculo" | null>(null);
  // Apagado por defecto: sólo se enciende si el visitante lo pide (o si la
  // búsqueda que está viendo ya venía filtrada, ver ShopPage).
  const [economicos, setEconomicos] = useState(initialEconomicos);
  const mode = manualMode ?? (selectedVehicle ? "vehiculo" : "medida");

  // El listado completo del POS solo hace falta acá. Se pide al entrar a la
  // pestaña, no en cada carga de página del sitio.
  useEffect(() => {
    if (mode === "vehiculo") loadVehiculos();
  }, [mode, loadVehiculos]);

  return (
    <div className={`bg-slate-100 rounded-2xl border border-slate-200 ${compact ? "p-4" : "p-6"} shadow-xl shadow-slate-300/40 w-full`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
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

      <button
        type="button"
        role="switch"
        aria-checked={economicos}
        onClick={() => setEconomicos((v) => !v)}
        className="group inline-flex items-center gap-2.5 text-sm font-bold text-slate-700"
      >
        <span
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${economicos ? "bg-orange-500" : "bg-slate-300"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${economicos ? "translate-x-[22px]" : "translate-x-0.5"}`}
          />
        </span>
        Solo económicos
      </button>
      </div>

      {mode === "medida" ? (
        <TireSizeSearch
          embedded
          compact={compact}
          initialMedida={initialMedida}
          forceVoiceButton={forceVoiceButton}
          hideLearnLink={hideLearnLink}
          economicos={economicos}
        />
      ) : (
        <VehicleSizeSearch initialMedida={initialMedida} economicos={economicos} />
      )}
    </div>
  );
}
