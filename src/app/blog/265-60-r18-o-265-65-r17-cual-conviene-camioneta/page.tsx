import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { canonical, resumen } from "@/lib/seo";
import { ServicioHoyCTA } from "@/components/servicios/ServicioHoyCTA";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "265-60-r18-o-265-65-r17-cual-conviene-camioneta";
const TITLE = "265/60 R18 o 265/65 R17: cuál conviene para tu camioneta";
const SUBTITLE =
  "Mismo diámetro, distinto rodado. Qué cambia en confort, manejo, golpes y presupuesto entre las dos medidas de las pickups medianas, y cuándo vale la pena cambiar de una a otra.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("265/60 R18 o 265/65 R17 en una Hilux, Ranger o S10: el diámetro es casi igual (775,2 y 776,3 mm), pero cambia el flanco, el confort y el costo de la llanta. Cuál conviene y qué revisar."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Es lo mismo 265/60 R18 que 265/65 R17?",
    answer:
      "En diámetro total, casi: 775,2 mm contra 776,3 mm, una diferencia de 0,1 %. Pero no son intercambiables en la misma llanta: una es para llanta de 18 pulgadas y la otra para llanta de 17. Lo que cambia es el flanco: 159 mm contra 172,25 mm.",
  },
  {
    question: "¿Se nota la diferencia de manejo entre las dos?",
    answer:
      "Un poco. El 265/60 R18 tiene menos flanco, así que responde algo más directo en curva y se ve más deportivo; el 265/65 R17 tiene más colchón de goma, absorbe mejor los pozos y protege más la llanta en ripio y calles rotas. En uso diario de camioneta la diferencia es chica comparada con el tipo de neumático (A/T o H/T).",
  },
  {
    question: "¿Puedo poner llantas de 17 en una camioneta que trae llantas de 18?",
    answer:
      "Se puede mientras el diámetro total sea casi el mismo (como acá) y las llantas entren sobre los frenos y tengan el offset y la carga correctos. Conviene confirmarlo con el vendedor de las llantas y en el taller antes de comprar.",
  },
  {
    question: "¿Cuál es más barata de mantener?",
    answer:
      "Depende de lo que haya disponible en el momento. Sin contar las llantas, entre las dos medidas el precio por neumático suele ser parecido; lo que más pesa es la marca y el tipo (A/T o H/T). Lo más seguro es mirar el stock y el precio de cada una el día que vayas a comprar.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-11-14" readingMinutes={5} faqs={FAQS}>
      <p>Si tenés una Hilux, una Ranger o una S10, tu camioneta probablemente trae una de dos medidas según la versión: 265/65 R17 en las intermedias y 265/60 R18 en las altas (SRX, Limited, LTZ). Con el tiempo muchos se preguntan si conviene pasarse de una a la otra, o cuál elegir cuando hay que cambiar llantas y cubiertas a la vez.</p>

      <h2>Qué tienen igual y qué cambia</h2>
      <table>
      <thead><tr><th></th><th>265/60 R18</th><th>265/65 R17</th></tr></thead>
      <tbody>
      <tr><td>Ancho</td><td>265 mm</td><td>265 mm</td></tr>
      <tr><td>Flanco</td><td>159 mm</td><td>172,25 mm</td></tr>
      <tr><td>Llanta</td><td>18 pulgadas</td><td>17 pulgadas</td></tr>
      <tr><td>Diámetro total</td><td>775,2 mm</td><td>776,3 mm</td></tr>
      <tr><td>Vueltas por km</td><td>≈ 411</td><td>≈ 410</td></tr>
      </tbody>
      </table>
      <p>El diámetro es prácticamente el mismo, así que el velocímetro y el cuentakilómetros no cambian. Lo que sí cambia es cuánta goma hay entre la llanta y el piso.</p>

      <h2>Cuándo conviene 265/65 R17</h2>
      <ul>
      <li><strong>Ruta de ripio o tierra, y calles rotas:</strong> 13 mm más de flanco absorben mejor los golpes y protegen la llanta de un bache o una piedra.</li>
      <li><strong>Uso con carga o acoplado:</strong> el flanco más alto trabaja más cómodo con peso.</li>
      <li><strong>Si ya tenés llantas de 17</strong> (versiones SR y SRV de Hilux, XLT de Ranger).</li>
      </ul>

      <h2>Cuándo conviene 265/60 R18</h2>
      <ul>
      <li><strong>Mayoría asfalto:</strong> algo más de precisión al manejar, y la estética de la llanta de 18.</li>
      <li><strong>Si tu camioneta ya viene con llantas de 18</strong> (SRX, Limited, LTZ): no tiene sentido cambiar de llanta solo por la medida.</li>
      </ul>

      <h2>Qué revisar antes de cambiar de rodado</h2>
      <ol>
      <li><strong>Que las llantas nuevas entren:</strong> ancho de la llanta, offset (ET) y que liberen los frenos. Una llanta mal elegida roza o carga mal los rodamientos.</li>
      <li><strong>Índice de carga:</strong> que el neumático nuevo tenga igual o mayor índice que el de la etiqueta de la puerta. Detalle en <Link href="/blog/indice-de-carga-y-velocidad">carga y velocidad</Link>.</li>
      <li><strong>Las cuatro ruedas iguales:</strong> en una 4x4 no mezcles diámetros. Más en <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro neumáticos</Link>.</li>
      <li><strong>Alineado y balanceado al terminar:</strong> con ruedas nuevas conviene dejar la camioneta alineada y balanceada. Para camionetas hay <Link href="/servicios/combo-alineado-y-balanceado">precio propio</Link> y explicamos el detalle en <Link href="/blog/alineado-y-balanceado-en-camionetas-y-4x4">alineado y balanceado en camionetas</Link>.</li>
      </ol>

      <ServicioHoyCTA />

      <h2>Las dos medidas en stock</h2>
      <CatalogWidget size={{ width: 265, profile: 60, rim: 18 }} title="265/60 R18 en stock hoy" />
      <CatalogWidget size={{ width: 265, profile: 65, rim: 17 }} title="265/65 R17 en stock hoy" />
      <p>Para ver qué camionetas lleva cada una, leé <Link href="/blog/neumaticos-265-60-r18-autos-que-la-usan">265/60 R18: qué camionetas la usan</Link> y <Link href="/blog/neumaticos-265-65-r17-autos-que-la-usan">265/65 R17: qué autos la usan</Link>. Para decidir el tipo de neumático: <Link href="/blog/at-o-ht-cual-conviene-para-tu-camioneta">A/T o H/T</Link>. Podés confirmar cualquier equivalencia en la <Link href="/calculadora-equivalencia-neumaticos">calculadora</Link>.</p>
    </ArticleLayout>
  );
}
