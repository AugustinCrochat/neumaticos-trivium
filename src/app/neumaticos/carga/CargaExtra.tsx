import Link from "@/components/ui/Link";
import type { TireProduct } from "@/lib/types";
import { cargaCapacityLabel, cargaSlug, formatCargaSize } from "@/lib/carga";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Fotos reales del taller (un Fiat Ducato con cubiertas de carga nuevas). */
export const FOTOS_CARGA = [
  {
    src: "/images/local/cubierta-de-carga-nueva-colocada-en-fiat-ducato-trivium.webp",
    alt: "Cubierta de carga nueva ya colocada en la llanta de un Fiat Ducato",
    caption: "Cubierta de carga nueva, ya colocada en una Ducato.",
    position: "center 60%",
  },
  {
    src: "/images/local/tecnico-colocando-rueda-de-carga-en-fiat-ducato-trivium.webp",
    alt: "Técnico del taller colocando una rueda con cubierta de carga en un Fiat Ducato sobre el elevador",
    caption: "Colocación en el momento, con el utilitario sobre el elevador.",
    position: "center 55%",
  },
  {
    src: "/images/local/fiat-ducato-con-cubiertas-de-carga-nuevas-en-el-taller-trivium.webp",
    alt: "Fiat Ducato furgón con cubiertas de carga nuevas en el taller de Trivium",
    caption: "La Ducato lista, con las cubiertas de carga nuevas.",
    position: "center 70%",
  },
] as const;

/** Una foto por pantalla de medida, rotando para no repetir siempre la misma. */
export function FotoCarga({ indice }: { indice: number }) {
  const foto = FOTOS_CARGA[indice % FOTOS_CARGA.length];
  return (
    <figure className="mb-10 max-w-md overflow-hidden rounded-2xl border border-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={foto.src} alt={foto.alt} loading="lazy" width={960} height={1280} className="aspect-[4/3] w-full object-cover" style={{ objectPosition: foto.position }} />
      <figcaption className="bg-slate-50 px-4 py-2 text-xs text-slate-500">{foto.caption}</figcaption>
    </figure>
  );
}

/**
 * Contenido editorial de /neumaticos/carga: la tabla de precios por medida sale
 * del catálogo (se actualiza con cada deploy), el resto es texto fijo que no
 * cita cifras que puedan quedar viejas.
 */
