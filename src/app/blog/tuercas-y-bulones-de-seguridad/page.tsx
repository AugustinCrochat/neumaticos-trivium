import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "tuercas-y-bulones-de-seguridad";
const TITLE = "Tuercas y bulones de seguridad: cómo funcionan y cómo cuidarlos";
const SUBTITLE =
  "Qué son las tuercas antirrobo, cómo se usan con su llave, cuánto apretarlas y qué hacer si perdés la llave o se daña la tuerca.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo funcionan las tuercas y bulones de seguridad (antirrobo), cómo colocarlas y apretarlas, dónde guardar la llave y qué hacer si se pierde. Guía de nuestra gomería de Córdoba.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cómo funciona una tuerca antirrobo?",
    answer:
      "Reemplaza una tuerca de cada rueda por otra con un dibujo único en la cabeza. Solo se afloja con la llave que tiene el negativo de ese dibujo, así que sin la llave no se puede sacar la rueda con una llave de cruz común.",
  },
  {
    question: "¿Cuántas tuercas de seguridad lleva cada rueda?",
    answer:
      "Una por rueda: cuatro por juego. El resto de las tuercas o bulones son comunes. Hay juegos para cada tipo de rosca y de asiento (cónico o esférico), por eso hay que elegirlas según el auto.",
  },
  {
    question: "¿Dónde conviene guardar la llave?",
    answer:
      "Como el juego trae dos llaves, guardá una en la guantera o junto al auxilio y la otra en tu casa: así, si perdés una, tenés la de repuesto. Nunca la dejes en la gomería ni en la tapa del baúl. Anotá el código que viene en el juego: si perdés la llave, con el código se puede pedir otra al fabricante.",
  },
  {
    question: "¿Qué pasa si pierdo la llave?",
    answer:
      "Hay dos caminos: pedir una llave de repuesto con el código grabado en el juego, o recurrir a una gomería que pueda extraer la tuerca sin dañar el espárrago ni la llanta. Está explicado en nuestra guía sobre extracción de tuercas de seguridad.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={5} faqs={FAQS}>
      <p>
        Las llantas de aleación son un blanco fácil: se sacan en minutos con una llave de cruz. Las
        tuercas y bulones de seguridad, conocidas como antirrobo, existen para hacer ese trabajo
        mucho más difícil. Son un accesorio chico, pero con un detalle que importa: si algo sale mal
        con la llave, la tuerca se vuelve un problema.
      </p>

      <h2>Cómo funcionan</h2>
      <p>
        Cada juego trae cuatro tuercas (o bulones) con una cabeza de dibujo único y dos llaves con el
        negativo de ese dibujo: una para usar y otra de repuesto. Se coloca una por rueda, en lugar de
        una de las tuercas comunes. Sin la llave, la tuerca queda sin forma de agarre para una
        herramienta normal.
      </p>
      <p>
        Hay modelos de cabeza con estrías, con dibujo asimétrico y tuercas con anillo giratorio, y
        todos tienen una rosca y un asiento que tienen que coincidir con tu auto. En{" "}
        <Link href="/tuercas-antirrobo">nuestra sección de tuercas antirrobo</Link> están ordenadas por
        vehículo.
      </p>

      <h2>Cómo colocarlas bien</h2>
      <ol>
        <li>Limpiá la rosca del espárrago y verificá que la tuerca gire a mano sin forzar.</li>
        <li>Colocá la llave a fondo y derecha, sin que quede inclinada.</li>
        <li>Apretá en cruz, en dos pasadas, y terminá con llave dinamométrica al torque que indica el fabricante del auto.</li>
        <li>Evitá la pistola de impacto a fondo: es la causa principal de tuercas y llaves dañadas.</li>
      </ol>

      <h2>Cuidados que evitan problemas</h2>
      <ul>
        <li>Guardá la llave en un lugar fijo y anotá el código del juego.</li>
        <li>Avisá en la gomería que hay tuerca de seguridad antes de que desmonten la rueda.</li>
        <li>Revisá la llave: si se ve redondeada o con el dibujo gastado, cambiala antes de que no agarre.</li>
        <li>No mezcles tuercas de distintos juegos ni uses tuercas de asiento equivocado.</li>
      </ul>

      <h2>Si la llave se perdió o se dañó</h2>
      <p>
        Lo importante es no forzar la tuerca con herramientas de martillo ni golpearla con un cincel:
        se daña el espárrago y la llanta. Hay formas de extraerla correctamente; las explicamos en{" "}
        <Link href="/blog/extraccion-de-tuercas-de-seguridad">Extracción de tuercas de seguridad</Link>.
        Y si el espárrago se dañó, está la guía de{" "}
        <Link href="/blog/esparrago-de-maza-roto-reparacion-de-rosca">espárragos rotos y rosca dañada</Link>.
      </p>
      <p>
        Si no tenés el juego, podés ver el que corresponde a tu auto en{" "}
        <Link href="/tuercas-antirrobo">tuercas antirrobo</Link>, con colocación en nuestra gomería de
        Argüello.
      </p>
    </ArticleLayout>
  );
}
