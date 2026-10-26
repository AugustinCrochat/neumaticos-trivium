import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { DesgasteFoto } from "@/components/tools/DesgasteFoto";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "rotacion-de-neumaticos";
const TITLE = "Rotación de neumáticos: cada cuánto y en qué orden se cambian de lugar";
const SUBTITLE =
  "Las ruedas de adelante se gastan más rápido que las de atrás. Rotarlas reparte ese desgaste y alarga la vida del juego completo. Te explicamos cada cuánto hacerlo y qué esquema usar según tu auto.";

export const metadata: Metadata = {
  ...blogShare("rotacion-de-neumaticos"),
  title: TITLE,
  description:
    "Cada cuánto rotar los neumáticos, en qué orden pasarlos de lugar según tracción delantera, trasera o 4x4, cuándo no se puede rotar y qué revisar en el mismo turno.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cada cuántos kilómetros hay que rotar los neumáticos?",
    answer:
      "Una referencia práctica es hacerlo cada 8.000 a 10.000 km, o en cada service si el auto no recorre mucho. Si el manual del fabricante indica otro intervalo, seguí ese. Lo importante es no esperar a ver el desgaste desparejo: para cuando se nota a simple vista, ya perdiste vida útil.",
  },
  {
    question: "¿Por qué se gastan más las ruedas delanteras?",
    answer:
      "En un auto de tracción delantera, las ruedas de adelante hacen tres trabajos a la vez: traccionan, dirigen y absorben la mayor parte de la frenada, además de cargar con el peso del motor. Por eso suelen desgastarse bastante más rápido que las traseras. En tracción trasera o 4x4 el reparto cambia, pero casi nunca es parejo.",
  },
  {
    question: "¿Se puede rotar si las cuatro ruedas son de medidas distintas?",
    answer:
      "No. Si adelante y atrás llevan medidas distintas (algunos autos deportivos), las ruedas no son intercambiables entre ejes. En ese caso lo máximo que se puede hacer es cruzar de lado dentro del mismo eje, y solo si las cubiertas no son direccionales.",
  },
  {
    question: "¿Y si mis neumáticos son direccionales?",
    answer:
      "Los direccionales tienen una flecha en el flanco que indica el sentido de giro y tienen que seguir girando en ese sentido. Solo se pueden pasar de adelante hacia atrás del mismo lado, sin cruzarlos. Para cruzarlos habría que desmontar la cubierta de la llanta y volver a montarla al revés.",
  },
  {
    question: "¿Rotar reemplaza a la alineación?",
    answer:
      "No. La rotación reparte el desgaste, pero no corrige la causa. Si un neumático se gasta de un solo borde, el problema suele ser de alineación o de suspensión, y rotar solo lo esconde un rato. Lo ideal es rotar, mirar el desgaste y alinear si hace falta.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Mantenimiento"
      date="2026-10-17"
      readingMinutes={5}
      faqs={FAQS}
    >
      <p>
        Es una de las tareas de mantenimiento más baratas y más olvidadas. Un juego de neumáticos
        no se gasta parejo: según el auto, dos de las cuatro ruedas hacen casi todo el trabajo, y
        si nunca las cambiás de lugar, esas dos llegan al límite legal mientras las otras dos
        todavía tienen goma de sobra. Rotar es la forma de que las cuatro lleguen juntas.
      </p>
      <DesgasteFoto className="my-8" />

      <h2>Por qué se desgastan distinto</h2>
      <p>
        En un auto de tracción delantera, las ruedas de adelante empujan, giran y frenan, y encima
        cargan con el motor. Las de atrás solo acompañan. En tracción trasera o 4x4 cambia el
        reparto, pero casi nunca queda parejo. Con el tiempo esa diferencia se traduce en cubiertas
        de adelante gastadas y de atrás casi nuevas.
      </p>
      <p>
        Eso tiene un costo concreto: cuando las de adelante se terminan, o cambiás solo dos (y
        quedan dos con distinto nivel de desgaste en el mismo auto) o cambiás las cuatro antes de
        tiempo. Rotando a tiempo evitás las dos cosas.
      </p>

      <h2>Cada cuánto rotar</h2>
      <p>
        Una referencia razonable es <strong>cada 8.000 a 10.000 kilómetros</strong>, o en cada
        service si hacés pocos kilómetros al año. Si el manual de tu auto indica otro intervalo,
        manda el manual. Lo más práctico es asociarlo a un hábito que ya tenés: cada cambio de
        aceite, una rotación.
      </p>

      <h2>En qué orden se cambian de lugar</h2>
      <p>El esquema depende de qué ruedas traccionan y de si las cubiertas son direccionales.</p>
      <ul>
        <li>
          <strong>Tracción delantera:</strong> las delanteras pasan atrás del mismo lado, y las
          traseras pasan adelante cruzadas.
        </li>
        <li>
          <strong>Tracción trasera o 4x4:</strong> al revés. Las traseras pasan adelante del mismo
          lado, y las delanteras pasan atrás cruzadas.
        </li>
        <li>
          <strong>Cubiertas direccionales:</strong> no se cruzan. Solo se intercambian adelante y
          atrás del mismo lado, siguiendo la flecha del flanco.
        </li>
        <li>
          <strong>Medidas distintas adelante y atrás:</strong> no se puede rotar entre ejes.
        </li>
      </ul>

      <h2>Qué revisar mientras la rueda está afuera</h2>
      <p>
        Con la rueda desmontada es el mejor momento para mirar lo que normalmente no se ve. Es un
        control de cinco minutos que puede ahorrarte una sorpresa en la ruta:
      </p>
      <ul>
        <li>
          <strong>Desgaste desparejo.</strong> Si un borde está más gastado que el otro, hay un
          problema de{" "}
          <Link href="/blog/alineacion-y-balanceo">alineación</Link> o de suspensión.
        </li>
        <li>
          <strong>Cortes, bultos o grietas en el flanco.</strong> Un bulto es una carcasa dañada y
          no se repara: hay que cambiar la cubierta.
        </li>
        <li>
          <strong>Piedras o clavos incrustados</strong> en los canales de la banda.
        </li>
        <li>
          <strong>Presión.</strong> Dejala en el valor que indica el fabricante del auto (te
          contamos dónde buscarlo en la nota sobre{" "}
          <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link>).
        </li>
      </ul>

      <h2>Después de rotar</h2>
      <p>
        Las tuercas se ajustan con llave dinamométrica al par que indica el fabricante, no a
        ojo ni con la pistola a fondo. Una buena práctica es volver a revisar el ajuste después de
        recorrer unos 50 a 100 kilómetros. Y como al cambiar de lugar las ruedas pueden quedar con
        un balanceo que ya no corresponde al nuevo eje, si sentís vibración en el volante lo
        indicado es{" "}
        <Link href="/blog/alineacion-y-balanceo">balancearlas</Link>.
      </p>

      <h2>Cuándo ya no sirve rotar</h2>
      <p>
        Rotar reparte el desgaste, no lo revierte. Si las cubiertas están cerca del indicador de
        desgaste (los resaltos que quedan al ras de la banda), lo que corresponde es cambiarlas.
        En la nota sobre{" "}
        <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cada cuántos kilómetros cambiar los
        neumáticos</Link> está cómo medirlo.
      </p>
    </ArticleLayout>
  );
}
