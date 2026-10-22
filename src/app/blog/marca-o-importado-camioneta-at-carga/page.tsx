import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { canonical } from "@/lib/seo";

const SLUG = "marca-o-importado-camioneta-at-carga";
const TITLE = "Marca o importado en camioneta, A/T y carga: qué conviene";
const SUBTITLE =
  "En uso exigente —carga, ruta, tierra— las diferencias pesan más. Dónde sí conviene mirar la marca y dónde una buena alternativa alcanza.";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Neumáticos para camioneta, A/T y carga: ¿marca o importado? Qué mirar según el uso (carga, ruta, tierra), la importancia del índice de carga y cuándo una alternativa económica es suficiente.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Un neumático importado aguanta una pickup cargada?",
    answer:
      "Si el índice de carga (y, en neumáticos de carga, la capacidad de lonas) es el que exige tu vehículo para el peso real que transportás, sí. Lo decisivo no es la marca sino que el neumático esté dimensionado para la carga y se infle a la presión correcta con carga.",
  },
  {
    question: "¿Qué cambia entre un A/T premium y uno económico?",
    answer:
      "Suele cambiar la resistencia del flanco a cortes y golpes en tierra, la consistencia y el ruido. Si hacés mucho off-road exigente, la marca y la construcción del flanco pesan más; para uso mixto de ruta y camino de tierra, una buena alternativa alcanza.",
  },
  {
    question: "¿Puedo poner un neumático de auto en un utilitario?",
    answer:
      "No conviene: los utilitarios pueden requerir neumáticos de carga (C) con estructura reforzada. Mirá la guía para distinguir un neumático C de uno de auto.",
  },
  {
    question: "¿Qué presión uso con carga?",
    answer:
      "La que indica el fabricante para el vehículo cargado, que suele ser mayor que la de uso en vacío. Consultá la nota sobre presión en utilitarios con carga.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-10-21" readingMinutes={7} faqs={FAQS}>
      <p>
        Con un auto de ciudad, elegir entre marca y alternativa es sobre todo una cuestión de presupuesto. En una camioneta, una pickup
        o un utilitario con carga, hay más en juego: peso, esfuerzo del flanco, temperaturas y caminos castigados. Acá las diferencias
        pesan más, y conviene saber en cuáles.
      </p>

      <Callout title="Lo que no se negocia en uso exigente" tone="warn">
        <p>
          El <strong>índice de carga</strong> (y, si corresponde, la construcción de carga «C») tiene que cubrir el peso real que
          llevás. Eso importa más que la marca. Un neumático de marca con índice insuficiente es peor que uno económico con el índice correcto.
        </p>
      </Callout>

      <h2>Utilitarios y furgones de reparto</h2>
      <p>
        Para flota urbana, el criterio es costo por kilómetro y disponibilidad: neumáticos de carga (C) con el índice correcto y
        precio razonable. Una alternativa homologada suele ser la mejor cuenta, siempre que respete la capacidad. Más en{" "}
        <Link href="/blog/neumaticos-para-utilitarios-furgones-reparto">neumáticos para utilitarios y reparto</Link>,{" "}
        <Link href="/blog/neumatico-c-o-de-auto-utilitario">neumático C o de auto</Link> y{" "}
        <Link href="/blog/carga-simple-y-dual-neumaticos-c">carga simple y dual</Link>.
      </p>

      <h2>Pickups y camionetas de uso mixto</h2>
      <p>
        Ruta, ciudad y algo de tierra: un H/T o un A/T de gama intermedia resuelve. Mirá el índice de velocidad y el de carga, la
        presión correcta con y sin carga (<Link href="/blog/presion-neumaticos-utilitarios-con-carga">guía</Link>) y las
        medidas flotation si usás tamaños en pulgadas (<Link href="/blog/medidas-flotation-camionetas">nota</Link>).
      </p>

      <h2>A/T y off-road</h2>
      <p>
        Acá sí hay diferencias a considerar. En tierra, piedra y barro, la resistencia del flanco a cortes y la tracción importan, y los
        modelos de las marcas especializadas (BFGoodrich es una de las más reconocidas en A/T) tienen trayectoria probada. Para uso
        mixto —ruta más caminos de tierra— hay alternativas A/T importadas de buena relación precio/prestación, que usamos en el taller
        todos los días. Si tu uso es off-road exigente de verdad, invertí más; si es de fin de semana ocasional, no hace falta.
      </p>
      <ul>
        <li><strong>Off-road exigente frecuente:</strong> priorizá construcción de flanco y trayectoria.</li>
        <li><strong>Uso mixto ruta/tierra:</strong> una alternativa A/T homologada suele alcanzar.</li>
        <li><strong>Mayormente asfalto:</strong> un H/T es más silencioso y económico que un A/T.</li>
      </ul>
      <p>
        Mirá la comparación: <Link href="/neumaticos/at">neumáticos A/T</Link>, <Link href="/neumaticos/ht">H/T</Link> y{" "}
        <Link href="/neumaticos/carga">carga</Link>.
      </p>

      <h2>Cómo decidir</h2>
      <ol>
        <li>Calculá el peso real que llevás y confirmá el índice de carga necesario.</li>
        <li>Definí tu mezcla de asfalto y tierra.</li>
        <li>Elegí la construcción (C, H/T, A/T) según esa mezcla.</li>
        <li>Recién ahí comparás marca contra alternativa por <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">costo por kilómetro</Link> y respaldo.</li>
      </ol>

      <ClusterLinks current={SLUG} />
    </ArticleLayout>
  );
}
