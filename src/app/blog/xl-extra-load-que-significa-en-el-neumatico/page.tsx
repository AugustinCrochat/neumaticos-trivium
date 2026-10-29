import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { FlancoFoto } from "@/components/blog/FlancoFoto";
import { FlancoLinks } from "@/components/blog/FlancoLinks";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "xl-extra-load-que-significa-en-el-neumatico";
const TITLE = "XL en el neumático: qué significa «Extra Load» o reforzado";
const SUBTITLE =
  "Las letras XL en el flanco indican una cubierta reforzada para soportar más carga a la misma medida. Cuándo se necesita y qué pasa si ponés una estándar.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué significa XL (Extra Load, reforzado) en el flanco de un neumático: más carga a la misma medida, mayor presión de referencia y por qué no conviene reemplazarlo por uno estándar.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  { question: "¿Qué significa XL en un neumático?", answer: "Extra Load: es una cubierta reforzada que soporta más carga que una estándar de la misma medida, con una presión de referencia mayor." },
  { question: "¿Puedo poner un neumático estándar si mi auto trae XL?", answer: "No es recomendable: si el vehículo exige XL o un índice de carga mayor, una cubierta estándar no soporta lo requerido. Nunca bajes del índice original." },
  { question: "¿XL y reforzado es lo mismo?", answer: "Sí, «Reinforced» o «Extra Load» son el mismo concepto, y en el flanco puede aparecer como XL, Extra Load o Reinforced según el fabricante." },
  { question: "¿Un XL dura más?", answer: "No necesariamente: su ventaja es la capacidad de carga. La vida útil depende del uso, la presión, la alineación y el balanceo." },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-11-25"
      readingMinutes={5}
      faqs={FAQS}
      extras={
        <>
          <FotoNeumaticoBloque titulo="¿No sabés qué lleva tu neumático? Mandanos una foto" />
          <FlancoLinks current={SLUG} />
        </>
      }
    >
      <p>Junto al índice de carga y a la letra de velocidad, el neumático de la foto lleva grabadas las letras <strong>XL</strong> (número 7). Significan <strong>Extra Load</strong>, o «carga extra»: es una cubierta <strong>reforzada</strong>.</p>
      <FlancoFoto numero={7} caption="Número 7: XL, Extra Load (reforzado)." />

      <h2>Qué es un neumático XL</h2>
      <p>Es un neumático de la misma medida que uno estándar, pero con una estructura interna reforzada. Eso le permite soportar <strong>más carga</strong>, siempre que se infle a una presión de referencia mayor: según las normas, la presión de referencia de un neumático estándar es de 250 kPa (36 psi) y la de uno XL, de 280 kPa (41 psi).</p>

      <h2>La relación con el índice de carga</h2>
      <p>El XL va de la mano del índice de carga que lo precede. En el ejemplo, el <strong>95</strong> equivale a 690 kg por neumático. En una misma medida es común encontrar una versión estándar con un índice menor (por ejemplo 91, que equivale a 615 kg) y otra XL con un índice mayor. Para repasar las tablas, mirá <Link href="/blog/indice-de-carga-y-velocidad">índice de carga y velocidad</Link>.</p>

      <h2>Cuándo se necesita</h2>
      <ul>
        <li><strong>Si tu vehículo lo pide:</strong> SUV, utilitarios y autos pesados de fábrica suelen traer XL.</li>
        <li><strong>Si cargás mucho:</strong> viajes con equipaje, familia y remolque.</li>
        <li><strong>Si el índice exigido solo lo cumple la versión XL</strong> de esa medida.</li>
      </ul>

      <h2>Qué pasa si ponés uno estándar</h2>
      <p>Si el vehículo exige XL o un índice de carga mayor, una cubierta estándar queda corta: puede sobrecalentarse, desgastarse antes y no ser apta para circular. Lo correcto es nunca bajar del índice de carga original; sí podés subirlo. El criterio vale para los cuatro neumáticos.</p>

      <h2>Presión</h2>
      <p>La presión correcta no es la del flanco: está en la etiqueta del parante de la puerta o en el manual, y es la que corresponde a ese auto con esa medida. Revisá los valores y no los cambies sin consultar. Y si tenés dudas con la sigla, mandanos una foto del flanco y te decimos qué lleva.</p>
      <p>Más sobre el resto del código: <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>
    </ArticleLayout>
  );
}
