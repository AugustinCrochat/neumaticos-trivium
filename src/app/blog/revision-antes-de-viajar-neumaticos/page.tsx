import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "revision-antes-de-viajar-neumaticos";
const TITLE = "Revisión de neumáticos antes de viajar: checklist para ruta y vacaciones";
const SUBTITLE =
  "Presión con carga, dibujo, edad, rueda de auxilio y tuerca de seguridad: lo que hay que mirar una semana antes de salir, no en la banquina.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Checklist para revisar los neumáticos antes de un viaje largo: presión con carga completa, profundidad del dibujo, edad (DOT), rueda de auxilio, llave de la tuerca antirrobo y cuándo alinear y balancear."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuánta presión llevar con el auto cargado para viajar?",
    answer:
      "La etiqueta de la puerta del auto suele indicar un valor para carga normal y otro para carga completa. Para un viaje con equipaje y todos los asientos ocupados corresponde el segundo, siempre en frío. Un neumático con poca presión trabaja caliente y es la causa más frecuente de roturas en ruta.",
  },
  {
    question: "¿Cuándo hay que revisar los neumáticos antes de salir?",
    answer:
      "Con una semana de anticipación, no el día antes. Así hay tiempo de cambiar un neumático, alinear o balancear si hace falta, sin apuros.",
  },
  {
    question: "¿Cuánto dibujo tiene que quedar para viajar?",
    answer:
      "El límite legal es 1,6 mm, pero para ruta y lluvia conviene que queden al menos 3 mm. Si están cerca del límite, es mejor cambiarlos antes de salir que en el camino.",
  },
  {
    question: "¿Hace falta alinear y balancear antes de viajar?",
    answer:
      "Si hace más de un año o más de 10.000 km que no lo hacés, o si el auto tira o vibra, sí. Una ruta larga a velocidad sostenida amplifica cualquier desbalance o desalineación.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-11-20" readingMinutes={5} faqs={FAQS}>
      <p>Un neumático que está bien para ir al trabajo puede no estarlo para mil kilómetros de ruta con el auto cargado, a velocidad constante y con calor. Una revisión de diez minutos, con una semana de margen, evita la mayoría de los problemas que arruinan un viaje.</p>

      <h2>Checklist: una semana antes</h2>
      <ol>
        <li><strong>Presión, en frío y con valor de carga.</strong> Usá el valor de carga completa de la <Link href="/blog/etiqueta-de-presion-puerta-del-auto">etiqueta de la puerta</Link>. Medí las cuatro y la de auxilio. Detalle en <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link>.</li>
        <li><strong>Dibujo.</strong> Mirá los testigos de las canaladuras. Para ruta y lluvia, lo ideal es más de 3 mm: <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cuándo cambiar</Link>.</li>
        <li><strong>Edad.</strong> Un neumático con muchos años puede resecarse aunque tenga dibujo: <Link href="/blog/antiguedad-del-neumatico-codigo-dot">cómo leer el código DOT</Link>.</li>
        <li><strong>Flancos y banda.</strong> Cortes, grietas, bultos o clavos. Una <Link href="/blog/burbuja-en-el-flanco-del-neumatico">burbuja</Link> es motivo de cambio inmediato.</li>
        <li><strong>Rueda de auxilio, gato y llave.</strong> Presión de la rueda, y que el gato y la llave funcionen: <Link href="/blog/rueda-de-auxilio-como-revisarla">cómo revisarla</Link>. Y si tenés <Link href="/blog/tuercas-y-bulones-de-seguridad">tuercas de seguridad</Link>, verificá que la llave especial esté en el auto.</li>
        <li><strong>Alineado y balanceado.</strong> Si pasó más de un año o 10.000 km, o si el auto tira o vibra: <Link href="/blog/cada-cuantos-km-alinear-y-balancear">cada cuántos km</Link>.</li>
      </ol>

      <h2>Qué hacer si algo falla</h2>
      <table>
        <thead>
          <tr>
            <th>Encontraste</th>
            <th>Qué conviene</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dibujo cerca del testigo</td>
            <td>Cambiar el juego antes de salir; para ruta, mejor los cuatro o al menos el eje.</td>
          </tr>
          <tr>
            <td>Neumático con burbuja o corte</td>
            <td>Cambiarlo, no se repara.</td>
          </tr>
          <tr>
            <td>Pierde aire</td>
            <td>Revisarlo en el taller: <Link href="/blog/neumatico-que-pierde-aire-solo-causas">causas habituales</Link>.</td>
          </tr>
          <tr>
            <td>Auto que tira o vibra</td>
            <td><Link href="/blog/auto-tira-para-un-lado-causas">Alineado</Link> o <Link href="/blog/volante-vibra-causas-y-solucion">balanceado</Link>.</td>
          </tr>
        </tbody>
      </table>

      <h2>En el camino</h2>
      <ul>
        <li>Revisá la presión en la primera parada, con los neumáticos fríos si es posible.</li>
        <li>No saques aire a un neumático caliente para &quot;bajar la presión&quot;: es normal que suba al rodar.</li>
        <li>Con el auto cargado, controlá la velocidad: la carga y el calor se suman.</li>
      </ul>
      <p>Para las rutas de montaña, como las de Córdoba, hay más para tener en cuenta: <Link href="/blog/neumaticos-sierras-de-cordoba">neumáticos para las sierras de Córdoba</Link>. Si hay que cambiar un juego antes de salir, mirá el <Link href="/catalogo">catálogo</Link> o las <Link href="/ofertas">ofertas</Link>.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
