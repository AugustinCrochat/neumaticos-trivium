import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumen-historia-sucursales-y-como-comparar";
const TITLE = "Neumen: historia, sucursales y cómo comparar antes de comprar neumáticos";
const SUBTITLE =
  "Qué se sabe de la cadena Neumen según fuentes públicas, cómo comparar entre una cadena grande y otras opciones, y qué mirar más allá del precio.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Qué es Neumen: cuándo nació, cuántas sucursales declara, su foco en Pirelli y cómo comparar con otras opciones para comprar neumáticos en Córdoba y Buenos Aires, con precio y stock publicados."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es Neumen?",
    answer:
      "Es una cadena argentina de centros de servicio para el automotor con foco en neumáticos. Según su sitio oficial, nació en febrero de 1986 en la zona sur del Gran Buenos Aires.",
  },
  {
    question: "¿Cuántas sucursales tiene Neumen?",
    answer:
      "Las notas de prensa de 2024 hablan de unas 40 sucursales, y las de 2021 de 37. La cifra cambia con el tiempo: para el dato actual conviene mirar su sitio oficial.",
  },
  {
    question: "¿Neumen vende Pirelli?",
    answer:
      "Sí, según las notas de 2024 es el mayor distribuidor de Pirelli de América. Nosotros también tenemos Pirelli; podés ver las medidas con stock en la página de la marca.",
  },
  {
    question: "¿Neumáticos Trivium tiene relación con Neumen?",
    answer:
      "No. Neumáticos Trivium es una empresa distinta, con locales y taller propio en Córdoba (Argüello) y Buenos Aires. Esta nota usa información pública y no es una comparación de precios.",
  },
  {
    question: "¿Cómo comparo precios entre dos lugares?",
    answer:
      "Compará la misma medida e índices de carga y velocidad, el precio por unidad con IVA, si la colocación y las válvulas están incluidas, la fecha de fabricación y la garantía. Un precio más bajo sin colocación puede terminar siendo más caro.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-11-12" readingMinutes={6} faqs={FAQS}>
      <p>
        Cuando alguien busca «Neumen» suele estar comparando dónde comprar neumáticos. Es una búsqueda frecuente en Argentina y por eso
        armamos esta nota: qué se sabe de la cadena según fuentes públicas y cómo comparar, con criterios que sirven para cualquier lugar.
      </p>

      <Callout title="Sobre esta nota" tone="info">
        <p>
          Reunimos información publicada por la propia empresa y por medios, con fecha de consulta <strong>5 de noviembre de 2026</strong>. No
          somos parte de Neumen ni la representamos, y no comparamos precios: los de cada lugar cambian.
        </p>
      </Callout>

      <h2>Qué se sabe de Neumen</h2>
      <ul>
        <li><strong>Origen:</strong> según su sitio oficial, nació en febrero de 1986 en la zona sur del Gran Buenos Aires. Una nota de Visión Auto cuenta que su fundador, Roberto Méndez, la empezó como una gomería.</li>
        <li><strong>Crecimiento:</strong> su sitio señala que en 1995 ya superaba las 20 sucursales, y su perfil de LinkedIn ubica en 2002 la expansión hacia la Ciudad de Buenos Aires y el AMBA.</li>
        <li><strong>Tamaño:</strong> en 2021 se hablaba de 37 sucursales (Capital, GBA, Mar del Plata, Junín, Tandil, Tucumán, Salta y Córdoba) y en 2024, de unas 40 y 470 profesionales.</li>
        <li><strong>Foco:</strong> las notas de 2024 la describen como distribuidor de Pirelli en el país, con servicios de alineación, balanceo y mecánica ligera.</li>
      </ul>

      <h2>Cadena grande o taller propio: qué cambia</h2>
      <p>
        Una cadena con decenas de locales ofrece cobertura y una marca conocida. Un local con taller propio, como el nuestro de Argüello,
        ofrece otra cosa: stock y precio publicados por medida, colocación sin cargo y trato directo con quien hace el trabajo. Ninguna opción
        es mejor en todo: depende de tu medida, tu zona y cuánto valorás cada cosa.
      </p>

      <h2>Qué comparar antes de decidir</h2>
      <ol>
        <li><strong>La misma medida e índices:</strong> por ejemplo 195/55 R16 con el índice de carga y de velocidad que pide tu auto (<Link href="/blog/indice-de-carga-y-velocidad">cómo leerlos</Link>).</li>
        <li><strong>Precio final por unidad con IVA</strong> y si incluye colocación, válvulas y balanceo.</li>
        <li><strong>Fecha de fabricación (DOT):</strong> mirá cómo leerla en <Link href="/blog/antiguedad-del-neumatico-codigo-dot">esta guía</Link>.</li>
        <li><strong>Garantía:</strong> qué cubre y quién la respalda.</li>
        <li><strong>Stock real:</strong> que la medida esté disponible hoy y no «a pedido».</li>
        <li><strong>Servicios en el mismo lugar:</strong> <Link href="/servicios">alineado y balanceado</Link> sin llevar el auto a otro taller.</li>
      </ol>

      <h2>Qué tenemos nosotros</h2>
      <p>
        Somos un outlet de neumáticos de importación directa, con stock y precio publicados en la web, colocación sin cargo si comprás tus
        cubiertas con nosotros y taller propio en Córdoba. También tenemos <Link href="/marcas/pirelli">Pirelli</Link>, y marcas importadas
        como Grenlander, Zmax y Arivo Premio. Buscá tu medida en el <Link href="/catalogo">catálogo</Link> o mirá las <Link href="/sucursales">sucursales</Link>.
      </p>

      <h2>Fuentes consultadas</h2>
      <ul>
        <li><a href="https://neumen.ar/nosotros/" rel="nofollow noopener" target="_blank">Neumen, «Somos Neumen»</a> (sitio oficial)</li>
        <li><a href="https://visionauto.com.ar/neumen-38-anos-de-trayectoria-al-servicio-de-sus-clientes/" rel="nofollow noopener" target="_blank">Visión Auto, «Neumen, 38 años de trayectoria»</a> (2024)</li>
        <li><a href="https://www.somospymes.com.ar/item/54957-neumen-celebra-35-anos-de-actividad-y-crecimiento-sostenido-en-argentina.html" rel="nofollow noopener" target="_blank">Somos Pymes, «Neumen celebra 35 años»</a> (2021)</li>
        <li><a href="https://ar.linkedin.com/company/neumen" rel="nofollow noopener" target="_blank">Perfil de Neumen en LinkedIn</a></li>
      </ul>
    </ArticleLayout>
  );
}
