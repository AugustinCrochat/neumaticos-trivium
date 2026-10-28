import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { MedidasLinks } from "@/components/blog/MedidasLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-175-70-r14-autos-que-la-usan";
const TITLE = "Neumáticos 175/70 R14: qué autos la usan, equivalencias y cómo elegir";
const SUBTITLE =
  "Medida, diámetro total, los 23 modelos de nuestra base que la llevan y qué otras medidas se pueden usar sin tocar el velocímetro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Neumáticos 175/70 R14: qué significa, diámetro total (600,6 mm), 23 autos que la usan (Renault Sandero, Volkswagen Gol Trend, Renault Logan, Renault Kangoo), medidas equivalentes y cómo elegir.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué autos usan neumáticos 175/70 R14?",
    answer:
      "En nuestra base de vehículos la llevan 23 modelos, entre ellos Renault Sandero, Volkswagen Gol Trend, Renault Logan, Renault Kangoo, Volkswagen Gol, Fiat Palio. Depende de la versión: confirmá siempre el flanco del neumático montado o la etiqueta del marco de la puerta.",
  },
  {
    question: "¿Qué diámetro total tiene un 175/70 R14?",
    answer:
      "600,6 mm: la llanta de 14 pulgadas (355,6 mm) más dos flancos de 122,50 mm. Da unas 530 vueltas por kilómetro.",
  },
  {
    question: "¿Puedo usar 185/65 R14 en lugar de 175/70 R14?",
    answer:
      "El diámetro total cambia −0,7 %: prácticamente igual. Antes de hacerlo confirmá que la llanta admita el ancho y que no roce en el paso de rueda; en caso de duda, consultá en el taller.",
  },
  {
    question: "¿Dónde compro neumáticos 175/70 R14 en Córdoba?",
    answer:
      "En el catálogo de Neumáticos Trivium filtrás por esta medida y ves el stock y el precio actuales; la colocación, el alineado y el balanceado se hacen en el taller de Argüello, Córdoba.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Medidas" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Es la medida de la generación de compactos y utilitarios livianos de los años 2005-2019: Gol Trend, Gol G4, Voyage, Palio, Siena, Idea, Logan y Sandero de primera generación, Kangoo y Fiorino, entre otros. Hay muchísimos de estos autos circulando.</p>

      <h2>Qué significa 175/70 R14</h2>
      <ul>
      <li><strong>175:</strong> ancho de la banda, en milímetros.</li>
      <li><strong>70:</strong> altura del flanco, como porcentaje del ancho. Acá son 175 × 70 % = 122,50 mm.</li>
      <li><strong>R:</strong> construcción radial, la estándar hoy.</li>
      <li><strong>14:</strong> diámetro de la llanta en pulgadas (355,6 mm).</li>
      </ul>
      <p>El diámetro total del neumático es 355,6 mm de llanta más dos flancos de 122,50 mm: <strong>600,6 mm</strong>, o unas 530 vueltas por kilómetro. Ese número es el que importa para comparar con otras medidas. Si querés repasar cómo se lee todo el flanco, está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>

      <h2>Autos que usan 175/70 R14</h2>
      <p>De los modelos de nuestra base de vehículos, 23 llevan esta medida de fábrica en alguna versión. Los más conocidos:</p>
      <table>
      <thead><tr><th>Modelo</th><th>Versión y años</th></tr></thead>
      <tbody>
      <tr><td><Link href="/vehiculos/renault-sandero">Renault Sandero</Link></td><td>Authentique / Expression 2008-2014</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-gol-trend">Volkswagen Gol Trend</Link></td><td>Trendline / Pack I 2008-2016</td></tr>
      <tr><td><Link href="/vehiculos/renault-logan">Renault Logan</Link></td><td>Authentique / Expression 2007-2014</td></tr>
      <tr><td><Link href="/vehiculos/renault-kangoo">Renault Kangoo</Link></td><td>Kangoo 1 1998-2010 · Confort / Authentique 2010-2021</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-gol">Volkswagen Gol</Link></td><td>Trendline / Power 2005-2008</td></tr>
      <tr><td><Link href="/vehiculos/fiat-palio">Fiat Palio</Link></td><td>Attractive / ELX (Fase 3, Nueva Palio) 2004-2017</td></tr>
      <tr><td><Link href="/vehiculos/fiat-siena">Fiat Siena</Link></td><td>Attractive / ELX 2004-2013</td></tr>
      <tr><td><Link href="/vehiculos/volkswagen-voyage">Volkswagen Voyage</Link></td><td>Trendline (G4-based) 2008-2012 · Trendline 2012-2019</td></tr>
      <tr><td><Link href="/vehiculos/fiat-palio-weekend">Fiat Palio Weekend</Link></td><td>Attractive / ELX 2004-2017</td></tr>
      <tr><td><Link href="/vehiculos/renault-symbol">Renault Symbol</Link></td><td>Authentique</td></tr>
      <tr><td><Link href="/vehiculos/fiat-idea">Fiat Idea</Link></td><td>Attractive / ELX 2006-2016</td></tr>
      <tr><td><Link href="/vehiculos/changan-md201">Changan MD201</Link></td><td>Varias versiones</td></tr>
      </tbody>
      </table>
      <p>También la usan, según versión: <Link key="fiat-fiorino" href="/vehiculos/fiat-fiorino">Fiat Fiorino</Link>, <Link key="fiat-strada" href="/vehiculos/fiat-strada">Fiat Strada</Link>, <Link key="foton-gratour" href="/vehiculos/foton-gratour">Foton Gratour</Link>, <Link key="lifan-foison" href="/vehiculos/lifan-foison">Lifan Foison</Link>, <Link key="peugeot-405" href="/vehiculos/peugeot-405">Peugeot 405</Link>, <Link key="shineray-t30" href="/vehiculos/shineray-t30">Shineray T30</Link>, <Link key="shineray-t32" href="/vehiculos/shineray-t32">Shineray T32</Link>, <Link key="shineray-x30" href="/vehiculos/shineray-x30">Shineray X30</Link>, <Link key="volkswagen-caddy" href="/vehiculos/volkswagen-caddy">Volkswagen Caddy</Link>, <Link key="volkswagen-saveiro" href="/vehiculos/volkswagen-saveiro">Volkswagen Saveiro</Link>, <Link key="volkswagen-up" href="/vehiculos/volkswagen-up">Volkswagen Up!</Link>.</p>
      <p>Una misma versión puede haber cambiado de llanta con los años, así que tomá esta lista como punto de partida y confirmá en el flanco o en la etiqueta de la puerta (<Link href="/blog/etiqueta-de-presion-puerta-del-auto">dónde está y cómo leerla</Link>).</p>

      <h2>Medidas parecidas: cuáles se pueden usar</h2>
      <p>Lo que se compara no es el ancho sino el <strong>diámetro total</strong>. Una diferencia de hasta un 3 % se considera tolerable; más que eso empieza a cambiar el velocímetro y el cuentakilómetros, que marcan de más o de menos.</p>
      <table>
      <thead><tr><th>Medida</th><th>Diámetro</th><th>Diferencia</th><th>Veredicto</th></tr></thead>
      <tbody>
      <tr><td><Link href="/neumaticos/185-65-r14">185/65 R14</Link></td><td>596,1 mm</td><td>−0,7 %</td><td>Prácticamente igual</td></tr>
      <tr><td><Link href="/neumaticos/175-65-r14">175/65 R14</Link></td><td>583,1 mm</td><td>−2,9 %</td><td>Dentro de la tolerancia habitual</td></tr>
      <tr><td><Link href="/neumaticos/165-70-r14">165/70 R14</Link></td><td>586,6 mm</td><td>−2,3 %</td><td>Dentro de la tolerancia habitual</td></tr>
      </tbody>
      </table>
      <p>Es una medida de perfil alto, buena para pozos y calles rotas, así que no suele tener sentido pasar a un rodado mayor. Antes de cambiar, comprobá que la llanta admita el ancho nuevo y que no roce en el paso de rueda. Podés calcularlo en la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o ver cuánto cambia tu velocímetro con la <Link href="/herramientas/velocimetro-neumaticos">herramienta de velocímetro</Link>.</p>

      <h2>Cómo elegir neumáticos 175/70 R14</h2>
      <p>Los autos de esta medida suelen tener varios años de uso, algunos como herramienta de trabajo (remises, reparto, utilitarios). Lo importante es el índice de carga: en los utilitarios como Kangoo, Fiorino y Caddy no bajes del que figura en la etiqueta de la puerta.</p>
      <ol>
      <li><strong>Respetá el índice de carga y de velocidad</strong> de la etiqueta de la puerta o superalos: <Link href="/blog/indice-de-carga-y-velocidad">qué significan</Link>.</li>
      <li><strong>Mirá la fecha:</strong> el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link> dice cuántos años tiene la cubierta.</li>
      <li><strong>Comparé el costo por kilómetro,</strong> no solo el precio: <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</li>
      <li><strong>Cambialos en juego</strong> cuando se pueda: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">uno, dos o cuatro</Link>.</li>
      </ol>
      <p>Mirá las <Link href="/neumaticos/175-70-r14">opciones en 175/70 R14 con stock y precio</Link> o todo el <Link href="/neumaticos/rodado-14">rodado 14</Link>. En el taller de Argüello las colocamos, las alineamos y las balanceamos en el momento: <Link href="/servicios">servicios</Link>.</p>
      <MedidasLinks current={SLUG} />
    </ArticleLayout>
  );
}
