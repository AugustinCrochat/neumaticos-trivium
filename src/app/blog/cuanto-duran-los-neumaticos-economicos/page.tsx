import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { CostPerKmCalculator } from "@/components/blog/CostPerKmCalculator";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cuanto-duran-los-neumaticos-economicos";
const TITLE = "¿Cuánto duran los neumáticos económicos?";
const SUBTITLE =
  "No hay un número mágico: la vida útil depende de cómo, dónde y con qué cuidado se usan. Qué la define y cómo estimarla con tu propio auto.";

export const metadata: Metadata = {
  ...blogShare("cuanto-duran-los-neumaticos-economicos"),
  title: TITLE,
  description:
    "¿Cuánto duran los neumáticos económicos? Qué factores definen la vida útil (presión, alineación, uso, edad), cómo medir el desgaste y estimar los kilómetros con tu propio auto.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuántos kilómetros dura un neumático económico?",
    answer:
      "No existe una cifra única: depende del modelo, de tu forma de manejar, de la presión, de la alineación y del tipo de ruta. Lo más confiable es medir: anotá la profundidad de la banda al comprar y volvé a medirla a los 5.000 o 10.000 km para proyectar.",
  },
  {
    question: "¿Cada cuánto debo cambiar los neumáticos por edad?",
    answer:
      "Aunque no estén gastados, la goma envejece. Muchos fabricantes recomiendan revisarlos con atención a partir de los cinco años y no usarlos más allá de los diez, contando desde la fecha de fabricación que figura en el código DOT.",
  },
  {
    question: "¿Cuál es la profundidad mínima legal de la banda?",
    answer:
      "En Argentina la profundidad mínima de dibujo es de 1,6 mm. Los neumáticos traen indicadores de desgaste (TWI) en los surcos que se igualan con la banda cuando se llega a ese límite. Para lluvia conviene cambiar antes.",
  },
  {
    question: "¿La presión influye en cuánto duran?",
    answer:
      "Mucho. Con presión baja el neumático se desgasta más en los hombros; con presión alta, en el centro. Revisarla cada pocas semanas es lo más barato que podés hacer para alargar su vida.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-21" readingMinutes={7} faqs={FAQS}>
      <p>
        Es la pregunta que más se hace quien duda entre una marca y una alternativa económica: «¿y cuánto me dura?». La respuesta
        sincera es que depende menos de la etiqueta de precio de lo que parece y más de cómo se usa. Acá lo que sí sabemos, y cómo
        estimarlo sin inventar números.
      </p>

      <Callout title="Una advertencia sobre las cifras de duración" tone="warn">
        <p>
          Cualquier cifra de kilómetros «garantizados» sin conocer tu auto, tu ruta y tu manera de manejar es una estimación. Por eso en
          esta nota te damos un método para medir la tuya en lugar de prometerte un número.
        </p>
      </Callout>

      <h2>Qué define cuánto dura un neumático</h2>
      <ul>
        <li><strong>Presión de inflado.</strong> Es el factor más fácil de controlar. Guía en <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link>.</li>
        <li><strong>Alineación y balanceo.</strong> Un desvío de convergencia puede comerse una banda en pocos miles de kilómetros (<Link href="/blog/alineacion-y-balanceo">alineación y balanceo</Link>).</li>
        <li><strong>Rotación.</strong> Distribuye el desgaste entre ejes (<Link href="/blog/rotacion-de-neumaticos">cuándo rotar</Link>).</li>
        <li><strong>Forma de manejar.</strong> Frenadas fuertes, aceleraciones bruscas y curvas rápidas gastan más.</li>
        <li><strong>Tipo de camino y carga.</strong> Asfalto roto, ripio y sobrecarga aceleran el desgaste.</li>
        <li><strong>Compuesto y diseño del neumático.</strong> Un compuesto blando agarra más y dura menos; uno duro, al revés. Es la única variable que sí cambia entre modelos y no depende del precio de manera lineal.</li>
        <li><strong>Edad.</strong> La goma se endurece con los años aunque casi no ruede.</li>
      </ul>

      <h2>Cómo medir tu propio desgaste</h2>
      <p>Un método simple que funciona con cualquier marca:</p>
      <ol>
        <li>Al colocar los neumáticos nuevos, medí la profundidad de la banda en el surco (un calibre barato alcanza) y anotala junto con el kilometraje del auto.</li>
        <li>A los 5.000–10.000 km volvé a medir en el mismo lugar.</li>
        <li>La pérdida en milímetros dividida por los km recorridos te da el desgaste por km.</li>
        <li>Proyectá hasta el límite legal de 1,6 mm (mejor, hasta 3 mm si llueve mucho).</li>
      </ol>
      <p>
        No es exacto pero se acerca mucho más a la realidad de tu auto que una cifra de folleto. También sirve para comparar una marca
        con otra: mismo auto, misma ruta, dos juegos.
      </p>

      <h2>Cómo usarlo para decidir</h2>
      <p>
        Con esa estimación calculás el costo por kilómetro y comparás. Probá con un rango conservador y uno optimista, no con un solo valor.
      </p>
      <CostPerKmCalculator />

      <h2>Cómo alargar la vida de cualquier neumático</h2>
      <ul>
        <li>Chequeá la presión en frío cada dos o tres semanas.</li>
        <li>Alineá y balanceá al colocar y ante cualquier vibración o desvío.</li>
        <li>Rotá según el manual de tu auto.</li>
        <li>Evitá los golpes contra cordones y pozos.</li>
        <li>Revisá la edad con el código DOT, no solo la banda (<Link href="/blog/como-elegir-neumatico-importado-seguro">cómo leerlo</Link>).</li>
      </ul>
      <p>
        Cuando llegue el momento de comparar, mirá la guía de{" "}
        <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">marca vs. importados</Link> y <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cada cuántos km cambiar</Link>.
      </p>

      <ClusterLinks current={SLUG} />
    </ArticleLayout>
  );
}
