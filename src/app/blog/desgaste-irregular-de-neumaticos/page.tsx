import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "desgaste-irregular-de-neumaticos";
const TITLE = "Desgaste irregular de neumáticos: qué te dice cada patrón";
const SUBTITLE =
  "La banda de rodamiento cuenta qué le pasa al auto. Cómo reconocer cada tipo de desgaste, qué lo causa y qué corregir antes de comprar neumáticos nuevos.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo leer el desgaste de los neumáticos: bordes gastados, centro gastado, un solo lado, dientes de sierra y manchones. Causas (presión, alineación, balanceo, amortiguadores) y qué hacer.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Por qué se gasta un solo lado del neumático?",
    answer:
      "Casi siempre es un problema de alineación: el ángulo de la rueda (caída) o la convergencia está fuera de especificación y el neumático apoya más de un lado. También puede deberse a piezas de suspensión con juego. Si se corrige solo el neumático sin alinear, el problema vuelve.",
  },
  {
    question: "¿Se puede seguir usando un neumático con desgaste irregular?",
    answer:
      "Depende de cuánto. Mientras tenga dibujo por encima del mínimo legal de 1,6 mm en toda la banda y no tenga deformaciones, se puede usar, pero hay que corregir la causa. Si el desgaste ya dejó el testigo a la vista en una zona, hay que reemplazarlo.",
  },
  {
    question: "¿La rotación corrige el desgaste irregular?",
    answer:
      "Ayuda a repartirlo, pero no lo corrige ni evita que vuelva. Primero hay que encontrar y arreglar la causa (presión, alineación, balanceo o suspensión) y después mantener la rotación como rutina.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Mantenimiento" date="2026-10-24" readingMinutes={5} faqs={FAQS}>
      <p>
        Un neumático sano se gasta parejo de un borde al otro. Cuando no es así, no es mala suerte ni mala
        calidad: es una señal. Aprender a leerla te ahorra un juego entero, porque el neumático nuevo se va a
        gastar igual si no se corrige la causa.
      </p>

      <h2>Cómo mirarlo</h2>
      <p>
        Con el auto parado y el volante girado a un lado, pasá la mano por la banda de rodamiento y mirá los
        bordes interno y externo. Fijate también si los testigos de desgaste, esos tacos chicos dentro de las
        ranuras, están al ras en alguna zona. El límite legal en Argentina es de 1,6 mm de profundidad.
      </p>

      <h2>Los patrones más frecuentes</h2>
      <table>
        <thead>
          <tr>
            <th>Cómo se ve</th>
            <th>Causa más probable</th>
            <th>Qué hacer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Los dos bordes gastados, centro sano</td>
            <td>Presión baja</td>
            <td>Corregir la presión y revisarla todos los meses</td>
          </tr>
          <tr>
            <td>Centro gastado, bordes sanos</td>
            <td>Presión alta</td>
            <td>Bajar a la presión indicada para el auto</td>
          </tr>
          <tr>
            <td>Un solo borde gastado (interno o externo)</td>
            <td>Alineación (caída o convergencia)</td>
            <td>Alinear; revisar la suspensión</td>
          </tr>
          <tr>
            <td>Dibujo en «plumas» o dientes de sierra al pasar la mano</td>
            <td>Convergencia fuera de especificación</td>
            <td>Alinear</td>
          </tr>
          <tr>
            <td>Manchones o zonas hundidas que suben y bajan</td>
            <td>Amortiguadores gastados o rueda desbalanceada</td>
            <td>Revisar amortiguadores y balancear</td>
          </tr>
          <tr>
            <td>Zona plana localizada</td>
            <td>Frenada fuerte con bloqueo</td>
            <td>Evaluar si queda vibración; reemplazar si es marcada</td>
          </tr>
        </tbody>
      </table>

      <Callout title="Un detalle que ayuda" tone="info">
        <p>
          Si el desgaste es distinto entre las ruedas delanteras y las traseras, es normal: cada eje trabaja
          distinto. Por eso se recomienda <Link href="/blog/rotacion-de-neumaticos">rotar las ruedas</Link> con
          regularidad.
        </p>
      </Callout>

      <h2>Presión, alineación y balanceo: el orden de revisión</h2>
      <ol>
        <li>
          <strong>Presión.</strong> Es lo más simple y la causa más común. Medila en frío:{" "}
          <Link href="/blog/presion-de-neumaticos">acá cómo</Link>.
        </li>
        <li>
          <strong>Alineación.</strong> Si el desgaste está en un borde o hay «plumas», alineá antes de cambiar los
          neumáticos. Mirá <Link href="/blog/alineacion-y-balanceo">la diferencia con el balanceo</Link>.
        </li>
        <li>
          <strong>Suspensión.</strong> Amortiguadores, bujes y rótulas con juego impiden que la alineación se mantenga.
        </li>
        <li>
          <strong>Balanceo.</strong> Una rueda desbalanceada gasta de forma irregular y hace vibrar el volante.
        </li>
      </ol>

      <h2>Cuándo cambiarlos</h2>
      <p>
        Si el desgaste ya llegó al testigo en cualquier punto de la banda, es momento de cambiar. Podés
        calcularlo con la herramienta{" "}
        <Link href="/herramientas/cuando-cambiar-neumaticos">cuándo cambiar los neumáticos</Link> o leer{" "}
        <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cada cuántos kilómetros conviene</Link>. Y al
        colocar los nuevos, corregí primero la causa: <Link href="/servicios">alineación y balanceo en el local</Link>.
      </p>
    </ArticleLayout>
  );
}
