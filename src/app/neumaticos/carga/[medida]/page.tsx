import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRANCHES, DEFAULT_BRANCH_ID, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { absoluteUrl, canonical, itemListJsonLd, SITE_NAME, type Faq } from "@/lib/seo";
import {
  cargaCapacityLabel,
  cargaContent,
  cargaProductsOfSize,
  cargaSlug,
  formatCargaSize,
  parseCargaSlug,
} from "@/lib/carga";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { bestPriceByGroup, peersByGroup } from "@/lib/best-price";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * Landing por medida de carga (/neumaticos/carga/195-70-r15c).
 *
 * Igual que /neumaticos/[medida], NO lee la cookie de sucursal: usa el
 * catálogo de la sucursal por defecto para poder prerenderizarse (ver
 * seo-architecture). Sólo existe para medidas C que hoy están en el catálogo:
 * una landing sin productos sería contenido delgado.
 */

type Props = { params: Promise<{ medida: string }> };

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export async function generateStaticParams() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const slugs = new Set(productos.filter((p) => p.isCarga).map((p) => cargaSlug(p.size)));
  return [...slugs].map((medida) => ({ medida }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { medida } = await params;
  const size = parseCargaSlug(medida);
  if (!size) return {};
  const productos = cargaProductsOfSize(await getProductosDesdePOS(DEFAULT_BRANCH_ID), size);
  if (productos.length === 0) return {};

  const label = formatCargaSize(size);
  const enStock = productos.filter((p) => p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  const title = desde
    ? `Neumáticos ${label} de carga desde $${desde.toLocaleString("es-AR")}`
    : `Neumáticos ${label} de carga — precio y medidas`;
  const path = `/neumaticos/carga/${cargaSlug(size)}`;

  return {
    title,
    description:
      `${desde ? `Neumáticos ${label} desde $${desde.toLocaleString("es-AR")} con stock.` : `Neumáticos ${label}.`} ` +
      `Cubiertas de carga (serie C) para furgones y utilitarios, de importación directa, con garantía de 1 año. ` +
      `Colocación sin cargo en Córdoba y envío a todo el país.`,
    alternates: canonical(path),
    openGraph: { title: `${title} — ${SITE_NAME}`, url: path },
  };
}

export default async function CargaMedidaPage({ params }: Props) {
  const { medida } = await params;
  const size = parseCargaSlug(medida);
  if (!size || cargaSlug(size) !== medida) notFound();

  const todos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const productos = cargaProductsOfSize(todos, size);
  if (productos.length === 0) notFound();

  const label = formatCargaSize(size);
  const path = `/neumaticos/carga/${cargaSlug(size)}`;
  const content = cargaContent(size);
  const branch = BRANCHES[0];
  const ordenados = [...productos].sort((a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price);
  const enStock = ordenados.filter((p) => p.enStock);
  const mejores = bestPriceByGroup(ordenados);
  const peers = peersByGroup(ordenados);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  const marcas = [...new Set(productos.map((p) => p.brand))];
  const capacidades = [...new Set(ordenados.map(cargaCapacityLabel).filter((c): c is string => !!c))];

  // Las otras medidas C con producto, para el enlazado entre hermanas.
  const hermanas = [
    ...new Map(
      todos
        .filter((p) => p.isCarga && cargaSlug(p.size) !== cargaSlug(size))
        .map((p) => [cargaSlug(p.size), p.size] as const)
    ).values(),
  ];

  const faqs: Faq[] = [
    {
      question: `¿Cuánto cuesta un neumático ${label}?`,
      answer: desde
        ? `Arrancan en ${formatPrice(desde)} por unidad con IVA incluido, según marca y modelo. Son neumáticos de importación directa, sin distribuidor intermedio, y el precio publicado en la web es el que se cobra en el local.`
        : `Ahora mismo no tenemos ${label} con stock. Escribinos por WhatsApp y te pasamos precio y fecha estimada de ingreso.`,
    },
    {
      question: `¿Qué significa la C en ${label}?`,
      answer:
        `La C es de "Commercial". Indica un neumático de carga, con la carcasa reforzada y una presión máxima más alta que la de un neumático de auto en la misma medida (${formatSize(size)}). Por eso un ${formatSize(size)} sin C no reemplaza a un ${label}, aunque ancho, perfil y rodado coincidan.`,
    },
    {
      question: `¿Cuánto peso aguanta un neumático ${label}?`,
      answer: capacidades.length
        ? `Depende del índice de carga del modelo. ${capacidades.join("; ")}. Para calcular la carga de tu vehículo, sumá lo que soportan las ruedas del eje más cargado y compará con el peso real; en rodado dual se usa el segundo número.`
        : `Depende del índice de carga del modelo, que figura en el flanco junto a la medida. En los neumáticos C vienen dos números separados por una barra: el primero es para montaje simple y el segundo para rodado dual.`,
    },
    {
      question: `¿Qué marcas de ${label} tienen?`,
      answer: `Hoy tenemos ${marcas.join(", ")} en esta medida. Todas con garantía de un año por defecto de fábrica.`,
    },
    {
      question: `¿Puedo comprar ${label} online y recibirlos en casa?`,
      answer: `Sí. Enviamos a todo el país: gratis desde ${formatPrice(FREE_SHIPPING_THRESHOLD)} de compra, o ${formatPrice(SHIPPING_FLAT_RATE)} fijos por debajo de eso. También podés retirar sin cargo en ${branch.address}, ${branch.city}, donde hacemos la colocación sin costo.`,
    },
  ];

  const productJsonLd = desde
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `Neumático de carga ${label}`,
        description: `Neumático comercial (serie C) ${label} para furgones y utilitarios.`,
        category: "Neumáticos de carga",
        brand: marcas.length === 1 ? { "@type": "Brand", name: marcas[0] } : undefined,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "ARS",
          lowPrice: desde,
          highPrice: Math.max(...enStock.map((p) => p.price)),
          offerCount: enStock.length,
          availability: "https://schema.org/InStock",
          url: absoluteUrl(path),
        },
      }
    : null;

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: "Neumáticos de carga", path: "/neumaticos/carga" },
          { name: label, path },
        ]}
      />
      <JsonLd
        data={itemListJsonLd(ordenados.map((p) => ({ name: `${p.brand} ${p.model}`, path: `/productos/${p.slug}` })))}
      />
      {productJsonLd && <JsonLd data={productJsonLd} />}

      <header className="mb-8 rounded-3xl bg-black p-6 md:p-10">
        <p className="inline-block rounded-md bg-[#ff1e00] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
          Neumáticos de carga
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold uppercase leading-[0.95] tracking-wide text-white md:text-6xl">
          Neumáticos {label}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">{content.intro}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
          {desde ? (
            <span className="rounded-full bg-[#ff1e00] px-4 py-1.5 text-white">Desde {formatPrice(desde)}</span>
          ) : (
            <span className="rounded-full bg-slate-700 px-4 py-1.5 text-white">Sin stock por ahora</span>
          )}
          <span className="rounded-full border border-white/30 px-4 py-1.5 text-white">
            {enStock.length} {enStock.length === 1 ? "modelo" : "modelos"} con stock
          </span>
          <span className="rounded-full border border-white/30 px-4 py-1.5 text-white">Colocación sin cargo</span>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-5 text-2xl font-black text-navy-900">Cubiertas {label} disponibles</h2>
        <SortedProductGrid
          className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
          items={ordenados.map((p) => ({ product: p, isCheapest: mejores.has(p.id), cheapestLabel: mejores.get(p.id), peers: peers.get(p.id) }))}
        />
      </section>

      {capacidades.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-black text-navy-900">Cuánta carga aguanta</h2>
          <p className="mb-3 max-w-3xl leading-relaxed text-slate-600">
            En un neumático C el índice de carga viene en dos números. El primero vale para montaje simple (una rueda
            por lado) y el segundo para rodado dual. Los valores de esta medida:
          </p>
          <ul className="max-w-3xl list-disc space-y-1 pl-5 text-slate-700">
            {capacidades.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-3 max-w-3xl text-sm text-slate-500">
            Más detalle en{" "}
            <Link href="/blog/carga-simple-y-dual-neumaticos-c" className="font-bold text-[#ff1e00] underline">
              carga simple y dual en neumáticos C
            </Link>
            .
          </p>
        </section>
      )}

      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl font-black text-navy-900">Para qué vehículos</h2>
          <p className="leading-relaxed text-slate-600">{content.vehiculos}</p>
        </div>
        <div>
          <h2 className="mb-3 text-2xl font-black text-navy-900">Qué tener en cuenta con el {label}</h2>
          <ul className="list-disc space-y-2 pl-5 leading-relaxed text-slate-600">
            {content.aTener.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {hermanas.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-black text-navy-900">Otras medidas de carga</h2>
          <div className="flex flex-wrap gap-3">
            {hermanas.map((s) => (
              <Link
                key={cargaSlug(s)}
                href={`/neumaticos/carga/${cargaSlug(s)}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-black text-slate-900 transition-colors hover:border-[#ff1e00]"
              >
                {formatCargaSize(s)}
              </Link>
            ))}
            <Link
              href="/neumaticos/carga"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-700 hover:border-[#ff1e00]"
            >
              Ver todos los de carga
            </Link>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            ¿Buscás el neumático de auto en {formatSize(size)} (sin C)?{" "}
            <Link href={`/neumaticos/${sizeSlug(size)}`} className="font-bold text-[#ff1e00] underline">
              Verlo acá
            </Link>
            .
          </p>
        </section>
      )}

      <FaqSection faqs={faqs} />

      <section className="mt-12 rounded-3xl bg-black p-6 md:p-10">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          ¿Dudas con tu <span className="text-[#ff1e00]">medida</span>?
        </h2>
        <p className="mt-2 max-w-xl text-slate-300">
          Pasanos marca, modelo y año del vehículo y te confirmamos la medida y el índice de carga correctos. Atendemos
          en {branch.address}, {branch.city}.
        </p>
        <WhatsAppLink
          href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(`Hola! Consulto por neumáticos ${label}`)}`}
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#ff1e00] px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
        >
          Consultar por WhatsApp
        </WhatsAppLink>
      </section>
    </div>
  );
}
