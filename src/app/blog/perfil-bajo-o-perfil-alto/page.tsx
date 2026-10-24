import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "perfil-bajo-o-perfil-alto";
const TITLE = "Perfil bajo o perfil alto: qué ganás y qué perdés al cambiar de rodado";
const SUBTITLE =
  "Poner llantas más grandes con neumáticos de perfil más bajo cambia el auto más de lo que parece. Qué mejora, qué empeora y cómo hacerlo sin romper nada.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Ventajas y desventajas del neumático de perfil bajo frente al de perfil alto: confort, dirección, riesgo de daño en baches, costo y cómo mantener el diámetro al subir de rodado.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué significa el perfil de un neumático?",
    answer:
      "Es la altura del flanco expresada como porcentaje del ancho. En un 205/55 R16, el perfil es 55: la altura del flanco es el 55% de 205 mm, unos 113 mm. Cuanto menor el número, más bajo el flanco.",
  },
  {
    question: "¿El perfil bajo hace que el auto maneje mejor?",
    answer:
      "Da una respuesta más directa en la dirección porque el flanco flexiona menos. A cambio, el andar es más duro y el neumático y la llanta quedan más expuestos a los baches. En calles rotas, el perfil alto suele ser mejor negocio.",
  },
  {
    question: "¿Puedo subir de rodado sin cambiar nada más?",
    answer:
      "Se puede, siempre que el diámetro total del conjunto quede casi igual al original para no alterar el velocímetro ni los sistemas de control. Además hay que verificar el ancho de la llanta, el índice de carga y que la rueda no roce en la carrocería ni en la suspensión.",
  },
  {
    question: "¿Se gasta más rápido un neumático de perfil bajo?",
    answer:
      "No por sí mismo, pero suele ser un neumático de gama deportiva con goma más blanda y se suele usar con anchos mayores, por lo que el desgaste puede ser más rápido. También cuestan más y son más sensibles a la presión incorrecta.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Opiniones y Comparativas" date="2026-10-24" readingMinutes={5} faqs={FAQS}>
      <p>
        Las llantas grandes con neumáticos finitos se ven bien, y por eso mucha gente piensa en cambiar el
        rodado. Pero es una decisión de ingeniería, no solo de estética. Cuando bajás el perfil, ganás algunas
        cosas y perdés otras. Conviene saber cuáles antes de gastar.
      </p>

      <h2>Qué es el perfil</h2>
      <p>
        En la medida de un neumático, el segundo número es el perfil. En <strong>205/55 R16</strong>, el 55
        quiere decir que la altura del flanco es el 55% del ancho (205 mm): son unos <strong>113 mm</strong>.
        En un <strong>225/40 R18</strong> son 90 mm. Menos goma entre la llanta y el piso.
      </p>
      <p>
        Si no estás seguro de cómo leer el resto de la medida, mirá{" "}
        <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.
      </p>

      <h2>Qué ganás con perfil bajo</h2>
      <ul>
        <li>
          <strong>Dirección más directa.</strong> El flanco, más corto, flexiona menos y el auto responde más rápido
          al volante.
        </li>
        <li>
          <strong>Más superficie de contacto</strong>, porque suelen ser más anchos.
        </li>
        <li>
          <strong>Estética.</strong> Es la razón más frecuente, y es válida.
        </li>
      </ul>

      <h2>Qué perdés</h2>
      <ul>
        <li>
          <strong>Confort.</strong> El flanco alto actúa como un colchón extra; con perfil bajo, cada bache llega más
          fuerte al habitáculo.
        </li>
        <li>
          <strong>Protección de la llanta.</strong> Un pozo fuerte puede abollar la llanta o dañar la carcasa
          sin que se note por fuera.
        </li>
        <li>
          <strong>Dinero.</strong> Las llantas grandes y los neumáticos de esas medidas son más caros, y hay menos
          opciones económicas.
        </li>
        <li>
          <strong>Ruido.</strong> Con menos flanco para absorber, suele subir el ruido de rodado.
        </li>
      </ul>

      <Callout title="Para calles con baches" tone="warn">
        <p>
          Si tu recorrido diario tiene pozos y lomos de burro sin señalizar, el perfil alto no es una
          limitación: es una ventaja. Protege la llanta y la suspensión, y cuesta menos reemplazar un neumático.
        </p>
      </Callout>

      <h2>Cómo cambiar de rodado sin errores</h2>
      <p>
        La clave es mantener el <strong>diámetro total</strong> de la rueda casi igual. Si aumenta o disminuye
        mucho, el velocímetro marca mal y los sistemas de control (ABS, control de estabilidad) trabajan con
        información equivocada. Estos ejemplos dan un diámetro parecido, de unos 632 a 637 mm:
      </p>
      <table>
        <thead>
          <tr>
            <th>Medida</th>
            <th>Altura de flanco</th>
            <th>Diámetro aprox.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>195/65 R15</td>
            <td>127 mm</td>
            <td>634 mm</td>
          </tr>
          <tr>
            <td>205/55 R16</td>
            <td>113 mm</td>
            <td>632 mm</td>
          </tr>
          <tr>
            <td>225/45 R17</td>
            <td>101 mm</td>
            <td>634 mm</td>
          </tr>
          <tr>
            <td>225/40 R18</td>
            <td>90 mm</td>
            <td>637 mm</td>
          </tr>
        </tbody>
      </table>
      <p>
        Antes de comprar, verificá también:
      </p>
      <ol>
        <li>
          <strong>El ancho de llanta</strong> admitido por la medida elegida.
        </li>
        <li>
          <strong>El índice de carga y de velocidad</strong>, que no pueden ser menores a los originales:{" "}
          <Link href="/blog/indice-de-carga-y-velocidad">te explicamos cómo leerlos</Link>.
        </li>
        <li>
          <strong>Que no roce</strong> con la carrocería ni la suspensión en giro total.
        </li>
        <li>
          <strong>La presión</strong>: los perfiles bajos son más sensibles a que esté mal.{" "}
          <Link href="/blog/presion-de-neumaticos">Mirá cómo medirla</Link>.
        </li>
      </ol>
      <p>
        Para comprobar una equivalencia, usá la{" "}
        <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link>: te dice cuánto
        cambia el diámetro y el velocímetro.
      </p>
    </ArticleLayout>
  );
}
