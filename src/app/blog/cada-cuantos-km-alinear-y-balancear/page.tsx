import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cada-cuantos-km-alinear-y-balancear";
const TITLE = "¿Cada cuántos kilómetros alinear y balancear? Los intervalos y las excepciones";
const SUBTITLE =
  "Una referencia por kilómetros y por tiempo, y los casos en que no hay que esperar: golpes, cambio de neumáticos, suspensión y uso exigente.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cada cuántos kilómetros alinear y balancear el auto: referencia de 10.000 km o un año, y los casos que lo adelantan (golpes, neumáticos nuevos, suspensión, taxis y remises).",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cada cuántos kilómetros hay que alinear el auto?",
    answer:
      "Como referencia, cada 10.000 km o una vez por año, lo que ocurra primero. Es un intervalo orientativo: el manual de tu auto puede indicar otro, y un golpe fuerte o un cambio de suspensión lo adelantan.",
  },
  {
    question: "¿Y el balanceo, cada cuánto?",
    answer:
      "Siempre que se monta un neumático, y como control periódico similar al de la alineación. También corresponde si cayó una pesa, después de reparar una pinchadura o si aparece una vibración a cierta velocidad.",
  },
  {
    question: "¿Hay que alinear con neumáticos nuevos?",
    answer:
      "Es el mejor momento. Si el tren venía desalineado y no se corrige, el juego nuevo empieza a desgastarse mal desde el primer kilómetro. El balanceo, en cambio, es obligatorio siempre que se monta un neumático.",
  },
  {
    question: "¿Sirve alinear con neumáticos ya muy gastados?",
    answer:
      "Sirve para que no sigan gastándose mal, pero no repara el desgaste que ya tienen. Si están muy desparejos, quizá convenga cambiarlos y alinear junto con el cambio.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-06" readingMinutes={5} faqs={FAQS}>
      <p>No existe un número universal que valga para todos los autos y todas las calles. Lo que sí hay es una referencia razonable y una lista de situaciones que la adelantan. Si conocés las dos, sabés cuándo ir sin que te lo pida el síntoma.</p>

      <h2>La referencia</h2>
      <p>Alinear y balancear cada <strong>10.000 kilómetros o una vez por año</strong>, lo que pase primero. Es el criterio que usamos como punto de partida; el manual de tu auto puede dar otro y manda sobre esto. Para la mayoría de los autos de uso particular alcanza como chequeo preventivo.</p>

      <h2>Lo que lo adelanta</h2>
      <table>
        <thead>
          <tr>
            <th>Situación</th>
            <th>Alineación</th>
            <th>Balanceo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cambio de neumáticos</td>
            <td>Recomendada</td>
            <td>Obligatorio</td>
          </tr>
          <tr>
            <td>Golpe fuerte contra un pozo o cordón</td>
            <td>Sí, cuanto antes</td>
            <td>Conviene revisar</td>
          </tr>
          <tr>
            <td>Trabajo en suspensión o dirección (amortiguadores, rótulas, terminales)</td>
            <td>Siempre</td>
            <td>No hace falta</td>
          </tr>
          <tr>
            <td>Calles con muchos pozos o uso en caminos de tierra</td>
            <td>Más seguido que la referencia</td>
            <td>Si aparece vibración</td>
          </tr>
          <tr>
            <td>Taxis, remises y autos de trabajo</td>
            <td>Más seguido: muchos km por mes</td>
            <td>Más seguido</td>
          </tr>
          <tr>
            <td>Cambio de suspensión (kit de elevación, rebaje)</td>
            <td>Siempre</td>
            <td>No hace falta</td>
          </tr>
          <tr>
            <td>Se cayó una pesa de balanceo</td>
            <td>No hace falta</td>
            <td>Sí</td>
          </tr>
          <tr>
            <td>Rotación de ruedas</td>
            <td>No hace falta</td>
            <td>Recomendable</td>
          </tr>
        </tbody>
      </table>

      <h2>Cuánto tiempo calcular</h2>
      <p>Para los autos de trabajo, el kilometraje se acumula rápido y lo razonable es medir en meses y no en kilómetros: <Link href="/blog/como-hacer-durar-los-neumaticos-de-taxis-y-remises">cómo hacer durar los neumáticos de taxis y remises</Link>. Para quien maneja poco, el criterio del año importa más que el de los kilómetros, porque con el tiempo también se aflojan y desajustan las piezas.</p>

      <h2>Señales de que ya te pasaste</h2>
      <ul>
        <li>El auto <Link href="/blog/auto-tira-para-un-lado-causas">tira para un lado</Link> o el volante queda torcido.</li>
        <li>Un borde del neumático se gasta más que el otro: <Link href="/blog/desgaste-irregular-de-neumaticos">desgaste irregular</Link>.</li>
        <li>El <Link href="/blog/volante-vibra-causas-y-solucion">volante vibra</Link> a cierta velocidad.</li>
      </ul>

      <h2>La combinación que más rinde</h2>
      <p>Cuando cambiás neumáticos, lo más eficiente es hacer las dos cosas en la misma visita y rotar después según el calendario: <Link href="/blog/rotacion-de-neumaticos">cada cuánto rotar</Link>. El detalle de qué corrige cada servicio está en la guía de <Link href="/blog/alineacion-y-balanceo">alineado y balanceado</Link>.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
