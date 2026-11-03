import type { Metadata } from "next";
import { OfertasMediosPago } from "./OfertasMediosPago";
import { formatSize } from "@/lib/tire-sizes";
import { AccessoryCard } from "@/components/ui/AccessoryCard";
import { getProductosDesdePOS, getAccesoriosDesdePOS, getServiciosPrecios } from "@/lib/pos-api";
import { preciosTaller } from "@/lib/servicios-seo";
import { OfertaRelampago, type Relampago } from "./OfertaRelampago";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { canonical } from "@/lib/seo";
import { OFFER_TIRE_SLUGS, OFFER_MIN_STOCK, esTuercaDeSeguridad } from "@/lib/offers";
import Link from "@/components/ui/Link";
import Image from "next/image";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { peersByGroup } from "@/lib/best-price";
import type { TireProduct } from "@/lib/types";

export const metadata: Metadata = {
  title: "Ofertas de neumáticos y tuercas de seguridad",
  description:
    "Ofertas en neumáticos para auto, camioneta, A/T y carga (Grenlander, Arivo, Pirelli) y en todas las tuercas de seguridad: precio con descuento, colocación y válvulas sin cargo, hasta agotar stock.",
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

const FAQS = [
  {
    question: "¿Los precios de oferta incluyen la colocación?",
    answer:
      "Sí. Si comprás los neumáticos en el local, el armado, el desarmado y el cambio de válvulas no se cobran. El balanceo y la alineación se cotizan aparte (o en combo, más barato).",
  },
  {
    question: "¿Hasta cuándo valen las ofertas?",
    answer:
      "Hasta agotar stock. El stock de cada medida se actualiza durante el día; si una oferta figura disponible, está en el local.",
  },
  {
    question: "¿El precio de la web es el mismo que en el local?",
    answer: "Sí, es el mismo. El precio con descuento que ves acá es el que pagás en el mostrador.",
  },
  {
    question: "¿Qué tuercas de seguridad tienen?",
    answer:
      "Todos los modelos de la lista, con el 15 % de descuento. Elegí la de tu auto y, si no la encontrás, escribinos con tu marca y modelo.",
  },
  {
    question: "¿Qué medios de pago aceptan?",
    answer:
      "Efectivo, transferencia, débito y tarjetas de crédito, con cuotas. Los miércoles y sábados hay 3 cuotas sin interés con Visa o Mastercard.",
  },
];

const pct = (p: TireProduct) => (p.priceOld ? Math.round((1 - p.price / p.priceOld) * 100) : 0);
const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

function Atajo({ href, titulo, detalle }: { href: string; titulo: string; detalle: string }) {
  return (
    <a href={href} className="rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-[#ff1e00]">
      <span className="block text-sm font-black text-slate-900">{titulo}</span>
      <span className="block text-xs text-slate-500">{detalle}</span>
    </a>
  );
}

export default async function OfertasPage() {
  const sucursal = await getSelectedBranchSlug();
  const [productos, accesorios, servicios] = await Promise.all([
    getProductosDesdePOS(sucursal),
    getAccesoriosDesdePOS(sucursal),
    getServiciosPrecios(undefined, sucursal),
  ]);
  const pt = preciosTaller(servicios);
  // Combo vs. por separado: el ahorro es real (alineado + 4 balanceos sueltos contra el precio del combo).
  const separado = pt.alineadoAuto && pt.balanceoAuto ? pt.alineadoAuto + 4 * pt.balanceoAuto : 0;
  const ahorroCombo = pt.comboAuto && separado > pt.comboAuto ? separado - pt.comboAuto : 0;

  // Solo los que siguen en descuento (con 4 unidades o más; ver OFFER_MIN_STOCK).
  const ofertas = OFFER_TIRE_SLUGS.map((slug) => productos.find((p) => p.slug === slug)).filter(
    (p): p is TireProduct => !!p && !!p.priceOld
  );
  // Primero lo que hay en stock; dentro de eso, lo más vendido.
  const porVenta = [...ofertas].sort(
    (a, b) => Number(b.enStock) - Number(a.enStock) || (b.vendidos ?? 0) - (a.vendidos ?? 0)
  );
  const masVendidas = porVenta.slice(0, 4);

  const auto = ofertas.filter((p) => !p.isAT && !p.isCarga);
  const camioneta = ofertas.filter((p) => p.isAT);
  const carga = ofertas.filter((p) => p.isCarga);
  // Oferta del día: una de auto, una de camioneta y una de carga, la de mayor descuento
  // de cada grupo.
  const mejorDe = (lista: TireProduct[]) =>
    lista.filter((p) => p.enStock && (p.stock ?? 0) >= OFFER_MIN_STOCK && p.priceOld).sort((a, b) => pct(b) - pct(a))[0];
  const elegidas = [mejorDe(auto), mejorDe(camioneta), mejorDe(carga)].filter((p): p is TireProduct => !!p);
  const relampago: Relampago[] = elegidas.map((p) => ({
    id: p.id,
    slug: p.slug,
    titulo: `${p.brand} ${p.modeloBase}`,
    medida: formatSize(p.size),
    imageUrl: p.imageUrl,
    price: p.price,
    priceOld: p.priceOld!,
    pct: pct(p),
    stock: p.stock ?? 0,
    tipo: p.isAT ? "at" : p.isCarga ? "carga" : undefined,
  }));
  const tuercas = accesorios
    .filter((a) => esTuercaDeSeguridad(a.nombre))
    .sort((a, b) => Number(b.enStock) - Number(a.enStock) || (b.vendidos ?? 0) - (a.vendidos ?? 0));

  const peers = peersByGroup(productos);
  const grid = (lista: TireProduct[]) => (
    <SortedProductGrid
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
      items={lista.map((product) => ({ product, peers: peers.get(product.id) }))}
    />
  );

  const maxPct = Math.max(0, ...ofertas.map(pct), tuercas.length ? 15 : 0);
  const desde = ofertas.length ? Math.min(...ofertas.map((p) => p.price)) : 0;
  const itemsCotizables = [
    ...ofertas.map((p) => ({ id: p.id, label: `${p.brand} ${p.model} ${formatSize(p.size)}`, price: p.price })),
    ...tuercas.map((a) => ({ id: a.id, label: a.nombre, price: a.price })),
  ];

  const secciones = [
    { id: "relampago", titulo: "Oferta del día", n: relampago.length },
    { id: "mas-vendidas", titulo: "Las más elegidas", n: masVendidas.length },
    { id: "auto", titulo: "Auto", n: auto.length },
    { id: "camioneta", titulo: "Camioneta y 4x4", n: camioneta.length },
    { id: "carga", titulo: "Carga", n: carga.length },
    { id: "tuercas", titulo: "Tuercas de seguridad", n: tuercas.length },
    { id: "servicios", titulo: "Servicios", n: ahorroCombo ? 3 : 0 },
  ].filter((x) => x.n > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative overflow-hidden bg-black">
        <Image
          src="/images/local/taller-de-gomeria-con-cuatro-autos-neumaticos-trivium-arguello-cordoba.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[#ff1e00]" />
        <div className="relative mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 md:py-20">
          <span className="inline-block rounded-md bg-[#ff1e00] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Ofertas
          </span>
          <h1 className="font-display mt-4 text-5xl font-bold uppercase leading-[0.95] tracking-wide text-white md:text-7xl">
            Precios especiales,
            <br />
            <span className="text-[#ff1e00]">hasta agotar stock</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-200 md:text-lg">
            {ofertas.length} neumáticos{tuercas.length ? ` y ${tuercas.length} tuercas de seguridad` : ""} con descuento. Retirás y te los colocamos en el local, sin cargo.
          </p>
          <dl className="mt-8 flex flex-wrap gap-3">
            {[
              [`Hasta ${maxPct}% OFF`, "sobre el precio de lista"],
              desde ? [`Desde ${fmt(desde)}`, "por neumático"] : null,
              ["Sin cargo", "colocación y válvulas"],
            ]
              .filter((x): x is string[] => !!x)
              .map(([t, d]) => (
                <div key={t} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                  <dt className="font-display text-2xl font-bold uppercase text-white">{t}</dt>
                  <dd className="text-xs text-slate-300">{d}</dd>
                </div>
              ))}
          </dl>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <ul className="mx-auto grid max-w-7xl 2xl:max-w-[96rem] grid-cols-1 gap-px bg-slate-200 sm:grid-cols-3">
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

      {/* Atajos a cada sección: la página es larga, esto evita scrollear de más. */}
      <nav aria-label="Secciones de ofertas" className="border-b border-slate-200 bg-white">
        <ul className="mx-auto flex max-w-7xl 2xl:max-w-[96rem] gap-2 overflow-x-auto px-4 py-2.5">
          {secciones.map((x) => (
            <li key={x.id} className="shrink-0">
              <a href={`#${x.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-bold text-slate-800 transition-colors hover:border-[#ff1e00] hover:text-[#ff1e00]">
                {x.titulo}
                <span className="rounded-full bg-slate-900 px-1.5 text-[11px] text-white">{x.n}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-10 md:py-14">
        <Breadcrumbs crumbs={[{ name: "Inicio", path: "/" }, { name: "Ofertas", path: "/ofertas" }]} />

        {ofertas.length === 0 && tuercas.length === 0 ? (
          <p className="py-20 text-center text-lg text-slate-500">
            No hay ofertas activas en este momento. ¡Volvé a pasar pronto!
          </p>
        ) : (
          <div className="space-y-14">
            <section className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-3 text-xl font-black text-slate-900">¿No ves tu medida? Buscala</h2>
              <SizeOrVehicleSearch compact hideLearnLink />
            </section>

            {relampago.length === 3 && <OfertaRelampago items={relampago} />}

            {masVendidas.length > 0 && (
              <section id="mas-vendidas" className="scroll-mt-24">
                <SectionHeading titulo="Las más elegidas" detalle="Las medidas que más salen del local, con descuento" cantidad={masVendidas.length} />
                {grid(masVendidas)}
              </section>
            )}

            {auto.length > 0 && (
              <section id="auto" className="scroll-mt-24">
                <SectionHeading titulo="Auto" detalle="Rodados 13 a 17 · colocación y válvulas sin cargo" cantidad={auto.length} />
                {grid(auto)}
              </section>
            )}

            {camioneta.length > 0 && (
              <section id="camioneta" className="scroll-mt-24">
                <SectionHeading titulo="Camioneta y 4x4" detalle="Todo terreno (A/T) para pick-ups y SUV" cantidad={camioneta.length} />
                {grid(camioneta)}
              </section>
            )}

            {carga.length > 0 && (
              <section id="carga" className="scroll-mt-24">
                <SectionHeading titulo="Carga y utilitarios" detalle="Cubiertas C para utilitarios, furgones y reparto" cantidad={carga.length} />
                {grid(carga)}
              </section>
            )}

            {tuercas.length > 0 && (
              <section id="tuercas" className="scroll-mt-24">
                <SectionHeading
                  titulo="Tuercas de seguridad"
                  detalle="Todos los modelos con 15 % de descuento · protegen tus llantas del robo"
                  cantidad={tuercas.length}
                />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {tuercas.map((accesorio) => (
                    <AccessoryCard key={accesorio.id} accessory={accesorio} priceOld={accesorio.priceOld} />
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  ¿Dudás cuál es la de tu auto? <Link href="/tuercas-antirrobo" className="font-bold text-slate-900 underline underline-offset-2">Buscala por marca y modelo</Link>.
                </p>
              </section>
            )}

            {ahorroCombo > 0 && pt.alineadoAuto && pt.balanceoAuto && pt.comboAuto && (
              <section id="servicios" className="scroll-mt-24">
                <SectionHeading titulo="Servicios" detalle="Hacelo todo en la misma visita y ahorrá · sin turno" cantidad={3} />
                <div className="grid gap-4 md:grid-cols-3">
                  <Link href="/servicios/combo-alineado-y-balanceado" className="relative flex flex-col rounded-2xl border-2 border-[#ff1e00] bg-white p-5 transition-shadow hover:shadow-xl md:order-none">
                    <span className="absolute -top-3 left-5 rounded-md bg-[#ff1e00] px-2.5 py-1 text-xs font-black uppercase tracking-wide text-white">
                      Ahorrás {fmt(ahorroCombo)}
                    </span>
                    <span className="font-display mt-2 text-2xl font-bold uppercase leading-tight text-slate-900">Alineado + balanceo de las 4 ruedas</span>
                    <span className="mt-1 text-sm text-slate-500">Con rotación incluida · auto</span>
                    <span className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#ff1e00]">{fmt(pt.comboAuto)}</span>
                      <span className="text-base text-slate-400 line-through">{fmt(separado)}</span>
                    </span>
                    <span className="mt-1 text-xs font-bold text-slate-500">Por separado: alineado + 4 balanceos</span>
                  </Link>
                  <Link href="/servicios/alineacion" className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-[#ff1e00]">
                    <span className="font-display text-2xl font-bold uppercase leading-tight text-slate-900">Alineado 3D</span>
                    <span className="mt-1 text-sm text-slate-500">Corrección de camber, caster y convergencia</span>
                    <span className="mt-4 text-3xl font-black text-slate-900">{fmt(pt.alineadoAuto)}</span>
                  </Link>
                  <Link href="/servicios/balanceo" className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-[#ff1e00]">
                    <span className="font-display text-2xl font-bold uppercase leading-tight text-slate-900">Balanceo</span>
                    <span className="mt-1 text-sm text-slate-500">Balanceadora computarizada · por rueda</span>
                    <span className="mt-4 text-3xl font-black text-slate-900">{fmt(pt.balanceoAuto)}</span>
                  </Link>
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span className="rounded-md bg-green-600 px-2 py-0.5 text-xs font-black text-white">GRATIS</span>
                  Armado, desarmado y válvulas si comprás las cubiertas en el local.
                </p>
              </section>
            )}

            <section>
              <h2 className="mb-4 text-2xl font-black text-slate-900">Completá tu compra</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Atajo href="/servicios" titulo="Alineado y balanceado" detalle="Combo con las 4 ruedas, sin turno" />
                <Atajo href="/catalogo" titulo="Todo el catálogo" detalle="Todas las marcas y medidas" />
                <Atajo href="/neumaticos-baratos" titulo="Neumáticos baratos" detalle="Los precios más bajos por medida" />
                <Atajo href="/sucursales" titulo="Cómo llegar" detalle="Direcciones y horarios de los locales" />
              </div>
            </section>

            <section>
              <SectionHeading
                titulo="Medios de pago"
                detalle="Cuotas y recargos de cada medio, y cotización de un producto puntual"
              />
              <OfertasMediosPago items={itemsCotizables} />
            </section>

            <FaqSection faqs={FAQS} title="Preguntas sobre las ofertas" />
          </div>
        )}
      </main>
    </div>
  );
}
