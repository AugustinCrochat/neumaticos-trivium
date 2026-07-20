"use client";

import { useState } from "react";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { VehicleSizeSearch } from "@/components/ui/VehicleSizeSearch";
import type { VehiculoOption } from "@/lib/pos-api";

export function SizeOrVehicleSearch({ vehiculos }: { vehiculos: VehiculoOption[] }) {
  const [mode, setMode] = useState<"medida" | "vehiculo">("medida");

  return (
    <div>
      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 mb-4">
        <button
          onClick={() => setMode("medida")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "medida" ? "bg-navy-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          Por medida
        </button>
        <button
          onClick={() => setMode("vehiculo")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "vehiculo" ? "bg-navy-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          Por mi auto
        </button>
      </div>

      {mode === "medida" ? <TireSizeSearch /> : <VehicleSizeSearch vehiculos={vehiculos} />}
    </div>
  );
}
