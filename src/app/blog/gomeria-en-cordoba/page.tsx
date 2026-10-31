import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { ServicioHoyCTA } from "@/components/servicios/ServicioHoyCTA";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "gomeria-en-cordoba";
const TITLE = "Gomería en Córdoba: qué servicios hacen y cómo elegir una buena";
const SUBTITLE =
  "Pinchadura, balanceo, alineación, rotación, válvulas: qué hace una gomería, qué conviene hacer junto y qué mirar antes de dejar el auto.";

export const metadata: Metadata = {
  ...blogShare("gomeria-en-cordoba"),
  title: TITLE,
  description:
    "Qué servicios hace una gomería en Córdoba, cuáles conviene combinar, cuándo hace falta alinear o balancear y cómo reconocer un taller serio. Con la experiencia de nuestro taller en Argüello.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué hace una gomería además de arreglar pinchaduras?",
    answer:
      "Una gomería completa hace arme y desarme de neumáticos, cambio de válvulas, balanceo, rotación de ruedas y, si tiene equipo, alineación. Conviene elegir una que haga todo en el mismo lugar para no andar de taller en taller.",
  },
  {
    question: "¿Cuándo hay que balancear las ruedas?",
    answer:
      "Cada vez que se arma un neumático nuevo, cuando el volante vibra a cierta velocidad (típicamente entre 80 y 110 km/h) o después de un golpe fuerte contra un pozo o cordón. Es un servicio de pocos minutos por rueda.",
  },
  {
    question: "¿Cuándo hay que alinear?",
    answer:
      "Si el auto tira hacia un costado, si el volante queda torcido al ir derecho, si los neumáticos se gastan más de un lado, o después de cambiar piezas de suspensión o dirección. También es buena idea al estrenar neumáticos nuevos.",
  },
  {
    question: "¿Hay que sacar turno en la gomería?",
    answer:
      "Depende del taller. En Neumáticos Trivium, en Argüello, se atiende por orden de llegada y sin turno, de lunes a sábados de 9 a 19 horas. Si querés saber cuánta espera hay antes de salir, consultanos por WhatsApp.",
  },
  {
    question: "¿La colocación de neumáticos se cobra?",
    answer:
      "Si comprás las cubiertas en Neumáticos Trivium, la colocación y el cambio de válvulas son sin cargo. Si las trajiste de otro lugar, el arme y desarme se cobra por rueda. Los valores vigentes están publicados en la página de servicios.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-10-09"
      readingMinutes={5}
      faqs={FAQS}
    >
      <p>
        Cuando alguien busca una gomería en Córdoba suele tener un problema concreto: una rueda
        pinchada, una vibración en el volante, un neumático gastado. Pero casi nunca es un solo
        problema. Un neumático nuevo necesita balanceo, y un auto que tira hacia un lado necesita
        alineación antes de gastar un juego entero. Esta guía explica qué hace cada servicio, cuáles
        conviene combinar y qué mirar para elegir bien.
      </p>
      <ServicioHoyCTA />

      <h2>Los servicios de una gomería, uno por uno</h2>

      <h3>Arme y desarme</h3>
      <p>
        Es sacar el neumático viejo de la llanta y colocar el nuevo. Un taller serio usa
        desmontadora automática y pastallantas para no marcar ni rayar la llanta, y cambia la válvula
        en cada arme: es una pieza barata que se degrada con los años y es una causa común de
        pérdidas lentas de aire.
      </p>

      <h3>Balanceo</h3>
      <p>
        Ninguna rueda es perfectamente pareja: siempre hay un punto un poco más pesado. El balanceo
        dinámico lo detecta y lo compensa con contrapesos. Sin balanceo, el volante vibra a ciertas
        velocidades y los neumáticos y la suspensión se desgastan antes. En nuestro taller usamos
        una balanceadora Geodyna 7800P.
      </p>

      <h3>Alineación</h3>
      <p>
        Regula los ángulos de las ruedas (camber, caster y convergencia) para que el auto vaya
        derecho y los neumáticos se gasten parejos. Es lo que más alarga la vida de un juego de
        cubiertas. Nuestro equipo es una alineadora 3D Geoliner 630. Podés leer más en{" "}
        <Link href="/blog/alineacion-y-balanceo">Alineación y balanceo: qué es cada cosa</Link>.
      </p>

      <h3>Rotación</h3>
      <p>
        Cambiar las ruedas de eje cada cierto kilometraje hace que los cuatro neumáticos se gasten
        parejo. Se hace en el mismo momento que un balanceo, así que conviene pedir las dos cosas
        juntas.
      </p>

      <h3>Pinchaduras, tuercas de seguridad y espárragos</h3>
      <p>
        También resolvemos pinchaduras (con parche si la cubierta se puede reparar:{" "}
        <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">parche, tarugo o cambio</Link>), tuercas
        antirrobo sin llave (<Link href="/blog/extraccion-de-tuercas-de-seguridad">cómo se extraen</Link>)
        y espárragos o roscas dañadas (<Link href="/blog/esparrago-de-maza-roto-reparacion-de-rosca">guía</Link>).
        Y si querés saber con qué máquinas trabajamos, mirá{" "}
        <Link href="/blog/maquinas-hofmann-y-elevadores-rotary-lift-gomeria">Hofmann y Rotary Lift</Link>.
      </p>

      <h2>Qué conviene hacer junto</h2>
      <p>
        Si vas a cambiar neumáticos, el paquete lógico es: arme y desarme, válvulas nuevas, balanceo y
        alineación. Es el orden en que el trabajo se hace una sola vez y bien. Hacer alineación con
        neumáticos viejos y desparejos es plata mal gastada, y colocar neumáticos nuevos con el auto
        desalineado los gasta antes de tiempo.
      </p>

      <h2>Cómo reconocer una gomería seria</h2>
      <ul>
        <li>
          <strong>Dice qué equipos usa.</strong> Alineadora 3D, balanceadora computarizada y
          desmontadora automática son la diferencia entre un trabajo medido y uno a ojo.
        </li>
        <li>
          <strong>Publica los precios</strong> o los pasa sin vueltas. Los nuestros están en{" "}
          <Link href="/servicios">la página de servicios</Link>.
        </li>
        <li>
          <strong>Te explica qué hace falta y qué no.</strong> Si te ofrecen alinear sin mirar el
          desgaste o balancear sin haber desarmado nada, desconfiá.
        </li>
        <li>
          <strong>Tiene los neumáticos en el local.</strong> Así comprás y colocás en la misma
          visita en lugar de esperar un pedido.
        </li>
      </ul>

      <h2>Nuestra gomería en Argüello</h2>
      <p>
        Estamos en Av. Donato Álvarez 7971, Argüello, y atendemos de lunes a sábados de 9 a 19 horas
        corrido, por orden de llegada y sin turno. Recibimos clientes de Córdoba Capital, Villa
        Allende, Saldán, La Calera, Mendiolaza, Unquillo y Río Ceballos. Si comprás los neumáticos
        con nosotros, la colocación y el cambio de válvulas no tienen costo. Mirá{" "}
        <Link href="/neumaticos-en/cordoba">cómo llegar y qué cubrimos en Córdoba</Link> o buscá tu
        medida en el <Link href="/catalogo">catálogo</Link>.
      </p>
    </ArticleLayout>
  );
}
