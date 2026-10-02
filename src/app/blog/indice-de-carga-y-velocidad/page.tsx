import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { LOAD_SPEED_CODES } from "@/lib/load-speed";
import { canonical } from "@/lib/seo";
import { LOAD_INDEX_KG, SPEED_RATING_KMH } from "@/lib/tire-sizes";

const SLUG = "indice-de-carga-y-velocidad";
const TITLE = "Índice de carga y velocidad: qué significan el 91 y la V del flanco";
const SUBTITLE =
  "Después de la medida vienen dos códigos que casi nadie mira y que definen cuánto peso aguanta y a qué velocidad puede rodar tu neumático. Con las tablas completas.";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Qué significan el índice de carga y el índice de velocidad de un neumático, tablas de equivalencia en kg y km/h, y por qué no conviene bajar de los valores originales.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué significa 91V en un neumático?",
    answer:
      "El 91 es el índice de carga: cada neumático soporta hasta 615 kg. La V es el índice de velocidad: está homologado para rodar hasta 240 km/h de forma sostenida. Los dos códigos van juntos, después de la medida, en el flanco. Por ejemplo: 205/55 R16 91V.",
  },
  {
    question: "¿Puedo poner un neumático con índice de carga menor al original?",
    answer:
      "No. El índice de carga original está calculado sobre el peso máximo autorizado del vehículo con un margen de seguridad. Bajarlo significa hacer trabajar el neumático por encima de lo que su estructura tolera, con riesgo de sobrecalentamiento y falla del flanco. Subirlo sí se puede, y en camionetas de trabajo hasta conviene.",
  },
  {
    question: "¿Y si pongo un índice de velocidad más bajo?",
    answer:
      "Tampoco es recomendable, aunque nunca vayas a esa velocidad. El índice de velocidad no describe sólo la velocidad máxima: correlaciona con la rigidez de la carcasa y la capacidad de disipar calor. Un índice más bajo suele implicar un neumático estructuralmente menos exigente, con peor respuesta en maniobras bruscas.",
  },
  {
    question: "¿Qué quiere decir la C después del rodado?",
    answer:
      "Que es un neumático comercial o de carga, pensado para utilitarios y camionetas de trabajo. Un 205/70 R15C tiene una carcasa reforzada, trabaja a presiones más altas y soporta bastante más peso que su equivalente sin C. Suelen indicar la carga con dos números, uno para montaje simple y otro para rodado doble.",
  },
  {
    question: "¿Dónde veo el índice que lleva mi auto de fábrica?",
    answer:
      "En la misma calcomanía del parante de la puerta del conductor donde figura la presión, y en el manual del vehículo. Ahí está la especificación completa: medida, índice de carga e índice de velocidad. Esa es la referencia, no lo que tenga puesto el auto ahora, que puede haber sido cambiado por alguien sin criterio.",
  },
];

