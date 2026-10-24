import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "at-o-ht-cual-conviene-para-tu-camioneta";
const TITLE = "A/T o H/T: cuál conviene para tu camioneta";
const SUBTITLE =
  "Los dos van en la misma medida, pero no se comportan igual. Qué cambia entre un neumático de ruta y uno todo terreno, y cómo elegir según cómo usás la camioneta.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Diferencias entre neumáticos A/T (All Terrain) y H/T (Highway Terrain) para camionetas y SUV: ruido, desgaste, consumo, agarre en tierra y cuál elegir según el uso.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué significa A/T y H/T?",
    answer:
      "A/T es All Terrain (todo terreno) y H/T es Highway Terrain (para ruta). El primero tiene un dibujo más abierto, pensado para tierra, ripio y barro liviano además del asfalto. El segundo tiene un dibujo más cerrado y silencioso, pensado para pavimento.",
  },
  {
    question: "¿Un A/T sirve para manejar todos los días en la ciudad?",
    answer:
      "Sí, se puede. Lo que vas a notar frente a un H/T es algo más de ruido de rodado y, según el modelo, un desgaste algo más rápido en asfalto. Si el 90% de tus kilómetros son de pavimento, un H/T suele ser la opción más cómoda y económica.",
  },
  {
    question: "¿Puedo mezclar A/T y H/T en la misma camioneta?",
    answer:
      "No conviene. Los dos tipos tienen agarre, rigidez y diámetro algo distintos, y mezclarlos afecta la estabilidad y el trabajo de los sistemas de control. Lo recomendable es el mismo modelo en las cuatro ruedas.",
  },
  {
    question: "¿Cambia la medida entre A/T y H/T?",
    answer:
      "No necesariamente: el mismo neumático existe en ambos tipos para la misma medida. Lo que cambia es el dibujo y la construcción. Conviene igual verificar el índice de carga, sobre todo si la camioneta trabaja con peso.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Opiniones y Comparativas" date="2026-10-24" readingMinutes={5} faqs={FAQS}>
      <p>
        En una camioneta o un SUV la pregunta aparece enseguida: ¿ruta o todo terreno? No hay un tipo
        mejor que el otro. Hay uno que se ajusta a tu uso y otro que te va a hacer pagar de más en ruido,
        desgaste o agarre. Acá va la comparación, sin vueltas.
      </p>

      <h2>Qué es cada uno</h2>
      <p>
        El <strong>H/T (Highway Terrain)</strong> es el neumático de ruta: bloques de dibujo más pequeños y
        cercanos entre sí, canales pensados para evacuar agua en asfalto y una banda de rodamiento que prioriza
        confort y silencio.
      </p>
      <p>
        El <strong>A/T (All Terrain)</strong> es el neumático mixto: bloques más grandes y separados, ranuras
        más anchas para expulsar barro y piedras, y en muchos modelos flancos más reforzados. Sigue siendo
        un neumático de calle, pero con herramientas para salir del asfalto.
      </p>

      <h2>La comparación punto por punto</h2>
      <table>
        <thead>
          <tr>
            <th>Aspecto</th>
            <th>H/T</th>
            <th>A/T</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ruido en asfalto</td>
            <td>Bajo</td>
            <td>Algo mayor</td>
          </tr>
          <tr>
            <td>Confort</td>
            <td>Más suave</td>
            <td>Un poco más firme</td>
          </tr>
          <tr>
            <td>Agarre en tierra, ripio y barro liviano</td>
            <td>Limitado</td>
            <td>Mucho mejor</td>
          </tr>
          <tr>
            <td>Agarre en asfalto mojado</td>
            <td>Muy bueno</td>
            <td>Bueno, depende del modelo</td>
          </tr>
          <tr>
            <td>Resistencia a cortes y golpes en el flanco</td>
            <td>Estándar</td>
            <td>Suele ser mayor</td>
          </tr>
          <tr>
            <td>Consumo de combustible</td>
            <td>Menor</td>
            <td>Algo mayor</td>
          </tr>
          <tr>
            <td>Desgaste en uso urbano y ruta</td>
            <td>Más lento</td>
            <td>Más rápido</td>
          </tr>
        </tbody>
      </table>
      <p>
        Los valores son tendencias generales: cada modelo es distinto. Un A/T bien diseñado puede ser muy
        silencioso y un H/T barato puede ser ruidoso. Por eso conviene mirar el modelo concreto y no solo la sigla.
      </p>

      <Callout title="La regla corta" tone="ok">
        <p>
          Si más del 80% de tus kilómetros son de pavimento, elegí <strong>H/T</strong>. Si salís seguido a
          caminos de tierra, ripio, campo o una obra, o querés mejor protección en el flanco, elegí{" "}
          <strong>A/T</strong>.
        </p>
      </Callout>

      <h2>Cuándo conviene H/T</h2>
      <ul>
        <li>Camioneta o SUV que vive en la ciudad y la ruta.</li>
        <li>Viajes largos en autopista donde el silencio y el consumo suman.</li>
        <li>Uso familiar, con prioridad al confort.</li>
      </ul>

      <h2>Cuándo conviene A/T</h2>
      <ul>
        <li>Salidas frecuentes a las sierras, el campo o caminos de ripio.</li>
        <li>Trabajo en obra, loteos o zonas con tierra suelta.</li>
        <li>Si te importa más la resistencia del flanco que el último decibel de ruido.</li>
      </ul>

      <h2>Qué mirar antes de decidir</h2>
      <ol>
        <li>
          <strong>El uso real</strong>, no el que imaginás. Contá cuántos de tus kilómetros salen del asfalto.
        </li>
        <li>
          <strong>El índice de carga</strong>, sobre todo si cargás peso.{" "}
          <Link href="/herramientas/indice-carga-velocidad">Acá está la tabla</Link>.
        </li>
        <li>
          <strong>La medida</strong>: si querés cambiar a una más ancha o más alta, verificá la equivalencia
          con la <Link href="/calculadora-equivalencia-neumaticos">calculadora</Link>.
        </li>
        <li>
          <strong>Las cuatro ruedas iguales</strong>, y rotarlas con regularidad:{" "}
          <Link href="/blog/rotacion-de-neumaticos">así se hace</Link>.
        </li>
      </ol>
      <p>
        Mirá las opciones que tenemos en <Link href="/neumaticos/at">neumáticos A/T</Link> y en{" "}
        <Link href="/neumaticos/ht">neumáticos H/T</Link>. Si dudás entre dos, escribinos o pasá por el local y
        lo vemos con tu camioneta adelante.
      </p>
    </ArticleLayout>
  );
}
