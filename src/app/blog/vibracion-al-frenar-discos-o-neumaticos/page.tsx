import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "vibracion-al-frenar-discos-o-neumaticos";
const TITLE = "El auto vibra al frenar: ¿son los discos o los neumáticos?";
const SUBTITLE =
  "Cómo distinguir una vibración de frenos de una de ruedas según cuándo aparece y dónde se siente.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Por qué vibra el auto al frenar: cómo distinguir discos de freno deformados de un problema de balanceo, neumáticos o tren delantero según cuándo aparece y dónde se siente."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Por qué vibra el volante solo cuando freno?",
    answer:
      "Lo más común es una variación en el espesor o la superficie de los discos de freno delanteros. Si la vibración aparece solo al pisar el freno y no a velocidad constante, el balanceo no es la causa.",
  },
  {
    question: "¿El balanceo puede causar vibración al frenar?",
    answer:
      "Un desbalanceo vibra a cierta velocidad, se frene o no. Si ya vibraba antes de tocar el freno y al frenar solo se nota más, conviene empezar por el balanceo.",
  },
  {
    question: "¿Se siente en el pedal o en el volante?",
    answer:
      "En el volante suele indicar el eje delantero; en el pedal de freno, como un pulso, los discos; en el asiento o el piso, el eje trasero.",
  },
  {
    question: "¿Puede ser por las tuercas de rueda?",
    answer:
      "Sí. Un apriete desparejo o excesivo puede deformar el disco contra la maza. Por eso las tuercas se aprietan en cruz y al valor que indica el fabricante.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-12-12" readingMinutes={4} faqs={FAQS}>
      <p>«Vibra» describe muchas cosas distintas. Para saber adónde llevar el auto, lo que sirve es fijarse <strong>cuándo</strong> aparece la vibración y <strong>dónde</strong> se siente. Con esos dos datos se separa casi siempre un problema de frenos de uno de ruedas.</p>

      <h2>La prueba simple</h2>
      <table>
        <thead><tr><th>Cuándo aparece</th><th>Dónde se siente</th><th>Causa más probable</th></tr></thead>
        <tbody>
          <tr><td>Solo al pisar el freno</td><td>Volante y pedal, como un pulso</td><td>Discos de freno delanteros</td></tr>
          <tr><td>Solo al pisar el freno</td><td>Asiento o piso</td><td>Frenos traseros</td></tr>
          <tr><td>A cierta velocidad, sin frenar</td><td>Volante</td><td>Balanceo de las ruedas delanteras</td></tr>
          <tr><td>A cierta velocidad, sin frenar</td><td>Asiento o piso</td><td>Balanceo de las ruedas traseras</td></tr>
          <tr><td>Siempre, y crece con la velocidad</td><td>Todo el auto</td><td>Neumático deformado o llanta doblada</td></tr>
          <tr><td>Al frenar y al pasar pozos</td><td>Volante, con golpeteo</td><td>Juego en el tren delantero</td></tr>
        </tbody>
      </table>

      <h2>Cuando son los discos</h2>
      <p>El disco tiene que tener el mismo espesor en toda la vuelta. Si no lo tiene, la pastilla aprieta más en un sector que en otro y esa diferencia vuelve como un pulso al pedal y una sacudida al volante. Se nota más frenando desde velocidad de ruta. No es trabajo de gomería: lo resuelve un taller de frenos.</p>

      <h2>Cuando son las ruedas</h2>
      <p>Si el auto ya vibraba <strong>antes</strong> de tocar el freno, el origen está en la rueda y al frenar solo se hace más evidente, porque el peso se va adelante.</p>
      <ul>
        <li><strong>Desbalanceo.</strong> Vibra en una franja de velocidad y se calma al pasarla: <Link href="/blog/volante-vibra-causas-y-solucion">volante que vibra</Link>. Muchas veces es una pesa que se cayó: <Link href="/blog/pesas-de-balanceo-por-que-se-caen">pesas de balanceo</Link>.</li>
        <li><strong>Neumático deformado.</strong> Después de un golpe puede quedar una deformación que no se corrige balanceando: <Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">qué revisar después de un pozo</Link>.</li>
        <li><strong>Desgaste en copas.</strong> Vibra y zumba; viene de la suspensión: <Link href="/blog/amortiguadores-gastados-como-afectan-a-los-neumaticos">amortiguadores gastados</Link>.</li>
      </ul>

      <h2>Cuando es el tren delantero</h2>
      <p>Una rótula, un extremo o un buje con juego dejan que la rueda se mueva justo cuando recibe fuerza, y frenar es el momento de más fuerza. Suele venir con golpeteos en los pozos y dirección imprecisa: <Link href="/blog/tren-delantero-con-juego-por-que-no-se-puede-alinear">tren delantero con juego</Link>.</p>

      <h2>El detalle de las tuercas</h2>
      <p>Un disco puede deformarse si la rueda se aprieta despareja o con exceso de fuerza, porque la llanta lo presiona contra la maza de forma irregular. Si la vibración apareció poco después de sacar y poner las ruedas, es un dato para contarle al mecánico: <Link href="/blog/torque-de-las-tuercas-de-rueda-por-que-importa">el torque de las tuercas de rueda</Link>.</p>

      <h2>Por dónde empezar</h2>
      <p>Si vibra a velocidad constante, empezá por el balanceado: es lo más rápido y lo más barato de descartar. El <Link href="/servicios/combo-alineado-y-balanceado">alineado y balanceado</Link> se hace por orden de llegada, sin turno. Si solo vibra al frenar, el paso siguiente es un taller de frenos.</p>
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
