import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "aquaplaning-que-es-y-como-evitarlo";
const TITLE = "Aquaplaning: qué es, por qué pasa y cómo evitarlo";
const SUBTITLE =
  "Cuando el agua levanta el neumático y el auto deja de responder. Qué lo provoca, cómo reaccionar y cómo reducir el riesgo con el estado de tus cubiertas.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué es el aquaplaning o hidroplaneo, qué lo provoca (velocidad, dibujo gastado, presión baja), cómo reaccionar si pasa y cómo prevenirlo con neumáticos en buen estado.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es el aquaplaning?",
    answer:
      "Es cuando se forma una capa de agua entre el neumático y el asfalto y la cubierta deja de tocar el piso. El auto no frena ni dobla como siempre.",
  },
  {
    question: "¿Qué hago si siento que flota el auto?",
    answer:
      "Soltá el acelerador con suavidad, mantené el volante derecho y no frenes a fondo. Cuando el neumático vuelva a agarrar, recuperás el control.",
  },
  {
    question: "¿Cuánto dibujo necesito para lluvia?",
    answer:
      "El límite legal es 1,6 mm, pero con lluvia el rendimiento cae mucho antes. Se recomienda cambiar alrededor de los 3 mm.",
  },
  {
    question: "¿Influye la presión?",
    answer:
      "Sí. Con poca presión la banda se deforma y evacúa peor el agua. Con la presión correcta el dibujo trabaja como fue diseñado.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>El aquaplaning, o hidroplaneo, es una de las situaciones más peligrosas con lluvia: el agua se acumula adelante del neumático, lo levanta y el auto pierde dirección y frenado por un instante. Pasa más de lo que se cree, y mucho menos con cubiertas en buen estado.</p>

      <h2>Qué lo provoca</h2>
      <ul>
      <li><strong>Velocidad:</strong> cuanto más rápido, menos tiempo tiene el dibujo para evacuar el agua.</li>
      <li><strong>Dibujo gastado:</strong> las canaladuras son los canales por donde se va el agua. Con poco dibujo, no alcanzan.</li>
      <li><strong>Presión baja:</strong> la banda se deforma y evacúa peor. Controlá la <Link href="/blog/presion-de-neumaticos">presión</Link>.</li>
      <li><strong>Mucha agua acumulada:</strong> charcos, huellas y tramos con poco desagüe.</li>
      </ul>

      <h2>Cómo reaccionar</h2>
      <ol>
      <li>No frenes a fondo ni gires de golpe.</li>
      <li>Soltá el acelerador de a poco.</li>
      <li>Mantené el volante derecho.</li>
      <li>Cuando el auto vuelva a responder, frená suave si hace falta.</li>
      </ol>

      <h2>Cómo reducir el riesgo</h2>
      <ul>
      <li><strong>Dibujo en condiciones:</strong> cambiá las cubiertas antes del límite. Cuándo: <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cada cuántos kilómetros</Link>.</li>
      <li><strong>Si cambiás solo dos,</strong> los nuevos van atrás: <Link href="/blog/neumaticos-nuevos-adelante-o-atras">por qué</Link>.</li>
      <li><strong>Cubiertas asimétricas o direccionales</strong> bien montadas: <Link href="/blog/neumaticos-direccionales-y-asimetricos-como-se-montan">cómo se montan</Link>.</li>
      <li><strong>Velocidad adecuada</strong> cuando llueve.</li>
      </ul>

      <h2>Qué dice la etiqueta sobre el mojado</h2>
      <p>La <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link> incluye una clase de agarre sobre mojado (de la A a la E). Es un buen dato para comparar dos modelos. Y el <Link href="/blog/utqg-desgaste-traccion-temperatura">UTQG</Link> mide tracción en mojado en las cubiertas que lo traen.</p>

      <h2>Las cubiertas gastadas son las más riesgosas</h2>
      <p>Un neumático nuevo puede evacuar una gran cantidad de agua por segundo; uno gastado, mucho menos. Por eso cambiar a tiempo no es un lujo: es seguridad. La guía para decidir cuándo y cómo comprar bien está en <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">ahorrar en neumáticos</Link>.</p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
