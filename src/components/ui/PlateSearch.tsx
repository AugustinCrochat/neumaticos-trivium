"use client";

import { useState } from "react";
import { useVehicle } from "@/contexts/vehicle-context";
import { getSizesForVehicle } from "@/lib/vehicles";
import { medidasParaAnio } from "@/lib/patente";
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
  const [encontrado, setEncontrado] = useState(false);

  if (encontrado) {
    return (
      <VehicleSizeSearch
        anio={anio}
        desdePatente
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
      onFound={(v, a) => {
        const todas = getSizesForVehicle(v.marca, v.modelo);
        const { sizes } = todas ? medidasParaAnio(todas, a) : { sizes: null };
        setSelectedVehicle(v, sizes && sizes.length === 1 ? sizes[0] : undefined);
        setAnio(a);
        setEncontrado(true);
      }}
    />
  );
}
