import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "amortiguadores-gastados-como-afectan-a-los-neumaticos";
const TITLE = "Amortiguadores gastados: cómo arruinan los neumáticos y cómo darte cuenta";
const SUBTITLE =
  "El desgaste en forma de copas, el rebote y la frenada más larga: las señales de que el problema no es la cubierta.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cómo afectan los amortiguadores gastados a los neumáticos: desgaste en copas, menos agarre y frenada más larga. Señales para detectarlo y por qué alinear no lo corrige."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cómo se ve el desgaste por amortiguadores?",
    answer:
      "Como una serie de zonas hundidas a lo largo de la banda, una al lado de la otra, que se notan al pasar la mano: sube y baja como una escalera suave. Se lo llama desgaste en copas o en dientes de sierra.",
  },
  {
    question: "¿Alinear arregla ese desgaste?",
    answer:
      "No. El alineado corrige los ángulos de las ruedas; si el amortiguador no frena el rebote, la rueda sigue golpeando contra el asfalto y el desgaste vuelve. Primero se cambian los amortiguadores y después se alinea.",
  },
  {
    question: "¿Se cambian los cuatro amortiguadores?",
    answer:
      "Como mínimo de a pares, los dos del mismo eje, para que el auto no quede con un lado más firme que el otro.",
  },
  {
    question: "¿Conviene poner neumáticos nuevos con amortiguadores gastados?",
    answer:
      "Se puede, pero el juego nuevo se va a gastar mal desde el primer kilómetro. Si el desgaste de las cubiertas viejas era en copas, conviene resolver la suspensión antes o junto con el cambio.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Mantenimiento" date="2026-11-29" readingMinutes={5} faqs={FAQS}>
      <p>El amortiguador tiene un trabajo simple: que la rueda vuelva al piso y se quede ahí después de cada pozo. Cuando está gastado, la rueda rebota. Y un neumático que rebota no agarra, no frena y se gasta de una forma muy particular.</p>

      <h2>El desgaste en copas</h2>
      <p>Cada rebote hace que la banda golpee el asfalto en lugar de rodar. Con los kilómetros, esos golpes dejan <strong>zonas hundidas repartidas a lo largo de la banda</strong>. Pasá la mano por la cubierta: si sentís ondas, altos y bajos, es desgaste en copas. Suele venir con un zumbido que crece con la velocidad y se confunde con un rulemán. Las otras formas de desgaste y sus causas están en <Link href="/blog/desgaste-irregular-de-neumaticos">desgaste irregular de neumáticos</Link>.</p>

      <h2>Lo que no se ve: agarre y frenada</h2>
      <p>Con el amortiguador vencido la rueda pasa una parte del tiempo con menos carga sobre el piso. En seco apenas se nota; en mojado o sobre asfalto ondulado, el auto <strong>tarda más en frenar</strong> y se mueve más en las curvas. También es más fácil que aparezca el <Link href="/blog/aquaplaning-que-es-y-como-evitarlo">aquaplaning</Link>.</p>

      <h2>Cómo darte cuenta</h2>
      <table>
        <thead><tr><th>Señal</th><th>Qué indica</th></tr></thead>
        <tbody>
          <tr><td>El auto sigue oscilando después de un lomo de burro</td><td>El amortiguador ya no frena el resorte</td></tr>
          <tr><td>La trompa se hunde mucho al frenar</td><td>Amortiguadores delanteros vencidos</td></tr>
          <tr><td>Manchas de aceite en el cuerpo del amortiguador</td><td>Pérdida: dejó de trabajar</td></tr>
          <tr><td>Golpes secos al tomar pozos</td><td>Amortiguador, tope o cazoleta</td></tr>
          <tr><td>Desgaste en copas y zumbido</td><td>La rueda viene rebotando hace tiempo</td></tr>
        </tbody>
      </table>
      <p>No hay un kilometraje fijo: depende del auto, la carga y las calles. Lo razonable es hacerlos revisar cuando aparece alguna de estas señales y cada vez que cambiás los neumáticos.</p>

      <h2>El orden correcto</h2>
      <ol>
        <li><strong>Suspensión primero.</strong> Amortiguadores de a pares por eje.</li>
        <li><strong>Alineado después.</strong> Al cambiar amortiguadores se mueven los ángulos: hay que alinear siempre.</li>
        <li><strong>Balanceado y rotación.</strong> Para emparejar lo que quede de vida útil.</li>
      </ol>
      <p>Si las cubiertas ya quedaron muy marcadas, el zumbido no se va aunque la suspensión esté nueva: el desgaste hecho no se recupera. En ese caso conviene <Link href="/neumaticos">buscar tu medida</Link> y arrancar el juego nuevo con el auto ya alineado.</p>
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
