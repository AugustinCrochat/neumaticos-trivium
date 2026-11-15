import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "llantas-de-aleacion-o-de-chapa-diferencias";
const TITLE = "Llantas de aleación o de chapa: diferencias, ventajas y qué cambia en la gomería";
const SUBTITLE =
  "Peso, resistencia a los golpes, reparación y balanceo: lo que conviene saber antes de cambiar de llanta o de cubierta.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Diferencias entre llantas de aleación y llantas de chapa: peso, resistencia a golpes, reparación, balanceo y tuercas. Qué tener en cuenta al cambiar los neumáticos."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es mejor, llanta de aleación o de chapa?",
    answer:
      "Depende del uso. La de aleación suele ser más liviana y disipa mejor el calor de los frenos; la de chapa es más barata y aguanta mejor el maltrato, porque ante un golpe se dobla en vez de fisurarse.",
  },
  {
    question: "¿Se puede reparar una llanta doblada?",
    answer:
      "Una de chapa, en general sí: se endereza. Una de aleación con una fisura es otro tema: es una pieza estructural y una reparación mal hecha puede fallar. Ante un golpe fuerte conviene hacerla revisar antes de seguir usándola.",
  },
  {
    question: "¿Las tuercas son las mismas?",
    answer:
      "No siempre. El asiento de la tuerca o el bulón tiene que coincidir con el de la llanta, y al pasar de chapa a aleación (o al revés) puede cambiar. Usar la tuerca equivocada hace que la rueda no asiente bien.",
  },
  {
    question: "¿Puedo poner cualquier neumático en mi llanta?",
    answer:
      "No. Tiene que coincidir el rodado y el ancho de la cubierta tiene que estar dentro del rango que admite el ancho de la llanta.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-12-04" readingMinutes={5} faqs={FAQS}>
      <p>Una aclaración antes de empezar: acá <strong>llanta</strong> es la pieza metálica sobre la que va montado el neumático, no la cubierta. Hay dos familias: las de chapa de acero estampada, que suelen ir tapadas con una taza, y las de aleación de aluminio, que quedan a la vista.</p>

      <h2>La comparación</h2>
      <table>
        <thead><tr><th></th><th>Chapa (acero)</th><th>Aleación</th></tr></thead>
        <tbody>
          <tr><td>Peso</td><td>Más pesada</td><td>En general más liviana</td></tr>
          <tr><td>Ante un golpe fuerte</td><td>Se dobla</td><td>Puede fisurarse o partirse</td></tr>
          <tr><td>Reparación</td><td>Se endereza con facilidad</td><td>Delicada; una fisura compromete la pieza</td></tr>
          <tr><td>Corrosión</td><td>Se oxida si pierde la pintura</td><td>Se mancha o se pica el barniz</td></tr>
          <tr><td>Precio</td><td>Más económica</td><td>Más cara</td></tr>
          <tr><td>Pesas de balanceo</td><td>De golpe, en el borde</td><td>Adhesivas, por dentro</td></tr>
        </tbody>
      </table>

      <h2>Qué se nota al manejar</h2>
      <p>La llanta es peso que la suspensión tiene que mover en cada pozo. Una más liviana le facilita el trabajo al amortiguador y el auto copia mejor el piso. En la práctica la diferencia es sutil en un auto de calle; lo que más cambia el manejo no es el material sino el <strong>diámetro</strong>: una llanta más grande obliga a un neumático de <Link href="/blog/perfil-bajo-o-perfil-alto">perfil más bajo</Link>, más firme y más expuesto a los pozos.</p>

      <h2>Calles rotas: lo que conviene saber</h2>
      <p>En un pozo fuerte, la llanta de chapa se deforma y avisa: pierde aire, vibra, se ve doblada. La de aleación puede fisurarse por dentro sin que se note desde afuera. Después de un golpe importante, revisá las dos cosas, llanta y cubierta: <Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">qué mirar después de un pozo</Link>.</p>

      <h2>En la gomería</h2>
      <ul>
        <li><strong>Desarme.</strong> La aleación se trabaja con protecciones en la desarmadora para no marcar el borde.</li>
        <li><strong>Balanceado.</strong> En aleación se usan pesas adhesivas por la cara interna, que no se ven y no dañan el barniz: <Link href="/blog/pesas-de-balanceo-por-que-se-caen">pesas de balanceo</Link>.</li>
        <li><strong>Tuercas.</strong> El asiento tiene que ser el de esa llanta. Si tu auto lleva llantas de aleación, también vale mirar las <Link href="/tuercas-antirrobo">tuercas antirrobo</Link>.</li>
        <li><strong>Válvulas.</strong> Se cambian junto con las cubiertas en cualquiera de las dos.</li>
      </ul>

      <h2>Si vas a cambiar de llanta</h2>
      <p>Respetá el diámetro total de la rueda para no alterar el velocímetro: la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> te dice qué medida de cubierta corresponde a la llanta nueva. Con la medida definida, <Link href="/neumaticos">mirá precio y stock</Link>.</p>
    </ArticleLayout>
  );
}
