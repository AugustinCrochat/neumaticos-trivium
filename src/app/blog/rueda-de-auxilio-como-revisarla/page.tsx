import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "rueda-de-auxilio-como-revisarla";
const TITLE = "Rueda de auxilio: cómo revisarla para que sirva cuando la necesitás";
const SUBTITLE =
  "Es la rueda que nadie mira hasta que hace falta. Qué controlar en el auxilio, la presión que necesita y qué más tiene que haber en el baúl.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo revisar la rueda de auxilio: presión, edad, estado del caucho, gato y llaves (incluida la de la tuerca de seguridad) y diferencias entre auxilio común y de uso temporal.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cada cuánto hay que revisar la rueda de auxilio?",
    answer:
      "Junto con las otras cuatro: una vez por mes como mínimo y antes de cada viaje largo. Es la que más rápido se olvida y la que menos se puede dar el lujo de estar baja.",
  },
  {
    question: "¿Cuánta presión lleva el auxilio?",
    answer:
      "Si es del mismo tipo que las otras cuatro, la misma presión. Si es una rueda de uso temporal (más angosta), suele pedir una presión bastante más alta, que figura impresa en la propia rueda o en la etiqueta del auto. Mirá ese valor, no supongas.",
  },
  {
    question: "¿El auxilio también envejece?",
    answer:
      "Sí. Aunque nunca se use, el caucho se endurece con los años y puede agrietarse. Mirá el código DOT para saber cuántos años tiene y reemplazalo con los mismos criterios que el resto.",
  },
  {
    question: "¿Puedo andar con el auxilio como si fuera una rueda normal?",
    answer:
      "Las ruedas de uso temporal están pensadas para llegar al taller, con velocidad reducida (suelen indicar un máximo de 80 km/h) y distancia corta. Un auxilio igual a las otras cuatro sí puede usarse con normalidad, aunque conviene reparar o reemplazar la pinchada cuanto antes.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Mantenimiento" date="2026-10-24" readingMinutes={4} faqs={FAQS}>
      <p>
        Una pinchadura en ruta es el peor momento para descubrir que el auxilio está baja, que el gato no
        está o que la llave de la tuerca de seguridad se quedó en casa. Cuatro minutos de revisión cada mes
        lo evitan.
      </p>

      <h2>Qué revisar en la rueda</h2>
      <ul>
        <li>
          <strong>Presión.</strong> Con el manómetro, en frío, como las otras. Un auxilio con poca presión
          no sirve cuando lo necesitás.
        </li>
        <li>
          <strong>Estado del caucho.</strong> Grietas en el flanco, abultamientos o cortes son motivo de
          reemplazo.
        </li>
        <li>
          <strong>Edad.</strong> Mirá el código DOT:{" "}
          <Link href="/blog/antiguedad-del-neumatico-codigo-dot">te explicamos cómo leerlo</Link>.
        </li>
        <li>
          <strong>Que esté bien sujeta.</strong> Que no golpee ni se mueva en el baúl o bajo el piso.
        </li>
      </ul>

      <h2>Auxilio común o de uso temporal</h2>
      <p>
        Hay dos tipos. El <strong>auxilio igual a las otras cuatro</strong> se usa sin restricciones. El de{" "}
        <strong>uso temporal</strong> (más angosto, suele tener una etiqueta que lo indica) es más liviano y
        ocupa menos, pero está pensado para llegar hasta el taller: trabaja a una presión mayor y con un límite
        de velocidad.
      </p>

      <Callout title="El dato que siempre falta" tone="warn">
        <p>
          Si tu auto tiene tuerca de seguridad, la llave tiene que estar siempre en el baúl, no en el cajón de
          casa. Sin ella, no hay forma de sacar esa rueda.{" "}
          <Link href="/blog/tuercas-y-bulones-de-seguridad">Acá te contamos cómo funcionan</Link>.
        </p>
      </Callout>

      <h2>Qué tiene que haber en el baúl</h2>
      <ol>
        <li>Gato en buen estado y que sepas usar.</li>
        <li>Llave de ruedas del tamaño correcto.</li>
        <li>Llave de la tuerca de seguridad, si el auto la tiene.</li>
        <li>Triángulos de emergencia.</li>
        <li>Una linterna chica, porque la pinchadura casi nunca ocurre de día y con buena luz.</li>
      </ol>

      <h2>Después de usarla</h2>
      <p>
        Con el auxilio puesto, controlá su presión a los pocos kilómetros y llevá la rueda pinchada al
        taller. Muchas veces <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">se puede reparar</Link>;
        si no, hay que reponerla. Y revisá que las tuercas queden bien ajustadas después de los primeros
        kilómetros.
      </p>
      <p>
        En el local te controlamos la presión del auxilio junto con las otras cuatro, sin cargo. Si querés
        revisar el resto, mirá <Link href="/blog/presion-de-neumaticos">cuánto inflar y cada cuánto</Link>.
      </p>
    </ArticleLayout>
  );
}
