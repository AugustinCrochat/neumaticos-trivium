import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "que-incluye-el-presupuesto-de-neumaticos";
const TITLE = "Qué incluye el presupuesto de neumáticos: cómo comparar sin sorpresas";
const SUBTITLE =
  "Dos presupuestos de cuatro cubiertas pueden tener totales muy distintos y no ser comparables. Qué ítems mirar: colocación, válvulas, balanceo, alineación, nitrógeno, IVA y garantía.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué incluye un presupuesto de neumáticos y cómo compararlo: precio por unidad, IVA, colocación, válvulas, balanceo, alineación, nitrógeno, garantía y qué preguntar en la gomería.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué debería incluir el presupuesto de cuatro neumáticos?",
    answer:
      "El precio de cada neumático, si es por unidad o por el juego, si incluye IVA, y por separado: colocación (arme y desarme), válvulas, balanceo y alineación. También conviene que diga la garantía y si hay costos de envío o de descarte de las cubiertas usadas.",
  },
  {
    question: "¿La colocación está incluida en el precio del neumático?",
    answer:
      "Depende de dónde compres. Algunas gomerías la incluyen, otras la cobran por rueda aparte. En nuestro local, si comprás las cubiertas ahí, la colocación y el cambio de válvulas no tienen cargo.",
  },
  {
    question: "¿Es obligatorio el inflado con nitrógeno que figura en algunos presupuestos?",
    answer:
      "No. Es un servicio opcional, y su beneficio es chico: en un estudio de 12 meses los neumáticos con nitrógeno perdieron 2,2 psi contra 3,5 psi con aire. Pedí que te digan cuánto suma al total y decidí si lo querés.",
  },
  {
    question: "¿El balanceo y la alineación vienen incluidos?",
    answer:
      "Casi nunca en el precio de la cubierta. Son servicios aparte que conviene hacer al cambiar el juego. Preguntá el precio de cada uno al pedir el presupuesto, así comparás el total real.",
  },
  {
    question: "¿Cómo comparo dos presupuestos de neumáticos?",
    answer:
      "Poné lado a lado las mismas cosas: medida e índices de las cubiertas, precio por unidad con IVA, colocación, válvulas, balanceo, alineación, extras y garantía. Si un ítem falta en uno de los dos, preguntalo antes de decidir por el total.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-24" readingMinutes={6} faqs={FAQS}>
      <p>
        Pedís presupuesto para cambiar las cuatro cubiertas y recibís dos totales distintos. El más barato
        parece la mejor opción, pero antes de decidir conviene saber qué incluye cada uno. Un total más bajo
        puede estar dejando afuera ítems que después aparecen en la caja, y uno más alto puede traer todo
        resuelto. Esta guía te muestra qué mirar.
      </p>

      <h2>Los ítems que tienen que figurar</h2>
      <ul>
        <li>
          <strong>Precio del neumático, por unidad o por juego.</strong> Fijate si el número que ves es por
          cubierta o por las cuatro: es el error de comparación más común.
        </li>
        <li>
          <strong>IVA.</strong> Si el precio es con o sin IVA cambia el total en más de un quinto.
        </li>
        <li>
          <strong>Colocación (arme y desarme).</strong> Algunas gomerías la incluyen, otras la cobran por rueda.
          Mirá <Link href="/blog/arme-y-desarme-de-neumaticos">qué incluye un arme y desarme bien hecho</Link>.
        </li>
        <li>
          <strong>Válvulas.</strong> Se cambian siempre al colocar cubiertas nuevas, y muchas gomerías las cobran
          como ítem aparte:{" "}
          <Link href="/blog/cambio-de-valvulas-de-neumaticos">cuándo se cambian y qué incluye</Link>.
        </li>
        <li>
          <strong>Balanceo.</strong> Evita vibraciones y desgaste desparejo.{" "}
          <Link href="/servicios/balanceo">Balanceo en Córdoba</Link>.
        </li>
        <li>
          <strong>Alineación.</strong> Es la que más hace por la vida útil del juego:{" "}
          <Link href="/servicios/alineacion">alineación 3D en Córdoba</Link>.
        </li>
        <li>
          <strong>Extras opcionales.</strong> Como el inflado con nitrógeno, cuyo beneficio real es chico:{" "}
          <Link href="/blog/nitrogeno-en-neumaticos-vale-la-pena">qué mejora y cuánto conviene pagar</Link>.
        </li>
        <li>
          <strong>Garantía.</strong> Qué cubre, por cuánto tiempo y quién la gestiona.
        </li>
        <li>
          <strong>Envío o descarte.</strong> Algunas gomerías cobran el envío o el retiro de las cubiertas
          usadas; preguntalo.
        </li>
      </ul>

      <h2>Un ejemplo para comparar</h2>
      <p>
        Con números redondos, solo de ejemplo. El presupuesto A dice $320.000 por las cuatro cubiertas y nada más.
        El presupuesto B dice $340.000 e incluye colocación y válvulas. Si en A la colocación cuesta $6.000 por
        rueda y las válvulas $2.500 cada una, A termina en $354.000 y B en $340.000: el que parecía más barato
        sale más caro. Y si falta alguna línea en cualquiera de los dos, la comparación no sirve hasta
        completarla.
      </p>

      <h2>Las preguntas para hacer antes de decidir</h2>
      <ol>
        <li>¿El precio es por unidad o por el juego de cuatro?</li>
        <li>¿Incluye IVA?</li>
        <li>¿La colocación y las válvulas están incluidas o se cobran aparte?</li>
        <li>¿Cuánto cuestan el balanceo y la alineación?</li>
        <li>¿Hay algún extra opcional en el total, como el nitrógeno?</li>
        <li>¿Qué garantía tienen las cubiertas y quién responde?</li>
        <li>¿Hay costo de envío o de retiro de las cubiertas usadas?</li>
      </ol>

      <h2>Comparar también las cubiertas</h2>
      <p>
        El precio solo compara si la cubierta es equivalente: misma medida, mismos índices de carga y velocidad,
        y una fecha de fabricación (DOT) reciente. Mirá la etiqueta europea para comparar consumo, frenado en
        mojado y ruido, y si dudás entre marcas, la nota{" "}
        <Link href="/blog/como-elegir-neumatico-importado-seguro">cómo elegir un neumático importado seguro</Link>{" "}
        y la guía de <Link href="/marcas-de-neumaticos-chinos">marcas de neumáticos chinos</Link> te ayudan.
      </p>

      <h2>Cómo lo hacemos en Neumáticos Trivium</h2>
      <p>
        El precio publicado en la web es por unidad, con IVA incluido, y es el mismo que en el mostrador. Si
        comprás las cubiertas en el local de Argüello, la colocación y el cambio de válvulas no tienen cargo; el
        balanceo y la alineación se cotizan aparte. No inflamos con nitrógeno. Para ver precios de cada rodado,
        mirá <Link href="/neumaticos-baratos">neumáticos baratos</Link>, y si querés un presupuesto, escribinos
        por WhatsApp con la medida de tu auto.
      </p>
    </ArticleLayout>
  );
}
