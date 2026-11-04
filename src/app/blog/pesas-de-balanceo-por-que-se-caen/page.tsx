import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "pesas-de-balanceo-por-que-se-caen";
const TITLE = "Pesas de balanceo: tipos, por qué se caen y qué pasa si falta una";
const SUBTITLE =
  "Esos gramos de metal en la llanta son lo que mantiene la rueda sin vibrar. Cómo funcionan, de qué tipo hay y qué hacer si se cae una.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Pesas de balanceo: qué son, tipos (adhesivas y de clip), por qué se caen, cómo darte cuenta de que falta una y por qué hay que volver a balancear en lugar de simplemente pegar otra."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Para qué sirven las pesas de balanceo?",
    answer:
      "Compensan el peso desparejo del conjunto de llanta y neumático. Se colocan en el punto opuesto al exceso de peso para que la rueda gire equilibrada y no vibre.",
  },
  {
    question: "¿Qué tipos de pesas hay?",
    answer:
      "Principalmente de dos tipos: las adhesivas, que se pegan en la parte interior de la llanta, y las de clip, que se enganchan en el borde de la llanta. Las llantas de aleación suelen llevar adhesivas y las de chapa, de clip, aunque depende del modelo.",
  },
  {
    question: "¿Por qué se cae una pesa?",
    answer:
      "Las adhesivas se despegan si la llanta estaba sucia o con grasa al pegarlas, por lavados a presión o por golpes. Las de clip pueden salirse por un golpe fuerte contra un cordón o si el borde de la llanta está deformado.",
  },
  {
    question: "Si se cayó una pesa, ¿alcanza con pegar otra?",
    answer:
      "No. La posición y el valor exacto se calculan en la balanceadora. Conviene volver a balancear la rueda, que además verifica que el resto siga bien.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-17" readingMinutes={5} faqs={FAQS}>
      <p>Cuando un técnico balancea una rueda, el resultado es una o varias piezas pequeñas de metal pegadas o enganchadas en la llanta. Parecen poca cosa, pero son las que evitan que el volante tiemble a 100 km/h. Y a veces se caen sin que lo notes, hasta que la vibración vuelve.</p>

      <h2>Cómo funciona un contrapeso</h2>
      <p>Una rueda nunca está perfectamente pareja: tiene un punto algo más pesado por la válvula, por el empalme del neumático o por la soldadura de la llanta. La balanceadora hace girar la rueda, detecta dónde está el exceso y calcula cuántos gramos poner, y en qué lugar, en el lado opuesto. En una rueda de auto son, en total, unos pocos gramos distribuidos en uno o dos planos.</p>

      <h2>Tipos de pesas</h2>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Dónde va</th>
            <th>Se usa en</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Adhesiva</strong></td>
            <td>Pegada en la cara interior de la llanta</td>
            <td>Llantas de aleación, donde un clip rayaría el borde</td>
          </tr>
          <tr>
            <td><strong>De clip</strong></td>
            <td>Enganchada en el borde exterior de la llanta</td>
            <td>Llantas de chapa y algunas de aleación con borde apto</td>
          </tr>
        </tbody>
      </table>
      <p>Se fabrican de distintos metales, como plomo, zinc o acero. Lo que importa es el valor en gramos que indica la balanceadora, no el material.</p>

      <h2>Por qué se caen</h2>
      <ul>
        <li><strong>Llanta sucia al pegarla.</strong> Una pesa adhesiva necesita una superficie limpia y seca. Con grasa, barro o restos de pesas anteriores, se despega con el tiempo.</li>
        <li><strong>Lavado a presión.</strong> El chorro directo en el interior de la llanta puede aflojar una pesa adhesiva.</li>
        <li><strong>Golpes.</strong> Un cordón o un pozo fuerte puede sacar una de clip o despegar una adhesiva.</li>
        <li><strong>Llanta deformada.</strong> Si el borde está golpeado, el clip no agarra bien.</li>
      </ul>

      <h2>Cómo darte cuenta de que falta una</h2>
      <p>Aparece de nuevo la vibración a cierta velocidad en una rueda que ya estaba balanceada: <Link href="/blog/volante-vibra-causas-y-solucion">por qué vibra el volante</Link>. A veces, con la rueda desmontada, se ve el hueco limpio donde estaba pegada. Si una rueda se desbalancea de golpe, es probable que haya perdido una pesa.</p>

      <h2>Qué hacer</h2>
      <ol>
        <li><strong>Volver a balancear la rueda</strong>, no solo reponer la pesa a ojo. El valor y la posición los calcula la máquina.</li>
        <li><strong>Pedir que limpien la llanta</strong> en la zona donde se pega la nueva.</li>
        <li><strong>Revisar la llanta y el neumático</strong> si la pesa se cayó junto con un golpe fuerte: <Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">qué revisar después de un golpe</Link>.</li>
      </ol>
      <p>Los criterios para balancear, siempre que se monta un neumático y cada cuántos kilómetros, están en <Link href="/blog/cada-cuantos-km-alinear-y-balancear">cada cuántos km alinear y balancear</Link>. Y el servicio completo: <Link href="/servicios/balanceo">balanceado</Link>.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
