import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-195-65-r15-autos-que-la-usan";
const TITLE = "Neumáticos 195/65 R15: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 18 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Neumáticos 195/65 R15: qué significa, diámetro total (634,5 mm), 18 autos que la usan (Ford EcoSport, Renault Megane, Peugeot 307, Volkswagen Bora), medidas equivalentes y cómo elegir."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 195/65 R15?",
    answer:
      "En nuestra base de vehículos la llevan 18 modelos, entre ellos Ford EcoSport, Renault Megane, Peugeot 307, Volkswagen Bora, Chevrolet Vectra, Honda Civic. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 195/65 R15?",
    answer:
      "634,5 mm: la llanta de 15 pulgadas (381,0 mm) más dos flancos de 126,75 mm. Da unas 502 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 205/60 R15 en lugar de 195/65 R15?",
    answer:
      "El diámetro total cambia −1,2 %: prácticamente igual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 195/65 R15 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida de los sedanes y monovolúmenes medianos de la década de 2000: Bora, Vectra, Megane II, Civic 2006-2011, Linea, Zafira, 307 y también la EcoSport de primera generación y la Spin. Quedan muchos de estos autos en la calle.</p>

      <h2>Qué significa 195/65 R15</h2>
      <ul>
      <li><strong>195:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>65:</strong> altura del flanco, como porcentaje del ancho. Acá son 195 × 65 % = 126,75 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>15:</strong> diámetro de la llanta en pulgadas (381,0 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 381,0 mm de llanta más dos flancos de 126,75 mm: <strong>634,5 mm</strong>, o unas 502 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 195/65 R15</h2>
      <p>De los modelos de nuestra base de vehículos, 18 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/ford-ecosport">Ford EcoSport</Link></td><td>Base / Ambiente 2003-2012</td></tr>
      <tr><td><Link href="/vehiculos/renault-megane">Renault Megane</Link></td><td>Authentique 2003-2010</td></tr>
      <tr><td><Link href="/vehiculos/peugeot-307">Peugeot 307</Link></td><td>XR / XS</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-bora">Volkswagen Bora</Link></td><td>Trendline 2.0 / 1.9 TDI 1999-2009</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-vectra">Chevrolet Vectra</Link></td><td>GL 1996-2007</td></tr>
      <tr><td><Link href="/vehiculos/honda-civic">Honda Civic</Link></td><td>LXS 2006-2011</td></tr>
      <tr><td><Link href="/vehiculos/fiat-linea">Fiat Linea</Link></td><td>Essence 2008-2016</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-spin">Chevrolet Spin</Link></td><td>LT / Activ</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-zafira">Chevrolet Zafira</Link></td><td>GL / GLS 2001-2012</td></tr>
      <tr><td><Link href="/vehiculos/chrysler-pt-cruiser">Chrysler PT Cruiser</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/fiat-strada">Fiat Strada</Link></td><td>Working / Endurance / Freedom 2012-2020 · Endurance / Freedom 2020-presente</td></tr>
      <tr><td><Link href="/vehiculos/kia-soul">Kia Soul</Link></td><td>Classic 2009-2013</td></tr>
      </tbody>
      </table>
      <p>También la usan, según versión: <Link key="nissan-tiida" href="/vehiculos/nissan-tiida">Nissan Tiida</Link>, <Link key="nissan-versa" href="/vehiculos/nissan-versa">Nissan Versa</Link>, <Link key="seat-toledo" href="/vehiculos/seat-toledo">Seat Toledo</Link>, <Link key="subaru-impreza" href="/vehiculos/subaru-impreza">Subaru Impreza</Link>, <Link key="toyota-prius" href="/vehiculos/toyota-prius">Toyota Prius</Link>, <Link key="volkswagen-golf" href="/vehiculos/volkswagen-golf">Volkswagen Golf</Link>.</p>
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>
      <CatalogWidget size={{ width: 195, profile: 65, rim: 15 }} title="195/65 R15 en stock hoy" />

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/205-60-r15">205/60 R15</Link></td><td>627,0 mm</td><td>−1,2 %</td><td>Prácticamente igual</td></tr>
      <tr><td><Link href="/neumaticos/205-65-r15">205/65 R15</Link></td><td>647,5 mm</td><td>+2,0 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/195-60-r15">195/60 R15</Link></td><td>615,0 mm</td><td>−3,1 %</td><td>Fuera de la tolerancia: cambia el velocímetro</td></tr>
      </tbody>
      </table>
      <p>El que pasa a 205/60 R15 gana un poco de ancho con una diferencia de diámetro del 1 %, pero necesita que la llanta lo admita. Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 195/65 R15</h2>
      <p>Como son autos con varios años, a veces ya cambiaron la llanta o las cubiertas originales por otra medida. Revisá el flanco del neumático montado antes de comprar: lo que importa es lo que lleva hoy tu auto, no lo que decía de fábrica.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/195-65-r15">opciones en 195/65 R15 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-15">rodado 15</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
