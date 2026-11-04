import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cambio-de-valvulas-de-neumaticos";
const TITLE = "Cambio de válvulas de neumáticos: cuándo hacerlo y qué incluye";
const SUBTITLE =
  "Por qué se cambia la válvula al colocar cubiertas nuevas, cómo saber si la tuya pierde aire, qué cambia en los autos con sensor de presión y por qué conviene que no te la cobren aparte.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cuándo cambiar las válvulas de los neumáticos, cómo saber si una válvula pierde aire, la diferencia con el obús y los sensores de presión, y qué mirar en el presupuesto de la gomería."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cada cuánto hay que cambiar las válvulas de los neumáticos?",
    answer:
      "Lo habitual es cambiarlas cada vez que se cambia el neumático o se desarma la rueda: la goma se reseca con los años, el calor y el sol, y es una causa común de pérdidas lentas de aire. Es una pieza barata y cambiarla evita volver por un problema que se podía prevenir.",
  },
  {
    question: "¿Cómo sé si una válvula pierde aire?",
    answer:
      "Poné agua con detergente en la punta y en la base de la válvula: si hacen burbujas, pierde. Otras señales son una rueda que se desinfla de a poco sin pinchadura visible, grietas en la goma o una válvula torcida.",
  },
  {
    question: "¿Cuánto cuesta cambiar una válvula?",
    answer:
      "Es un repuesto económico, pero muchas gomerías lo cobran como un ítem aparte, rueda por rueda, y en el presupuesto del juego completo suma. En nuestro local, si comprás las cubiertas ahí, el cambio de válvulas no tiene cargo.",
  },
  {
    question: "¿Es lo mismo la válvula que el obús?",
    answer:
      "No. La válvula es la pieza de goma (o metal) que va fija en la llanta; el obús es el mecanismo pequeño que va roscado adentro y es el que deja entrar el aire y evita que salga. Pueden fallar por separado: un obús que pierde se cambia sin tocar la válvula.",
  },
  {
    question: "¿Qué pasa con las válvulas de los autos con sensor de presión (TPMS)?",
    answer:
      "En esos autos la válvula lleva integrado un sensor, y no se cambia como una común: se reemplazan las juntas, la tuerca y el obús con un kit, o el sensor entero si falló. Escribinos antes por WhatsApp con el modelo del auto para decirte qué corresponde.",
  },
  {
    question: "¿La tapita de la válvula sirve para algo?",
    answer:
      "Sí: protege el obús de la suciedad y la humedad y funciona como un segundo sello. Una válvula sin tapita puede perder aire más fácil. Cuesta muy poco y conviene que estén las cuatro.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-24" readingMinutes={5} faqs={FAQS}>
      <p>
        La válvula es una pieza chica que casi nadie mira, pero de ella depende que el neumático mantenga
        el aire. Una válvula vieja o dañada es una de las causas más comunes de pérdidas lentas, de esas
        que hacen volver a la gomería a inflar una rueda sin encontrar ninguna pinchadura. Por eso se
        cambia al colocar cubiertas nuevas, y por eso importa saber si te la están cobrando aparte.
      </p>

      <h2>Qué es y cómo funciona</h2>
      <p>
        En la mayoría de los autos de calle la válvula es de goma, con un vástago de metal en el medio, y
        va encajada en el agujero de la llanta. Adentro lleva el obús, el pequeño mecanismo que deja entrar
        el aire cuando inflás y lo retiene cuando soltás la manguera, y en la punta, la tapita. Hay también
        válvulas metálicas, fijadas con tuerca, que se usan en llantas de camión, de camioneta pesada o
        para presiones más altas.
      </p>

      <h2>Por qué se cambia siempre al colocar cubiertas</h2>
      <ul>
        <li>
          <strong>La goma envejece.</strong> El calor, el sol y los años la resecan y la agrietan, y
          una válvula con microfisuras pierde aire de forma lenta.
        </li>
        <li>
          <strong>Se desarma la rueda igual.</strong> Para cambiar el neumático hay que sacar la válvula
          o aflojarla; es el mejor momento para reemplazarla, sin trabajo extra.
        </li>
        <li>
          <strong>Es una pieza barata.</strong> Cambiarla cuesta mucho menos que volver a desarmar la
          rueda por una pérdida que se pudo evitar.
        </li>
      </ul>
      <p>
        Es parte de un{" "}
        <Link href="/blog/arme-y-desarme-de-neumaticos">arme y desarme bien hecho</Link>.
      </p>

      <h2>Cómo saber si una válvula pierde</h2>
      <ol>
        <li>Mezclá agua con un poco de detergente.</li>
        <li>Pasala por la punta de la válvula y por la base, donde se une con la llanta.</li>
        <li>Si salen burbujas, hay pérdida: cambiá la válvula o el obús.</li>
      </ol>
      <p>
        Si el neumático pierde aire y la válvula está sana, puede ser una pinchadura o la llanta: mirá{" "}
        <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">cómo se repara una pinchadura</Link>. Y
        no te olvides de controlar la presión todos los meses:{" "}
        <Link href="/blog/presion-de-neumaticos">cómo hacerlo bien</Link>.
      </p>

      <h2>Autos con sensor de presión (TPMS)</h2>
      <p>
        Muchos autos nuevos traen un sensor dentro de la rueda que avisa si la presión baja. La válvula de
        esas ruedas está unida al sensor y no es una común de goma. Al cambiar las cubiertas se reemplazan
        las piezas de sellado (juntas, tuerca y obús) con un kit, y solo se cambia el sensor entero si
        falló o se le agotó la batería. Si tu auto lo tiene, consultanos con el modelo antes de ir.
      </p>

      <h2>Cuánto cuesta y por qué conviene que no te lo cobren aparte</h2>
      <p>
        La válvula en sí es barata, pero muchas gomerías la cobran como un ítem aparte, rueda por rueda,
        y en un presupuesto de cuatro cubiertas se nota. Al comparar presupuestos, fijate si la colocación
        incluye las válvulas o si figuran como una línea más, junto con el balanceo y, a veces, el
        inflado con nitrógeno (que explicamos en{" "}
        <Link href="/blog/nitrogeno-en-neumaticos-vale-la-pena">esta nota</Link>).
      </p>

      <h2>En nuestra gomería</h2>
      <p>
        Si comprás las cubiertas en Neumáticos Trivium, la colocación y el cambio de válvulas van sin
        cargo. Atendemos por orden de llegada en Argüello, Córdoba. Mirá el servicio de{" "}
        <Link href="/servicios/montaje">arme y desarme</Link> y buscá tu medida en el{" "}
        <Link href="/catalogo">catálogo</Link>.
      </p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
