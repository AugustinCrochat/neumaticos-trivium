import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-175-65-r14-autos-que-la-usan";
const TITLE = "Neumáticos 175/65 R14: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 19 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Neumáticos 175/65 R14: qué significa, diámetro total (583,1 mm), 19 autos que la usan (Citroen C3, Fiat Mobi, Volkswagen Gol, Renault Clio), medidas equivalentes y cómo elegir.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 175/65 R14?",
    answer:
      "En nuestra base de vehículos la llevan 19 modelos, entre ellos Citroen C3, Fiat Mobi, Volkswagen Gol, Renault Clio, Peugeot 206, Fiat Uno. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 175/65 R14?",
    answer:
      "583,1 mm: la llanta de 14 pulgadas (355,6 mm) más dos flancos de 113,75 mm. Da unas 546 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 185/60 R14 en lugar de 175/65 R14?",
    answer:
      "El diámetro total cambia −0,9 %: prácticamente igual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 175/65 R14 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida de los autos chicos de entrada: Fiat Mobi, Uno Way, Grand Siena, Ford Ka, Citroën C3 de primera generación, Clio, Celta, Gol de la generación 3, Etios y Peugeot 206 en sus versiones base.</p>

      <h2>Qué significa 175/65 R14</h2>
      <ul>
      <li><strong>175:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>65:</strong> altura del flanco, como porcentaje del ancho. Acá son 175 × 65 % = 113,75 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>14:</strong> diámetro de la llanta en pulgadas (355,6 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 355,6 mm de llanta más dos flancos de 113,75 mm: <strong>583,1 mm</strong>, o unas 546 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 175/65 R14</h2>
      <p>De los modelos de nuestra base de vehículos, 19 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/citroen-c3">Citroen C3</Link></td><td>Base 2003-2009</td></tr>
      <tr><td><Link href="/vehiculos/fiat-mobi">Fiat Mobi</Link></td><td>Easy / Like 2017-2021 · Trekking 2022-presente</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-gol">Volkswagen Gol</Link></td><td>Power / GTi 1999-2005</td></tr>
      <tr><td><Link href="/vehiculos/renault-clio">Renault Clio</Link></td><td>RT / Authentique / Dynamique 2000-2013</td></tr>
      <tr><td><Link href="/vehiculos/peugeot-206">Peugeot 206</Link></td><td>XR / XS</td></tr>
      <tr><td><Link href="/vehiculos/fiat-uno">Fiat Uno</Link></td><td>Way / Attractive 2010-2021</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-celta">Chevrolet Celta</Link></td><td>LT</td></tr>
      <tr><td><Link href="/vehiculos/ford-ka">Ford Ka</Link></td><td>Base / S 2008-2014 · S / SE 2015-2021</td></tr>
      <tr><td><Link href="/vehiculos/renault-megane">Renault Megane</Link></td><td>RN / RL 1996-2010</td></tr>
      <tr><td><Link href="/vehiculos/toyota-etios">Toyota Etios</Link></td><td>X</td></tr>
      <tr><td><Link href="/vehiculos/citroen-berlingo">Citroen Berlingo</Link></td><td>Furgón</td></tr>
      <tr><td><Link href="/vehiculos/faw-n5">FAW N5</Link></td><td>Varias versiones</td></tr>
      </tbody>
      </table>
      <p>También la usan, según versión: <Link key="fiat-grand-siena" href="/vehiculos/fiat-grand-siena">Fiat Grand Siena</Link>, <Link key="fiat-uno-way" href="/vehiculos/fiat-uno-way">Fiat Uno Way</Link>, <Link key="geely-lc-cross" href="/vehiculos/geely-lc-cross">Geely LC Cross</Link>, <Link key="peugeot-partner" href="/vehiculos/peugeot-partner">Peugeot Partner</Link>, <Link key="renault-clio-mio" href="/vehiculos/renault-clio-mio">Renault Clio Mio</Link>, <Link key="suzuki-fun" href="/vehiculos/suzuki-fun">Suzuki Fun</Link>, <Link key="suzuki-swift" href="/vehiculos/suzuki-swift">Suzuki Swift</Link>.</p>
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>
      <CatalogWidget size={{ width: 175, profile: 65, rim: 14 }} title="175/65 R14 en stock hoy" />

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/185-60-r14">185/60 R14</Link></td><td>577,6 mm</td><td>−0,9 %</td><td>Prácticamente igual</td></tr>
      <tr><td><Link href="/neumaticos/175-70-r14">175/70 R14</Link></td><td>600,6 mm</td><td>+3,0 %</td><td>Fuera de la tolerancia: cambia el velocímetro</td></tr>
      <tr><td><Link href="/neumaticos/165-70-r14">165/70 R14</Link></td><td>586,6 mm</td><td>+0,6 %</td><td>Prácticamente igual</td></tr>
      </tbody>
      </table>
      <p>Como el perfil es medio-alto y el rodado 14, no hace falta cambiar de medida: hay mucha oferta en esta misma. Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 175/65 R14</h2>
      <p>Son autos económicos de uso diario, así que es una medida donde se busca un precio razonable por juego de cuatro. Lo recomendable es no bajar de una marca homologada y revisar la edad del neumático (código DOT) en las ofertas.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/175-65-r14">opciones en 175/65 R14 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-14">rodado 14</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
