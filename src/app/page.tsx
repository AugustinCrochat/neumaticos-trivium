import type { Metadata } from "next";
import { HomeTabTitle } from "@/components/home/HomeTabTitle";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ArrepentimientoBanner } from "@/components/home/ArrepentimientoBanner";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { HomeProductCarousel } from "@/components/home/HomeProductCarousel";
import { PopularSizesSection } from "@/components/home/PopularSizesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LocalSection } from "@/components/home/LocalSection";
import { FaqSection } from "@/components/seo/FaqSection";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { canonical } from "@/lib/seo";

// Antes la home era `force-static` sin ningún fetch, a propósito: pegarle al
// POS acá reactivaba un costo de cold-start en Cloudflare (ver el comentario
// viejo, todavía en PopularSizesSection.tsx). Eso era de antes de sumar el
// caché incremental en R2 (ver open-next.config.ts) — con R2 ya andando,
// esta página se comporta como cualquier otra ruta estática del sitio
// (catálogo, ofertas, marcas): el fetch corre una vez en build time con
// `force-cache` y quedan congelados hasta el redeploy, sin costo en runtime.

export const metadata: Metadata = {
  // Título propio en vez de heredar el default del layout: la home compite por
  // "comprar neumáticos" y "cubiertas precio", no sólo por la marca.
  title: {
    // "Barato" y "económico" son dos variantes reales de búsqueda para el
    // mismo criterio de precio, y sumarlas de a dos en un título no es
    // redundante como sí lo era con "neumáticos y cubiertas" (que son el
    // mismo sustantivo repetido). "Cubiertas" va en la descripción, por
    // separado, para no competir con esta misma frase por el mismo término.
    absolute: "Neumáticos baratos en Córdoba — Cubiertas al mejor precio",
  },
  description:
    "Neumáticos y cubiertas de importación directa al mejor precio, con stock real publicado. Local con gomería propia en Córdoba: alineación, balanceo y colocación sin cargo. Auto, camioneta, A/T y carga.",
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

export default async function HomePage() {
  const productos = await getProductosDesdePOS(await getSelectedBranchSlug());

  return (
    <>
      <HomeTabTitle />
      <HeroSection productos={productos} />
      <TrustStrip />
      <HomeProductCarousel productos={productos} />
      <PopularSizesSection productos={productos} />
      <LocalSection />
      <FeaturedProductsSection productos={productos} />
      <AboutSection />
      <ArrepentimientoBanner />
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <FaqSection faqs={FAQS} />
      </div>
    </>
  );
}
