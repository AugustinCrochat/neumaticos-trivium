import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-resecos-o-cristalizados-como-reconocerlos";
const TITLE = "Neumáticos resecos o cristalizados: cómo reconocerlos y cuándo cambiarlos";
const SUBTITLE =
  "Grietas finas, goma dura y brillo: las señales de que la cubierta envejeció aunque le sobre dibujo.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cómo reconocer un neumático reseco o cristalizado: grietas en el flanco y entre los tacos, goma endurecida, causas y cuándo hay que cambiarlo aunque tenga dibujo."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es un neumático cristalizado?",
    answer:
      "Es una forma de llamar al neumático cuya goma se endureció con los años, el sol y el calor. Pierde elasticidad, agarra menos, sobre todo en mojado, y aparecen grietas finas en la superficie.",
  },
  {
    question: "¿Puedo seguir usando una cubierta con grietas chicas?",
    answer:
      "Las grietas superficiales y muy finas indican envejecimiento y conviene hacerlas revisar. Si son profundas, dejan ver la tela o están en el flanco junto con deformaciones, hay que cambiar el neumático.",
  },
  {
    question: "¿Los productos para dar brillo evitan que se resequen?",
    answer:
      "No reemplazan el cuidado básico y algunos, con solventes, pueden resecar más la goma. Lo que más protege es no dejar el auto meses al sol sin moverlo y mantener la presión.",
  },
  {
    question: "¿Cuántos años dura un neumático?",
    answer:
      "Depende del uso y de cómo se guardó, pero pasados unos cinco o seis años conviene revisarlo todos los años aunque tenga dibujo. La fecha de fabricación está en el flanco.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Mantenimiento" date="2026-12-11" readingMinutes={4} faqs={FAQS}>
      <p>Un neumático no se termina solo por el dibujo. La goma es un material que envejece: con los años pierde los aceites que la mantienen flexible y se pone dura. A eso se le dice que está <strong>reseco</strong> o <strong>cristalizado</strong>, y pasa aunque el auto casi no se use.</p>

      <h2>Cómo reconocerlo</h2>
      <table>
        <thead><tr><th>Señal</th><th>Dónde mirar</th></tr></thead>
        <tbody>
          <tr><td>Grietas finas, como piel cuarteada</td><td>En el flanco y en el fondo de los canales</td></tr>
          <tr><td>Goma dura al apretarla con la uña</td><td>En los tacos de la banda</td></tr>
          <tr><td>Superficie brillosa y lisa, sin textura</td><td>En la banda de rodamiento</td></tr>
          <tr><td>Color grisáceo o parduzco</td><td>En el flanco</td></tr>
          <tr><td>Patina con facilidad en mojado</td><td>Al manejar, con dibujo de sobra</td></tr>
        </tbody>
      </table>

      <h2>Por qué pasa</h2>
      <ul>
        <li><strong>El tiempo.</strong> Es la causa principal. La edad se lee en el flanco: <Link href="/blog/antiguedad-del-neumatico-codigo-dot">cómo leer el código DOT</Link>, o directamente con el <Link href="/herramientas/codigo-dot">lector de código DOT</Link>.</li>
        <li><strong>El sol y el calor.</strong> Un auto que duerme a la intemperie envejece las cubiertas más rápido, sobre todo del lado que da al sol.</li>
        <li><strong>La falta de uso.</strong> Rodar ayuda a que la goma se mantenga flexible; un auto parado meses se reseca más y además se deforma donde apoya.</li>
        <li><strong>La presión baja.</strong> El flanco trabaja doblado y se agrieta antes.</li>
        <li><strong>Algunos productos de limpieza.</strong> Los que tienen solventes: <Link href="/blog/limpiar-neumaticos-brillo-y-productos">qué usar y qué no</Link>.</li>
      </ul>

      <h2>Por qué importa</h2>
      <p>La goma dura no se adapta al asfalto. En seco apenas se nota; en mojado el auto <strong>frena peor y patina antes</strong>, igual que con un neumático gastado, aunque tenga el dibujo entero. Y las grietas son puntos débiles: con calor, carga y velocidad pueden abrirse. Los riesgos de ruta están en <Link href="/blog/neumaticos-en-verano-calor-presion-y-ruta">neumáticos en verano</Link>.</p>

      <h2>Cuándo cambiar</h2>
      <ol>
        <li>Grietas profundas o que dejan ver la estructura: cambiar ya.</li>
        <li>Grietas en el flanco junto con una deformación: cambiar ya (<Link href="/blog/burbuja-en-el-flanco-del-neumatico">burbuja en el flanco</Link>).</li>
        <li>Goma dura y varios años encima, aunque no haya grietas grandes: hacerlo revisar y planificar el cambio.</li>
        <li>La rueda de auxilio también envejece: <Link href="/blog/rueda-de-auxilio-como-revisarla">cómo revisarla</Link>.</li>
      </ol>

      <h2>Cómo demorarlo</h2>
      <p>Presión correcta todo el año, el auto a la sombra cuando se pueda, moverlo cada tanto si se usa poco, y guardar bien las cubiertas que no estén puestas: <Link href="/blog/como-guardar-neumaticos">cómo guardar neumáticos</Link>. Si las tuyas ya están para cambiar, <Link href="/neumaticos">buscá tu medida</Link> y mirá precio y stock.</p>
    </ArticleLayout>
  );
}