export function CargaExtra({ productos }: { productos: TireProduct[] }) {
  const porMedida = [
    ...productos
      .reduce((m, p) => m.set(cargaSlug(p.size), [...(m.get(cargaSlug(p.size)) ?? []), p]), new Map<string, TireProduct[]>())
      .values(),
  ]
    .map((items) => {
      const conStock = items.filter((p) => p.enStock);
      const base = conStock.length ? conStock : items;
      const barato = [...base].sort((a, b) => a.price - b.price)[0];
      return { size: items[0].size, desde: conStock.length ? barato.price : null, items, barato, conStock: conStock.length };
    })
    .sort((a, b) => a.size.rim - b.size.rim || a.size.width - b.size.width);

  return (
    <>
      {porMedida.length > 0 && (
        <section className="mb-14">
          <h2 className="font-display mb-2 text-3xl font-bold uppercase tracking-wide text-slate-900">
            Precio por medida
          </h2>
          <p className="mb-5 max-w-3xl text-slate-600">
            Precio por unidad con IVA incluido, del modelo más económico con stock en cada medida. Se actualiza con el
            catálogo del local.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-2.5 py-3 sm:px-4">Medida</th>
                  <th className="px-2.5 py-3 sm:px-4">Desde</th>
                  <th className="px-2.5 py-3 sm:px-4">Capacidad por rueda</th>
                  <th className="px-2.5 py-3 sm:px-4">Con stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {porMedida.map(({ size, desde, barato, conStock }) => (
                  <tr key={cargaSlug(size)}>
                    <td className="px-2.5 py-3 sm:px-4 font-black text-slate-900">
                      <Link href={`/neumaticos/carga/${cargaSlug(size)}`} className="hover:text-[#ff1e00]">
                        {formatCargaSize(size)}
                      </Link>
                    </td>
                    <td className="px-2.5 py-3 sm:px-4 font-bold">{desde ? formatPrice(desde) : "Consultar"}</td>
                    <td className="px-2.5 py-3 sm:px-4 text-slate-600">{cargaCapacityLabel(barato) ?? "—"}</td>
                    <td className="px-2.5 py-3 sm:px-4 text-slate-600">
                      {conStock > 0 ? `${conStock} ${conStock === 1 ? "modelo" : "modelos"}` : "Sin stock"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-14">
        <h2 className="font-display mb-4 text-3xl font-bold uppercase tracking-wide text-slate-900">
          Neumático de carga vs. de auto
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2.5 py-3 sm:px-4"> </th>
                <th className="px-2.5 py-3 sm:px-4">De carga (C)</th>
                <th className="px-2.5 py-3 sm:px-4">De auto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-2.5 py-3 sm:px-4 font-bold">Medida</td>
                <td className="px-2.5 py-3 sm:px-4">195/70 R15C</td>
                <td className="px-2.5 py-3 sm:px-4">195/70 R15</td>
              </tr>
              <tr>
                <td className="px-2.5 py-3 sm:px-4 font-bold">Carcasa</td>
                <td className="px-2.5 py-3 sm:px-4">Reforzada, más lonas</td>
                <td className="px-2.5 py-3 sm:px-4">Estándar</td>
              </tr>
              <tr>
                <td className="px-2.5 py-3 sm:px-4 font-bold">Índice de carga</td>
                <td className="px-2.5 py-3 sm:px-4">Dos números (simple/dual), ej. 104/102</td>
                <td className="px-2.5 py-3 sm:px-4">Un solo número, ej. 91</td>
              </tr>
              <tr>
                <td className="px-2.5 py-3 sm:px-4 font-bold">Presión de trabajo</td>
                <td className="px-2.5 py-3 sm:px-4">Más alta, según la carga</td>
                <td className="px-2.5 py-3 sm:px-4">Más baja</td>
              </tr>
              <tr>
                <td className="px-2.5 py-3 sm:px-4 font-bold">Uso</td>
                <td className="px-2.5 py-3 sm:px-4">Furgones, utilitarios, reparto</td>
                <td className="px-2.5 py-3 sm:px-4">Autos de pasajeros</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="font-display mb-2 text-3xl font-bold uppercase tracking-wide text-slate-900">
          Colocadas en el taller
        </h2>
        <p className="mb-5 max-w-3xl text-slate-600">
          Fotos reales de un furgón que cambió sus cubiertas de carga en nuestro local: arme, desarme y colocación en el día.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {FOTOS_CARGA.map((foto) => (
            <figure key={foto.src} className="overflow-hidden rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.src} alt={foto.alt} loading="lazy" width={960} height={1280} className="aspect-[3/4] w-full object-cover" style={{ objectPosition: foto.position }} />
              <figcaption className="hidden bg-slate-50 px-3 py-2 text-xs text-slate-500 sm:block">{foto.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="font-display mb-4 text-3xl font-bold uppercase tracking-wide text-slate-900">
          Cómo elegir en tres pasos
        </h2>
        <ol className="max-w-3xl list-decimal space-y-3 pl-5 leading-relaxed text-slate-700">
          <li>
            <strong>Mirá la calcomanía</strong> del marco de la puerta del conductor: ahí figuran la medida y el índice
            de carga originales.
          </li>
          <li>
            <strong>Mantené la C y el índice.</strong> El reemplazo tiene que ser C y con un índice igual o mayor. Si el
            vehículo anda siempre cargado, no bajes de lo original.
          </li>
          <li>
            <strong>Compará el costo por kilómetro, no solo el precio.</strong> En un vehículo de trabajo un neumático
            que dura más compensa la diferencia; la nota de{" "}
            <Link href="/blog/precio-calidad-neumaticos-costo-por-km" className="font-bold text-[#ff1e00] underline">
              costo por kilómetro
            </Link>{" "}
            explica cómo calcularlo.
          </li>
        </ol>
        <p className="mt-4 max-w-3xl text-slate-600">Para profundizar:</p>
        <ul className="mt-2 max-w-3xl list-disc space-y-1 pl-5 text-slate-700">
          <li>
            <Link href="/blog/neumaticos-para-utilitarios-furgones-reparto" className="font-bold text-[#ff1e00] underline">
              Neumáticos para utilitarios, furgones y reparto: cómo elegir
            </Link>
          </li>
          <li>
            <Link href="/blog/neumatico-c-o-de-auto-utilitario" className="font-bold text-[#ff1e00] underline">
              ¿Neumático C o de auto en un utilitario?
            </Link>
          </li>
          <li>
            <Link href="/blog/presion-neumaticos-utilitarios-con-carga" className="font-bold text-[#ff1e00] underline">
              Presión de neumáticos en utilitarios con carga
            </Link>
          </li>
          <li>
            <Link href="/blog/carga-simple-y-dual-neumaticos-c" className="font-bold text-[#ff1e00] underline">
              Carga simple y dual en neumáticos C
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
