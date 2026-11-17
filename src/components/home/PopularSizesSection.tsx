import Link from "@/components/ui/Link";
import { MEDIDAS_PRIORITARIAS, rimSlug, sizeSlug, sizesEqual } from "@/lib/tire-sizes";
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
  const medidas = MEDIDAS_PRIORITARIAS;
  const precio = (size: (typeof medidas)[number]) => {
    const precios = productos
      .filter((p) => p.enStock !== false && !p.isCarga && sizesEqual(p.size, size))
      .map((p) => p.price);
    return precios.length ? Math.min(...precios) : null;
  };

  const rodados = [...new Set(medidas.map((m) => m.rim))].sort((a, b) => a - b);
  const porRodado = (rim: number) =>
    medidas
      .filter((m) => m.rim === rim)
      .sort((a, b) => a.width - b.width || a.profile - b.profile);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl xl:max-w-[112.5rem] xl:px-8 2xl:px-10 px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 className="font-display text-4xl font-extrabold uppercase italic tracking-wide text-navy-900">Elegí tu medida</h2>
            <p className="mt-2 text-base text-slate-600">
              Tocá la tuya: precio, stock, los autos que la usan y las medidas equivalentes.
            </p>
          </div>
          <Link href="/neumaticos" className="text-sm font-bold text-navy-700 underline underline-offset-2 hover:text-navy-900">
            Ver todas las medidas
          </Link>
        </div>

        {/* Una columna por rodado: la medida se encuentra sin leer todo. Las que
            no tienen stock hoy siguen enlazadas (SEO y equivalencias), pero como
            línea gris, no como tarjeta que parezca rota. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {rodados.map((rim) => (
            <div key={rim}>
              <Link
                href={`/neumaticos/${rimSlug(rim)}`}
                className="font-display flex items-center justify-between bg-black px-3 py-1.5 text-2xl font-extrabold italic text-white transition hover:bg-orange-500"
              >
                R{rim}
                <span aria-hidden="true" className="text-base not-italic">›</span>
              </Link>
              <ul className="border-x-2 border-b-2 border-black bg-white">
                {porRodado(rim).map((size) => {
                  const desde = precio(size);
                  return (
                    <li key={sizeSlug(size)} className="border-t border-slate-200 first:border-t-0">
                      <Link
                        href={`/neumaticos/${sizeSlug(size)}`}
                        className="flex items-center justify-between gap-2 px-3 py-2 transition hover:bg-slate-50"
                      >
                        <span className={`font-display text-lg font-bold tracking-wide ${desde ? "text-black" : "text-slate-400"}`}>
                          {size.width}/{size.profile}
                        </span>
                        {desde ? (
                          <span className="font-display bg-precio-400 px-1.5 text-base font-extrabold italic leading-6 text-black">{money(desde)}</span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">Ver</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {([
            ["/neumaticos-baratos", "Neumáticos baratos", "El mejor precio de cada rodado.", "/images/local/descarga-de-neumaticos-importados-grenlander-del-camion-trivium-cordoba.webp", "Descarga de neumáticos importados en Trivium Córdoba"],
            ["/neumaticos/at", "Neumáticos A/T", "All Terrain para camionetas y 4x4.", "/images/usos/at.webp", "Camioneta 4x4 con neumáticos All Terrain"],
            ["/neumaticos/carga", "Neumáticos de carga", "Para furgones y utilitarios.", "/images/usos/carga.webp", "Furgón con neumáticos de carga"],
            // Va directo a la ficha del combo: desde la página más fuerte del
            // sitio, con el texto "alineado y balanceado", es la señal para que
            // Google la prefiera a la nota del blog.
            ["/servicios/combo-alineado-y-balanceado", null, null, "/images/local/tecnicos-alineando-auto-elevador-gomeria-trivium-cordoba.webp", "Técnicos alineando un auto en el taller de Trivium"],
          ] as [string, string | null, string | null, string, string][]).map(([href, titulo, detalle, foto, alt]) => (
            <Link
              key={href}
              href={href}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-navy-400 hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <span className="block overflow-hidden"><img src={foto} alt={alt} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105" /></span>
              <div className="p-4">
                {titulo ? (
                  <>
                    <span className="block font-black text-navy-900">{titulo}</span>
                    <span className="mt-1 block text-sm text-slate-600">{detalle}</span>
                  </>
                ) : (
                  <GomeriaAtajo />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
