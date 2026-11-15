import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "tren-delantero-con-juego-por-que-no-se-puede-alinear";
const TITLE = "Tren delantero con juego: por qué a veces no se puede alinear el auto";
const SUBTITLE =
  "Rótulas, extremos de dirección y bujes: las piezas que tienen que estar firmes para que el alineado dure.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Por qué un tren delantero con juego impide alinear bien el auto: rótulas, extremos de dirección, bujes y rulemanes. Síntomas y qué resolver antes del alineado."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Se puede alinear un auto con una rótula o un extremo con juego?",
    answer:
      "Se pueden llevar los valores a medida en el elevador, pero no van a mantenerse: apenas el auto ruede, la pieza floja deja que la rueda cambie de posición. Lo correcto es cambiar la pieza y alinear después.",
  },
  {
    question: "¿Cómo sé si mi auto tiene juego en el tren delantero?",
    answer:
      "Golpeteos al pasar pozos o lomos, dirección imprecisa que hay que corregir todo el tiempo, vibración al frenar y desgaste irregular que vuelve aunque se haya alineado hace poco.",
  },
  {
    question: "Cambié una pieza del tren delantero, ¿tengo que alinear?",
    answer:
      "Sí. Cualquier trabajo que toque dirección o suspensión mueve los ángulos de las ruedas.",
  },
  {
    question: "¿Por qué el auto se desalinea al poco tiempo?",
    answer:
      "Las dos causas más comunes son un golpe fuerte contra un pozo o un cordón, y una pieza con juego que no se cambió.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-12-06" readingMinutes={5} faqs={FAQS}>
      <p>Alinear es dejar las ruedas en los ángulos que indica el fabricante. Para que eso sirva, las ruedas tienen que <strong>quedarse</strong> en esos ángulos cuando el auto baja del elevador. Y eso depende de un conjunto de articulaciones que con los kilómetros toman juego.</p>

      <h2>Las piezas que sostienen la alineación</h2>
      <table>
        <thead><tr><th>Pieza</th><th>Qué hace</th><th>Qué pasa si tiene juego</th></tr></thead>
        <tbody>
          <tr><td>Extremo de dirección</td><td>Une la cremallera con la rueda</td><td>La convergencia cambia sola: desgaste en un borde</td></tr>
          <tr><td>Rótula</td><td>Articula la parrilla con el portamasa</td><td>La rueda se mueve al frenar y en los pozos</td></tr>
          <tr><td>Bujes de parrilla</td><td>Fijan la parrilla al chasis</td><td>La rueda se corre al acelerar y frenar</td></tr>
          <tr><td>Rulemán de rueda</td><td>Deja girar la rueda sin que se mueva de costado</td><td>Zumbido y juego lateral</td></tr>
          <tr><td>Bieletas y bujes de barra</td><td>Conectan la barra estabilizadora</td><td>Golpeteo; no cambian la alineación pero se confunden</td></tr>
        </tbody>
      </table>

      <h2>Por qué con juego no sirve alinear</h2>
      <p>La alineadora mide con el auto quieto. Si hay una pieza floja, la rueda puede quedar perfecta en la pantalla y cambiar de posición apenas recibe fuerza: al frenar, al doblar, al pasar un pozo. El resultado es un auto que <strong>«se desalinea» en pocos días</strong> y un neumático que se sigue gastando mal. Por eso un alineado bien hecho empieza por revisar el juego; qué se mide después está en <Link href="/blog/que-mide-una-alineadora-convergencia-caida-avance">qué mide una alineadora</Link>.</p>

      <h2>Señales en el manejo</h2>
      <ul>
        <li>Golpes secos o golpeteo al pasar lomos de burro y pozos.</li>
        <li>Dirección «flotante»: hay que corregir el volante todo el tiempo en ruta.</li>
        <li>El auto <Link href="/blog/auto-tira-para-un-lado-causas">tira para un lado</Link> y a veces cambia de lado según se acelere o se frene.</li>
        <li><Link href="/blog/desgaste-irregular-de-neumaticos">Desgaste irregular</Link> que reaparece después de alinear.</li>
      </ul>

      <h2>El orden que ahorra plata</h2>
      <ol>
        <li><strong>Revisión</strong> del tren delantero con el auto levantado.</li>
        <li><strong>Reparación</strong> de lo que tenga juego.</li>
        <li><strong>Alineado</strong>, siempre después de tocar dirección o suspensión.</li>
        <li><strong>Balanceado y rotación</strong> para emparejar el desgaste que ya había.</li>
      </ol>
      <p>Alinear antes de reparar es pagar dos veces. Y poner cubiertas nuevas sobre un tren con juego es gastarlas mal desde el primer día. Con el tren firme, el <Link href="/servicios/combo-alineado-y-balanceado">alineado y balanceado</Link> se hace por orden de llegada, sin turno; cada cuánto repetirlo está en <Link href="/blog/cada-cuantos-km-alinear-y-balancear">cada cuántos kilómetros alinear y balancear</Link>.</p>
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
