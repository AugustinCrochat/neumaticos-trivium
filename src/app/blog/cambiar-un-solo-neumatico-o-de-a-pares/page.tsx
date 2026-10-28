import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cambiar-un-solo-neumatico-o-de-a-pares";
const TITLE = "¿Se puede cambiar un solo neumático o hay que cambiar de a pares?";
const SUBTITLE =
  "Pinchaste o se dañó una cubierta y las otras tienen uso. Cuándo alcanza con una, cuándo conviene el par y qué hacer si el auto es 4x4.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cambiar un solo neumático: cuándo se puede, qué diferencia de desgaste es tolerable, por qué conviene el par en el mismo eje y qué pasa en autos 4x4 o AWD.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Puedo cambiar un solo neumático?",
    answer:
      "Se puede, pero depende de cuánto desgaste tienen los otros. Si los demás están casi nuevos, una cubierta igual (misma marca, modelo y medida) funciona bien. Si tienen la mitad del dibujo o menos, la diferencia de diámetro y de agarre se nota, y conviene cambiar el par del mismo eje.",
  },
  {
    question: "¿Por qué se recomienda cambiar de a pares?",
    answer:
      "Un neumático nuevo tiene más diámetro y más agarre que uno gastado. En el mismo eje, esa diferencia hace que el auto tire hacia un lado, y puede afectar el frenado y el trabajo del diferencial. Con un par igual en el eje, el comportamiento es parejo.",
  },
  {
    question: "Me pinchó y no se puede reparar: ¿qué hago?",
    answer:
      "Primero fijate si tenés una cubierta igual: en la gomería se compara el dibujo de las otras tres. Si el resto tiene poco uso, se coloca una nueva idéntica. Si no, se cambia el par del eje. Antes revisá si la pinchadura es reparable: depende de dónde está el daño.",
  },
  {
    question: "¿Cuánta diferencia de desgaste es aceptable?",
    answer:
      "Para autos de tracción simple no hay una cifra única, pero una referencia habitual es que no haya más de unos 3 a 4 mm de diferencia de profundidad entre la nueva y las demás. En 4x4 y AWD el margen es menor y lo fija el fabricante en el manual.",
  },
  {
    question: "¿Y si no encuentro el mismo modelo?",
    answer:
      "Entonces se cambia el par completo del eje con un modelo que esté disponible. Poner una sola cubierta de otro dibujo en un eje es la peor combinación: cada lado agarra distinto.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-27" readingMinutes={5} faqs={FAQS}>
      <p>
        Una cubierta se rompió o se pinchó sin arreglo, las otras tres tienen kilómetros y no querés
        gastar en un juego completo. La pregunta es razonable: ¿alcanza con una sola? La respuesta corta
        es que a veces sí, pero depende de cuánto uso tienen las demás.
      </p>

      <Callout title="Resumen" tone="ok">
        <p>
          Una sola cubierta nueva funciona <strong>si las otras están poco gastadas</strong> y es{" "}
          <strong>idéntica</strong> a ellas. Si las otras tienen mucho uso, cambiá el <strong>par del
          mismo eje</strong>. En 4x4 o AWD, lo más seguro es cambiar las cuatro.
        </p>
      </Callout>

      <h2>Qué pasa al mezclar una nueva con tres usadas</h2>
      <ul>
        <li>
          <strong>Diámetro distinto:</strong> la cubierta nueva es algo más grande. En el mismo eje, el auto
          puede tirar hacia un costado, y en autos con diferencial o sistemas de control de tracción,
          trabaja de más.
        </li>
        <li>
          <strong>Agarre distinto:</strong> una cubierta con dibujo profundo agarra más sobre mojado que su
          par gastado, así que el auto frena y dobla desparejo.
        </li>
        <li>
          <strong>Desgaste acelerado:</strong> la nueva carga más de la cuenta hasta que las demás se le
          acercan.
        </li>
      </ul>

      <h2>Cuándo alcanza con una</h2>
      <ul>
        <li>Las otras tres tienen pocos kilómetros (el dibujo casi no bajó).</li>
        <li>La nueva es exactamente igual: marca, modelo, medida e índices.</li>
        <li>El auto es de tracción simple, no integral.</li>
        <li>Se coloca en el eje trasero, con alineación y balanceo hechos.</li>
      </ul>

      <h2>Cuándo conviene el par</h2>
      <ul>
        <li>Las otras ya perdieron más de la mitad del dibujo.</li>
        <li>No conseguís el mismo modelo.</li>
        <li>Querés que el par del eje quede igual de agarre y de desgaste.</li>
      </ul>
      <p>
        En ese caso los dos nuevos van al eje trasero:{" "}
        <Link href="/blog/neumaticos-nuevos-adelante-o-atras">te explicamos por qué</Link>.
      </p>

      <h2>Y si el auto es 4x4 o AWD</h2>
      <p>
        Es el caso más delicado: una diferencia de diámetro entre ruedas fuerza los diferenciales y el
        reparto de torque. Lo desarrollamos en{" "}
        <Link href="/blog/cambiar-los-cuatro-neumaticos-en-4x4-o-awd">por qué conviene cambiar las cuatro</Link>.
      </p>

      <h2>Antes de cambiarla, ¿se puede reparar?</h2>
      <p>
        No toda pinchadura obliga a comprar una cubierta nueva. Si el clavo quedó en la banda de rodamiento
        y no en el flanco, se puede reparar bien por dentro:{" "}
        <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">parche y mecha, cuándo se puede y cuándo no</Link>.
      </p>

      <h2>Cómo decidir en el local</h2>
      <p>
        Traé el auto y mirá con nosotros la profundidad de las otras tres: con la medida se compara
        en un minuto si una nueva alcanza o si conviene el par. Buscá tu medida en el{" "}
        <Link href="/catalogo">catálogo</Link> o consultanos por WhatsApp.
      </p>
    </ArticleLayout>
  );
}
