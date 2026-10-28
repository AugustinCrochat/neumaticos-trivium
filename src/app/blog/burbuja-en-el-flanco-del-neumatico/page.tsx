import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "burbuja-en-el-flanco-del-neumatico";
const TITLE = "Burbuja en el flanco del neumático: por qué aparece y por qué hay que cambiarlo";
const SUBTITLE =
  "Es una de las pocas fallas que no admiten esperar. Qué es, qué la causa y qué hacer si la encontrás.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué es una burbuja o bulto en el flanco del neumático, por qué se produce, por qué no se repara y qué hacer si la encontrás. Riesgo de reventón y cómo prevenirla.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es la burbuja en el flanco?",
    answer:
      "Es un bulto que aparece cuando se cortan las cuerdas internas de la carcasa y el aire empuja la goma hacia afuera. Indica que esa zona perdió resistencia.",
  },
  {
    question: "¿Se puede reparar?",
    answer:
      "No. El flanco trabaja flexionándose todo el tiempo y no admite parches ni tarugos. La cubierta con burbuja se cambia.",
  },
  {
    question: "¿Puedo seguir manejando con una burbuja?",
    answer:
      "No conviene. Puede reventar, y más a velocidad o con calor. Si la encontrás, evitá la ruta, bajá la velocidad y cambiá la rueda por la de auxilio.",
  },
  {
    question: "¿La causa suele ser un golpe?",
    answer:
      "Sí: pozos, cordones y baches, sobre todo con presión baja. También puede haber un defecto de fabricación, aunque es menos frecuente.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={4} faqs={FAQS}>
      <p>Un bulto en el costado del neumático, como una pelota chica que sobresale, es una burbuja. Es una de las pocas fallas que no admiten esperar ni reparación: la cubierta pierde resistencia en ese punto y puede reventar.</p>

      <h2>Qué la causa</h2>
      <ul>
      <li><strong>Golpes:</strong> un pozo, un bache o un cordón cortan las cuerdas internas aunque por fuera no se vea nada. Mirá <Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">qué revisar después de un golpe</Link>.</li>
      <li><strong>Presión baja:</strong> con poco aire el flanco se aplasta más en el impacto. Por eso importa la <Link href="/blog/presion-de-neumaticos">presión correcta</Link>.</li>
      <li><strong>Roce contra cordones</strong> al estacionar.</li>
      <li><strong>Defecto de fabricación:</strong> poco frecuente, y casi siempre aparece en las primeras semanas.</li>
      </ul>

      <h2>Cómo detectarla</h2>
      <p>Se ve y se siente: un bulto, una ondulación o una zona del flanco que sobresale. A veces se nota más con la rueda en movimiento, como un «salto» del volante. Por eso en la <Link href="/blog/revision-mensual-de-neumaticos-en-5-minutos">revisión mensual</Link> conviene pasar la mano por los flancos.</p>

      <h2>Qué hacer si la encontrás</h2>
      <ol>
      <li>No viajes con esa rueda ni circules a alta velocidad.</li>
      <li>Cambiá a la rueda de auxilio: <Link href="/blog/como-cambiar-una-rueda-paso-a-paso">paso a paso</Link>.</li>
      <li>Llevá la cubierta al taller para confirmarlo y reemplazarla.</li>
      </ol>
      <p>Si hay una burbuja y reemplazás solo una cubierta, revisá antes si conviene el par: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">un solo neumático o de a pares</Link>.</p>

      <h2>Por qué no se repara</h2>
      <p>Las <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">pinchaduras</Link> se reparan en la banda de rodamiento, que es una zona rígida. El flanco se flexiona constantemente y no soporta un parche. Una burbuja es daño estructural, no un agujero.</p>

      <h2>Cómo prevenirla</h2>
      <ul>
      <li>Presión correcta, siempre.</li>
      <li>Despacio en pozos y badenes.</li>
      <li>No rozar la rueda contra los cordones.</li>
      </ul>
      <p>Más hábitos para gastar menos en <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">la guía completa</Link>.</p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
