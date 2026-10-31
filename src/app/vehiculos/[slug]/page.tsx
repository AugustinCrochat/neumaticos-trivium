import type { Metadata } from "next";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";
import Link from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { POPULAR_VEHICLES, vehicleSlug, vehicleTireProfile, type VehicleTireProfile } from "@/lib/vehicles";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { canonical, breadcrumbJsonLd, faqJsonLd, type Faq } from "@/lib/seo";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { formatSize, sizeSlug, sizesEqual, diameterDiffPercent } from "@/lib/tire-sizes";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { peersByGroup } from "@/lib/best-price";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { BRANCHES } from "@/lib/config";
import type { TireProduct, TireSize } from "@/lib/types";
import { poolShare } from "@/lib/share-image";
import { MarcaLogo } from "@/components/ui/MarcaLogo";
import { marcaLogo, marcaSlug } from "@/lib/marcas-autos";
import { vehiclePhoto, vehicleCardUrl } from "@/lib/vehicle-photos";
import { MedidasVehiculo, type MedidaItem } from "./MedidasVehiculo";
import { VENTAS_MODELO, VENTAS_DATOS_AL } from "@/lib/ventas-modelo";

/**
 * Ficha por vehículo (/vehiculos/toyota-hilux): captura "neumáticos para
 * <modelo>". Todo el texto sale de los datos del vehículo (medidas, versiones,
 * años) y del catálogo (stock y precio), así que cada página es distinta de
 * verdad y no un texto con el nombre cambiado.
 *
 * Igual que las landings de /neumaticos, NO lee la cookie de sucursal: usa el
 * catálogo de la sucursal por defecto para prerenderizarse y salir por CDN.
 */

type Props = { params: Promise<{ slug: string }> };

const findVehicle = (slug: string) => POPULAR_VEHICLES.find((v) => vehicleSlug(v.brand, v.model) === slug);

export async function generateStaticParams() {
  return POPULAR_VEHICLES.map((v) => ({ slug: vehicleSlug(v.brand, v.model) }));
}

function uniqueSizes(vehicle: { sizes: { w: string; p: string; r: string; version?: string; generation?: string; years?: string }[] }) {
  const map = new Map<string, { w: string; p: string; r: string; versions: string[]; years: string[] }>();
  for (const s of vehicle.sizes) {
    const key = `${s.w}-${s.p}-${s.r}`;
    const entry = map.get(key) ?? { w: s.w, p: s.p, r: s.r, versions: [], years: [] };
    const label = s.version || s.generation;
    if (label && !entry.versions.includes(label)) entry.versions.push(label);
    if (s.years && !entry.years.includes(s.years)) entry.years.push(s.years);
    map.set(key, entry);
  }
  return [...map.values()];
}

/** El mismo criterio de construcción que usa CatalogWidget (ver selectionCopy). */
function fitsProfile(p: TireProduct, profile: VehicleTireProfile): boolean {
  if (profile === "commercial") return !!p.isCarga;
  if (profile === "pickup") return !p.isCarga;
  return !p.isCarga && !p.isAT;
}

const formatPrice = (n: number) => `$${n.toLocaleString("es-AR")}`;

