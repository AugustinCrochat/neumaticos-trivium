import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-en-verano-calor-presion-y-ruta";
const TITLE = "Neumáticos en verano: calor, presión y ruta, lo que conviene revisar";
const SUBTITLE =
  "El calor sube la presión, pero el riesgo real es salir con las ruedas bajas, el auto cargado y horas de autopista por delante.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cómo afecta el calor del verano a los neumáticos: presión en frío, por qué no hay que desinflar en caliente, carga del auto y revisión antes de salir a la ruta."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Hay que inflar menos en verano porque el calor sube la presión?",
    answer:
      "No. La presión que indica el fabricante es en frío y ya contempla que el neumático se calienta al rodar. Lo correcto es medir en frío e inflar al valor de la etiqueta, también en verano.",
  },
  {
    question: "Medí en caliente y me dio más presión, ¿desinflo?",
    answer:
      "No. Es normal que suba con el neumático caliente. Si sacás aire en ese momento, cuando se enfríe va a quedar por debajo de lo indicado.",
  },
  {
    question: "¿Por qué revientan más neumáticos en verano?",
    answer:
      "Por la suma de presión baja, auto cargado, velocidad sostenida y asfalto caliente: el flanco se deforma de más, se recalienta y la estructura cede. El neumático viejo o con golpes previos es el primero en fallar.",
  },
  {
    question: "¿Qué presión pongo con el auto cargado?",
    answer:
      "La que indica la etiqueta del auto para carga completa, que suele ser más alta que la de uso diario, sobre todo atrás.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Mantenimiento" date="2026-12-08" readingMinutes={4} faqs={FAQS}>
      <p>En verano se juntan tres cosas: el asfalto está más caliente, el auto sale cargado y se hacen muchas horas seguidas a velocidad de ruta. Ninguna rompe un neumático en buen estado y bien inflado. El problema aparece cuando falta presión.</p>

      <h2>Qué hace el calor con la presión</h2>
      <p>El aire se expande al calentarse: por cada diez grados, la presión sube alrededor de una o dos libras. Por eso el valor del fabricante se da <strong>en frío</strong>, con el auto parado hace un par de horas o después de rodar pocas cuadras. Ese valor ya tiene en cuenta que el neumático trabaja caliente.</p>
      <p>De ahí salen las dos reglas del verano: <strong>medir en frío</strong> y <strong>no sacar aire en caliente</strong>. Los valores y el paso a paso están en <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link>.</p>

      <h2>El verdadero riesgo: la rueda baja</h2>
      <p>Un neumático con poca presión flexiona más en cada vuelta. Esa flexión genera calor dentro de la goma, más todavía si el auto va cargado y a 120 km/h durante horas. Cuando el flanco se recalienta, la estructura se debilita y puede fallar de golpe. Casi todos los reventones de ruta empiezan así, no por «demasiada» presión.</p>

      <h2>Antes de salir</h2>
      <table>
        <thead><tr><th>Qué revisar</th><th>Qué buscar</th></tr></thead>
        <tbody>
          <tr><td>Presión, en frío</td><td>El valor «con carga» de la <Link href="/blog/etiqueta-de-presion-puerta-del-auto">etiqueta de la puerta</Link></td></tr>
          <tr><td>Flancos</td><td>Cortes, <Link href="/blog/burbuja-en-el-flanco-del-neumatico">burbujas</Link> o grietas</td></tr>
          <tr><td>Dibujo</td><td>Testigos de desgaste y desgaste desparejo</td></tr>
          <tr><td>Antigüedad</td><td><Link href="/blog/antiguedad-del-neumatico-codigo-dot">Fecha de fabricación</Link>: la goma vieja tolera peor el calor</td></tr>
          <tr><td>Rueda de auxilio</td><td>Que tenga presión: <Link href="/blog/rueda-de-auxilio-como-revisarla">cómo revisarla</Link></td></tr>
          <tr><td>Válvulas y tapitas</td><td>Que no pierdan y que estén todas</td></tr>
        </tbody>
      </table>
      <p>La lista completa, con herramientas y tuercas, está en <Link href="/blog/revision-antes-de-viajar-neumaticos">revisión antes de viajar</Link>.</p>

      <h2>En el viaje</h2>
      <ul>
        <li>En cada parada larga, una mirada a las cuatro ruedas alcanza para ver una que viene baja.</li>
        <li>Si el auto empieza a tirar o a vibrar, pará: puede ser una pérdida.</li>
        <li>No sobrecargues: el peso máximo también está en la etiqueta del auto.</li>
      </ul>

      <h2>Si llegás al verano con las cubiertas justas</h2>
      <p>Un neumático al límite de dibujo o con varios años encima es el que peor lleva el calor y la lluvia de verano. Si dudás, <Link href="/herramientas/cuando-cambiar-neumaticos">esta herramienta</Link> te dice si conviene cambiarlo antes de viajar. Y si hace tiempo que no alineás, hacelo antes de las vacaciones: el <Link href="/servicios/combo-alineado-y-balanceado">alineado y balanceado</Link> es sin turno, por orden de llegada.</p>
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
