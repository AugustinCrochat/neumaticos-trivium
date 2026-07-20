"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { VehiculoOption } from "@/lib/pos-api";

type VehicleContextType = {
  vehiculos: VehiculoOption[];
  selectedVehicle: VehiculoOption | null;
  setSelectedVehicle: (vehicle: VehiculoOption) => void;
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
  const [selectedVehicle, setSelectedVehicleState] = useState<VehiculoOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const { marca, modelo } = JSON.parse(stored);
      const vehicle = vehiculos.find((v) => v.marca === marca && v.modelo === modelo);
      if (vehicle) setSelectedVehicleState(vehicle);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedVehicle = (vehicle: VehiculoOption) => {
    setSelectedVehicleState(vehicle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ marca: vehicle.marca, modelo: vehicle.modelo }));
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
