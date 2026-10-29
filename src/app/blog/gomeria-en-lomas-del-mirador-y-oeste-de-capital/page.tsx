import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "gomeria-en-lomas-del-mirador-y-oeste-de-capital";
const TITLE = "Gomería en Lomas del Mirador y oeste de Capital: neumáticos, alineación y balanceo";
const SUBTITLE =
  "Qué servicios necesita tu auto si vivís en Liniers, Villa Luro, Mataderos o alrededores, y cómo llegar al local de Av. Mosconi, pegado a la General Paz. Abre en diciembre.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Guía de gomería para Lomas del Mirador y el oeste de Capital Federal (Liniers, Villa Luro, Versalles, Mataderos, Parque Avellaneda, Villa Lugano): servicios, cómo elegir taller y cómo llegar al local de Av. Mosconi 248. Abre en diciembre.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Dónde queda Neumáticos Trivium Lomas del Mirador?",
    answer:
      "En Av. General Enrique Mosconi 248, Lomas del Mirador, partido de La Matanza, pegado a la General Paz. Abre en diciembre; mientras tanto podés consultar stock y precios en la web y por WhatsApp.",
  },
  {
    question: "¿Atienden a los vecinos de Capital Federal?",
    answer:
      "Sí. El local está del otro lado de la General Paz, a pocos minutos de Liniers, Villa Luro, Versalles, Mataderos, Parque Avellaneda, Villa Lugano, Floresta y Villa Devoto. Los tiempos dependen del tránsito: Google Maps te marca el recorrido desde tu barrio.",
  },
  {
    question: "¿Qué servicios va a haber en Lomas del Mirador?",
    answer:
      "Los que tiene la gomería de Córdoba: colocación, balanceo, alineación y rotación. Cuando abra, publicamos los detalles y precios de esta sucursal.",
  },
  {
    question: "¿Cuál es el horario?",
    answer: "De lunes a sábados de 9 a 19 horas corrido, igual que en Argüello.",
  },
  {
    question: "¿Cuánto cuesta la alineación y el balanceo?",
    answer:
      "Depende del vehículo. Cuando abramos publicamos los precios de esta sucursal; hoy podés consultarnos por WhatsApp.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-11-05" readingMinutes={5} faqs={FAQS}>
      <p>
        Si vivís o trabajás en el oeste de la Ciudad, tenés gomerías en cada cuadra, pero no todas hacen
        lo mismo ni con el mismo equipo, y los precios de Capital suelen cargar alquileres caros. Del otro
        lado de la General Paz hay otra opción a pocos minutos. Esta guía resume qué servicios necesita un
        auto, qué mirar al elegir un taller y cómo llegar a nuestra sucursal de Lomas del Mirador.
      </p>

      <h2>Neumáticos Trivium Lomas del Mirador</h2>
      <p>
        La sucursal está en <strong>Av. General Enrique Mosconi 248</strong>, Lomas del Mirador, y{" "}
        <strong>abre en diciembre</strong>. Vamos a atender de lunes a sábados de 9 a 19 horas corrido,
        igual que en Argüello. Hasta entonces podés ver el stock y los precios en el{" "}
        <Link href="/catalogo">catálogo</Link> y escribirnos por WhatsApp.
      </p>

      <h2>Cómo llegar desde Capital</h2>
      <p>
        Av. Mosconi corre pegada a la General Paz, así que desde los barrios del oeste y sur de la Ciudad
        alcanza con cruzar la avenida. Los tiempos son aproximados y dependen del tránsito:
      </p>
      <ul>
        <li><Link href="/neumaticos-en/liniers">Liniers</Link>, <Link href="/neumaticos-en/villa-luro">Villa Luro</Link> y <Link href="/neumaticos-en/versalles">Versalles</Link>: unos diez minutos en auto.</li>
        <li><Link href="/neumaticos-en/mataderos">Mataderos</Link>, <Link href="/neumaticos-en/parque-avellaneda">Parque Avellaneda</Link> y <Link href="/neumaticos-en/floresta">Floresta</Link>: unos quince minutos.</li>
        <li><Link href="/neumaticos-en/villa-lugano">Villa Lugano</Link> y <Link href="/neumaticos-en/villa-devoto">Villa Devoto</Link>: unos veinte minutos.</li>
      </ul>
      <p>
        Sumá la dirección en Google Maps y te marca el camino más rápido a la hora que salgas. También
        tenés la <Link href="/sucursales/lomas-del-mirador">ficha de la sucursal</Link> con el mapa.
      </p>

      <h2>Los servicios que necesita tu auto</h2>
      <ul>
        <li>
          <strong>Arme y desarme:</strong> cambio de neumáticos con desmontadora y válvula nueva. Mirá{" "}
          <Link href="/blog/arme-y-desarme-de-neumaticos">cómo se hace bien</Link>.
        </li>
        <li>
          <strong>Balanceo:</strong> evita vibraciones en el volante. Siempre después de un arme.
        </li>
        <li>
          <strong>Alineación:</strong> corrige los ángulos para que el auto vaya derecho y la
          cubierta dure más. <Link href="/blog/alineacion-y-balanceo">Alineación y balanceo</Link>.
        </li>
        <li>
          <strong>Rotación:</strong> reparte el desgaste entre las cuatro ruedas.{" "}
          <Link href="/blog/rotacion-de-neumaticos">Guía de rotación</Link>.
        </li>
        <li>
          <strong>Pinchaduras:</strong> cómo se repara y cuándo no se puede, en{" "}
          <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">parche, minicombi o tarugo</Link>.
        </li>
        <li>
          <strong>Tuercas de seguridad:</strong> uso, cuidado y extracción en{" "}
          <Link href="/blog/tuercas-y-bulones-de-seguridad">esta guía</Link>.
        </li>
      </ul>

      <h2>Cómo elegir una gomería en Capital y alrededores</h2>
      <p>
        Pedí que te digan qué máquinas usan: una alineadora 3D, una balanceadora computarizada y una
        desmontadora automática marcan la diferencia con el trabajo a ojo. Preguntá el precio por rueda
        antes de empezar y si cambian la válvula. Para comparar el neumático, buscá tu medida en la web
        y llevá la cotización que te hayan hecho: al ser cubiertas nuevas con garantía de un año, la
        comparación es de igual a igual. Las máquinas que usamos están explicadas en{" "}
        <Link href="/blog/maquinas-hofmann-y-elevadores-rotary-lift-gomeria">este artículo</Link>.
      </p>

      <h2>Neumáticos para el oeste de la Ciudad</h2>
      <p>
        Mientras abrimos, podés buscar tu medida en el <Link href="/buscador">buscador</Link> o por{" "}
        <Link href="/vehiculos">tu auto</Link>. También armamos páginas por zona:{" "}
        <Link href="/neumaticos-en/lomas-del-mirador">Lomas del Mirador</Link> y{" "}
        <Link href="/neumaticos-en/capital-federal">Capital Federal</Link>.
      </p>
    </ArticleLayout>
  );
}
