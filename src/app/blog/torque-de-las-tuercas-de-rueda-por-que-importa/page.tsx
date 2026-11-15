import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "torque-de-las-tuercas-de-rueda-por-que-importa";
const TITLE = "Torque de las tuercas de rueda: por qué importa cuánto y en qué orden se aprietan";
const SUBTITLE =
  "Apretar de más daña tanto como apretar de menos. El orden en cruz, el valor del manual y el reapriete.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Por qué importa el torque de las tuercas de rueda: qué pasa si se aprietan de más o de menos, el orden en cruz, dónde está el valor correcto y cuándo reapretar."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuánto torque llevan las tuercas de rueda?",
    answer:
      "Lo indica el manual de cada vehículo. En autos suele rondar entre 90 y 120 N·m y en camionetas es más alto, pero el valor que vale es el del fabricante.",
  },
  {
    question: "¿Qué pasa si se aprietan demasiado?",
    answer:
      "Los espárragos se estiran y pueden cortarse, la rosca se daña, el disco de freno puede deformarse y, el día que pinches, no vas a poder aflojarlas con la llave del auto.",
  },
  {
    question: "¿Por qué se aprietan en cruz?",
    answer:
      "Para que la llanta asiente pareja contra la maza. Si se aprieta en círculo, puede quedar cruzada y aflojarse o vibrar.",
  },
  {
    question: "¿Hay que reapretar después de un cambio de ruedas?",
    answer:
      "Es una buena práctica controlar el apriete después de los primeros 50 a 100 km, sobre todo con llantas de aleación.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-12-09" readingMinutes={4} faqs={FAQS}>
      <p>Cuatro o cinco tuercas sostienen cada rueda. Que estén «bien apretadas» no alcanza como criterio: hay un valor correcto, y pasarse es tan malo como quedarse corto.</p>

      <h2>Poco apriete, mucho apriete</h2>
      <table>
        <thead><tr><th>De menos</th><th>De más</th></tr></thead>
        <tbody>
          <tr><td>La rueda toma juego y vibra</td><td>El espárrago se estira y se debilita</td></tr>
          <tr><td>Las tuercas se siguen aflojando solas</td><td>La rosca se daña o se barre</td></tr>
          <tr><td>Se ovalan los agujeros de la llanta</td><td>El disco de freno puede deformarse</td></tr>
          <tr><td>En el extremo, la rueda se sale</td><td>Imposible aflojar con la llave del auto en la ruta</td></tr>
        </tbody>
      </table>
      <p>El exceso es el error más común: una pistola neumática usada al máximo aprieta varias veces más de lo necesario. El daño no se ve ese día; aparece cuando el espárrago se corta o la rosca no agarra más: <Link href="/blog/esparrago-de-maza-roto-reparacion-de-rosca">espárrago de maza roto</Link>.</p>

      <h2>El orden: en cruz</h2>
      <ol>
        <li>Presentar todas las tuercas a mano, para que ninguna entre cruzada.</li>
        <li>Arrimarlas en <strong>cruz o estrella</strong>: una, la de enfrente, y así.</li>
        <li>Bajar el auto y dar el apriete final, también en cruz, al valor indicado.</li>
      </ol>
      <p>Así la llanta asienta plana contra la maza. Si se aprieta en círculo, un lado apoya antes que el otro y la rueda queda con una tensión que después se traduce en vibración o en tuercas flojas.</p>

      <h2>Dónde está el valor</h2>
      <p>En el manual del vehículo, en la sección de cambio de rueda. Depende del tamaño del espárrago y del tipo de llanta, por eso no hay un número universal. Lo que sí es universal: las superficies de apoyo limpias y la rosca sin grasa ni aceite, salvo que el fabricante diga otra cosa, porque lubricada el mismo torque aprieta mucho más.</p>

      <h2>El reapriete</h2>
      <p>Después de los primeros kilómetros la llanta termina de asentar, sobre todo si es de aleación o si había óxido en la maza. Un control a los 50 o 100 km lleva un minuto y descarta que alguna haya quedado floja.</p>

      <h2>Si cambiás la rueda vos</h2>
      <p>Con la llave del auto, apretá firme con el brazo, sin saltar arriba de la llave, y en cruz. Después pasá por una gomería para que controlen el apriete. El procedimiento completo está en <Link href="/blog/como-cambiar-una-rueda-paso-a-paso">cómo cambiar una rueda paso a paso</Link>; si tu auto lleva tuercas de seguridad, tené a mano el adaptador: <Link href="/blog/tuercas-y-bulones-de-seguridad">tuercas y bulones de seguridad</Link>.</p>
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
