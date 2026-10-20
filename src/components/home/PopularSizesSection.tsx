import Link from "next/link";
import { TIRE_RIMS } from "@/lib/config";
import { MEDIDAS_PRIORITARIAS, formatSize, rimSlug, sizeSlug } from "@/lib/tire-sizes";

/**
 * Grilla de medidas en la home.
 *
 * Le da al visitante un atajo a su medida sin tipear, y al crawler enlaces
 * directos desde la página de más autoridad del sitio hacia las landings de
 * medida. Sin esta grilla, esas páginas cuelgan sólo del hub y del footer.
 *
 * NO consulta el catálogo, a propósito. Una versión anterior mostraba acá la
 * cantidad de modelos en stock por medida, lo que obligaba a un fetch al POS
 * para renderizar la home. Como el caché incremental de OpenNext está sin R2
 * (ver open-next.config.ts), la revalidación no persiste entre isolates: cada
 * isolate frío de Cloudflare rehacía el render y esperaba la red, y el primer
 * visitante después de un rato de calma se comía 3 segundos. El dato de stock
 * no valía ese costo en la página más visitada del sitio: quien entra a la
 * medida lo ve ahí, ya con el precio al lado.
 */
export function PopularSizesSection() {
  const medidas = MEDIDAS_PRIORITARIAS.slice(0, 18);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4">
        <div className="mb-8 max-w-3xl">
          <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-navy-900">Elegí tu medida</h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            Estas son las medidas que más nos piden. Entrá a la tuya y vas a ver los modelos
            disponibles con precio y stock, los autos que la usan de fábrica y qué medidas
            equivalentes te sirven si la tuya está agotada.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {medidas.map((size) => (
            <Link
              key={sizeSlug(size)}
              href={`/neumaticos/${sizeSlug(size)}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-navy-400 hover:shadow-md"
            >
              <span className="font-display block text-xl font-bold tracking-wide text-navy-900">{formatSize(size)}</span>
              <span className="mt-1 block text-xs font-bold text-slate-500">Ver precios</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["/neumaticos-baratos", "Neumáticos baratos", "El mejor precio de cada rodado."],
            ["/neumaticos/at", "Neumáticos A/T", "All Terrain para camionetas y 4x4."],
            ["/neumaticos/carga", "Neumáticos de carga", "Para furgones y utilitarios."],
            ["/servicios", "Gomería: alineación y balanceo", "Por orden de llegada, en Córdoba."],
          ].map(([href, titulo, detalle]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-400 hover:shadow-md"
            >
              <span className="block font-black text-navy-900">{titulo}</span>
              <span className="mt-1 block text-sm text-slate-600">{detalle}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-sm font-black uppercase tracking-widest text-slate-400">
            Por rodado
          </span>
          {TIRE_RIMS.filter((rim) => rim >= 13 && rim <= 18).map((rim) => (
            <Link
              key={rim}
              href={`/neumaticos/${rimSlug(rim)}`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-navy-900 transition-colors hover:border-navy-400"
            >
              R{rim}
            </Link>
          ))}
          <Link
            href="/neumaticos"
            className="text-sm font-bold text-navy-700 underline underline-offset-2 hover:text-navy-900"
          >
            Ver todas las medidas
          </Link>
        </div>
      </div>
    </section>
  );
}