const CARGA = Object.entries(LOAD_INDEX_KG);
const VELOCIDAD = Object.entries(SPEED_RATING_KMH);

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-07-31"
      readingMinutes={7}
      faqs={FAQS}
    >
      <p>
        Cuando alguien elige neumáticos, mira la medida y mira el precio. Los dos caracteres que van
        justo después de la medida se pasan por alto casi siempre, y sin embargo son los que
        determinan cuánto peso puede sostener la rueda y a qué velocidad puede hacerlo sin
        degradarse. En un flanco que dice <strong>205/55 R16 91V</strong>, el{" "}
        <strong>91</strong> y la <strong>V</strong> son exactamente eso.
      </p>
      <p>
        Si todavía no tenés claro qué significan el 205, el 55 y el R16,{" "}
        <Link href="/blog/como-leer-medida-neumatico">empezá por la guía de la medida</Link> y
        volvé.
      </p>

      <h2>Índice de carga: cuánto peso aguanta cada rueda</h2>
      <p>
        Es un número de dos o tres cifras que se traduce, mediante una tabla normalizada (ETRTO), a
        un peso máximo en kilogramos <strong>por neumático</strong>. Un índice 91 equivale a 615 kg;
        como son cuatro ruedas, el conjunto soporta 2.460 kg, bastante por encima del peso de un
        auto mediano cargado. Ese margen es deliberado: absorbe las transferencias de peso al
        frenar y al doblar.
      </p>
      <p>
        La regla es simple: <strong>nunca por debajo del valor original</strong>. Podés subirlo, y a
        veces conviene —una camioneta que trabaja cargada agradece un índice mayor— pero bajarlo
        deja al neumático operando fuera de su rango de diseño. El síntoma no es inmediato: es
        calor acumulado, deformación del flanco y, eventualmente, una falla estructural en ruta.
      </p>

      <h3>Tabla de índice de carga</h3>
      <p>
        Esta es la tabla completa de los índices que se usan habitualmente en neumáticos de auto,
        camioneta y utilitario. El número siempre expresa la carga máxima de <strong>una</strong>
        cubierta, no del vehículo entero.
      </p>
      <table>
        <thead>
          <tr>
            <th>Índice</th>
            <th>Carga máxima por neumático</th>
          </tr>
        </thead>
        <tbody>
          {CARGA.map(([indice, kg]) => (
            <tr key={indice}>
              <td>
                <strong>{indice}</strong>
              </td>
              <td>{kg} kg</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Índice de velocidad: hasta cuánto puede rodar</h2>
      <p>
        Es una letra que indica la velocidad máxima sostenida a la que el neumático fue homologado,
        con carga nominal. Acá viene lo que la mayoría no sabe: aunque vos nunca vayas a 240 km/h,
        el índice no habla sólo de velocidad punta.{" "}
        <strong>
          Correlaciona con la rigidez de la carcasa y con la capacidad de disipar calor
        </strong>
        . Un neumático V está construido para soportar exigencia térmica y mecánica alta, y eso se
        siente también a 100 km/h en una maniobra de esquive.
      </p>
      <p>
        Por eso la recomendación es la misma que con la carga: respetá el índice original o subilo,
        no lo bajes. La única excepción tolerada son los neumáticos de invierno en mercados donde
        se usan, que admiten un escalón menos con la limitación señalizada en el tablero. En
        Argentina, en la práctica, no aplica.
      </p>

      <h3>Tabla de índice de velocidad</h3>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Velocidad máxima</th>
          </tr>
        </thead>
        <tbody>
          {VELOCIDAD.map(([codigo, kmh]) => (
            <tr key={codigo}>
              <td>
                <strong>{codigo}</strong>
              </td>
              <td>{kmh} km/h</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Una curiosidad de la tabla: la <strong>H</strong> (210 km/h) está desordenada, entre la U y
        la V. Es un resabio histórico —originalmente H significaba &quot;high performance&quot; y
        era el tope de la escala— que quedó cuando se agregaron letras por encima.
      </p>

      <h2>Buscá el código exacto de tu neumático</h2>
      <p>
        Si buscaste una combinación puntual —por ejemplo, &quot;qué significa 86T en un neumático&quot;—,
        abrí su explicación directa. Vas a ver la carga en kilos y la velocidad en km/h sin tener
        que interpretar la tabla.
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {LOAD_SPEED_CODES.map((code) => (
          <Link
            key={code}
            href={`/indice-carga-velocidad/${code.toLowerCase()}`}
            className="rounded-lg border border-slate-200 px-3 py-2 text-center no-underline hover:border-navy-500"
          >
            {code}
          </Link>
        ))}
      </div>

      <h2>La C de los neumáticos de carga</h2>
      <p>
        Si el rodado viene seguido de una <strong>C</strong> —por ejemplo{" "}
        <strong>205/70 R15C</strong>— estás frente a un neumático comercial, pensado para
        utilitarios y camionetas de trabajo. Tiene la carcasa reforzada con más capas, trabaja a
        presiones bastante más altas y soporta mucho más peso que su equivalente sin C.
      </p>
      <p>
        Estos suelen traer <strong>dos índices de carga</strong> separados por una barra, como
        &quot;104/102&quot;: el primero es para montaje simple y el segundo para rodado doble, donde
        cada neumático carga algo menos porque comparte el eje. Si tu utilitario vino con C de
        fábrica, no lo reemplaces por uno sin C aunque la medida coincida: no es el mismo producto.
        La nota sobre{" "}
        <Link href="/blog/carga-simple-y-dual-neumaticos-c">
          carga simple y dual en neumáticos C
        </Link>{" "}
        entra en el detalle de por qué son dos números y cuál te corresponde.
      </p>

      <h2>Cómo leer un flanco completo</h2>
      <p>Poniéndolo todo junto, un flanco que dice:</p>
      <p>
        <strong>205/55 R16 91V</strong>
      </p>
      <ul>
        <li>
          <strong>205</strong> — ancho de sección en milímetros
        </li>
        <li>
          <strong>55</strong> — perfil: el flanco mide el 55% del ancho, o sea 112,75 mm
        </li>
        <li>
          <strong>R</strong> — construcción radial
        </li>
        <li>
          <strong>16</strong> — rodado en pulgadas
        </li>
        <li>
          <strong>91</strong> — índice de carga: 615 kg por neumático
        </li>
        <li>
          <strong>V</strong> — índice de velocidad: hasta 240 km/h
        </li>
      </ul>

      <h2>En resumen</h2>
      <ol>
        <li>El índice de carga y el de velocidad van después de la medida, en ese orden.</li>
        <li>Los dos se pueden subir respecto del original; ninguno se debe bajar.</li>
        <li>
          La referencia correcta es la calcomanía de la puerta del conductor, no lo que el auto
          tenga puesto hoy.
        </li>
        <li>La C indica neumático de carga y no es intercambiable con uno común.</li>
      </ol>
      <p>
        En cada ficha de producto de nuestro catálogo publicamos el índice de carga y el de
        velocidad traducidos a kilos y a km/h, para que no tengas que buscar la tabla.{" "}
        <Link href="/neumaticos">Buscá tu medida</Link> y comparalos directamente. Si tenés dudas
        sobre cuál corresponde a tu vehículo, escribinos con la marca, el modelo y el año y lo
        chequeamos.
      </p>
    </ArticleLayout>
  );
}
