import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-185-65-r15-autos-que-la-usan";
const TITLE = "Neumáticos 185/65 R15: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 24 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Neumáticos 185/65 R15: qué significa, diámetro total (621,5 mm), 24 autos que la usan (Peugeot 208, Chevrolet Onix, Chevrolet Onix Plus, Citroen C3), medidas equivalentes y cómo elegir.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 185/65 R15?",
    answer:
      "En nuestra base de vehículos la llevan 24 modelos, entre ellos Peugeot 208, Chevrolet Onix, Chevrolet Onix Plus, Citroen C3, Renault Sandero, Chevrolet Montana. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 185/65 R15?",
    answer:
      "621,5 mm: la llanta de 15 pulgadas (381,0 mm) más dos flancos de 120,25 mm. Da unas 512 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 195/60 R15 en lugar de 185/65 R15?",
    answer:
      "El diámetro total cambia −1,0 %: prácticamente igual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 185/65 R15 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida de los compactos actuales más vendidos: la usan versiones de entrada y medias del Onix, el Onix Plus, el 208, el Polo, el Sandero, el Logan, el Argo, el Virtus y la Montana, entre otros.</p>

      <h2>Qué significa 185/65 R15</h2>
      <ul>
      <li><strong>185:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>65:</strong> altura del flanco, como porcentaje del ancho. Acá son 185 × 65 % = 120,25 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>15:</strong> diámetro de la llanta en pulgadas (381,0 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 381,0 mm de llanta más dos flancos de 120,25 mm: <strong>621,5 mm</strong>, o unas 512 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 185/65 R15</h2>
      <p>De los modelos de nuestra base de vehículos, 24 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/peugeot-208">Peugeot 208</Link></td><td>Like</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-onix">Chevrolet Onix</Link></td><td>LT 2012-2019 · LT 2019-presente</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-onix-plus">Chevrolet Onix Plus</Link></td><td>LT 2020-presente</td></tr>
      <tr><td><Link href="/vehiculos/citroen-c3">Citroen C3</Link></td><td>Live / Feel 2024-presente</td></tr>
      <tr><td><Link href="/vehiculos/renault-sandero">Renault Sandero</Link></td><td>Privilege 2008-2014 · Life / Zen / Intens 2014-presente</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-montana">Chevrolet Montana</Link></td><td>LS / LT 2023-presente</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-polo">Volkswagen Polo</Link></td><td>Track / Trendline 2018-presente</td></tr>
      <tr><td><Link href="/vehiculos/renault-logan">Renault Logan</Link></td><td>Privilege 2007-2014 · Life / Zen / Intens 2014-presente</td></tr>
      <tr><td><Link href="/vehiculos/fiat-argo">Fiat Argo</Link></td><td>Drive 1.3 2017-2023 · Drive 1.3 2023-presente</td></tr>
      <tr><td><Link href="/vehiculos/renault-megane">Renault Megane</Link></td><td>RT / RXE 1996-2010</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-prisma">Chevrolet Prisma</Link></td><td>LT 2013-2019</td></tr>
      <tr><td><Link href="/vehiculos/renault-symbol">Renault Symbol</Link></td><td>Privilege / Luxe</td></tr>
      </tbody>
      </table>
      <p>También la usan, según versión: <Link key="citroen-berlingo" href="/vehiculos/citroen-berlingo">Citroen Berlingo</Link>, <Link key="citroen-xsara-picasso" href="/vehiculos/citroen-xsara-picasso">Citroen Xsara Picasso</Link>, <Link key="fiat-punto" href="/vehiculos/fiat-punto">Fiat Punto</Link>, <Link key="jac-j4" href="/vehiculos/jac-j4">JAC J4</Link>, <Link key="kia-rio" href="/vehiculos/kia-rio">Kia Rio</Link>, <Link key="nissan-livina" href="/vehiculos/nissan-livina">Nissan Livina</Link>, <Link key="nissan-note" href="/vehiculos/nissan-note">Nissan Note</Link>, <Link key="nissan-versa" href="/vehiculos/nissan-versa">Nissan Versa</Link>, <Link key="peugeot-301" href="/vehiculos/peugeot-301">Peugeot 301</Link>, <Link key="peugeot-partner" href="/vehiculos/peugeot-partner">Peugeot Partner</Link>, <Link key="volkswagen-polo-track" href="/vehiculos/volkswagen-polo-track">Volkswagen Polo Track</Link>, <Link key="volkswagen-virtus" href="/vehiculos/volkswagen-virtus">Volkswagen Virtus</Link>.</p>
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>
      <CatalogWidget size={{ width: 185, profile: 65, rim: 15 }} title="185/65 R15 en stock hoy" />

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/195-60-r15">195/60 R15</Link></td><td>615,0 mm</td><td>−1,0 %</td><td>Prácticamente igual</td></tr>
      <tr><td><Link href="/neumaticos/175-70-r15">175/70 R15</Link></td><td>626,0 mm</td><td>+0,7 %</td><td>Prácticamente igual</td></tr>
      <tr><td><Link href="/neumaticos/195-65-r15">195/65 R15</Link></td><td>634,5 mm</td><td>+2,1 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/195-55-r16">195/55 R16</Link> (rodado 16)</td><td>620,9 mm</td><td>−0,1 %</td><td>Prácticamente igual</td></tr>
      </tbody>
      </table>
      <p>Quien quiere más aspecto deportivo suele pasar a 195/55 R16, que mantiene casi el mismo diámetro (diferencia menor al 1 %). Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 185/65 R15</h2>
      <p>Como los autos que la usan son sobre todo de uso diario urbano, conviene priorizar durabilidad y confort de marcha. Es una medida con muchísima oferta y buenos precios en alternativas económicas homologadas.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/185-65-r15">opciones en 185/65 R15 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-15">rodado 15</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
