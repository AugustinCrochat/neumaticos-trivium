import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumatico-que-pierde-aire-solo-causas";
const TITLE = "Neumático que pierde aire solo: las causas más comunes y cómo encontrarla";
const SUBTITLE =
  "Válvula, obús, llanta, pinchadura lenta o talón: cómo diagnosticar una pérdida con agua y detergente y qué solución corresponde.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Por qué un neumático pierde aire solo: válvula u obús, pinchadura lenta, talón, llanta porosa o sensor. Cómo encontrar la pérdida con agua y detergente y cuál es la solución en cada caso.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Es normal que un neumático pierda un poco de aire?",
    answer:
      "Sí: todos pierden algo de presión con el tiempo, normalmente una pequeña cantidad por mes. Si la pérdida es de varias libras en pocos días, hay un problema.",
  },
  {
    question: "¿Cómo encuentro la pérdida?",
    answer:
      "Rociá agua con detergente en la banda, la válvula y el borde de la llanta: donde hace burbujas, pierde.",
  },
  {
    question: "¿El frío afecta la presión?",
    answer:
      "Sí. Cuando baja la temperatura, la presión baja un poco. Un descenso estacional no es una pérdida, pero hay que reponerlo.",
  },
  {
    question: "¿Y si es la llanta?",
    answer:
      "Una llanta de aleación puede perder por porosidad o corrosión en el borde donde apoya el talón. Se limpia, se sella o, si el daño es grande, se cambia.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Inflás el neumático y a la semana está bajo otra vez. Antes de cambiar nada, conviene encontrar la causa: la mayoría de las pérdidas se resuelven con una pieza barata o un sellado, y ahorrar en esa revisión sale caro porque con presión baja la cubierta se gasta y se daña.</p>

      <h2>Las causas, de más a menos común</h2>
      <ol>
      <li><strong>Válvula u obús:</strong> la goma se reseca y pierde, o el obús no sella bien. Es lo más barato y frecuente: <Link href="/blog/cambio-de-valvulas-de-neumaticos">cambio de válvulas</Link>.</li>
      <li><strong>Pinchadura lenta:</strong> un clavo, tornillo o vidrio chico en la banda. Se repara por dentro si está en la zona correcta: <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">cómo se repara</Link>.</li>
      <li><strong>Talón o llanta:</strong> suciedad, óxido o corrosión en el borde donde apoya la cubierta impiden un buen sellado. Se limpia al desarmar.</li>
      <li><strong>Llanta dañada:</strong> un golpe puede deformarla o rajarla: <Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">después de un golpe</Link>.</li>
      <li><strong>Sensor de presión (TPMS):</strong> en autos con sensor, las juntas del sensor también pueden fallar.</li>
      </ol>

      <h2>Cómo encontrar la pérdida</h2>
      <ol>
      <li>Inflá el neumático a la presión de la etiqueta.</li>
      <li>Mezclá agua con detergente y rociá la válvula, el obús, la banda y el borde de la llanta.</li>
      <li>Mirá dónde aparecen burbujas: ahí está la fuga.</li>
      </ol>
      <p>Si no la encontrás en casa, en el taller se hace con la rueda desmontada, que permite ver también el lado interno.</p>

      <h2>Qué no hacer</h2>
      <ul>
      <li>No sigas inflando «cada tanto» sin buscar la causa: con presión baja el neumático se calienta y se daña.</li>
      <li>No uses selladores permanentes sin saber qué hacen: complican la reparación posterior.</li>
      </ul>

      <h2>Cuándo es el frío</h2>
      <p>En invierno la presión baja un poco con la temperatura. Es normal reponer aire en esa época. La rutina de <Link href="/blog/revision-mensual-de-neumaticos-en-5-minutos">revisión mensual</Link> te avisa antes de que se note. Más información en <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link> y en la <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">guía para ahorrar</Link>.</p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
