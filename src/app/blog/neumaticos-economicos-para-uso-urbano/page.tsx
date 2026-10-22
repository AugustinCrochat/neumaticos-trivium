import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-economicos-para-uso-urbano";
const TITLE = "Neumáticos económicos para uso urbano: cuándo no necesitás una marca premium";
const SUBTITLE =
  "En ciudad, a velocidad moderada y con pocos kilómetros al año, una alternativa económica homologada suele ser suficiente. Qué conviene cuidar igual.";

export const metadata: Metadata = {
  ...blogShare("neumaticos-economicos-para-uso-urbano"),
  title: TITLE,
  description:
    "¿Conviene un neumático económico para la ciudad? Cuándo alcanza una alternativa importada homologada, qué cuidar igual (frenado en mojado, índices, presión) y cuándo conviene subir de gama.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Un neumático económico alcanza para manejar solo en la ciudad?",
    answer:
      "En general sí, si está homologado, es de la medida e índices correctos y está bien montado. En ciudad las velocidades son moderadas y las exigencias menores que en ruta. Igual conviene mirar el frenado en mojado, porque en ciudad también llueve.",
  },
  {
    question: "¿Qué debo mirar sí o sí en un neumático económico para ciudad?",
    answer:
      "Homologación en el flanco, fecha de fabricación reciente, índices de carga y velocidad iguales o superiores a los que pide tu vehículo y una buena calificación de frenado en mojado en la etiqueta si la trae.",
  },
  {
    question: "¿Cuándo no conviene uno económico aunque sea para ciudad?",
    answer:
      "Si hacés muchos kilómetros por semana, viajás seguido a ruta con velocidad sostenida, llevás carga o remolque, o tu auto es potente o pesado. En esos casos conviene subir de gama o elegir una alternativa intermedia con buenas notas en mojado.",
  },
  {
    question: "¿Qué medidas son las más pedidas para autos de ciudad?",
    answer:
      "Las medidas de autos compactos como 175/65 R14, 185/65 R15 y 205/55 R16 concentran buena parte de la demanda. En el catálogo podés ver cada una con su precio y stock.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-21" readingMinutes={6} faqs={FAQS}>
      <p>
        Si usás el auto para ir al trabajo, a la facultad o a hacer las compras, probablemente estés pagando por prestaciones que
        casi no usás: velocidades sostenidas altas, curvas rápidas, tracción en piso muy exigido. Para ese perfil una alternativa
        económica bien elegida suele ser una decisión racional, no un sacrificio.
      </p>

      <Callout title="Cuándo alcanza una alternativa económica" tone="ok">
        <ul>
          <li>Manejás sobre todo en ciudad o rutas cortas, a velocidad moderada.</li>
          <li>Hacés pocos kilómetros al año (el neumático envejece antes de gastarse).</li>
          <li>Tu auto es compacto o mediano, sin potencia ni peso fuera de lo común.</li>
          <li>El neumático está homologado, es reciente y tiene los índices correctos.</li>
        </ul>
      </Callout>

      <h2>Por qué en ciudad la diferencia se achica</h2>
      <p>
        Las ventajas más claras de una marca premium aparecen a velocidad: estabilidad sostenida, distancia de frenado desde ritmo alto,
        ruido de autopista. En tránsito urbano, con velocidades bajas y frenadas cortas, esa distancia se reduce y la diferencia
        práctica entre un neumático intermedio y uno premium se vuelve menos perceptible. Lo que pesa más en tu desgaste y tu
        seguridad cotidiana es la <Link href="/blog/presion-de-neumaticos">presión</Link> y la <Link href="/blog/alineacion-y-balanceo">alineación</Link>.
      </p>

      <h2>Qué conviene cuidar igual</h2>
      <ul>
        <li><strong>Frenado en mojado.</strong> En ciudad también llueve y el pavimento mojado es resbaladizo. Si el neumático trae <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link>, mirá esa escala.</li>
        <li><strong>Índices de carga y velocidad.</strong> No bajes del que pide tu auto (<Link href="/blog/indice-de-carga-y-velocidad">cómo leerlos</Link>).</li>
        <li><strong>Resistencia a los golpes.</strong> Pozos y cordones castigan el flanco: un perfil algo más alto ayuda, pero no cambies de medida sin verificar la <Link href="/calculadora-equivalencia-neumaticos">equivalencia</Link>.</li>
        <li><strong>Edad.</strong> Un neumático guardado años pierde propiedades. Mirá la fecha DOT al comprar.</li>
      </ul>

      <h2>El costo real: cuánto ahorrás</h2>
      <p>
        El ahorro depende de la medida y del momento, así que no ponemos cifras fijas: en el catálogo ves el precio actual de cada
        medida, ordenado con lo más barato en stock. Para tener la cuenta completa, calculá el costo por kilómetro en la nota de{" "}
        <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">marca vs. importados</Link>.
      </p>

      <h2>Cuándo subir de gama aunque manejes en ciudad</h2>
      <ul>
        <li>Si hacés ruta a menudo o viajes largos.</li>
        <li>Si llevás carga, familia completa o remolque con frecuencia.</li>
        <li>Si vivís en una zona de lluvias intensas o de ripio.</li>
      </ul>

      <h2>Medidas más pedidas para ciudad</h2>
      <p>
        Mirá precio y stock en <Link href="/neumaticos/175-65-r14">175/65 R14</Link>, <Link href="/neumaticos/185-65-r15">185/65 R15</Link> y{" "}
        <Link href="/neumaticos/205-55-r16">205/55 R16</Link>, o buscá tu medida abajo. Si dudás de la tuya, usá la guía para{" "}
        <Link href="/blog/como-leer-medida-neumatico">leer la medida</Link>.
      </p>

      <ClusterLinks current={SLUG} />
    </ArticleLayout>
  );
}
