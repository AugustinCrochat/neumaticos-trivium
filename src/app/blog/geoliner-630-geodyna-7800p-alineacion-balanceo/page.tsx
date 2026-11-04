import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "geoliner-630-geodyna-7800p-alineacion-balanceo";
const TITLE = "Alineación con Geoliner 630 y balanceo con Geodyna 7800P: el equipo hace la diferencia";
const SUBTITLE =
  "Una alineación o un balanceo mal hechos no se notan en el momento, se notan en el desgaste. Por qué elegimos estos dos equipos Hofmann y qué ventaja concreta le dan a tu auto.";

export const metadata: Metadata = {
  ...blogShare("geoliner-630-geodyna-7800p-alineacion-balanceo"),
  title: TITLE,
  description:
    resumen("Cómo funciona la alineadora 3D Hofmann Geoliner 630 y la balanceadora Hofmann Geodyna 7800P que usamos en nuestro taller, y qué diferencia hacen en la precisión, la duración de los neumáticos y la ausencia de vibraciones."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué diferencia hay entre una alineadora 3D y una tradicional?",
    answer:
      "La alineadora tradicional usa sensores mecánicos o láser fijados a cada rueda, sensibles a golpes y desajustes. La 3D, como la Geoliner 630, mide con cámaras de video que registran la posición real de las cuatro ruedas en el espacio, detectan sola una tensión rara en la suspensión o una condición ambiental que puede alterar la medición, y avisan antes de dar un resultado que después habría que corregir dos veces.",
  },
  {
    question: "¿Por qué mi auto vibra en el volante después de cambiar los neumáticos?",
    answer:
      "Casi siempre es un balanceo que quedó con un desbalance residual mínimo, imperceptible al ojo pero que a 100 km/h se traduce en vibración. La Geodyna 7800P mide con un plano virtual patentado que no se altera por errores de sujeción ni por la posición del sensor, así que el desbalance que reporta es el real de la rueda, no un número aproximado.",
  },
  {
    question: "¿Sirve balancear con contrapesos si la llanta es de aleación y no quiero que se vean?",
    answer:
      "Sí. El modo de peso dividido de la Geodyna 7800P reparte el contrapeso necesario en dos posiciones calculadas para que queden ocultas detrás de los rayos de la llanta, en vez de un solo peso pegado a la vista en el borde exterior. El resultado de balanceo es el mismo, cambia solo dónde queda el peso.",
  },
  {
    question: "¿Cada cuánto hay que alinear y balancear?",
    answer:
      "Como referencia general, cada 10.000 km o al notar un desgaste irregular, tirón hacia un lado o vibración en el volante — y siempre que se cambian neumáticos, se toca la suspensión o se pega un pozo fuerte. La nota completa está en el blog, en \"Alineación y balanceo: qué es cada cosa\".",
  },
  {
    question: "¿Estos equipos alcanzan para camionetas y llantas grandes?",
    answer:
      "Sí. La Geoliner 630 mide rodados de 12 a 24 pulgadas y vías de hasta 244 cm, y la Geodyna 7800P balancea ruedas de hasta 42 pulgadas de diámetro total y 70 kg, el rango que cubre desde un auto chico hasta una pickup con llanta alta.",
  },
  {
    question: "¿Neumáticos Trivium vende esta clase de equipos a otros talleres?",
    answer:
      "Sí, a través de Trivium Pro, nuestra unidad de negocio dedicada al equipamiento profesional para talleres, gomerías y concesionarias: alineadoras 3D Hofmann, balanceadoras, elevadores, desarmadoras y herramientas neumáticas, con instalación y service oficial en todo el país. El catálogo completo está en pro.trivium.ar.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Servicios"
      date="2026-09-21"
      readingMinutes={6}
      faqs={FAQS}
    >
      <p>
        Alinear y balancear son dos servicios que casi nunca se ven fallar en el momento. El auto
        sale del taller, parece andar bien, y el problema aparece semanas después: un neumático
        que se desgasta raro de un lado, una vibración que va y viene con la velocidad. Ahí es
        donde se nota si el equipo que se usó fue de verdad preciso o solo &quot;dio un número&quot;.
        En nuestro taller trabajamos con dos equipos Hofmann pensados exactamente para eso: la
        alineadora 3D <strong>Geoliner 630</strong> y la balanceadora <strong>Geodyna 7800P</strong>.
      </p>

      <h2>Alineación 3D con la Hofmann Geoliner 630</h2>
      <div className="my-8 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <Image
          src="/images/blog/geoliner-630-alineadora-trivium.webp"
          alt="Alineación delantera de un auto con la alineadora 3D Hofmann Geoliner 630 en el taller de Neumáticos Trivium"
          width={1600}
          height={1200}
          className="w-full h-auto"
        />
      </div>
      <p>
        La Geoliner 630 mide con cámaras de video de alta definición en vez de sensores mecánicos
        pegados a cada rueda. Esa diferencia importa: un sensor mecánico se puede desajustar con un
        golpe o quedar mal calibrado sin que nadie lo note, mientras que el sistema de cámaras
        registra en tiempo real la posición de las cuatro ruedas y detecta solo si hay algo raro
        —una tensión inusual en la suspensión, una condición del entorno que puede alterar la
        lectura— antes de tirar un resultado.
      </p>
      <p>
        El sistema <strong>VODI</strong> (indicador de orientación con luces LED rojas y verdes)
        guía al técnico durante toda la medición, así que el margen de error humano —tocar el punto
        equivocado, moverse antes de tiempo— baja. Y la función <strong>EZ-Toe</strong>{" "}
        facilita llegar a los puntos de ajuste de convergencia que en algunos autos quedan
        escondidos y mal accesibles, donde un ajuste apurado suele dejar el auto &quot;casi&quot;
        bien alineado.
      </p>
      <p>Algunos datos concretos del equipo, para quien quiera compararlo con otro:</p>
      <table>
        <thead>
          <tr>
            <th>Especificación</th>
            <th>Rango</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Diámetro de rueda</td>
            <td>12&quot; a 24&quot;</td>
          </tr>
          <tr>
            <td>Distancia entre ejes</td>
            <td>201 a 457 cm</td>
          </tr>
          <tr>
            <td>Ancho de vía</td>
            <td>122 a 244 cm</td>
          </tr>
          <tr>
            <td>Ángulos que mide</td>
            <td>Caída (camber), avance (caster), convergencia (toe), SAI, ángulo de chasis, giro máximo</td>
          </tr>
        </tbody>
      </table>

      <h2>Balanceo con la Hofmann Geodyna 7800P</h2>
      <div className="my-8 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <Image
          src="/images/blog/geodyna-7800p-balanceadora-trivium.webp"
          alt="Balanceo de ruedas con la balanceadora Hofmann Geodyna 7800P en el taller de Neumáticos Trivium"
          width={1600}
          height={1200}
          className="w-full h-auto"
        />
      </div>
      <p>
        Balancear una rueda es compensar el peso que no quedó perfectamente distribuido en el
        conjunto llanta + neumático, para que al girar a alta velocidad no genere una vibración
        periódica que se siente en el volante o en el asiento. La Geodyna 7800P mide ese desbalance
        con una técnica de <strong>plano virtual</strong> patentada, que a diferencia de los
        sistemas más simples no se altera por cómo quedó sujeta la rueda ni por vibraciones
        externas del taller —el número que muestra es el desbalance real, no una aproximación.
      </p>
      <p>
        Detecta sola el ancho de la llanta por sonar (<strong>SmartSonar</strong>) y el número y la
        posición de los rayos con un escáner láser, así que no depende de que el técnico tipee bien
        una medida a mano —una fuente de error común en balanceadoras más viejas. La función{" "}
        <strong>easyWeight</strong> marca con láser el punto exacto donde va cada contrapeso, y el{" "}
        <strong>modo de peso dividido</strong> reparte el peso en dos puntos ocultos detrás de los
        rayos en vez de uno solo a la vista, para que la llanta de aleación no quede con un
        contrapeso pegado en el borde.
      </p>
      <table>
        <thead>
          <tr>
            <th>Especificación</th>
            <th>Rango</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ancho máximo de llanta</td>
            <td>20&quot; (51 cm)</td>
          </tr>
          <tr>
            <td>Diámetro máximo de rueda</td>
            <td>42&quot; (107 cm)</td>
          </tr>
          <tr>
            <td>Peso máximo de rueda</td>
            <td>70 kg</td>
          </tr>
        </tbody>
      </table>

      <h2>Qué significa esto para vos, en la práctica</h2>
      <ul>
        <li>
          <strong>Menos vueltas al taller.</strong> Un balanceo mal medido se nota apenas se llega a
          cierta velocidad, y obliga a volver. Medir con plano virtual reduce ese margen de error
          desde el arranque.
        </li>
        <li>
          <strong>Neumáticos que duran más.</strong> Una alineación imprecisa desgasta el neumático
          de forma pareja pero incorrecta —en el borde interior o exterior— y ese desgaste no se
          revierte: acorta la vida útil aunque el neumático sea nuevo.
        </li>
        <li>
          <strong>Llantas de aleación sin contrapesos a la vista.</strong> El peso dividido de la
          Geodyna 7800P es puramente estético, pero para quien invirtió en llantas lindas, importa.
        </li>
        <li>
          <strong>Sirve para camionetas y llantas altas</strong>, no solo para autos chicos: el rango
          de ambos equipos cubre rodados grandes y ruedas pesadas sin perder precisión.
        </li>
      </ul>

      <h2>Si sos dueño de un taller: estos equipos también los vendemos</h2>
      <p>
        La Geoliner 630 y la Geodyna 7800P no son solo el equipo que usamos puertas adentro: las
        importamos y las vendemos a otros talleres, gomerías y concesionarias a través de{" "}
        <strong>Trivium Pro</strong>, nuestra unidad de negocio dedicada al equipamiento
        profesional. Si estás por equipar o renovar tu taller —alineadoras, balanceadoras,
        elevadores, desarmadoras, herramientas neumáticas—{" "}
        <a
          href="https://pro.trivium.ar"
          target="_blank"
          rel="noopener noreferrer"
        >
          conocé el catálogo completo en pro.trivium.ar
        </a>
        , con asesoramiento técnico, instalación e service oficial en todo el país.
      </p>

      <p>
        Si notás que el auto tira hacia un lado, que el volante vibra en ruta o que un neumático se
        desgastó distinto que los demás, probablemente sea hora de una alineación o un balanceo.{" "}
        <Link href="/servicios/alineacion">Alineación</Link> y{" "}
        <Link href="/servicios/balanceo">balanceo y rotación</Link> tienen su ficha con precio en
        nuestro sitio, y si compraste los neumáticos con nosotros, el balanceo no tiene cargo.
        Para la diferencia entre los dos servicios y cada cuánto conviene hacerlos, la nota{" "}
        <Link href="/blog/alineacion-y-balanceo">alineación y balanceo: qué es cada cosa</Link> lo
        explica en detalle.
      </p>
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
