import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";

const SLUG = "carga-simple-y-dual-neumaticos-c";
const TITLE = "Carga simple y dual en neumáticos C: qué significa el 90/88 del flanco";
const SUBTITLE =
  "En un utilitario, el índice de carga casi nunca es un solo número. Por qué los neumáticos C traen dos cifras separadas por una barra, cuál corresponde a tu vehículo y qué pasa si las confundís.";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Los neumáticos C (comerciales, para utilitarios y furgones) llevan dos índices de carga: uno para montaje simple y otro para rodado dual. Qué significa cada número, tabla de conversión a kilos y medidas habituales en Argentina.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué significa el 90/88 en un neumático 175/65 R14C 90/88R?",
    answer:
      "Son dos índices de carga, no uno solo. El 90 es la carga máxima por neumático cuando el eje lleva una sola rueda de cada lado (montaje simple): 600 kg. El 88 es la carga máxima por neumático cuando ese eje lleva dos ruedas montadas juntas (rodado dual): 560 kg. La R que sigue es el índice de velocidad y aplica a ambos casos.",
  },
  {
    question: "¿Por qué el índice dual es más bajo que el simple?",
    answer:
      "Porque cuando hay dos ruedas por lado, el peso del eje se reparte entre cuatro contactos con el piso en vez de dos, y además cada neumático pierde apoyo por el lado que da hacia el otro rodado del mismo eje (menor huella efectiva). El fabricante exige que cada uno trabaje con un margen mayor, así que homologa una carga individual menor. La capacidad total del eje sigue siendo mayor en dual que en simple: lo que baja es el máximo por neumático, no el del conjunto.",
  },
  {
    question: "¿Cómo sé si mi utilitario usa montaje simple o dual?",
    answer:
      "La inmensa mayoría de los utilitarios livianos que circulan en Argentina (Kangoo, Partner, Berlingo, Doblò Cargo, Trafic, Expert, Jumpy en versión liviana) van en simple: una rueda por lado, en los dos ejes. El rodado dual aparece en el eje trasero de furgones más pesados (Sprinter, Master, Boxer, Ducato, Daily en ciertas configuraciones) y en algunos acoplados. Si tu vehículo tiene una sola rueda de cada lado atrás, usás el índice más alto de los dos: el simple.",
  },
  {
    question: "Mi neumático solo tiene un número de carga, sin el par. ¿Está mal?",
    answer:
      "No necesariamente. Los neumáticos de auto de pasajeros (sin la C) nunca se montan en dual, así que traen un solo índice y es normal. El problema aparece cuando un neumático con C —que sí está pensado para admitir montaje dual en algún vehículo— viene marcado con un solo número: ahí conviene confirmar con el fabricante cuál de los dos casos describe esa cifra antes de asumir la carga máxima.",
  },
  {
    question: "¿Puedo reemplazar un neumático con doble índice por uno con un solo número?",
    answer:
      "Solo si ese número, sin C, iguala o supera el índice simple que traía el original y tu vehículo monta en simple. Si el eje es dual, necesitás que el reemplazo también esté homologado para dual con un índice igual o mayor al original: no alcanza con mirar la carga total, porque un neumático sin C no está construido con la carcasa reforzada que exige ese uso.",
  },
];

const CARGA = [
  ["88", "560", "90", "600"],
  ["89", "580", "91", "615"],
  ["92", "630", "94", "670"],
  ["93", "650", "95", "690"],
  ["95", "690", "97", "730"],
  ["96", "710", "98", "750"],
  ["98", "750", "100", "800"],
  ["100", "800", "102", "850"],
  ["102", "850", "104", "900"],
  ["103", "875", "105", "925"],
  ["104", "900", "106", "950"],
  ["105", "925", "107", "975"],
  ["106", "950", "108", "1000"],
  ["107", "975", "109", "1030"],
  ["108", "1000", "110", "1060"],
  ["110", "1060", "112", "1120"],
];

