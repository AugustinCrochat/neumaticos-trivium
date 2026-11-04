import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-185-60-r15-autos-que-la-usan";
const TITLE = "Neumáticos 185/60 R15: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 22 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Neumáticos 185/60 R15: qué significa, diámetro total (603,0 mm), 22 autos que la usan (Fiat Cronos, Citroen C3, Chevrolet Montana, Fiat Palio), medidas equivalentes y cómo elegir."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 185/60 R15?",
    answer:
      "En nuestra base de vehículos la llevan 22 modelos, entre ellos Fiat Cronos, Citroen C3, Chevrolet Montana, Fiat Palio, Peugeot 206, Peugeot 207. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 185/60 R15?",
    answer:
      "603,0 mm: la llanta de 15 pulgadas (381,0 mm) más dos flancos de 111,00 mm. Da unas 528 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 195/55 R15 en lugar de 185/60 R15?",
    answer:
      "El diámetro total cambia −1,2 %: prácticamente igual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 185/60 R15 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida de las versiones medias de varios compactos: Cronos Like y Drive, Palio Essence, Siena Essence, Suran, 207, Etios, Idea, Meriva, Agile, la Montana 2010-2021 y los HB20 más nuevos.</p>

      <h2>Qué significa 185/60 R15</h2>
      <ul>
      <li><strong>185:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>60:</strong> altura del flanco, como porcentaje del ancho. Acá son 185 × 60 % = 111,00 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>15:</strong> diámetro de la llanta en pulgadas (381,0 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 381,0 mm de llanta más dos flancos de 111,00 mm: <strong>603,0 mm</strong>, o unas 528 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 185/60 R15</h2>
      <p>De los modelos de nuestra base de vehículos, 22 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/fiat-cronos">Fiat Cronos</Link></td><td>Like / Drive 1.3 2018-presente</td></tr>
      <tr><td><Link href="/vehiculos/citroen-c3">Citroen C3</Link></td><td>Origine / Tendance 2012-2017</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-montana">Chevrolet Montana</Link></td><td>LS / LT 2010-2021</td></tr>
      <tr><td><Link href="/vehiculos/fiat-palio">Fiat Palio</Link></td><td>Essence / Sporting 2004-2017</td></tr>
      <tr><td><Link href="/vehiculos/peugeot-206">Peugeot 206</Link></td><td>XS / XT / GTI</td></tr>
      <tr><td><Link href="/vehiculos/peugeot-207">Peugeot 207</Link></td><td>Allure / Feline</td></tr>
      <tr><td><Link href="/vehiculos/fiat-siena">Fiat Siena</Link></td><td>Essence / HLX 2004-2013</td></tr>
      <tr><td><Link href="/vehiculos/fiat-palio-weekend">Fiat Palio Weekend</Link></td><td>Essence 2004-2017</td></tr>
      <tr><td><Link href="/vehiculos/toyota-etios">Toyota Etios</Link></td><td>XS / XLS</td></tr>
      <tr><td><Link href="/vehiculos/fiat-idea">Fiat Idea</Link></td><td>Essence / HLX 2010-2016</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-meriva">Chevrolet Meriva</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-suran">Volkswagen Suran</Link></td><td>Trendline / Comfortline 2006-2017</td></tr>
      </tbody>
      </table>
      <p>También la usan, según versión: <Link key="chevrolet-agile" href="/vehiculos/chevrolet-agile">Chevrolet Agile</Link>, <Link key="fiat-grand-siena" href="/vehiculos/fiat-grand-siena">Fiat Grand Siena</Link>, <Link key="ford-fiesta-kinetic" href="/vehiculos/ford-fiesta-kinetic">Ford Fiesta Kinetic</Link>, <Link key="geely-515" href="/vehiculos/geely-515">Geely 515</Link>, <Link key="hyundai-hb20" href="/vehiculos/hyundai-hb20">Hyundai HB20</Link>, <Link key="hyundai-hb20-sed-n" href="/vehiculos/hyundai-hb20-sed-n">Hyundai HB20 Sedán</Link>, <Link key="nissan-march" href="/vehiculos/nissan-march">Nissan March</Link>, <Link key="peugeot-207-compact" href="/vehiculos/peugeot-207-compact">Peugeot 207 Compact</Link>, <Link key="toyota-yaris" href="/vehiculos/toyota-yaris">Toyota Yaris</Link>, <Link key="volkswagen-up" href="/vehiculos/volkswagen-up">Volkswagen Up!</Link>.</p>
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>
      <CatalogWidget size={{ width: 185, profile: 60, rim: 15 }} title="185/60 R15 en stock hoy" />

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/195-55-r15">195/55 R15</Link></td><td>595,5 mm</td><td>−1,2 %</td><td>Prácticamente igual</td></tr>
      <tr><td><Link href="/neumaticos/185-65-r15">185/65 R15</Link></td><td>621,5 mm</td><td>+3,1 %</td><td>Fuera de la tolerancia: cambia el velocímetro</td></tr>
      <tr><td><Link href="/neumaticos/195-60-r15">195/60 R15</Link></td><td>615,0 mm</td><td>+2,0 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/175-65-r15">175/65 R15</Link></td><td>608,5 mm</td><td>+0,9 %</td><td>Prácticamente igual</td></tr>
      </tbody>
      </table>
      <p>Es común confundirla con 185/65 R15: la diferencia de diámetro es de alrededor del 3 %, así que no se pueden intercambiar sin pensar: mirá siempre el flanco antes de comprar. Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 185/60 R15</h2>
      <p>Son autos de uso mixto, con mucho kilometraje de ruta además de ciudad. Es una medida con buena oferta; si el auto tiene años, conviene una alineación y un balanceo al estrenar el juego.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/185-60-r15">opciones en 185/60 R15 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-15">rodado 15</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
