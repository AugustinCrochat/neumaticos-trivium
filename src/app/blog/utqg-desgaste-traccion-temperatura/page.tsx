import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "utqg-desgaste-traccion-temperatura";
const TITLE = "UTQG: qué significan el desgaste, la tracción y la temperatura";
const SUBTITLE =
  "El código de EE. UU. que a veces aparece junto a la etiqueta europea, con un número y dos letras — por ejemplo 400 A A. Qué mide cada dato, cómo se prueba y por qué no todos los neumáticos lo tienen.";

export const metadata: Metadata = {
  ...blogShare("utqg-desgaste-traccion-temperatura"),
  title: TITLE,
  description:
    resumen("Qué es el UTQG (Uniform Tire Quality Grading): desgaste relativo (treadwear), tracción y temperatura. Cómo leerlo, sus límites y en qué se diferencia de la etiqueta europea."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿UTQG es obligatorio en Argentina?",
    answer:
      "No. Es una norma del Departamento de Transporte de Estados Unidos (49 CFR 575.104), obligatoria para neumáticos de auto que se venden en ese mercado. Acá no la exige ningún organismo. Aparece en nuestras fichas solo cuando el fabricante la declara para ese modelo — casi siempre porque vende el mismo neumático también en EE. UU.",
  },
  {
    question: "¿El treadwear (desgaste) me dice cuántos kilómetros dura el neumático?",
    answer:
      "No en kilómetros directos. Es un número relativo: el fabricante lo calcula corriendo el neumático junto a uno de referencia (fijado en 100) en una pista de test estandarizada, y reporta cuánto menos se desgastó el propio. Un 400 sugiere, en esa pista puntual, cuatro veces menos desgaste que la referencia — pero es un dato que declara el propio fabricante, no un organismo independiente, y solo sirve para comparar modelos de la MISMA marca entre sí, no entre marcas distintas.",
  },
  {
    question: "¿Por qué la mayoría de los neumáticos chinos del catálogo no tienen UTQG?",
    answer:
      "Porque la norma solo aplica a neumáticos vendidos en EE. UU., y buena parte de las marcas económicas que importamos (Arivo, Grenlander, Zmax, Firemax) están pensadas para otros mercados — Sudamérica, Medio Oriente, Europa del Este, Oceanía — y no testean ni declaran UTQG para esas líneas. No es que el dato se perdió o no lo conseguimos: directamente no existe. Mostramos el dato solo en las fichas donde encontramos una fuente oficial verificable.",
  },
  {
    question: "¿Por qué algunas medidas de un mismo modelo no tienen UTQG y otras sí?",
    answer:
      "Porque la norma aplica a neumáticos P-metric y Euro-metric de pasajeros, pero no a los LT-metric (de carga liviana, identificados con el prefijo \"LT\" y el índice de carga dual, ej. 113/110S). Un mismo modelo puede venir en ambas familias según la medida, y solo la parte de pasajeros lleva UTQG.",
  },
  {
    question: "¿Un B en temperatura es peligroso?",
    answer:
      "No. Las tres clases (A, B, C) superan el mínimo federal exigido en EE. UU. para poder venderse; C ya es aprobado. La escala mide margen adicional de resistencia al calor a alta velocidad sostenida, relevante sobre todo en ruta a velocidad de autopista en climas cálidos. Para el uso urbano típico en Argentina, la diferencia entre A y C rara vez es el factor decisivo.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-09-25"
      readingMinutes={5}
      faqs={FAQS}
    >
      <p>
        En algunas de nuestras fichas de producto, debajo del dato de la{" "}
        <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea</Link>, aparece otra línea:{" "}
        <strong>UTQG</strong>, con un número y dos letras — por ejemplo <strong>420 A A</strong>. Es
        un código distinto, de otro país y otra norma, que muchos fabricantes imprimen en el mismo
        flanco porque venden el mismo neumático en los dos mercados. Esta nota explica qué significa
        cada parte, cómo se calcula y por qué no aparece en todos los modelos del catálogo. Si buscás la lista de neumáticos que lo
        tienen, está en <Link href="/utqg">UTQG: qué significa y qué modelos lo declaran</Link>.
      </p>

      <h2>Qué es UTQG</h2>
      <p>
        UTQG son las siglas de <strong>Uniform Tire Quality Grading</strong> (&ldquo;clasificación
        uniforme de calidad de neumáticos&rdquo;), una norma del Departamento de Transporte de Estados
        Unidos (regulación federal 49 CFR 575.104) que exige a los fabricantes declarar tres datos
        para cada neumático de pasajeros que venden en ese mercado: desgaste relativo, tracción y
        resistencia a la temperatura. No tiene relación regulatoria con la{" "}
        <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea de eficiencia</Link> (esa es
        de la Unión Europea, mide otra cosa y usa otra escala) — son dos sistemas independientes que
        a veces conviven en el mismo sticker porque el fabricante homologa el mismo producto físico
        para ambos mercados.
      </p>
      <p>
        El formato es siempre el mismo orden: <strong>número</strong> (desgaste) —{" "}
        <strong>letra</strong> (tracción) — <strong>letra</strong> (temperatura). En{" "}
        <Link href="/productos/arivo-premio-arz1rt-165-70-r13-79t">esta ficha</Link>, por ejemplo,
        el dato es 420 A A.
      </p>

      <h2>Desgaste relativo (treadwear): el número</h2>
      <p>
        Es el primer dato, y el que más se presta a malentendidos. No es una promesa de kilómetros:
        es un <strong>número relativo</strong> que el propio fabricante calcula corriendo el
        neumático junto a un neumático de referencia (fijado arbitrariamente en 100) sobre un
        circuito de test estandarizado de unos 11.520 km, bajo condiciones controladas. Si el
        neumático se desgasta la mitad que la referencia en la misma distancia, se reporta 200; si
        se desgasta un cuarto, 400.
      </p>
      <p>
        Dos límites importantes para no sobreinterpretarlo: primero, es un{" "}
        <strong>dato autodeclarado</strong> por el fabricante (no lo mide un laboratorio
        independiente ni un organismo estatal, aunque el gobierno de EE. UU. puede auditarlo).
        Segundo, y más importante en la práctica: la pista de test y las condiciones las define cada
        fabricante dentro de un protocolo general, así que <strong>solo sirve para comparar
        modelos de la misma marca entre sí</strong> — un 400 de una marca y un 400 de otra no
        garantizan la misma duración real, porque no corrieron la misma pista en las mismas
        condiciones. El desgaste real en la calle además depende de la presión, la alineación, el
        estilo de manejo y el asfalto, no solo del neumático.
      </p>

      <h2>Tracción: cómo frena en línea recta sobre mojado</h2>
      <p>
        La primera letra. Mide la capacidad de frenado en línea recta sobre pavimento mojado, en una
        escala de <strong>AA</strong> (la mejor), <strong>A</strong>, <strong>B</strong> a{" "}
        <strong>C</strong> (la peor calificación que igual aprueba el mínimo exigido). A diferencia
        del treadwear, esta sí es una prueba de desempeño medida bajo un protocolo fijo — pero ojo:
        solo evalúa <strong>frenado en línea recta</strong>, no agarre en curva ni maniobrabilidad,
        que son las situaciones donde más se nota la diferencia entre neumáticos en el uso real.
      </p>

      <h2>Temperatura: resistencia al calor a alta velocidad</h2>
      <p>
        La segunda letra, de <strong>A</strong> (mejor) a <strong>C</strong> (la calificación mínima
        que igual está aprobada para la venta). Mide qué tan bien disipa el calor que genera la
        flexión constante de la goma al rodar, en pruebas de laboratorio a velocidad sostenida en
        una rueda de ensayo. Es relevante sobre todo en rutas a velocidad de autopista y en climas
        cálidos, donde el calor acumulado puede debilitar la estructura del neumático con el tiempo.
        Las tres clases superan el piso de seguridad exigido por la norma federal — la escala mide
        margen adicional, no una advertencia de riesgo en la calificación más baja.
      </p>

      <h2>Por qué no aparece en todos los modelos del catálogo</h2>
      <p>
        UTQG solo es obligatorio para neumáticos que se venden en Estados Unidos. Buena parte de las
        marcas económicas que importamos —Arivo, Grenlander, Zmax, Firemax— están fabricadas
        pensando en otros mercados (Sudamérica, Medio Oriente, Europa del Este, Oceanía) y
        directamente no testean ni declaran este dato para esas líneas: no es que no lo
        consiguiéramos, es que no existe. Tampoco aplica a los neumáticos <strong>LT-metric</strong>{" "}
        (de carga liviana, con el índice de carga dual en el flanco, ej. 113/110S) aunque sean del
        mismo modelo que sí lo tiene en su versión de pasajeros.
      </p>
      <p>
        Por eso en el catálogo conviven fichas con UTQG (los modelos que sí se homologan también
        para EE. UU., con la marca reportando el dato en su ficha oficial) y fichas sin él —{" "}
        <Link href="/blog/marcas-chinas-neumaticos-comparativa">
          no es una señal de peor calidad
        </Link>
        , es simplemente un mercado donde ese neumático no se vende. Cargamos el dato a mano
        revisando la ficha oficial de cada fabricante, y lo dejamos afuera antes que inventar un
        número.
      </p>

      <h2>UTQG vs. etiqueta europea: no son lo mismo</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Etiqueta europea (UE)</th>
            <th>UTQG (EE. UU.)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Qué mide</td>
            <td>Eficiencia de combustible, frenado en mojado, ruido externo</td>
            <td>Desgaste relativo, tracción en mojado, temperatura</td>
          </tr>
          <tr>
            <td>Quién certifica</td>
            <td>Registro público EPREL, auditable con QR</td>
            <td>Autodeclarado por el fabricante, auditable por el gobierno de EE. UU.</td>
          </tr>
          <tr>
            <td>Comparable entre marcas</td>
            <td>Sí, escala regulada igual para todos</td>
            <td>Tracción y temperatura sí; el desgaste, no siempre</td>
          </tr>
        </tbody>
      </table>
      <p>
        Para el detalle completo de la etiqueta europea —qué significan las letras de colores, el
        QR y el registro EPREL— ver{" "}
        <Link href="/blog/etiqueta-europea-neumaticos">la nota dedicada</Link>.
      </p>

      <h2>En resumen</h2>
      <ol>
        <li>UTQG es de EE. UU., no de la Unión Europea — son dos normas independientes.</li>
        <li>
          El desgaste (treadwear) es un número autodeclarado, comparable solo dentro de la misma
          marca, no una promesa de kilómetros.
        </li>
        <li>Tracción y temperatura sí son pruebas de desempeño con protocolo fijo.</li>
        <li>
          No todos los modelos lo tienen: solo aparece cuando el fabricante lo declara para ese
          neumático puntual, y no aplica a la versión LT-metric de carga.
        </li>
      </ol>
      <p>
        <Link href="/neumaticos">Buscá tu medida</Link> para ver la ficha completa de cada modelo,
        con la etiqueta UE y el UTQG cuando el fabricante lo publica.
      </p>
    </ArticleLayout>
  );
}
