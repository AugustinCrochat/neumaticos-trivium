import { ServicesSection } from "@/components/home/ServicesSection";
import { HorarioBloque } from "@/components/tools/HorarioBloque";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { SERVICES } from "@/lib/data";
import Link from "@/components/ui/Link";
import { EXTRA_SERVICES, SERVICIOS_SEO } from "@/lib/servicios-seo";
import { breadcrumbJsonLd, canonical, serviceJsonLd, resumen } from "@/lib/seo";

export const metadata: Metadata = {
  // "Gomería" es el término que más volumen de búsqueda tiene para este
  // servicio en Argentina, y no aparecía en ningún lado del título ni la
  // descripción: la página competía por "alineación" y se quedaba afuera de
  // "gomería en Córdoba" / "gomería cerca".
  // En Córdoba se busca "alineado y balanceado" (en Buenos Aires,
  // "alineación y balanceo"): el título usa la forma local.
  title: "Gomería: alineado, balanceado y colocación sin turno",
  description:
    resumen("Gomería y taller propio: alineado computarizado 3D, balanceado dinámico y arme y desarme de neumáticos con precios publicados. Colocación sin cargo comprando las cubiertas en el local. Sin turno."),
  alternates: canonical("/servicios"),
};

const FAQS = [
  {
    question: "¿Cuánto sale el service en una gomería?",
    answer:
      "En nuestro taller la colocación y el cambio de válvulas no tienen cargo si comprás las cubiertas en el local. El alineado computarizado 3D y el balanceado se cobran aparte, con el precio publicado en la ficha de cada servicio según sea auto o camioneta.",
  },
  {
    question: "¿La gomería tiene stock de todas las medidas?",
    answer:
      "El stock real de cada medida está publicado en el sitio (buscador por medida o por auto), así que no hace falta llamar para confirmar disponibilidad antes de venir.",
  },
  {
    question: "¿Colocan neumáticos comprados en Mercado Libre?",
    answer:
      "Sí. En el local de Argüello colocamos los neumáticos comprados en Mercado Libre cuando elegís Trivium como punto de envío y colocación. Si en cambio comprás las cubiertas con nosotros, se colocan el mismo día y la colocación y el cambio de válvulas no se cobran. En Mercado Libre la instalación siempre tiene un costo y el envío llega unos días después.",
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
      <ServicesSection comoPagina />
      <section className="mx-auto max-w-4xl px-4 pb-4">
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
              Gomería en San Justo y La Matanza (abre en enero)
            </Link>
          </li>
        </ul>
      </section>
      <div className="mx-auto max-w-4xl px-4 pb-10">
        <HorarioBloque className="mt-6" />

        <FaqSection faqs={FAQS} />
      </div>
    </div>
  );
}
