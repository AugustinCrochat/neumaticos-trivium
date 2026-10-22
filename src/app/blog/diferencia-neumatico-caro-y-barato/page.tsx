import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "diferencia-neumatico-caro-y-barato";
const TITLE = "Neumático caro vs. barato: qué cambia de verdad";
const SUBTITLE =
  "Compuesto, frenado en mojado, ruido, consistencia y garantía: las diferencias reales entre una marca premium y una alternativa, y las que son puro marketing.";

export const metadata: Metadata = {
  ...blogShare("diferencia-neumatico-caro-y-barato"),
  title: TITLE,
  description:
    "Diferencia entre un neumático caro y uno barato: frenado en mojado, ruido, consistencia, durabilidad y garantía. Qué diferencias son reales y cuáles son marketing, con una tabla comparativa.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Un neumático caro frena mejor?",
    answer:
      "En promedio, los modelos premium suelen obtener mejores calificaciones de frenado en mojado, que es donde más se nota la diferencia. Pero depende del modelo: hay económicos con buena nota y premium de rendimiento deportivo que sacrifican otros aspectos. La etiqueta europea permite compararlo con datos.",
  },
  {
    question: "¿Un neumático caro dura más?",
    answer:
      "No necesariamente. Los modelos de alto rendimiento usan compuestos más blandos que agarran más y se gastan antes. La durabilidad depende del compuesto, del diseño y de cómo se use, no del precio en sí.",
  },
  {
    question: "¿Un neumático barato se pincha más?",
    answer:
      "No hay una relación demostrada entre el precio y la frecuencia de pinchaduras. Éstas dependen del estado del camino, la presión y la edad del neumático. La resistencia a golpes de flanco sí varía por construcción.",
  },
  {
    question: "¿Qué diferencias son puro marketing?",
    answer:
      "El prestigio de la marca por sí solo, los nombres comerciales de tecnologías sin datos medibles y las promesas de kilómetros sin indicar condiciones. Conviene pedir datos comparables: etiqueta europea, ficha técnica, garantía escrita.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-21" readingMinutes={7} faqs={FAQS}>
      <p>
        Dos neumáticos de la misma medida pueden costar el doble uno que otro. ¿Qué compra la diferencia? Esta nota ordena lo que sí
        cambia de lo que no, sin dar por hecho que caro es siempre mejor ni que barato es siempre igual.
      </p>

      <h2>La tabla de lo que cambia (y lo que no)</h2>
      <table>
        <thead>
          <tr><th>Aspecto</th><th>Premium</th><th>Alternativa homologada</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Seguridad estructural</strong></td><td>Cumple homologación</td><td>Cumple homologación (si la tiene)</td></tr>
          <tr><td><strong>Frenado en mojado</strong></td><td>Suele ser mejor</td><td>Varía mucho por modelo</td></tr>
          <tr><td><strong>Ruido y confort</strong></td><td>Suele ser mejor</td><td>Aceptable; más ruido en algunos</td></tr>
          <tr><td><strong>Consistencia entre unidades</strong></td><td>Alta</td><td>Algo más variable</td></tr>
          <tr><td><strong>Durabilidad</strong></td><td>Depende del modelo</td><td>Depende del modelo</td></tr>
          <tr><td><strong>Garantía y red de servicio</strong></td><td>Global</td><td>La del vendedor/importador</td></tr>
          <tr><td><strong>Precio</strong></td><td>Alto</td><td>Menor</td></tr>
        </tbody>
      </table>
      <p>
        «Varía por modelo» es la clave: no se puede decidir solo por la categoría. Hay alternativas con buena nota y premium que
        priorizan otra cosa.
      </p>

      <h2>Lo que sí cambia</h2>
      <h3>Frenado en mojado</h3>
      <p>
        Es la diferencia más importante en seguridad. Entre la mejor y la peor clase de la etiqueta se suele citar una diferencia de
        varios metros —hasta unos 18 m según estimaciones de la Comisión Europea al frenar desde 80 km/h—. Es el dato que más conviene
        mirar si manejás con lluvia. Cómo leerlo: <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link>.
      </p>
      <h3>Ruido y confort</h3>
      <p>Las bandas silenciosas y los compuestos más finos se pagan. En viajes largos se agradece; en ciudad, mucho menos.</p>
      <h3>Consistencia</h3>
      <p>Menos dispersión entre unidades y entre lotes: que el neumático que compraste hoy se comporte como el de la reseña.</p>

      <h2>Lo que no cambia (si está homologado)</h2>
      <ul>
        <li><strong>El piso de seguridad estructural.</strong> Ambos superan ensayos de carga, velocidad y resistencia exigidos.</li>
        <li><strong>La medida y los índices.</strong> Los exigidos por tu vehículo son los mismos.</li>
        <li><strong>La necesidad de buena presión, alineación y balanceo.</strong> Ninguna marca los reemplaza.</li>
      </ul>

      <Callout title="Mitos comunes" tone="warn">
        <ul>
          <li><strong>«Caro = dura más».</strong> No: los de alto rendimiento suelen gastarse antes.</li>
          <li><strong>«Barato = peligroso».</strong> No si está homologado; sí si no lo está.</li>
          <li><strong>«La marca lo garantiza todo».</strong> No corrige una mala alineación ni una presión incorrecta.</li>
        </ul>
      </Callout>

      <h2>Cómo decidir con datos</h2>
      <ol>
        <li>Mirá la <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link> o la ficha técnica de cada opción.</li>
        <li>Calculá el costo por kilómetro (<Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>).</li>
        <li>Verificá homologación y fecha (<Link href="/blog/como-elegir-neumatico-importado-seguro">checklist</Link>).</li>
        <li>Pensá tu uso: <Link href="/blog/neumaticos-economicos-para-uso-urbano">ciudad</Link> o ruta exigente.</li>
      </ol>
      <p>
        La guía de cierre está en <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">marca vs. importados</Link>.
      </p>

      <ClusterLinks current={SLUG} />
    </ArticleLayout>
  );
}
