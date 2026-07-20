"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { VehiculoOption } from "@/lib/pos-api";
import type { VehicleDBEntry } from "@/lib/vehicles";

export type VehicleSize = VehicleDBEntry["sizes"][number];
export type SelectedVehicle = VehiculoOption & { size?: VehicleSize };

type VehicleContextType = {
  vehiculos: VehiculoOption[];
  selectedVehicle: SelectedVehicle | null;
  setSelectedVehicle: (vehicle: VehiculoOption, size?: VehicleSize) => void;
  clearSelectedVehicle: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const VehicleContext = createContext<VehicleContextType | null>(null);

const STORAGE_KEY = "trivium-vehicle";

export function VehicleProvider({
  vehiculos,
  children,
}: {
  vehiculos: VehiculoOption[];
  children: ReactNode;
}) {
  const [selectedVehicle, setSelectedVehicleState] = useState<SelectedVehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const { marca, modelo, size } = JSON.parse(stored);
      const vehicle = vehiculos.find((v) => v.marca === marca && v.modelo === modelo);
      if (vehicle) setSelectedVehicleState(size ? { ...vehicle, size } : vehicle);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedVehicle = (vehicle: VehiculoOption, size?: VehicleSize) => {
    const next: SelectedVehicle = size ? { ...vehicle, size } : { marca: vehicle.marca, modelo: vehicle.modelo, label: vehicle.label };
    setSelectedVehicleState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ marca: vehicle.marca, modelo: vehicle.modelo, size }));
    setIsModalOpen(false);
  };

  const clearSelectedVehicle = () => {
    setSelectedVehicleState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <VehicleContext.Provider
      value={{
        vehiculos,
        selectedVehicle,
        setSelectedVehicle,
        clearSelectedVehicle,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicle must be used inside VehicleProvider");
  return ctx;
}
