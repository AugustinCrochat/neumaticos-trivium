import { ServicesSection } from "@/components/home/ServicesSection";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { SERVICES } from "@/lib/data";
import { breadcrumbJsonLd, canonical, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  // "Gomería" es el término que más volumen de búsqueda tiene para este
  // servicio en Argentina, y no aparecía en ningún lado del título ni la
  // descripción: la página competía por "alineación" y se quedaba afuera de
  // "gomería en Córdoba" / "gomería cerca".
  title: "Gomería en Córdoba: alineación, balanceo y montaje",
  description:
    "Gomería y taller propio en Córdoba (Argüello): alineación computarizada 3D, balanceo dinámico y arme y desarme de neumáticos a precio económico. Colocación sin cargo comprando las cubiertas en el local.",
  alternates: canonical("/servicios"),
};

const FAQS = [
  {
    question: "¿Cuánto sale el service en una gomería?",
    answer:
      "En nuestro taller la colocación, el balanceo y el cambio de válvulas no tienen cargo si comprás las cubiertas en el local. La alineación computarizada 3D se cotiza aparte y el precio se confirma en el momento por WhatsApp o en el mostrador, según el vehículo.",
  },
  {
    question: "¿La gomería tiene stock de todas las medidas?",
    answer:
      "El stock real de cada medida está publicado en el sitio (buscador por medida o por auto), así que no hace falta llamar para confirmar disponibilidad antes de venir.",
  },
  {
    question: "¿Necesito turno para ir a la gomería?",
    answer:
      "No. Atendemos por orden de llegada, sin turnos. Si querés estimar el tiempo de espera antes de salir, podés consultarlo por WhatsApp.",
  },
];

export default function ServiciosPage() {
  return (
    <div className="pt-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
        ])}
      />
      {SERVICES.map((service) => (
        <JsonLd key={service.id} data={serviceJsonLd(service)} />
      ))}
      <ServicesSection />
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <FaqSection faqs={FAQS} />
      </div>
    </div>
  );
}
