import type { Metadata } from "next";
import { CatalogSection } from "@/components/home/CatalogSection";

export const metadata: Metadata = {
  title: "Catálogo de Neumáticos — Trivium",
  description: "Explorá todo el catálogo de neumáticos importados a precios outlet. Filtrá por marca, medida, tipo de vehículo y precio.",
};

export default function CatalogoPage() {
  return <CatalogSection />;
}
