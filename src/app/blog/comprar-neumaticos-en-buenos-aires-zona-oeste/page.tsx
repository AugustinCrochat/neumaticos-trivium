import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "comprar-neumaticos-en-buenos-aires-zona-oeste";
const TITLE = "Comprar neumáticos en Buenos Aires (zona oeste y Capital): qué comparar antes de pagar";
const SUBTITLE =
  "Cómo comparar presupuestos de cubiertas en La Matanza, el oeste del Gran Buenos Aires y el oeste de Capital, y dónde van a estar nuestros locales.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Guía para comprar neumáticos en la zona oeste del Gran Buenos Aires y el oeste de Capital Federal: cómo comparar presupuestos, qué preguntar por colocación, fecha de fabricación (DOT) y garantía, y dónde abren Lomas del Mirador y San Justo."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Dónde van a estar los locales de Neumáticos Trivium en Buenos Aires?",
    answer:
      "En Av. General Enrique Mosconi 248, Lomas del Mirador (pegado a la General Paz, abre en diciembre) y en Pres. Juan Domingo Perón 2847, San Justo, La Matanza (abre en enero). Mientras tanto podés ver el catálogo y consultar por WhatsApp.",
  },
  {
    question: "¿Puedo ver los precios antes de ir?",
    answer:
      "Sí. En la web cada medida tiene precio publicado y se actualiza con el stock. Los precios son los mismos que vas a encontrar en el local, sin sorpresas en el mostrador.",
  },
  {
    question: "¿Hay que sacar turno para colocar?",
    answer:
      "En el local de Córdoba se atiende por orden de llegada, sin turno. Cuando abran los locales de Buenos Aires publicamos cómo funciona la atención en cada uno.",
  },
  {
    question: "¿Qué garantía tienen los neumáticos?",
    answer:
      "Todos los neumáticos de Neumáticos Trivium tienen un año de garantía contra defectos de fabricación, que se gestiona en el local.",
  },
  {
    question: "¿Atienden a quienes viven en Capital Federal?",
    answer:
      "Sí. El local de Lomas del Mirador está del otro lado de la General Paz, a pocos minutos de Liniers, Villa Luro, Mataderos, Versalles y Parque Avellaneda.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-11-30" readingMinutes={5} faqs={FAQS}>
      <p>
        En el oeste del Gran Buenos Aires y en el oeste de Capital hay muchísimas opciones para
        comprar cubiertas, y los presupuestos pueden parecer parecidos y no serlo. Esta guía junta lo
        que conviene preguntar antes de pagar, y cuenta dónde vamos a estar nosotros.
      </p>

      <h2>1. Qué incluye el precio</h2>
      <p>
        El precio por neumático es solo una parte. Preguntá si suma la colocación, las válvulas
        nuevas y el balanceo, o si se cobran aparte. Dos presupuestos con el mismo número pueden
        terminar con diferencias grandes al final del día.
      </p>

      <h2>2. La medida exacta</h2>
      <p>
        Figura en el flanco del neumático actual, con un formato como 205/55 R16. Si no la tenés a
        mano, buscala <Link href="/buscar">por medida o por patente</Link> o aprendé a leerla en{" "}
        <Link href="/blog/como-leer-medida-neumatico">esta guía</Link>. Con la medida correcta se
        compara precio contra precio, no marca contra marca.
      </p>

      <h2>3. La fecha de fabricación (DOT)</h2>
      <p>
        La goma envejece aunque el neumático no ruede. En el flanco hay un código que termina en
        cuatro dígitos: semana y año de fabricación. Un neumático de hace varios años debería costar
        menos que uno reciente; si te lo venden al mismo precio, es un dato a tener en cuenta.
      </p>

      <h2>4. Stock real o pedido</h2>
      <p>
        &quot;Lo tenemos&quot; y &quot;lo pedimos&quot; no son lo mismo: lo segundo significa volver
        otro día. Elegí un negocio que publique el stock y el precio, así sabés antes de ir si te
        llevás las cubiertas en el día.
      </p>

      <h2>5. Garantía y dónde se hace efectiva</h2>
      <p>
        Preguntá cuánto dura, qué cubre y dónde se tramita. La nuestra es de un año contra defectos
        de fabricación y se gestiona directo en el local, sin intermediarios.
      </p>

      <h2>Dónde vamos a estar</h2>
      <p>
        Estamos abriendo dos locales en la zona oeste. El de{" "}
        <Link href="/neumaticos-en/lomas-del-mirador">Lomas del Mirador</Link> queda en Av. General
        Enrique Mosconi 248, pegado a la General Paz, y abre en diciembre. El de{" "}
        <Link href="/neumaticos-en/san-justo">San Justo</Link> queda en Pres. Juan Domingo Perón
        2847, en La Matanza, y abre en enero. Atenderemos de lunes a sábados de 9 a 19 horas.
      </p>
      <p>
        Mientras tanto, mirá el <Link href="/catalogo">catálogo</Link> con precios publicados,
        revisá las <Link href="/ofertas">ofertas</Link> o escribinos por WhatsApp. Si querés saber
        qué servicios va a haber, leé la guía de{" "}
        <Link href="/blog/gomeria-en-san-justo-buenos-aires">gomería en San Justo y La Matanza</Link>{" "}
        o la de{" "}
        <Link href="/blog/gomeria-en-lomas-del-mirador-y-oeste-de-capital">Lomas del Mirador y oeste de Capital</Link>.
      </p>
    </ArticleLayout>
  );
}
