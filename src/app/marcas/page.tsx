import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { BRANDS } from "@/lib/data";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getBrandLogo } from "@/lib/brand-utils";
import { canonical, absoluteUrl, SITE_NAME } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { poolShare } from "@/lib/share-image";
import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug } from "@/lib/tire-sizes";
import type { TireProduct } from "@/lib/types";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Marcas de neumáticos: cuál elegir, precios y stock",
  description:
    "Marcas de neumáticos que vendemos (Grenlander, Zmax, Arivo, Pirelli y más): origen, segmento, modelos, medidas, stock y precio desde. Comparativa y guía para elegir, con garantía de 1 año y colocación sin cargo.",
  alternates: canonical("/marcas"),
  openGraph: { title: `Marcas de neumáticos — ${SITE_NAME}`, url: "/marcas", ...poolShare("marcas").openGraph },
  twitter: poolShare("marcas").twitter,
};

/** Marcas que se presentan como premium; el resto es importación directa. */
const PREMIUM = new Set(["pirelli"]);
const segmento = (id: string) => (PREMIUM.has(id) ? "Premium" : "Importación directa");

const FAQS = [
  {
    question: "¿Qué marcas de neumáticos venden?",
    answer:
      "Vendemos neumáticos nuevos de importación directa (Grenlander, Zmax, Arivo y otras marcas de gama media) y la premium Pirelli. La lista completa, con el stock y el precio desde de cada una, está en esta página y se actualiza con el POS.",
  },
  {
    question: "¿Conviene una marca premium o una de importación directa?",
    answer:
      "Depende de cuántos kilómetros hacés y de cómo manejás. Una premium rinde más kilómetros y frena algo mejor en mojado, pero cuesta bastante más por unidad. Para un uso urbano de 10.000 a 15.000 km al año, una marca de importación directa de gama media cubre la necesidad con holgura y el ahorro es real. Si hacés mucha ruta a velocidad sostenida o el auto es potente, ahí sí la premium se justifica.",
  },
  {
    question: "¿Los neumáticos chinos son seguros?",
    answer:
      "No todos los neumáticos chinos son iguales: hay una franja baja sin homologación seria y una franja media-alta con certificación europea, ensayos de frenado y compuestos con sílice. Nosotros trabajamos con la segunda. Todo lo que vendemos tiene marcado el índice de carga y de velocidad en el flanco y cumple las homologaciones vigentes. En muchos modelos podés verificar la etiqueta europea en el registro oficial EPREL.",
  },
  {
    question: "¿Cuál es la marca más barata?",
    answer:
      "En el catálogo, las de importación directa (como Grenlander, Zmax y Arivo) son las de precio más bajo por medida. El precio exacto depende de la medida: mirá la tabla de esta página para ver el precio desde de cada marca, o buscá tu medida para comparar las opciones.",
  },
  {
    question: "¿Puedo mezclar marcas distintas en el mismo auto?",
    answer:
      "En el mismo eje, no: los dos neumáticos de un eje tienen que ser de la misma marca, medida y dibujo, porque si agarran distinto el auto tira para un lado al frenar. Entre ejes se puede, aunque lo ideal es que los cuatro sean iguales. Lo que nunca hay que mezclar es un radial con un convencional en el mismo auto.",
  },
  {
    question: "¿Qué garantía tienen?",
    answer:
      "Un año por defecto de fabricación, sin importar la marca, y se gestiona con nosotros en el local. Cubre fallas de fábrica: deformaciones, separación de capas o pérdida de aire por vicio del material. No cubre pinchaduras, golpes contra un cordón o un bache, ni desgaste irregular por falta de alineación.",
  },
  {
    question: "¿Tienen neumáticos para camioneta y 4x4?",
    answer:
      "Sí. Hay neumáticos todo terreno (A/T) y de carga con marcado C para utilitarios en varias marcas. Entrá a las secciones de A/T y de carga de esta página para ver qué marcas los tienen hoy.",
  },
  {
    question: "¿Instalan los neumáticos que compro?",
    answer:
      "Sí, con taller propio. La colocación y el cambio de válvulas no se cobran si comprás las cubiertas en el local; el balanceo y la alineación se cotizan aparte, con un combo más barato que por separado.",
  },
];

