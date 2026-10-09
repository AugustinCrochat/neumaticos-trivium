import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";

const SLUG = "comprar-neumaticos-en-cordoba";
const TITLE = "Comprar neumáticos en Córdoba: qué comparar además del precio";
const SUBTITLE =
  "Dos presupuestos con el mismo precio pueden no ser lo mismo. Qué preguntar para comparar bien antes de comprar un juego de cubiertas.";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Guía para comprar neumáticos en Córdoba: cómo comparar presupuestos, qué incluye la colocación, cómo leer la fecha de fabricación (DOT), la garantía y el stock real.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cómo sé qué tan nuevo es un neumático?",
    answer:
      "Mirá el código DOT grabado en el flanco: los últimos cuatro dígitos indican semana y año de fabricación. Por ejemplo, 2824 significa semana 28 del año 2024. Conviene que no tengan más de uno o dos años de fabricados.",
  },
  {
    question: "¿La colocación está incluida en el precio?",
    answer:
      "Depende del negocio, y es lo primero que hay que preguntar. En Neumáticos Trivium, la colocación y el cambio de válvulas son sin cargo si comprás las cubiertas en el local de Argüello.",
  },
  {
    question: "¿Cuántos neumáticos conviene cambiar a la vez?",
    answer:
      "Lo ideal es cambiar los cuatro. Si cambiás solo dos, los nuevos deberían ir en el eje trasero, porque es el que más ayuda a mantener la estabilidad en frenadas y lluvia.",
  },
  {
    question: "¿Se puede comprar online y retirar en el local?",
    answer:
      "Sí. En la web figura el stock real de cada medida, y podés consultar por WhatsApp antes de ir. El local está en Av. Donato Álvarez 7971, Argüello, de lunes a sábados de 9 a 19 horas.",
  },
  {
    question: "¿Qué garantía tienen los neumáticos?",
    answer:
      "En Neumáticos Trivium todas las marcas tienen un año de garantía contra defectos de fábrica, que se tramita en el mismo local.",
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
        Pedir tres presupuestos de neumáticos y quedarte con el más barato parece sensato, pero a
        menudo los tres no incluyen lo mismo. Uno suma la colocación, otro no; uno trae neumáticos
        recién fabricados y otro de hace tres años. Esta es la lista de cosas que conviene preguntar
        para comparar peras con peras.
      </p>

      <h2>1. La medida exacta</h2>
      <p>
        Sale en el flanco de tu neumático actual (algo como 205/55 R16). Si no la tenés a mano, podés
        buscarla en la web <Link href="/buscar">por medida o por vehículo</Link> y revisar las
        alternativas equivalentes con la{" "}
        <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link>.
        Aprendé a leerla en{" "}
        <Link href="/blog/como-leer-medida-neumatico">esta guía</Link>.
      </p>

      <h2>2. La fecha de fabricación (DOT)</h2>
      <p>
        La goma envejece aunque el neumático no ruede. En el flanco hay un código que termina en
        cuatro dígitos: semana y año. <strong>2824</strong> es semana 28 de 2024. Es un dato que
        cualquier vendedor puede mostrarte, y que pesa en el precio: un neumático de hace tres años
        debería costar menos.
      </p>

      <h2>3. La colocación y las válvulas</h2>
      <p>
        Arme y desarme, válvulas nuevas y balanceo suelen sumar bastante a un presupuesto.
        Preguntá si están incluidos. Con nosotros, la colocación y el cambio de válvulas no se
        cobran si comprás las cubiertas en el local.
      </p>

      <h2>4. El stock real</h2>
      <p>
        &quot;Lo tenemos&quot; y &quot;lo pedimos&quot; son dos cosas distintas. La segunda significa
        volver otro día. En nuestra web cada neumático muestra si hay stock en el local, así que
        sabés antes de ir si te lo llevás hoy.
      </p>

      <h2>5. La garantía</h2>
      <p>
        Pedí que te diga cuánto dura, qué cubre y dónde se hace efectiva. La nuestra es de un año
        contra defectos de fábrica, y se atiende en el mismo local, sin formularios ni envíos.
      </p>

      <h2>6. Marca y origen</h2>
      <p>
        Hoy hay marcas importadas que cumplen homologaciones europeas a una fracción del precio de
        las premium. No son mejores ni peores en abstracto: depende de tu uso. Te ayudamos a
        elegir con <Link href="/blog/marcas-chinas-neumaticos-comparativa">esta comparativa de
        marcas</Link> y con el costo por kilómetro en{" "}
        <Link href="/blog/precio-calidad-neumaticos-costo-por-km">esta nota</Link>.
      </p>

      <h2>Dónde comprar en Córdoba</h2>
      <p>
        Somos un outlet con importación directa: vendemos al público sin intermediarios, con precio
        y stock publicados en la web, y taller propio para colocar, balancear y alinear en el mismo
        lugar. Estamos en Av. Donato Álvarez 7971, Argüello, y atendemos clientes de Córdoba
        Capital, Villa Allende, Saldán, La Calera, Mendiolaza, Unquillo y Río Ceballos. Mirá el{" "}
        <Link href="/catalogo">catálogo completo</Link> o consultá{" "}
        <Link href="/neumaticos-en/cordoba">cómo llegar</Link>.
      </p>
    </ArticleLayout>
  );
}
