import type { Metadata } from "next";
import { CarritoPageClient } from "./CarritoPageClient";

export const metadata: Metadata = {
  title: "Tu carrito — Neumáticos Trivium",
  description: "Revisá tu carrito de compra y pagá online con Mercado Pago para retirar en sucursal.",
  robots: { index: false, follow: true },
};

export default function CarritoPage() {
  return <CarritoPageClient />;
}
