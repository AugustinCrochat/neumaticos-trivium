import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cuanto-tarda-alineado-y-balanceado";
const TITLE = "¿Cuánto tarda el alineado y balanceado? Tiempos para auto y camioneta";
const SUBTITLE =
  "Unos 50 minutos para un auto y alrededor de una hora y veinte para una camioneta. Qué incluye ese tiempo y qué lo alarga.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cuánto tarda el alineado y balanceado completo: unos 50 minutos en un auto y alrededor de 1 hora 20 en una camioneta. Qué se hace en ese tiempo, cuánto demora cada servicio por separado y qué lo alarga."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuánto tarda el alineado y balanceado de un auto?",
    answer:
      "En general, unos 50 minutos para el servicio completo, con las cuatro ruedas alineadas y balanceadas. Es un valor orientativo: depende del estado del auto y de lo que haya que ajustar.",
  },
  {
    question: "¿Y en una camioneta?",
    answer:
      "Alrededor de una hora y veinte. Las ruedas son más grandes y pesadas, hay más trabajo de balanceo y la suspensión suele requerir más tiempo de ajuste.",
  },
  {
    question: "¿Cuánto tarda solo el alineado o solo el balanceado?",
    answer:
      "Cada uno por separado lleva menos que el combo. A modo de referencia, en un auto el alineado ronda la media hora y el balanceado unos veinte minutos; en una camioneta, el alineado cerca de tres cuartos de hora y el balanceado algo más de media hora. Son estimaciones y varían según el caso.",
  },
  {
    question: "¿Qué hace que tarde más?",
    answer:
      "Una suspensión con piezas gastadas que hay que revisar, tuercas o tornillos de ajuste trabados, llantas con mucho barro, tuercas de seguridad que requieren la llave especial o la necesidad de rebalancear más de una vez por una pesa mal ubicada.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-27" readingMinutes={4} faqs={FAQS}>
      <p>Una de las preguntas que más se repiten antes de ir a una gomería es cuánto tiempo se va a perder. En nuestro taller, el alineado y balanceado completo de un <strong>auto lleva unos 50 minutos</strong> y el de una <strong>camioneta, alrededor de una hora y veinte</strong>. Es lo que suele tardar en condiciones normales; acá van los detalles de qué entra en ese tiempo y qué lo mueve.</p>

      <h2>Tiempos de referencia</h2>
      <table>
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Auto</th>
            <th>Camioneta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Alineado y balanceado completo</strong></td>
            <td>Unos 50 minutos</td>
            <td>Alrededor de 1 hora 20</td>
          </tr>
          <tr>
            <td>Solo alineado (estimado)</td>
            <td>Cerca de media hora</td>
            <td>Cerca de 45 minutos</td>
          </tr>
          <tr>
            <td>Solo balanceado (estimado)</td>
            <td>Unos 20 minutos</td>
            <td>Algo más de media hora</td>
          </tr>
        </tbody>
      </table>
      <p>Los tiempos del servicio completo son los habituales del taller; los de cada servicio por separado son estimaciones a partir de ellos. Un utilitario o una pickup chica suele caer entre las dos columnas. Si venís por cambio de neumáticos, a esto se suma el tiempo del arme y desarme, que depende de la cantidad de cubiertas.</p>

      <h2>Qué se hace en ese tiempo</h2>
      <ol>
        <li><strong>Revisión previa.</strong> Se mira la presión, el estado de los neumáticos y que la suspensión y la dirección no tengan juego. Si hay una pieza floja, el alineado no se sostiene.</li>
        <li><strong>Medición.</strong> El auto sube al elevador y se mide con la alineadora 3D: <Link href="/blog/que-mide-una-alineadora-convergencia-caida-avance">convergencia, caída y avance</Link> en las cuatro ruedas, contra la ficha del fabricante.</li>
        <li><strong>Ajuste.</strong> Se corrige lo que esté fuera de tolerancia y se vuelve a medir.</li>
        <li><strong>Balanceo.</strong> Se desmontan las ruedas, se miden en la balanceadora y se colocan los contrapesos: <Link href="/blog/pesas-de-balanceo-por-que-se-caen">cómo funcionan las pesas</Link>.</li>
        <li><strong>Montaje y control final.</strong> Se vuelven a colocar las ruedas con el ajuste correcto y se verifica el resultado.</li>
      </ol>

      <h2>Qué lo alarga</h2>
      <ul>
        <li><strong>Piezas gastadas o flojas</strong> en la suspensión o la dirección, que hay que revisar antes de alinear.</li>
        <li><strong>Tornillos de ajuste trabados</strong> por óxido o barro, frecuentes en autos con muchos años o caminos de tierra.</li>
        <li><strong>Tuercas de seguridad</strong> cuya llave no está a mano: <Link href="/blog/tuercas-y-bulones-de-seguridad">cómo funcionan</Link>. Traer la llave ahorra tiempo.</li>
        <li><strong>Llantas muy sucias</strong> o con pesas viejas pegadas que hay que quitar y limpiar.</li>
        <li><strong>Un auto que llega con varios problemas a la vez</strong>, como <Link href="/blog/auto-tira-para-un-lado-causas">tira para un lado</Link> y <Link href="/blog/volante-vibra-causas-y-solucion">vibra el volante</Link>.</li>
      </ul>

      <h2>Para venir con el tiempo justo</h2>
      <ul>
        <li>Si tenés tuercas antirrobo, traé la llave.</li>
        <li>Contá qué síntoma notás: ayuda a ir directo a la causa.</li>
        <li>Si venís a cambiar neumáticos, hacé todo en una sola visita: <Link href="/blog/cada-cuantos-km-alinear-y-balancear">cuándo conviene alinear y balancear</Link>.</li>
      </ul>
      <p>Para ver el servicio y sus precios: <Link href="/servicios/alineacion">alineado</Link> y <Link href="/servicios/balanceo">balanceado</Link>.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
