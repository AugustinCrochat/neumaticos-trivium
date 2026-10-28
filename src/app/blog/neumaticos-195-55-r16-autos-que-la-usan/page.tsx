import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-195-55-r16-autos-que-la-usan";
const TITLE = "Neumáticos 195/55 R16: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 21 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Neumáticos 195/55 R16: qué significa, diámetro total (620,9 mm), 21 autos que la usan (Fiat Cronos, Peugeot 208, Chevrolet Onix, Chevrolet Onix Plus), medidas equivalentes y cómo elegir.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 195/55 R16?",
    answer:
      "En nuestra base de vehículos la llevan 21 modelos, entre ellos Fiat Cronos, Peugeot 208, Chevrolet Onix, Chevrolet Onix Plus, Citroen C3, Renault Sandero. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 195/55 R16?",
    answer:
      "620,9 mm: la llanta de 16 pulgadas (406,4 mm) más dos flancos de 107,25 mm. Da unas 513 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 205/55 R16 en lugar de 195/55 R16?",
    answer:
      "El diámetro total cambia +1,8 %: dentro de la tolerancia habitual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 195/55 R16 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida de las versiones superiores de los compactos nuevos: la llevan el Onix y el Onix Plus en Premier, el Cronos Precision, el Polo Highline, el Argo HGT y el Sandero Intens Plus, entre otros. Es la hermana deportiva de la 185/65 R15.</p>

      <h2>Qué significa 195/55 R16</h2>
      <ul>
      <li><strong>195:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>55:</strong> altura del flanco, como porcentaje del ancho. Acá son 195 × 55 % = 107,25 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>16:</strong> diámetro de la llanta en pulgadas (406,4 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 406,4 mm de llanta más dos flancos de 107,25 mm: <strong>620,9 mm</strong>, o unas 513 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 195/55 R16</h2>
      <p>De los modelos de nuestra base de vehículos, 21 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/fiat-cronos">Fiat Cronos</Link></td><td>Precision 1.8 2018-presente</td></tr>
      <tr><td><Link href="/vehiculos/peugeot-208">Peugeot 208</Link></td><td>Active / Allure</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-onix">Chevrolet Onix</Link></td><td>LTZ 2012-2019 · Premier 2019-presente</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-onix-plus">Chevrolet Onix Plus</Link></td><td>LTZ / Premier 2020-presente</td></tr>
      <tr><td><Link href="/vehiculos/citroen-c3">Citroen C3</Link></td><td>Exclusive 2012-2017</td></tr>
      <tr><td><Link href="/vehiculos/renault-sandero">Renault Sandero</Link></td><td>RS / Intens Plus 2014-presente</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-montana">Chevrolet Montana</Link></td><td>LTZ 2010-2021</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-polo">Volkswagen Polo</Link></td><td>Comfortline / Highline 2018-presente</td></tr>
      <tr><td><Link href="/vehiculos/renault-kangoo">Renault Kangoo</Link></td><td>Stepway 2010-2021</td></tr>
      <tr><td><Link href="/vehiculos/fiat-argo">Fiat Argo</Link></td><td>Precision / HGT 2017-2023 · Precision / HGT 2023-presente</td></tr>
      <tr><td><Link href="/vehiculos/ford-fiesta">Ford Fiesta</Link></td><td>SE / Titanium 2018-2021</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-prisma">Chevrolet Prisma</Link></td><td>LTZ / Premier 2013-2019</td></tr>
      </tbody>
      </table>
      <p>También la usan, según versión: <Link key="volkswagen-suran" href="/vehiculos/volkswagen-suran">Volkswagen Suran</Link>, <Link key="alfa-romeo-mito" href="/vehiculos/alfa-romeo-mito">Alfa Romeo Mito</Link>, <Link key="chevrolet-agile" href="/vehiculos/chevrolet-agile">Chevrolet Agile</Link>, <Link key="fiat-punto" href="/vehiculos/fiat-punto">Fiat Punto</Link>, <Link key="hyundai-hb20" href="/vehiculos/hyundai-hb20">Hyundai HB20</Link>, <Link key="mini-cooper" href="/vehiculos/mini-cooper">Mini Cooper</Link>, <Link key="nissan-note" href="/vehiculos/nissan-note">Nissan Note</Link>, <Link key="peugeot-301" href="/vehiculos/peugeot-301">Peugeot 301</Link>, <Link key="volkswagen-virtus" href="/vehiculos/volkswagen-virtus">Volkswagen Virtus</Link>.</p>
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/205-55-r16">205/55 R16</Link></td><td>631,9 mm</td><td>+1,8 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/195-60-r16">195/60 R16</Link></td><td>640,4 mm</td><td>+3,1 %</td><td>Fuera de la tolerancia: cambia el velocímetro</td></tr>
      <tr><td><Link href="/neumaticos/205-50-r16">205/50 R16</Link></td><td>611,4 mm</td><td>−1,5 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/205-45-r17">205/45 R17</Link> (rodado 17)</td><td>616,3 mm</td><td>−0,7 %</td><td>Prácticamente igual</td></tr>
      </tbody>
      </table>
      <p>Si querés llanta más grande, 205/45 R17 mantiene el diámetro con una diferencia menor al 1 %, pero hay que confirmar que la llanta nueva sea del ancho correcto. Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 195/55 R16</h2>
      <p>Al ser rodado 16 con perfil 55, el flanco es más bajo: el auto responde más fino en curva, pero castiga más los pozos. Conviene cuidar la presión y revisar los flancos después de golpes fuertes.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/195-55-r16">opciones en 195/55 R16 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-16">rodado 16</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
