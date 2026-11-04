import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cuatro-economicos-o-dos-de-marca";
const TITLE = "¿Conviene poner 4 neumáticos económicos o 2 de marca?";
const SUBTITLE =
  "Mezclar marcas o desgastes entre ejes tiene consecuencias. Cuándo conviene cambiar los cuatro, cuándo solo dos y en qué eje van los nuevos.";

export const metadata: Metadata = {
  ...blogShare("cuatro-economicos-o-dos-de-marca"),
  title: TITLE,
  description:
    resumen("¿4 neumáticos económicos o 2 de marca? Cuándo cambiar los cuatro, cuándo dos, en qué eje colocar los nuevos y qué pasa en autos con tracción integral. Con ejemplos de la cuenta."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Puedo cambiar solo dos neumáticos?",
    answer:
      "Sí, siempre que los dos nuevos sean iguales entre sí, de la medida correcta y que los otros dos no estén muy gastados. Los dos nuevos conviene colocarlos en el eje trasero.",
  },
  {
    question: "¿Por qué los nuevos van atrás?",
    answer:
      "Los fabricantes y las gomerías recomiendan poner atrás los de mayor profundidad de banda para que el eje trasero no pierda agarre antes que el delantero en frenadas o curvas sobre mojado, lo que haría que el auto se descontrole.",
  },
  {
    question: "¿Puedo mezclar marcas en el mismo eje?",
    answer:
      "No es recomendable. Dos neumáticos del mismo eje deben ser iguales en marca, modelo y medida y tener un desgaste parecido, para que el auto se comporte parejo.",
  },
  {
    question: "¿Y si mi auto tiene tracción integral (4x4 o AWD)?",
    answer:
      "Ahí es más delicado: una diferencia grande de diámetro entre los neumáticos fuerza la transmisión. Consultá el manual o al fabricante qué diferencia de profundidad admiten (suele ser de pocos milímetros) y, ante la duda, cambiá los cuatro.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-21" readingMinutes={6} faqs={FAQS}>
      <p>
        Es una duda de presupuesto muy concreta: o pongo cuatro neumáticos económicos, o pongo dos de marca y dejo los otros dos viejos.
        La respuesta cambia según cuánto desgaste tengan los que quedan, el tipo de tracción y qué priorizás.
      </p>

      <Callout title="La regla práctica" tone="ok">
        <p>
          Si los otros dos neumáticos ya están gastados a la mitad o más, o son de otro modelo, <strong>cambiá los cuatro</strong>. Si
          cambiás dos, que sean <strong>iguales entre sí</strong> y vayan en el <strong>eje trasero</strong>.
        </p>
      </Callout>

      <h2>Las tres opciones, con sus pros y contras</h2>
      <table>
        <thead>
          <tr><th>Opción</th><th>Ventaja</th><th>Costo oculto</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>4 económicos</strong></td><td>Juego parejo, alineación y desgaste uniformes, menor desembolso total</td><td>Algo menos de prestación fina en mojado y confort</td></tr>
          <tr><td><strong>2 de marca + 2 usados</strong></td><td>Desembolso más bajo que cuatro premium</td><td>Comportamiento desparejo; hay que volver a cambiar los otros dos pronto</td></tr>
          <tr><td><strong>4 de marca</strong></td><td>Máxima prestación</td><td>El desembolso más alto</td></tr>
        </tbody>
      </table>

      <h2>Cuándo cambiar los cuatro</h2>
      <ul>
        <li>Los dos que quedan tienen mucho desgaste o la edad (DOT) ya es alta.</li>
        <li>Los neumáticos actuales son de modelos distintos entre sí.</li>
        <li>Tu auto tiene tracción integral.</li>
        <li>Querés que la alineación y el balanceo empiecen de cero con un juego uniforme.</li>
      </ul>

      <h2>Cuándo alcanza con dos</h2>
      <ul>
        <li>Los otros dos son del mismo modelo y están bien (más de la mitad de banda útil).</li>
        <li>Tu auto es de tracción simple.</li>
        <li>Vas a poder rotar o volver a cambiar el otro par cuando toque.</li>
      </ul>
      <p>Los dos nuevos, <strong>iguales entre sí</strong>, al <strong>eje trasero</strong>. Tené en cuenta que rotar después entre ejes con neumáticos de desgaste muy distinto no ayuda: mirá la guía de <Link href="/blog/rotacion-de-neumaticos">rotación</Link>.</p>

      <h2>La cuenta: dos escenarios para pensar</h2>
      <p>
        Con números redondos de ejemplo (no son precios reales): un juego de cuatro económicos de $100.000 cada uno cuesta $400.000.
        Dos de marca a $200.000 cuestan lo mismo, $400.000, y dejan dos viejos delante que habrá que cambiar poco después. El primer
        escenario suele dar un juego parejo por el mismo dinero. Probá tus propios números con la{" "}
        <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">calculadora de costo por km</Link>.
      </p>

      <h2>Alineación y balanceo, siempre</h2>
      <p>
        Cualquier combinación mejora con una buena <Link href="/blog/alineacion-y-balanceo">alineación y balanceo</Link> al colocar.
        Es lo más barato que podés hacer para alargar la vida del juego.
      </p>

      <ClusterLinks current={SLUG} />
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
