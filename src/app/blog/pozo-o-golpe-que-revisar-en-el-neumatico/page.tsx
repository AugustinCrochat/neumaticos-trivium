import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "pozo-o-golpe-que-revisar-en-el-neumatico";
const TITLE = "Te comiste un pozo: qué revisar en el neumático y la llanta después del golpe";
const SUBTITLE =
  "Un golpe fuerte puede dañar la cubierta por dentro sin dejar marcas a la vista. Qué mirar, qué síntomas avisan y cuándo ir al taller.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Qué revisar en el neumático y la llanta después de golpear un pozo, un bache o un cordón: burbujas, vibración, auto que tira, llanta torcida. Cuándo alinear y cuándo cambiar la cubierta."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Un pozo puede romper un neumático sin que se vea?",
    answer:
      "Sí. El impacto puede cortar las cuerdas internas de la carcasa y el daño se manifiesta después como una burbuja o un bulto en el flanco, aunque por fuera no haya marca inmediata.",
  },
  {
    question: "¿Cómo sé si el golpe me desalineó el auto?",
    answer:
      "Si después del impacto el volante queda torcido, el auto tira hacia un lado o notás desgaste desparejo a las semanas, hay que revisarlo. Un alineado 3D lo mide.",
  },
  {
    question: "¿Se puede reparar una llanta torcida?",
    answer:
      "Depende del daño y del material. Las llantas de chapa a veces se enderezan; las de aleación, con golpe grande, suelen requerir cambio. Se detecta al balancear la rueda.",
  },
  {
    question: "¿Frenar fuerte antes del pozo ayuda?",
    answer:
      "Reducir la velocidad antes del pozo ayuda. Lo que conviene evitar es frenar con fuerza justo en el impacto, que carga más la suspensión y la rueda.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>En las calles de cualquier ciudad es cuestión de tiempo: un pozo, un cordón que no viste, un badén tomado de más. Muchos golpes no pasan de un susto, pero otros dejan el neumático o el tren delantero dañados sin que se note de inmediato. Lo que hagas en los días siguientes define si es un gasto chico o uno grande.</p>

      <h2>Qué se puede dañar</h2>
      <ul>
      <li><strong>El neumático por dentro:</strong> el impacto puede cortar las cuerdas de la carcasa. Se nota con el tiempo como una <Link href="/blog/burbuja-en-el-flanco-del-neumatico">burbuja en el flanco</Link>.</li>
      <li><strong>La llanta:</strong> puede abollarse o torcerse, lo que provoca vibración y pérdida de aire.</li>
      <li><strong>La alineación:</strong> el golpe mueve los ángulos y el auto empieza a tirar o a gastar un costado.</li>
      </ul>

      <h2>Qué revisar apenas pasó</h2>
      <ol>
      <li>Mirá los flancos de la rueda golpeada con una linterna: cortes, bultos, escalones.</li>
      <li>Controlá la presión: si cayó, puede haber una pérdida en el talón o la llanta.</li>
      <li>Manejá unas cuadras con atención: ¿vibra? ¿el volante quedó torcido? ¿tira hacia un lado?</li>
      <li>Pasá a revisarlo en el taller si hubo un golpe fuerte, aunque todo parezca normal.</li>
      </ol>

      <h2>Síntomas que avisan después</h2>
      <table>
      <thead><tr><th>Síntoma</th><th>Probable causa</th></tr></thead>
      <tbody>
      <tr><td>El auto tira hacia un lado</td><td>Desalineado</td></tr>
      <tr><td>Vibración en el volante</td><td>Llanta torcida o desbalanceo</td></tr>
      <tr><td>Bulto o burbuja en el flanco</td><td>Carcasa dañada: cambio</td></tr>
      <tr><td>Pierde aire seguido</td><td>Talón o llanta dañados</td></tr>
      </tbody>
      </table>
      <p>Si no estás seguro de qué es, mirá <Link href="/blog/sintomas-alineacion-balanceo-o-rotacion">alineado, balanceado o rotación: cómo distinguirlos</Link>.</p>

      <h2>Cómo evitar el golpe</h2>
      <ul>
      <li>Bajá la velocidad antes del pozo y soltá el freno justo antes de pasar.</li>
      <li>Mantené la presión correcta: un neumático con poca presión se daña más fácil con el impacto.</li>
      <li>Dejá distancia con el auto de adelante para ver el camino.</li>
      </ul>

      <h2>Qué hacer en el taller</h2>
      <p>Con el auto en el elevador se revisa la cubierta por fuera y por dentro, se balancea la rueda (ahí se detecta una llanta torcida) y se mide el <Link href="/servicios/alineacion">alineado</Link>. Es mucho más barato que seguir manejando con un tren delantero desajustado y gastar las cubiertas. Más ideas para gastar menos en la <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">guía completa</Link>.</p>
      <EquipoHofmann />
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
