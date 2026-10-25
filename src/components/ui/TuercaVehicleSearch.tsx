"use client";

import { useEffect } from "react";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import { VehicleCombobox } from "@/components/ui/VehicleCombobox";
import { AccessoryCard } from "@/components/ui/AccessoryCard";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { getCompatibleAccessories } from "@/lib/tuercas-vehiculos";
import type { Accessory } from "@/lib/types";

/**
 * Buscador de tuercas antirrobo por modelo de auto. Comparte el vehículo
 * elegido con el buscador de neumáticos ("Por mi auto"), así que si ya lo
 * eligieron en otro lado acá aparece directamente el resultado.
 */
export function TuercaVehicleSearch({ accesorios }: { accesorios: Accessory[] }) {
  const { selectedBranch } = useBranch();
  const { vehiculos, loadVehiculos, selectedVehicle, setSelectedVehicle, clearSelectedVehicle } = useVehicle();

  // El listado completo del POS se pide al entrar a esta sección.
  useEffect(() => {
    loadVehiculos();
  }, [loadVehiculos]);

  const compatibles = selectedVehicle ? getCompatibleAccessories(selectedVehicle.marca, selectedVehicle.modelo, accesorios) : [];
  const waText = selectedVehicle
    ? encodeURIComponent(`Hola, quiero saber qué tuerca antirrobo lleva mi ${selectedVehicle.marca} ${selectedVehicle.modelo}`)
    : "";

  return (
    <section id="buscar" className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-100 p-4 md:p-6">
      <h2 className="mb-1 text-base font-black text-navy-900">¿Qué tuerca lleva tu auto?</h2>
      <p className="mb-3 text-sm text-slate-500">Buscá tu modelo y te mostramos las tuercas antirrobo compatibles.</p>

      {!selectedVehicle ? (
        <VehicleCombobox vehiculos={vehiculos} onSelect={(v) => setSelectedVehicle(v)} placeholder="Ej: Gol, Corolla, Amarok, 208..." />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border-2 border-orange-500 bg-orange-50 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Tu vehículo</p>
              <p className="truncate text-base font-bold text-navy-900">
                {selectedVehicle.marca} {selectedVehicle.modelo}
              </p>
            </div>
            <button onClick={clearSelectedVehicle} className="shrink-0 text-xs font-bold text-slate-500 transition-colors hover:text-slate-700">
              Cambiar
            </button>
          </div>

          {compatibles.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {compatibles.map((a) => (
                <AccessoryCard key={a.id} accessory={a} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="mb-2 text-sm font-semibold text-slate-600">
                Todavía no tenemos cargada la tuerca de este modelo.
              </p>
              <WhatsAppLink
                href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline"
              >
                Consultanos por WhatsApp
              </WhatsAppLink>
            </div>
          )}
        </>
      )}
    </section>
  );
}
