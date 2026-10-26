"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from "react";
import type { VehiculoOption } from "@/lib/pos-api";
import type { VehicleDBEntry } from "@/lib/vehicles";

export type VehicleSize = VehicleDBEntry["sizes"][number];
export type SelectedVehicle = VehiculoOption & { size?: VehicleSize };

type VehicleContextType = {
  vehiculos: VehiculoOption[];
  /** Trae el listado completo del POS. Llamalo al mostrar UI de búsqueda por auto. */
  loadVehiculos: () => void;
  selectedVehicle: SelectedVehicle | null;
  setSelectedVehicle: (vehicle: VehiculoOption, size?: VehicleSize) => void;
  clearSelectedVehicle: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const VehicleContext = createContext<VehicleContextType | null>(null);

const STORAGE_KEY = "trivium-vehicle";

// En el cliente corre antes del primer paint (evita el flash "Por medida" ->
// "Por mi auto"); en SSR cae a useEffect porque useLayoutEffect no existe ahí.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function VehicleProvider({
  vehiculos: initialVehiculos,
  children,
}: {
  vehiculos: VehiculoOption[];
  children: ReactNode;
}) {
  const [vehiculos, setVehiculos] = useState(initialVehiculos);
  const [selectedVehicle, setSelectedVehicleState] = useState<SelectedVehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // El layout raíz pasa la lista estática (sin red); el listado completo del
  // POS se pide bajo demanda.
  //
  // Antes este fetch corría en un useEffect sin condición, o sea en cada carga
  // de cualquier página del sitio: una request extra al Worker por pageview
  // para una lista que solo usa el buscador "Por mi auto". Ahora lo dispara
  // quien abre ese buscador (ver SizeOrVehicleSearch y VehicleModal); el ref
  // garantiza un solo fetch por sesión aunque lo llamen varios componentes.
  const loadRequestedRef = useRef(false);

  const loadVehiculos = useCallback(() => {
    if (loadRequestedRef.current) return;
    loadRequestedRef.current = true;
    fetch("/api/vehiculos")
      .then((res) => res.json())
      .then((data: { vehiculos: VehiculoOption[] }) => {
        if (data.vehiculos?.length) setVehiculos(data.vehiculos);
      })
      .catch(() => {
        // Que un fallo se pueda reintentar al reabrir el buscador: sin esto
        // quedaría para siempre con la lista estática parcial.
        loadRequestedRef.current = false;
      });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const { marca, modelo, size } = JSON.parse(stored);
      // El fallback importa: si el auto guardado solo existe en el listado del
      // POS (no en la lista estática del layout), sin esto no se restauraba
      // nunca, porque acá todavía no pedimos /api/vehiculos.
      const vehicle = vehiculos.find((v) => v.marca === marca && v.modelo === modelo)
        ?? { marca, modelo, label: `${marca} ${modelo}` };
      setSelectedVehicleState(size ? { ...vehicle, size } : vehicle);
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
        loadVehiculos,
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
