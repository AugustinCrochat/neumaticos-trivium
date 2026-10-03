import type { Metadata } from "next";
import { PaymentMethodsSection } from "@/components/ui/PaymentMethodsSection";
import { ProductCard } from "@/components/ui/ProductCard";
import { AccessoryCard } from "@/components/ui/AccessoryCard";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { canonical } from "@/lib/seo";
import { OFFER_TIRE_SLUGS, OFFER_ACCESSORY_SLUGS } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Ofertas de neumáticos y accesorios",
  description:
    "Ofertas de la semana en Neumáticos Trivium: precios especiales en neumáticos Grenlander y tuercas antirrobo, por tiempo limitado y hasta agotar stock.",
  alternates: canonical("/ofertas"),
};

const BENEFICIOS = [
  {
    titulo: "Stock limitado",
    detalle: "Precios válidos hasta agotar stock",
    icono: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    titulo: "Instalación gratis",
    detalle: "Colocación y válvulas sin cargo",
    // Ícono de la desarmadora (el mismo de /servicios). El SVG es negro fijo,
    // así que se pasa a blanco con brightness-0 + invert.
    icono: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/icons/servicios/desarmadora.svg" alt="" className="h-7 w-7 brightness-0 invert" />
    ),
  },
  {
    titulo: "Medios de pago",
    detalle: "Efectivo, tarjetas y cuotas fijas",
    icono: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

function SectionHeading({ titulo, detalle, cantidad }: { titulo: string; detalle: string; cantidad?: number }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900 md:text-4xl">
          {titulo}
        </h2>
        <p className="mt-1 text-sm text-slate-500 md:text-base">{detalle}</p>
      </div>
      {cantidad != null && (
        <span className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
          {cantidad} {cantidad === 1 ? "oferta" : "ofertas"}
        </span>
      )}
    </div>
  );
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

  // Las cuotas se muestran sobre 1 neumático: el más barato de la selección.
  const precioBase = ofertasNeumaticos.length > 0 ? Math.min(...ofertasNeumaticos.map((p) => p.price)) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <header className="relative overflow-hidden bg-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #ff1e00 0, #ff1e00 2px, transparent 2px, transparent 26px)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[#ff1e00]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20">
          <span className="inline-block rounded-md bg-[#ff1e00] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Ofertas de la semana
          </span>
          <h1 className="font-display mt-4 text-5xl font-bold uppercase leading-[0.95] tracking-wide text-white md:text-7xl">
            Precios especiales,
            <br />
            <span className="text-[#ff1e00]">hasta agotar stock</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-300 md:text-lg">
            Neumáticos y accesorios seleccionados con descuento. Retirás y te los colocamos en el local, sin cargo.
          </p>
        </div>
      </header>

      {/* Beneficios */}
      <section className="border-b border-slate-200 bg-white">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-slate-200 sm:grid-cols-3">
          {BENEFICIOS.map((b) => (
            <li key={b.titulo} className="flex items-center gap-4 bg-white px-4 py-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff1e00] text-white">
                {b.icono}
              </span>
              <span>
                <span className="font-display block text-xl font-bold uppercase leading-tight tracking-wide text-slate-900">
                  {b.titulo}
                </span>
                <span className="block text-sm text-slate-500">{b.detalle}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        {ofertasNeumaticos.length === 0 && ofertasAccesorios.length === 0 ? (
          <p className="py-20 text-center text-lg text-slate-500">
            No hay ofertas activas en este momento. ¡Volvé a pasar pronto!
          </p>
        ) : (
          <div className="space-y-14">
            {ofertasNeumaticos.length > 0 && (
              <section>
                <SectionHeading
                  titulo="Neumáticos"
                  detalle="Con colocación y válvulas sin cargo en nuestros locales"
                  cantidad={ofertasNeumaticos.length}
                />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {ofertasNeumaticos.map((producto) => (
                    <ProductCard key={producto.id} product={producto} />
                  ))}
                </div>
              </section>
            )}

            {ofertasAccesorios.length > 0 && (
              <section>
                <SectionHeading
                  titulo="Accesorios"
                  detalle="Completá tu compra con estos accesorios en promoción"
                  cantidad={ofertasAccesorios.length}
                />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {ofertasAccesorios.map((accesorio) => (
                    <AccessoryCard key={accesorio.id} accessory={accesorio} priceOld={accesorio.priceOld} />
                  ))}
                </div>
              </section>
            )}

            {precioBase > 0 && (
              <section>
                <SectionHeading
                  titulo="Cómo pagar"
                  detalle="Tocá una tarjeta para ver las cuotas y recargos"
                />
                <div className="max-w-2xl">
                  <PaymentMethodsSection basePrice={precioBase} />
                  <p className="mt-2 text-xs text-slate-500">
                    Cuotas calculadas sobre un neumático de la selección. El detalle exacto lo ves en cada producto.
                  </p>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
