import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-direccionales-y-asimetricos-como-se-montan";
const TITLE = "Neumáticos direccionales y asimétricos: cómo se montan y cómo reconocerlos";
const SUBTITLE =
  "La flecha en el flanco, las palabras INSIDE y OUTSIDE y qué cambia al colocarlos o rotarlos. Cómo saber qué tipo tenés y qué pasa si se montan al revés.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo reconocer un neumático direccional, asimétrico o simétrico, cómo se montan (flecha, INSIDE y OUTSIDE), qué pasa si quedan al revés y cómo se rotan sin errores.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cómo sé si un neumático es direccional?",
    answer:
      "Tiene una flecha en el flanco, muchas veces junto a la palabra ROTATION o DIRECTION, que indica el sentido de giro. El dibujo suele tener forma de V o de espina de pescado que apunta hacia adelante.",
  },
  {
    question: "¿Y si es asimétrico?",
    answer:
      "En el flanco dice OUTSIDE (exterior) e INSIDE (interior). El dibujo cambia entre un lado y otro de la banda, y la cara que dice OUTSIDE tiene que quedar hacia afuera del auto. Se puede usar en cualquier lado del auto mientras se respete eso.",
  },
  {
    question: "¿Qué pasa si se monta un direccional al revés?",
    answer:
      "Pierde buena parte de lo que lo hace direccional: el drenaje de agua es peor, hay más riesgo de aquaplaning y puede hacer más ruido. Es un error de montaje, no de la cubierta.",
  },
  {
    question: "¿Y si una asimétrica queda con el lado interior hacia afuera?",
    answer:
      "El diseño del dibujo y los materiales de cada lado están pensados para trabajar en un sentido. Al revés, el agarre en curva y sobre mojado empeora y el desgaste se vuelve desparejo.",
  },
  {
    question: "¿Se pueden rotar los direccionales?",
    answer:
      "Sí, pero solo entre adelante y atrás del mismo lado, sin cruzarlos. Para cruzarlos hay que desmontar la cubierta de la llanta y volver a montarla en el otro sentido, algo que se hace en la gomería.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-27" readingMinutes={5} faqs={FAQS}>
      <p>
        No todos los neumáticos se pueden colocar de cualquier manera. Algunos tienen un sentido de giro
        y otros un lado que va hacia afuera del auto. Si se montan mal, pierden las prestaciones para
        las que fueron diseñados, y eso solo se nota cuando llueve fuerte, que es justo cuando más importa.
      </p>

      <Callout title="Cómo reconocerlos en 10 segundos" tone="ok">
        <p>
          <strong>Flecha o palabra ROTATION</strong> en el flanco: direccional.{" "}
          <strong>INSIDE / OUTSIDE</strong>: asimétrico. Si no tiene nada de eso, es simétrico y se puede
          montar en cualquier posición.
        </p>
      </Callout>

      <h2>Los tres tipos de dibujo</h2>
      <table>
        <thead>
          <tr><th>Tipo</th><th>Cómo se ve</th><th>Qué se respeta al montar</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Simétrico</strong></td><td>Dibujo igual a ambos lados del centro</td><td>Nada: va en cualquier posición</td></tr>
          <tr><td><strong>Direccional</strong></td><td>Dibujo en V; flecha en el flanco</td><td>Que gire en el sentido de la flecha</td></tr>
          <tr><td><strong>Asimétrico</strong></td><td>Dibujo distinto en el lado interior y exterior; INSIDE y OUTSIDE</td><td>Que la cara OUTSIDE mire hacia afuera</td></tr>
        </tbody>
      </table>

      <h2>Qué pasa si quedan al revés</h2>
      <ul>
        <li>
          <strong>Direccional invertido:</strong> el dibujo evacúa peor el agua. Con piso mojado crece el
          riesgo de aquaplaning y el frenado empeora.
        </li>
        <li>
          <strong>Asimétrico invertido:</strong> el lado diseñado para soportar el esfuerzo de las curvas
          queda del lado equivocado, con menos agarre y más desgaste en el hombro.
        </li>
        <li>
          <strong>Más ruido y vibración</strong> en ambos casos.
        </li>
      </ul>

      <h2>Rotación y montaje</h2>
      <p>
        Con neumáticos direccionales, la rotación es solo de adelante hacia atrás del mismo lado. Con
        asimétricos, se puede cruzar de lado en el esquema habitual porque el exterior sigue mirando hacia
        afuera, siempre que el montaje en la llanta sea el correcto. El esquema según tu tracción está en la{" "}
        <Link href="/blog/rotacion-de-neumaticos">guía de rotación</Link>.
      </p>

      <h2>Si cambiás solo dos</h2>
      <p>
        El eje trasero lleva los nuevos, y deben ser iguales entre sí (<Link href="/blog/neumaticos-nuevos-adelante-o-atras">por qué atrás</Link>).
        Con direccionales, el montaje en la desmontadora tiene que respetar el sentido de giro según el lado
        del auto donde va cada rueda.
      </p>

      <h2>Pedí que lo verifiquen</h2>
      <p>
        Al colocar cubiertas nuevas, preguntá si son direccionales o asimétricas y mirá la flecha o las
        palabras antes de que la rueda se coloque en el auto. Es una verificación de 10 segundos que
        evita uno de los errores de montaje más comunes. Más sobre qué se hace en un buen{" "}
        <Link href="/blog/arme-y-desarme-de-neumaticos">arme y desarme</Link>.
      </p>

      <h2>Neumáticos en Trivium</h2>
      <p>
        Encontrá tu medida en el <Link href="/catalogo">catálogo</Link>. Si tenés dudas sobre el tipo de
        dibujo de tu juego actual, traé el auto o mandanos una foto del flanco por WhatsApp.
      </p>
    </ArticleLayout>
  );
}
