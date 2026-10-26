import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-sierras-de-cordoba";
const TITLE = "Neumáticos para las sierras de Córdoba: qué llevar antes de salir a ruta";
const SUBTITLE =
  "Altas Cumbres, Punilla, Traslasierra y los caminos de montaña exigen más a los neumáticos. Qué revisar y qué tipo de cubierta conviene.";

export const metadata: Metadata = {
  ...blogShare("neumaticos-sierras-de-cordoba"),
  title: TITLE,
  description:
    "Qué neumáticos usar para manejar en las sierras de Córdoba: curvas, pendientes, lluvia y caminos de tierra. Qué revisar antes de un viaje y cuándo conviene una cubierta H/T o A/T.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué neumáticos conviene para viajar a las sierras de Córdoba?",
    answer:
      "Para auto, una cubierta de uso mixto en buen estado y con la presión correcta alcanza. Para camioneta que sale a caminos de tierra o de ripio, una cubierta H/T o A/T da más resistencia en los flancos y mejor tracción.",
  },
  {
    question: "¿Cuánto dibujo tiene que quedar para manejar en sierras con lluvia?",
    answer:
      "El mínimo legal es 1,6 mm, pero para lluvia y bajadas conviene cambiarlos antes, cuando quedan unos 3 mm. Con poco dibujo aumenta mucho la distancia de frenado sobre mojado.",
  },
  {
    question: "¿Hay que cambiar la presión para ir a la sierra?",
    answer:
      "Hay que usar la del fabricante según la carga. Si vas con el auto lleno de gente y equipaje, usá el valor de 'carga completa' que figura en la puerta del conductor. Y revisala siempre en frío, antes de salir.",
  },
  {
    question: "¿Cuándo conviene una cubierta A/T?",
    answer:
      "Cuando una parte importante del recorrido es de tierra, ripio o caminos rotos. Su dibujo más abierto y su construcción más robusta aguantan mejor, a cambio de algo más de ruido y consumo en asfalto.",
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
        Las sierras de Córdoba son destino de escapadas de fin de semana y vacaciones, y el
        trayecto tiene poco que ver con andar por la ciudad: curvas cerradas, pendientes largas,
        frenadas cuesta abajo, tormentas de verano y, si te desviás, tramos de tierra o ripio. Todo
        eso trabaja sobre cuatro porciones de goma del tamaño de una mano. Revisarlas antes de salir
        es lo más barato que podés hacer por el viaje.
      </p>

      <h2>Qué exige la montaña a un neumático</h2>
      <ul>
        <li>
          <strong>Frenado en bajada.</strong> El freno trabaja más y se calienta; el neumático tiene
          que sostener esa carga sin deslizar.
        </li>
        <li>
          <strong>Curvas sostenidas.</strong> Los flancos flexionan más. Con presión baja, el
          neumático se &quot;pliega&quot; y pierde precisión y agarre.
        </li>
        <li>
          <strong>Lluvia repentina.</strong> Una tormenta de verano deja agua y barro en la calzada.
          La profundidad del dibujo define cuánta agua evacúa el neumático antes de perder contacto.
        </li>
        <li>
          <strong>Carga.</strong> Auto lleno de gente y equipaje significa más peso sobre los
          neumáticos y presión de trabajo distinta.
        </li>
      </ul>

      <h2>Checklist antes de salir</h2>
      <ol>
        <li>
          <strong>Profundidad del dibujo.</strong> El mínimo legal es 1,6 mm, pero para ruta con
          lluvia es mejor no bajar de unos 3 mm.
        </li>
        <li>
          <strong>Presión, en frío</strong> y según la carga que lleves (ver{" "}
          <Link href="/blog/presion-de-neumaticos">cuánto inflar y cada cuánto revisarla</Link>).
        </li>
        <li>
          <strong>Estado de los flancos.</strong> Cortes, bultos o grietas son motivo de cambio, no de
          &quot;a ver si aguanta&quot;.
        </li>
        <li>
          <strong>Antigüedad.</strong> Un neumático con más de cinco o seis años pierde elasticidad
          aunque tenga dibujo. La fecha figura en el código DOT del flanco.
        </li>
        <li>
          <strong>Rueda de auxilio</strong> inflada y herramientas a mano.
        </li>
        <li>
          <strong>Alineación y balanceo</strong> si el auto tira o vibra: en una ruta larga se
          notan mucho más (ver <Link href="/blog/alineacion-y-balanceo">esta guía</Link>).
        </li>
      </ol>

      <h2>¿Qué tipo de neumático conviene?</h2>
      <p>
        Para auto de ciudad que sube a las sierras por asfalto, una buena cubierta de uso mixto en
        la medida original, con dibujo y presión correctos, es suficiente. Lo que cambia la cosa es
        el tipo de camino:
      </p>
      <ul>
        <li>
          <strong>Asfalto y algo de ripio:</strong> una cubierta{" "}
          <Link href="/neumaticos/ht">H/T</Link> (highway terrain) para camioneta o SUV da buena
          tracción y confort.
        </li>
        <li>
          <strong>Tierra, ripio o caminos rotos frecuentes:</strong> una{" "}
          <Link href="/neumaticos/at">A/T</Link> (all terrain), con flancos más robustos y dibujo
          más abierto.
        </li>
      </ul>
      <p>
        Si no sabés cuál le va a tu vehículo, escribinos por WhatsApp con el modelo y te decimos qué
        medidas tenemos en stock. Trabajamos con Córdoba Capital, Villa Allende, Saldán, La Calera,
        Mendiolaza, Unquillo y Río Ceballos, y hacemos la colocación, el balanceo y la alineación en
        el mismo lugar. Buscá tu medida en el <Link href="/catalogo">catálogo</Link>.
      </p>
    </ArticleLayout>
  );
}
