"use client";

import { useVehicle } from "@/contexts/vehicle-context";
import { useAccesorios } from "@/hooks/use-accesorios";
import { getCompatibleAccessory } from "@/lib/tuercas-vehiculos";
import { AccessoryCard } from "@/components/ui/AccessoryCard";

/** Sólo se muestra si ya hay un vehículo elegido (no invita a elegir uno
    acá) y ese vehículo tiene una tuerca antirrobo compatible cargada. */
export function CompatibleAccessorySection() {
  const { selectedVehicle } = useVehicle();
  const accesorios = useAccesorios();

  if (!selectedVehicle) return null;
  const accessory = getCompatibleAccessory(selectedVehicle.marca, selectedVehicle.modelo, accesorios);
  if (!accessory) return null;

  return (
    <div className="mt-14 pt-10 border-t border-slate-100">
      <h2 className="text-lg font-black text-navy-900 uppercase tracking-wide flex items-center gap-2 mb-1">
        <svg className="w-5 h-5 text-navy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Tuerca antirrobo para tu {selectedVehicle.marca} {selectedVehicle.modelo}
      </h2>
      <p className="text-sm text-slate-600 mb-6">
        Compatible con el vehículo que tenés elegido en el sitio.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl">
        <AccessoryCard accessory={accessory} />
      </div>
    </div>
  );
}
