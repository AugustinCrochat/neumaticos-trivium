import type { Metadata } from "next";
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <header className="relative overflow-hidden bg-black py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #ff1e00 0, #ff1e00 2px, transparent 2px, transparent 22px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ff1e00] px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-lg animate-pulse">
            ⏱️ Ofertas por tiempo limitado
          </span>
          <h1 className="mt-6 text-5xl font-black leading-tight text-white md:text-7xl drop-shadow-md">
            SALE <span className="text-[#ff1e00]">TRIVIUM</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl font-medium text-slate-300">
            Aprovechá estos precios especiales hasta agotar stock. ¡Equipá tu auto con la mejor calidad!
          </p>
        </div>
      </header>

      {/* Beneficios Banner */}
      <div className="bg-gradient-to-r from-[#ff1e00] to-[#cc1800] py-8 border-y-4 border-black">
        <div className="mx-auto max-w-7xl px-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-4 text-white">
              <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-black text-xl leading-tight">Stock Limitado</p>
                <p className="text-sm font-medium text-white/90">Apurate antes de que se agoten</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white">
              <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-black text-xl leading-tight">Instalación Gratis</p>
                <p className="text-sm font-medium text-white/90">Colocación y válvulas sin cargo</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white">
              <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-black text-xl leading-tight">Medios de Pago</p>
                <p className="text-sm font-medium text-white/90">Efectivo, Tarjetas y Cuotas Fijas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-14">
        {ofertasNeumaticos.length === 0 && ofertasAccesorios.length === 0 ? (
          <p className="py-20 text-center text-slate-500 font-medium text-lg">
            No hay ofertas activas en este momento. ¡Volvé a pasar pronto!
          </p>
        ) : (
          <>
            {ofertasNeumaticos.length > 0 && (
              <section className="mb-20">
                <div className="flex items-end justify-between mb-8 border-b-2 border-slate-200 pb-4">
                  <div>
                    <h2 className="text-3xl font-black text-navy-900">Neumáticos</h2>
                    <p className="text-slate-500 font-medium mt-1">Llevá calidad con instalación incluida en nuestras sucursales</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                  {ofertasNeumaticos.map((producto) => (
                    <div
                      key={producto.id}
                      className="rounded-[1.4rem] bg-gradient-to-b from-[#ff1e00]/60 to-transparent p-[3px] shadow-lg hover:-translate-y-1 transition-transform"
                    >
                      <ProductCard product={producto} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {ofertasAccesorios.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-8 border-b-2 border-slate-200 pb-4">
                  <div>
                    <h2 className="text-3xl font-black text-navy-900">Accesorios</h2>
                    <p className="text-slate-500 font-medium mt-1">Completá tu compra con estos accesorios en promoción</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                  {ofertasAccesorios.map((accesorio) => (
                    <div
                      key={accesorio.id}
                      className="rounded-[1.4rem] bg-gradient-to-b from-[#ff1e00]/60 to-transparent p-[3px] shadow-lg hover:-translate-y-1 transition-transform"
                    >
                      <AccessoryCard accessory={accesorio} priceOld={accesorio.priceOld} />
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
