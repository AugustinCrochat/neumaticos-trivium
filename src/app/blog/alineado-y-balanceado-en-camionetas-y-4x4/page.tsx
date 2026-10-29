import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "alineado-y-balanceado-en-camionetas-y-4x4";
const TITLE = "Alineado y balanceado en camionetas y 4x4 con neumáticos A/T";
const SUBTITLE =
  "Más peso, ruedas más grandes y dibujos agresivos: por qué una pickup se alinea y se balancea distinto que un auto, y cuándo hacerlo.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Alineado y balanceado en camionetas y 4x4: por qué las ruedas grandes y los neumáticos A/T necesitan más atención, cuándo alinear (kit de elevación, cambio de medida) y qué cuidar en una tracción integral.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Una camioneta se alinea y se balancea igual que un auto?",
    answer:
      "El procedimiento es el mismo, pero hay más para cuidar: las ruedas son más grandes y pesadas, los neumáticos A/T tienen un dibujo que acentúa cualquier desbalance y el tren delantero trabaja con más carga. Eso hace que las vibraciones y el desgaste desparejo se noten antes.",
  },
  {
    question: "¿Hay que alinear después de poner un kit de elevación o cambiar la medida?",
    answer:
      "Sí, siempre. Elevar la suspensión modifica los ángulos (sobre todo la caída y el avance), y cambiar a una medida de neumático más grande también altera la geometría efectiva. Sin alinear, el desgaste se dispara.",
  },
  {
    question: "¿Los neumáticos A/T se desgastan distinto?",
    answer:
      "Sí, y suelen mostrarlo antes: los tacos grandes marcan escalones o desgaste en pluma si hay un problema de alineación o de presión. Rotarlos en forma regular ayuda a que se gasten parejo.",
  },
  {
    question: "¿Cuántos neumáticos hay que cambiar en una 4x4?",
    answer:
      "En una tracción integral conviene mantener el mismo desgaste en los cuatro. Una diferencia grande de diámetro entre ejes puede forzar la transmisión. Está explicado en la nota sobre cambiar los cuatro en una 4x4 o AWD.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-13" readingMinutes={5} faqs={FAQS}>
      <p>Una pickup o una 4x4 lleva ruedas más grandes, más pesadas y más exigidas que las de un auto. Las pautas de alineado y balanceado son las mismas, pero tres cosas cambian: cuánto cuesta equivocarse, qué tan rápido se nota y qué otras modificaciones hay que tener en cuenta.</p>

      <h2>Qué cambia respecto de un auto</h2>
      <ul>
        <li><strong>Peso y tamaño de la rueda.</strong> Un conjunto grande necesita más contrapeso y, si se desbalancea, la vibración es más fuerte.</li>
        <li><strong>Dibujo A/T.</strong> Los tacos grandes y espaciados amplifican la vibración y marcan el desgaste desparejo. Las diferencias con los H/T están en <Link href="/blog/at-o-ht-cual-conviene-para-tu-camioneta">A/T o H/T: cuál conviene</Link>.</li>
        <li><strong>Carga.</strong> El tren delantero trabaja con más peso y, si hay un desajuste, los neumáticos pagan más rápido.</li>
        <li><strong>Uso mixto.</strong> Ruta y tierra: más golpes y más ocasiones de desalinear.</li>
      </ul>

      <h2>Cuándo alinear una camioneta</h2>
      <table>
        <thead>
          <tr>
            <th>Situación</th>
            <th>Alineación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kit de elevación o rebaje de suspensión</td>
            <td>Siempre, justo después</td>
          </tr>
          <tr>
            <td>Cambio a una medida de neumático distinta</td>
            <td>Sí</td>
          </tr>
          <tr>
            <td>Neumáticos nuevos</td>
            <td>Recomendada</td>
          </tr>
          <tr>
            <td>Golpe fuerte en camino de tierra, un pozo o un cordón</td>
            <td>Sí, cuanto antes</td>
          </tr>
          <tr>
            <td>Control periódico</td>
            <td>Cada 10.000 km o una vez por año; menos si es uso intensivo</td>
          </tr>
        </tbody>
      </table>

      <h2>Balanceo en ruedas grandes</h2>
      <p>Las ruedas de camioneta se balancean en dos planos, igual que las de un auto, pero con una balanceadora que acepte el diámetro y el peso. Las llantas de aleación grandes y las llantas con neumáticos A/T suelen necesitar contrapesos mayores. Y cualquier cosa que cambie la masa de la rueda, como barro pegado en el interior de la llanta, puede arruinar un balanceo prolijo: por eso conviene limpiar bien antes.</p>

      <h2>Tracción integral: ojo con las diferencias</h2>
      <p>En una 4x4 o AWD, los cuatro neumáticos deberían tener un diámetro parecido. Una diferencia grande entre ejes fuerza el diferencial y la transmisión. Por eso, si hay que reemplazar uno solo, conviene revisar la regla de la nota <Link href="/blog/cambiar-los-cuatro-neumaticos-en-4x4-o-awd">cambiar los cuatro en 4x4 o AWD</Link>. Y para rotar y emparejar el desgaste: <Link href="/blog/rotacion-de-neumaticos">cada cuánto rotar</Link>.</p>

      <h2>Medidas, flotación y alineado</h2>
      <p>Si estás por cambiar a una medida más grande, mirá antes <Link href="/blog/medidas-flotation-camionetas">medidas flotation en camionetas</Link>. Después del cambio, el alineado es parte del trabajo. Para ver el servicio: <Link href="/servicios/alineacion">alineado</Link> y <Link href="/servicios/balanceo">balanceado</Link>. Neumáticos para camionetas: <Link href="/neumaticos/at">A/T</Link> y <Link href="/neumaticos/ht">H/T</Link>.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
