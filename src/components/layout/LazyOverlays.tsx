"use client";

import dynamic from "next/dynamic";
import { useBranch } from "@/contexts/branch-context";
import { useCart } from "@/contexts/cart-context";
import { useVehicle } from "@/contexts/vehicle-context";

// Los tres paneles estaban montados en TODAS las páginas aunque casi nunca se
// abran: su JS viajaba siempre y, en el caso del carrito, sus hooks pedían
// /api/servicios-upsell y /api/accesorios al Worker en cada carga de página.
// Ahora se descargan y montan recién al abrirse. Cada uno ya hacía
// `if (!abierto) return null`, así que el comportamiento es el mismo.
const BranchModal = dynamic(() => import("@/components/ui/BranchModal").then((m) => m.BranchModal), { ssr: false });
const VehicleModal = dynamic(() => import("@/components/ui/VehicleModal").then((m) => m.VehicleModal), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/ui/CartDrawer").then((m) => m.CartDrawer), { ssr: false });

export function LazyOverlays() {
  const { isModalOpen: sucursalAbierta } = useBranch();
  const { isModalOpen: autoAbierto } = useVehicle();
  const { isOpen: carritoAbierto } = useCart();
  return (
    <>
      {sucursalAbierta && <BranchModal />}
      {autoAbierto && <VehicleModal />}
      {carritoAbierto && <CartDrawer />}
    </>
  );
}
