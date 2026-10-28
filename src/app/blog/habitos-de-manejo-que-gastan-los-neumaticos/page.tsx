import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "habitos-de-manejo-que-gastan-los-neumaticos";
const TITLE = "Hábitos de manejo que gastan los neumáticos (y cómo corregirlos)";
const SUBTITLE =
  "Frenadas, cordones, curvas, velocidad y carga: lo que hacés al volante se nota en el dibujo, y casi todo es gratis de cambiar.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué hábitos de manejo desgastan más rápido los neumáticos: frenadas fuertes, rozar cordones, curvas rápidas, sobrecarga y velocidad. Cómo corregirlos para que la cubierta rinda más kilómetros.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿El estilo de manejo influye de verdad en el desgaste?",
    answer:
      "Sí. Frenar fuerte, acelerar a fondo y tomar las curvas rápido gastan la goma mucho más rápido que un manejo suave, sobre todo en autos que andan todo el día.",
  },
  {
    question: "¿Estacionar contra el cordón daña el neumático?",
    answer:
      "Rozar el flanco contra un cordón lo raspa y puede dañar la estructura interna. Es una causa común de burbujas y cortes en el costado.",
  },
  {
    question: "¿Llevar mucha carga los gasta más?",
    answer:
      "Sí, y además cambia la presión que necesitan. Mirá la etiqueta de la puerta: suele indicar una presión para cargas altas.",
  },
  {
    question: "¿Hay alguna costumbre que ahorre cubiertas sin gastar?",
    answer:
      "Revisar la presión todos los meses, mirar adelante para frenar con anticipación y rotarlas a tiempo. No cuestan nada y se notan.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={5} faqs={FAQS}>
      <p>Dos autos con el mismo juego de neumáticos pueden terminar con el doble de diferencia en kilómetros. La razón, muchas veces, no es la cubierta sino quién la usa. La buena noticia es que cambiar de hábitos no cuesta nada.</p>

      <h2>Los hábitos que más gastan</h2>
      <ul>
      <li><strong>Frenadas fuertes:</strong> la goma se raspa contra el piso y se pierde dibujo de golpe. Mirar más adelante y soltar el acelerador antes reduce frenadas.</li>
      <li><strong>Arranques bruscos:</strong> el patinar de arranque desgasta la banda de las ruedas que traccionan.</li>
      <li><strong>Curvas rápidas:</strong> cargan el hombro del neumático, que se gasta antes que el centro.</li>
      <li><strong>Cordones y bordes:</strong> rozar el flanco lo raspa y daña la estructura. Estacioná sin apoyar la rueda.</li>
      <li><strong>Girar el volante con el auto detenido:</strong> fuerza la goma en un solo punto. Si podés, avanzá apenas mientras girás.</li>
      <li><strong>Velocidad sostenida alta:</strong> calienta el neumático y acelera el desgaste, sobre todo con presión baja.</li>
      <li><strong>Sobrecarga:</strong> sin ajustar la presión, el neumático se deforma. Mirá <Link href="/blog/presion-neumaticos-utilitarios-con-carga">presión con carga</Link>.</li>
      </ul>

      <h2>Lo que no se ve: pozos y baches</h2>
      <p>Un golpe fuerte puede dañar la cubierta y desalinear el tren delantero sin que se note enseguida. Bajá la velocidad antes del pozo, no frenes en el impacto y revisá después: <Link href="/blog/pozo-o-golpe-que-revisar-en-el-neumatico">qué mirar después de un golpe</Link>.</p>

      <h2>Hábitos que alargan la vida</h2>
      <ol>
      <li>Revisar la presión todos los meses: <Link href="/blog/revision-mensual-de-neumaticos-en-5-minutos">rutina de 5 minutos</Link>.</li>
      <li>Alinear al colocar y cuando el auto tire: <Link href="/blog/alineacion-y-balanceo">alineado y balanceado</Link>.</li>
      <li><Link href="/blog/rotacion-de-neumaticos">Rotar</Link> cada 8.000 a 10.000 km.</li>
      <li>Evitar sobrecargar y ajustar la presión si cargás mucho.</li>
      </ol>

      <h2>Si manejás para trabajar</h2>
      <p>En un taxi, remis o auto de aplicación los kilómetros se multiplican. Hay una nota específica: <Link href="/blog/como-hacer-durar-los-neumaticos-de-taxis-y-remises">cómo hacer durar los neumáticos de un taxi o un remis</Link>. Y la guía general para gastar menos está en <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">ahorrar en neumáticos</Link>.</p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
