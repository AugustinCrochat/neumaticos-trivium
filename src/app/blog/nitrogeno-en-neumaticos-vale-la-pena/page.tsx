import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "nitrogeno-en-neumaticos-vale-la-pena";
const TITLE = "Nitrógeno en los neumáticos: ¿vale la pena o es un mito?";
const SUBTITLE =
  "Qué es el inflado con nitrógeno, qué mejora de verdad, qué tiene de marketing y cuánto conviene pagar si te lo incluyen en el presupuesto de las cubiertas.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Inflar neumáticos con nitrógeno: qué es, cuánta presión se pierde menos (un estudio de 12 meses), qué dice el marketing y si vale la pena pagarlo en el presupuesto de las cubiertas.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es inflar los neumáticos con nitrógeno?",
    answer:
      "Es llenar la cubierta con nitrógeno casi puro en lugar de aire común. El aire que respiramos ya es alrededor de 78% nitrógeno; el servicio lo sube a un 95% o más. Se hace con un equipo que separa el gas, y en la gomería se cobra como un ítem aparte.",
  },
  {
    question: "¿El nitrógeno realmente mantiene mejor la presión?",
    answer:
      "Un poco mejor. En una prueba de Consumer Reports de 12 meses con 31 modelos de neumáticos, los inflados con aire perdieron en promedio 3,5 psi y los inflados con nitrógeno, unos 2,2 psi: una diferencia de 1,3 psi en todo un año. Ambos perdieron presión, y por eso hay que controlarla igual.",
  },
  {
    question: "¿Se puede poner aire común en un neumático con nitrógeno?",
    answer:
      "Sí, no pasa nada: el aire y el nitrógeno se mezclan sin riesgo. Lo único que pasa es que el neumático pierde parte de la pureza del nitrógeno, así que el pequeño beneficio se diluye.",
  },
  {
    question: "¿El nitrógeno baja el consumo o hace que duren más las cubiertas?",
    answer:
      "Indirectamente, si lo que logra es que mantengas la presión correcta, que es lo que más importa. Pero lo mismo se consigue revisando la presión una vez por mes con aire común: una cubierta baja de presión consume más y se gasta más rápido, tenga el gas que tenga.",
  },
  {
    question: "¿Vale la pena pagar el nitrógeno en el presupuesto de neumáticos?",
    answer:
      "Para un auto de calle, difícilmente. El beneficio real es chico y el costo, que se repite en cada cambio, no. Si te lo incluyen sin cargo, bienvenido; si suma al precio final, preguntá cuánto es y comparalo con simplemente controlar la presión cada mes.",
  },
  {
    question: "¿Ustedes inflan con nitrógeno?",
    answer:
      "No, no ofrecemos ese servicio. Preferimos explicar qué hace realmente y que cada uno decida. Lo que sí hacemos es controlar la presión sin cargo, aunque no compres nada.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-24" readingMinutes={6} faqs={FAQS}>
      <p>
        Al pedir un presupuesto de neumáticos es común ver una línea que dice &ldquo;inflado con
        nitrógeno&rdquo;. Y seguramente te preguntaste qué es, si hace falta y si vale lo que cuesta. La
        respuesta corta: el nitrógeno existe, funciona, pero lo que mejora es mucho menos de lo que
        suele prometer el marketing. Acá va la respuesta larga.
      </p>

      <h2>Qué es el nitrógeno en los neumáticos</h2>
      <p>
        El aire que respiramos es aproximadamente 78% nitrógeno, 21% oxígeno y un poco de otros gases y
        vapor de agua. Inflar con nitrógeno es reemplazar ese aire por nitrógeno casi puro, típicamente
        95% o más. Se hace con un equipo especial que separa el gas del aire, vaciando bien la cubierta
        antes de llenarla. Es el mismo gas que usan los aviones y los autos de carrera, y de ahí viene
        buena parte del prestigio del servicio.
      </p>

      <h2>Lo que sí mejora: la presión se mantiene un poco más</h2>
      <p>
        Las moléculas de oxígeno son algo más chicas que las de nitrógeno y atraviesan la goma más
        fácilmente, así que un neumático con aire pierde presión de forma natural, aunque no tenga
        ninguna pinchadura. El nitrógeno se escapa más despacio.
      </p>
      <p>
        ¿Cuánto más despacio? Consumer Reports lo midió durante un año, con 31 modelos de neumáticos
        llenos a 30 psi y dejados al aire libre. Al final, los de aire común habían perdido en promedio
        3,5 psi, y los de nitrógeno, unos 2,2 psi. Es una diferencia real, de 1,3 psi en doce meses, que
        la propia organización consideró más teórica que práctica: todos los neumáticos perdieron
        presión y todos necesitaban controlarse igual.
      </p>

      <h2>Lo que se exagera</h2>
      <ul>
        <li>
          <strong>&ldquo;No hace falta controlar la presión&rdquo;.</strong> Falso. Aun con nitrógeno
          se pierde presión, por la goma, por la válvula y por la temperatura, y una presión baja
          consume más combustible, recalienta la cubierta y la gasta más rápido. Hay que controlarla
          todos los meses igual.
        </li>
        <li>
          <strong>&ldquo;Las cubiertas duran mucho más&rdquo;.</strong> Duran lo que dura una cubierta
          con la presión correcta, y eso se logra con cualquier gas si la controlás.
        </li>
        <li>
          <strong>&ldquo;Corre más frío&rdquo;.</strong> Un neumático que rueda por la calle no llega a
          las temperaturas de un avión o de un auto de carrera, donde sí importa que el gas sea seco y
          estable. Para uso urbano o de ruta la diferencia es mínima.
        </li>
        <li>
          <strong>&ldquo;Evita que se oxide la llanta&rdquo;.</strong> El aire de un buen compresor con
          secador trae muy poca humedad. Es un argumento que depende de cómo esté el equipo de aire.
        </li>
      </ul>

      <h2>Qué conviene hacer en cambio</h2>
      <p>
        Lo que de verdad cuida las cubiertas cuesta casi nada: revisar la presión una vez por mes, con
        las cubiertas frías, y con el valor de la calcomanía de la puerta. En la nota{" "}
        <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link> está explicado paso a paso,
        y la <Link href="/herramientas/presion-neumaticos">herramienta de presión</Link> te da el rango según
        el vehículo y la carga. Sumá una buena{" "}
        <Link href="/servicios/alineacion">alineación</Link> y una cubierta con{" "}
        <Link href="/blog/cambio-de-valvulas-de-neumaticos">válvula nueva</Link>: esas dos cosas hacen
        más por tus neumáticos que cambiar el gas.
      </p>

      <h2>Si te lo ofrecen en el presupuesto</h2>
      <ul>
        <li>Preguntá cuánto suma al total: suele figurar como un ítem aparte.</li>
        <li>Preguntá si las recargas posteriores también son con nitrógeno y cuánto cuestan.</li>
        <li>Recordá que si después le ponés aire común, no pasa nada, pero se pierde la pureza.</li>
        <li>No es obligatorio y no cambia la presión que corresponde a tu auto.</li>
      </ul>

      <h2>Cuándo sí tiene sentido</h2>
      <p>
        En competición, donde la temperatura de la cubierta varía muchísimo y cada décima de presión
        cuenta, y en aviación. En un auto de calle, un remis o una camioneta de uso diario, el beneficio es
        chico. Si hacés muchos kilómetros y querés bajar el costo por kilómetro, mirá la{" "}
        <Link href="/herramientas/costo-por-kilometro">calculadora</Link> antes de pagar extras.
      </p>

      <h2>Nuestra postura</h2>
      <p>
        En Neumáticos Trivium no inflamos con nitrógeno, así que no tenemos nada que venderte con esta
        nota. Te explicamos qué hace, que lo decidas con los datos, y que si pasás por el local de Argüello,
        en Córdoba, te controlamos la presión sin cargo. Mirá todo lo que hacemos en{" "}
        <Link href="/servicios">servicios</Link>.
      </p>
    </ArticleLayout>
  );
}
