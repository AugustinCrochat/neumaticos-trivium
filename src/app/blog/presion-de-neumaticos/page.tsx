import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "presion-de-neumaticos";
const TITLE = "Presión de neumáticos: cuánto inflar y cada cuánto revisarla";
const SUBTITLE =
  "La presión correcta no está escrita en el neumático: está en la puerta de tu auto. Te explicamos dónde mirarla, cómo medirla bien y qué pasa cuando está mal.";

export const metadata: Metadata = {
  ...blogShare("presion-de-neumaticos"),
  title: TITLE,
  description:
    "Cuánta presión llevan los neumáticos de tu auto, dónde encontrar el valor correcto, cómo medirla en frío y qué consecuencias tiene inflar de menos o de más.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuánta presión hay que ponerle a los neumáticos?",
    answer:
      "La que indica el fabricante del auto, no la del neumático. El valor está en una calcomanía en el parante de la puerta del conductor, en la tapa del tanque de combustible o en el manual. En autos chicos y medianos suele estar entre 30 y 35 PSI, pero varía según el modelo y la carga.",
  },
  {
    question: "¿El número que dice el neumático es la presión que hay que ponerle?",
    answer:
      "No, y es el error más común. El valor grabado en el flanco (por ejemplo 'MAX. PRESS. 44 PSI') es la presión máxima que el neumático soporta estructuralmente, no la presión de trabajo recomendada. Inflar a ese valor endurece el andar, reduce la superficie de contacto y desgasta el centro de la banda.",
  },
  {
    question: "¿Se mide en frío o en caliente?",
    answer:
      "En frío, siempre. Después de andar, el aire dentro del neumático se calienta y la presión sube entre 3 y 6 PSI, así que una medición en caliente te da un valor falsamente alto. Medí antes de salir, o después de que el auto haya estado parado al menos tres horas. Y nunca desinfles un neumático caliente para 'corregir'.",
  },
  {
    question: "¿Cada cuánto hay que revisar la presión?",
    answer:
      "Una vez por mes como mínimo, y siempre antes de un viaje largo. Un neumático en buen estado pierde de forma natural entre 1 y 2 PSI por mes por permeación del caucho, sin que haya ninguna pérdida ni pinchadura. En invierno la caída es más marcada porque el aire se contrae con el frío.",
  },
  {
    question: "¿Conviene inflar con nitrógeno?",
    answer:
      "El nitrógeno mantiene la presión algo más estable porque su molécula se escapa más lento y no arrastra humedad. La diferencia es real pero chica para uso común: si igual revisás la presión todos los meses, el aire común cumple perfectamente. En competición, donde la temperatura del neumático varía muchísimo, ahí sí se justifica.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Mantenimiento"
      date="2026-07-31"
      readingMinutes={5}
      faqs={FAQS}
    >
      <p>
        De todo lo que se puede hacer para que los neumáticos duren más y el auto frene mejor, la
        presión es lo más barato, lo más rápido y lo que más gente tiene mal. Es literalmente
        gratis en cualquier estación de servicio, lleva tres minutos, y aun así la mayoría de los
        autos que entran al taller vienen con al menos una rueda fuera de rango.
      </p>

      <h2>Dónde está el valor correcto</h2>
      <p>
        Acá está el malentendido más frecuente. El número grande que aparece en el flanco del
        neumático —algo como <strong>&quot;MAX. PRESS. 44 PSI&quot;</strong>— no es la presión que
        tenés que poner. Es la presión máxima que la estructura del neumático tolera. Usarla como
        referencia es como manejar siempre en la línea roja del cuentavueltas.
      </p>
      <p>La presión de trabajo la define el fabricante del auto, y figura en tres lugares:</p>
      <ul>
        <li>
          <strong>La calcomanía del parante de la puerta del conductor.</strong> Es el lugar más
          común. Abrí la puerta y mirá el marco.
        </li>
        <li>
          <strong>La tapa del tanque de combustible</strong>, en algunos modelos.
        </li>
        <li>
          <strong>El manual del propietario</strong>, en la sección de especificaciones.
        </li>
      </ul>
      <p>
        Esa etiqueta suele traer dos valores: uno para uso normal y otro para el auto cargado o con
        muchos ocupantes. Si salís de viaje con la familia y el baúl lleno, usá el segundo.
      </p>
      <p>
        Si la tabla te resulta confusa, armamos una guía con un ejemplo real:{" "}
        <Link href="/blog/etiqueta-de-presion-puerta-del-auto">cómo leer la etiqueta de presión de la puerta</Link>.
      </p>

      <h2>Cómo medirla bien</h2>
      <p>
        La medición tiene que hacerse <strong>en frío</strong>. Al andar, el rozamiento calienta el
        aire dentro del neumático y la presión sube entre 3 y 6 PSI. Si medís en caliente, vas a
        leer un valor alto y la tentación es desinflar, con lo cual quedás por debajo de lo correcto
        cuando el neumático se enfría.
      </p>
      <p>
        En frío significa: el auto estuvo parado al menos tres horas, o recorrió menos de dos
        kilómetros a velocidad baja. Si la estación de servicio te queda lejos, la alternativa es
        medir en casa con un manómetro propio —cuestan poco y son el accesorio más útil que podés
        tener en la guantera— y corregir sabiendo cuánto sumar.
      </p>
      <p>
        Y no te olvides de <strong>la rueda de auxilio</strong>. Es la que nadie revisa y la única
        que necesitás justo cuando ya tenés un problema.
      </p>

      <h2>Qué pasa si está mal</h2>

      <h3>Presión baja</h3>
      <p>
        Es el caso más peligroso y el más frecuente. Con poca presión el neumático se aplasta, los
        flancos flexionan mucho más de lo que deberían y se genera calor. Ese calor es el que
        termina destruyendo la estructura interna. Las consecuencias, en orden:
      </p>
      <ul>
        <li>
          <strong>Se comen los bordes</strong> de la banda de rodamiento, mientras el centro queda
          sano.
        </li>
        <li>
          <strong>Sube el consumo de combustible</strong>: hay más resistencia a la rodadura y el
          motor tiene que compensarla.
        </li>
        <li>
          <strong>La dirección se vuelve imprecisa</strong> y el auto se siente blando al doblar.
        </li>
        <li>
          <strong>Riesgo de reventón</strong> en ruta, por acumulación de calor en el flanco. Es la
          causa más común de estallidos a alta velocidad.
        </li>
      </ul>

      <h3>Presión alta</h3>
      <p>
        Menos peligroso, pero igual de caro a la larga. El neumático se abomba, apoya sobre una
        franja central más angosta y eso significa:
      </p>
      <ul>
        <li>
          <strong>Desgaste en el centro</strong> de la banda, con los bordes casi sin usar.
        </li>
        <li>
          <strong>Menos superficie de contacto</strong>, o sea menos agarre al frenar y en curva.
        </li>
        <li>
          <strong>Andar más duro</strong> y más ruido: cada irregularidad del pavimento llega
          directo al habitáculo.
        </li>
        <li>
          <strong>Más vulnerabilidad a los baches</strong>: con el neumático tenso, un golpe fuerte
          puede cortar la carcasa.
        </li>
      </ul>

      <h2>Valores de referencia</h2>
      <p>
        Insistimos: usá el valor de tu auto. Esta tabla es sólo para que sepas si el número que te
        dio la etiqueta está dentro de lo esperable.
      </p>
      <table>
        <thead>
          <tr>
            <th>Tipo de vehículo</th>
            <th>Rango habitual (en frío)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Auto chico (city car, hatchback)</td>
            <td>29 – 33 PSI</td>
          </tr>
          <tr>
            <td>Auto mediano / sedán</td>
            <td>32 – 35 PSI</td>
          </tr>
          <tr>
            <td>SUV / crossover</td>
            <td>33 – 36 PSI</td>
          </tr>
          <tr>
            <td>Camioneta (pick-up)</td>
            <td>35 – 40 PSI</td>
          </tr>
          <tr>
            <td>Neumático de carga (marcado C)</td>
            <td>45 – 65 PSI según carga</td>
          </tr>
        </tbody>
      </table>
      <p>
        Los neumáticos de carga con marcado <strong>C</strong> trabajan a presiones bastante más
        altas y son el caso donde más importa respetar el valor de chapa según el peso que llevás.
        Si usás la camioneta cargada durante la semana y vacía el fin de semana, lo ideal es
        ajustar.
      </p>

      <h2>Una rutina de tres minutos</h2>
      <ol>
        <li>Una vez por mes, con el auto frío, pasá por el aire.</li>
        <li>Mirá la calcomanía de la puerta y ponéle ese valor a las cuatro.</li>
        <li>Revisá también el auxilio.</li>
        <li>
          Aprovechá para mirar el dibujo: si llegaste a los testigos de desgaste,{" "}
          <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">ya es momento de cambiarlos</Link>.
        </li>
      </ol>
      <p>
        En el local te controlamos la presión sin cargo, vengas o no a comprar. Si de paso notás que
        el auto tira para un lado o sentís vibración en el volante, avisanos:{" "}
        <Link href="/servicios">eso ya es alineación o balanceo</Link>, y conviene resolverlo antes
        de que se coma un juego entero. Y si te ofrecen inflar con nitrógeno, mirá{" "}
        <Link href="/blog/nitrogeno-en-neumaticos-vale-la-pena">qué mejora de verdad y cuánto conviene pagar</Link>.
      </p>
    </ArticleLayout>
  );
}
