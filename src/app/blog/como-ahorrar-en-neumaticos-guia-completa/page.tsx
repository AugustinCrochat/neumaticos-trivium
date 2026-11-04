import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { Callout } from "@/components/blog/Callout";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-ahorrar-en-neumaticos-guia-completa";
const TITLE = "Cómo ahorrar en neumáticos: la guía completa para gastar menos y que duren más";
const SUBTITLE =
  "Comprar bien, mantener la presión, alinear, rotar y manejar con cabeza: en qué orden conviene hacer cada cosa y cuánto pesa cada una en tu bolsillo.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Guía completa para ahorrar en neumáticos: cómo comprar mejor, qué hábitos y mantenimientos los hacen durar más, qué revisar cada mes y cómo evitar los problemas que salen caros."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es lo que más alarga la vida de un neumático?",
    answer:
      "Mantener la presión correcta. Un neumático desinflado se deforma, se calienta y se gasta de los costados; uno inflado de más se gasta en el centro. Después de la presión vienen el alineado, la rotación y la forma de manejar.",
  },
  {
    question: "¿Es mejor comprar el más barato o el que más dura?",
    answer:
      "Ninguno de los dos por sí solo: lo que importa es lo que cuesta cada kilómetro, que se calcula dividiendo el precio del juego por los kilómetros que rinde. Un neumático económico bien cuidado puede salir más barato por kilómetro que uno caro mal mantenido.",
  },
  {
    question: "¿Cada cuánto conviene revisar los neumáticos?",
    answer:
      "Una vez por mes y antes de cada viaje largo: presión en frío, estado del dibujo y de los flancos. Son cinco minutos y evitan la mayoría de los gastos grandes.",
  },
  {
    question: "¿Vale la pena alinear y balancear si el auto anda bien?",
    answer:
      "Sí, cuando se cambian las cubiertas y cada tanto después, o apenas notes que el auto tira, vibra o se gasta desparejo. El alineado y balanceado es lo más barato que podés hacer para que el juego rinda lo que tiene que rendir.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={9} faqs={FAQS}>
      <p>Los neumáticos son uno de los gastos grandes del auto, y la buena noticia es que gran parte de lo que se gasta de más se puede evitar. No hace falta comprar lo más caro ni lo más barato: hace falta comprar con criterio, cuidarlos con tres o cuatro hábitos simples y no dejar pasar los avisos que dan antes de fallar. Esta guía ordena todo eso en cuatro frentes.</p>

      <Callout title="El orden que más rinde" tone="ok">
      <p>1) Presión correcta, 2) alineado y balanceado al colocar, 3) rotación a tiempo, 4) manejo sin maltrato. Con eso solo ya cubrís la mayor parte del ahorro posible.</p>
      </Callout>

      <h2>1. Comprar mejor</h2>
      <p>El ahorro empieza antes de la gomería. Lo que importa no es el precio de una cubierta sino lo que cuesta cada kilómetro y qué incluye el presupuesto.</p>
      <ul>
      <li><strong>Pensá en costo por kilómetro:</strong> mirá <Link href="/blog/precio-calidad-neumaticos-costo-por-km">cuánto sale realmente cada kilómetro</Link> y probá tus números en la <Link href="/herramientas/costo-por-kilometro">calculadora</Link>.</li>
      <li><strong>Comparar con los mismos criterios:</strong> medida, índices de carga y velocidad, fecha de fabricación y garantía. Hay una lista en <Link href="/blog/como-comparar-neumaticos-antes-de-comprar">7 puntos para no equivocarte</Link>.</li>
      <li><strong>Mirá qué incluye el precio:</strong> colocación, válvulas, balanceo, IVA. Dos presupuestos solo se comparan si incluyen lo mismo: <Link href="/blog/que-incluye-el-presupuesto-de-neumaticos">cómo comparar sin sorpresas</Link>.</li>
      <li><strong>Marca o alternativa:</strong> para uso urbano un buen importado suele alcanzar. Lo explicamos en <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">marca vs. importados</Link> y en <Link href="/blog/cuatro-economicos-o-dos-de-marca">4 económicos o 2 de marca</Link>.</li>
      <li><strong>Desconfiá de los usados:</strong> el ahorro inicial se pierde rápido, como contamos en <Link href="/blog/neumaticos-usados-conviene-comprarlos">neumáticos usados: ¿conviene?</Link></li>
      </ul>

      <h2>2. Hacer que duren</h2>
      <ul>
      <li><strong>Presión:</strong> es lo que más pesa. Usá la etiqueta de la puerta del auto, no el número del flanco: <Link href="/blog/etiqueta-de-presion-puerta-del-auto">cómo leerla</Link> y <Link href="/blog/presion-de-neumaticos">cuánto inflar</Link>.</li>
      <li><strong>Alineado y balanceado:</strong> un auto desalineado come las cubiertas por un costado, y una rueda desbalanceada hace vibrar y se gasta a golpes. Qué es cada cosa y cada cuánto: <Link href="/blog/alineacion-y-balanceo">alineado y balanceado</Link>.</li>
      <li><strong>Rotación:</strong> las ruedas de adelante se gastan más rápido. <Link href="/blog/rotacion-de-neumaticos">Rotarlas</Link> reparte el desgaste.</li>
      <li><strong>Manejo:</strong> frenadas, arranques y cordones también cuentan: <Link href="/blog/habitos-de-manejo-que-gastan-los-neumaticos">hábitos que gastan los neumáticos</Link>.</li>
      <li><strong>Si cambiás de a dos:</strong> los nuevos van atrás, <Link href="/blog/neumaticos-nuevos-adelante-o-atras">por qué</Link>.</li>
      </ul>

      <h2>3. Cuidar y mantener</h2>
      <ul>
      <li>Una <Link href="/blog/revision-mensual-de-neumaticos-en-5-minutos">revisión mensual de 5 minutos</Link> detecta casi todo a tiempo.</li>
      <li>Las válvulas se cambian con la cubierta nueva: <Link href="/blog/cambio-de-valvulas-de-neumaticos">por qué</Link>. Y el nitrógeno no es obligatorio: <Link href="/blog/nitrogeno-en-neumaticos-vale-la-pena">lo que mejora y lo que no</Link>.</li>
      <li>Si guardás cubiertas, hacelo bien: <Link href="/blog/como-guardar-neumaticos">cómo guardar neumáticos</Link>. Y para la limpieza, <Link href="/blog/limpiar-neumaticos-brillo-y-productos">qué productos sirven</Link>.</li>
      <li>Revisá la <Link href="/blog/rueda-de-auxilio-como-revisarla">rueda de auxilio</Link>: el día que la necesitás tiene que estar lista.</li>
      </ul>

      <h2>4. Evitar los problemas que salen caros</h2>
      <ul>
      <li>Un golpe fuerte puede dañar el neumático por dentro: <Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">qué revisar después de un pozo</Link>.</li>
      <li>Una <Link href="/blog/burbuja-en-el-flanco-del-neumatico">burbuja en el flanco</Link> no se arregla: se cambia.</li>
      <li>Si pierde aire sin motivo, <Link href="/blog/neumatico-que-pierde-aire-solo-causas">estas son las causas más comunes</Link>.</li>
      <li>El agua es el peor enemigo de un neumático gastado: <Link href="/blog/aquaplaning-que-es-y-como-evitarlo">aquaplaning</Link>.</li>
      <li>Y la edad cuenta aunque no se use: <Link href="/blog/antiguedad-del-neumatico-codigo-dot">cómo leer el código DOT</Link>. Cuándo cambiarlos: <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cada cuántos kilómetros</Link>.</li>
      <li>Si te pincha en ruta, <Link href="/blog/como-cambiar-una-rueda-paso-a-paso">cómo cambiar la rueda paso a paso</Link>.</li>
      </ul>

      <h2>Cuándo ahorrar y cuándo no</h2>
      <p>Ahorrar no es recortar en lo que protege: la presión, el estado del dibujo y la edad de la cubierta no se negocian. Donde sí se puede ahorrar es en comparar bien, en elegir una marca de relación precio-calidad razonable para el uso real que le das al auto y en hacer el mantenimiento a tiempo, que es mucho más barato que el desgaste que evita.</p>

      <h2>En Neumáticos Trivium</h2>
      <p>Los precios están publicados en el <Link href="/catalogo">catálogo</Link> y, si comprás las cubiertas en el local de Argüello, la colocación y las válvulas van sin cargo. Atendemos por orden de llegada y hacemos <Link href="/servicios/alineacion">alineado</Link> y <Link href="/servicios/balanceo">balanceado</Link> en la misma visita.</p>
      <EquipoHofmann />
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
