import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-para-utilitarios-furgones-reparto";
const TITLE = "Neumáticos para utilitarios, furgones y reparto: cómo elegirlos sin pagar de más";
const SUBTITLE =
  "Un vehículo de trabajo gasta neumáticos más rápido que un auto. Qué medida usar, qué índice de carga exigir y cómo comparar precios cuando el neumático es una herramienta de laburo.";

export const metadata: Metadata = {
  ...blogShare("neumaticos-para-utilitarios-furgones-reparto"),
  title: TITLE,
  description:
    "Guía para elegir neumáticos de carga (serie C) en utilitarios, furgones y vehículos de reparto: medida, índice de carga, simple o dual, cada cuánto cambiarlos y cómo ahorrar sin comprometer la seguridad.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué neumático lleva un utilitario de reparto?",
    answer:
      "El que indica el fabricante en la calcomanía de la puerta del conductor, y en un utilitario o furgón casi siempre es un neumático C (de carga): su medida lleva una C después del rodado, por ejemplo 195/70 R15C. Cambiarlo por uno de auto es riesgoso porque tiene menos capacidad de carga.",
  },
  {
    question: "¿Cada cuántos kilómetros se cambian los neumáticos de un furgón?",
    answer:
      "No hay un número fijo: depende de la carga, la presión, el tipo de camino y la alineación. Un vehículo de reparto urbano, con arranques y frenadas constantes y siempre cargado, los gasta bastante más rápido que un auto. Lo que manda es la profundidad del dibujo: se cambian al llegar a los indicadores de desgaste o ante cualquier daño en el flanco.",
  },
  {
    question: "¿Conviene un neumático de carga más barato?",
    answer:
      "Puede convenir si cumple medida, tipo C e índice de carga originales, y si tiene un costo por kilómetro razonable. El precio más bajo solo sirve cuando el neumático hace la misma tarea: nunca se debe bajar el índice de carga para ahorrar.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-10-10"
      readingMinutes={6}
      faqs={FAQS}
    >
      <p>
        Un auto de uso familiar mueve a veces dos personas y un baúl. Un utilitario de reparto mueve
        carga todos los días, frena y arranca decenas de veces por hora y rara vez pasa un día vacío. Ese
        trabajo se paga en las cubiertas, y por eso elegirlas pide más criterio que en un auto.
      </p>

      <h2>Paso 1: confirmar la medida y el tipo (C)</h2>
      <p>
        La medida original está en la calcomanía del marco de la puerta del conductor y en el manual. En
        utilitarios y furgones casi siempre lleva una C: <strong>195/70 R15C</strong>,{" "}
        <strong>225/75 R16C</strong>. Esa C significa neumático comercial, con carcasa reforzada y
        presión de trabajo más alta que la de un neumático de auto de la misma medida. Si la calcomanía
        dice C, el reemplazo tiene que ser C.
      </p>
      <p>
        Podés ver todas las medidas de carga que tenemos, con precio y stock, en{" "}
        <Link href="/neumaticos/carga">neumáticos de carga</Link>.
      </p>

      <h2>Paso 2: respetar el índice de carga</h2>
      <p>
        El índice de carga dice cuánto peso soporta cada neumático. En los C vienen dos números, por
        ejemplo 104/102: el primero para montaje simple (una rueda por lado) y el segundo para rodado
        dual. La regla no cambia: <strong>igual o mayor al original</strong>, nunca menor. Con un índice
        más bajo, el neumático trabaja al límite y se calienta, se deforma y puede reventar con carga.
        La nota sobre{" "}
        <Link href="/blog/carga-simple-y-dual-neumaticos-c">carga simple y dual</Link> explica cómo leer
        cada número.
      </p>

      <h2>Paso 3: comparar el costo por kilómetro, no solo el precio</h2>
      <p>
        En un vehículo de trabajo, el neumático es un gasto operativo. Dos cubiertas con el mismo precio
        pueden salir muy distinto si una dura la mitad. El cálculo es simple: precio del juego dividido por
        los kilómetros que rinde. La nota de{" "}
        <Link href="/blog/precio-calidad-neumaticos-costo-por-km">costo por kilómetro</Link> lo desarrolla
        con ejemplos. Un precio bajo sirve cuando el neumático cumple medida, tipo e índice: ahí el ahorro
        es real.
      </p>

      <h2>Paso 4: cuidarlos para que rindan</h2>
      <ul>
        <li>
          <strong>Presión:</strong> con carga, la presión correcta es la que indica la calcomanía para ese
          peso. Una presión baja es la principal causa de desgaste prematuro y de rotura de flanco. Más en{" "}
          <Link href="/blog/presion-neumaticos-utilitarios-con-carga">presión en utilitarios con carga</Link>.
        </li>
        <li>
          <strong>Rotación:</strong> en tracción delantera, las ruedas del eje delantero se gastan más;
          rotar cada 8.000 a 10.000 km parejiza el desgaste.
        </li>
        <li>
          <strong>Alineación y balanceo:</strong> un desvío leve de alineación come el borde del dibujo en
          pocos miles de kilómetros. Hacelo al cambiar el juego (
          <Link href="/blog/alineacion-y-balanceo">cuándo hacerlos</Link>).
        </li>
        <li>
          <strong>No sobrecargar:</strong> la capacidad del vehículo y la de las ruedas son límites
          distintos; el que sea más bajo es el que manda.
        </li>
      </ul>

      <h2>Qué tenemos hoy en stock</h2>
      <CatalogWidget vehicleProfile="commercial" title="Neumáticos de carga con stock" limit={4} />

      <h2>En resumen</h2>
      <ol>
        <li>Medida y C originales, de la calcomanía de la puerta.</li>
        <li>Índice de carga igual o mayor.</li>
        <li>Comparar costo por kilómetro además del precio.</li>
        <li>Presión según la carga, rotación y alineación.</li>
      </ol>
      <p>
        ¿Dudas con tu medida? Escribinos con marca, modelo y año y te la confirmamos. Colocamos en Argüello,
        Córdoba, sin cargo si comprás la cubierta con nosotros. Mirá{" "}
        <Link href="/neumaticos/carga">todos los neumáticos de carga</Link>.
      </p>
    </ArticleLayout>
  );
}
