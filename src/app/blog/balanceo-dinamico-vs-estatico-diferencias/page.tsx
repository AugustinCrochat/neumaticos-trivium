import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "balanceo-dinamico-vs-estatico-diferencias";
const TITLE = "Balanceo dinámico y balanceo estático: qué diferencia hay y cuál necesita tu auto";
const SUBTITLE =
  "Uno corrige el salto de la rueda y el otro también el bamboleo. Por qué en un auto moderno el estático solo no alcanza.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Diferencia entre balanceo estático y dinámico: qué corrige cada uno, en qué ruedas alcanza el estático y por qué los autos y camionetas necesitan balanceo dinámico computarizado."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es mejor, el balanceo estático o el dinámico?",
    answer:
      "El dinámico, porque incluye al estático: corrige el desequilibrio en dos planos (cara interna y cara externa de la rueda) en lugar de uno solo. En una rueda de auto, que es ancha, el estático por sí solo puede dejar un bamboleo sin corregir.",
  },
  {
    question: "¿Cómo sé si me hicieron un balanceo dinámico?",
    answer:
      "La balanceadora hace girar la rueda y pide pesas en dos lugares: una del lado de adentro y otra del lado de afuera de la llanta (o dos posiciones a distinta profundidad si las pesas son adhesivas). Si solo se coloca peso en un punto, se corrigió un solo plano.",
  },
  {
    question: "¿El balanceo estático sirve para algo?",
    answer:
      "Sí: en ruedas angostas, como las de moto, o cuando por diseño de la llanta no se puede poner peso en la cara externa. En un auto es un recurso puntual, no el método normal.",
  },
  {
    question: "¿Cada cuánto hay que balancear?",
    answer:
      "Siempre que se monta un neumático, después de reparar una pinchadura, si se cayó una pesa o si aparece una vibración a cierta velocidad.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-28" readingMinutes={5} faqs={FAQS}>
      <p>Balancear es repartir el peso de la rueda para que gire sin sacudirse. Lo que cambia entre un método y otro es <strong>cuántos desequilibrios se miden</strong>: el estático mira uno, el dinámico mira dos. En una rueda angosta da casi lo mismo; en la rueda ancha de un auto, no.</p>

      <h2>El desequilibrio estático: la rueda salta</h2>
      <p>Si un sector de la rueda pesa más que el resto, al girar ese punto pesado tira hacia afuera una vez por vuelta. El efecto es un <strong>salto vertical</strong>: la rueda sube y baja. Se corrige poniendo una pesa del lado opuesto al punto pesado. Es el balanceo más viejo y se puede hacer hasta sin girar la rueda, dejándola buscar sola su punto más pesado.</p>

      <h2>El desequilibrio dinámico: la rueda bambolea</h2>
      <p>Una rueda puede estar perfecta en estático y aun así vibrar. Pasa cuando el peso sobra de un lado en la cara interna y del lado contrario en la cara externa: las dos masas se compensan con la rueda quieta, pero al girar generan un <strong>bamboleo lateral</strong>, como un plato que se tambalea. Ese movimiento es el que llega al volante.</p>
      <p>Para verlo hay que hacer girar la rueda y medir en <strong>dos planos</strong>. Eso hace una balanceadora computarizada: indica cuánto peso poner y dónde, por separado para el lado de adentro y el de afuera.</p>

      <h2>La diferencia, en una tabla</h2>
      <table>
        <thead><tr><th></th><th>Estático</th><th>Dinámico</th></tr></thead>
        <tbody>
          <tr><td>Qué mide</td><td>Un plano</td><td>Dos planos (interno y externo)</td></tr>
          <tr><td>Qué corrige</td><td>El salto vertical</td><td>El salto y el bamboleo lateral</td></tr>
          <tr><td>Dónde va el peso</td><td>En un solo punto</td><td>En dos posiciones</td></tr>
          <tr><td>Dónde alcanza</td><td>Ruedas angostas (motos)</td><td>Autos, camionetas y utilitarios</td></tr>
        </tbody>
      </table>

      <h2>Por qué en un auto hace falta el dinámico</h2>
      <p>Cuanto más ancha es la rueda, más separadas quedan sus dos caras y más fuerza hace el bamboleo. Los autos actuales usan neumáticos anchos y de <Link href="/blog/perfil-bajo-o-perfil-alto">perfil bajo</Link>, que además transmiten más la vibración. Con un balanceo de un solo plano, la rueda puede quedar «en cero» y seguir sacudiendo el volante entre 90 y 120 km/h.</p>

      <h2>Qué se siente cuando falta</h2>
      <ul>
        <li>El <Link href="/blog/volante-vibra-causas-y-solucion">volante vibra</Link> a cierta velocidad y se calma al pasarla: ruedas delanteras.</li>
        <li>La vibración se siente en el asiento o el piso: ruedas traseras.</li>
        <li>Con el tiempo aparece <Link href="/blog/desgaste-irregular-de-neumaticos">desgaste irregular</Link> en la banda.</li>
      </ul>
      <p>Si la vibración apareció de un día para el otro, lo más común es que se haya caído una pesa: <Link href="/blog/pesas-de-balanceo-por-que-se-caen">por qué se caen las pesas de balanceo</Link>.</p>

      <h2>Cómo lo hacemos</h2>
      <p>En el taller el balanceado es dinámico y computarizado, rueda por rueda. Va incluido en el <Link href="/servicios/combo-alineado-y-balanceado">combo de alineado y balanceado</Link> y se hace siempre que colocamos neumáticos. La diferencia con el alineado, que corrige otra cosa, está en la guía de <Link href="/blog/alineacion-y-balanceo">alineado y balanceado</Link>.</p>
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
