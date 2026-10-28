import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "revision-mensual-de-neumaticos-en-5-minutos";
const TITLE = "Revisión mensual de neumáticos en 5 minutos: qué mirar y cómo hacerlo";
const SUBTITLE =
  "Presión, dibujo, flancos y válvulas: una rutina corta que detecta la mayoría de los problemas antes de que cuesten plata.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo revisar tus neumáticos en 5 minutos una vez por mes: presión en frío, profundidad del dibujo, cortes y burbujas en los flancos, válvulas y desgaste parejo. Con checklist.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cada cuánto hay que revisar los neumáticos?",
    answer:
      "Una vez por mes y siempre antes de un viaje largo. Si el auto carga mucho peso o hace muchos kilómetros por día, conviene cada dos semanas.",
  },
  {
    question: "¿Por qué hay que medir la presión en frío?",
    answer:
      "Porque al rodar el aire se calienta y la presión sube. La medición correcta es con el auto parado hace al menos unas horas o después de recorrer pocas cuadras.",
  },
  {
    question: "¿Cómo sé si el dibujo está gastado?",
    answer:
      "Todos los neumáticos tienen indicadores de desgaste (testigos) en las canaladuras: cuando la banda llega a su altura, el dibujo está en el límite de 1,6 mm. Para lluvia conviene cambiarlos antes, cuando quedan unos 3 mm. Con una moneda también se estima: si se ve toda la figura, ya está bajo.",
  },
  {
    question: "¿Y la rueda de auxilio?",
    answer:
      "Se revisa igual, porque es la que más se olvida. Mirá la presión y el estado cada vez que revisás las otras cuatro.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Casi todos los problemas de neumáticos avisan antes: una presión que bajó, un costado que se gasta más, una grieta chica. El truco es mirar. Con esta rutina de cinco minutos, una vez por mes, evitás los gastos grandes y alargás la vida del juego.</p>

      <h2>Lo que necesitás</h2>
      <ul>
      <li>Un medidor de presión (o el de la estación de servicio).</li>
      <li>Una linterna del celular.</li>
      <li>La etiqueta de presión de la puerta del auto: <Link href="/blog/etiqueta-de-presion-puerta-del-auto">cómo leerla</Link>.</li>
      </ul>

      <h2>Los 5 pasos</h2>
      <ol>
      <li><strong>Presión, en frío.</strong> Medí las cuatro y la de auxilio y llevalas al valor de la etiqueta. Guía completa en <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link>.</li>
      <li><strong>Dibujo.</strong> Buscá los testigos en las canaladuras. Si la banda está pareja con ellos, hay que cambiar. Más en <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cada cuántos kilómetros cambiarlos</Link>.</li>
      <li><strong>Desgaste parejo.</strong> Pasá la mano por la banda: si un costado está más bajo o hay escalones, algo está mal. Qué significa cada patrón: <Link href="/blog/desgaste-irregular-de-neumaticos">desgaste irregular</Link>.</li>
      <li><strong>Flancos y banda.</strong> Mirá con la linterna: cortes, grietas, bultos o objetos clavados. Una <Link href="/blog/burbuja-en-el-flanco-del-neumatico">burbuja</Link> es motivo de cambio.</li>
      <li><strong>Válvulas.</strong> Que tengan su tapita y no estén torcidas ni agrietadas: <Link href="/blog/cambio-de-valvulas-de-neumaticos">cuándo se cambian</Link>.</li>
      </ol>

      <h2>Cuándo ir al taller</h2>
      <ul>
      <li>El auto <strong>tira</strong> hacia un lado o el volante no queda derecho: probablemente alineado.</li>
      <li>El volante o el asiento <strong>vibran</strong> a ciertas velocidades: balanceado.</li>
      <li>Un neumático pierde aire seguido: <Link href="/blog/neumatico-que-pierde-aire-solo-causas">causas más comunes</Link>.</li>
      </ul>
      <p>Si dudás entre alineado, balanceado o rotación, mirá <Link href="/blog/sintomas-alineacion-balanceo-o-rotacion">cómo distinguir los síntomas</Link>.</p>

      <h2>Anotá la fecha</h2>
      <p>Poné un recordatorio mensual en el celular. Y revisá también la edad del neumático, que cuenta aunque se use poco: <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link>. Todo el sistema para gastar menos está en la <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">guía completa</Link>.</p>
      <EquipoHofmann />
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
