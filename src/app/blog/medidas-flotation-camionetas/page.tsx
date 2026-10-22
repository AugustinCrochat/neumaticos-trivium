import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "medidas-flotation-camionetas";
const TITLE = "Medidas flotation: qué significa 31x10.5R15 y cómo pasarlo a métrico";
const SUBTITLE =
  "Los neumáticos LT, A/T y M/T de camioneta a veces vienen marcados en pulgadas en vez de en milímetros. Te explicamos el formato, la fórmula de conversión y una tabla con las medidas más comunes en Argentina.";

export const metadata: Metadata = {
  ...blogShare("medidas-flotation-camionetas"),
  title: TITLE,
  description:
    "Qué es una medida flotation (31x10.5R15), en qué se diferencia del sistema métrico (265/75R15), cómo convertir una a la otra y tabla de equivalencias más usadas.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿31x10.5R15 y 265/75R15 son la misma medida?",
    answer:
      "Son equivalentes, no idénticas: 31x10.5R15 da un diámetro total de aproximadamente 31 pulgadas (787mm) y 265/75R15 da 30,7 pulgadas (778mm), una diferencia de menos del 1%. Se consideran la misma medida comercial y se usan indistintamente, aunque el neumático físico puede variar levemente de una marca a otra.",
  },
  {
    question: "¿Por qué algunos neumáticos de camioneta usan pulgadas y otros milímetros?",
    answer:
      "Es una cuestión de origen y tradición de mercado. El sistema flotation (todo en pulgadas) nació en Estados Unidos para neumáticos LT (Light Truck) de pickups y 4x4, y sigue siendo el estándar ahí. El sistema métrico (mm/%/pulgadas) es el que domina en el resto del mundo, incluida Argentina. Muchos fabricantes ofrecen el mismo modelo en ambos sistemas según el mercado.",
  },
  {
    question: "¿Cómo convierto una medida flotation a métrica a mano?",
    answer:
      "Ancho en mm = ancho en pulgadas × 25,4. Altura del flanco en mm = (diámetro total − rodado) ÷ 2 × 25,4, todo en pulgadas antes de multiplicar. Perfil = altura del flanco ÷ ancho × 100. Por ejemplo, para 31x10.5R15: ancho = 10,5 × 25,4 = 267mm; flanco = (31−15)/2 × 25,4 = 203mm; perfil = 203/267 × 100 ≈ 76%, que redondeado a los pasos comerciales da 265/75R15.",
  },
  {
    question: "¿El rodado cambia entre los dos sistemas?",
    answer:
      "No. El rodado (el número después de la R) siempre está en pulgadas en los dos sistemas — es el diámetro de la llanta, y las llantas se fabrican en medidas en pulgadas en todo el mundo. Un 31x10.5R15 y un 265/75R15 calzan en la misma llanta de 15 pulgadas.",
  },
  {
    question: "¿Puedo buscar por medida flotation en la web de Trivium?",
    answer:
      "Sí. En el buscador por medida hay un toggle \"Flotation (LT/A-T)\" al lado de \"Métrico\": tipeás el diámetro total, el ancho y el rodado tal como figuran en el flanco, calculamos el equivalente métrico automáticamente y te mostramos los neumáticos que tenemos en stock en esa medida.",
  },
];

