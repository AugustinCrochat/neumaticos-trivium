import type { Metadata } from "next";
import Link from "next/link";
import { DesgasteFoto } from "@/components/tools/DesgasteFoto";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cada-cuantos-km-cambiar-neumaticos";
const TITLE = "¿Cada cuántos kilómetros hay que cambiar los neumáticos?";
const SUBTITLE =
  "No hay un número único: depende del desgaste, de la antigüedad y de cómo usás el auto. Te explicamos las tres señales que sí sirven para decidir.";

export const metadata: Metadata = {
  ...blogShare("cada-cuantos-km-cambiar-neumaticos"),
  title: TITLE,
  description:
    "Cuándo cambiar los neumáticos: profundidad mínima legal de 1,6 mm, antigüedad del compuesto y kilometraje real. Guía práctica para autos en Argentina.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuál es la profundidad mínima legal de dibujo en Argentina?",
    answer:
      "1,6 milímetros. Por debajo de ese valor el neumático no es apto para circular y es motivo de infracción en la verificación técnica. Todos los neumáticos traen testigos de desgaste moldeados en el fondo de las ranuras: cuando la banda de rodamiento llega al nivel de esos resaltos, alcanzaste el límite.",
  },
  {
    question: "¿Un neumático se vence aunque no lo use?",
    answer:
      "Sí. El caucho se oxida y endurece con el tiempo, aunque el auto esté parado. Pasados los cinco o seis años desde la fecha de fabricación conviene evaluarlo aunque le sobre dibujo, y a los diez años se reemplaza sí o sí. La fecha está en el flanco, en un código DOT de cuatro dígitos: las dos primeras cifras son la semana y las dos últimas el año.",
  },
  {
    question: "¿Puedo cambiar sólo dos neumáticos?",
    answer:
      "Sí, pero siempre los dos del mismo eje y con los nuevos atrás. Suena contraintuitivo, pero si ponés los nuevos adelante el tren trasero pierde agarre antes en una frenada sobre mojado y el auto se va de cola, que es mucho más difícil de corregir que un subviraje.",
  },
  {
    question: "¿Cada cuánto conviene rotar los neumáticos?",
    answer:
      "Cada 10.000 kilómetros aproximadamente. En un auto de tracción delantera, las ruedas de adelante cargan con la tracción, la dirección y la mayor parte del frenado, así que se gastan bastante más rápido. Rotar empareja el desgaste y estira la vida útil del juego completo.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Mantenimiento"
      date="2025-04-20"
      updated="2026-07-31"
      readingMinutes={6}
      faqs={FAQS}
    >
      <p>
        Es la pregunta que más nos hacen en el mostrador, y la respuesta honesta es que el
        kilometraje solo no alcanza para decidir. Dos autos con los mismos 40.000 kilómetros pueden
        llegar con neumáticos en estados completamente distintos según cómo se manejaron, con qué
        presión anduvieron y si alguna vez pasaron por una alineación.
      </p>
      <DesgasteFoto className="my-8" />
      <p>
        Dicho eso, sí hay un rango de referencia: <strong>entre 40.000 y 60.000 kilómetros</strong>{" "}
        para un neumático de uso urbano y mixto en condiciones razonables. Lo que sigue son las
        tres señales que realmente deciden, en orden de importancia.
      </p>

      <h2>1. La profundidad del dibujo</h2>
      <p>
        Es el criterio principal y el único que además es legal. El mínimo permitido para circular
        en Argentina es de <strong>1,6 mm</strong> de profundidad en la banda de rodamiento. No hace
        falta medirlo con instrumental: todos los neumáticos traen{" "}
        <strong>testigos de desgaste</strong>, unos resaltos moldeados en el fondo de las ranuras
        principales. Cuando la superficie de la goma queda al ras de esos resaltos, el neumático
        llegó al límite.
      </p>
      <p>
        Ahora bien, el límite legal no es el límite razonable. La capacidad de evacuar agua cae
        mucho antes: con 3 mm de dibujo, la distancia de frenado sobre piso mojado ya se alarga de
        forma perceptible respecto de un neumático nuevo, y el riesgo de aquaplaning sube. Si hacés
        ruta o manejás seguido con lluvia, conviene empezar a mirar el reemplazo alrededor de los{" "}
        <strong>3 mm</strong> y no esperar a 1,6.
      </p>

      <h3>El truco de la moneda</h3>
      <p>
        Si no tenés un calibre a mano, poné una moneda de $10 en la ranura, con el canto hacia
        abajo. Si el borde metálico exterior desaparece dentro de la ranura, todavía te queda
        margen. Si lo ves entero desde arriba, estás cerca del límite y toca revisarlo en serio.
      </p>

      <h2>2. La antigüedad del compuesto</h2>
      <p>
        Un neumático es caucho, y el caucho envejece aunque nadie lo use. Se oxida, pierde
        elasticidad y se endurece, lo que se traduce en menos agarre —especialmente en frío y en
        mojado— y en microfisuras en el flanco que a veces se ven a simple vista.
      </p>
      <p>
        La fecha de fabricación está grabada en el flanco dentro del código DOT, en un recuadro de
        cuatro dígitos. <strong>Las dos primeras cifras son la semana y las dos últimas el año</strong>:
        un &quot;2823&quot; significa semana 28 de 2023. Como referencia práctica:
      </p>
      <ul>
        <li>
          <strong>Hasta 5 años:</strong> el compuesto está en condiciones normales de uso.
        </li>
        <li>
          <strong>Entre 5 y 10 años:</strong> conviene revisarlo cada año, aunque tenga dibujo de
          sobra. Es el caso típico del auto que se usa poco.
        </li>
        <li>
          <strong>Más de 10 años:</strong> se reemplaza, sin discusión, más allá de cómo se vea.
        </li>
      </ul>

      <h2>3. El desgaste irregular</h2>
      <p>
        Si el neumático no se gasta parejo, el problema casi nunca es el neumático. El patrón te
        dice qué está pasando:
      </p>
      <table>
        <thead>
          <tr>
            <th>Dónde se gasta</th>
            <th>Causa probable</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sólo los bordes, centro sano</td>
            <td>Presión baja de forma sostenida</td>
          </tr>
          <tr>
            <td>Sólo el centro, bordes sanos</td>
            <td>Presión excesiva</td>
          </tr>
          <tr>
            <td>Un solo borde</td>
            <td>Alineación fuera de parámetro (camber o convergencia)</td>
          </tr>
          <tr>
            <td>Manchones o &quot;copas&quot;</td>
            <td>Amortiguadores gastados o falta de balanceo</td>
          </tr>
          <tr>
            <td>Serrucho en los tacos</td>
            <td>Falta de rotación o suspensión con juego</td>
          </tr>
        </tbody>
      </table>
      <p>
        Cambiar el neumático sin corregir la causa es tirar plata: el nuevo se va a gastar igual.
        Por eso, cuando alguien viene con un desgaste de un solo lado, lo primero que revisamos es
        la alineación —{" "}
        <Link href="/servicios/alineacion">acá explicamos cómo trabajamos la alineación 3D</Link>.
      </p>

      <h2>Qué acorta la vida de un neumático</h2>
      <p>
        Más allá de los kilómetros, estos son los factores que más rápido se comen un juego, en
        orden de impacto real:
      </p>
      <ol>
        <li>
          <strong>Presión incorrecta.</strong> Es la causa número uno, y la más barata de
          solucionar. Un neumático con presión baja flexiona de más, se calienta y se come los
          bordes. Revisala una vez por mes, en frío.
        </li>
        <li>
          <strong>Alineación fuera de parámetro.</strong> Un golpe fuerte contra un bache alcanza
          para desalinear el tren delantero, y a partir de ahí el desgaste es cuestión de meses.
        </li>
        <li>
          <strong>Falta de rotación.</strong> Sin rotar, en un tracción delantera vas a cambiar las
          de adelante al doble de frecuencia que las de atrás.
        </li>
        <li>
          <strong>Estilo de manejo.</strong> Frenadas fuertes, arrancadas bruscas y curvas rápidas
          desgastan mucho más de lo que uno estima.
        </li>
        <li>
          <strong>Estado del pavimento.</strong> Ripio, baches y cordones no sólo desgastan: dañan
          la estructura interna del flanco, que es un daño irreversible.
        </li>
      </ol>

      <h2>Entonces, ¿cuándo los cambio?</h2>
      <p>
        Cambialos si se cumple <strong>cualquiera</strong> de estas condiciones, sin esperar a que
        se cumplan todas:
      </p>
      <ul>
        <li>La banda de rodamiento llegó al nivel de los testigos de desgaste (1,6 mm).</li>
        <li>Tienen más de diez años desde la fecha del código DOT.</li>
        <li>Ves fisuras en el flanco, un bulto o una deformación.</li>
        <li>Hay una zona lisa aunque el resto tenga dibujo.</li>
        <li>Sentís vibración o el auto tira para un lado y ya descartaste el balanceo.</li>
      </ul>
      <p>
        Si no estás seguro, pasá por el local y lo miramos sin cargo: medimos la profundidad,
        chequeamos el código DOT y te decimos con franqueza si te queda temporada o no.{" "}
        <Link href="/neumaticos">Y si toca cambiar, buscá tu medida acá</Link> — vas a ver precio y
        stock real antes de moverte de tu casa.
      </p>
    </ArticleLayout>
  );
}
