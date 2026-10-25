import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "etiqueta-de-presion-puerta-del-auto";
const TITLE = "Cómo leer la etiqueta de presión de la puerta de tu auto";
const SUBTITLE =
  "Bar, PSI, íconos de ocupantes y varias medidas en la misma calcomanía: qué significa cada fila y cuál te corresponde, con un ejemplo real de un auto que pasó por el taller.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo interpretar la etiqueta de presión del parante de la puerta: bar y PSI, filas por cantidad de ocupantes y carga, medidas de cada llanta y presión de la rueda de auxilio. Con foto de un caso real.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Dónde está la etiqueta con la presión de los neumáticos?",
    answer:
      "En la mayoría de los autos, en el parante de la puerta del conductor: abrís la puerta y la calcomanía está en el marco. En algunos modelos está en la tapa del tanque de combustible, y siempre figura en el manual del propietario.",
  },
  {
    question: "¿Cuál es la diferencia entre bar, kg/cm² y PSI?",
    answer:
      "Son tres unidades de la misma magnitud. 1 bar equivale a aproximadamente 1 kg/cm² y a unos 14,5 PSI. Las estaciones de servicio de Argentina suelen medir en PSI, por eso las etiquetas traen las dos columnas.",
  },
  {
    question: "¿Por qué hay varias filas con distinta presión?",
    answer:
      "Porque el fabricante pide más presión cuando el auto va más cargado. La fila con pocos ocupantes es para el uso diario; la fila con todos los asientos ocupados y equipaje es para viajes con carga completa.",
  },
  {
    question: "¿Por qué la etiqueta trae varias medidas de neumático?",
    answer:
      "Porque el mismo modelo se vende con llantas de distinto rodado, y cada medida puede pedir una presión distinta. Hay que mirar la fila que corresponde a la medida que figura en tus cubiertas.",
  },
  {
    question: "¿La presión de adelante y de atrás es la misma?",
    answer:
      "No siempre. La etiqueta separa eje delantero y eje trasero, y en muchos autos el trasero pide más presión cuando el auto va cargado. Por eso conviene regular cada eje con su valor.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-25" readingMinutes={5} faqs={FAQS}>
      <p>
        La presión correcta de tus neumáticos no la define quien fabricó las cubiertas: la define quien
        fabricó el auto, y la deja escrita en una etiqueta del marco de la puerta. Es una tabla chica, con
        símbolos y muchos números, y por eso casi nadie la lee completa. Acá la desarmamos con un ejemplo real:
        la etiqueta de un Audi.
      </p>

      <h2>Las columnas: bar, kg/cm² y PSI</h2>
      <p>
        Arriba de la tabla hay dos pares de columnas, una para el <strong>eje delantero</strong> y otra para el{" "}
        <strong>eje trasero</strong>. En cada una el valor aparece en bar (o kg/cm², que es casi lo mismo) y en
        PSI. En la foto, la primera fila dice <strong>2,0 bar / 29 PSI</strong> adelante y atrás. Si en la
        estación de servicio el inflador marca en PSI, usás la columna de la derecha de cada par.
      </p>

      <h2>Las filas: cuánta gente y cuánta carga</h2>
      <p>
        Cada medida tiene dos filas, identificadas con íconos de personas. Una muestra pocas personas y poco
        equipaje, y la otra los cinco asientos ocupados con el baúl cargado. En el ejemplo, para la misma medida,
        la presión trasera pasa de <strong>2,0 a 2,4 bar</strong> (29 a 35 PSI) cuando el auto va lleno.
      </p>
      <p>
        La regla práctica: para el uso de todos los días, la fila liviana; para salir de viaje con la familia y el
        baúl lleno, la fila completa, y volver a la liviana al regresar.
      </p>

      <h2>Los bloques: una presión para cada medida de llanta</h2>
      <p>
        Debajo de cada par de filas aparece un ícono de rueda con una o más medidas. En la etiqueta de la foto hay
        tres bloques: uno para <strong>225/55 R16, 225/50 R17 y 245/45 R17</strong>, otro para variantes con
        marca M+S (invierno) y un tercero para las versiones reforzadas XL. Los valores cambian de un bloque a
        otro, y en el último llegan a <strong>2,9 bar / 42 PSI</strong> atrás con el auto cargado.
      </p>
      <p>
        Por eso el primer paso es leer la medida impresa en el flanco de tus cubiertas y buscar ese bloque. Si no
        sabés cómo leerla, tenemos la guía de <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.
        Y si cambiaste el rodado o el índice de carga, la presión de la etiqueta puede dejar de corresponder: ahí
        conviene consultarnos.
      </p>

      <h2>La rueda de auxilio tiene su propia presión</h2>
      <p>
        Al pie de la etiqueta, la medida de la rueda de auxilio (en el ejemplo, <strong>T125/70 R19</strong>) con
        su valor propio: <strong>4,2 bar / 61 PSI</strong>. Es una rueda de uso temporal, finita y de alta presión,
        muy distinta de las cuatro del auto. Es la que casi nadie revisa, así que vale la pena medirla cada tanto
        junto con el resto.
      </p>

      <h2>Qué hacer con estos números</h2>
      <ol>
        <li>Medí siempre <strong>en frío</strong>, con el auto parado hace unas horas.</li>
        <li>Buscá en la etiqueta el bloque que coincide con la medida de tus cubiertas.</li>
        <li>Elegí la fila según los ocupantes y la carga del día.</li>
        <li>Regulá cada eje con su valor y no te olvides de la rueda de auxilio.</li>
      </ol>
      <p>
        Si todavía no revisaste cuánta presión es la correcta y qué pasa cuando falta o sobra, seguí con la nota de{" "}
        <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link>. Y si el desgaste ya muestra que
        estuvieron mal infladas, pasá por el taller: revisamos la presión en el momento y te decimos el estado de
        las cubiertas.
      </p>
    </ArticleLayout>
  );
}
