import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-265-65-r17-autos-que-la-usan";
const TITLE = "Neumáticos 265/65 R17: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 11 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Neumáticos 265/65 R17: qué significa, diámetro total (776,3 mm), 11 autos que la usan (Toyota Hilux, Ford Ranger, BAIC BJ40, Fiat Titano), medidas equivalentes y cómo elegir."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 265/65 R17?",
    answer:
      "En nuestra base de vehículos la llevan 11 modelos, entre ellos Toyota Hilux, Ford Ranger, BAIC BJ40, Fiat Titano, Foton Tunland, JMC Grand Avenue. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 265/65 R17?",
    answer:
      "776,3 mm: la llanta de 17 pulgadas (431,8 mm) más dos flancos de 172,25 mm. Da unas 410 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 265/60 R18 en lugar de 265/65 R17?",
    answer:
      "El diámetro total cambia −0,1 %: prácticamente igual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 265/65 R17 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-11-02" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida de las pickups medianas y las SUV de chasis que más circulan en Córdoba: la llevan la Hilux SR y SRV, la SW4, la Ranger XLT, la Titano, la L200 y la Tasman, entre otras. Si tu camioneta es de ese segmento, es muy probable que sea la tuya.</p>

      <h2>Qué significa 265/65 R17</h2>
      <ul>
      <li><strong>265:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>65:</strong> altura del flanco, como porcentaje del ancho. Acá son 265 × 65 % = 172,25 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>17:</strong> diámetro de la llanta en pulgadas (431,8 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 431,8 mm de llanta más dos flancos de 172,25 mm: <strong>776,3 mm</strong>, o unas 410 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 265/65 R17</h2>
      <p>De los modelos de nuestra base de vehículos, 11 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/toyota-hilux">Toyota Hilux</Link></td><td>SR / SRV 2005-2015 · SR / SRV 2015-presente</td></tr>
      <tr><td><Link href="/vehiculos/ford-ranger">Ford Ranger</Link></td><td>XLT / XLT AT 2016-2022</td></tr>
      <tr><td><Link href="/vehiculos/baic-bj40">BAIC BJ40</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/fiat-titano">Fiat Titano</Link></td><td>Freedom / Endurance 2022-presente</td></tr>
      <tr><td><Link href="/vehiculos/foton-tunland">Foton Tunland</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/jmc-grand-avenue">JMC Grand Avenue</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/kia-tasman">Kia Tasman</Link></td><td>EX 2.5 TGDi / EX 2.2 CRDi</td></tr>
      <tr><td><Link href="/vehiculos/mitsubishi-l200">Mitsubishi L200</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/mitsubishi-montero">Mitsubishi Montero</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/toyota-hilux-sw4">Toyota Hilux SW4</Link></td><td>SRV / SRX 2005-2015 · SR 2015-presente</td></tr>
      <tr><td><Link href="/vehiculos/toyota-sw4">Toyota SW4</Link></td><td>SRV / SRX 2005-2015 · SR 2015-presente</td></tr>
      </tbody>
      </table>
      
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>
      <CatalogWidget size={{ width: 265, profile: 65, rim: 17 }} title="265/65 R17 en stock hoy" />

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/265-60-r18">265/60 R18</Link> (rodado 18)</td><td>775,2 mm</td><td>−0,1 %</td><td>Prácticamente igual</td></tr>
      <tr><td><Link href="/neumaticos/275-65-r17">275/65 R17</Link></td><td>789,3 mm</td><td>+1,7 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/255-65-r17">255/65 R17</Link></td><td>763,3 mm</td><td>−1,7 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/265-70-r17">265/70 R17</Link></td><td>802,8 mm</td><td>+3,4 %</td><td>Fuera de la tolerancia: cambia el velocímetro</td></tr>
      </tbody>
      </table>
      <p>265/60 R18 es el cambio de rodado más común: el diámetro casi no varía (diferencia menor al 1 %), pero necesita llanta de 18 pulgadas. Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 265/65 R17</h2>
      <p>Acá la medida es solo la mitad de la decisión: en una pickup importa el tipo de neumático. El H/T es silencioso y cómodo para asfalto; el A/T tiene dibujo más agresivo para tierra, ripio y barro, a cambio de más ruido y algo más de consumo. También conviene mirar el índice de carga, porque una camioneta cargada o con acoplado trabaja más que un auto.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/265-65-r17">opciones en 265/65 R17 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-17">rodado 17</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
