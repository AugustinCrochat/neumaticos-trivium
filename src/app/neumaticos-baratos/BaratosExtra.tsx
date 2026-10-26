import Link from "@/components/ui/Link";
import type { TireProduct } from "@/lib/types";
import { rimSlug } from "@/lib/tire-sizes";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

/**
 * Contenido editorial de /neumaticos-baratos. La tabla sale del catálogo (se
 * actualiza con cada deploy); el texto no cita cifras que puedan quedar viejas.
 */
export function BaratosExtra({ productos }: { productos: TireProduct[] }) {
  const porRodado = [
    ...productos
      .filter((p) => p.enStock)
      .reduce((m, p) => m.set(p.size.rim, [...(m.get(p.size.rim) ?? []), p]), new Map<number, TireProduct[]>())
      .entries(),
  ]
    .map(([rim, items]) => ({ rim, barato: [...items].sort((a, b) => a.price - b.price)[0], cantidad: items.length }))
    .sort((a, b) => a.rim - b.rim);

  return (
    <>
      {porRodado.length > 0 && (
        <section className="mb-14">
          <h2 className="font-display mb-2 text-3xl font-bold uppercase tracking-wide text-slate-900">
            El mejor precio en cada rodado
          </h2>
          <p className="mb-5 max-w-3xl text-slate-600">
            El neumático más económico con stock en cada rodado, con IVA incluido y precio por unidad. Es el mismo
            precio que se cobra en el local de Córdoba.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-2.5 py-3 sm:px-4">Rodado</th>
                  <th className="px-2.5 py-3 sm:px-4">Desde</th>
                  <th className="px-2.5 py-3 sm:px-4">Modelo más económico</th>
                  <th className="px-2.5 py-3 sm:px-4">Modelos con stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {porRodado.map(({ rim, barato, cantidad }) => (
                  <tr key={rim}>
                    <td className="px-2.5 py-3 sm:px-4 font-black text-slate-900">
                      <Link href={`/neumaticos/${rimSlug(rim)}`} className="hover:text-[#ff1e00]">
                        Rodado {rim}
                      </Link>
                    </td>
                    <td className="px-2.5 py-3 sm:px-4 font-black text-slate-900">{formatPrice(barato.price)}</td>
                    <td className="px-2.5 py-3 sm:px-4 text-slate-600">
                      <Link href={`/productos/${barato.slug}`} className="hover:text-[#ff1e00]">
                        {barato.brand} {barato.model}
                      </Link>
                    </td>
                    <td className="px-2.5 py-3 sm:px-4 text-slate-600">{cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-14 max-w-3xl space-y-4 leading-relaxed text-slate-700">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">
          Cómo conseguimos el mejor precio en neumáticos
        </h2>
        <p>
          Importamos de forma directa y vendemos al público desde nuestro propio local. En el camino habitual de una
          cubierta hay importador, distribuidor mayorista, distribuidor regional y gomería, y cada eslabón suma su
          margen. Sacando los intermedios, esa diferencia llega al precio.
        </p>
        <p>
          No son neumáticos usados ni remanufacturados: son nuevos, con un año de garantía por defecto de fabricación.
          El precio publicado en la web es el que se cobra en el mostrador, y la colocación y el cambio de válvulas no
          tienen cargo si comprás las cubiertas en el local.
        </p>
      </section>

      <section className="mb-14 max-w-3xl space-y-4 leading-relaxed text-slate-700">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">
          Cómo comparar el precio de las cubiertas
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Compará la misma medida y el mismo índice de carga y velocidad: un neumático que parece más barato puede
            ser de otra especificación.
          </li>
          <li>
            Fijate si el precio es por unidad o por el juego de cuatro, y si incluye IVA y colocación.
          </li>
          <li>
            Mirá el costo por kilómetro y no sólo el precio de góndola:{" "}
            <Link href="/blog/precio-calidad-neumaticos-costo-por-km" className="font-bold text-[#cc1800] underline underline-offset-4">
              te explicamos cómo calcularlo
            </Link>
            .
          </li>
          <li>
            Sumá alineación y balanceo al presupuesto: hacerlos al cambiar el juego es lo que hace que las cubiertas
            nuevas duren lo que tienen que durar.
          </li>
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="font-display mb-4 text-3xl font-bold uppercase tracking-wide text-slate-900">
          Otras formas de ahorrar
        </h2>
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[
            ["/ofertas", "Ofertas de neumáticos", "Precios especiales por tiempo limitado."],
            ["/neumaticos/carga", "Neumáticos de carga", "Para furgones y utilitarios, a precio bajo."],
            ["/neumaticos/at", "Neumáticos A/T", "All Terrain para camionetas y 4x4."],
            ["/neumaticos-para-remises-taxis-y-uber", "Remises, taxis y Uber", "Medidas por modelo y costo por kilómetro."],
            ["/servicios", "Gomería en Córdoba", "Alineación, balanceo y rotación por orden de llegada."],
          ].map(([href, titulo, detalle]) => (
            <li key={href}>
              <Link href={href} className="block h-full rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#ff1e00]">
                <span className="block font-black text-slate-900">{titulo}</span>
                <span className="mt-1 block text-sm text-slate-600">{detalle}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
