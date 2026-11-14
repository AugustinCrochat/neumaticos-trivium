import Link from "@/components/ui/Link";
import { TIRE_RIMS } from "@/lib/config";
import { MEDIDAS_PRIORITARIAS, formatSize, rimSlug, sizeSlug, sizesEqual } from "@/lib/tire-sizes";
import type { TireProduct } from "@/lib/types";
import { GomeriaAtajo } from "@/components/home/GomeriaAtajo";

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

/**
 * Grilla de medidas en la home.
 *
 * Le da al visitante un atajo a su medida sin tipear, y al crawler enlaces
 * directos desde la página de más autoridad del sitio hacia las landings de
 * medida. Sin esta grilla, esas páginas cuelgan sólo del hub y del footer.
 *
 * Cada tarjeta muestra el precio del neumático más barato con stock de esa
 * medida: un número concreto invita a entrar más que "Ver precios". El
 * catálogo llega de la home, que ya lo trae en build (el sitio es estático y
 * se redespliega cada 2 h, así que no hay fetch en runtime); sin stock, la
 * tarjeta vuelve a "Ver precios".
 */
export function PopularSizesSection({ productos }: { productos: TireProduct[] }) {
  const medidas = MEDIDAS_PRIORITARIAS.slice(0, 18);
  const precio = (size: (typeof medidas)[number]) => {
    const precios = productos
      .filter((p) => p.enStock !== false && !p.isCarga && sizesEqual(p.size, size))
      .map((p) => p.price);
    return precios.length ? Math.min(...precios) : null;
  };

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4">
        <div className="mb-8 max-w-3xl">
          <h2 className="font-display text-4xl font-extrabold uppercase italic tracking-wide text-navy-900">Elegí tu medida</h2>
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
              // Etiqueta de góndola: la medida arriba y el precio en la franja
              // amarilla. Borde duro y sombra roja al pasar, en vez de tarjeta suave.
              className="overflow-hidden rounded-md border-2 border-black bg-white text-center transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#ff1e00]"
            >
              <span className="font-display block px-2 py-2 text-xl font-bold tracking-wide text-black">{formatSize(size)}</span>
              {precio(size) ? (
                <span className="font-display block bg-precio-400 py-1 text-2xl font-extrabold italic leading-none text-black">{money(precio(size)!)}</span>
              ) : (
                <span className="block bg-slate-100 py-1.5 text-xs font-bold leading-[1.15rem] text-slate-500">Ver precios</span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {([
            ["/neumaticos-baratos", "Neumáticos baratos", "El mejor precio de cada rodado."],
            ["/neumaticos/at", "Neumáticos A/T", "All Terrain para camionetas y 4x4."],
            ["/neumaticos/carga", "Neumáticos de carga", "Para furgones y utilitarios."],
            // Va directo a la ficha del combo: desde la página más fuerte del
            // sitio, con el texto "alineado y balanceado", es la señal para que
            // Google la prefiera a la nota del blog.
            ["/servicios/combo-alineado-y-balanceado", null, null],
          ] as [string, string | null, string | null][]).map(([href, titulo, detalle]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-400 hover:shadow-md"
            >
              {titulo ? (
                <>
                  <span className="block font-black text-navy-900">{titulo}</span>
                  <span className="mt-1 block text-sm text-slate-600">{detalle}</span>
                </>
              ) : (
                <GomeriaAtajo />
              )}
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
