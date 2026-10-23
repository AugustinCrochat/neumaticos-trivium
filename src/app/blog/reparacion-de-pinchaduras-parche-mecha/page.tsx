import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "reparacion-de-pinchaduras-parche-mecha";
const TITLE = "Reparación de pinchaduras: parche, mecha o cambio de neumático";
const SUBTITLE =
  "Cómo se repara bien un neumático pinchado, en qué se diferencia el parche de la mecha, cuándo no se puede reparar y qué pasa si manejás con la rueda baja.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo se repara una pinchadura en la gomería: parche con hongo desde adentro, mecha de emergencia, zonas que no se reparan y cuándo hay que cambiar el neumático. Córdoba y Buenos Aires.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Es lo mismo el parche que la mecha?",
    answer:
      "No. La mecha es una tira de goma que se mete desde afuera con el neumático puesto: sirve para llegar a una gomería, pero no revisa el interior de la cubierta. El parche (o parche con hongo) se coloca desde adentro, con el neumático desmontado de la llanta, y es la reparación que se considera definitiva.",
  },
  {
    question: "¿Qué pinchaduras no se pueden reparar?",
    answer:
      "Las que están en el flanco o en el hombro del neumático, las de más de unos 6 mm de diámetro, los cortes largos y cualquier daño en la estructura interna. Tampoco se repara una cubierta que rodó mucho tiempo sin aire, porque el flanco se daña por dentro aunque por fuera se vea bien.",
  },
  {
    question: "¿Cuántas veces se puede reparar un neumático?",
    answer:
      "Se puede reparar más de una vez mientras las reparaciones estén separadas entre sí y dentro de la banda de rodamiento. Si hay dos pinchaduras muy cerca una de otra, la gomería suele recomendar el cambio.",
  },
  {
    question: "¿Reparan neumáticos run flat?",
    answer:
      "Depende del fabricante y de cómo se haya manejado después de perder aire. Muchos fabricantes no recomiendan reparar un run flat; consultanos con la medida y el estado de la cubierta antes de decidir.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={5} faqs={FAQS}>
      <p>
        La pinchadura es el motivo más común por el que alguien entra a una gomería, y también el
        servicio donde más se nota la diferencia entre un trabajo bien hecho y uno rápido. Un
        neumático reparado correctamente vuelve a rodar como uno entero; uno reparado a medias puede
        perder aire de nuevo o, peor, fallar en ruta. Acá explicamos cómo se hace bien.
      </p>

      <h2>Parche con hongo: la reparación que se considera definitiva</h2>
      <p>
        El procedimiento correcto empieza por sacar la rueda del auto y desmontar el neumático de la
        llanta. Con la cubierta abierta se revisa el interior completo: la pinchadura que se ve por
        fuera suele ser solo la entrada, y el clavo o tornillo pudo dañar la estructura por dentro
        mientras el auto seguía andando.
      </p>
      <p>
        Si el daño es reparable, se retira el objeto, se limpia y se escarifica la zona interior, se
        rellena el orificio y se pega un parche con hongo que sella tanto el agujero como la tela
        interna. Después se vuelve a armar, se <Link href="/blog/alineacion-y-balanceo">balancea la rueda</Link>{" "}
        y se controla la presión.
      </p>

      <h2>La mecha: un arreglo de emergencia</h2>
      <p>
        La mecha es una tira de goma con pegamento que se introduce desde afuera con la cubierta
        puesta en el auto. Es rápida y alcanza para llegar a una gomería, pero tiene un límite: no
        permite ver el interior del neumático. Por eso la consideramos una solución provisoria, no
        la reparación final. Si te pusieron una mecha en la ruta, conviene pasar por una gomería para
        revisar la cubierta por dentro y, si corresponde, hacer el parche.
      </p>

      <h2>Cuándo no se puede reparar</h2>
      <ul>
        <li>
          <strong>Pinchadura en el flanco o en el hombro.</strong> Esa zona se flexiona todo el
          tiempo y ningún parche aguanta.
        </li>
        <li>
          <strong>Orificios grandes o cortes</strong> (más de unos 6 mm) y cortes largos.
        </li>
        <li>
          <strong>Daño interno visible</strong>: tela quebrada, deformaciones, cables expuestos.
        </li>
        <li>
          <strong>Haber rodado sin aire.</strong> Aunque el agujero sea chico, un neumático que
          anduvo desinflado queda dañado en el flanco y no es seguro.
        </li>
        <li>
          <strong>Dos pinchaduras muy cercanas</strong> o ya reparadas en el mismo lugar.
        </li>
      </ul>
      <p>
        Si la cubierta ya está muy gastada, reparar puede no tener sentido: mirá en{" "}
        <Link href="/herramientas/cuando-cambiar-neumaticos">cuándo cambiar los neumáticos</Link> cómo
        medir el desgaste.
      </p>

      <h2>Qué hacer si pinchás en la calle</h2>
      <ol>
        <li>Frená con suavidad y salí de la calzada; no sigas rodando con la rueda baja.</li>
        <li>Si tenés auxilio, cambiá por la rueda de repuesto y llevá la pinchada a la gomería.</li>
        <li>Si no podés cambiar, llamá a una grúa: manejar unos cientos de metros desinflado puede arruinar la cubierta.</li>
        <li>No saques el clavo o el tornillo antes de llegar: tapona el agujero y ayuda a que no pierda aire.</li>
      </ol>

      <h2>Pinchaduras en nuestra gomería</h2>
      <p>
        En Argüello, Córdoba, revisamos el neumático desmontado y te decimos si se repara o conviene
        cambiarlo. Es un servicio que no es el centro de nuestro trabajo, pero lo hacemos bien porque
        una gomería seria resuelve el problema completo. Podés ver todo lo que hacemos en{" "}
        <Link href="/servicios">servicios</Link> y la guía{" "}
        <Link href="/blog/gomeria-en-cordoba">Gomería en Córdoba</Link>.
      </p>
    </ArticleLayout>
  );
}
