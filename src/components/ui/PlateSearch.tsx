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
}: {
  economicos?: boolean;
  onNavigate?: () => void;
  autoFocus?: boolean;
}) {
  const { vehiculos, setSelectedVehicle } = useVehicle();
  const [anio, setAnio] = useState<number | null>(null);
  const [version, setVersion] = useState("");
  const [encontrado, setEncontrado] = useState(false);
  const [sugerida, setSugerida] = useState(false);

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