const EQUIVALENCIAS: [string, string, string][] = [
  ["31x10.50R15", "265/75R15", "R15"],
  ["33x12.50R15", "315/70R15", "R15"],
  ["31x10.50R16", "265/75R16", "R16"],
  ["33x12.50R16", "305/70R16", "R16"],
  ["33x12.50R17", "305/70R17", "R17"],
  ["35x12.50R17", "315/70R17", "R17"],
  ["33x12.50R20", "275/60R20", "R20"],
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-08-04"
      readingMinutes={6}
      faqs={FAQS}
    >
      <p>
        Si tenés una camioneta o una 4x4 con neumáticos todo terreno (A/T) o barro (M/T), es
        probable que en algún momento hayas visto una medida rara en el flanco, del tipo{" "}
        <strong>31x10.5R15</strong>, en lugar del clásico <strong>265/75R15</strong>. No es un
        error de fábrica ni una medida distinta: es otro sistema para escribir exactamente la
        misma información.
      </p>
      <p>
        Si todavía no tenés claro qué significa cada número en el sistema métrico,{" "}
        <Link href="/blog/como-leer-medida-neumatico">empezá por la guía de la medida</Link> y
        volvé — el resto de esta nota va a tener más sentido.
      </p>

      <h2>Qué es una medida "flotation"</h2>
      <p>
        Se llama así al sistema de nomenclatura que se usa en neumáticos LT (Light Truck), y
        que domina en la mayoría de los A/T y M/T pensados para pickups y 4x4. A diferencia del
        métrico, <strong>todo se expresa en pulgadas</strong>, no en milímetros ni porcentajes:
      </p>
      <ul>
        <li>
          <strong>31</strong> — diámetro total del neumático ya armado, en pulgadas (de punta a
          punta, con la llanta puesta)
        </li>
        <li>
          <strong>10.5</strong> — ancho de sección, en pulgadas (equivale al "265" del métrico,
          pero en mm sería 267)
        </li>
        <li>
          <strong>R</strong> — construcción radial, igual que en el métrico
        </li>
        <li>
          <strong>15</strong> — rodado, en pulgadas: acá no cambia nada, es el mismo número que
          verías en un 265/75R15
        </li>
      </ul>
      <p>
        La diferencia clave está en el ancho y, sobre todo, en que el flotation da el{" "}
        <strong>diámetro total directamente</strong>, mientras que el métrico lo esconde detrás
        del perfil (un porcentaje del ancho) y hay que calcularlo.
      </p>

      <h2>La fórmula para pasar de flotation a métrico</h2>
      <p>
        Es la misma matemática que usamos para calcular{" "}
        <Link href="/blog/equivalencias">medidas equivalentes</Link>, aplicada al revés:
      </p>
      <ol>
        <li>
          <strong>Ancho en mm</strong> = ancho en pulgadas × 25,4
        </li>
        <li>
          <strong>Altura de flanco en mm</strong> = (diámetro total − rodado) ÷ 2 × 25,4 (los
          tres valores en pulgadas antes de convertir)
        </li>
        <li>
          <strong>Perfil</strong> = altura de flanco ÷ ancho × 100
        </li>
      </ol>
      <p>
        Con 31x10.5R15: ancho = 10,5 × 25,4 ≈ 267mm. Flanco = (31−15) ÷ 2 × 25,4 ≈ 203mm. Perfil
        = 203 ÷ 267 × 100 ≈ 76%. Como los neumáticos se fabrican en pasos comerciales fijos (de a
        5mm de ancho, de a 5% de perfil), eso redondea a <strong>265/75R15</strong>, que es
        exactamente la medida equivalente real que vas a encontrar en cualquier casa de
        neumáticos.
      </p>
      <p>
        Ojo con un matiz: el ancho que sale de la cuenta ("267mm redondeado") no siempre coincide
        con el ancho que termina usando el fabricante en el catálogo real —el mercado solo produce
        un set limitado de combinaciones ancho/perfil, así que a veces la equivalencia comercial
        usa un ancho distinto al de la fórmula pura, siempre y cuando el diámetro total quede
        dentro de un margen chico (normalmente bajo el ±3% que tolera un velocímetro o un ABS). La
        fórmula te da un punto de partida confiable; la tabla de abajo, con pares ya verificados
        contra catálogos reales, es la referencia para no errarle.
      </p>

      <h3>Tabla de equivalencias flotation ↔ métrico más comunes</h3>
      <table>
        <thead>
          <tr>
            <th>Flotation</th>
            <th>Métrico equivalente</th>
            <th>Rodado</th>
          </tr>
        </thead>
        <tbody>
          {EQUIVALENCIAS.map(([flotation, metrico, rodado]) => (
            <tr key={flotation}>
              <td>
                <strong>{flotation}</strong>
              </td>
              <td>{metrico}</td>
              <td>{rodado}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Son las combinaciones más pedidas en Hilux, Ranger, Amarok, S10 y SW4 con levante o
        neumáticos más grandes que los de fábrica. Una aclaración importante: el ancho métrico
        "exacto" que da la fórmula no siempre es el que terminás encontrando en el mercado —los
        fabricantes producen un catálogo limitado de combinaciones ancho/perfil, así que la
        equivalencia real termina siendo la que más se acerca en diámetro total dentro de esas
        combinaciones que existen, no necesariamente la que sale de redondear la cuenta a mano.
        Por eso, si tu medida no está en la tabla, lo más confiable es usar el buscador (que
        compara contra el stock real, no contra una tabla fija) o escribirnos la medida tal cual
        figura en tu flanco.
      </p>

      <h2>¿Cuál conviene comprar, si las dos existen?</h2>
      <p>
        Para la gran mayoría de las camionetas en Argentina, el mercado real está en el sistema
        métrico: es lo que vas a encontrar en más marcas, más stock y mejor precio. El flotation
        aparece sobre todo en neumáticos importados de EE.UU. o en catálogos de fabricantes que
        arrancaron ahí (BFGoodrich es el caso típico, con varios modelos disponibles en los dos
        sistemas).
      </p>
      <p>
        La recomendación práctica: si tu camioneta vino de fábrica en medida métrica, quedate en
        métrico — vas a tener más opciones. Si el neumático que buscás específicamente solo
        existe en flotation (algunos M/T de alta gama), no hay problema en pasarte: el
        equivalente calzando en la misma llanta es matemáticamente el mismo neumático, solo que
        escrito distinto.
      </p>

      <h2>En resumen</h2>
      <ol>
        <li>
          Flotation = todo en pulgadas (diámetro total x ancho R rodado). Métrico = mm/% R
          pulgadas (ancho/perfil R rodado).
        </li>
        <li>El rodado es el mismo número en los dos sistemas — ahí nunca hay conversión.</li>
        <li>
          31x10.5R15 ≈ 265/75R15: la fórmula de conversión redondea a los pasos comerciales
          reales, no es una aproximación al voleo.
        </li>
        <li>
          En Argentina el stock real está mayormente en métrico — convertí antes de buscar si tu
          neumático actual está marcado en flotation.
        </li>
      </ol>
      <p>
        En nuestro <Link href="/neumaticos">buscador por medida</Link> podés tipear directamente
        en formato flotation (toggle "Flotation" al lado de "Métrico") y calculamos el
        equivalente por vos. Si tenés dudas con la medida de tu camioneta puntual, escribinos con
        la marca, el modelo y el año y te la confirmamos.
      </p>
    </ArticleLayout>
  );
}
