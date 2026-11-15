import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-gastados-cuanto-mas-tarda-en-frenar-el-auto";
const TITLE = "Neumáticos gastados: por qué el auto tarda más en frenar con lluvia";
const SUBTITLE =
  "El dibujo no está para agarrar en seco sino para sacar el agua. Qué pasa cuando le quedan pocos milímetros.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Por qué un neumático gastado frena peor en mojado: para qué sirve el dibujo, el límite legal de 1,6 mm, cuándo conviene cambiar antes y cómo medir la profundidad."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuál es el mínimo legal de dibujo?",
    answer:
      "1,6 mm de profundidad. Por debajo de eso el neumático no es apto para circular. Los testigos moldeados en el fondo de los canales quedan al ras de la banda cuando se llega a ese límite.",
  },
  {
    question: "¿Conviene cambiar antes de llegar a 1,6 mm?",
    answer:
      "Sí, si manejás seguido con lluvia o en ruta. El rendimiento en mojado empieza a caer bastante antes del límite, y muchos fabricantes recomiendan cambiar alrededor de los 3 mm.",
  },
  {
    question: "¿Un neumático gastado frena mal en seco?",
    answer:
      "En seco la diferencia es chica: hay más goma en contacto con el asfalto. El problema aparece cuando hay agua, porque los canales ya no tienen lugar para sacarla.",
  },
  {
    question: "¿Cómo mido la profundidad?",
    answer:
      "Con un profundímetro, o mirando los testigos de desgaste: pequeños resaltos en el fondo de los canales principales. Si la banda llegó a su altura, hay que cambiar.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-12-03" readingMinutes={4} faqs={FAQS}>
      <p>Un neumático liso, en seco, agarra bien: por eso los autos de carrera usan cubiertas sin dibujo cuando no llueve. El dibujo de un neumático de calle existe por otra razón: <strong>sacar el agua</strong> de abajo de la rueda para que la goma toque el asfalto.</p>

      <h2>Qué hace el dibujo cuando llueve</h2>
      <p>Los canales funcionan como desagües. A medida que la rueda avanza, el agua entra en ellos y sale hacia los costados y hacia atrás. Mientras los canales tengan profundidad, hay lugar para esa agua. Cuando el neumático se gasta, el canal es cada vez más chico: a la misma velocidad y con la misma lluvia, llega un punto en que <strong>el agua no entra</strong> y la rueda empieza a apoyarse sobre una película líquida.</p>
      <p>El caso extremo es el <Link href="/blog/aquaplaning-que-es-y-como-evitarlo">aquaplaning</Link>, cuando la rueda directamente flota. Pero mucho antes de eso ya se perdió agarre: el auto necesita más metros para frenar y se va de trompa en las curvas mojadas.</p>

      <h2>El límite legal y el límite sensato</h2>
      <table>
        <thead><tr><th>Profundidad</th><th>Situación</th></tr></thead>
        <tbody>
          <tr><td>Nuevo (alrededor de 8 mm)</td><td>Máxima capacidad de evacuar agua</td></tr>
          <tr><td>4 mm</td><td>Media vida: en seco no se nota, en mojado ya frena algo peor</td></tr>
          <tr><td>3 mm</td><td>Punto en que muchos fabricantes recomiendan cambiar</td></tr>
          <tr><td>1,6 mm</td><td>Límite legal: no apto para circular</td></tr>
        </tbody>
      </table>
      <p>El último milímetro y medio antes del límite es el que más se paga en frenada bajo lluvia. Estirar un neumático hasta los testigos ahorra unos meses y cuesta agarre justo cuando más hace falta.</p>

      <h2>No es solo la profundidad</h2>
      <ul>
        <li><strong>La goma envejece.</strong> Con los años el compuesto se endurece y agarra menos aunque le sobre dibujo: <Link href="/blog/antiguedad-del-neumatico-codigo-dot">cómo leer la fecha de fabricación</Link>.</li>
        <li><strong>El desgaste desparejo engaña.</strong> Un neumático con el centro sano y un borde liso está en el límite: cuenta el punto más gastado.</li>
        <li><strong>La presión baja empeora todo.</strong> La banda se deforma y los canales se cierran.</li>
      </ul>

      <h2>Cómo saber dónde estás parado</h2>
      <p>Buscá los testigos en el fondo de los canales o usá la herramienta <Link href="/herramientas/cuando-cambiar-neumaticos">¿cuándo cambiar mis neumáticos?</Link>, que combina dibujo, antigüedad y kilómetros. La referencia completa de plazos está en <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cada cuántos kilómetros cambiar los neumáticos</Link>. Si te toca cambiar, <Link href="/neumaticos">buscá tu medida</Link> y mirá precio y stock; los colocamos en el momento.</p>
    </ArticleLayout>
  );
}
