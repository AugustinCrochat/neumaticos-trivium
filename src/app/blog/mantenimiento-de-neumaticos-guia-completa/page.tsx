import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "mantenimiento-de-neumaticos-guia-completa";
const TITLE = "Mantenimiento de neumáticos: la guía completa, con calendario";
const SUBTITLE =
  "Qué revisar cada mes, cada 10.000 km y antes de cada viaje para que las cubiertas duren más, el auto frene mejor y gaste menos.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Guía completa de mantenimiento de neumáticos: presión, rotación, alineado y balanceado, revisión de desgaste y antigüedad. Calendario por mes y por kilómetros."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cada cuánto hay que revisar los neumáticos?",
    answer:
      "La presión y una mirada general, una vez por mes y antes de cada viaje largo. Alineado, balanceado y rotación, como referencia cada 10.000 km o una vez por año, lo que ocurra primero.",
  },
  {
    question: "¿Qué es lo más importante del mantenimiento?",
    answer:
      "La presión. Es gratis, lleva cinco minutos y es lo que más influye en la duración, el consumo y la frenada. Se mide en frío, con el valor de la etiqueta del auto.",
  },
  {
    question: "¿La rotación realmente alarga la vida de las cubiertas?",
    answer:
      "Sí. Las ruedas delanteras y traseras se gastan distinto; cambiarlas de posición empareja el desgaste y hace que las cuatro lleguen juntas al final de su vida útil.",
  },
  {
    question: "¿Cuándo hay que cambiar los neumáticos aunque tengan dibujo?",
    answer:
      "Cuando la goma envejeció: grietas en el flanco o entre los tacos, o varios años desde la fecha de fabricación. También ante una burbuja o un corte en el flanco, que no tienen reparación.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Mantenimiento" date="2026-12-10" readingMinutes={7} faqs={FAQS}>
      <p>Un juego de neumáticos puede durar bastante más o bastante menos de lo previsto según cómo se lo cuide. Casi todo el mantenimiento es barato o directamente gratis; lo caro es no hacerlo. Esta guía ordena todo por frecuencia y enlaza a la nota que desarrolla cada punto.</p>

      <h2>El calendario</h2>
      <table>
        <thead><tr><th>Cuándo</th><th>Qué hacer</th></tr></thead>
        <tbody>
          <tr><td>Una vez por mes</td><td>Presión en frío, mirada a flancos y dibujo</td></tr>
          <tr><td>Cada 10.000 km o un año</td><td>Rotación, alineado y balanceado</td></tr>
          <tr><td>Después de un golpe fuerte</td><td>Revisar cubierta y llanta; alinear</td></tr>
          <tr><td>Antes de un viaje largo</td><td>Presión con carga, rueda de auxilio, estado general</td></tr>
          <tr><td>Al cambiar las cubiertas</td><td>Válvulas nuevas, balanceado y alineado</td></tr>
          <tr><td>Una vez por año</td><td>Antigüedad y grietas de la goma</td></tr>
        </tbody>
      </table>

      <h2>1. Presión: lo primero y lo más fácil</h2>
      <p>La presión baja sola con el tiempo, aunque no haya ninguna pinchadura. Con poca presión el neumático se gasta por los bordes, se calienta, alarga la frenada y hace gastar más combustible. Se mide en frío y con el valor que indica el fabricante del auto, no el del flanco de la cubierta.</p>
      <ul>
        <li><Link href="/blog/presion-de-neumaticos">Cuánto inflar y cómo medir</Link>, y dónde está el dato: <Link href="/blog/etiqueta-de-presion-puerta-del-auto">la etiqueta de la puerta</Link>.</li>
        <li>Si tu auto tiene testigo en el tablero: <Link href="/blog/sensor-de-presion-tpms-que-es-y-que-hacer-si-se-prende">qué es el sensor de presión (TPMS)</Link>.</li>
        <li>Si una rueda baja siempre: <Link href="/blog/neumatico-que-pierde-aire-solo-causas">por qué pierde aire sola</Link>.</li>
        <li>La calculadora de <Link href="/herramientas/presion-neumaticos">presión según carga</Link>.</li>
      </ul>

      <h2>2. La revisión mensual</h2>
      <p>Cinco minutos alcanzan para ver lo que importa: profundidad del dibujo, desgaste parejo o no, cortes y deformaciones en los flancos, y que no falte ninguna tapita de válvula. El paso a paso está en <Link href="/blog/revision-mensual-de-neumaticos-en-5-minutos">la revisión mensual en 5 minutos</Link>.</p>
      <p>Si el desgaste no es parejo, la forma indica la causa: <Link href="/blog/desgaste-irregular-de-neumaticos">cómo leer el desgaste irregular</Link>. Y una deformación en el costado no se negocia: <Link href="/blog/burbuja-en-el-flanco-del-neumatico">burbuja en el flanco</Link>.</p>

      <h2>3. Rotación, alineado y balanceado</h2>
      <p>Son tres trabajos distintos que conviene hacer juntos. La <strong>rotación</strong> cambia las ruedas de posición para emparejar el desgaste. El <strong>alineado</strong> corrige los ángulos para que rueden derecho. El <strong>balanceado</strong> reparte el peso de cada rueda para que no vibre.</p>
      <ul>
        <li><Link href="/blog/rotacion-de-neumaticos">Cómo y cada cuánto rotar</Link>.</li>
        <li><Link href="/blog/cada-cuantos-km-alinear-y-balancear">Cada cuántos kilómetros alinear y balancear</Link>, y las situaciones que lo adelantan.</li>
        <li><Link href="/blog/sintomas-alineacion-balanceo-o-rotacion">Cómo saber cuál de los tres necesita tu auto</Link>.</li>
        <li><Link href="/blog/balanceo-dinamico-vs-estatico-diferencias">Balanceo dinámico y estático: la diferencia</Link>.</li>
      </ul>
      <p>En el taller los tres van en el mismo servicio: el <Link href="/servicios/combo-alineado-y-balanceado">combo de alineado y balanceado</Link> incluye la rotación y se hace por orden de llegada, sin turno.</p>

      <h2>4. Lo que no es del neumático, pero lo gasta</h2>
      <p>Hay desgaste que ninguna gomería puede corregir desde la rueda, porque viene de la suspensión o de la forma de manejar.</p>
      <ul>
        <li><Link href="/blog/amortiguadores-gastados-como-afectan-a-los-neumaticos">Amortiguadores gastados</Link>: el desgaste en copas.</li>
        <li><Link href="/blog/tren-delantero-con-juego-por-que-no-se-puede-alinear">Tren delantero con juego</Link>: por qué el alineado no dura.</li>
        <li><Link href="/blog/habitos-de-manejo-que-gastan-los-neumaticos">Hábitos de manejo</Link> que acortan la vida de las cubiertas.</li>
        <li><Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">Qué revisar después de un pozo</Link>.</li>
      </ul>

      <h2>5. Antes de salir a la ruta</h2>
      <p>Con el auto cargado cambia la presión que corresponde, y un problema chico en ciudad se vuelve serio a 120 km/h durante horas.</p>
      <ul>
        <li><Link href="/blog/revision-antes-de-viajar-neumaticos">La revisión antes de viajar</Link>.</li>
        <li><Link href="/blog/neumaticos-en-verano-calor-presion-y-ruta">Neumáticos en verano: calor, presión y ruta</Link>.</li>
        <li><Link href="/blog/rueda-de-auxilio-como-revisarla">La rueda de auxilio</Link>, que casi nadie revisa.</li>
      </ul>

      <h2>6. Cuándo ya no alcanza con mantener</h2>
      <p>El mantenimiento estira la vida útil, no la hace infinita. Hay tres límites: el dibujo, la edad de la goma y los daños.</p>
      <ul>
        <li><Link href="/blog/cada-cuantos-km-cambiar-neumaticos">Cada cuántos kilómetros cambiar los neumáticos</Link>.</li>
        <li><Link href="/blog/neumaticos-gastados-cuanto-mas-tarda-en-frenar-el-auto">Por qué un neumático gastado frena peor con lluvia</Link>.</li>
        <li><Link href="/blog/antiguedad-del-neumatico-codigo-dot">Cómo leer la fecha de fabricación</Link>.</li>
        <li>La herramienta <Link href="/herramientas/cuando-cambiar-neumaticos">¿cuándo cambiar mis neumáticos?</Link>.</li>
      </ul>
      <p>Cuando llegue ese momento, <Link href="/neumaticos">buscá tu medida</Link>: vas a ver precio y stock, y los colocamos con válvulas nuevas sin cargo. Y para que el juego nuevo dure, <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">la guía para ahorrar en neumáticos</Link> hace la cuenta completa.</p>
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
