import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { CostPerKmCalculator } from "@/components/blog/CostPerKmCalculator";
import { canonical } from "@/lib/seo";

const SLUG = "neumaticos-de-marca-vs-importados-cual-conviene";
const TITLE = "Neumáticos de marca vs. importados: ¿cuál conviene?";
const SUBTITLE =
  "Una comparación honesta entre las marcas premium y las alternativas importadas: qué se paga de más, qué se gana de verdad y cuándo conviene cada una.";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Neumáticos de marca (Michelin, Pirelli) vs. importados económicos: costo por kilómetro, frenado en mojado, ruido, garantía y uso. Cuándo conviene cada uno, con una calculadora para comparar.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Los neumáticos importados económicos son seguros?",
    answer:
      "Los que están homologados (marca ECE o DOT en el flanco), con fecha de fabricación reciente y la medida, el índice de carga y el de velocidad correctos para tu vehículo, cumplen los ensayos de seguridad mínimos del mercado donde se venden. Lo que no suelen igualar a una marca premium es el frenado en mojado, el ruido y la consistencia, no la seguridad estructural básica.",
  },
  {
    question: "¿Cuánto más duran los neumáticos de marca?",
    answer:
      "No hay un número único: depende del modelo, del uso, de la presión y de la alineación. Algunos modelos premium duran más, otros están pensados para agarrar más y se desgastan antes. Por eso conviene comparar el costo por kilómetro con tu propia estimación y no confiar en promesas genéricas.",
  },
  {
    question: "¿Cuándo vale la pena pagar una marca premium?",
    answer:
      "Cuando manejás mucho en ruta y a velocidad, con lluvia frecuente, con un auto potente o pesado, o cuando valorás el silencio y la estabilidad. También si querés la red de servicio y la garantía de una marca global.",
  },
  {
    question: "¿Cuándo conviene una alternativa económica?",
    answer:
      "En uso urbano o mixto a velocidad moderada, con pocos kilómetros al año, o en un auto cuyo valor no justifica el costo de un juego premium. Con una buena alineación y la presión correcta, la diferencia práctica se achica.",
  },
  {
    question: "¿Qué pasa si un neumático importado no tiene marca conocida?",
    answer:
      "No es en sí un problema, pero exige más verificación: homologación, fecha DOT, índices correctos, garantía y quién respalda la venta. En la nota «Cómo elegir un neumático importado seguro» hay un checklist de ocho puntos.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-10-21" readingMinutes={9} faqs={FAQS}>
      <p>
        La duda es siempre la misma: una marca conocida cuesta bastante más y una alternativa importada promete lo mismo por menos.
        ¿Quién tiene razón? La respuesta honesta es que <strong>no hay una opción mejor en abstracto</strong>: hay un neumático que
        conviene según cuánto manejás, dónde, con qué auto y cuánto valorás cada aspecto. Esta guía separa lo que se paga de más por
        razones reales de lo que es solo marca.
      </p>

      <Callout title="La respuesta corta" tone="ok">
        <p>
          Si manejás mucho en ruta, con lluvia o a velocidad, la marca premium suele justificar su precio en frenado en mojado, ruido y
          consistencia. Si tu uso es urbano o mixto, con kilometraje moderado, una alternativa importada <strong>homologada</strong> y bien
          montada resuelve el trabajo por bastante menos. Lo que no conviene nunca es comprar un neumático sin homologación ni fecha
          verificable, sin importar el precio.
        </p>
      </Callout>

      <h2>Qué estás pagando cuando pagás una marca</h2>
      <p>Una parte del precio es ingeniería y una parte es marca. Las dos son reales, pero no valen lo mismo para todos:</p>
      <ul>
        <li><strong>Investigación y desarrollo:</strong> compuestos de goma y diseños de banda que se prueban durante años. Se nota sobre todo en <strong>frenado en mojado</strong> y en <strong>estabilidad a velocidad</strong>.</li>
        <li><strong>Consistencia de fabricación:</strong> que un neumático de la serie se parezca al siguiente. Con marcas globales la dispersión suele ser menor.</li>
        <li><strong>Confort y ruido:</strong> los premium suelen invertir más en bandas silenciosas.</li>
        <li><strong>Red y garantía:</strong> servicio oficial, reclamos y presencia en muchos países.</li>
        <li><strong>Marca y publicidad:</strong> también está en el precio, y no mejora el neumático.</li>
      </ul>

      <h2>Qué ofrece una alternativa importada</h2>
      <p>
        Las alternativas importadas llegan con una relación precio/prestación muy competitiva. Cuando están homologadas (ver la nota sobre{" "}
        <Link href="/blog/son-malos-los-neumaticos-chinos">si son malos los neumáticos chinos</Link>) cumplen los ensayos básicos de
        seguridad y rinden bien en el uso cotidiano. Lo que suelen ceder es el último escalón: algo más de distancia de frenado en
        mojado, más ruido o menos consistencia entre lotes. Para muchos usos eso no se nota.
      </p>
      <p>
        Las marcas internacionales intermedias (de las que hablamos en la comparativa de{" "}
        <Link href="/blog/marcas-chinas-neumaticos-comparativa">marcas chinas</Link>) ocupan justamente ese espacio.
      </p>

      <h2>Cómo comparar bien: costo por kilómetro</h2>
      <p>
        El precio de lista es un solo número. Lo que importa es cuánto cuesta cada kilómetro: <strong>precio ÷ kilómetros de vida útil</strong>.
        Un neumático más caro que dura más puede salir más barato por kilómetro; uno barato que se gasta rápido, al revés. Pero ojo: la
        duración que esperás es una estimación tuya, no una garantía. Probá con un rango conservador y uno optimista.
      </p>
      <CostPerKmCalculator />
      <p>
        Para entender qué factores mueven esa duración, mirá <Link href="/blog/cuanto-duran-los-neumaticos-economicos">cuánto duran los neumáticos económicos</Link> y
        la nota de <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.
      </p>

      <figure className="my-10">
        <Image
          src="/marca-premium-vs-alternativa-homologada-neumaticos.webp"
          alt="Tabla comparativa de neumáticos de marca premium contra alternativa homologada: seguridad estructural, frenado en mojado, ruido, consistencia, durabilidad, garantía y precio"
          width={1600}
          height={1200}
          sizes="(min-width: 768px) 768px, 100vw"
          className="h-auto w-full rounded-2xl border border-slate-100"
        />
        <figcaption className="mt-2 text-sm text-slate-500">Resumen de la comparación. Es orientativo: cada modelo varía, por eso conviene mirar la etiqueta del neumático concreto.</figcaption>
      </figure>

      <h2>Dónde la diferencia es real</h2>
      <ul>
        <li><strong>Frenado en mojado.</strong> Es el aspecto donde las etiquetas suelen separar más a unos de otros. En la <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link> lo ves en la escala de A a E.</li>
        <li><strong>Velocidad sostenida.</strong> Autopista a ritmo alto durante horas exige un neumático con índice de velocidad adecuado y buena estabilidad.</li>
        <li><strong>Ruido y confort.</strong> En viajes largos se agradece.</li>
        <li><strong>Uso exigente.</strong> Carga, pickups, A/T: ver <Link href="/blog/marca-o-importado-camioneta-at-carga">marca o importado en camioneta, A/T y carga</Link>.</li>
      </ul>

      <h2>Dónde la diferencia es menor (o es marketing)</h2>
      <ul>
        <li><strong>Ciudad a velocidad moderada,</strong> donde pesan más la presión y la alineación que el compuesto. Más en <Link href="/blog/neumaticos-economicos-para-uso-urbano">neumáticos económicos para uso urbano</Link>.</li>
        <li><strong>Pocos kilómetros por año:</strong> el neumático envejece antes de gastarse. Un premium no compensa su precio si se te vence por edad.</li>
        <li><strong>El «prestigio»:</strong> una marca famosa no corrige una mala alineación ni una presión incorrecta.</li>
      </ul>

      <Callout title="Lo que nunca se negocia" tone="warn">
        <p>
          Medida e índices de carga y velocidad correctos para tu vehículo, homologación visible en el flanco, fecha de fabricación
          reciente y un montaje con balanceo. Con eso resuelto, la elección entre marca y alternativa es una decisión de presupuesto y
          uso, no de seguridad básica.
        </p>
      </Callout>

      <h2>Cómo decidir en dos minutos</h2>
      <ol>
        <li><strong>Mirá tu uso:</strong> ¿mucha ruta y lluvia? Inclinate por premium o por una intermedia con buen frenado en mojado. ¿Ciudad? Una alternativa alcanza.</li>
        <li><strong>Comparé el costo por kilómetro</strong> con la calculadora de arriba, con tu propia estimación.</li>
        <li><strong>Verificá la homologación y la fecha</strong> con el <Link href="/blog/como-elegir-neumatico-importado-seguro">checklist de 8 puntos</Link>.</li>
        <li><strong>Elegí un juego de cuatro iguales</strong> si podés (ver <Link href="/blog/cuatro-economicos-o-dos-de-marca">4 económicos o 2 de marca</Link>).</li>
        <li><strong>Montalo bien:</strong> balanceo y <Link href="/blog/alineacion-y-balanceo">alineación</Link> alargan la vida de cualquier neumático.</li>
      </ol>
      <p>
        Si querés ver opciones concretas, mirá <Link href="/blog/alternativas-a-michelin-y-pirelli">alternativas a Michelin y Pirelli</Link> o
        entrá al <Link href="/neumaticos">catálogo</Link> y buscá tu medida: te mostramos marcas y alternativas con precio y stock.
      </p>

      <ClusterLinks current={SLUG} />
    </ArticleLayout>
  );
}
