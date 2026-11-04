import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cambiar-los-cuatro-neumaticos-en-4x4-o-awd";
const TITLE = "Neumáticos en un 4x4 o AWD: por qué conviene cambiar las cuatro";
const SUBTITLE =
  "En una camioneta o un SUV con tracción integral, un neumático con distinto diámetro trabaja contra los diferenciales. Qué diferencia se tolera y qué pasa si cambiás solo dos.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cambiar neumáticos en 4x4, AWD o tracción integral: por qué se recomienda cambiar los cuatro, qué diferencia de desgaste se tolera y qué pasa con la transmisión si mezclás cubiertas."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Hay que cambiar los cuatro neumáticos en una 4x4?",
    answer:
      "Es lo más recomendable. En tracción integral las cuatro ruedas deben girar a una velocidad casi idéntica, y eso exige que tengan un diámetro muy parecido. Con un par nuevo y un par gastado, la diferencia puede forzar los diferenciales y el embrague del sistema.",
  },
  {
    question: "¿Qué diferencia de diámetro tolera una tracción integral?",
    answer:
      "Varía según el fabricante, pero suele ser de pocos milímetros de profundidad de dibujo entre cubiertas. El manual del vehículo suele indicar el límite. Ante la duda, cambiá las cuatro.",
  },
  {
    question: "¿Y si tengo una 4x4 que se conecta cuando quiero (parttime)?",
    answer:
      "Si andás casi siempre en 4x2, el problema es menor, pero al conectar la 4x4 sobre asfalto o con ruedas distintas el sistema sufre. Para usar la tracción integral en terrenos con barro o arena también importa que las cuatro agarren igual.",
  },
  {
    question: "¿Puedo rotar los neumáticos de una 4x4?",
    answer:
      "Sí, y en tracción integral es especialmente importante porque mantiene el desgaste parejo en los cuatro lados. Se hace cada 8.000 a 10.000 km, con el esquema que corresponda al tipo de cubierta.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-27" readingMinutes={5} faqs={FAQS}>
      <p>
        En una camioneta 4x4 o un SUV con tracción integral, cambiar neumáticos no es solo una cuestión
        de agarre. El sistema de transmisión está pensado para que las cuatro ruedas giren a la misma
        velocidad, y eso depende de que todas tengan casi el mismo diámetro.
      </p>

      <Callout title="La recomendación" tone="ok">
        <p>
          En tracción integral, cambiá las <strong>cuatro cubiertas</strong>. Si por presupuesto cambiás
          dos, que el resto tenga <strong>pocos milímetros de diferencia</strong> de dibujo con las
          nuevas y consultá el manual.
        </p>
      </Callout>

      <h2>Por qué importa el diámetro en una 4x4</h2>
      <p>
        Un neumático nuevo tiene la banda entera, y uno gastado tiene varios milímetros menos de goma.
        Parece poco, pero cambia el perímetro de la rueda: la nueva da menos vueltas por kilómetro que la
        usada. En un auto de tracción simple eso casi no se nota. En uno integral, el sistema lo interpreta
        como una rueda que patina y trata de compensar, con consecuencias:
      </p>
      <ul>
        <li>Mayor trabajo y calentamiento de los diferenciales y del embrague central.</li>
        <li>Desgaste anticipado de piezas de la transmisión, que son caras de reparar.</li>
        <li>Respuestas raras del control de tracción y del ABS.</li>
      </ul>

      <h2>Qué hacer según tu caso</h2>
      <table>
        <thead>
          <tr><th>Situación</th><th>Qué conviene</th></tr>
        </thead>
        <tbody>
          <tr><td>Las cuatro están muy gastadas</td><td>Cambiar las cuatro, mismo modelo</td></tr>
          <tr><td>Dos nuevas y dos con poco uso</td><td>Se puede, consultando el límite del manual; las nuevas atrás</td></tr>
          <tr><td>Una dañada y las otras casi nuevas</td><td>Una igual a las existentes, de misma marca y modelo</td></tr>
          <tr><td>Dos con mucho uso, dos nuevas</td><td>Cambiar las cuatro</td></tr>
        </tbody>
      </table>

      <h2>El mismo modelo en las cuatro</h2>
      <p>
        Además del diámetro, en una 4x4 es clave que las cuatro sean del mismo modelo y tipo. Mezclar una
        A/T con una H/T cambia el agarre y el comportamiento: lo vimos en{" "}
        <Link href="/blog/at-o-ht-cual-conviene-para-tu-camioneta">A/T o H/T: cuál conviene para tu camioneta</Link>.
      </p>

      <h2>Rotación y alineación</h2>
      <p>
        Para que el juego dure parejo, rotá cada 8.000 a 10.000 km con el esquema adecuado:{" "}
        <Link href="/blog/rotacion-de-neumaticos">guía de rotación</Link>. Y alineá al colocar: una pickup
        desalineada se come las cubiertas por el borde. Acá lo hacemos con{" "}
        <Link href="/servicios/alineacion">alineación 3D</Link>.
      </p>

      <h2>Si cambiás solo dos igual</h2>
      <p>
        Los dos nuevos, iguales entre sí, van <Link href="/blog/neumaticos-nuevos-adelante-o-atras">al eje trasero</Link>.
        Pero en tracción integral eso solo vale si la diferencia de dibujo con las otras dos es
        pequeña. Mirá también <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">cuándo alcanza con una</Link>.
      </p>

      <h2>Camionetas y SUV en Trivium</h2>
      <p>
        Trabajamos con neumáticos A/T, H/T y de carga para camionetas. Mirá las opciones en{" "}
        <Link href="/neumaticos/at">neumáticos A/T</Link> y <Link href="/neumaticos/ht">H/T</Link>, o
        consultanos con la medida y el modelo de tu vehículo.
      </p>
    </ArticleLayout>
  );
}
