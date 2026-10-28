import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-guardar-neumaticos";
const TITLE = "Cómo guardar neumáticos: de pie, apilados o colgados, y dónde";
const SUBTITLE =
  "Si cambiás por un juego de invierno o guardás las cubiertas viejas o la de auxilio, así se conservan sin deformarse ni resecarse.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo guardar neumáticos correctamente: lugar fresco y oscuro, con o sin llanta, de pie, apilados o colgados, qué evitar (sol, aceite, calor) y cómo revisar la edad al volver a usarlos.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Dónde conviene guardar los neumáticos?",
    answer:
      "En un lugar fresco, seco, oscuro y ventilado, lejos del sol directo, de motores eléctricos, de aceites y solventes. Un garaje o un cuarto interior sirven.",
  },
  {
    question: "¿Se guardan de pie o apilados?",
    answer:
      "Con llanta, apilados horizontalmente o colgados. Sin llanta, de pie y girándolos cada mes para que no se deformen.",
  },
  {
    question: "¿Hay que inflarlos?",
    answer:
      "Si están montados en llanta, inflalos a presión normal. Un neumático guardado desinflado se deforma.",
  },
  {
    question: "¿Cuánto tiempo se pueden guardar?",
    answer:
      "La edad cuenta aunque no se use: revisá el código DOT antes de reponerlos.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={4} faqs={FAQS}>
      <p>Un neumático guardado mal se puede arruinar sin haber rodado un kilómetro: se deforma, se reseca o se agrieta. Si cambiás a un juego distinto por temporada, guardás cubiertas de repuesto o simplemente tenés una de auxilio, vale la pena hacerlo bien.</p>

      <h2>El lugar</h2>
      <ul>
      <li><strong>Fresco, seco y oscuro:</strong> el sol y el calor resecan la goma.</li>
      <li><strong>Lejos de aceites, nafta y solventes:</strong> los degradan.</li>
      <li><strong>Lejos de motores eléctricos y soldadoras:</strong> generan ozono, que reseca la goma.</li>
      <li><strong>Ventilado:</strong> sin humedad ni encharcado.</li>
      </ul>

      <h2>Cómo apoyarlos</h2>
      <table>
      <thead><tr><th>Cómo están</th><th>Cómo se guardan</th></tr></thead>
      <tbody>
      <tr><td>Montados en llanta</td><td>Apilados horizontalmente o colgados. Inflados a presión normal.</td></tr>
      <tr><td>Sin llanta</td><td>De pie, girándolos cada mes.</td></tr>
      </tbody>
      </table>
      <p>Nunca apilados sin llanta: se deforman por el peso.</p>

      <h2>Antes de guardarlos</h2>
      <ol>
      <li>Lavalos con agua y jabón neutro: <Link href="/blog/limpiar-neumaticos-brillo-y-productos">limpieza y productos</Link>.</li>
      <li>Dejalos secar.</li>
      <li>Marcá la posición de cada uno (delantero izquierdo, etc.) para rotarlos bien al volver a usarlos: <Link href="/blog/rotacion-de-neumaticos">rotación</Link>.</li>
      <li>Protegelos con una funda opaca, no con plástico que condense humedad.</li>
      </ol>

      <h2>Al volver a usarlos</h2>
      <p>Revisá estado y edad: cortes, grietas, resecamiento. El <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> te dice cuántos años tienen. Hacelos balancear antes de montarlos y ajustá la presión.</p>

      <h2>La rueda de auxilio</h2>
      <p>También envejece. Revisala con la misma regla: <Link href="/blog/rueda-de-auxilio-como-revisarla">cómo revisar la rueda de auxilio</Link>. Más ideas para cuidar y gastar menos en la <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">guía completa</Link>.</p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
