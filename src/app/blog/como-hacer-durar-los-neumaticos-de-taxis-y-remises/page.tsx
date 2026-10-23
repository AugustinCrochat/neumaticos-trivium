import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-hacer-durar-los-neumaticos-de-taxis-y-remises";
const TITLE = "Cómo hacer durar los neumáticos de un taxi o un remis";
const SUBTITLE =
  "Presión, alineación, rotación y manejo: los hábitos que más kilómetros le sacan a un juego de cubiertas cuando el auto trabaja todo el día.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo alargar la vida de los neumáticos de un taxi, remis o auto de aplicación: presión, alineación, balanceo, rotación, manejo y cuándo cambiarlos. Consejos de un taller de Córdoba.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cada cuánto conviene revisar la presión en un auto de trabajo?",
    answer:
      "Una vez por semana, en frío y con el valor de la calcomanía de la puerta. Con tantos kilómetros y tanta carga, una presión baja recalienta la cubierta, aumenta el consumo y la gasta más rápido.",
  },
  {
    question: "¿Cada cuánto hay que alinear un taxi o un remis?",
    answer:
      "Siempre al cambiar el juego de cubiertas y después de un golpe fuerte contra un cordón o un pozo. Si notás que el auto tira hacia un lado o que una cubierta se gasta más de un costado, alineá antes de seguir.",
  },
  {
    question: "¿Sirve rotar las cubiertas en un auto que hace muchos kilómetros?",
    answer:
      "Sí: repartir el desgaste entre las cuatro ruedas es una de las formas más baratas de alargar la vida útil del juego. En la nota de rotación está el orden según la tracción del auto.",
  },
  {
    question: "¿Se puede reparar una pinchadura o hay que cambiar la cubierta?",
    answer:
      "Si está en la banda de rodamiento y es chica, se repara con parche desde adentro; la reparación firme requiere desmontar el neumático de la llanta. El parche común sale $20.000. Si rodaste desinflado o el daño está en el flanco, hay que cambiarla.",
  },
  {
    question: "¿Cómo sé si ya hay que cambiarlas?",
    answer:
      "Cuando el dibujo llega a los testigos de 1,6 mm, o antes si hay cortes, bultos en el flanco o desgaste desparejo. Con uso intensivo conviene mirarlas todos los meses.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={5} faqs={FAQS}>
      <p>
        En un taxi, un remis o un auto de Uber, DiDi o Cabify las cubiertas trabajan todo el día, con pasajeros,
        baches y tráfico. Cada kilómetro que le sacás de más al juego es plata que no gastás. Estos son los hábitos
        que más diferencia hacen, de lo más barato a lo más importante.
      </p>

      <h2>1. La presión, una vez por semana</h2>
      <p>
        Es lo más simple y lo que más se descuida. Medila en frío, con el valor que figura en la calcomanía de la
        puerta del conductor, y usá el valor para carga si la calcomanía lo indica (con el baúl cargado o con GNC). Una presión baja recalienta
        la cubierta, la gasta en los hombros y sube el consumo; una presión alta la gasta en el centro y empeora el
        agarre. En la nota <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link> están los valores.
      </p>

      <h2>2. La alineación, cada vez que cambiás el juego</h2>
      <p>
        Los baches y los cordones desalinean el tren delantero sin que lo notes. Una cubierta nueva con el auto
        desalineado se gasta de un solo lado y pierde buena parte de sus kilómetros. Alineá siempre al estrenar un
        juego y después de un golpe fuerte; si el auto tira hacia un lado, no esperes. Más en{" "}
        <Link href="/blog/alineacion-y-balanceo">alineación y balanceo</Link> y en el servicio de{" "}
        <Link href="/servicios/alineacion">alineación 3D en Córdoba</Link>.
      </p>

      <h2>3. El balanceo, para evitar vibraciones</h2>
      <p>
        Una rueda desbalanceada vibra y se gasta de forma despareja. El balanceo se hace al colocar la cubierta y
        cuando notás vibración en el volante a cierta velocidad. Lo hacemos en una balanceadora Hofmann en el
        taller de Argüello: <Link href="/servicios/balanceo">balanceo en Córdoba</Link>.
      </p>

      <h2>4. La rotación, para que se gasten parejo</h2>
      <p>
        Las ruedas delanteras y traseras no se gastan igual. Cambiarlas de lugar cada tanto reparte el desgaste y
        alarga la vida del juego completo. El orden depende de la tracción del auto y está explicado en{" "}
        <Link href="/blog/rotacion-de-neumaticos">rotación de neumáticos</Link>.
      </p>

      <h2>5. El manejo, que también cuenta</h2>
      <ul>
        <li>Evitá el roce contra cordones: daña el flanco, que es la zona que no se repara.</li>
        <li>Frená y arrancá con suavidad: las frenadas fuertes y los arranques bruscos gastan la banda.</li>
        <li>Esquivá los pozos grandes cuando se pueda: un golpe fuerte puede lastimar la cubierta y desalinear el tren.</li>
      </ul>

      <h2>6. Mirar el dibujo todos los meses</h2>
      <p>
        Con tantos kilómetros conviene revisar cada rueda una vez por mes: dibujo cerca de los testigos de 1,6 mm,
        cortes, bultos en el flanco o desgaste desparejo. Si el dibujo está cerca del límite, calculá cuánto te
        queda con <Link href="/herramientas/cuando-cambiar-neumaticos">cuándo cambiar los neumáticos</Link>. Si
        pinchás, que no sigas rodando desinflado: mirá{" "}
        <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">cuándo se repara y cuándo se cambia</Link>.
      </p>

      <h2>Cuando llega el momento de cambiarlas</h2>
      <p>
        Cuando el juego llegó al final, lo más rentable es una cubierta nueva, económica y de la medida original, que
        te dé el menor costo por kilómetro. Cómo elegir está en{" "}
        <Link href="/blog/neumaticos-para-uber-didi-cabify">neumáticos para Uber, DiDi y Cabify</Link>, y en la
        landing de <Link href="/neumaticos-para-remises-taxis-y-uber">neumáticos para remises, taxis y Uber</Link>{" "}
        están las medidas por modelo con precio. En Argüello, Córdoba, las colocamos, alineamos y balanceamos en el
        mismo taller.
      </p>
    </ArticleLayout>
  );
}