const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

type Fila = {
  id: string;
  name: string;
  origin: string;
  logo: string | null;
  descripcion?: string;
  segmento: string;
  total: number;
  enStock: number;
  desde: number | null;
  modelos: string[];
  rodados: [number, number] | null;
  at: number;
  carga: number;
  estrella?: TireProduct;
};

export default async function MarcasPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);

  const filas: Fila[] = BRANDS.map((brand) => {
    const propios = productos.filter((p) => p.brandId === brand.id);
    const conStock = propios.filter((p) => p.enStock);
    const rims = propios.map((p) => p.size.rim);
    const estrella = [...(conStock.length ? conStock : propios)].sort((a, b) => (b.vendidos ?? 0) - (a.vendidos ?? 0))[0];
    return {
      id: brand.id,
      name: brand.name,
      origin: brand.origin,
      logo: getBrandLogo(brand.id),
      descripcion: brand.description,
      segmento: segmento(brand.id),
      total: propios.length,
      enStock: conStock.length,
      desde: conStock.length ? Math.min(...conStock.map((p) => p.price)) : null,
      modelos: [...new Set(propios.map((p) => p.modeloBase))].slice(0, 4),
      rodados: rims.length ? ([Math.min(...rims), Math.max(...rims)] as [number, number]) : null,
      at: propios.filter((p) => p.isAT).length,
      carga: propios.filter((p) => p.isCarga).length,
      estrella,
    };
  })
    // Sin productos no hay página que valga la pena enlazar: mandar al crawler a
    // una marca vacía diluye el presupuesto de rastreo.
    .filter((m) => m.total > 0)
    .sort((a, b) => b.enStock - a.enStock || b.total - a.total);

  const conStock = filas.filter((m) => m.enStock > 0);
  const aPedido = filas.filter((m) => m.enStock === 0);
  const totalModelos = productos.length;
  const totalEnStock = productos.filter((p) => p.enStock).length;
  const precioDesde = productos.filter((p) => p.enStock).reduce((min, p) => Math.min(min, p.price), Infinity);
  const actualizado = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" });

  const conAT = filas.filter((m) => m.at > 0 && m.enStock > 0);
  const conCarga = filas.filter((m) => m.carga > 0 && m.enStock > 0);
  const economicas = filas.filter((m) => m.segmento === "Importación directa" && m.enStock > 0);
  const premium = filas.filter((m) => m.segmento === "Premium" && m.enStock > 0);

  const guia = [
    {
      titulo: "Ahorrar sin resignar seguridad",
      detalle: "Uso urbano, 10.000 a 15.000 km al año.",
      marcas: economicas,
      href: "/neumaticos-baratos",
      cta: "Ver neumáticos baratos",
    },
    {
      titulo: "Mucha ruta o auto potente",
      detalle: "Más kilómetros por cubierta y mejor frenado en mojado.",
      marcas: premium,
      href: "/catalogo",
      cta: "Ver el catálogo",
    },
    {
      titulo: "Camioneta y 4x4",
      detalle: "Todo terreno (A/T) para pick-ups y SUV.",
      marcas: conAT,
      href: "/neumaticos/at",
      cta: "Ver neumáticos A/T",
    },
    {
      titulo: "Utilitarios y reparto",
      detalle: "Carga con marcado C, índice de carga reforzado.",
      marcas: conCarga,
      href: "/neumaticos/carga",
      cta: "Ver neumáticos de carga",
    },
  ].filter((g) => g.marcas.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/marcas")}#pagina`,
    url: absoluteUrl("/marcas"),
    name: "Marcas de neumáticos que vendemos",
    description: `${filas.length} marcas de neumáticos con su origen, segmento, modelos, stock y precio desde.`,
    inLanguage: "es-AR",
    dateModified: new Date().toISOString().slice(0, 10),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: filas.length,
      itemListElement: filas.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Brand",
          name: m.name,
          url: absoluteUrl(`/marcas/${m.id}`),
          ...(m.logo ? { logo: absoluteUrl(m.logo) } : {}),
          description: m.descripcion,
        },
      })),
    },
  };

  return (
    <div className="bg-slate-50">
      <JsonLd data={jsonLd} />

      <header className="relative overflow-hidden bg-black">
        <Image
          src="/images/local/cubierta-perfil-bajo-grenlander-colocada-neumaticos-trivium.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[#ff1e00]" />
        <div className="relative mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 md:py-16">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Inicio", path: "/" },
              { name: "Marcas", path: "/marcas" },
            ]}
          />
          <h1 className="font-display mt-2 max-w-3xl text-4xl font-bold uppercase leading-[0.98] tracking-wide text-white md:text-6xl">
            Marcas de neumáticos: <span className="text-[#ff1e00]">cuál elegir</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200 md:text-lg">
            Vendemos {filas.length} marcas de neumáticos nuevos de importación directa y premium, con precio y stock
            publicados. Abajo está cada una con su origen, sus modelos y el precio desde; y una guía para elegir según
            cómo usás el auto.
          </p>
          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [String(filas.length), "marcas"],
              [String(totalModelos), "modelos y medidas"],
              [String(totalEnStock), "con stock hoy"],
              [Number.isFinite(precioDesde) ? fmt(precioDesde) : "—", "precio desde"],
            ].map(([n, t]) => (
              <div key={t} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <dt className="font-display text-3xl font-bold text-white">{n}</dt>
                <dd className="text-xs uppercase tracking-wider text-slate-300">{t}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-10 md:py-14">
        <section className="mb-12 rounded-2xl bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-3 text-xl font-black text-navy-900">Encontrá tu medida y compará marcas</h2>
          <SizeOrVehicleSearch compact hideLearnLink />
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">¿Qué marca me conviene?</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            La diferencia entre marcas no es tanto la seguridad (todas cumplen las homologaciones) como la vida útil y el
            comportamiento en mojado. Elegí según tu uso:
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guia.map((g) => (
              <div key={g.titulo} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-black text-navy-900">{g.titulo}</h3>
                <p className="mt-1 text-sm text-slate-500">{g.detalle}</p>
                <ul className="mt-3 flex flex-1 flex-wrap content-start gap-2">
                  {g.marcas.map((m) => (
                    <li key={m.id}>
                      <Link href={`/marcas/${m.id}`} className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-navy-900 transition-colors hover:bg-orange-100 hover:text-orange-700">
                        {m.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={g.href} className="mt-4 text-sm font-black text-orange-600 underline underline-offset-2">
                  {g.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Marcas con stock hoy</h2>
          <p className="mt-2 text-slate-600">Retiralas y te las colocamos en el local, sin cargo.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {conStock.map((m) => (
              <Link
                key={m.id}
                href={`/marcas/${m.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-orange-400 hover:shadow-lg"
              >
                <div className="relative flex h-44 items-center justify-center bg-white">
                  {m.estrella?.imageUrl && (
                    <Image
                      src={m.estrella.imageUrl}
                      alt={`Neumático ${m.name} ${m.estrella.modeloBase}`}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  )}
                  <span className={`absolute left-3 top-3 rounded-md px-2 py-1 text-[11px] font-black uppercase tracking-wide text-white ${m.segmento === "Premium" ? "bg-navy-900" : "bg-[#ff1e00]"}`}>
                    {m.segmento}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-navy-900 group-hover:text-orange-600">Neumáticos {m.name}</h3>
                    {m.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.logo} alt="" className="h-7 w-auto max-w-[90px] shrink-0 object-contain" />
                    )}
                  </div>
                  <p className="mt-1 text-xs font-black uppercase tracking-widest text-slate-400">{m.origin}</p>
                  {m.descripcion && <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{m.descripcion}</p>}
                  {m.modelos.length > 0 && (
                    <p className="mt-3 text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Modelos:</span> {m.modelos.join(", ")}
                    </p>
                  )}
                  <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-bold text-emerald-600">{m.enStock} en stock</span>
                    {m.desde && (
                      <span className="text-right text-sm text-slate-500">
                        desde <span className="text-lg font-black text-navy-900">{fmt(m.desde)}</span>
                      </span>
                    )}
                  </div>
                  <span className="mt-3 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-black text-white transition-colors group-hover:bg-[#ff1e00]">
                    Ver neumáticos {m.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {aPedido.length > 0 && (
            <div className="mt-8">
              <h3 className="font-black text-navy-900">Otras marcas (a pedido)</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {aPedido.map((m) => (
                  <li key={m.id}>
                    <Link href={`/marcas/${m.id}`} className="inline-block rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-navy-900 hover:border-orange-400">
                      {m.name} <span className="font-normal text-slate-400">· {m.origin}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Comparativa de marcas</h2>
          <p className="mt-2 text-slate-600">
            Datos del catálogo de Neumáticos Trivium, {actualizado}. El stock y el precio desde cambian con el POS.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <caption className="sr-only">Comparativa de las marcas de neumáticos que vende Neumáticos Trivium</caption>
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Marca</th>
                  <th scope="col" className="px-4 py-3">Origen</th>
                  <th scope="col" className="px-4 py-3">Segmento</th>
                  <th scope="col" className="px-4 py-3">Modelos y medidas</th>
                  <th scope="col" className="px-4 py-3">Rodados</th>
                  <th scope="col" className="px-4 py-3">Tipos</th>
                  <th scope="col" className="px-4 py-3">En stock</th>
                  <th scope="col" className="px-4 py-3">Desde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filas.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <th scope="row" className="px-4 py-3 font-black text-navy-900">
                      <Link href={`/marcas/${m.id}`} className="hover:text-orange-600">{m.name}</Link>
                    </th>
                    <td className="px-4 py-3 text-slate-600">{m.origin}</td>
                    <td className="px-4 py-3 text-slate-600">{m.segmento}</td>
                    <td className="px-4 py-3 text-slate-600">{m.total}</td>
                    <td className="px-4 py-3 text-slate-600">{m.rodados ? (m.rodados[0] === m.rodados[1] ? `R${m.rodados[0]}` : `R${m.rodados[0]} a R${m.rodados[1]}`) : "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {["Auto", m.at ? "A/T" : "", m.carga ? "Carga" : ""].filter(Boolean).join(", ")}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{m.enStock}</td>
                    <td className="px-4 py-3 font-bold text-navy-900">{m.desde ? fmt(m.desde) : "A pedido"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-14 grid gap-4 md:grid-cols-2">
          <Link href="/marcas-de-neumaticos-chinos" className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-orange-400">
            <h2 className="text-lg font-black text-navy-900">Marcas de neumáticos chinos</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Kpatos, Sailun, Goodride, Westlake y más: cuáles se venden en Argentina, de dónde son y cuáles tenemos.
            </p>
            <span className="mt-3 inline-block text-sm font-black text-orange-600">Ver las marcas chinas →</span>
          </Link>
          <Link href="/alternativas" className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-orange-400">
            <h2 className="text-lg font-black text-navy-900">Alternativas a las marcas tradicionales</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              ¿Buscás Michelin, Bridgestone, Goodyear u otra que no vendemos? Mirá qué opciones equivalentes tenemos.
            </p>
            <span className="mt-3 inline-block text-sm font-black text-orange-600">Ver alternativas →</span>
          </Link>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Medidas más pedidas</h2>
          <p className="mt-2 text-slate-600">Entrá a tu medida y compará todas las marcas disponibles con precio y stock.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {MEDIDAS_PRIORITARIAS.slice(0, 12).map((size) => (
              <Link
                key={sizeSlug(size)}
                href={`/neumaticos/${sizeSlug(size)}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-orange-400"
              >
                <span className="block font-black text-navy-900">{formatSize(size)}</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">Comparar marcas</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14 rounded-3xl bg-black p-6 text-white md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight md:text-4xl">Importación directa, colocación sin cargo</h2>
            <p className="mt-2 max-w-xl text-slate-300">
              Comprás en el local con el precio de la web, te los colocamos y salís con las cubiertas puestas. Un año de garantía en todas las marcas.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <Link href="/ofertas" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#ff1e00] px-6 text-sm font-black text-white">Ver ofertas</Link>
            <Link href="/sucursales" className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white px-6 text-sm font-black text-white">Cómo llegar</Link>
          </div>
        </section>

        <FaqSection faqs={FAQS} title="Preguntas frecuentes sobre marcas" />
      </div>
    </div>
  );
}
