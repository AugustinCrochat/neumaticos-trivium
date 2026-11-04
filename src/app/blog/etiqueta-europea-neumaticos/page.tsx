import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "etiqueta-europea-neumaticos";
const TITLE = "Etiqueta europea de neumáticos: qué significan las letras y colores";
const SUBTITLE =
  "La misma etiqueta que trae pegada cada neumático en el flanco, con el QR que la vincula a un registro oficial verificable. Qué mide cada letra y por qué importa al elegir.";

export const metadata: Metadata = {
  ...blogShare("etiqueta-europea-neumaticos"),
  title: TITLE,
  description:
    resumen("Qué es la etiqueta europea de eficiencia de neumáticos (Reglamento UE 2020/740): eficiencia de combustible, frenado en mojado, ruido externo y el registro EPREL que la respalda."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿La etiqueta europea es obligatoria en Argentina?",
    answer:
      "No, es una norma de la Unión Europea (Reglamento UE 2020/740). Pero como buena parte de los neumáticos que se venden acá se fabrican pensando también en el mercado europeo, muchos modelos la traen igual, con el detalle técnico registrado y verificable en la base de datos oficial EPREL.",
  },
  {
    question: "¿Qué significa la letra en el rombo negro de la etiqueta?",
    answer:
      "Hay dos escalas independientes, cada una de la A (mejor) a la E (peor): a la izquierda, eficiencia de combustible (cuánta resistencia a la rodadura tiene el neumático, lo que impacta en el consumo); a la derecha, frenado en mojado (cuánto tarda en frenar sobre piso mojado). Son dos letras distintas, no una sola.",
  },
  {
    question: "¿Qué es el número en decibeles con las rayitas debajo?",
    answer:
      "El ruido de rodadura externo, medido en dB, con una clasificación en tres franjas (A, B o C, marcadas con una, dos o tres ondas de sonido). A es la banda más silenciosa. Es ruido que emite el neumático hacia afuera del auto, no lo que se escucha adentro.",
  },
  {
    question: "¿Y el código UTQG que a veces aparece al pie de la etiqueta?",
    answer:
      "Es una norma distinta, de Estados Unidos (Uniform Tire Quality Grading), no de la Unión Europea. Trae tres datos: desgaste relativo (un número, autodeclarado por el fabricante), tracción (letra, agarre en frenada) y temperatura (letra, resistencia al calor a alta velocidad). Muchos fabricantes la imprimen en el mismo sticker porque venden el mismo neumático en los dos mercados, pero es información aparte de la etiqueta UE — el detalle completo está en la nota sobre UTQG.",
  },
  {
    question: "¿Para qué sirve el código QR de la etiqueta?",
    answer:
      "Apunta a la ficha pública de ese neumático exacto (esa medida, ese índice de carga y velocidad) en EPREL, la base de datos de la Comisión Europea. Ahí figuran los mismos datos de la etiqueta cargados por el fabricante o importador, de forma auditable. Es la manera de confirmar que la etiqueta no es un sticker inventado: el registro existe y es público.",
  },
  {
    question: "¿Conviene elegir siempre la letra A en todo?",
    answer:
      "Es una variable más, no la única. Un neumático A en combustible y frenado en mojado suele costar más, y en uso urbano de baja velocidad la diferencia de consumo es chica. Para alguien que hace muchos kilómetros de ruta, la eficiencia de combustible pesa más en el bolsillo con el tiempo; para cualquiera, el frenado en mojado es seguridad directa, así que ahí conviene no resignar demasiado.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-09-14"
      readingMinutes={6}
      faqs={FAQS}
    >
      <p>
        Todos los neumáticos homologados para el mercado europeo llevan pegada la misma etiqueta,
        con el mismo formato: una franja con la bandera de la UE, la marca y el modelo, dos escalas
        de colores de la A a la E, un número de decibeles y un código QR. En nuestras fichas de
        producto la mostramos junto a la foto de cada modelo, tal como la bajamos del registro
        oficial —{" "}
        <Link href="https://eprel.ec.europa.eu" target="_blank" rel="noopener noreferrer">
          EPREL
        </Link>
        —, no un gráfico armado por nosotros. Esta nota explica qué mide cada parte.
      </p>

      <h2>Eficiencia de combustible: la resistencia a la rodadura</h2>
      <p>
        Es la primera escala, de la <strong>A</strong> (más eficiente) a la <strong>E</strong>{" "}
        (menos eficiente), con un pictograma de surtidor. Mide la resistencia a la rodadura: cuánta
        energía se pierde en fricción a medida que el neumático gira. Menos resistencia significa
        que el motor hace menos esfuerzo para mantener la velocidad, y eso se traduce en menos
        consumo de combustible (o más autonomía, en un eléctrico).
      </p>
      <p>
        La diferencia entre un A y un E ronda el 7-8% de consumo de combustible atribuible al
        neumático a lo largo de su vida útil. No es el factor que más pesa en el consumo total del
        auto, pero en viajes largos y flotas se nota en la factura de combustible.
      </p>

      <h2>Frenado en mojado: cuánto tarda en parar</h2>
      <p>
        La segunda escala, también de <strong>A</strong> a <strong>E</strong>, con un pictograma de
        auto y gotas de lluvia. Mide la distancia de frenado sobre piso mojado desde una velocidad
        de referencia. Acá la diferencia entre letras es directamente seguridad: se estima que la
        distancia de frenado en mojado puede variar varios metros entre un neumático A y uno E
        frenando desde 80 km/h — la diferencia entre esquivar un obstáculo o no.
      </p>
      <p>
        Es una escala independiente de la de combustible: un neumático puede ser A en una y C en la
        otra. Por eso conviene mirar las dos letras, no asumir que van juntas.
      </p>

      <h2>Ruido externo: los decibeles y las ondas</h2>
      <p>
        Abajo de las dos escalas de color va el ruido de rodadura, expresado en decibeles (dB) y
        clasificado en tres franjas marcadas con ondas de sonido: una onda es la clase{" "}
        <strong>A</strong> (más silenciosa), dos es <strong>B</strong>, tres es <strong>C</strong>{" "}
        (más ruidosa, aunque todavía dentro del límite legal vigente). Es el ruido que el neumático
        emite hacia el exterior del vehículo al rodar, medido con un procedimiento estandarizado —no
        es una medida de cuánto se escucha adentro del auto, que depende también de la
        insonorización de la carrocería.
      </p>

      <h2>Un ejemplo real: 175/65 R14</h2>
      <p>
        Para no quedarnos sólo en la teoría, así se lee la etiqueta de un neumático concreto que
        tenemos en stock: la <strong>Grenlander Colo H02 175/65 R14</strong>, una de las medidas más
        pedidas para autos chicos. Su registro en EPREL marca <strong>C</strong> en eficiencia de
        combustible, <strong>C</strong> en frenado en mojado y <strong>67 dB</strong> de ruido
        externo, clase B. Son valores razonables para un neumático de uso urbano en esta franja de
        precio: sin ser lo más eficiente del mercado, tampoco está en el fondo de la tabla en
        ninguna de las dos escalas.
      </p>
      <p>
        Podés ver la etiqueta oficial completa, tal como figura en EPREL, en{" "}
        <Link href="/productos/grenlander-colo-h02-175-65-r14-86t">
          la ficha de este producto
        </Link>
        .
      </p>

      <h2>El QR y el registro EPREL: por qué importa</h2>
      <p>
        Desde 2021 la etiqueta incluye un código QR. Apunta a la ficha pública de ese neumático
        exacto —esa medida, ese índice de carga y velocidad— en{" "}
        <strong>EPREL (European Product Registry for Energy Labelling)</strong>, la base de datos
        que administra la Comisión Europea. Ahí el fabricante o importador carga los mismos datos
        de la etiqueta, y quedan expuestos de forma pública y auditable.
      </p>
      <p>
        Esto es lo que convierte a la etiqueta en algo más que un sticker: significa que el
        neumático está <strong>declarado y registrado</strong> ante un organismo regulador, con
        datos que cualquiera puede verificar de forma independiente. Es una garantía de que lo que
        dice la etiqueta se puede constatar, no que el fabricante lo escribió porque sí.
      </p>

      <h2>La C1: qué auto le corresponde</h2>
      <p>
        En la esquina de la etiqueta figura una clase, casi siempre <strong>C1</strong> para autos y
        camionetas livianas (C2 y C3 son para neumáticos comerciales de mayor carga). No es un dato
        que tengas que elegir: viene determinado por el tipo de neumático, sirve para que la
        etiqueta se compare entre productos del mismo segmento y no entre categorías distintas.
      </p>

      <h2>UTQG: la norma que no es europea</h2>
      <p>
        En varios de nuestros modelos, debajo de la etiqueta UE aparece otro dato:{" "}
        <strong>UTQG</strong> (Uniform Tire Quality Grading), con un número y dos letras —por
        ejemplo, <strong>420 A A</strong>. Es una norma de Estados Unidos, sin relación regulatoria
        con la etiqueta europea, que muchos fabricantes incluyen en el mismo sticker porque venden
        el mismo neumático en ambos mercados. El número es el desgaste relativo (treadwear, un dato
        que declara el propio fabricante); las dos letras son tracción y resistencia a la
        temperatura a alta velocidad. El detalle completo, con sus límites y por qué no todos los
        modelos lo tienen, está en{" "}
        <Link href="/blog/utqg-desgaste-traccion-temperatura">esta nota aparte</Link>.
      </p>

      <h2>En resumen</h2>
      <ol>
        <li>Dos escalas de color independientes, A a E: eficiencia de combustible y frenado en mojado.</li>
        <li>Ruido en dB con clase A/B/C (ondas de sonido) — es ruido hacia afuera del auto.</li>
        <li>
          El QR lleva a EPREL, el registro oficial: ahí se puede confirmar que los datos son reales
          y no un sticker inventado.
        </li>
        <li>UTQG es una norma aparte (EE.UU.), no forma parte de la etiqueta europea.</li>
      </ol>
      <p>
        En cada ficha de producto que tiene la etiqueta cargada mostramos la imagen oficial tal
        como figura en EPREL, junto a la foto del neumático.{" "}
        <Link href="/neumaticos">Buscá tu medida</Link> para ver el detalle completo del modelo que
        te interesa.
      </p>
    </ArticleLayout>
  );
}
