import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { canonical } from "@/lib/seo";

const SLUG = "son-malos-los-neumaticos-chinos";
const TITLE = "¿Son malos los neumáticos chinos? Mitos y realidad";
const SUBTITLE =
  "El país de fabricación no define la calidad de un neumático. Lo que sí la define es la homologación, la trazabilidad y el control de calidad. Cómo separar lo bueno de lo malo.";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "¿Son malos los neumáticos chinos? Mitos y realidad: dónde fabrican también las marcas premium, qué homologaciones exigir (ECE, DOT) y qué señales distinguen un buen neumático importado de uno dudoso.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Los neumáticos chinos son de mala calidad?",
    answer:
      "No como regla. China es el mayor productor de neumáticos del mundo y allí conviven fábricas con décadas de trayectoria y homologación internacional con talleres sin controles. La calidad depende del fabricante y del modelo, no del país. Lo que conviene verificar es la homologación (ECE o DOT en el flanco), la fecha de fabricación y que los índices sean los correctos.",
  },
  {
    question: "¿Las marcas premium también fabrican en China?",
    answer:
      "Sí. Varias marcas globales producen parte de su volumen en plantas ubicadas en China, además de otros países. El origen de la planta no es lo que distingue a una marca premium: lo hacen sus estándares de diseño, ensayo y control.",
  },
  {
    question: "¿Cómo sé si un neumático chino es seguro?",
    answer:
      "Mirá el flanco: la marca de homologación (E con un número dentro de un círculo para ECE, o el código DOT), la fecha de fabricación (cuatro dígitos: semana y año), la medida y los índices de carga y velocidad. Pedí factura y garantía del vendedor. En la nota «Cómo elegir un neumático importado seguro» tenés el checklist completo.",
  },
  {
    question: "¿Por qué a veces un neumático chino sale mucho más barato?",
    answer:
      "Por una combinación de escala de fabricación, menores costos de desarrollo, menos inversión en marketing y menos intermediarios cuando se importa directo. Un precio bajo no implica por sí solo mala calidad, pero un precio absurdamente bajo es una señal para verificar con más cuidado la homologación y la fecha.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-10-21" readingMinutes={7} faqs={FAQS}>
      <p>
        «Chino» se usa como sinónimo de «de mala calidad», y en neumáticos esa generalización cuesta cara: lleva a pagar de más por
        marcas cuando no hace falta, o a comprar a ciegas lo más barato cuando sí hay que mirar. La realidad tiene más matices.
      </p>

      <Callout title="Lo central" tone="ok">
        <p>
          El país de fabricación no dice si un neumático es bueno. Dice más la <strong>homologación grabada en el flanco</strong>, la{" "}
          <strong>fecha de fabricación</strong> y el <strong>respaldo del vendedor</strong>. Un neumático chino homologado y reciente es
          una opción razonable; uno sin homologación ni fecha clara no lo es, venga de donde venga.
        </p>
      </Callout>

      <h2>Mito 1: «Lo chino es de mala calidad»</h2>
      <p>
        China produce una porción enorme de los neumáticos del mundo. Esa escala implica fábricas muy distintas: algunas con décadas de
        experiencia, plantas auditadas y homologación europea; otras pequeñas, sin controles serios. La calidad está en el fabricante.
        Lo explicamos en detalle en la comparativa de <Link href="/blog/marcas-chinas-neumaticos-comparativa">marcas chinas por franjas</Link>.
      </p>

      <h2>Mito 2: «Las marcas premium se fabrican en Europa»</h2>
      <p>
        Las marcas globales fabrican en plantas de varios países, incluida China, además de Europa, América y otros lugares de Asia. Lo
        que las distingue no es dónde está la planta sino cómo diseñan, ensayan y controlan lo que sale de ella. Es un buen recordatorio
        de que el «origen» es una pista pobre.
      </p>

      <h2>Mito 3: «Un neumático barato es peligroso»</h2>
      <p>
        El precio no determina la seguridad estructural: la determinan los ensayos de homologación. En Europa el reglamento{" "}
        <strong>ECE R30</strong> fija ensayos de resistencia, velocidad y carga para neumáticos de auto, y en Estados Unidos las
        normas <strong>FMVSS</strong> identificadas por el código <strong>DOT</strong>. Un neumático económico que supera esos ensayos
        cumple el piso de seguridad exigido. Lo que suele ceder frente a un premium es el desempeño fino (frenado en mojado, ruido,
        consistencia), no el piso estructural.
      </p>

      <h2>Qué sí es un riesgo real</h2>
      <ul>
        <li><strong>Sin homologación visible.</strong> Si el flanco no trae marca ECE ni código DOT, no hay forma de saber si pasó ensayos.</li>
        <li><strong>Fecha de fabricación vieja.</strong> La goma envejece aunque no ruede. Mirá el DOT: los últimos cuatro dígitos son semana y año.</li>
        <li><strong>Índices equivocados.</strong> Un índice de carga o de velocidad menor al que pide tu vehículo es un problema de seguridad (<Link href="/blog/indice-de-carga-y-velocidad">cómo leerlos</Link>).</li>
        <li><strong>Sin respaldo.</strong> Si nadie responde por el neumático, cualquier problema queda a tu cargo.</li>
      </ul>

      <h2>Cómo reconocer un buen neumático importado</h2>
      <ol>
        <li>Homologación visible en el flanco (ECE y/o DOT).</li>
        <li>Fabricante con trayectoria y plantas propias, con información pública.</li>
        <li>Etiqueta europea o ficha técnica disponible (<Link href="/blog/etiqueta-europea-neumaticos">cómo leerla</Link>).</li>
        <li>Fecha de fabricación reciente.</li>
        <li>Un vendedor que da factura, garantía y monta el neumático correctamente.</li>
      </ol>
      <p>
        Es la misma lógica con la que elegimos con qué fabricantes trabajar; por ejemplo, la gama de{" "}
        <Link href="/marcas/grenlander">Grenlander</Link> que vendemos tiene homologación europea ECE R30 (más detalles en{" "}
        <Link href="/blog/grenlander">la nota sobre la marca</Link>).
      </p>

      <h2>Entonces, ¿cuándo conviene igual una marca premium?</h2>
      <p>
        Cuando necesitás el último escalón de frenado en mojado, silencio y consistencia, o manejás mucho a velocidad. Eso no vuelve
        malo al importado: lo ubica en otro punto de precio y prestación. La guía completa está en{" "}
        <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">neumáticos de marca vs. importados</Link>.
      </p>

      <ClusterLinks current={SLUG} />
    </ArticleLayout>
  );
}
