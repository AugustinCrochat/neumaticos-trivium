import type { Metadata } from "next";
import { ProductCard } from "@/components/ui/ProductCard";
import { AccessoryCard } from "@/components/ui/AccessoryCard";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ofertas de neumáticos y accesorios",
  description:
    "Ofertas de la semana en Neumáticos Trivium: precios especiales en neumáticos Grenlander y tuercas antirrobo, por tiempo limitado y hasta agotar stock.",
  alternates: canonical("/ofertas"),
};

// Selección curada a mano (no viene de un campo "en oferta" del POS): los
// slugs de los neumáticos y el accesorio que se destacan esta semana. El
// precio tachado se calcula acá mismo, un 10% arriba del precio real del
// POS — no es un dato que exista en el POS, así que no se persiste en
// ningún lado, se recalcula en cada render a partir del precio vigente.
const OFFER_TIRE_SLUGS = [
  "grenlander-colo-h02-175-65-r14-86t",
  "grenlander-maga-a-t-two-235-75-r15-101s",
  "grenlander-colo-h02-185-65-r14-86h",
  "grenlander-colo-h02-175-70-r13-82t",
];

const OFFER_ACCESSORY_SLUGS = ["antirrobo-fiesta-ka-premium-z3-66160"];

function withOfferPrice(price: number) {
  return Math.round((price * 1.1) / 100) * 100;
}

export default async function OfertasPage() {
  const sucursal = await getSelectedBranchSlug();
  const [productos, accesorios] = await Promise.all([
    getProductosDesdePOS(sucursal),
    getAccesoriosDesdePOS(sucursal),
  ]);

  const ofertasNeumaticos = OFFER_TIRE_SLUGS.map((slug) => productos.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => !!p
  );
  const ofertasAccesorios = OFFER_ACCESSORY_SLUGS.map((slug) => accesorios.find((a) => a.slug === slug)).filter(
    (a): a is NonNullable<typeof a> => !!a
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-black via-navy-950 to-navy-900 py-14 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #ff1e00 0, #ff1e00 2px, transparent 2px, transparent 22px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">
            Por tiempo limitado
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
            Ofertas <span className="text-orange-400">Trivium</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-slate-300">
            Precios especiales en medidas seleccionadas, hasta agotar stock. Importación directa,
            garantía de 1 año.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        {ofertasNeumaticos.length === 0 && ofertasAccesorios.length === 0 ? (
          <p className="py-20 text-center text-slate-500">
            No hay ofertas activas en este momento. Volvé a pasar pronto.
          </p>
        ) : (
          <>
            {ofertasNeumaticos.length > 0 && (
              <section className="mb-14">
                <h2 className="mb-6 text-2xl font-black text-navy-900">Neumáticos en oferta</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                  {ofertasNeumaticos.map((producto) => (
                    <div
                      key={producto.id}
                      className="rounded-[1.4rem] bg-gradient-to-b from-orange-500/40 to-transparent p-[2px]"
                    >
                      <ProductCard product={{ ...producto, priceOld: withOfferPrice(producto.price) }} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {ofertasAccesorios.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-black text-navy-900">Accesorios en oferta</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                  {ofertasAccesorios.map((accesorio) => (
                    <div
                      key={accesorio.id}
                      className="rounded-[1.4rem] bg-gradient-to-b from-orange-500/40 to-transparent p-[2px]"
                    >
                      <AccessoryCard accessory={accesorio} priceOld={withOfferPrice(accesorio.price)} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
