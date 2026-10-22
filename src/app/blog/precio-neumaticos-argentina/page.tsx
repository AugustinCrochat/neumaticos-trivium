import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { DEFAULT_BRANCH_ID, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "precio-neumaticos-argentina";
// El título original ("¿Cuánto sale un neumático en Argentina?") es correcto
// mas no incluye el término con más volumen de búsqueda para esta intención
// ("neumáticos baratos") pese a que el contenido ya está armado alrededor de
// eso — la tabla en vivo, "por qué vendemos más barato", el ranking de
// opciones más económicas. Retitulado para que el título refleje lo que la
// nota ya hace.
const TITLE = "Neumáticos baratos en Argentina: cuánto sale cada rodado";
const SUBTITLE =
  "Qué compone el precio de una cubierta, por qué varía tanto entre negocios y cuánto cuesta hoy cada rodado. Con precios reales de nuestro stock, actualizados automáticamente.";

// Los precios se leen del catálogo en vivo: una nota de precios con números
// escritos a mano queda desactualizada en semanas y termina siendo un pasivo.
export const metadata: Metadata = {
  ...blogShare("precio-neumaticos-argentina"),
  title: TITLE,
  description:
    "Cuánto sale un neumático barato o económico en Argentina según rodado y marca, qué hace que el precio varíe entre negocios y cómo comparar sin que te vendan humo. Con precios reales actualizados.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Por qué el mismo neumático cuesta tan distinto según dónde lo compres?",
    answer:
      "Porque la cadena de distribución tiene varios escalones: importador, distribuidor mayorista, distribuidor regional y comercio final, y cada uno suma su margen. Un mismo producto puede llegar al mostrador con dos o tres márgenes acumulados encima. Cuando el comercio importa directo, esos escalones desaparecen y la diferencia se ve en la etiqueta.",
  },
  {
    question: "¿Conviene comprar neumáticos por internet?",
    answer:
      "Conviene si el vendedor publica stock real y precio final. El riesgo de comprar online es pagar y después enterarte de que la medida no estaba, o que el precio no incluía algo. Fijate que el sitio muestre disponibilidad concreta, no un formulario de consulta, y que el costo de envío esté claro antes de pagar.",
  },
  {
    question: "¿Cuánto sale colocar los neumáticos?",
    answer:
      "Depende de dónde compres. En nuestro caso, comprando el neumático en el local, el arme, el desarme y el cambio de válvulas van sin cargo. El balanceo y la alineación se cobran aparte porque son servicios de taller con equipo propio. Si comprás en otro lado y traés las cubiertas, la colocación se cobra.",
  },
  {
    question: "¿Es más barato comprar los cuatro juntos?",
    answer:
      "El precio por unidad es el mismo, pero comprar los cuatro juntos rinde más: el desgaste queda parejo, el auto se comporta de forma previsible y hacés una sola vez la mano de obra de montaje. Además, si el juego se cambia de a dos con años de diferencia, terminás pagando dos veces el traslado y el balanceo.",
  },
  {
    question: "¿Dónde comprar neumáticos baratos en Córdoba?",
    answer:
      "En nuestro local de Argüello, con stock real y taller propio, o desde acá mismo si preferís envío a domicilio. También atendemos Villa Allende, Saldán, La Calera, Mendiolaza, Unquillo y Río Ceballos, con la misma gomería como referencia.",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function Page() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const enStock = productos.filter((p) => p.enStock);

  // Rango de precio por rodado: es la comparación que la gente hace de verdad
  // ("un R15 me sale más o menos tanto"), y sale del stock real.
  const porRodado = new Map<number, number[]>();
  for (const producto of enStock) {
    const lista = porRodado.get(producto.size.rim);
    if (lista) lista.push(producto.price);
    else porRodado.set(producto.size.rim, [producto.price]);
  }
  const rangos = [...porRodado.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([rim, precios]) => ({
      rim,
      min: Math.min(...precios),
      max: Math.max(...precios),
      cantidad: precios.length,
    }));

  const masBaratos = [...enStock].sort((a, b) => a.price - b.price).slice(0, 6);
  const actualizado = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-07-31"
      readingMinutes={6}
      faqs={FAQS}
    >
      <p>
        No hay una respuesta única, y cualquiera que te tire un número redondo sin preguntarte la
        medida te está vendiendo algo. El precio de una cubierta depende del rodado, del ancho, de
        la marca, del índice de carga y de cuántos intermediarios pasó antes de llegar al
        mostrador. Lo que sí podemos hacer es mostrarte números reales y explicarte de dónde salen.
      </p>

      {rangos.length > 0 && (
        <>
          <h2>Precios por rodado, hoy</h2>
          <p>
            Esta tabla sale directo de nuestro stock disponible y se actualiza sola. Última
            actualización: <strong>{actualizado}</strong>. Son precios por unidad, con IVA incluido.
          </p>
          <table>
            <thead>
              <tr>
                <th>Rodado</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Modelos</th>
              </tr>
            </thead>
            <tbody>
              {rangos.map((rango) => (
                <tr key={rango.rim}>
                  <td>
                    <strong>R{rango.rim}</strong>
                  </td>
                  <td>{formatPrice(rango.min)}</td>
                  <td>{formatPrice(rango.max)}</td>
                  <td>{rango.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            La lógica detrás de la tabla es sencilla: a mayor rodado y mayor ancho, más material y
            más precio. Un R13 angosto y un R18 ancho son productos de escalas distintas aunque
            cumplan la misma función.
          </p>
        </>
      )}

      <h2>Qué compone el precio de un neumático</h2>
      <p>
        Cuando pagás una cubierta, no estás pagando sólo la goma. El desglose aproximado de lo que
        hay adentro del precio final:
      </p>
      <ul>
        <li>
          <strong>El producto puesto en fábrica.</strong> Materia prima, compuesto, carcasa de acero
          y proceso de vulcanizado.
        </li>
        <li>
          <strong>Flete internacional y despacho.</strong> Los neumáticos ocupan mucho volumen y
          poco peso, así que el flete pesa más de lo que uno imagina.
        </li>
        <li>
          <strong>Derechos de importación y tasas.</strong> Es un rubro con protección arancelaria
          en Argentina, y ese porcentaje va directo al precio de góndola.
        </li>
        <li>
          <strong>La cadena de distribución.</strong> Acá está la variable que más explica la
          diferencia entre dos negocios que venden exactamente lo mismo.
        </li>
        <li>
          <strong>El margen del comercio final.</strong> Estructura, local, personal, garantía.
        </li>
      </ul>
      <p>
        Los primeros tres puntos son parecidos para todos. El cuarto es donde se juega la
        diferencia: cada escalón de la distribución suma su margen sobre el margen anterior, y para
        cuando el neumático llega a un mostrador que compró a un distribuidor regional, puede
        arrastrar tres márgenes encima del costo de importación.
      </p>

      <h2>Por qué nosotros podemos vender más barato</h2>
      <p>
        Porque importamos directo y vendemos al público desde nuestro propio local. No hay un
        distribuidor mayorista ni uno regional en el medio. Esa es toda la explicación, y es
        verificable: podés comparar la misma marca y el mismo modelo contra cualquier lista y ver
        la diferencia.
      </p>
      <p>
        Lo que <em>no</em> hacemos es vender barato bajando la calidad del producto. Las marcas con
        las que trabajamos tienen homologación europea y ensayos publicados. La comparación honesta
        entre las opciones{" "}
        <Link href="/blog/marcas-chinas-neumaticos-comparativa">la escribimos acá</Link>, incluida
        la parte incómoda de en qué se diferencian de una premium.
      </p>

      {masBaratos.length > 0 && (
        <>
          <h2>Las opciones más económicas en stock</h2>
          <table>
            <thead>
              <tr>
                <th>Medida</th>
                <th>Marca</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {masBaratos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <Link href={`/neumaticos/${sizeSlug(producto.size)}`}>
                      {formatSize(producto.size)}
                    </Link>
                  </td>
                  <td>{producto.brand}</td>
                  <td>
                    <strong>{formatPrice(producto.price)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Cómo comparar sin que te vendan humo</h2>
      <ol>
        <li>
          <strong>Compará la misma medida y el mismo modelo.</strong> Un 195/65 R15 y un 205/55 R16
          no son comparables, y dos modelos distintos de la misma marca tampoco.
        </li>
        <li>
          <strong>Preguntá si el precio incluye colocación.</strong> Un precio bajo con montaje
          caro aparte puede terminar siendo más caro.
        </li>
        <li>
          <strong>Chequeá el índice de carga y velocidad.</strong> A veces la diferencia de precio
          entre dos &quot;iguales&quot; es que uno tiene un índice más bajo.{" "}
          <Link href="/blog/indice-de-carga-y-velocidad">Acá explicamos cómo leerlos</Link>.
        </li>
        <li>
          <strong>Confirmá que haya stock físico.</strong> Un precio de lista sin stock no es un
          precio, es una expectativa.
        </li>
        <li>
          <strong>Mirá la fecha de fabricación.</strong> Un neumático &quot;nuevo&quot; de hace seis
          años no es lo mismo que uno del año pasado, aunque nunca haya rodado.
        </li>
      </ol>

      <h2>El costo total, no sólo el del neumático</h2>
      <p>
        Para que el cálculo cierre, sumá lo que va alrededor de la compra: si te lo enviamos, es
        gratis desde ${FREE_SHIPPING_THRESHOLD.toLocaleString("es-AR")} de compra, o $
        {SHIPPING_FLAT_RATE.toLocaleString("es-AR")} fijos por debajo de eso, a cualquier punto del
        país. Si retirás en el local, el retiro no tiene costo y la colocación va incluida.
        A eso sumale el balanceo, y la alineación si hace falta —{" "}
        <Link href="/blog/alineacion-y-balanceo">acá explicamos cuándo hace falta cada uno</Link>.
      </p>
      <p>
        <Link href="/neumaticos">Buscá tu medida</Link> y vas a ver el precio final de cada modelo
        disponible, sin tener que llamar ni llenar un formulario para que te coticen.
      </p>
    </ArticleLayout>
  );
}
