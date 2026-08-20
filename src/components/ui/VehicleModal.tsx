"use client";

import { useEffect } from "react";
import { useVehicle } from "@/contexts/vehicle-context";
import { VehicleCombobox } from "@/components/ui/VehicleCombobox";

export function VehicleModal() {
  const { vehiculos, loadVehiculos, selectedVehicle, setSelectedVehicle, clearSelectedVehicle, isModalOpen, closeModal } = useVehicle();

  // El listado completo del POS se pide recién al abrir el modal (ver
  // vehicle-context): antes salía en cada carga de página del sitio.
  useEffect(() => {
    if (isModalOpen) loadVehiculos();
  }, [isModalOpen, loadVehiculos]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar vehículo"
    >
      <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={closeModal} />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="bg-navy-800 rounded-t-2xl px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-white text-xl font-bold">Elegí tu vehículo</h2>
            <p className="text-navy-200 text-sm mt-1 leading-snug max-w-xs">
              Lo vamos a recordar para sugerirte la medida y los accesorios
              compatibles con tu auto.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="text-navy-300 hover:text-white transition-colors p-1 mt-0.5 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {selectedVehicle && (
            <div className="flex items-center justify-between gap-3 mb-4 rounded-xl border-2 border-orange-500 bg-orange-50 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Tu vehículo</p>
                <p className="text-base font-bold text-navy-900 truncate">{selectedVehicle.marca} {selectedVehicle.modelo}</p>
              </div>
              <button
                onClick={clearSelectedVehicle}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors shrink-0"
              >
                Quitar
              </button>
            </div>
          )}

          <VehicleCombobox vehiculos={vehiculos} onSelect={setSelectedVehicle} autoFocus />
        </div>
      </div>
    </div>
  );
}
