import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-elegir-neumaticos-guia-completa";
const TITLE = "Cómo elegir neumáticos: la guía completa para comprar bien";
const SUBTITLE =
  "Los 7 pasos para elegir las cubiertas de tu auto o camioneta sin errores: medida, carga y velocidad, tipo de uso, marca, fecha y cuántos cambiar.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Cómo elegir neumáticos paso a paso: cómo saber tu medida, índice de carga y velocidad, tipo de neumático según el uso, marca o importado, fecha de fabricación y cuántos cambiar. Con enlaces a cada tema."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cómo sé qué neumático le corresponde a mi auto?",
    answer:
      "La medida está en el flanco del neumático que tenés puesto y en la etiqueta del marco de la puerta del conductor. Esa etiqueta indica la medida original, y el manual del auto también. Si no la encontrás, buscá tu modelo en la sección de vehículos del sitio.",
  },
  {
    question: "¿Qué es más importante: la marca o la medida?",
    answer:
      "Primero va la medida, el índice de carga y el de velocidad, porque son los que garantizan que el neumático sea apto para el vehículo. Dentro de eso, la marca define el nivel de prestaciones y de durabilidad, y el precio.",
  },
  {
    question: "¿Conviene cambiar los cuatro neumáticos juntos?",
    answer:
      "Lo ideal es cambiar los cuatro, o al menos los dos de un mismo eje con la misma marca y modelo. Si cambiás solo dos, los nuevos van atrás. El detalle está en las notas enlazadas más abajo.",
  },
  {
    question: "¿Se puede comparar neumáticos solo por precio?",
    answer:
      "No conviene: un neumático más barato que dura menos puede salir más caro por kilómetro. Mirá el costo por kilómetro y no solo el precio de cada cubierta.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-11-04" readingMinutes={8} faqs={FAQS}>
      <p>Elegir neumáticos parece difícil porque hay mucha oferta y mucho dato en el flanco. Pero se resuelve en siete pasos, siempre en el mismo orden: los primeros descartan lo que no sirve para tu vehículo, y los últimos te ayudan a decidir entre lo que sí sirve. Esta guía los recorre y te manda a la nota que desarrolla cada uno.</p>

      <h2>1. Saber tu medida</h2>
      <p>Es el punto de partida. La medida está en el flanco del neumático que tenés puesto, con el formato <strong>205/55 R16</strong>, y también en la etiqueta del marco de la puerta del conductor y en el manual. Si tu auto ya cambió de llanta, lo que vale es lo que lleva montado hoy.</p>
      <ul>
      <li>Cómo se lee cada número: <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</li>
      <li>No sabés cuál es: buscala por marca y modelo en <Link href="/vehiculos">neumáticos por vehículo</Link> o mirá las <Link href="/neumaticos">medidas más buscadas</Link>.</li>
      <li>Si querés usar otra medida: <Link href="/blog/equivalencias">equivalencias de neumáticos</Link>, siempre dentro del 3 % de diferencia de diámetro.</li>
      </ul>

      <h2>2. Respetar el índice de carga y de velocidad</h2>
      <p>Después de la medida figuran dos códigos, por ejemplo <strong>91V</strong>: el primero es cuánto peso soporta cada neumático y el segundo, a qué velocidad máxima está certificado. Nunca conviene bajar de lo que indica la etiqueta de tu auto; en una camioneta o un utilitario cargado, todavía menos.</p>
      <p>Más detalle en <Link href="/blog/indice-de-carga-y-velocidad">índice de carga y velocidad</Link> y en la <Link href="/herramientas/indice-carga-velocidad">calculadora de índices</Link>.</p>

      <h2>3. Elegir el tipo según cómo usás el vehículo</h2>
      <table>
      <thead><tr><th>Uso</th><th>Qué mirar</th></tr></thead>
      <tbody>
      <tr><td>Auto de ciudad y ruta</td><td>Neumático de calle: durabilidad, mojado y confort. Ver <Link href="/neumaticos-baratos">neumáticos económicos</Link> y las <Link href="/blog/neumaticos-economicos-para-uso-urbano">notas de uso urbano</Link>.</td></tr>
      <tr><td>Camioneta de asfalto</td><td>H/T: silencioso y cómodo.</td></tr>
      <tr><td>Camioneta que sale a tierra</td><td>A/T: más agarre fuera del asfalto. Comparación en <Link href="/blog/at-o-ht-cual-conviene-para-tu-camioneta">A/T o H/T</Link>.</td></tr>
      <tr><td>Utilitario o furgón</td><td>Neumático de carga (C): <Link href="/blog/neumatico-c-o-de-auto-utilitario">cuándo lo necesitás</Link>.</td></tr>
      <tr><td>Perfil bajo</td><td>Más respuesta y menos confort: <Link href="/blog/perfil-bajo-o-perfil-alto">perfil bajo o alto</Link>.</td></tr>
      </tbody>
      </table>

      <h2>4. Decidir entre marca e importado</h2>
      <p>Una vez que la medida y los índices coinciden, queda elegir el nivel. Las marcas premium suelen ofrecer más prestaciones y una trayectoria larga; las importadas homologadas cuestan bastante menos y son una buena opción para uso urbano y kilometraje moderado. No hay una respuesta única: depende de cuánto manejás y de qué exigís.</p>
      <ul>
      <li>La comparación completa: <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene">neumáticos de marca vs. importados</Link>.</li>
      <li>Cómo evaluar uno importado: <Link href="/blog/como-elegir-neumatico-importado-seguro">checklist de 8 puntos</Link>.</li>
      <li>Para comparar de forma ordenada: <Link href="/blog/como-comparar-neumaticos-antes-de-comprar">cómo comparar antes de comprar</Link>.</li>
      </ul>

      <h2>5. Mirar el costo por kilómetro, no solo el precio</h2>
      <p>Un neumático más barato que dura menos puede terminar costando más. Dividí el precio por los kilómetros esperados y vas a ver la diferencia real. La <Link href="/herramientas/costo-por-kilometro">calculadora de costo por kilómetro</Link> lo hace por vos, y la nota <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link> explica cómo leer el resultado.</p>

      <h2>6. Revisar la fecha de fabricación</h2>
      <p>Un neumático envejece aunque no ruede. Los últimos cuatro dígitos del código DOT indican semana y año de fabricación. Preguntá siempre cuál es la fecha de los que te ofrecen: <Link href="/blog/antiguedad-del-neumatico-codigo-dot">cómo leer el código DOT</Link>.</p>

      <h2>7. Decidir cuántos cambiar</h2>
      <p>Lo ideal es cambiar los cuatro. Si el presupuesto no alcanza, cambiá dos del mismo eje y poné los nuevos atrás. Las notas que lo desarrollan:</p>
      <ul>
      <li><Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">¿Se puede cambiar un solo neumático?</Link></li>
      <li><Link href="/blog/cuatro-economicos-o-dos-de-marca">¿Cuatro económicos o dos de marca?</Link></li>
      <li><Link href="/blog/neumaticos-nuevos-adelante-o-atras">Neumáticos nuevos: ¿adelante o atrás?</Link></li>
      </ul>

      <h2>Antes de pagar: qué tiene que incluir el presupuesto</h2>
      <p>Comparar solo el precio de la cubierta engaña. Fijate si incluye colocación, válvulas, balanceo y alineado: <Link href="/blog/que-incluye-el-presupuesto-de-neumaticos">qué incluye un presupuesto de neumáticos</Link>. En Trivium la colocación es sin cargo; si querés repasar todo el gasto, mirá <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">cómo ahorrar en neumáticos</Link>.</p>
      <p>Cuando tengas tu medida, <Link href="/neumaticos">buscala acá</Link> y ves el stock y el precio al instante.</p>
    </ArticleLayout>
  );
}
