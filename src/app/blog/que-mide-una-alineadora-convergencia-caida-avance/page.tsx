import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "que-mide-una-alineadora-convergencia-caida-avance";
const TITLE = "Qué mide una alineadora: convergencia, caída y avance explicados simple";
const SUBTITLE =
  "Los ángulos que corrige el alineado, qué significa cada uno, cuáles se pueden ajustar y cómo leer el informe antes y después.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué mide una alineadora: convergencia (toe), caída (camber) y avance (caster), y otros ángulos del eje trasero. Qué significa cada uno, qué se puede ajustar y cómo leer el informe.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué ángulos mide una alineadora?",
    answer:
      "Los principales son la convergencia (toe), la caída (camber) y el avance (caster). Además mide el ángulo de empuje del eje trasero, que indica hacia dónde empuja el auto, y otros valores de la dirección según el equipo.",
  },
  {
    question: "¿Todos los ángulos se pueden ajustar?",
    answer:
      "No siempre. La convergencia se ajusta en casi todos los autos. La caída y el avance dependen del diseño de la suspensión: en muchos modelos no tienen ajuste de fábrica, y si están fuera de parámetro indica una pieza doblada o gastada.",
  },
  {
    question: "¿Contra qué valores se compara?",
    answer:
      "Contra la ficha del fabricante de cada modelo, que define el valor ideal y la tolerancia. Por eso el equipo cuenta con una base de datos de vehículos.",
  },
  {
    question: "¿Por qué piden un informe antes y después?",
    answer:
      "Porque muestra qué estaba mal y qué quedó corregido, con los valores medidos. Es la forma de comprobar que el trabajo se hizo.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-10" readingMinutes={6} faqs={FAQS}>
      <p>Una alineadora no &quot;alinea&quot; por sí misma: mide con precisión los ángulos con los que la suspensión sostiene cada rueda, los compara con los valores que el fabricante define para tu modelo y le indica al técnico cuánto y hacia dónde corregir. Entender esos ángulos te permite leer el informe y saber qué se está arreglando.</p>

      <h2>Los tres ángulos principales</h2>
      <table>
        <thead>
          <tr>
            <th>Ángulo</th>
            <th>Cómo se ve</th>
            <th>Qué pasa si está mal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Convergencia</strong> (toe)</td>
            <td>Las ruedas vistas desde arriba: ¿apuntan un poco hacia adentro o hacia afuera?</td>
            <td>Desgaste en pluma o escalones, volante torcido, el auto &quot;nervioso&quot;.</td>
          </tr>
          <tr>
            <td><strong>Caída</strong> (camber)</td>
            <td>La inclinación de la rueda vista de frente: ¿se abre o se cierra en la parte de arriba?</td>
            <td>Desgaste concentrado en un solo borde del neumático, el auto tira hacia el lado más inclinado.</td>
          </tr>
          <tr>
            <td><strong>Avance</strong> (caster)</td>
            <td>La inclinación del eje de dirección vista de costado.</td>
            <td>Dirección pesada o inestable, volante que no vuelve solo al centro.</td>
          </tr>
        </tbody>
      </table>
      <p>La convergencia es la que más se desajusta y la que más rápido gasta neumáticos: unos pocos milímetros de diferencia entre la parte delantera y trasera de las ruedas alcanzan para arrastrar la banda por el asfalto a medida que el auto avanza.</p>

      <h2>Los del eje trasero</h2>
      <p>La alineación no es solo cosa de adelante. En los cuatro neumáticos se miden convergencia y caída, y se calcula el <strong>ángulo de empuje</strong>: la dirección en la que empuja el eje trasero respecto del centro del auto. Si no es cero, el auto avanza un poco en diagonal (&quot;como un cangrejo&quot;) y obliga a mantener el volante levemente girado para ir derecho.</p>

      <h2>Qué se ajusta y qué no</h2>
      <ul>
        <li><strong>Convergencia:</strong> casi siempre ajustable, con los terminales de dirección en el eje delantero y con tornillos excéntricos o bielas en el trasero.</li>
        <li><strong>Caída y avance:</strong> depende del modelo. En muchos autos no tienen ajuste de fábrica; si están fuera de tolerancia, no se &quot;regulan&quot;, sino que apuntan a una pieza doblada o gastada (un golpe fuerte, un buje, una rótula).</li>
        <li><strong>Lo que el equipo no corrige:</strong> una suspensión con juego. Si las piezas están flojas, el auto se alinea en el taller y se desalinea en la calle. Por eso el técnico primero revisa que la suspensión esté en condiciones.</li>
      </ul>

      <h2>Cómo leer el informe antes y después</h2>
      <p>Un informe típico lista cada ángulo en cada rueda con tres cosas: el valor medido, el valor de referencia del fabricante y la tolerancia. Lo que importa mirar:</p>
      <ol>
        <li>Que los valores &quot;antes&quot; que estaban fuera de tolerancia estén resaltados.</li>
        <li>Que los valores &quot;después&quot; estén dentro del rango en las cuatro ruedas.</li>
        <li>Que la convergencia total esté simétrica entre izquierda y derecha: un lado muy distinto del otro hace tirar el auto.</li>
      </ol>
      <p>Cómo se mide con la tecnología actual, con targets en cada rueda y sin mover el auto, lo explicamos en alineación 3D vs. alineación tradicional.</p>

      <h2>Y entonces, ¿cuándo?</h2>
      <p>Con los síntomas del auto: <Link href="/blog/auto-tira-para-un-lado-causas">si tira para un lado</Link> o después de un golpe, y como chequeo periódico, <Link href="/blog/cada-cuantos-km-alinear-y-balancear">cada cuántos kilómetros</Link>. Para ver el servicio, <Link href="/servicios/alineacion">alineado</Link>.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
