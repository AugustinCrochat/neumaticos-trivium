import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-baratos-en-cordoba";
const TITLE = "Neumáticos baratos en Córdoba: cómo ahorrar sin comprar mal";
const SUBTITLE =
  "Barato no tiene por qué ser dudoso. Cómo se consiguen precios bajos con cubiertas nuevas, qué mirar para no pagar de más y dónde conviene comprar en Córdoba.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo comprar neumáticos baratos en Córdoba sin arriesgar la calidad: importación directa, precio publicado, fecha de fabricación (DOT), costo por kilómetro y colocación incluida en Argüello.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Por qué un neumático nuevo puede costar menos?",
    answer:
      "Sobre todo por la cadena comercial: cuando se importa directo y se vende al público se saca al importador y al distribuidor del medio. También influye la marca: hay marcas que cumplen las mismas homologaciones y cuestan bastante menos que las premium.",
  },
  {
    question: "¿Barato significa que dura menos?",
    answer:
      "No necesariamente. Depende de la marca, del uso y del mantenimiento. Alineación, presión correcta y rotación pesan mucho en la vida útil de cualquier cubierta.",
  },
  {
    question: "¿Dónde puedo ver los precios antes de ir?",
    answer:
      "En el catálogo de la web: cada medida tiene precio y stock publicados. El local está en Av. Donato Álvarez 7971, Argüello, de lunes a sábados de 9 a 19 horas.",
  },
  {
    question: "¿La colocación tiene costo?",
    answer:
      "La colocación y el cambio de válvulas son sin cargo si comprás las cubiertas en el local de Argüello. El balanceo y la alineación se cotizan aparte.",
  },
  {
    question: "¿Cuántas cubiertas conviene cambiar a la vez?",
    answer:
      "Lo ideal es el juego de cuatro. Si cambiás dos, que vayan al eje trasero, para mantener la estabilidad en frenadas y con lluvia.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-12-01" readingMinutes={5} faqs={FAQS}>
      <p>
        Cuando se busca neumáticos baratos en Córdoba aparece la duda de siempre: ¿cuál es la
        trampa? A veces la hay, y por eso conviene saber de dónde sale un precio bajo y qué revisar
        antes de pagar.
      </p>

      <h2>De dónde sale un precio bajo (de verdad)</h2>
      <ul>
        <li>
          <strong>Importación directa:</strong> sin importador ni distribuidor en el medio, el
          neumático llega más barato al público.
        </li>
        <li>
          <strong>Marcas alternativas:</strong> hay marcas con las mismas homologaciones que las
          premium y un precio bastante menor. Mirá la{" "}
          <Link href="/blog/marcas-chinas-neumaticos-comparativa">comparativa de marcas</Link>.
        </li>
        <li>
          <strong>Menos estructura:</strong> un local sencillo con el stock a mano en lugar de pedir
          cada neumático al proveedor.
        </li>
      </ul>

      <h2>Lo que no tiene que ser barato</h2>
      <p>
        La fecha de fabricación (DOT) importa: la goma envejece aunque no ruede. Un neumático de
        hace varios años debería costar menos, no lo mismo. También miramos el estado del dibujo, la
        garantía y la colocación bien hecha, con válvulas nuevas y balanceo.
      </p>

      <h2>Pensalo por kilómetro</h2>
      <p>
        El neumático más barato no siempre es el que menos cuesta por kilómetro. Si querés hacer la
        cuenta, leé <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio, calidad y costo
        por kilómetro</Link>.
      </p>

      <h2>Cómo comparar presupuestos</h2>
      <p>
        Pedí siempre la medida exacta, si incluye colocación y válvulas, la fecha de fabricación y
        la garantía. Más detalle en{" "}
        <Link href="/blog/comprar-neumaticos-en-cordoba">qué comparar además del precio</Link>.
      </p>

      <h2>Dónde ver precios y stock en Córdoba</h2>
      <p>
        Los precios están publicados en la web y son los mismos del local, en Av. Donato Álvarez
        7971, Argüello. Mirá el <Link href="/neumaticos-baratos">listado de neumáticos baratos</Link>,
        el <Link href="/catalogo">catálogo</Link> o la página de{" "}
        <Link href="/neumaticos-en/cordoba">neumáticos en Córdoba</Link> para saber cómo llegar.
      </p>
    </ArticleLayout>
  );
}
