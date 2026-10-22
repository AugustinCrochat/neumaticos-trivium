import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { canonical } from "@/lib/seo";

const SLUG = "alternativas-a-michelin-y-pirelli";
const TITLE = "Alternativas a Michelin y Pirelli: qué marcas comparar";
const SUBTITLE =
  "Cómo ubicar cada marca por segmento y qué mirar para elegir una alternativa más económica sin resignar seguridad.";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Alternativas a Michelin y Pirelli: segmentos de marcas (premium, intermedias, económicas homologadas), qué comparar y cómo elegir un neumático más barato sin resignar seguridad.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuál es una buena alternativa a Michelin?",
    answer:
      "Depende de lo que busques: dentro de las marcas globales hay opciones intermedias de buen desempeño; entre las importadas homologadas hay alternativas con muy buena relación precio/prestación. Lo importante es comparar con datos (etiqueta, ficha) y no con el nombre.",
  },
  {
    question: "¿Y una alternativa a Pirelli?",
    answer:
      "Aplica la misma lógica: definí tu uso (ciudad, ruta, lluvia, velocidad) y comparalo en la etiqueta europea de cada modelo en tu medida. Las diferencias entre modelos de una misma marca pueden ser mayores que entre marcas.",
  },
  {
    question: "¿Una marca intermedia es tan buena como una premium?",
    answer:
      "En muchos usos sí. Suele ceder algo en el último escalón (frenado en mojado, ruido, consistencia). Conviene mirar la etiqueta del modelo concreto, porque hay intermedios que superan a algunos premium en un aspecto.",
  },
  {
    question: "¿Cómo ahorro sin arriesgar la seguridad?",
    answer:
      "Con homologación, fecha reciente, índices correctos y un buen montaje. Con eso resuelto, el ahorro está en la marca, no en la seguridad.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-10-21" readingMinutes={7} faqs={FAQS}>
      <p>
        Michelin y Pirelli son referencias globales, y por eso mucha gente empieza ahí. Pero si el presupuesto aprieta, la pregunta
        correcta no es «¿cuál es la copia barata?» sino «¿qué segmento me conviene según cómo uso el auto?». Esto es un mapa para ubicarte.
      </p>

      <h2>Los segmentos, en orden</h2>
      <table>
        <thead>
          <tr><th>Segmento</th><th>Perfil</th><th>Cuándo conviene</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Premium global</strong></td><td>Michelin, Pirelli, Continental, Bridgestone, Goodyear</td><td>Mucha ruta, lluvia, velocidad, confort</td></tr>
          <tr><td><strong>Intermedias</strong></td><td>Marcas globales de segunda línea (Hankook, Kumho, Yokohama, Nexen y similares)</td><td>Buen equilibrio, uso mixto</td></tr>
          <tr><td><strong>Importadas homologadas</strong></td><td>Fabricantes con trayectoria y homologación europea (por ejemplo Grenlander y Linglong)</td><td>Ciudad y ruta moderada, mejor precio</td></tr>
          <tr><td><strong>Sin trazabilidad</strong></td><td>Marcas sin homologación ni información verificable</td><td>No las recomendamos</td></tr>
        </tbody>
      </table>
      <Callout title="Una nota sobre las marcas" tone="info">
        <p>
          Esta tabla es una guía de orientación, no un ranking oficial. Dentro de cada marca los modelos varían mucho: por eso,
          cuando compares, mirá el <strong>modelo concreto en tu medida</strong>.
        </p>
      </Callout>

      <h2>Qué comparar entre una premium y su alternativa</h2>
      <ol>
        <li><strong>Frenado en mojado</strong> en la <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link>.</li>
        <li><strong>Ruido externo</strong> (dB y ondas).</li>
        <li><strong>Eficiencia de combustible</strong>, si hacés muchos km.</li>
        <li><strong>Índices de carga y velocidad</strong> iguales o superiores a los del vehículo.</li>
        <li><strong>Garantía</strong> y quién la respalda.</li>
        <li><strong>Costo por kilómetro</strong> con tu propia estimación (<Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">calculadora</Link>).</li>
      </ol>

      <h2>Cuándo la alternativa alcanza</h2>
      <p>
        Uso urbano o mixto, kilometraje moderado, auto compacto o mediano: ver <Link href="/blog/neumaticos-economicos-para-uso-urbano">uso urbano</Link>.
        Y para entender por qué «chino» no es sinónimo de malo: <Link href="/blog/son-malos-los-neumaticos-chinos">mitos y realidad</Link>.
      </p>

      <h2>Cuándo conviene quedarse en la premium</h2>
      <p>
        Mucha ruta a velocidad, lluvias intensas, vehículo potente o pesado, o si valorás silencio y confort por encima del precio.
        Detalle en <Link href="/blog/diferencia-neumatico-caro-y-barato">qué cambia de verdad</Link>.
      </p>

      <h2>Mirá lo que tenemos</h2>
      <p>
        En el catálogo vas a ver las marcas disponibles hoy con precio y stock en tu medida. Podés empezar por{" "}
        <Link href="/marcas/pirelli">Pirelli</Link>, <Link href="/marcas/michelin">Michelin</Link> o{" "}
        <Link href="/marcas/grenlander">Grenlander</Link>, o ver <Link href="/marcas">todas las marcas</Link>.
      </p>

      <ClusterLinks current={SLUG} />
    </ArticleLayout>
  );
}
