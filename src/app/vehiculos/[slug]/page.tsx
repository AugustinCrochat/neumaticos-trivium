import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { POPULAR_VEHICLES, vehicleSlug, vehicleTireProfile, type VehicleTireProfile } from "@/lib/vehicles";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { canonical, breadcrumbJsonLd, faqJsonLd, type Faq } from "@/lib/seo";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { formatSize, sizeSlug, sizesEqual } from "@/lib/tire-sizes";
import type { TireProduct } from "@/lib/types";
import { poolShare } from "@/lib/share-image";
import { MarcaLogo } from "@/components/ui/MarcaLogo";
import { marcaLogo, marcaSlug } from "@/lib/marcas-autos";
import { vehiclePhoto, vehicleCardUrl } from "@/lib/vehicle-photos";
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

  const title = `Neumáticos para ${name}: medidas y precios`;
  const description = [
    `Medidas originales del ${name}: ${lista}${medidas.length > 3 ? " y más" : ""}.`,
    desde ? `Neumáticos desde ${formatPrice(desde)} con stock real.` : "Consultá stock y precio de tu medida.",
    "Garantía de 1 año y colocación sin cargo en Córdoba.",
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
    ? ventas.top.map(([medida, u]) => ({ medida, u, pct: Math.round((u / ventas.n) * 100) })).filter((t) => t.pct >= 3)
    : [];
  const medidaSlug = (m: string) => {
    const x = m.match(/^(\d+)\/(\d+) R(\d+)$/);
    return x ? sizeSlug({ width: Number(x[1]), profile: Number(x[2]), rim: Number(x[3]) }) : null;
  };

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
            answer: `En nuestro taller de Córdoba, de los ${ventas!.n} neumáticos que colocamos en ${name} hasta ${VENTAS_DATOS_AL}, ${ventasTop
              .slice(0, 3)
              .map((t) => `${t.pct}% fueron ${t.medida}`)
              .join(", ")}. No siempre coincide con la medida de fábrica: depende de la versión y de la llanta que tenga tu auto.`,
          },
        ]
      : []),
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

      <div className={`bg-black px-4 pt-16 ${vehiclePhoto(slug) ? "pb-32" : "pb-16"}`}>
        <div className="mx-auto max-w-4xl text-center">
          {marcaLogo(vehicle.brand) && (
            <Link
              href={`/vehiculos/marca/${marcaSlug(vehicle.brand)}`}
              className="mx-auto mb-4 flex h-24 w-24 items-center justify-center"
              aria-label={`Neumáticos para ${vehicle.brand}`}
            >
              <MarcaLogo brand={vehicle.brand} className="h-24 w-24 drop-shadow-[0_0_2px_rgba(255,255,255,0.9)] drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]" />
            </Link>
          )}
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-orange-500">
            Guía de medidas por vehículo
          </span>
          <h1 className="mb-6 text-4xl font-black text-white md:text-5xl">Neumáticos para {name}</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl">
            Medidas originales de fábrica del {name} según versión
            {desde ? `, con neumáticos en stock desde ${formatPrice(desde)}` : ""}. Elegí la tuya para ver qué tenemos.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-8 max-w-4xl px-4">
        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
          <section className="mb-10 border-b border-slate-100 pb-10">
            <div className="md:flex md:items-start md:justify-between md:gap-6">
              <h2 className="mb-3 text-2xl font-bold text-navy-900 md:pt-4">Qué medida lleva el {name}</h2>
              {vehiclePhoto(slug) && (
                // Sobresale del recuadro blanco hacia el héroe de arriba.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vehiclePhoto(slug)!}
                  alt={name}
                  width={1000}
                  height={650}
                  className="relative z-20 mx-auto -mt-16 mb-4 h-auto w-64 drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] md:order-last md:mx-0 md:-mt-32 md:w-80"
                />
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-4 font-bold">Medida</th>
                    <th className="py-2 pr-4 font-bold">Versiones</th>
                    <th className="py-2 pr-4 font-bold">Años</th>
                    <th className="py-2 font-bold">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {medidas.map((m) => (
                    <tr key={sizeSlug(m.size)} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-4 font-black text-navy-900">
                        <Link href={`/neumaticos/${sizeSlug(m.size)}`} className="underline underline-offset-4 hover:text-orange-600">
                          {formatSize(m.size)}
                        </Link>
                      </td>
                      <td className="py-2 pr-4 text-slate-600">{m.versions.join(", ") || "Varias versiones"}</td>
                      <td className="py-2 pr-4 text-slate-600">{m.years.join(", ") || "—"}</td>
                      <td className="py-2 font-bold text-slate-700">
                        {m.desde ? `Desde ${formatPrice(m.desde)}` : "Consultar"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Confirmá tu medida en el flanco del neumático o en la calcomanía del parante de la puerta del
              conductor: una misma versión puede haber salido con más de una. Si necesitás otra,{" "}
              <Link href="/calculadora-equivalencia-neumaticos" className="font-bold text-navy-700 underline underline-offset-4">
                calculá la equivalencia
              </Link>
              .
            </p>
          </section>

          {ventasTop.length > 0 && (
            <section className="mb-10 border-b border-slate-100 pb-10">
              <h2 className="mb-1 text-2xl font-bold text-navy-900">Qué medida se llevan los {name} en nuestro taller</h2>
              <p className="mb-5 text-sm text-slate-500">
                Sobre {ventas!.n} neumáticos que colocamos en {name} en el local de Argüello (datos al {VENTAS_DATOS_AL}). Es lo que
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
                  <h2 className="mb-2 text-2xl font-bold text-navy-900">Medida {formatSize(m.size)}</h2>
                  <p className="text-slate-500">
                    Suele venir de fábrica en versiones como: {m.versions.join(", ") || "varias versiones"}.
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">{selectionCopy(m.profile)}</p>
                </div>
                <CatalogWidget size={m.size} vehicleProfile={m.profile} title="En stock hoy" />
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
