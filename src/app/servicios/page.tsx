import { ServicesSection } from "@/components/home/ServicesSection";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { SERVICES } from "@/lib/data";
import Link from "@/components/ui/Link";
import { EXTRA_SERVICES, SERVICIOS_SEO } from "@/lib/servicios-seo";
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
      "En nuestro taller la colocación y el cambio de válvulas no tienen cargo si comprás las cubiertas en el local. El balanceo y la alineación computarizada 3D se cotizan aparte, y el precio se confirma en el momento por WhatsApp o en el mostrador, según el vehículo.",
  },
  {
    question: "¿La gomería tiene stock de todas las medidas?",
    answer:
      "El stock real de cada medida está publicado en el sitio (buscador por medida o por auto), así que no hace falta llamar para confirmar disponibilidad antes de venir.",
  },
  {
    question: "¿Necesito turno para ir a la gomería?",
    answer:
      "No. Atendemos por orden de llegada, sin turnos. Si querés estimar el tiempo de espera antes de salir, podés consultarlo por WhatsApp o mirar a qué hora suele estar más tranquilo el taller en la herramienta «¿A qué hora conviene ir a la gomería?» (/herramientas/mejor-horario-gomeria).",
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
      <section className="mx-auto max-w-4xl px-4 pb-10">
        <h2 className="mb-3 text-xl font-black text-tire-950">Más servicios de gomería</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {EXTRA_SERVICES.map((s) => (
            <li key={s.id}>
              <Link href={`/servicios/${s.id}`} className="font-bold text-orange-700 underline underline-offset-4">
                {SERVICIOS_SEO[s.id]?.h1 ?? s.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/blog/maquinas-hofmann-y-elevadores-rotary-lift-gomeria" className="font-bold text-orange-700 underline underline-offset-4">
              Las máquinas de nuestra gomería: Hofmann y Rotary Lift
            </Link>
          </li>
          <li>
            <Link href="/blog/gomeria-en-san-justo-buenos-aires" className="font-bold text-orange-700 underline underline-offset-4">
              Gomería en San Justo y La Matanza (abre en diciembre)
            </Link>
          </li>
        </ul>
      </section>
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <FaqSection faqs={FAQS} />
      </div>
    </div>
  );
}
