import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-y-consumo-de-combustible";
const TITLE = "Neumáticos y consumo de combustible: cuánto influyen y qué podés hacer";
const SUBTITLE =
  "Presión, alineación, tipo de cubierta y peso: cuatro cosas que cambian lo que gasta tu auto y que se resuelven en una gomería.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cómo influyen los neumáticos en el consumo de combustible: presión baja, alineación, tipo y ancho de cubierta. Qué revisar para que el auto no gaste de más."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuánto aumenta el consumo con las ruedas bajas?",
    answer:
      "Depende del auto y de cuánto falte, pero el efecto es medible: a menos presión, más se deforma el neumático y más energía se pierde en cada vuelta. Además se gasta más rápido por los bordes.",
  },
  {
    question: "¿Inflar de más ahorra combustible?",
    answer:
      "Reduce algo la resistencia, pero se paga en frenada, confort y desgaste por el centro. Lo correcto es la presión que indica el fabricante del auto, ajustada a la carga.",
  },
  {
    question: "¿Un neumático más ancho gasta más?",
    answer:
      "En general sí: tiene más superficie de contacto y más resistencia al aire. Por eso conviene respetar la medida de fábrica salvo que haya un motivo para cambiarla.",
  },
  {
    question: "¿La alineación influye en el consumo?",
    answer:
      "Sí. Con la convergencia fuera de valor las ruedas van arrastrándose de costado en lugar de rodar derecho, y eso frena al auto todo el tiempo.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-12-05" readingMinutes={4} faqs={FAQS}>
      <p>Una parte del combustible que carga tu auto se va en algo que no se ve: deformar los neumáticos en cada vuelta. Se llama <strong>resistencia a la rodadura</strong>. No se puede eliminar, pero sí se puede evitar que sea más alta de lo necesario.</p>

      <h2>1. La presión: lo que más pesa y lo más fácil de arreglar</h2>
      <p>Un neumático bajo se aplasta más contra el piso, se deforma más y se calienta. Todo eso es energía que sale del tanque. Es además la causa más común, porque la presión baja sola con el tiempo. Medirla una vez por mes, en frío, es gratis: <Link href="/blog/presion-de-neumaticos">cuánto inflar los neumáticos</Link>.</p>

      <h2>2. La alineación</h2>
      <p>Si las ruedas no apuntan derecho, van <strong>arrastrándose</strong> un poco de costado en cada metro. El auto anda, pero empujando contra sus propias cubiertas. Se nota en el consumo y sobre todo en el <Link href="/blog/desgaste-irregular-de-neumaticos">desgaste</Link>. Qué corrige el alineado: <Link href="/blog/que-mide-una-alineadora-convergencia-caida-avance">convergencia, caída y avance</Link>.</p>

      <h2>3. El tipo de neumático</h2>
      <table>
        <thead><tr><th>Característica</th><th>Efecto en el consumo</th></tr></thead>
        <tbody>
          <tr><td>Más ancho que el de fábrica</td><td>Sube: más contacto y más resistencia al aire</td></tr>
          <tr><td>Dibujo A/T o con tacos</td><td>Sube: el taco se deforma más al rodar</td></tr>
          <tr><td>Compuesto de baja resistencia</td><td>Baja: es lo que mide la etiqueta europea</td></tr>
          <tr><td>Neumático de carga (C) en vacío</td><td>Sube algo: es más rígido y pesado</td></tr>
        </tbody>
      </table>
      <p>La <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link> clasifica justamente esto con una letra de eficiencia. Entre dos cubiertas de la misma medida, es un dato para comparar. Si tu camioneta casi no sale del asfalto, también vale repasar <Link href="/blog/at-o-ht-cual-conviene-para-tu-camioneta">si te conviene A/T o H/T</Link>.</p>

      <h2>4. El peso y la carga</h2>
      <p>Más peso es más deformación. Si cargás el auto para un viaje, la presión tiene que subir al valor «con carga» de la etiqueta; con la presión de todos los días, el neumático trabaja aplastado.</p>

      <h2>En resumen</h2>
      <ol>
        <li>Presión correcta, medida en frío, una vez por mes.</li>
        <li>Alineado cuando corresponde o cuando el auto tira.</li>
        <li>La medida de fábrica, salvo necesidad.</li>
      </ol>
      <p>Lo mismo que baja el consumo hace que las cubiertas duren más. La cuenta completa, con todo lo que se puede ahorrar, está en <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">la guía para ahorrar en neumáticos</Link>; y si querés ver cuánto te sale cada kilómetro, usá la calculadora de <Link href="/herramientas/costo-por-kilometro">costo por kilómetro</Link>.</p>
    </ArticleLayout>
  );
}