const EJEMPLOS = [
  ["175/65 R14C 90/88R", "600 kg", "560 kg", "Kangoo, Partner, Berlingo (motorización liviana)"],
  ["185/75 R16C 104/102R", "900 kg", "850 kg", "Trafic, Ducato, Boxer, Jumper, Sprinter liviana"],
  ["195/70 R15C 104/102R", "900 kg", "850 kg", "Trafic, Expert, Jumpy"],
  ["205/65 R16C 107/105R", "975 kg", "925 kg", "Sprinter, Crafter"],
  ["215/65 R16C 109/107R", "1030 kg", "975 kg", "Sprinter, Daily"],
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-09-21"
      readingMinutes={6}
      faqs={FAQS}
    >
      <p>
        Un neumático de auto lleva un solo índice de carga: <strong>91</strong> en{" "}
        <strong>205/55 R16 91V</strong>, por ejemplo. Pero apenas pasás a un utilitario, esa
        cifra se convierte en dos, separadas por una barra:
      </p>
      <p>
        <strong>175/65 R14C 90/88R</strong>
      </p>
      <p>
        No es un error de impresión ni una medida rara. Es el formato estándar para cualquier
        neumático con <strong>C</strong> después del rodado —comercial, de carga—, y describe dos
        situaciones de uso distintas del mismo neumático.
      </p>

      <h2>Por qué hay dos números y no uno</h2>
      <p>
        La carga que un neumático puede sostener no es una propiedad fija: depende de cómo esté
        montado. Un eje puede llevar <strong>una rueda de cada lado</strong> (montaje simple, lo
        habitual en un auto o una camioneta liviana) o{" "}
        <strong>dos ruedas juntas de cada lado</strong> (rodado dual o gemelo, típico del eje
        trasero de un furgón grande cargado o de un acoplado).
      </p>
      <p>
        En simple, cada neumático soporta solo, sin ayuda, todo lo que le toca de ese lado del
        eje. En dual, dos neumáticos comparten esa misma carga por lado —pero no la comparten
        perfectamente: el que queda hacia adentro pierde apoyo porque su huella se ve limitada
        por la proximidad del otro neumático, y ambos trabajan con menos margen para disipar
        calor porque están más cerca. Por eso el fabricante no le permite a cada neumático dual
        cargar la mitad de lo que cargaría uno en simple: le exige que cargue{" "}
        <strong>bastante menos que uno en simple</strong>, como compensación por esa pérdida de
        eficiencia individual.
      </p>
      <p>
        El resultado son dos índices homologados para el mismo neumático:
      </p>
      <ul>
        <li>
          <strong>Primer número</strong> (más alto): carga máxima por neumático en{" "}
          <strong>montaje simple</strong>.
        </li>
        <li>
          <strong>Segundo número</strong> (más bajo): carga máxima por neumático en{" "}
          <strong>montaje dual</strong>.
        </li>
      </ul>
      <p>
        En <strong>90/88</strong>: 90 se traduce en 600 kg (simple), 88 se traduce en 560 kg
        (dual). El símbolo de velocidad que sigue —la R, en este caso— vale para los dos casos por
        igual, así que no se repite.
      </p>

      <h2>Cuál de los dos números te corresponde</h2>
      <p>
        Depende exclusivamente de cuántas ruedas lleva ese eje en tu vehículo, no de la marca ni
        del modelo del neumático:
      </p>
      <ul>
        <li>
          Si tu utilitario tiene <strong>una sola rueda de cada lado</strong> —la gran mayoría de
          los que circulan en Argentina: Kangoo, Partner, Berlingo, Doblò Cargo, Trafic, Expert,
          Jumpy en su versión liviana— usás el <strong>primer número</strong>, el más alto.
        </li>
        <li>
          Si tu eje trasero lleva <strong>dos ruedas montadas juntas de cada lado</strong> —furgones
          más pesados como Sprinter, Master, Boxer, Ducato o Daily en ciertas configuraciones, y
          acoplados— corresponde el <strong>segundo número</strong>, el más bajo, para esas
          ruedas traseras. El eje delantero de esos mismos vehículos suele ir en simple, así que
          ahí sí se aplica el primer número.
        </li>
      </ul>
      <p>
        Un error común es mirar el índice más alto sin fijarse si el eje es dual, y asumir una
        capacidad de carga que ese neumático, montado así, no tiene homologada.
      </p>

      <h3>Tabla de conversión: índice dual / índice simple a kilos</h3>
      <table>
        <thead>
          <tr>
            <th>Índice dual</th>
            <th>Carga en dual (por neumático)</th>
            <th>Índice simple</th>
            <th>Carga en simple (por neumático)</th>
          </tr>
        </thead>
        <tbody>
          {CARGA.map(([dual, kgDual, simple, kgSimple]) => (
            <tr key={dual}>
              <td>{dual}</td>
              <td>{kgDual} kg</td>
              <td>
                <strong>{simple}</strong>
              </td>
              <td>{kgSimple} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Para el resto de los índices —los que no llevan C y no se montan nunca en dual— la tabla
        completa está en la nota de{" "}
        <Link href="/blog/indice-de-carga-y-velocidad">índice de carga y velocidad</Link>.
      </p>

      <h2>Medidas C habituales en Argentina</h2>
      <p>
        A modo orientativo, así se ven los dos índices en algunas medidas C comunes. Son valores
        de referencia: la especificación que manda siempre es la de la calcomanía en el marco de
        la puerta del conductor o el manual del vehículo, porque puede variar según la
        motorización y el año.
      </p>
      <table>
        <thead>
          <tr>
            <th>Medida</th>
            <th>Carga simple</th>
            <th>Carga dual</th>
            <th>Vehículos habituales</th>
          </tr>
        </thead>
        <tbody>
          {EJEMPLOS.map(([medida, simple, dual, vehiculos]) => (
            <tr key={medida}>
              <td>
                <strong>{medida}</strong>
              </td>
              <td>{simple}</td>
              <td>{dual}</td>
              <td>{vehiculos}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Qué pasa si el dato publicado trae un solo número</h2>
      <p>
        Pasa seguido: una ficha técnica, una góndola o hasta el flanco de fábrica muestran solo un
        índice en un neumático con C, cuando en rigor ese modelo está homologado con dos. No
        significa que el neumático no sirva para dual, sino que falta el dato completo. Antes de
        asumir cuál de los dos casos describe ese número —y sobre todo antes de usarlo para
        calcular cuánto puede cargar un eje dual— conviene confirmar con la ficha del fabricante o
        directamente con nosotros, dándonos la medida completa.
      </p>

      <h2>En resumen</h2>
      <ol>
        <li>
          Los neumáticos con C llevan dos índices de carga: el primero para montaje simple, el
          segundo para rodado dual. Siempre es más alto el simple.
        </li>
        <li>
          Cuál te corresponde depende de cuántas ruedas lleva tu eje, no de preferencia ni de
          marca.
        </li>
        <li>
          La capacidad total del eje en dual sigue siendo mayor que en simple; lo que baja es el
          máximo por neumático individual.
        </li>
        <li>
          Un neumático sin C nunca trae doble índice porque nunca se monta en dual.
        </li>
      </ol>
      <p>
        Si tenés dudas sobre qué índice corresponde a tu utilitario o furgón, escribinos con la
        marca, el modelo, el año y si el eje trasero es simple o dual, y te confirmamos la medida
        exacta. <Link href="/neumaticos">Buscá tu medida</Link> para ver stock y precio.
      </p>
    </ArticleLayout>
  );
}
