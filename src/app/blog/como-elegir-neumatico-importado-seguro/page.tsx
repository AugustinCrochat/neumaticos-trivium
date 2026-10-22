import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-elegir-neumatico-importado-seguro";
const TITLE = "Cómo elegir un neumático importado seguro: checklist de 8 puntos";
const SUBTITLE =
  "Antes de comprar una marca que no conocés, estos ocho controles te dicen si el neumático es confiable: homologación, fecha, índices, etiqueta, garantía y montaje.";

export const metadata: Metadata = {
  ...blogShare("como-elegir-neumatico-importado-seguro"),
  title: TITLE,
  description:
    "Checklist de 8 puntos para elegir un neumático importado seguro: homologación ECE/DOT, fecha de fabricación (código DOT), medida, índices de carga y velocidad, etiqueta, garantía y montaje.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cómo leo la fecha de fabricación de un neumático?",
    answer:
      "Buscá el código DOT en el flanco: los últimos cuatro dígitos son la semana y el año. Por ejemplo, 2524 es la semana 25 del año 2024.",
  },
  {
    question: "¿Qué antigüedad máxima es razonable al comprar?",
    answer:
      "Cuanto más reciente mejor. Como referencia, conviene que el neumático no tenga más de uno o dos años de fabricación al comprarlo y desconfiar de los que superan los tres o cuatro.",
  },
  {
    question: "¿Qué significa la «E» dentro de un círculo?",
    answer:
      "Es la marca de homologación europea (reglamento ECE). Lleva un número que identifica al país que la otorgó y, al lado, el número de aprobación. Indica que el neumático pasó los ensayos de ese reglamento.",
  },
  {
    question: "¿Un neumático sin marca de homologación es ilegal?",
    answer:
      "Sin homologación visible no hay forma de saber si pasó los ensayos mínimos. Aunque se lo pueda vender, no es una compra recomendable para un componente de seguridad como el neumático.",
  },
  {
    question: "¿Cómo reconozco un neumático de stock viejo?",
    answer:
      "Fecha DOT antigua, goma reseca o con pequeñas grietas en el flanco y rastros de almacenamiento prolongado. Pedí que te muestren el flanco antes de comprarlo.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-21" readingMinutes={7} faqs={FAQS}>
      <p>
        Comprar un neumático de una marca desconocida no tiene por qué ser un riesgo, pero sí exige verificar. Estos son los ocho
        controles que usamos nosotros antes de sumar un fabricante al catálogo, adaptados para que los hagas vos con el neumático en la mano.
      </p>

      <Callout title="Si solo tenés tiempo para tres" tone="warn">
        <p>Homologación en el flanco, fecha de fabricación e índices de carga y velocidad correctos. Con eso descartás la mayoría de los problemas.</p>
      </Callout>

      <h2>1. Homologación visible en el flanco</h2>
      <p>
        Buscá la marca <strong>ECE</strong> (una «E» dentro de un círculo, con número) y/o el código <strong>DOT</strong>. Son los
        códigos que acreditan que el neumático superó los ensayos de su mercado de origen. Sin ninguno de los dos, no hay garantía de
        que haya pasado alguna prueba. El detalle de cada norma está en la nota sobre{" "}
        <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.
      </p>

      <h2>2. Fecha de fabricación (código DOT)</h2>
      <p>
        Los últimos cuatro dígitos del DOT son <strong>semana y año</strong> (2524 = semana 25 de 2024). La goma envejece aunque no
        ruede, así que priorizá fechas recientes.
      </p>

      <h2>3. Medida correcta</h2>
      <p>
        Ancho, perfil y rodado que indica tu vehículo (en el manual, el marco de la puerta o el neumático actual). Si dudás, la guía
        para <Link href="/blog/como-leer-medida-neumatico">leer la medida</Link> te lo explica, y la{" "}
        <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> te dice qué alternativas son compatibles.
      </p>

      <h2>4. Índice de carga y velocidad</h2>
      <p>
        Nunca por debajo de lo que pide el fabricante del vehículo. Si cargás mucho o viajás a ritmo alto, mirá con más atención. Tabla y
        explicación en <Link href="/blog/indice-de-carga-y-velocidad">índice de carga y velocidad</Link>.
      </p>

      <h2>5. Etiqueta europea o ficha técnica</h2>
      <p>
        Los neumáticos pensados para el mercado europeo traen etiqueta con eficiencia, frenado en mojado y ruido, y un QR que lleva
        al registro público EPREL. Tener datos comparables es buena señal (<Link href="/blog/etiqueta-europea-neumaticos">cómo leerla</Link>).
      </p>

      <h2>6. Fabricante con trayectoria</h2>
      <p>
        Buscá información pública sobre quién fabrica: plantas propias, años en el mercado, certificaciones de calidad. Una marca
        sin ninguna información verificable es una señal de alerta.
      </p>

      <h2>7. Garantía, factura y respaldo</h2>
      <p>
        Pedí factura y qué cubre la garantía y quién la gestiona. Un vendedor que responde por lo que vende es parte de la seguridad
        del producto.
      </p>

      <h2>8. Un montaje bien hecho</h2>
      <p>
        El mejor neumático rinde mal mal montado. Pedí balanceo y revisá válvulas; la{" "}
        <Link href="/blog/alineacion-y-balanceo">alineación</Link> alarga la vida de cualquier juego.
      </p>

      <h2>Señales de alerta</h2>
      <ul>
        <li>Sin código DOT ni marca ECE.</li>
        <li>Precio muy por debajo del resto de las alternativas, sin explicación.</li>
        <li>Goma reseca, agrietada o con aspecto de almacenamiento prolongado.</li>
        <li>El vendedor no da factura ni garantía.</li>
        <li>No saben decirte el fabricante real.</li>
      </ul>
      <p>
        Con esta lista aprobada, la decisión pasa a ser de presupuesto y uso:{" "}
        <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">marca vs. importados</Link>.
      </p>

      <ClusterLinks current={SLUG} />
    </ArticleLayout>
  );
}
