import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-japoneses-europeos-americanos-y-chinos-origen-de-las-marcas";
const TITLE = "Neumáticos japoneses, europeos, americanos y chinos: de dónde es cada marca";
const SUBTITLE =
  "El país de una marca no siempre es el país donde se fabrica el neumático, y hay marcas de un país con dueños de otro. Un mapa de las marcas que se venden en Argentina y cómo saber dónde se hizo la tuya.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "De dónde es cada marca de neumáticos: japonesas (Bridgestone, Yokohama), europeas (Michelin, Pirelli, Continental), americanas (Goodyear), coreanas (Hankook, Kumho) y chinas (Linglong, Kpatos, Sailun). Y cómo saber dónde se fabricó el tuyo.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿El país de la marca es el país donde se fabrica el neumático?",
    answer:
      "No necesariamente. Una marca puede tener fábricas en varios países, y una misma marca fabrica distintos modelos en distintas plantas. Lo que dice el flanco y los primeros caracteres del código DOT te dicen dónde se hizo ese neumático en particular.",
  },
  {
    question: "¿Cómo sé dónde se fabricó mi neumático?",
    answer:
      "Mirá el flanco: suele figurar una leyenda de origen (Made in...). Además, el código DOT empieza con dos caracteres que identifican la planta, seguidos de los cuatro dígitos de semana y año de fabricación.",
  },
  {
    question: "¿Hay neumáticos que se fabriquen en Argentina?",
    answer:
      "Sí: Pirelli tiene una planta en Merlo y Bridgestone (que también tiene Firestone) en Llavallol. Fate anunció en febrero de 2026 el cierre de su planta de San Fernando, según informaron varios medios. La situación de las plantas cambia, así que conviene consultar noticias recientes.",
  },
  {
    question: "¿Un neumático japonés o europeo es mejor que uno chino?",
    answer:
      "El país no define la calidad: hay fabricantes chinos grandes con décadas de trayectoria y marcas de entrada sin trazabilidad, igual que hay líneas económicas dentro de marcas tradicionales. Conviene comparar neumático contra neumático: etiqueta europea, índices, fecha DOT y garantía.",
  },
  {
    question: "¿Qué marcas chinas se venden en Argentina?",
    answer:
      "Entre las más buscadas están Linglong, Triangle, Sailun, Goodride, Westlake, Kpatos, Firemax, Greentrac y Windforce. Nosotros tenemos Grenlander, Zmax, Firemax y Arivo Premio.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-24" readingMinutes={7} faqs={FAQS}>
      <p>
        Cuando alguien pregunta si un neumático es japonés, europeo o chino, en general quiere saber algo más:
        si es confiable, si es caro, si lo conoce alguien. Pero el país de una marca es solo una parte de la
        historia. Esta guía ordena de dónde es cada marca que se vende en Argentina, y explica por qué ese dato
        solo no alcanza para elegir.
      </p>

      <h2>Marcas japonesas</h2>
      <p>
        <strong>Bridgestone</strong> es la marca japonesa más conocida en Argentina, y es dueña de{" "}
        <strong>Firestone</strong>, una marca de origen estadounidense que se fusionó con Bridgestone en 1988.
        <strong> Yokohama</strong> es otra marca japonesa de primera línea. En Argentina, Bridgestone y Firestone
        comparten una planta en Llavallol, la primera fábrica de neumáticos del país. Mirá las{" "}
        <Link href="/alternativas/bridgestone">alternativas a Bridgestone</Link> y a{" "}
        <Link href="/alternativas/firestone">Firestone</Link>.
      </p>

      <h2>Marcas europeas</h2>
      <p>
        <strong>Michelin</strong> es de origen francés y también es dueña de BFGoodrich;{" "}
        <strong>Pirelli</strong> es italiana y tiene una planta en Merlo; <strong>Continental</strong> es alemana.
        En <Link href="/marcas/pirelli">nuestro catálogo tenemos Pirelli</Link>. Más en{" "}
        <Link href="/alternativas/michelin">alternativas a Michelin</Link> y{" "}
        <Link href="/alternativas/continental">a Continental</Link>.
      </p>

      <h2>Marcas americanas</h2>
      <p>
        <strong>Goodyear</strong> es estadounidense; en 2021 anunció la compra de Cooper Tire.{" "}
        <strong>BFGoodrich</strong> fue originalmente estadounidense y hoy pertenece a Michelin, y sus neumáticos
        se fabrican en plantas de Michelin en Estados Unidos. Mirá las{" "}
        <Link href="/alternativas/goodyear">alternativas a Goodyear</Link>.
      </p>

      <h2>Marcas coreanas</h2>
      <p>
        <strong>Hankook</strong>, <strong>Kumho</strong> y <strong>Nexen</strong> son las marcas coreanas que
        más se ven. Un dato curioso: en 2018 la china Doublestar compró el 45% de Kumho Tire y quedó como
        accionista controlante, así que una marca coreana tiene hoy un dueño chino. Mirá{" "}
        <Link href="/alternativas/hankook">Hankook</Link> y <Link href="/alternativas/kumho">Kumho</Link>.
      </p>

      <h2>La marca argentina</h2>
      <p>
        <strong>Fate</strong> fue durante décadas la marca nacional de referencia. En febrero de 2026 la empresa
        anunció el cierre definitivo de su planta de San Fernando y el despido de 920 trabajadores, según
        informaron varios medios. La situación se sigue moviendo, así que para saber cómo está hoy conviene
        buscar noticias recientes. Si estabas buscando una medida de Fate, acá están las{" "}
        <Link href="/alternativas/fate">alternativas</Link>.
      </p>

      <h2>Marcas chinas</h2>
      <p>
        Hay decenas, y no son una sola categoría. <strong>Linglong</strong> (Shandong Linglong Tire) tiene
        orígenes en 1975 y una planta en Tailandia; <strong>Triangle</strong> (Weihai) tiene orígenes en 1976;{" "}
        <strong>Sailun</strong> es de Qingdao; <strong>Goodride</strong> y <strong>Westlake</strong> son del mismo
        grupo, Zhongce Rubber, de Hangzhou. <strong>Kpatos</strong> y <strong>Firemax</strong> son de la misma
        empresa, Qingdao Sunfulcess. Nosotros tenemos <Link href="/marcas/grenlander">Grenlander</Link>,{" "}
        <Link href="/marcas/zmax">Zmax</Link>, <Link href="/marcas/firemax">Firemax</Link> y{" "}
        <Link href="/marcas/arivo-premio">Arivo Premio</Link>. Mirá todas en{" "}
        <Link href="/marcas-de-neumaticos-chinos">marcas de neumáticos chinos en Argentina</Link>.
      </p>

      <h2>El país de la marca no es el país de la fábrica</h2>
      <ul>
        <li>Una marca puede tener plantas en varios países; Linglong, por ejemplo, tiene una en Tailandia.</li>
        <li>Una misma marca puede fabricar un modelo en una planta y otro en otra.</li>
        <li>Una marca de un país puede tener un dueño de otro, como Kumho.</li>
        <li>Una misma fábrica puede producir el mismo neumático para varias marcas.</li>
      </ul>

      <h2>Cómo saber dónde se hizo el tuyo</h2>
      <p>
        Mirá el flanco: suele estar la leyenda de origen. Y el código DOT empieza con dos caracteres que
        identifican la planta, seguidos de cuatro dígitos con la semana y el año de fabricación; con la{" "}
        <Link href="/herramientas/codigo-dot">herramienta del código DOT</Link> sacás la edad del neumático.
      </p>

      <h2>Entonces, ¿cómo elijo?</h2>
      <p>
        El país es un dato, no un veredicto. Comparé neumático contra neumático: la{" "}
        <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link> y su registro EPREL, los{" "}
        <Link href="/blog/indice-de-carga-y-velocidad">índices de carga y velocidad</Link>, la fecha de fabricación
        y la garantía, y hacé la cuenta del costo por kilómetro. Si querés profundizar, mirá{" "}
        <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">marca o importado: cuál conviene</Link>{" "}
        y <Link href="/neumaticos-baratos">el mejor precio en cada rodado</Link>.
      </p>
    </ArticleLayout>
  );
}
