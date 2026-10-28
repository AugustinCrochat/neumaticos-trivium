import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-205-60-r16-autos-que-la-usan";
const TITLE = "Neumáticos 205/60 R16: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 25 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Neumáticos 205/60 R16: qué significa, diámetro total (652,4 mm), 25 autos que la usan (Volkswagen T-Cross, Chevrolet Tracker, Nissan Kicks, Peugeot 2008), medidas equivalentes y cómo elegir.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 205/60 R16?",
    answer:
      "En nuestra base de vehículos la llevan 25 modelos, entre ellos Volkswagen T-Cross, Chevrolet Tracker, Nissan Kicks, Peugeot 2008, Renault Sandero Stepway, Volkswagen Nivus. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 205/60 R16?",
    answer:
      "652,4 mm: la llanta de 16 pulgadas (406,4 mm) más dos flancos de 123,00 mm. Da unas 488 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 215/55 R16 en lugar de 205/60 R16?",
    answer:
      "El diámetro total cambia −1,5 %: prácticamente igual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 205/60 R16 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida de los SUV compactos: T-Cross, Nivus, Tracker, Kicks, 2008, EcoSport, Captur y Kardian la usan en varias de sus versiones, junto con la Montana Premier y el Sandero Stepway 2021 en adelante.</p>

      <h2>Qué significa 205/60 R16</h2>
      <ul>
      <li><strong>205:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>60:</strong> altura del flanco, como porcentaje del ancho. Acá son 205 × 60 % = 123,00 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>16:</strong> diámetro de la llanta en pulgadas (406,4 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 406,4 mm de llanta más dos flancos de 123,00 mm: <strong>652,4 mm</strong>, o unas 488 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 205/60 R16</h2>
      <p>De los modelos de nuestra base de vehículos, 25 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/volkswagen-t-cross">Volkswagen T-Cross</Link></td><td>Trendline / Comfortline 2019-presente</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-tracker">Chevrolet Tracker</Link></td><td>LT (Trax-based) 2013-2020</td></tr>
      <tr><td><Link href="/vehiculos/nissan-kicks">Nissan Kicks</Link></td><td>Sense 2017-2024 · Sense 2025-2026</td></tr>
      <tr><td><Link href="/vehiculos/peugeot-2008">Peugeot 2008</Link></td><td>Active / Allure 2016-2023</td></tr>
      <tr><td><Link href="/vehiculos/renault-sandero-stepway">Renault Sandero Stepway</Link></td><td>2021-presente</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-nivus">Volkswagen Nivus</Link></td><td>Comfortline 2020-presente</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-montana">Chevrolet Montana</Link></td><td>Premier 2023-presente</td></tr>
      <tr><td><Link href="/vehiculos/ford-ecosport">Ford EcoSport</Link></td><td>Freestyle / SE Plus 2013-2022</td></tr>
      <tr><td><Link href="/vehiculos/renault-fluence">Renault Fluence</Link></td><td>Confort / Dynamique</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-spin">Chevrolet Spin</Link></td><td>LTZ / Premier</td></tr>
      <tr><td><Link href="/vehiculos/bmw-serie-2">BMW Serie 2</Link></td><td>220i Active Tourer</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-cruze">Chevrolet Cruze</Link></td><td>LT 2011-2016 · LT 2016-2019</td></tr>
      </tbody>
      </table>
      <p>También la usan, según versión: <Link key="citroen-basalt" href="/vehiculos/citroen-basalt">Citroen Basalt</Link>, <Link key="citroen-c4-picasso" href="/vehiculos/citroen-c4-picasso">Citroen C4 Picasso</Link>, <Link key="geely-gx3-pro" href="/vehiculos/geely-gx3-pro">Geely GX3 Pro</Link>, <Link key="haval-h1" href="/vehiculos/haval-h1">Haval H1</Link>, <Link key="mercedes-benz-clase-a" href="/vehiculos/mercedes-benz-clase-a">Mercedes-Benz Clase A</Link>, <Link key="mercedes-benz-clase-b" href="/vehiculos/mercedes-benz-clase-b">Mercedes-Benz Clase B</Link>, <Link key="mitsubishi-lancer" href="/vehiculos/mitsubishi-lancer">Mitsubishi Lancer</Link>, <Link key="nissan-kait" href="/vehiculos/nissan-kait">Nissan Kait</Link>, <Link key="nissan-sentra" href="/vehiculos/nissan-sentra">Nissan Sentra</Link>, <Link key="renault-captur" href="/vehiculos/renault-captur">Renault Captur</Link>, <Link key="renault-kardian" href="/vehiculos/renault-kardian">Renault Kardian</Link>, <Link key="subaru-legacy" href="/vehiculos/subaru-legacy">Subaru Legacy</Link>, <Link key="volkswagen-tera" href="/vehiculos/volkswagen-tera">Volkswagen Tera</Link>.</p>
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>
      <CatalogWidget size={{ width: 205, profile: 60, rim: 16 }} title="205/60 R16 en stock hoy" />

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/215-55-r16">215/55 R16</Link></td><td>642,9 mm</td><td>−1,5 %</td><td>Prácticamente igual</td></tr>
      <tr><td><Link href="/neumaticos/205-55-r16">205/55 R16</Link></td><td>631,9 mm</td><td>−3,1 %</td><td>Fuera de la tolerancia: cambia el velocímetro</td></tr>
      <tr><td><Link href="/neumaticos/215-60-r16">215/60 R16</Link></td><td>664,4 mm</td><td>+1,8 %</td><td>Dentro de la tolerancia habitual</td></tr>
      </tbody>
      </table>
      <p>215/55 R16 es la alternativa más cercana: el diámetro baja un 1,5 % y la banda es más ancha. Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 205/60 R16</h2>
      <p>Son autos más altos y pesados que un hatchback, con mucho uso de ruta y de ciudad. Conviene mirar el índice de carga y velocidad de la etiqueta, y valorar neumáticos con buen agarre en mojado y un dibujo que aguante el mayor peso del vehículo.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/205-60-r16">opciones en 205/60 R16 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-16">rodado 16</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
