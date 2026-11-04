import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-205-55-r16-autos-que-la-usan";
const TITLE = "Neumáticos 205/55 R16: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 42 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Neumáticos 205/55 R16: qué significa, diámetro total (631,9 mm), 42 autos que la usan (Renault Sandero Stepway, Toyota Corolla, Renault Megane, Ford Focus), medidas equivalentes y cómo elegir."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 205/55 R16?",
    answer:
      "En nuestra base de vehículos la llevan 42 modelos, entre ellos Renault Sandero Stepway, Toyota Corolla, Renault Megane, Ford Focus, Peugeot 307, Volkswagen Bora. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 205/55 R16?",
    answer:
      "631,9 mm: la llanta de 16 pulgadas (406,4 mm) más dos flancos de 112,75 mm. Da unas 504 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 195/55 R16 en lugar de 205/55 R16?",
    answer:
      "El diámetro total cambia −1,7 %: dentro de la tolerancia habitual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 205/55 R16 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida que más modelos de nuestra base comparten: sedanes y hatchbacks medianos como el Corolla, el Civic, el Focus, el Vento y el Golf la llevan de fábrica, y también el Sandero Stepway. Si tu auto es de ese segmento, es muy probable que sea la tuya.</p>

      <h2>Qué significa 205/55 R16</h2>
      <ul>
      <li><strong>205:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>55:</strong> altura del flanco, como porcentaje del ancho. Acá son 205 × 55 % = 112,75 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>16:</strong> diámetro de la llanta en pulgadas (406,4 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 406,4 mm de llanta más dos flancos de 112,75 mm: <strong>631,9 mm</strong>, o unas 504 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 205/55 R16</h2>
      <p>De los modelos de nuestra base de vehículos, 42 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/renault-sandero-stepway">Renault Sandero Stepway</Link></td><td>2009-2020</td></tr>
      <tr><td><Link href="/vehiculos/toyota-corolla">Toyota Corolla</Link></td><td>XLI / XEI / SE-G 2008-2013 · XLI / XEI 2014-2018</td></tr>
      <tr><td><Link href="/vehiculos/renault-megane">Renault Megane</Link></td><td>Dynamique / Privilege 2003-2010 · Luxe 2011-2016</td></tr>
      <tr><td><Link href="/vehiculos/ford-focus">Ford Focus</Link></td><td>Ghia / Trend / SE 2005-2012 · S / SE 2012-2018</td></tr>
      <tr><td><Link href="/vehiculos/peugeot-307">Peugeot 307</Link></td><td>XT / XS Premium</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-bora">Volkswagen Bora</Link></td><td>1.8T Highline / 2.8 V6 1999-2009</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-vectra">Chevrolet Vectra</Link></td><td>GLS / CD 1996-2007</td></tr>
      <tr><td><Link href="/vehiculos/honda-civic">Honda Civic</Link></td><td>EXS 2006-2011 · LXS / EXS 2012-2016</td></tr>
      <tr><td><Link href="/vehiculos/fiat-linea">Fiat Linea</Link></td><td>Absolute 2013-2016</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-vento">Volkswagen Vento</Link></td><td>Advance / Comfortline 2010-2015 · Comfortline 2016-presente</td></tr>
      <tr><td><Link href="/vehiculos/alfa-romeo-147">Alfa Romeo 147</Link></td><td>2.0 TS / Selespeed 2001-2010</td></tr>
      <tr><td><Link href="/vehiculos/alfa-romeo-156">Alfa Romeo 156</Link></td><td>2.5 V6 Sport 1999-2005</td></tr>
      </tbody>
      </table>
      <p>También la usan, según versión: <Link key="audi-a3" href="/vehiculos/audi-a3">Audi A3</Link>, <Link key="changan-cs15" href="/vehiculos/changan-cs15">Changan CS15</Link>, <Link key="chery-arrizo-5" href="/vehiculos/chery-arrizo-5">Chery Arrizo 5</Link>, <Link key="chery-tiggo-2" href="/vehiculos/chery-tiggo-2">Chery Tiggo 2</Link>, <Link key="chevrolet-astra" href="/vehiculos/chevrolet-astra">Chevrolet Astra</Link>, <Link key="chevrolet-zafira" href="/vehiculos/chevrolet-zafira">Chevrolet Zafira</Link>, <Link key="chrysler-pt-cruiser" href="/vehiculos/chrysler-pt-cruiser">Chrysler PT Cruiser</Link>, <Link key="citroen-c4" href="/vehiculos/citroen-c4">Citroen C4</Link>, <Link key="citroen-c4-lounge" href="/vehiculos/citroen-c4-lounge">Citroen C4 Lounge</Link>, <Link key="fiat-punto" href="/vehiculos/fiat-punto">Fiat Punto</Link>, <Link key="fiat-strada" href="/vehiculos/fiat-strada">Fiat Strada</Link>, <Link key="geely-emgrand-7" href="/vehiculos/geely-emgrand-7">Geely Emgrand 7</Link>, <Link key="hyundai-elantra" href="/vehiculos/hyundai-elantra">Hyundai Elantra</Link>, <Link key="hyundai-i30" href="/vehiculos/hyundai-i30">Hyundai i30</Link>, <Link key="jac-s3" href="/vehiculos/jac-s3">JAC S3</Link>, <Link key="kia-cerato" href="/vehiculos/kia-cerato">Kia Cerato</Link>, <Link key="kia-soul" href="/vehiculos/kia-soul">Kia Soul</Link>, <Link key="mg-gt" href="/vehiculos/mg-gt">MG GT</Link>, <Link key="mini-clubman" href="/vehiculos/mini-clubman">Mini Clubman</Link>, <Link key="mini-countryman" href="/vehiculos/mini-countryman">Mini Countryman</Link>, <Link key="nissan-versa" href="/vehiculos/nissan-versa">Nissan Versa</Link>, <Link key="peugeot-308" href="/vehiculos/peugeot-308">Peugeot 308</Link>, <Link key="peugeot-408" href="/vehiculos/peugeot-408">Peugeot 408</Link>, <Link key="porsche-boxster" href="/vehiculos/porsche-boxster">Porsche Boxster</Link>, <Link key="seat-leon" href="/vehiculos/seat-leon">Seat Leon</Link>, <Link key="subaru-impreza" href="/vehiculos/subaru-impreza">Subaru Impreza</Link>, <Link key="volkswagen-golf" href="/vehiculos/volkswagen-golf">Volkswagen Golf</Link>, <Link key="volkswagen-passat" href="/vehiculos/volkswagen-passat">Volkswagen Passat</Link>, <Link key="volkswagen-saveiro" href="/vehiculos/volkswagen-saveiro">Volkswagen Saveiro</Link>, <Link key="volvo-c30" href="/vehiculos/volvo-c30">Volvo C30</Link>.</p>
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>
      <CatalogWidget size={{ width: 205, profile: 55, rim: 16 }} title="205/55 R16 en stock hoy" />

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/195-55-r16">195/55 R16</Link></td><td>620,9 mm</td><td>−1,7 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/215-55-r16">215/55 R16</Link></td><td>642,9 mm</td><td>+1,7 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/205-60-r16">205/60 R16</Link></td><td>652,4 mm</td><td>+3,2 %</td><td>Fuera de la tolerancia: cambia el velocímetro</td></tr>
      <tr><td><Link href="/neumaticos/225-45-r17">225/45 R17</Link> (rodado 17)</td><td>634,3 mm</td><td>+0,4 %</td><td>Prácticamente igual</td></tr>
      </tbody>
      </table>
      <p>Muchos dueños pasan a 225/45 R17 cuando cambian la llanta: el diámetro total casi no cambia, pero el flanco queda más bajo y la rueda más rígida. Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 205/55 R16</h2>
      <p>Es una medida de ciudad y ruta: los autos que la usan hacen kilometraje mixto y se manejan a velocidad de autopista, así que conviene mirar la resistencia al desgaste y el comportamiento en mojado más que el precio solo. Hay mucha oferta, desde marcas premium hasta importadas económicas.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/205-55-r16">opciones en 205/55 R16 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-16">rodado 16</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
