import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { FlancoFoto } from "@/components/blog/FlancoFoto";
import { FlancoLinks } from "@/components/blog/FlancoLinks";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumatico-radial-que-significa-la-r";
const TITLE = "La R en la medida del neumático: qué es un neumático radial";
const SUBTITLE =
  "No significa «rin» ni «rodado»: la R indica cómo está construida la cubierta por dentro. Qué es un neumático radial y en qué se diferencia de uno diagonal.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué significa la R en 195/65 R15: neumático de construcción radial. Cómo se construye, qué ventajas tiene frente al diagonal y por qué casi todos los neumáticos de auto y camioneta son radiales.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  { question: "¿Qué significa la R en la medida de un neumático?", answer: "Radial: indica que las cuerdas internas van perpendiculares a la marcha. No es «rin» ni el tamaño de la llanta." },
  { question: "¿Cuál es la diferencia entre radial y diagonal?", answer: "En el radial las cuerdas corren de talón a talón con cinturones de acero encima; en el diagonal se cruzan en diagonal. El radial apoya más parejo, rinde más kilómetros y consume menos." },
  { question: "¿Todos los neumáticos de auto son radiales?", answer: "Los de autos y camionetas actuales, en la práctica sí. Los diagonales quedaron para vehículos antiguos, acoplados y uso agrícola." },
  { question: "¿Puedo mezclar neumáticos radiales y diagonales?", answer: "No es recomendable: el comportamiento del vehículo cambia y puede ser inseguro. Todos los neumáticos del mismo vehículo deberían ser radiales." },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-11-16"
      readingMinutes={4}
      faqs={FAQS}
      extras={
        <>
          <FotoNeumaticoBloque titulo="¿No sabés qué lleva tu neumático? Mandanos una foto" />
          <FlancoLinks current={SLUG} />
        </>
      }
    >
      <p>La letra que va entre el perfil y el rodado, la <strong>R</strong> de 195/65 <strong>R</strong>15, indica que el neumático es <strong>radial</strong>. En la foto del flanco es el número 3. Es una confusión muy común: la R no significa «rin» ni nombra el tamaño de la llanta; ese dato es el 15 que viene después.</p>
      <FlancoFoto numero={3} caption="Número 3: la R, construcción radial." />

      <h2>Qué significa «radial»</h2>
      <p>Por dentro, el neumático tiene capas de cuerdas (de acero o textil) que le dan resistencia. En un neumático <strong>radial</strong>, esas cuerdas corren de un talón al otro en forma perpendicular a la marcha, como los radios de una rueda, y sobre ellas hay cinturones de acero bajo la banda de rodamiento. En uno <strong>diagonal</strong>, las cuerdas se cruzan en diagonal.</p>

      <h2>Por qué hoy casi todos son radiales</h2>
      <ul>
        <li>La huella apoya más pareja sobre el piso, con mejor agarre.</li>
        <li>El flanco se flexiona sin deformar la banda: menos calentamiento y menos resistencia a rodar, con menor consumo.</li>
        <li>El desgaste es más parejo y la vida útil, más larga.</li>
      </ul>

      <h2>Cómo reconocer un diagonal</h2>
      <p>Los neumáticos diagonales se escriben con un guion en lugar de la R (por ejemplo 6.00-16) y hoy se ven en vehículos antiguos, acoplados o usos agrícolas. En autos y camionetas actuales, prácticamente todas las medidas llevan la R.</p>

      <h2>Qué tener en cuenta</h2>
      <p>No conviene mezclar radiales con diagonales en un mismo vehículo, y tampoco medidas o construcciones distintas en el mismo eje. La R no cambia la medida que buscás: seguís leyendo el ancho, el perfil y el rodado. Para el código completo mirá <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>, y para lo que sigue, el <Link href="/blog/rodado-del-neumatico-que-significa">rodado</Link>.</p>
    </ArticleLayout>
  );
}
