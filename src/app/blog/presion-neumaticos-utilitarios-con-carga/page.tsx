import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "presion-neumaticos-utilitarios-con-carga";
const TITLE = "Presión de neumáticos en utilitarios con carga: cómo calibrar según el peso";
const SUBTITLE =
  "La presión correcta de un furgón vacío no es la misma que con la caja llena. Dónde encontrar el dato, cada cuánto controlarlo y qué pasa cuando se anda con menos aire del que corresponde.";

export const metadata: Metadata = {
  ...blogShare("presion-neumaticos-utilitarios-con-carga"),
  title: TITLE,
  description:
    "Cómo calibrar la presión de los neumáticos de un utilitario o furgón con carga: dónde está la tabla, por qué cambia con el peso, cada cuánto controlarla y los riesgos de andar con poco aire.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué presión lleva un utilitario con carga?",
    answer:
      "La que indica el fabricante para ese nivel de carga. Suele estar en la calcomanía del marco de la puerta del conductor o en el manual, con valores distintos para vehículo vacío y vehículo cargado. No hay un número universal: depende del modelo, la medida y el índice de carga del neumático.",
  },
  {
    question: "¿Se mide la presión en frío o en caliente?",
    answer:
      "En frío: con el vehículo parado al menos un par de horas o tras recorrer pocos kilómetros. Después de andar el aire se calienta y marca más presión, y si se descarga para igualar el valor de fábrica queda el neumático desinflado.",
  },
  {
    question: "¿Cada cuánto hay que controlar la presión?",
    answer:
      "Cada 15 días como mínimo en un vehículo de trabajo, y siempre antes de un viaje con carga. Los neumáticos pierden aire de forma natural y un vehículo cargado es mucho más sensible a la falta de presión.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-10-10"
      readingMinutes={5}
      faqs={FAQS}
    >
      <p>
        En un auto de pasajeros, la presión de fábrica casi no se mueve. En un utilitario o furgón sí: el
        peso que lleva sobre el eje cambia mucho entre un día vacío y uno a pleno, y la presión tiene que
        acompañarlo. Calibrar bien es lo más barato que se puede hacer por la vida útil de las cubiertas.
      </p>

      <h2>Dónde encontrar el dato</h2>
      <p>
        En la <strong>calcomanía del marco de la puerta del conductor</strong> o en el manual del vehículo.
        Muchos utilitarios traen una tabla con la presión para cada medida y cada nivel de carga. Esa tabla,
        no lo que dice el flanco del neumático, es la referencia: el número del flanco es la presión
        máxima del neumático, no la recomendada para tu vehículo.
      </p>

      <h2>Por qué cambia con la carga</h2>
      <p>
        Un neumático se apoya en el piso sobre una huella; cuanto más peso, más se aplasta. La presión es lo
        que sostiene esa carga. Con la caja llena y poca presión, el flanco se flexiona de más, se calienta y
        se desgasta la banda por los bordes. Con carga y presión correcta, el neumático trabaja en su rango.
      </p>

      <h2>Qué pasa con poco aire</h2>
      <ul>
        <li>
          <strong>Desgaste acelerado</strong> en los hombros de la banda.
        </li>
        <li>
          <strong>Calentamiento</strong> del flanco, que puede terminar en rotura con el vehículo cargado.
        </li>
        <li>
          <strong>Más consumo</strong> de combustible, porque aumenta la resistencia a la rodadura.
        </li>
        <li>
          <strong>Peor respuesta</strong> en curvas y frenadas.
        </li>
      </ul>

      <h2>Cómo hacerlo bien</h2>
      <ol>
        <li>Medí en frío, antes de salir.</li>
        <li>Usá la presión de la tabla para el nivel de carga del día.</li>
        <li>Controlá también el neumático de auxilio.</li>
        <li>Revisá las válvulas y los tapones: una válvula en mal estado pierde aire.</li>
      </ol>
      <p>
        En nuestro local de Argüello cambiamos las válvulas sin cargo al colocar tus cubiertas. Para una
        alineación y un balanceo al cambiar el juego mirá{" "}
        <Link href="/blog/alineacion-y-balanceo">esta nota</Link>, y las medidas de carga que tenemos en{" "}
        <Link href="/neumaticos/carga">neumáticos de carga</Link>. Más sobre presión en general:{" "}
        <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link>.
      </p>
    </ArticleLayout>
  );
}
