import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "norauto-argentina-historia-y-como-comparar";
const TITLE = "Norauto en Argentina: historia, sucursales y cómo comparar antes de comprar neumáticos";
const SUBTITLE =
  "Qué se sabe de Norauto Argentina según fuentes públicas, qué cambió con la compra de Stellantis y cómo comparar con otras opciones.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Qué es Norauto en Argentina: cuándo llegó, quién la compró en 2023, dónde tiene locales y cómo comparar con otras opciones para comprar neumáticos con precio y stock publicados."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es Norauto?",
    answer:
      "Es una cadena de centros de servicio y venta de productos para el automotor, de origen francés, que opera en Argentina con locales en el área de Buenos Aires.",
  },
  {
    question: "¿Quién es hoy el dueño de Norauto Argentina?",
    answer:
      "El 29 de junio de 2023 Stellantis América del Sur anunció que adquiría el 90% del control accionario de Norauto Argentina, que pertenecía al grupo francés Mobivia, según el comunicado de Stellantis.",
  },
  {
    question: "¿Cuántos locales tiene?",
    answer:
      "En 2023 se hablaba de 13 locales en el área de Buenos Aires y notas posteriores mencionan 15. La cifra cambia: el dato actual está en su sitio oficial.",
  },
  {
    question: "¿Neumáticos Trivium tiene relación con Norauto?",
    answer:
      "No. Neumáticos Trivium es una empresa distinta, con locales y taller propio en Córdoba (Argüello) y Buenos Aires. Esta nota usa información pública y no compara precios.",
  },
  {
    question: "¿Cómo comparo precios entre dos lugares?",
    answer:
      "Compará la misma medida e índices de carga y velocidad, el precio por unidad con IVA, si la colocación y las válvulas están incluidas, la fecha de fabricación y la garantía.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-11-19" readingMinutes={6} faqs={FAQS}>
      <p>
        «Norauto neumáticos» se busca unas 1.300 veces por mes en Argentina: mucha gente la usa de referencia al decidir dónde comprar.
        Reunimos lo que se sabe de la empresa y cómo comparar con cualquier otra opción.
      </p>

      <Callout title="Sobre esta nota" tone="info">
        <p>
          Reunimos información de la propia empresa y de medios, con fecha de consulta <strong>5 de noviembre de 2026</strong>. No somos
          parte de Norauto ni la representamos, y no comparamos precios porque cambian.
        </p>
      </Callout>

      <h2>Qué se sabe de Norauto</h2>
      <ul>
        <li><strong>Origen:</strong> es una marca francesa; su primer centro nació en Francia en 1970, según el directorio ABC Teléfonos (dato a verificar).</li>
        <li><strong>Llegada a Argentina:</strong> la filial local comenzó en 1998 con un centro en el Parque Comercial Avellaneda, según el mismo directorio.</li>
        <li><strong>Cambio de dueño:</strong> el 29 de junio de 2023 Stellantis América del Sur adquirió el 90% de Norauto Argentina, que era del grupo Mobivia, según el comunicado de Stellantis, y completaría el resto después.</li>
        <li><strong>Locales:</strong> la prensa de 2023 habla de 13 locales en el área de Buenos Aires, ubicados sobre todo en parques comerciales y shoppings.</li>
      </ul>

      <h2>Un centro de servicios, no solo un lugar para comprar cubiertas</h2>
      <p>
        Según los medios, Norauto combina neumáticos con baterías, lubricantes y mecánica ligera en un mismo local. Eso es cómodo si querés
        resolver todo junto. Si lo que buscás es cambiar neumáticos con precio y stock a la vista por medida, y alinear y balancear en el
        mismo lugar, hay otras formas de hacerlo.
      </p>

      <h2>Qué comparar antes de decidir</h2>
      <ol>
        <li><strong>La misma medida e índices</strong> (<Link href="/blog/como-leer-medida-neumatico">cómo leer la medida</Link>).</li>
        <li><strong>Precio final por unidad con IVA</strong> y si incluye colocación, válvulas y balanceo.</li>
        <li><strong>Fecha de fabricación (DOT):</strong> <Link href="/blog/antiguedad-del-neumatico-codigo-dot">cómo leerla</Link>.</li>
        <li><strong>Garantía</strong> y quién la respalda.</li>
        <li><strong>Stock real</strong> hoy en tu medida.</li>
        <li><strong>Distancia y horarios:</strong> un local cerca ahorra tiempo en cada servicio posterior.</li>
      </ol>

      <h2>Qué tenemos nosotros</h2>
      <p>
        Outlet de neumáticos de importación directa, con stock y precio publicados en la web, colocación sin cargo si comprás tus cubiertas
        con nosotros y <Link href="/servicios">taller propio</Link> para alineado y balanceado. Buscá tu medida en el{" "}
        <Link href="/catalogo">catálogo</Link>, mirá <Link href="/marcas/pirelli">Pirelli</Link> si querés una marca de primera línea, o las{" "}
        <Link href="/sucursales">sucursales</Link> de Córdoba y Buenos Aires.
      </p>

      <h2>Fuentes consultadas</h2>
      <ul>
        <li><a href="https://www.media.stellantis.com/ar-es/corporate/press/stellantis-adquiere-norauto-argentina-para-crecer-en-el-negocio-del-retail-en-el-pais" rel="nofollow noopener" target="_blank">Stellantis, comunicado «Stellantis adquiere Norauto Argentina»</a> (2023)</li>
        <li><a href="https://www.cronista.com/negocios/norauto-cambia-de-dueno-cual-es-la-mega-automotriz-que-compro-la-red-de-talleres/" rel="nofollow noopener" target="_blank">El Cronista, «Norauto cambia de dueño»</a></li>
        <li><a href="https://autoblog.com.ar/norauto-el-taller-y-supermercado-multimarca-en-shoppings-que-maneja-stellantis/" rel="nofollow noopener" target="_blank">Autoblog, «Norauto: cómo funciona…»</a></li>
        <li><a href="https://www.abctelefonos.com/norauto_argentina_ar_2744268" rel="nofollow noopener" target="_blank">ABC Teléfonos, ficha de Norauto Argentina</a></li>
      </ul>
    </ArticleLayout>
  );
}
