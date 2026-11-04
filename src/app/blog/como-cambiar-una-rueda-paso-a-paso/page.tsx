import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-cambiar-una-rueda-paso-a-paso";
const TITLE = "Cómo cambiar una rueda paso a paso: guía segura para cuando te pincha en ruta";
const SUBTITLE =
  "Dónde parar, qué herramientas usar, en qué orden aflojar y apretar las tuercas y qué revisar después en una gomería.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cómo cambiar una rueda pinchada paso a paso: dónde detenerse, balizas, orden de las tuercas, uso del gato, tuerca antirrobo y qué revisar después en la gomería. Guía segura."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué tengo que tener en el auto para cambiar una rueda?",
    answer:
      "Rueda de auxilio con presión, gato, llave de ruedas, la llave de la tuerca antirrobo (si tiene) y balizas. Revisá que estén antes de salir.",
  },
  {
    question: "¿Por qué se aflojan las tuercas antes de levantar el auto?",
    answer:
      "Porque con la rueda apoyada en el piso no gira, y se puede hacer fuerza. Una vez en el aire, la rueda gira y es difícil aflojarlas.",
  },
  {
    question: "¿Por qué apretar en cruz?",
    answer:
      "Para que la rueda asiente pareja contra la maza. Apretar en orden circular puede dejarla torcida.",
  },
  {
    question: "¿Puedo seguir viajando con la rueda de auxilio?",
    answer:
      "Depende del tipo. Las de uso temporal tienen límite de velocidad y distancia. Llegá a una gomería para reparar o reemplazar la original.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={6} faqs={FAQS}>
      <p>Una pinchadura es una de las situaciones más comunes y estresantes de viajar. Saber hacer el cambio de rueda con seguridad ahorra tiempo, plata y riesgos. Esta guía es para un auto de calle; ante dudas, llamá a asistencia.</p>

      <Callout title="Primero la seguridad" tone="warn">
      <p>Si estás en ruta, estacioná lo más lejos posible del tránsito, en terreno firme y plano. Prendé las balizas, colocá los triángulos y no te pares del lado de la calzada.</p>
      </Callout>

      <h2>Antes de empezar</h2>
      <ol>
      <li>Poné el freno de mano y primera (o parking).</li>
      <li>Si podés, calzá las ruedas contrarias con una piedra.</li>
      <li>Sacá la rueda de auxilio, el gato y la llave.</li>
      <li>Si hay tuerca antirrobo, buscá su llave: <Link href="/blog/tuercas-y-bulones-de-seguridad">cómo funcionan</Link>.</li>
      </ol>

      <h2>Paso a paso</h2>
      <ol>
      <li><strong>Aflojá las tuercas</strong> media vuelta, con la rueda todavía en el piso.</li>
      <li><strong>Ubicá el gato</strong> en el punto indicado por el manual. Nunca debajo de partes que no sean de refuerzo.</li>
      <li><strong>Levantá el auto</strong> hasta que la rueda no toque el piso. No te metas debajo del auto.</li>
      <li><strong>Sacá las tuercas</strong> y la rueda.</li>
      <li><strong>Colocá la de auxilio</strong>, alineando los agujeros.</li>
      <li><strong>Apretá a mano</strong> las tuercas en cruz.</li>
      <li><strong>Bajá el auto</strong> y apretá a fondo, otra vez en cruz.</li>
      </ol>

      <h2>Después del cambio</h2>
      <ul>
      <li>Revisá la presión de la rueda de auxilio: <Link href="/blog/rueda-de-auxilio-como-revisarla">cómo revisarla</Link>.</li>
      <li>Pasá por una gomería para verificar el torque de las tuercas.</li>
      <li>Reparar o reemplazar la cubierta pinchada: si es reparable, <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">parche y mecha</Link>.</li>
      <li>Si la rueda de auxilio es de uso temporal, respetá el límite de velocidad.</li>
      </ul>

      <h2>Cómo prepararte</h2>
      <ul>
      <li>Revisá la rueda de auxilio en tu <Link href="/blog/revision-mensual-de-neumaticos-en-5-minutos">revisión mensual</Link>.</li>
      <li>Guardá la llave antirrobo en el auto, no en casa.</li>
      <li>Practicá el cambio en un lugar seguro, al menos una vez.</li>
      </ul>
      <p>Si el neumático quedó inutilizable, mirá si conviene <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">cambiar uno o el par</Link>. Y para evitar pinchaduras y gastos, la <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">guía completa</Link>.</p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
