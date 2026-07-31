import { ServicesSection } from "@/components/home/ServicesSection";
import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Alineación, balanceo y montaje de neumáticos",
  description:
    "Taller propio en Córdoba: alineación computarizada 3D, balanceo dinámico y arme y desarme de neumáticos. Colocación sin cargo comprando las cubiertas en el local.",
  alternates: canonical("/servicios"),
};

export default function ServiciosPage() {
  return (
    <div className="pt-8">
      <ServicesSection />
    </div>
  );
}
