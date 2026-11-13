import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-265-60-r18-autos-que-la-usan";
const TITLE = "Neumáticos 265/60 R18: qué camionetas la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, las 15 camionetas y SUV de nuestra base que la llevan (Hilux SRX, Ranger Limited, S10 LTZ) y qué medidas se pueden usar en su lugar.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Neumáticos 265/60 R18: qué significa, diámetro total (775,2 mm), qué camionetas la usan (Toyota Hilux SRX, Ford Ranger Limited, Chevrolet S10 LTZ, SW4), medidas equivalentes y cómo elegir."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué camionetas usan neumáticos 265/60 R18?",
    answer:
      "En nuestra base de vehículos la llevan 15 modelos, entre ellos Toyota Hilux (SRX y GR-Sport), Toyota SW4, Ford Ranger (FX4 y Limited 2016-2022), Chevrolet S10 y Trailblazer (LTZ y High Country), Fiat Titano (Volcano y Ranch), Foton Tunland, JAC T8, Maxus T60 y T90, Jeep Grand Cherokee Laredo y Dodge Durango. Es la medida de las versiones altas: las básicas de los mismos modelos suelen llevar rodado 16 o 17.",
  },
  {
    question: "¿Qué diámetro total tiene un 265/60 R18?",
    answer:
      "775,2 mm: la llanta de 18 pulgadas (457,2 mm) más dos flancos de 159 mm. Da unas 411 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 265/65 R17 en una camioneta que trae 265/60 R18?",
    answer:
      "Sí en cuanto a diámetro: 265/65 R17 mide 776,3 mm, una diferencia de apenas 0,1 %, así que el velocímetro no cambia. Hay que cambiar también la llanta, porque el rodado es otro (17 en lugar de 18). Es una opción habitual para ganar flanco y comodidad en ruta de ripio.",
  },
  {
    question: "¿Se usan neumáticos A/T o H/T en 265/60 R18?",
    answer:
      "Las dos. H/T (highway) es más silencioso y cómodo en asfalto; A/T (all terrain) agarra mejor en tierra, ripio y barro a cambio de algo más de ruido y consumo. Hoy en Trivium esta medida la tenemos en A/T; en la ficha de cada modelo está el stock y el precio actuales.",
  },
  {
    question: "¿Cuánto sale alinear y balancear una camioneta con 265/60 R18?",
    answer:
      "Las camionetas y las SUV de chasis (Hilux, Ranger, S10, SW4, Amarok y similares) tienen precio propio de alineado y balanceado, distinto al de un auto. El combo de camioneta (alineado 3D, balanceado de las cuatro ruedas y rotación) está hoy en $80.000, sin turno, en el taller de Argüello. El valor vigente figura siempre en la página de servicios.",
  },
  {
    question: "¿Dónde compro neumáticos 265/60 R18 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales. Con la compra en el local, la colocación y las válvulas van sin cargo, y se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-11-13" readingMinutes={6} faqs={FAQS}>
      <p>Es la medida de las pickups y SUV de chasis en sus versiones más equipadas: la Hilux SRX y GR-Sport, la SW4 SRX y Diamond, la Ranger FX4 y Limited de la generación anterior, la S10 LTZ y High Country, la Trailblazer, la Titano Volcano. Si tu camioneta tiene llantas de 18 pulgadas, es muy probable que esta sea tu medida.</p>

      <h2>Qué significa 265/60 R18</h2>
      <ul>
      <li><strong>265:</strong> ancho de la banda de rodamiento, en milímetros.</li>
      <li><strong>60:</strong> altura del flanco, como porcentaje del ancho. Acá son 265 × 60 % = 159 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>18:</strong> diámetro de la llanta en pulgadas (457,2 mm).</li>
      </ul>
      <p>El diámetro total es 457,2 mm de llanta más dos flancos de 159 mm: <strong>775,2 mm</strong>, unas 411 vueltas por kilómetro. Ese es el número que importa para comparar con otras medidas. Para repasar cómo se lee todo el flanco, mirá <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>. Después de la medida vienen el índice de carga y de velocidad (por ejemplo 110T): <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</p>

      <h2>Camionetas que usan 265/60 R18</h2>
      <p>De los modelos de nuestra base de vehículos, 15 llevan esta medida de fábrica en alguna versión. Es casi siempre la versión alta de la gama:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/toyota-hilux">Toyota Hilux</Link></td><td>SRX / GR-Sport 2015-presente</td></tr>
      <tr><td><Link href="/vehiculos/ford-ranger">Ford Ranger</Link></td><td>FX4 / Limited 2016-2022</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-s10">Chevrolet S10</Link></td><td>LTZ / High Country 2012-presente</td></tr>
      <tr><td><Link href="/vehiculos/chevrolet-trailblazer">Chevrolet Trailblazer</Link></td><td>LTZ / Premier / High Country 2012-2020</td></tr>
      <tr><td><Link href="/vehiculos/fiat-titano">Fiat Titano</Link></td><td>Volcano / Ranch 2022-presente</td></tr>
      <tr><td><Link href="/vehiculos/toyota-hilux-sw4">Toyota Hilux SW4</Link></td><td>SRX / Diamond / GR-Sport 2015-presente</td></tr>
      <tr><td><Link href="/vehiculos/toyota-sw4">Toyota SW4</Link></td><td>SRX / Diamond / GR-Sport 2015-presente</td></tr>
      <tr><td><Link href="/vehiculos/foton-tunland">Foton Tunland</Link></td><td>G7</td></tr>
      <tr><td><Link href="/vehiculos/jeep-grand-cherokee">Jeep Grand Cherokee</Link></td><td>Laredo / Altitude</td></tr>
      <tr><td><Link href="/vehiculos/dodge-durango">Dodge Durango</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/great-wall-poer">Great Wall Poer</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/jac-t8">JAC T8</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/maxus-t60">Maxus T60</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/maxus-t90">Maxus T90</Link></td><td>Varias versiones</td></tr>
      <tr><td><Link href="/vehiculos/ram-dakota">RAM Dakota</Link></td><td>Varias versiones</td></tr>
      </tbody>
      </table>
      <p>Ojo con dos confusiones frecuentes: la <strong>Ford Ranger nueva</strong> (2023 en adelante) en su versión Limited lleva 255/65 R18, no 265/60 R18, y la <strong>Nissan Frontier</strong> usa 255/60 R18 o 255/65 R18 según la versión. Se parecen mucho a simple vista y no son intercambiables sin revisar el diámetro. Tomá esta lista como punto de partida y confirmá siempre en el flanco del neumático montado o en la etiqueta del marco de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>
      <CatalogWidget size={{ width: 265, profile: 60, rim: 18 }} title="265/60 R18 en stock hoy" />

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/265-65-r17">265/65 R17</Link> (rodado 17)</td><td>776,3 mm</td><td>+0,1 %</td><td>Prácticamente igual, pero pide llanta de 17</td></tr>
      <tr><td>255/60 R18</td><td>763,2 mm</td><td>−1,5 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td>275/60 R18</td><td>787,2 mm</td><td>+1,5 %</td><td>Dentro de la tolerancia, verificá que no roce</td></tr>
      <tr><td>255/65 R18</td><td>788,7 mm</td><td>+1,7 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td>285/60 R18</td><td>799,2 mm</td><td>+3,1 %</td><td>Fuera de la tolerancia: cambia el velocímetro</td></tr>
      </tbody>
      </table>
      <p>Cambiar a 265/65 R17 es el movimiento más común: el diámetro casi no varía y ganás 12,5 mm de flanco, que se nota en el confort sobre calles rotas y ripio. A cambio necesitás llantas de 17. Si lo estás evaluando, leé <Link href="/blog/265-60-r18-o-265-65-r17-cual-conviene-camioneta">265/60 R18 o 265/65 R17: cuál conviene</Link>. Podés calcular cualquier otra combinación en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia el velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 265/60 R18</h2>
      <p>En una camioneta, la medida es solo la mitad de la decisión: importa el tipo de neumático. El H/T es silencioso y cómodo para asfalto; el A/T tiene dibujo más agresivo para tierra, ripio y barro, a cambio de más ruido. Si no sabés cuál te conviene, <Link href="/blog/at-o-ht-cual-conviene-para-tu-camioneta">A/T o H/T: cuál conviene para tu camioneta</Link> lo explica con el uso de cada una.</p>
      <ol>
      <li><strong>Respetá el índice de carga:</strong> una camioneta cargada o con acoplado trabaja mucho más que un auto. No bajes del índice de la etiqueta de la puerta.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>. Sobre marcas de importación, <Link href="/blog/marca-o-importado-camioneta-at-carga">marca o importado en camionetas</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>. En una 4x4 es todavía más importante que las cuatro tengan el mismo diámetro.</li>
      </ol>

      <h2>Alineado y balanceado de una camioneta con rodado 18</h2>
      <p>Una camioneta es más pesada y tiene ruedas más grandes que un auto, y por eso el alineado y el balanceado tienen precio propio: el combo de camioneta (alineado 3D, balanceado de las cuatro ruedas y rotación) está hoy en <strong>$80.000</strong>, sin turno, en el taller de Argüello. Para el taller, Hilux, Ranger, S10 y similares son camioneta aunque sean de cabina simple o doble. Más detalle en <Link href="/blog/alineado-y-balanceado-en-camionetas-y-4x4">alineado y balanceado en camionetas y 4x4</Link> y en la ficha del <Link href="/servicios/combo-alineado-y-balanceado">combo de alineado y balanceado</Link>, donde está siempre el valor vigente.</p>
      <p>Mirá las <Link href="/neumaticos/265-60-r18">opciones en 265/60 R18 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-18">rodado 18</Link>. La colocación y las válvulas van sin cargo comprando en el local.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
