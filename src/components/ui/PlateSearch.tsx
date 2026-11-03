"use client";

import { useState } from "react";
import { useVehicle } from "@/contexts/vehicle-context";
import { getSizesForVehicle } from "@/lib/vehicles";
import { medidaPorVersion, medidasParaAnio } from "@/lib/patente";
import { PlateLookup } from "@/components/ui/PlateLookup";
import { VehicleSizeSearch } from "@/components/ui/VehicleSizeSearch";

/**
 * Pestaña "Por patente": patente -> marca/modelo/año -> medida de esa
 * generación -> neumáticos. Reutiliza el selector de versión de "Por mi auto".
 */
export function PlateSearch({
  economicos,
  onNavigate,
  autoFocus,
  pequena,
}: {
  economicos?: boolean;
  onNavigate?: () => void;
  autoFocus?: boolean;
  pequena?: boolean;
}) {
  const { vehiculos, setSelectedVehicle, clearSelectedVehicle, loadVehiculos } = useVehicle();
  const [anio, setAnio] = useState<number | null>(null);
  const [version, setVersion] = useState("");
  const [encontrado, setEncontrado] = useState(false);
  const [sugerida, setSugerida] = useState(false);
  // Patente no encontrada: la misma búsqueda pasa a elegir marca, modelo y año.
  const [aviso, setAviso] = useState<string | null>(null);

  if (aviso && !encontrado) {
    return (
      <div className="w-full">
        <p className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm text-slate-600">{aviso}</p>
        <VehicleSizeSearch
          economicos={economicos}
          onNavigate={onNavigate}
          onClear={() => {}}
        />
        <button
          type="button"
          onClick={() => {
            clearSelectedVehicle();
            setAviso(null);
          }}
          className="mt-3 w-full text-center text-xs font-bold text-slate-500 transition-colors hover:text-slate-800"
        >
          Probar con otra patente
        </button>
      </div>
    );
  }

  if (encontrado) {
    return (
      <VehicleSizeSearch
        anio={anio}
        desdePatente
        versionPatente={version}
        versionSugerida={sugerida}
        economicos={economicos}
        onNavigate={onNavigate}
        onClear={() => setEncontrado(false)}
      />
    );
  }

  return (
    <PlateLookup
      vehiculos={vehiculos}
      autoFocus={autoFocus}
      pequena={pequena}
      onNoEncontrada={(m) => {
        loadVehiculos();
        clearSelectedVehicle();
        setAviso(m);
      }}
      onFound={(v, a, ver) => {
        const todas = getSizesForVehicle(v.marca, v.modelo);
        const { sizes } = todas ? medidasParaAnio(todas, a) : { sizes: null };
        // Una sola medida del año, o la que coincide con la versión del registro.
        // Si no coincide ninguna se propone la primera (la versión base) y se avisa.
        const exacta = sizes ? (sizes.length === 1 ? sizes[0] : medidaPorVersion(sizes, ver)) : null;
        const elegida = exacta ?? (sizes && sizes.length > 1 ? sizes[0] : null);
        setSugerida(!exacta && Boolean(elegida));
        setSelectedVehicle(v, elegida ?? undefined);
        setAnio(a);
        setVersion(ver);
        setEncontrado(true);
      }}
    />
  );
}
