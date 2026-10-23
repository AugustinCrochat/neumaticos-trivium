import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "extraccion-de-tuercas-de-seguridad";
const TITLE = "Extracción de tuercas de seguridad sin llave: qué se puede hacer";
const SUBTITLE =
  "Perdiste la llave de la tuerca antirrobo o se redondeó: formas correctas de sacarla sin arruinar el espárrago ni la llanta, y qué evitar.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo se saca una tuerca antirrobo cuando no tenés la llave: extractores, qué evitar para no dañar el espárrago ni la llanta, y cuándo conviene llevarla a una gomería.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Se puede sacar una tuerca antirrobo sin la llave?",
    answer:
      "Sí. Una gomería con las herramientas adecuadas puede extraerla, normalmente con un dado extractor de acero endurecido que muerde la cabeza de la tuerca. Lo que hay que evitar es hacerlo a golpes o con soldadura improvisada.",
  },
  {
    question: "¿Se daña la tuerca al extraerla?",
    answer:
      "Sí, la tuerca de seguridad se destruye: ese es el costo de sacarla sin llave. Lo importante es que el espárrago, la rosca y la llanta queden sin daño. Después se coloca una tuerca nueva, normal o de seguridad.",
  },
  {
    question: "¿Puedo pedir otra llave en vez de extraerla?",
    answer:
      "Si conservás el código que viene en la caja o en la tarjeta del juego, podés pedirle una llave de repuesto al fabricante. Tarda más que ir a la gomería, pero conserva la tuerca.",
  },
  {
    question: "¿Por qué no usar martillo y cincel?",
    answer:
      "Porque el golpe se transmite al espárrago y a la maza, y es fácil abollar o rajar la llanta de aleación. Es la forma más común de convertir una tuerca trabada en un problema de varios elementos.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={5} faqs={FAQS}>
      <p>
        Le pasa a mucha gente: hay que cambiar una rueda y la llave de la tuerca antirrobo no está, o
        está tan gastada que patina. Parece que la rueda quedó atrapada, pero no es así: hay formas
        de sacar esa tuerca sin dañar nada más. Lo que importa es elegir la correcta.
      </p>

      <h2>Antes de nada: revisá si tenés el código</h2>
      <p>
        Los juegos de tuercas antirrobo suelen venir con un código impreso en la caja, en una
        tarjeta o grabado en la llave. Con ese código el fabricante puede enviarte una llave
        nueva. Es la solución más prolija si no tenés apuro y querés conservar la tuerca.
      </p>

      <h2>Extracción con dado extractor</h2>
      <p>
        El método más usado en gomerías es el dado extractor: una pieza de acero endurecido con una
        rosca interior en sentido inverso que se calza a presión sobre la cabeza de la tuerca. Al
        girar en sentido de aflojar, el dado muerde la tuerca y la saca. Funciona con la mayoría de
        las tuercas de seguridad, siempre que se use el tamaño que corresponde y se coloque bien
        centrado.
      </p>
      <p>
        La tuerca se destruye al sacarla, pero el espárrago, la rosca y la llanta quedan intactos.
        Después se coloca una tuerca normal o un juego nuevo.
      </p>

      <h2>Lo que no conviene hacer</h2>
      <ul>
        <li><strong>Martillo y cincel:</strong> golpea el espárrago y la llanta.</li>
        <li><strong>Pistola de impacto con dado común:</strong> redondea la cabeza y empeora la situación.</li>
        <li><strong>Soldar una tuerca encima:</strong> el calor daña la llanta de aleación y la goma del neumático.</li>
        <li><strong>Taladrar sin guía:</strong> se corre la broca y se estropea la rosca.</li>
      </ul>

      <h2>Qué hacer en la gomería</h2>
      <ol>
        <li>Llevá el auto con las ruedas puestas; si podés, llevá también lo que tengas del juego.</li>
        <li>Decí cuántas tuercas son de seguridad y si ya hubo intentos de sacarlas.</li>
        <li>Pedí que, después de extraerla, revisen el estado de la rosca del espárrago.</li>
        <li>Pedí que te coloquen una tuerca nueva al torque correcto.</li>
      </ol>

      <h2>Cómo evitar que vuelva a pasar</h2>
      <p>
        Guardá la llave en la guantera, anotá el código y, cada tanto, revisá que no esté gastada. Más
        sobre uso y cuidado en{" "}
        <Link href="/blog/tuercas-y-bulones-de-seguridad">Tuercas y bulones de seguridad</Link>. Si
        necesitás un juego nuevo, mirá las{" "}
        <Link href="/tuercas-antirrobo">tuercas antirrobo</Link> disponibles. Si el espárrago quedó
        dañado, leé{" "}
        <Link href="/blog/esparrago-de-maza-roto-reparacion-de-rosca">espárrago roto y reparación de rosca</Link>.
      </p>
    </ArticleLayout>
  );
}
