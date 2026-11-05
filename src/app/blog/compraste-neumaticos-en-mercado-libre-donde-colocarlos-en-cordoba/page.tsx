import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "compraste-neumaticos-en-mercado-libre-donde-colocarlos-en-cordoba";
const TITLE = "Compraste neumáticos en Mercado Libre: dónde colocarlos en Córdoba y cuánto cambia comprarlos directo";
const SUBTITLE = "Mercado Libre ofrece instalación con talleres asociados. En Argüello hacemos esa colocación, y si comprás las cubiertas con nosotros no pagás colocación ni válvulas, y se colocan el mismo día.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description: resumen("Cómo funciona la instalación de neumáticos de Mercado Libre (alineación, colocación, balanceo y válvulas por 1, 2 o 4 cubiertas), dónde hacerla en Córdoba y qué cambia si comprás directo."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Puedo comprar neumáticos en Mercado Libre y colocarlos en Neumáticos Trivium?",
    answer: "Sí. En el local de Argüello colocamos neumáticos comprados en Mercado Libre cuando elegís a Trivium como punto de envío y colocación. Coordinás el turno desde la compra.",
  },
  {
    question: "¿Qué incluye la instalación de Mercado Libre?",
    answer: "Según el servicio, se contrata por cantidad (1, 2 o 4 neumáticos) e incluye alineación, colocación, balanceo y cambio de válvula. Siempre tiene un costo, y el valor depende del instalador que elijas.",
  },
  {
    question: "¿Qué pasa si compro los neumáticos directo en Trivium?",
    answer: "La colocación y el cambio de válvulas no se cobran, y los neumáticos se colocan el mismo día de la compra. En Mercado Libre la instalación tiene un costo aparte y el envío llega al taller algunos días después.",
  },
  {
    question: "¿Cuál conviene?",
    answer: "Depende de la medida, la marca, el precio final y la urgencia. Lo útil es sumar neumáticos más instalación en las dos compras y comparar el total y los días de espera.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-11-26" readingMinutes={4} faqs={FAQS}>
      <p>
        Mercado Libre vende neumáticos con una opción de instalación: el pedido se envía a un taller asociado y ahí se hace el trabajo. Si ya
        compraste, o estás pensando en hacerlo, esta guía explica cómo funciona y dónde hacerlo en Córdoba.
      </p>

      <Callout title="Respuesta rápida" tone="info">
        <p>
          En <strong>Neumáticos Trivium (Argüello)</strong> colocamos los neumáticos que compraste en Mercado Libre, si elegís nuestro local como punto.
          Y si comprás las cubiertas <strong>directo con nosotros</strong>, la <strong>colocación y el cambio de válvulas no se cobran</strong>.
        </p>
      </Callout>

      <h2>Cómo funciona la instalación de Mercado Libre</h2>
      <p>
        Al comprar neumáticos, la plataforma ofrece sumar la instalación según la cantidad: <strong>1, 2 o 4 neumáticos</strong>. El servicio
        incluye <strong>alineación, colocación, balanceo y cambio de válvula</strong>. El envío va directo al taller elegido y el turno se
        coordina desde la compra. Ese servicio <strong>siempre tiene un costo</strong>, que <strong>depende del instalador</strong>, y el envío
        llega al taller <strong>algunos días después</strong> de la compra.
      </p>

      <h2>Dónde hacerlo en Córdoba</h2>
      <p>
        Nuestro local de <Link href="/sucursales">Argüello</Link> es uno de los puntos de envío y colocación. Tenemos
        {" "}<Link href="/servicios">alineadora 3D y balanceadora</Link> en el mismo lugar, así que la alineación, la colocación y el balanceo se
        hacen en una sola visita.
      </p>

      <h2>Comprar directo: qué cambia</h2>
      <ul>
        <li><strong>Colocación sin cargo y el mismo día</strong>: comprás y te las colocamos en el momento, sin esperar el envío.</li>
        <li><strong>Cambio de válvulas sin cargo</strong>.</li>
        <li><strong>Stock y precio visibles</strong> en el <Link href="/catalogo">catálogo</Link>, con IVA, y garantía de 1 año por defecto de fábrica.</li>
        <li>El <Link href="/blog/alineado-y-balanceado-juntos-o-por-separado">alineado y balanceado</Link> se puede sumar aparte, con precio publicado.</li>
      </ul>

      <h2>Cómo comparar bien</h2>
      <ol>
        <li>Anotá la medida exacta (<Link href="/blog/como-leer-medida-neumatico">cómo leerla</Link>) y que los índices de carga y velocidad no sean menores a los originales.</li>
        <li>Sumá el precio del neumático más el de la instalación en cada opción, y sumá los días de espera del envío.</li>
        <li>Mirá la fecha de fabricación (<Link href="/blog/antiguedad-del-neumatico-codigo-dot">DOT</Link>) y la garantía.</li>
        <li>Comparás el total final por las cuatro cubiertas, no el precio por unidad.</li>
      </ol>
      <p>
        Si ya compraste en Mercado Libre, elegí Argüello como punto y vení cuando el envío llegue al local. Si todavía no, mirá el <Link href="/catalogo">catálogo</Link>{" "}
        o escribinos por WhatsApp con tu medida.
      </p>
    </ArticleLayout>
  );
}
