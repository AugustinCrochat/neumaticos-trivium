import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-nuevos-adelante-o-atras";
const TITLE = "Neumáticos nuevos: ¿adelante o atrás? Dónde conviene colocarlos";
const SUBTITLE =
  "Si cambiás solo dos cubiertas, las nuevas van al eje trasero, incluso en un auto de tracción delantera. Te explicamos por qué, qué pasa si las ponés adelante y qué cambia según el auto.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Dónde colocar los neumáticos nuevos cuando cambiás solo dos: por qué van atrás aunque el auto sea de tracción delantera, qué pasa si van adelante y qué hacer con 4x4 y direccionales.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Los neumáticos nuevos van adelante o atrás?",
    answer:
      "Atrás. Cuando se cambian solo dos, las cubiertas con más profundidad de dibujo van en el eje trasero, sea el auto de tracción delantera, trasera o integral. Es la recomendación de los fabricantes de neumáticos y de la mayoría de las gomerías.",
  },
  {
    question: "Mi auto es de tracción delantera: ¿no se gastan más las de adelante?",
    answer:
      "Sí, las delanteras se gastan más rápido, pero la recomendación no busca que duren más sino que el auto sea estable. Con las nuevas atrás, el eje trasero conserva agarre y el auto se mantiene predecible al frenar fuerte o doblar sobre mojado. Después se rotan para parejar el desgaste.",
  },
  {
    question: "¿Qué pasa si pongo los nuevos adelante y los viejos atrás?",
    answer:
      "El eje delantero agarra más que el trasero. En una frenada o una curva con el piso mojado, la cola puede perder adherencia antes que la trompa y el auto empieza a girar sobre sí mismo (sobreviraje). Es una situación difícil de corregir para un conductor sin experiencia.",
  },
  {
    question: "¿Y si cambio las cuatro?",
    answer:
      "Entonces no hay dilema: las cuatro son nuevas y de ahí en adelante se rotan según el esquema de tu auto. Es lo más simple y lo que mejor deja la alineación y el desgaste.",
  },
  {
    question: "¿Se pueden pasar las nuevas adelante después?",
    answer:
      "Sí, rotando. Lo ideal es hacerlo cada 8.000 a 10.000 km: las que estaban atrás pasan adelante y viceversa, así el juego se gasta parejo. Mirá la guía de rotación para el esquema según tu tracción.",
  },
  {
    question: "¿Qué pasa si el auto tiene tracción integral (4x4 o AWD)?",
    answer:
      "En 4x4 y AWD la diferencia de profundidad entre ejes puede forzar la transmisión, así que lo más seguro suele ser cambiar las cuatro. Lo explicamos en una nota aparte.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-27" readingMinutes={6} faqs={FAQS}>
      <p>
        Es una de las preguntas más frecuentes en el mostrador: cambié dos neumáticos, ¿los pongo adelante
        o atrás? La intuición dice que adelante, porque en la mayoría de los autos de calle la tracción
        es delantera y esas ruedas trabajan más. Pero la respuesta que dan los fabricantes y los talleres
        es la contraria.
      </p>

      <Callout title="La regla" tone="ok">
        <p>
          Si cambiás <strong>dos</strong> neumáticos, los nuevos van en el <strong>eje trasero</strong>. No
          importa si el auto es de tracción delantera, trasera o integral.
        </p>
      </Callout>

      <h2>Por qué atrás: es una cuestión de estabilidad</h2>
      <p>
        Un neumático con dibujo profundo evacua mejor el agua y mantiene el agarre sobre mojado. Uno
        gastado lo pierde antes, y la diferencia se nota mucho cuando hay agua en el piso. Lo que importa es
        qué eje pierde adherencia primero:
      </p>
      <ul>
        <li>
          <strong>Si pierde agarre el eje delantero</strong>, el auto sigue derecho aunque gires el volante
          (subviraje). Es una reacción que el conductor entiende: levanta el pie y la trompa vuelve.
        </li>
        <li>
          <strong>Si pierde agarre el eje trasero</strong>, la cola se va hacia afuera y el auto gira sobre
          sí mismo (sobreviraje). Es mucho más difícil de controlar y puede terminar en un trompo.
        </li>
      </ul>
      <p>
        Poniendo los neumáticos mejores atrás, te asegurás de que si hay que perder agarre, lo pierda
        primero el eje que se corrige más fácil.
      </p>

      <h2>"Pero las de adelante se gastan más"</h2>
      <p>
        Es cierto, y por eso la solución no es dejar las cubiertas fijas: es{" "}
        <Link href="/blog/rotacion-de-neumaticos">rotarlas</Link>. Con las nuevas atrás, las viejas adelante
        se terminan antes; cuando llegue el momento de cambiar el otro par, los dos nuevos vuelven a ir
        atrás y los que estaban atrás pasan adelante. Es un ciclo en el que siempre el eje trasero lleva
        el mejor par.
      </p>

      <h2>Qué tiene que cumplir el par que cambiás</h2>
      <ul>
        <li>
          <strong>Los dos nuevos iguales entre sí:</strong> misma marca, mismo modelo y misma medida en el
          mismo eje.
        </li>
        <li>
          <strong>Misma medida que los otros dos</strong>, con índices de carga y velocidad como mínimo
          iguales. Lo repasamos en{" "}
          <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.
        </li>
        <li>
          <strong>Que los otros dos no estén al límite.</strong> Si los que quedan ya están por debajo de
          unos 3 mm de dibujo o tienen años, conviene cambiar los cuatro.
        </li>
      </ul>

      <h2>Cuándo no alcanza con cambiar dos</h2>
      <ul>
        <li>Los dos que quedan están muy gastados o tienen más de unos 6 años (<Link href="/blog/antiguedad-del-neumatico-codigo-dot">mirá el código DOT</Link>).</li>
        <li>Tu auto es 4x4 o AWD: <Link href="/blog/cambiar-los-cuatro-neumaticos-en-4x4-o-awd">por qué conviene cambiar los cuatro</Link>.</li>
        <li>Adelante y atrás llevan medidas distintas: cada eje se cambia por separado, con su medida.</li>
        <li>Los neumáticos son direccionales o asimétricos: hay detalles de montaje, en <Link href="/blog/neumaticos-direccionales-y-asimetricos-como-se-montan">esta nota</Link>.</li>
      </ul>

      <h2>Si cambiás un solo neumático</h2>
      <p>
        Con un único neumático nuevo pasan cosas parecidas y se suma un problema de diámetro. La
        recomendación general es cambiar siempre de a pares: lo detallamos en{" "}
        <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">¿se puede cambiar un solo neumático?</Link>
      </p>

      <h2>Al colocarlos, pedí que lo hagan así</h2>
      <p>
        Cuando vas a la gomería, decí que querés los nuevos en el eje trasero antes de que arranquen.
        Muchos talleres los colocan donde les resulta cómodo, y si no preguntás, pueden quedar adelante. Es
        el momento también de pedir <Link href="/blog/alineacion-y-balanceo">balanceo y alineación</Link>,
        porque una cubierta nueva en un auto desalineado se gasta rápido.
      </p>

      <h2>En nuestro taller</h2>
      <p>
        En Neumáticos Trivium, Argüello (Córdoba), te ayudamos a ver si los otros dos neumáticos dan para
        quedarse y en qué eje conviene colocar los nuevos. Mirá tu medida en el{" "}
        <Link href="/catalogo">catálogo</Link> o consultanos por WhatsApp con la medida y el modelo de tu
        auto.
      </p>
    </ArticleLayout>
  );
}
