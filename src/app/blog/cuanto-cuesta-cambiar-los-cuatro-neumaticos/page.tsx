import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS, getServiciosPrecios } from "@/lib/pos-api";
import { preciosTaller } from "@/lib/servicios-seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cuanto-cuesta-cambiar-los-cuatro-neumaticos";
const TITLE = "¿Cuánto cuesta cambiar los 4 neumáticos? Costo total con alineado y balanceado";
const SUBTITLE =
  "Cuánto sale el juego completo según el rodado de tu auto, qué incluye la colocación y cuánto suma el alineado y balanceado. Con precios reales del día.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description: resumen(
    "Cuánto cuesta cambiar los cuatro neumáticos de un auto según el rodado: el juego completo, la colocación y el alineado y balanceado. Precios reales del día."
  ),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuánto cuesta cambiar los cuatro neumáticos de un auto?",
    answer:
      "Depende del rodado y la marca. Es el precio de una cubierta multiplicado por cuatro, más el alineado y balanceado si lo hacés. La tabla de esta nota se calcula con el stock real de hoy, rodado por rodado.",
  },
  {
    question: "¿La colocación se cobra aparte?",
    answer:
      "Comprando los neumáticos en nuestro local, el arme, el desarme y el cambio de válvulas van sin cargo. Si traés cubiertas compradas en otro lado, la colocación se cobra.",
  },
  {
    question: "¿Es obligatorio alinear y balancear al cambiar los neumáticos?",
    answer:
      "No es obligatorio, pero es lo que hace que el juego nuevo dure. Con el auto desalineado, los neumáticos nuevos se desgastan de un solo lado y se pierde parte de lo que se invirtió. Por eso lo mostramos como un costo aparte, sumado al juego.",
  },
  {
    question: "¿Conviene cambiar los cuatro o de a dos?",
    answer:
      "Lo ideal es el juego completo, así el desgaste y el agarre quedan parejos. Si cambiás solo dos, los nuevos van atrás. Tenemos una nota aparte con el detalle.",
  },
  {
    question: "¿Se puede pagar en cuotas?",
    answer:
      "Sí. En cada ficha de producto y en el cotizador ves las cuotas disponibles con cada medio de pago, y el total de los cuatro neumáticos con el alineado si lo sumás.",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export default async function Page() {
  const [productos, servicios] = await Promise.all([
    getProductosDesdePOS(DEFAULT_BRANCH_ID),
    getServiciosPrecios(undefined, DEFAULT_BRANCH_ID),
  ]);
  const taller = preciosTaller(servicios);

  // El neumático más barato en stock de cada rodado de auto: es el piso real
  // del juego, no un promedio. Se excluyen los de carga (C).
  const porRodado = new Map<number, number>();
  for (const p of productos) {
    if (!p.enStock || p.isCarga) continue;
    const actual = porRodado.get(p.size.rim);
    if (actual === undefined || p.price < actual) porRodado.set(p.size.rim, p.price);
  }
  const filas = [...porRodado.entries()]
    .filter(([rim]) => rim >= 13 && rim <= 18)
    .sort((a, b) => a[0] - b[0])
    .map(([rim, unidad]) => ({
      rim,
      unidad,
      juego: unidad * 4,
      conCombo: taller.comboAuto ? unidad * 4 + taller.comboAuto : null,
    }));
  const hayCombo = filas.some((f) => f.conCombo !== null);
  const actualizado = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-11-05"
      readingMinutes={5}
      faqs={FAQS}
    >
      <p>
        Cuando preguntás cuánto sale cambiar los neumáticos, el precio de una cubierta es solo una parte. El costo real
        del cambio es el juego de cuatro, más la colocación y, si querés que dure, el alineado y balanceado. Acá lo
        separamos para que sepas qué estás pagando en cada cosa.
      </p>

      {filas.length > 0 && (
        <>
          <h2>Cuánto sale el juego de cuatro, según el rodado</h2>
          <p>
            Es el neumático <strong>más barato que tenemos en stock</strong> en cada rodado, multiplicado por cuatro. No es
            un promedio: es el piso. Con una marca o un modelo más alto, el número sube. Precios con IVA incluido, actualizados
            el <strong>{actualizado}</strong>.
          </p>
          <table>
            <thead>
              <tr>
                <th>Rodado</th>
                <th>Desde, por unidad</th>
                <th>Juego de 4</th>
                {hayCombo && <th>Con alineado y balanceado</th>}
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.rim}>
                  <td>
                    <Link href={`/neumaticos/rodado-${f.rim}`}>
                      <strong>R{f.rim}</strong>
                    </Link>
                  </td>
                  <td>{formatPrice(f.unidad)}</td>
                  <td>{formatPrice(f.juego)}</td>
                  {hayCombo && <td>{f.conCombo ? formatPrice(f.conCombo) : "—"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          {taller.comboAuto && (
            <p>
              El combo de alineado 3D y balanceado de las cuatro ruedas para auto cuesta{" "}
              <strong>{formatPrice(taller.comboAuto)}</strong>
              {taller.comboCamioneta ? ` y ${formatPrice(taller.comboCamioneta)} para camioneta` : ""}. La última columna suma
              el combo de auto al juego.
            </p>
          )}
        </>
      )}

      <h2>Qué incluye la colocación</h2>
      <p>
        Comprando los neumáticos en el local, el <strong>arme, el desarme y el cambio de válvulas van sin cargo</strong>. Es una
        diferencia grande frente a comprar por internet y llevarlas a un taller, donde la colocación se cobra por rueda y hay que
        sumar el traslado. En <Link href="/comprar-neumaticos-online-o-en-el-local">esta comparación</Link> hacemos la cuenta
        completa.
      </p>

      <h2>Alineado y balanceado: el costo que conviene sumar</h2>
      <p>
        Un juego nuevo con el auto desalineado se desgasta mal y vibra. El alineado y balanceado no se incluye en la colocación,
        porque son servicios de taller con equipo propio, pero es lo que protege la inversión. Podés ver el detalle en{" "}
        <Link href="/servicios">nuestros servicios</Link> y el tiempo que lleva en{" "}
        <Link href="/blog/cuanto-tarda-alineado-y-balanceado">esta nota</Link>.
      </p>

      <h2>Cómo bajar el total sin comprar mal</h2>
      <ul>
        <li>
          <strong>Compará por medida, no por marca.</strong> Con la medida exacta de tu auto, mirá todo lo que hay en stock:{" "}
          <Link href="/neumaticos">buscador por medida o por auto</Link>.
        </li>
        <li>
          <strong>Armá el presupuesto completo.</strong> En el <Link href="/cotizador">cotizador</Link> ves los cuatro neumáticos,
          el alineado y el total, con las cuotas de cada medio de pago.
        </li>
        <li>
          <strong>Cambiá los cuatro juntos.</strong> Si hoy cambiás dos y en un año otros dos, pagás dos veces el servicio. Lo
          explicamos en <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">cambiar uno o de a pares</Link>.
        </li>
      </ul>
    </ArticleLayout>
  );
}
