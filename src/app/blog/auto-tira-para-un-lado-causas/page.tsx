import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "auto-tira-para-un-lado-causas";
const TITLE = "El auto tira para un lado: causas y qué hacer (alineado, presión y más)";
const SUBTITLE =
  "Antes de pensar en el alineado conviene descartar dos cosas más baratas. Cómo distinguir cada causa y en qué orden revisarlas.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Por qué el auto se va para un costado: alineación, presión despareja, neumáticos con conicidad, frenos que arrastran o suspensión gastada. Cómo diferenciarlas y qué hacer primero."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Por qué mi auto se va para un lado?",
    answer:
      "Las causas más comunes son la alineación fuera de parámetro, la presión despareja entre los neumáticos de un mismo eje, un neumático que tira por su construcción (conicidad), un freno que arrastra o piezas de suspensión y dirección gastadas. Casi siempre se resuelve con una de las dos primeras.",
  },
  {
    question: "¿Es normal que el auto se desvíe un poco hacia la banquina?",
    answer:
      "Sí, un poco. Las rutas y calles tienen un bombeo (el centro más alto que los costados) para que escurra el agua, y el auto tiende a acompañar esa pendiente. Lo que no es normal es una deriva fuerte, que cambia de lado según el tramo, o que aparece de golpe después de un golpe.",
  },
  {
    question: "¿Alinear arregla un auto que tira?",
    answer:
      "Si la causa es la alineación, sí. Si la causa es la presión, un neumático con conicidad o un freno trabado, alinear no lo resuelve y se paga de balde. Por eso conviene descartar presión y frenos antes.",
  },
  {
    question: "¿El volante torcido y el auto que tira son lo mismo?",
    answer:
      "No. Volante torcido es que el auto va derecho pero el volante no está centrado: suele ser convergencia. Auto que tira es que se va solo hacia un costado si soltás el volante: puede ser alineación, pero también presión, neumáticos o frenos.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-10-30" readingMinutes={5} faqs={FAQS}>
      <p>Vas por una recta, soltás un poco el volante y el auto se va hacia un costado. Es uno de los síntomas que más llevan a la gomería, y casi siempre se piensa en la alineación. A veces acertás, pero no siempre: hay causas más simples que conviene descartar primero.</p>

      <h2>Las cinco causas, de la más a la menos frecuente</h2>
      <table>
        <thead>
          <tr>
            <th>Causa</th>
            <th>Cómo se nota</th>
            <th>Cómo se verifica</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Alineación</strong></td>
            <td>Tira siempre al mismo lado; el volante puede quedar torcido; un borde del neumático se gasta.</td>
            <td>Con la alineadora, que mide los ángulos de las cuatro ruedas.</td>
          </tr>
          <tr>
            <td><strong>Presión despareja</strong></td>
            <td>Tira hacia el lado del neumático con menos aire; aparece o cambia de un día para otro.</td>
            <td>Medir las cuatro en frío y compararlas con la etiqueta de la puerta.</td>
          </tr>
          <tr>
            <td><strong>Neumático que tira</strong></td>
            <td>Se nota con neumáticos nuevos o distintos entre sí en un mismo eje.</td>
            <td>En el taller se cruzan los dos delanteros de lado: si el auto cambia de lado, era el neumático.</td>
          </tr>
          <tr>
            <td><strong>Freno que arrastra</strong></td>
            <td>Tira sobre todo al frenar, o una rueda sale más caliente y huele a quemado.</td>
            <td>Revisión de la pinza y los discos.</td>
          </tr>
          <tr>
            <td><strong>Suspensión o dirección gastadas</strong></td>
            <td>Golpeteos, juego en el volante, tira de forma irregular.</td>
            <td>Revisión de rótulas, bujes y terminales.</td>
          </tr>
        </tbody>
      </table>

      <h2>El orden para revisar sin gastar de más</h2>
      <ol>
        <li><strong>Presión.</strong> Medí las cuatro en frío y llevalas al valor de la <Link href="/blog/etiqueta-de-presion-puerta-del-auto">etiqueta de la puerta</Link>. Un neumático con 0,5 bar de menos alcanza para que el auto se desvíe.</li>
        <li><strong>Un golpe reciente.</strong> Si empezó después de un pozo o un cordón, mirá <Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">qué revisar después de un golpe</Link>: probablemente es la alineación, y conviene hacerla pronto.</li>
        <li><strong>Desgaste.</strong> Pasá la mano por la banda. Si un borde está más gastado, es alineación y el neumático ya está pagando el costo: <Link href="/blog/desgaste-irregular-de-neumaticos">qué significa cada patrón</Link>.</li>
        <li><strong>Frenos.</strong> Si tira al frenar, o una llanta está mucho más caliente que las otras después de rodar, que lo vean antes de alinear.</li>
        <li><strong>Alineación.</strong> Con lo anterior descartado, hacer el <Link href="/servicios/alineacion">alineado</Link> con equipo 3D, que mide los ángulos contra la ficha del fabricante de tu modelo.</li>
      </ol>

      <h2>Qué pasa si lo dejás pasar</h2>
      <p>Un auto que tira obliga a corregir con el volante todo el tiempo, cansa y, sobre todo, desgasta el neumático de un solo lado. Un juego bien cuidado puede quedar inutilizable mucho antes de tiempo por una desalineación que nadie corrigió. El alineado cuesta mucho menos que cambiar el juego, y es la forma de que lo que ya pagaste rinda todos sus kilómetros.</p>

      <h2>Cuándo conviene volver a alinear</h2>
      <p>Después de cualquier golpe fuerte, cuando se cambia un neumático o se toca la suspensión, y como control periódico. Los criterios completos están en cada cuántos kilómetros alinear y balancear. Si además vibra el volante, es otro problema: por qué vibra el volante.</p>
      <p>Para distinguir de un vistazo qué servicio corresponde a cada síntoma, la nota <Link href="/blog/sintomas-alineacion-balanceo-o-rotacion">alineación, balanceo o rotación</Link> lo resume en una tabla.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