async function stockPorMedida(vehicle: (typeof POPULAR_VEHICLES)[number]) {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  return uniqueSizes(vehicle).map((s) => {
    const size = { width: Number(s.w), profile: Number(s.p), rim: Number(s.r) };
    const profile = vehicleTireProfile(vehicle, s.versions.join(" / "));
    const disponibles = productos.filter((p) => p.enStock && sizesEqual(p.size, size) && fitsProfile(p, profile));
    return { ...s, size, profile, disponibles, desde: disponibles.length ? Math.min(...disponibles.map((p) => p.price)) : null };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = findVehicle(slug);
  if (!vehicle) return {};

  const name = `${vehicle.brand} ${vehicle.model}`;
  const medidas = await stockPorMedida(vehicle);
  const precios = medidas.flatMap((m) => (m.desde ? [m.desde] : []));
  const desde = precios.length ? Math.min(...precios) : null;
  const lista = medidas.slice(0, 3).map((m) => formatSize(m.size)).join(", ");

  // La medida va en el título: es lo que la persona busca, más que el auto.
  // Medida del título: la primera con stock, así el precio del título es el de esa medida.
  const medidaTitulo = medidas.find((m) => m.desde) ?? medidas[0];
  const principal = medidaTitulo ? formatSize(medidaTitulo.size) : null;
  const title = !principal
    ? `Neumáticos para ${name}: medidas y precios`
    : medidaTitulo.desde
      ? `Neumáticos para ${name}: ${principal}, desde ${formatPrice(medidaTitulo.desde)}`
      : `Neumáticos para ${name}: medida ${principal}`;
  const description = [
    medidas.length === 1
      ? `¿Qué medida de neumático lleva el ${name}? La original es ${lista}.`
      : `¿Qué medida de neumático lleva el ${name}? Según la versión: ${lista}${medidas.length > 3 ? " y más" : ""}.`,
    desde ? `Neumáticos económicos desde ${formatPrice(desde)}, con stock real y precio de outlet.` : "Consultá stock y precio de tu medida.",
    "Colocación sin cargo en el día y garantía de 1 año.",
  ].join(" ");

  // Con foto del modelo se comparte la tarjeta del auto; sin ella, una foto del local.
  const card = vehicleCardUrl(slug);
  const share = card
    ? {
        openGraph: { images: [{ url: card, width: 1200, height: 630, alt: `Neumáticos para ${name}` }] },
        twitter: { card: "summary_large_image" as const, images: [card] },
      }
    : poolShare(slug);

  return {
    title,
    description,
    alternates: canonical(`/vehiculos/${slug}`),
    openGraph: { title, description, url: `/vehiculos/${slug}`, ...share.openGraph },
    twitter: share.twitter,
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const vehicle = findVehicle(slug);
  if (!vehicle) notFound();

  const name = `${vehicle.brand} ${vehicle.model}`;
  const medidas = await stockPorMedida(vehicle);
  const conStock = medidas.filter((m) => m.desde !== null);
  const precios = conStock.map((m) => m.desde as number);
  const desde = precios.length ? Math.min(...precios) : null;

  // Otros modelos con landing: misma marca primero, así el enlazado interno
  // sale de la relación real entre fichas.
  const relacionados = POPULAR_VEHICLES.filter((v) => v !== vehicle)
    .sort((a, b) => Number(b.brand === vehicle.brand) - Number(a.brand === vehicle.brand))
    .slice(0, 8);

  // Lo que se llevaron los clientes de este modelo en el taller (datos propios del POS).
  const ventas = VENTAS_MODELO[name];
  const ventasTop = ventas
    ? ventas.top.map(([medida, u]) => ({ medida, u, pct: Math.round((u / ventas.n) * 20) * 5 })).filter((t) => t.pct >= 5)
    : [];
  const medidaSlug = (m: string) => {
    const x = m.match(/^(\d+)\/(\d+) R(\d+)$/);
    return x ? sizeSlug({ width: Number(x[1]), profile: Number(x[2]), rim: Number(x[3]) }) : null;
  };

  // El más barato en stock de cada medida: sustenta la sección y la FAQ de precio.
  const masBaratos = medidas
    .map((m) => ({ m, p: [...m.disponibles].sort((x, y) => x.price - y.price)[0] }))
    .filter((x): x is { m: (typeof medidas)[number]; p: TireProduct } => Boolean(x.p));

  // Medida que más se lleva en el taller primero; el resto en su orden.
  const masElegida = ventasTop[0]?.medida ?? null;
  const ordenadas = [...medidas].sort((a, b) => Number(formatSize(b.size) === masElegida) - Number(formatSize(a.size) === masElegida));
  const itemsMedida: MedidaItem[] = ordenadas.map((m) => ({
    slug: sizeSlug(m.size),
    label: formatSize(m.size),
    versions: m.versions,
    years: m.years,
    desde: m.desde ? formatPrice(m.desde) : null,
    masElegida: medidas.length > 1 && formatSize(m.size) === masElegida,
    // Foto del neumático más barato con stock de esa medida.
    foto: [...m.disponibles].sort((x, y) => x.price - y.price)[0]?.imageUrl ?? null,
  }));
  // Respuesta directa, antes de las tarjetas: es lo que busca quien llega con la pregunta.
  const respuestaCorta =
    medidas.length === 1
      ? `El ${name} lleva de fábrica la medida ${formatSize(medidas[0].size)}.`
      : `Según la versión, el ${name} usa ${ordenadas
          .slice(0, 3)
          .map((m) => `${formatSize(m.size)}${m.versions.length ? ` (${m.versions.slice(0, 2).join(" / ")})` : ""}`)
          .join(", ")}${ordenadas.length > 3 ? " y otras" : ""}.${
          masElegida ? ` La que más cambiamos en nuestro taller de Córdoba es ${masElegida}.` : ""
        }`;

  const faqs: Faq[] = [
    {
      question: `¿Qué medida de neumáticos lleva el ${name}?`,
      answer:
        `Según la versión, el ${name} usa ${medidas
          .map((m) => `${formatSize(m.size)}${m.versions.length ? ` (${m.versions.slice(0, 2).join(", ")})` : ""}`)
          .join("; ")}. ` +
        "Confirmá la tuya en el flanco del neumático que tenés puesto o en la calcomanía del parante de la puerta del conductor, porque una misma versión puede haber salido con más de una medida.",
    },
    ...(ventasTop.length
      ? [
          {
            question: `¿Qué medida eligen más los clientes del ${name}?`,
            answer: `En nuestro taller de Córdoba, de los neumáticos que colocamos en ${name} hasta ${VENTAS_DATOS_AL}, en aproximadamente ${ventasTop
              .slice(0, 3)
              .map((t) => `${t.pct}% fue ${t.medida}`)
              .join(", ")}. No siempre coincide con la medida de fábrica: depende de la versión y de la llanta que tenga tu auto.`,
          },
        ]
      : []),
    {
      question: `¿Cuáles son los neumáticos más baratos para el ${name}?`,
      answer: masBaratos.length
        ? `Hoy, los más económicos en stock son ${masBaratos
            .slice(0, 3)
            .map(({ m, p }) => `${p.brand} ${p.modeloBase} en ${formatSize(m.size)} a ${formatPrice(p.price)}`)
            .join("; ")}. Son precios por unidad, de outlet por importación directa, con garantía de 1 año y colocación sin cargo en el local.`
        : `Por ahora no tenemos stock en las medidas originales del ${name}. Escribinos por WhatsApp y te pasamos precio de la medida o de una equivalente.`,
    },
    {
      question: `¿Tienen neumáticos para ${name} en stock?`,
      answer: conStock.length
        ? `Sí. Hoy hay stock en ${conStock.map((m) => formatSize(m.size)).join(", ")}, desde ${formatPrice(desde as number)} por neumático. Garantía de 1 año y colocación sin cargo en el local.`
        : `Por ahora no tenemos stock en las medidas originales del ${name}. Escribinos por WhatsApp y te avisamos cuándo entra o te proponemos una medida equivalente.`,
    },
    {
      question: `¿Puedo usar otra medida en mi ${name}?`,
      answer:
        "Sí, siempre que mantenga el rodado y el diámetro externo dentro del ±3% del original: así el velocímetro, el ABS y el control de estabilidad siguen trabajando bien. Podés calcularlo en la calculadora de equivalencias del sitio.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Neumáticos por vehículo", path: "/vehiculos" },
          { name: vehicle.brand, path: `/vehiculos/marca/${marcaSlug(vehicle.brand)}` },
          { name: name, path: `/vehiculos/${slug}` },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      {vehicleCardUrl(slug) && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Neumáticos para ${name}: medidas y precios`,
            url: canonical(`/vehiculos/${slug}`).canonical,
            primaryImageOfPage: { "@type": "ImageObject", url: vehicleCardUrl(slug), width: 1200, height: 630 },
            image: vehicleCardUrl(slug),
          }}
        />
      )}

      <div className={`bg-black px-4 pt-8 ${vehiclePhoto(slug) ? "pb-24 md:pb-28" : "pb-10"}`}>
        <div className="mx-auto max-w-4xl text-center">
          {marcaLogo(vehicle.brand) && (
            <Link
              href={`/vehiculos/marca/${marcaSlug(vehicle.brand)}`}
              className="mx-auto mb-2 flex h-14 w-14 items-center justify-center"
              aria-label={`Neumáticos para ${vehicle.brand}`}
            >
              <MarcaLogo brand={vehicle.brand} sobreNegro className="h-14 w-14" />
            </Link>
          )}
          <h1 className="mb-2 text-3xl font-black text-white md:text-4xl">Medida de neumáticos del {name}</h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300">
            Medida original por versión{desde ? ` y neumáticos económicos desde ${formatPrice(desde)}` : ""}, con stock real.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-8 max-w-4xl px-4">
        <div className="rounded-3xl bg-white p-4 shadow-xl sm:p-6 md:p-10">
          <section className="mb-10 border-b border-slate-100 pb-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-6">
              <h2 className="mb-3 text-2xl font-bold text-navy-900 md:pt-4">Qué medida lleva el {name}</h2>
              {vehiclePhoto(slug) && (
                // Sobresale del recuadro blanco hacia el héroe de arriba.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vehiclePhoto(slug)!}
                  alt={name}
                  width={1000}
                  height={560}
                  className="relative z-20 order-first mx-auto -mt-24 mb-2 h-auto w-72 drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] md:order-last md:mx-0 md:-mt-44 md:w-[28rem]"
                />
              )}
            </div>
            <p className="mb-5 rounded-2xl bg-slate-50 p-4 leading-relaxed text-slate-700">{respuestaCorta}</p>
            <MedidasVehiculo items={itemsMedida} />
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Confirmá tu medida en el flanco del neumático o en la calcomanía del parante de la puerta del
              conductor: una misma versión puede haber salido con más de una. Si necesitás otra,{" "}
              <Link href="/calculadora-equivalencia-neumaticos" className="font-bold text-navy-700 underline underline-offset-4">
                calculá la equivalencia
              </Link>
              .
            </p>
          </section>

          {vehicleCardUrl(slug) && (
            // La portada de la ficha como imagen real de la página (no solo og:image): así Google Imágenes la puede indexar con su alt.
            <figure className="mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/vehiculos/share/${slug}.jpg`}
                alt={`Neumáticos para ${name}: medida original y precios`}
                width={1200}
                height={630}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-2xl border border-slate-200"
              />
              <figcaption className="mt-2 text-center text-xs text-slate-500">Medida original del {name} y neumáticos disponibles.</figcaption>
            </figure>
          )}

          <FotoNeumaticoBloque className="mb-10" titulo={`¿No sabés qué medida lleva tu ${name}?`} />

          {masBaratos.length > 0 && (
            <section className="mb-10 border-b border-slate-100 pb-10">
              <h2 className="mb-1 text-2xl font-bold text-navy-900">Neumáticos económicos para el {name}</h2>
              <p className="mb-4 text-sm text-slate-500">
                El más barato que tenemos en stock hoy en cada medida. Precio por unidad, outlet por importación directa.
              </p>
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
                {masBaratos.map(({ m, p }) => (
                  <li key={sizeSlug(m.size)}>
                    <Link href={`/productos/${p.slug}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50">
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-navy-900">{formatSize(m.size)}</span>
                        <span className="block truncate text-sm text-slate-600">{p.brand} {p.modeloBase}</span>
                      </span>
                      <span className="shrink-0 text-lg font-black text-emerald-700">{formatPrice(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {ventasTop.length > 0 && (
            <section className="mb-10 border-b border-slate-100 pb-10">
              <h2 className="mb-1 text-2xl font-bold text-navy-900">Qué medida se llevan los {name} en nuestro taller</h2>
              <p className="mb-5 text-sm text-slate-500">
                Sobre los neumáticos que colocamos en {name} en el local de Argüello (porcentajes aproximados, datos al {VENTAS_DATOS_AL}). Es lo que
                eligieron los clientes, que no siempre es la medida de fábrica.
              </p>
              <ul className="space-y-3">
                {ventasTop.map((t) => {
                  const slugM = medidaSlug(t.medida);
                  return (
                    <li key={t.medida}>
                      <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                        {slugM ? (
                          <Link href={`/neumaticos/${slugM}`} className="font-black text-navy-900 underline underline-offset-4 hover:text-orange-600">
                            {t.medida}
                          </Link>
                        ) : (
                          <span className="font-black text-navy-900">{t.medida}</span>
                        )}
                        <span className="font-bold text-slate-600">{t.pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: `${t.pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <div className="space-y-12">
            {medidas.map((m) => (
              <div key={sizeSlug(m.size)} className="border-b border-slate-100 pb-12 last:border-0 last:pb-0">
                <div className="mb-6">
                  <h2 className="mb-2 text-2xl font-bold text-navy-900">
                    {/* El enlace con el texto con que se busca la medida le pasa a
                        la página de la medida la fuerza de las fichas de auto,
                        que rankean mejor. */}
                    Medida{" "}
                    <Link href={`/neumaticos/${sizeSlug(m.size)}`} className="underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-600">
                      {formatSize(m.size)}
                    </Link>
                  </h2>
                  <p className="text-slate-500">
                    Suele venir de fábrica en versiones como: {m.versions.join(", ") || "varias versiones"}.
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">{selectionCopy(m.profile)}</p>
                </div>
                {m.disponibles.length > 0 ? (
                  <CatalogWidget size={m.size} vehicleProfile={m.profile} title="En stock hoy" />
                ) : (
                  <SinStockMedida name={name} size={m.size} profile={m.profile} />
                )}
                <Link
                  href={`/neumaticos/${sizeSlug(m.size)}`}
                  className="mt-5 inline-block text-sm font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-600"
                >
                  Ver todas las cubiertas {formatSize(m.size)}, equivalencias y precios →
                </Link>
              </div>
            ))}
          </div>

          <section className="mt-12 border-t border-slate-100 pt-10">
            <h2 className="mb-5 text-2xl font-bold text-navy-900">Preguntas frecuentes</h2>
            <dl className="space-y-5">
              {faqs.map((f) => (
                <div key={f.question}>
                  <dt className="font-bold text-navy-900">{f.question}</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 border-t border-slate-100 pt-10">
            <h2 className="mb-4 text-xl font-bold text-navy-900">Neumáticos para otros autos</h2>
            <ul className="flex flex-wrap gap-2">
              {relacionados.map((v) => (
                <li key={`${v.brand}-${v.model}`}>
                  <Link
                    href={`/vehiculos/${vehicleSlug(v.brand, v.model)}`}
                    className="inline-block rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy-900 hover:border-navy-300"
                  >
                    {v.brand} {v.model}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/vehiculos/marca/${marcaSlug(vehicle.brand)}`} className="inline-block rounded-xl bg-navy-50 px-3.5 py-2 text-sm font-bold text-navy-700 hover:bg-navy-100">
                  Todos los {vehicle.brand} →
                </Link>
              </li>
              <li>
                <Link href="/vehiculos" className="inline-block rounded-xl bg-navy-50 px-3.5 py-2 text-sm font-bold text-navy-700 hover:bg-navy-100">
                  Ver todos →
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

function selectionCopy(profile: VehicleTireProfile) {
  if (profile === "commercial") {
    return "Mostramos sólo neumáticos comerciales (C), con carcasa y capacidad de carga aptas para esta versión de trabajo.";
  }
  if (profile === "pickup") {
    return "Mostramos neumáticos para pickup; puede incluir opciones A/T, pero no cubiertas comerciales C de utilitario.";
  }
  return "Mostramos neumáticos de auto: excluimos cubiertas comerciales C y A/T aunque compartan esta medida.";
}

/**
 * Medida sin stock: en vez de dejar la sección vacía, ofrece los neumáticos con
 * stock del mismo rodado y diámetro dentro del ±3% (equivalentes) y la consulta
 * por WhatsApp. Si no hay equivalentes, queda sólo la consulta.
 */
async function SinStockMedida({ name, size, profile }: { name: string; size: TireSize; profile: VehicleTireProfile }) {
  const catalogo = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const peers = peersByGroup(catalogo);
  const equivalentes = catalogo
    .filter((p) => p.enStock && p.size.rim === size.rim && !sizesEqual(p.size, size) && fitsProfile(p, profile))
    .map((p) => ({ p, diff: Math.abs(diameterDiffPercent(p.size, size)) }))
    .filter((x) => x.diff <= 3)
    .sort((a, b) => a.diff - b.diff || a.p.price - b.p.price)
    .slice(0, 4);
  const branch = BRANCHES[0];
  const texto = encodeURIComponent(`Hola! Busco neumáticos ${formatSize(size)} para mi ${name}. ¿Los tienen o me pueden conseguir?`);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="font-black text-navy-900">Hoy no tenemos stock en {formatSize(size)}</p>
        <p className="mt-1 text-sm text-slate-600">
          Escribinos y te avisamos cuándo entra, o te proponemos una medida equivalente.
        </p>
        <WhatsAppLink
          href={`https://wa.me/${branch.whatsapp}?text=${texto}`}
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black !text-white !no-underline hover:bg-orange-600"
        >
          Consultar {formatSize(size)} por WhatsApp
        </WhatsAppLink>
      </div>
      {equivalentes.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-6 not-prose [&_a]:!no-underline">
          <h3 className="mb-1 text-xl font-black text-navy-900">Medidas equivalentes en stock</h3>
          <p className="mb-5 text-sm text-slate-500">
            Mismo rodado R{size.rim} y diámetro dentro del ±3% de {formatSize(size)}: el velocímetro y el ABS siguen
            funcionando bien. Confirmá con nosotros que entre en tu llanta.
          </p>
          <SortedProductGrid
            className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4"
            items={equivalentes.map(({ p }) => ({ product: p, peers: peers.get(p.id) }))}
          />
        </div>
      )}
    </div>
  );
}
