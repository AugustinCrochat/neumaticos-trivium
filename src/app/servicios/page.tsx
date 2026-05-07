import { ServicesSection } from "@/components/home/ServicesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios — Neumáticos Trivium",
  description: "Conocé todos los servicios que ofrecemos en nuestro taller: alineación, balanceo, tren delantero y más.",
};

export default function ServiciosPage() {
  return (
    <div className="pt-8">
      <ServicesSection />
    </div>
  );
}
