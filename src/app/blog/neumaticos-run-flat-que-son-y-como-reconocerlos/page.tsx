import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-run-flat-que-son-y-como-reconocerlos";
const TITLE = "Neumáticos run-flat: qué son, cómo reconocerlos y si se pueden reemplazar por comunes";
const SUBTITLE =
  "El neumático que sigue rodando sin aire: cómo funciona, qué siglas lleva en el flanco y qué hay que saber antes de cambiarlo.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Qué son los neumáticos run-flat, cómo reconocerlos por las siglas del flanco (RFT, ROF, SSR, ZP), cuánto se puede rodar sin presión y si se pueden reemplazar por neumáticos comunes."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuánto se puede andar con un run-flat pinchado?",
    answer:
      "Depende del fabricante, pero la referencia habitual es del orden de 80 km a no más de 80 km/h. El dato exacto está en el manual del auto o en la ficha del neumático.",
  },
  {
    question: "¿Cómo sé si mi auto tiene run-flat?",
    answer:
      "Por las siglas en el flanco (RFT, ROF, SSR, ZP, RSC, EMT, según la marca) y porque esos autos suelen venir sin rueda de auxilio y con sensor de presión.",
  },
  {
    question: "¿Puedo cambiar run-flat por neumáticos comunes?",
    answer:
      "Técnicamente se puede si se cambian los cuatro, pero el auto queda sin la posibilidad de seguir rodando pinchado: hay que llevar rueda de auxilio o un kit de reparación. Conviene consultar el manual antes.",
  },
  {
    question: "¿Se puede reparar un run-flat pinchado?",
    answer:
      "Depende de cuánto se haya rodado sin presión: el flanco puede haberse dañado por dentro sin que se vea. Muchos fabricantes no recomiendan repararlo si se usó desinflado.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-12-07" readingMinutes={5} faqs={FAQS}>
      <p>Un neumático común se sostiene con el aire: si lo pierde, el flanco se aplasta y la llanta pisa la goma. Un run-flat tiene <strong>flancos reforzados</strong> que aguantan el peso del auto aunque no haya presión, lo suficiente para llegar a un lugar seguro sin cambiar la rueda en la banquina.</p>

      <h2>Cómo reconocerlos</h2>
      <p>No hay una sigla única: cada fabricante usa la suya. Están impresas en el flanco, cerca de la medida.</p>
      <table>
        <thead><tr><th>Sigla</th><th>Significa</th></tr></thead>
        <tbody>
          <tr><td>RFT</td><td>Run Flat Tire</td></tr>
          <tr><td>ROF</td><td>Run On Flat</td></tr>
          <tr><td>SSR</td><td>Self Supporting Runflat</td></tr>
          <tr><td>ZP</td><td>Zero Pressure</td></tr>
          <tr><td>RSC</td><td>Runflat System Component</td></tr>
          <tr><td>EMT</td><td>Extended Mobility Technology</td></tr>
        </tbody>
      </table>
      <p>El resto del código se lee igual que en cualquier cubierta: <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida del neumático</Link>.</p>

      <h2>Ventajas y desventajas</h2>
      <ul>
        <li><strong>A favor:</strong> no quedás parado en la ruta ni tenés que cambiar la rueda en un lugar inseguro; el auto se mantiene controlable al perder presión.</li>
        <li><strong>En contra:</strong> el flanco rígido hace la marcha más firme, son más pesados y más caros, y la reparación es limitada.</li>
      </ul>

      <h2>Por qué necesitan sensor de presión</h2>
      <p>Como el flanco sostiene al auto, un run-flat pinchado <strong>casi no se nota a simple vista</strong> ni al manejar. Sin un aviso en el tablero podrías rodar cientos de kilómetros sin aire y destruirlo. Por eso van siempre con sistema de control de presión: <Link href="/blog/sensor-de-presion-tpms-que-es-y-que-hacer-si-se-prende">qué es el TPMS</Link>.</p>

      <h2>Antes de cambiarlos</h2>
      <ol>
        <li><strong>No mezcles.</strong> Run-flat y comunes en el mismo auto se comportan distinto; como mínimo, iguales por eje.</li>
        <li><strong>Si pasás a comunes,</strong> resolvé qué vas a hacer ante una pinchadura: tu auto probablemente no trae <Link href="/blog/rueda-de-auxilio-como-revisarla">rueda de auxilio</Link>.</li>
        <li><strong>Respetá medida, índice de carga y de velocidad</strong> de fábrica.</li>
        <li><strong>Avisá en la gomería</strong> que son run-flat: el flanco rígido se desarma con más cuidado.</li>
      </ol>
      <p>Con la medida en la mano, <Link href="/neumaticos">mirá qué hay en stock y a qué precio</Link>. Si no la encontrás, escribinos y te decimos qué alternativas hay para tu auto.</p>
    </ArticleLayout>
  );
}
