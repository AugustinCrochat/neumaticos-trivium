import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "gomeria-en-san-justo-buenos-aires";
const TITLE = "Gomería en San Justo y La Matanza: servicios y qué mirar antes de elegir";
const SUBTITLE =
  "Qué servicios necesita tu auto en el oeste del Gran Buenos Aires (alineación, balanceo, rotación, arme y desarme) y cómo elegir un taller. Neumáticos Trivium San Justo abre en diciembre.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Guía de gomería en San Justo, La Matanza y el oeste de Buenos Aires: arme y desarme, balanceo, alineación, rotación, pinchaduras y tuercas de seguridad. Neumáticos Trivium San Justo abre en diciembre.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Dónde queda Neumáticos Trivium San Justo?",
    answer:
      "En Pres. Juan Domingo Perón 2847, San Justo, partido de La Matanza, Buenos Aires. La sucursal abre en diciembre; mientras tanto podés consultar stock y precios en la web y por WhatsApp.",
  },
  {
    question: "¿Qué servicios va a haber en San Justo?",
    answer:
      "Los que tiene la gomería de Córdoba: colocación, balanceo, alineación y rotación. Cuando abra, publicamos los detalles y precios por sucursal.",
  },
  {
    question: "¿Qué zonas cubre la sucursal San Justo?",
    answer:
      "La Matanza (San Justo, Ramos Mejía, Villa Luzuriaga, Ciudad Evita, Isidro Casanova, Laferrere, González Catán), Morón, Hurlingham, Tres de Febrero, Merlo, Ituzaingó, Ezeiza y Capital Federal oeste.",
  },
  {
    question: "¿Cuánto cuesta la alineación y el balanceo en Buenos Aires?",
    answer:
      "Depende del vehículo y de la sucursal. Cuando abramos publicamos los precios; hoy podés consultarnos por WhatsApp.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={5} faqs={FAQS}>
      <p>
        En el oeste del Gran Buenos Aires hay muchas gomerías, pero no todas hacen lo mismo ni con
        el mismo equipo. Esta guía resume qué servicios necesita un auto, qué mirar al elegir un taller
        en San Justo, La Matanza y alrededores, y cuándo abre nuestra sucursal.
      </p>

      <h2>Neumáticos Trivium San Justo</h2>
      <p>
        Nuestra sucursal de Buenos Aires está en Pres. Juan Domingo Perón 2847, San Justo, y{" "}
        <strong>abre en diciembre</strong>. Vamos a atender de lunes a sábados de 9 a 19 horas corrido,
        igual que en Argüello. Hasta entonces podés ver el stock y los precios en el{" "}
        <Link href="/catalogo">catálogo</Link> y escribirnos por WhatsApp.
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

      <h2>Cómo elegir una gomería en La Matanza</h2>
      <p>
        Pedí que te digan qué máquinas usan: una alineadora 3D, una balanceadora computarizada y una
        desmontadora automática marcan la diferencia con el trabajo a ojo. Preguntá el precio por
        rueda antes de empezar y si cambian la válvula. Las máquinas que usamos están explicadas en{" "}
        <Link href="/blog/maquinas-hofmann-y-elevadores-rotary-lift-gomeria">este artículo</Link>.
      </p>

      <h2>Neumáticos para zona oeste</h2>
      <p>
        Mientras abrimos, podés buscar tu medida y reservar. También armamos landings por zona:{" "}
        <Link href="/neumaticos-en/san-justo">San Justo</Link>,{" "}
        <Link href="/neumaticos-en/la-matanza">La Matanza</Link>,{" "}
        <Link href="/neumaticos-en/moron">Morón</Link> y{" "}
        <Link href="/neumaticos-en/tres-de-febrero">Tres de Febrero</Link>.
      </p>
    </ArticleLayout>
  );
}
