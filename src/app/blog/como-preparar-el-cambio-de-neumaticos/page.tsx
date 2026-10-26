import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-preparar-el-cambio-de-neumaticos";
const TITLE = "Cambio de neumáticos en el taller: qué llevar y qué pedir";
const SUBTITLE =
  "Una lista corta para ir preparado: qué llevar, qué tiene que incluir el servicio y qué revisar antes de retirar el auto.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo preparar el cambio de neumáticos: qué llevar (llave de seguridad, medida), qué debe incluir el servicio (colocación, válvulas, balanceo) y qué controlar al retirar el auto.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué tengo que llevar al taller para cambiar los neumáticos?",
    answer:
      "El auto, la llave de la tuerca de seguridad si la tiene y, si ya sabés la medida, anotala (está en el flanco del neumático y en la etiqueta de la puerta). Si no estás seguro de cuál comprar, llevá el auto y la medimos.",
  },
  {
    question: "¿Qué incluye el servicio de colocación?",
    answer:
      "Lo habitual es desmontar y montar la cubierta, colocar válvula nueva, y balancear la rueda. Qué incluye exactamente depende del taller: pedí el detalle por escrito antes de aceptar el precio.",
  },
  {
    question: "¿Hay que volver a ajustar las tuercas después?",
    answer:
      "Es una práctica recomendada revisar el ajuste de las tuercas de la rueda después de los primeros kilómetros, sobre todo si se cambiaron las llantas. Preguntale al taller cuándo conviene pasar.",
  },
  {
    question: "¿Conviene alinear al cambiar los neumáticos?",
    answer:
      "Si los viejos tenían desgaste irregular, sí: de lo contrario los nuevos se gastarán igual. Si estaban parejos y el auto no tira ni vibra, la alineación se puede dejar para cuando haya un síntoma.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-10-24" readingMinutes={4} faqs={FAQS}>
      <p>
        Cambiar los neumáticos es sencillo si vas con las cosas claras. La mayoría de los problemas que
        aparecen después (un presupuesto que cambia, una vibración, una llave que falta) se evitan con cinco
        minutos de preparación.
      </p>

      <h2>Qué llevar</h2>
      <ul>
        <li>
          <strong>La llave de la tuerca de seguridad</strong>, si el auto la tiene. Sin ella no se puede sacar esa
          rueda, y recién hay que ver <Link href="/blog/extraccion-de-tuercas-de-seguridad">cómo extraerla</Link>.
        </li>
        <li>
          <strong>La medida</strong> de tus neumáticos actuales, o el auto para que la verifiquemos.{" "}
          <Link href="/blog/como-leer-medida-neumatico">Cómo leerla</Link>.
        </li>
        <li>
          <strong>Las llantas limpias</strong> en lo posible, así se ve mejor su estado y se evitan golpes en el
          balanceo.
        </li>
      </ul>

      <h2>Qué pedir que incluya</h2>
      <ol>
        <li>
          <strong>Colocación</strong> (desmontar y montar cada cubierta).
        </li>
        <li>
          <strong>Válvulas nuevas</strong> o, como mínimo, que las revisen:{" "}
          <Link href="/blog/cambio-de-valvulas-de-neumaticos">por qué importa</Link>.
        </li>
        <li>
          <strong>Balanceo</strong> de las cuatro ruedas.
        </li>
        <li>
          <strong>Presión final</strong> ajustada al valor del auto.
        </li>
        <li>
          <strong>Precio final por escrito</strong>, con todo incluido.{" "}
          <Link href="/blog/que-incluye-el-presupuesto-de-neumaticos">Cómo comparar presupuestos</Link>.
        </li>
      </ol>

      <Callout title="Qué mirar antes de que te entreguen el auto" tone="ok">
        <ul>
          <li>Que los cuatro neumáticos sean iguales y de la medida acordada.</li>
          <li>Que el código DOT sea reciente: <Link href="/blog/antiguedad-del-neumatico-codigo-dot">cómo leerlo</Link>.</li>
          <li>Que las tuercas estén bien ajustadas y completas.</li>
          <li>Que no haya rayones nuevos en las llantas.</li>
        </ul>
      </Callout>

      <h2>La alineación, ¿se hace siempre?</h2>
      <p>
        No siempre. Si tus neumáticos viejos se gastaron parejos y el auto andaba derecho, no hace falta. Si
        tenían <Link href="/blog/desgaste-irregular-de-neumaticos">desgaste irregular</Link> en un borde, sí
        conviene alinear, porque los nuevos se van a gastar de la misma manera. Si dudás,{" "}
        <Link href="/blog/sintomas-alineacion-balanceo-o-rotacion">esta guía de síntomas</Link> te orienta.
      </p>

      <h2>Después del cambio</h2>
      <p>
        Revisá la presión al mes y volvé a controlar el ajuste de las tuercas a los pocos kilómetros. En el
        local te controlamos la presión sin cargo. Y cuando llegue el momento,{" "}
        <Link href="/blog/rotacion-de-neumaticos">la rotación</Link> ayuda a que el juego dure todo lo que tiene
        que durar.
      </p>
      <p>
        Mirá los neumáticos disponibles en <Link href="/neumaticos">el catálogo</Link> o consultá los{" "}
        <Link href="/servicios">servicios del taller</Link>.
      </p>
    </ArticleLayout>
  );
}
