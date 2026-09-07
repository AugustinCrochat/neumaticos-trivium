import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ValueSection } from "@/components/home/ValueSection";
import { ArrepentimientoBanner } from "@/components/home/ArrepentimientoBanner";
import { PopularSizesSection } from "@/components/home/PopularSizesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LocalSection } from "@/components/home/LocalSection";
import { FaqSection } from "@/components/seo/FaqSection";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/config";
import { canonical } from "@/lib/seo";

// La home no consulta el POS ni ninguna otra fuente de datos: es estática de
// punta a punta y se sirve desde el asset, sin render. Es deliberado — ver el
// comentario de PopularSizesSection.
export const dynamic = "force-static";

export const metadata: Metadata = {
  // Título propio en vez de heredar el default del layout: la home compite por
  // "comprar neumáticos" y "cubiertas precio", no sólo por la marca.
  title: {
    // "Barato" y "económico" son dos variantes reales de búsqueda para el
    // mismo criterio de precio, y sumarlas de a dos en un título no es
    // redundante como sí lo era con "neumáticos y cubiertas" (que son el
    // mismo sustantivo repetido). "Cubiertas" va en la descripción, por
    // separado, para no competir con esta misma frase por el mismo término.
    absolute: "Neumáticos baratos y económicos — Neumáticos Trivium",
  },
  description:
    "Comprá neumáticos de importación directa a precio de outlet. Stock real publicado, envío a todo el país y local con taller propio en Córdoba. Cubiertas para auto, camioneta y carga.",
  alternates: canonical("/"),
};

const FAQS = [
  {
    question: "¿Por qué los neumáticos de Trivium son más baratos?",
    answer:
      "Porque importamos directo de fábrica y vendemos al público desde nuestro propio local. El precio habitual de una cubierta pasa por importador, distribuidor mayorista, distribuidor regional y gomería, y cada eslabón suma margen. Al sacar los intermedios, la diferencia llega al mostrador en vez de quedarse en la cadena.",
  },
  {
    question: "¿Cómo sé qué medida de neumático necesito?",
    answer:
      "Está escrita en el flanco del neumático que tenés puesto, con el formato 205/55 R16: el primer número es el ancho en milímetros, el segundo el perfil en porcentaje y el número después de la R es el rodado en pulgadas. También figura en la calcomanía del parante de la puerta del conductor. Si preferís, buscá por marca y modelo de tu auto y te decimos qué medida lleva de fábrica.",
  },
  {
    question: "¿Los neumáticos tienen garantía?",
    answer:
      "Sí, un año por defecto de fabricación en todas las marcas que vendemos, gestionada directamente con nosotros en el local. Cubre fallas de fábrica como deformaciones, separación de capas o pérdida de aire por vicio del material. No cubre pinchaduras, golpes contra baches o cordones, ni desgaste irregular por falta de alineación.",
  },
  {
    question: "¿Hacen envíos a todo el país?",
    answer:
      `Sí, a cualquier punto de Argentina. Es gratis en compras desde $${FREE_SHIPPING_THRESHOLD.toLocaleString("es-AR")}; por debajo de eso, $${SHIPPING_FLAT_RATE.toLocaleString("es-AR")} fijos, sin importar la provincia de destino. La alternativa es retirar sin cargo en el local de Córdoba, donde además la colocación va incluida.`,
  },
  {
    question: "¿Puedo pagar online?",
    answer:
      "Sí, con Mercado Pago desde la web, con tarjeta de débito, crédito o dinero en cuenta. También podés pagar en el local en efectivo, con débito, crédito o transferencia. Si comprás online y retirás, te avisamos por WhatsApp cuando el pedido está listo.",
  },
  {
    question: "¿Cada cuánto hay que cambiar los neumáticos?",
    answer:
      "La referencia legal es la profundidad de dibujo: por debajo de 1,6 mm el neumático no es apto para circular, y los testigos moldeados en la banda te lo indican. En la práctica, el rendimiento en mojado cae bastante antes de ese límite. Además del desgaste cuenta la antigüedad: pasados los cinco o seis años el compuesto se endurece aunque le sobre dibujo. Lo verificamos sin cargo en el local.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ArrepentimientoBanner />
      <PopularSizesSection />
      <ValueSection />
      <AboutSection />
      <LocalSection />
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <FaqSection faqs={FAQS} />
      </div>
    </>
  );
}
