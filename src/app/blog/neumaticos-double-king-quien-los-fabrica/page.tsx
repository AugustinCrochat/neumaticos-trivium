import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-double-king-quien-los-fabrica";
const TITLE = "Neumáticos Double King: quién los fabrica, opiniones y alternativas";
const SUBTITLE =
  "Una marca china muy presente en Argentina, con modelos para auto, camioneta y todo terreno. Qué se sabe de la empresa, qué mirar antes de comprar y qué otras opciones tenés en stock.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué es Double King (Doubleking): empresa que la fabrica, marcas del grupo, cómo comparar sus neumáticos antes de comprar y alternativas nuevas con garantía y colocación sin cargo en Córdoba.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Quién fabrica los neumáticos Double King?",
    answer:
      "La marca pertenece a Shandong Doubleking Tyre Co., Ltd., una empresa de Dongying, en la provincia china de Shandong. Según su propio perfil corporativo, el grupo incluye a Shandong Shuangwang Rubber y comercializa también las marcas Luistone, Alfamotors y STMotors.",
  },
  {
    question: "¿Double King es una buena marca?",
    answer:
      "No vendemos Double King ni la probamos, así que no podemos opinar sobre su desempeño. Lo que sí podés hacer con cualquier marca es comparar con datos: etiqueta europea en el registro EPREL, fecha de fabricación (DOT), índices de carga y velocidad y quién responde por la garantía.",
  },
  {
    question: "¿Double King es china?",
    answer: "Sí. Es una marca de origen chino, con fábrica en Dongying, provincia de Shandong.",
  },
  {
    question: "¿Cómo sé si un Double King tiene la fecha de fabricación reciente?",
    answer:
      "Mirá el código DOT en el flanco: los últimos cuatro dígitos son la semana y el año de fabricación (por ejemplo 2524 es la semana 25 de 2024). Pasados cinco o seis años el compuesto se endurece aunque tenga dibujo. Podés calcularlo con la herramienta de código DOT.",
  },
  {
    question: "¿Tienen Double King en stock?",
    answer:
      "No, Double King no está en nuestro catálogo. Tenemos neumáticos nuevos de Grenlander, Zmax, Firemax, Arivo y otras marcas, con precio publicado, un año de garantía por defecto de fabricación y colocación sin cargo si comprás en el local.",
  },
  {
    question: "¿Qué alternativa a Double King recomiendan?",
    answer:
      "Para auto de ciudad y ruta, Grenlander (línea de calle) y Zmax como escalón de entrada; para camioneta y ripio, los Grenlander A/T. Todas son del grupo Zodo, que figura como fabricante en la homologación europea de sus marcas.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-10-25" readingMinutes={6} faqs={FAQS}>
      <p>
        Si buscás neumáticos <strong>Double King</strong> (a veces escrito Doubleking), probablemente viste la marca en una
        publicación online o en una gomería, con un precio bajo y varias medidas para auto, camioneta y todo terreno. Acá juntamos lo
        que se sabe de la empresa y cómo compararla con cualquier otra, para que decidas con datos.
      </p>

      <Callout title="Aclaración" tone="ok">
        <p>
          <strong>No vendemos Double King</strong> y no la probamos, así que no opinamos sobre cómo rinde. Lo que sigue sale de
          información pública de la empresa y de registros oficiales. Si estás comparando, al final tenés las marcas que sí tenemos en
          stock.
        </p>
      </Callout>

      <h2>Qué marca es Double King</h2>
      <p>
        Double King es una marca de <strong>Shandong Doubleking Tyre Co., Ltd.</strong>, con sede en la zona de desarrollo económico de
        Dawang, en Dongying (provincia de Shandong, China). Según su perfil corporativo, la empresa incluye a Shandong Shuangwang
        Rubber entre sus subsidiarias y vende neumáticos de auto, SUV, camioneta, todo terreno y camión bajo varias marcas: Double
        King, Luistone, Alfamotors y STMotors.
      </p>
      <p>
        Los números que circulan (capacidad anual, año de fundación) varían bastante según la fuente: perfiles de la empresa,
        directorios de proveedores y publicaciones de distribuidores no coinciden entre sí. Por eso conviene tomarlos como
        orientativos y no como dato firme.
      </p>

      <h2>Cómo se compra en Argentina</h2>
      <p>
        Se consigue a través de importadores, gomerías y publicaciones online. Como cada importador trae sus lotes, el neumático que
        recibís puede tener distinta fecha de fabricación y distinto respaldo de garantía según a quién se lo compres. Eso pesa más
        que la marca en sí.
      </p>

      <h2>Qué mirar antes de comprar cualquier neumático chino</h2>
      <ol>
        <li>
          <strong>La etiqueta europea.</strong> Consumo, frenado en mojado y ruido de ese modelo exacto, verificables en el registro
          público EPREL (<Link href="/blog/etiqueta-europea-neumaticos">cómo leerla</Link>).
        </li>
        <li>
          <strong>La fecha de fabricación (DOT).</strong> Cuatro dígitos en el flanco: semana y año (
          <Link href="/herramientas/codigo-dot">calculá la edad</Link>).
        </li>
        <li>
          <strong>Los índices de carga y velocidad.</strong> Tienen que ser iguales o mayores a los que pide tu vehículo (
          <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>).
        </li>
        <li>
          <strong>La homologación visible en el flanco</strong> (ECE y/o DOT).
        </li>
        <li>
          <strong>Quién responde por la garantía.</strong> Pedí factura y preguntá dónde se gestiona un reclamo.
        </li>
      </ol>

      <h2>Alternativas que tenemos en stock</h2>
      <p>
        Si estás comparando Double King por precio, estas son las opciones nuevas que vendemos, todas con precio publicado, un año de
        garantía por defecto de fabricación y colocación sin cargo en el local:
      </p>
      <ul>
        <li>
          <strong><Link href="/marcas/grenlander">Grenlander</Link></strong>: nuestra marca de mayor confianza. Línea de calle (Colo
          H02, Kingpro One, Estrella 88, L-Zeal 56) y todo terreno (Maga A/T Two). Es del grupo Zodo, que figura como fabricante en la
          homologación europea y produce en sus propias plantas.
        </li>
        <li>
          <strong><Link href="/marcas/zmax">Zmax</Link></strong>: el escalón de entrada del mismo grupo, para uso urbano y presupuesto
          ajustado.
        </li>
        <li>
          <strong><Link href="/marcas/firemax">Firemax</Link></strong> y <strong><Link href="/marcas/arivo-premio">Arivo</Link></strong>:
          otras opciones económicas en medidas de ciudad.
        </li>
      </ul>
      <p>
        Buscá tu medida en el <Link href="/catalogo">catálogo</Link> para ver precio y stock hoy, o mirá{" "}
        <Link href="/neumaticos-baratos">el neumático más barato de cada rodado</Link>.
      </p>

      <h2>Por qué importa quién fabrica</h2>
      <p>
        Hay marcas que no tienen fábrica propia y encargan la producción a distintas plantas, de modo que el mismo modelo puede
        salir de lugares diferentes (lo explicamos con el caso de{" "}
        <Link href="/marcas-de-neumaticos-chinos/xbri">Xbri</Link>). Es un punto a favor de los fabricantes integrados, donde cada
        lote sale de la misma línea. Más sobre cómo ordenar a las marcas chinas en{" "}
        <Link href="/blog/marcas-chinas-neumaticos-comparativa">marcas chinas: ¿cuál es la mejor?</Link> y sobre la marca de la
        página <Link href="/marcas-de-neumaticos-chinos/doubleking">Double King y sus alternativas</Link>.
      </p>
    </ArticleLayout>
  );
}
