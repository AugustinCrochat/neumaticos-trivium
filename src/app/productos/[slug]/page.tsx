import { notFound } from "next/navigation";
import Link from "@/components/ui/Link";
import type { Metadata } from "next";
import { productShare } from "@/lib/share-image";
import { productImagePaths } from "@/lib/image-seo";
import { getProductosDesdePOS, getAccesoriosDesdePOS, esRodadoCamion } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { getBrandLogo } from "@/lib/brand-utils";
import { BRANDS } from "@/lib/data";
import { BRANCHES, DEFAULT_BRANCH_ID, SHIPPING_FLAT_RATE, SITE_URL, TIRE_RIMS } from "@/lib/config";
import { ORGANIZATION_ID, branchNodeId, breadcrumbJsonLd, canonical } from "@/lib/seo";
import { LivePrice } from "./LivePrice";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildTireDescription,
  formatSize,
  LOAD_INDEX_KG,
  rimSlug,
  sizesEqual,
  SPEED_RATING_KMH,
  sizeSlug,
  vehiclesUsingSize,
} from "@/lib/tire-sizes";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { groupLabel, peersByGroup } from "@/lib/best-price";
import { CompatibleAccessorySection } from "@/components/ui/CompatibleAccessorySection";
import { getTireLabel, type TireLabel } from "@/lib/tire-labels";
import { EuLabelBlock } from "@/components/ui/EuLabelBadge";
import { getUtqg } from "@/lib/utqg";
import { getExtraPhotos } from "@/lib/product-extra-photos";
import { getTreadCloseup } from "@/lib/tread-closeups";
import { ProductNameWithHighlightedSize } from "@/components/ui/ProductNameWithHighlightedSize";
import { ProductImageGallery } from "@/components/ui/ProductImageGallery";
import { ProductPageClient } from "./ProductPageClient";
import { CompatibilidadVehiculo } from "./CompatibilidadVehiculo";
import { ModelosCompatibles, type ModeloCompatible } from "./ModelosCompatibles";
import { vehicleSlug, popularityRank } from "@/lib/vehicles";
import { vehiclePhoto } from "@/lib/vehicle-photos";
import { marcaSlug } from "@/lib/marcas-autos";

type Props = { params: Promise<{ slug: string }> };

// Con generateStaticParams + dynamicParams (el default): los productos que
// existen en el POS al buildear salen prerenderizados, y los que se agreguen
// después se generan on-demand y quedan cacheados igual.
//
// generateStaticParams no es opcional: una ruta dinámica SIN él Next la trata
// como totalmente dinámica (sale con `no-cache, no-store`). Estas son las
// páginas más visitadas del sitio (Merchant Center, el bot de WhatsApp), así
// que estaban haciendo SSR completo en el Worker en cada visita.
export async function generateStaticParams() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const productos = await getProductosDesdePOS(await getSelectedBranchSlug());
  const product = productos.find((p) => p.slug === slug);
  if (!product) return {};
  // product.model ya trae el índice de carga/velocidad pegado a la medida
  // (ver toTireProduct en pos-api.ts) — no hace falta insertarlo acá.
  const fullTitle = `Neumático ${product.model} — Neumáticos Trivium`;
  const description = `Comprá el neumático ${product.model} al mejor precio. Outlet de neumáticos importados en Argentina.`;
  const pageUrl = `${SITE_URL}/productos/${product.slug}`;
  // Al compartir se ve la foto del neumático tal cual (JPEG liviano que arma el
  // prebuild); si el producto no tiene foto local queda la imagen del sitio.
  const share = productShare(product.imageUrl);
  return {
    title: fullTitle,
    description,
    alternates: canonical(`/productos/${product.slug}`),
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: "Neumáticos Trivium",
      type: "website",
      ...share?.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(share && { images: share.twitter.images }),
    },
  };
}

function vehicleLabel(product: { vehicleType: string[]; size?: { rim: number } }) {
  if (product.size && esRodadoCamion(product.size.rim)) return "camiones medianos y vehículos de carga";
  const hasAuto = product.vehicleType.includes("auto");
  const hasCamioneta = product.vehicleType.includes("camioneta");
  if (hasAuto && hasCamioneta) return "autos y camionetas";
  if (hasCamioneta) return "camionetas";
  return "autos";
}

function buildProductJsonLd(product: {
  id: string; slug: string; brand: string; brandId: string; model: string; modeloBase: string; imageUrl: string; price: number; enStock?: boolean;
  size: { width: number; profile: number; rim: number }; loadIndex?: string; loadIndexDual?: string; speedRating?: string;
  vehicleType: string[];
}, label: TireLabel | null) {
  const url = `${SITE_URL}/productos/${product.slug}`;
  // Todas las fotos del producto (principal, banda y otros ángulos): Google
  // elige entre ellas para Imágenes y para el rich result.
  const image = productImagePaths(product).map((src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`));
  // Google exige priceValidUntil para mostrar el precio en rich results. Con
  // precios que se mueven por inflación y tipo de cambio, 30 días es un
  // compromiso razonable: no promete un precio viejo ni obliga a rearmar el
  // schema todos los días.
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    // product.model ya viene armado como "<medida> <marca> <modelo>", así que
    // anteponerle la marca la repetía ("PIRELLI 225/45 R17 PIRELLI POWERGY").
    // Además tiene que coincidir con el <title> del feed de Merchant Center,
    // que usa este mismo campo: si no coinciden, Diagnostics marca el ítem.
    name: product.model,
    description: buildTireDescription(product),
    image,
    // sku tiene que ser el mismo id que <g:id> en google-merchant.xml y
    // google-local-inventory.xml — sin esto Merchant Center no puede matchear
    // el structured data de la pagina con el item del feed ("missing
    // required parameter id" en Diagnostics de productos).
    sku: product.id,
    mpn: product.id,
    brand: { "@type": "Brand", name: product.brand },
    url,
    // Los atributos de medida como propiedades estructuradas: es lo que permite
    // que Google entienda la ficha como un neumático de una medida concreta y
    // no como un texto suelto.
    additionalProperty: [
      { "@type": "PropertyValue", name: "Ancho de sección", value: `${product.size.width} mm` },
      { "@type": "PropertyValue", name: "Perfil", value: `${product.size.profile}` },
      { "@type": "PropertyValue", name: "Rodado", value: `R${product.size.rim}` },
      ...(product.loadIndex
        ? [
            {
              "@type": "PropertyValue",
              name: "Índice de carga",
              value: product.loadIndexDual ? `${product.loadIndex}/${product.loadIndexDual}` : product.loadIndex,
            },
          ]
        : []),
      ...(product.speedRating
        ? [{ "@type": "PropertyValue", name: "Índice de velocidad", value: product.speedRating }]
        : []),
      ...(label
        ? [
            { "@type": "PropertyValue", name: "Eficiencia de combustible (etiqueta UE)", value: label.energyClass },
            { "@type": "PropertyValue", name: "Frenado en mojado (etiqueta UE)", value: label.wetGripClass },
            { "@type": "PropertyValue", name: "Ruido externo (etiqueta UE)", value: `${label.noiseDb} dB`, unitText: "dB" },
            { "@type": "PropertyValue", name: "Registro EPREL", value: label.eprelId },
          ]
        : []),
    ],
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "ARS",
      price: product.price,
      priceValidUntil,
      availability: product.enStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORGANIZATION_ID },
      // Requerido por el complemento de fichas locales/anuncios de inventario
      // local: liga esta oferta a la sucursal física (nodo TireShop que ya se
      // emite en el layout via siteGraphJsonLd) en vez de solo declarar un
      // vendedor genérico.
      availableAtOrFrom: { "@id": branchNodeId(BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID) ?? BRANCHES[0]) },
      // Envío y devoluciones declarados en el schema: Merchant Center los pide
      // para las fichas gratuitas, y en la SERP se muestran junto al precio.
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: SHIPPING_FLAT_RATE,
          currency: "ARS",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "AR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 7, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "AR",
        // La Ley 24.240 exige un mínimo de 10 días corridos de arrepentimiento;
        // acá se declara el plazo real de la política de la tienda (más
        // generoso que el mínimo legal), que es lo que Merchant Center puntúa
        // en "Experiencia de devolución" — ver /politica-de-devoluciones.
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const sucursalSlug = await getSelectedBranchSlug();
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(sucursalSlug), getAccesoriosDesdePOS(sucursalSlug)]);
  const product = productos.find((p) => p.slug === slug);
  if (!product) notFound();
  // Sólo las tuercas con foto y código (las que se pueden mostrar y emparejar con un auto).
  const tuercasMuestra = accesorios.filter((a) => a.imageUrl && a.codigoTango && a.enStock);

  const tireLabel = getTireLabel(product.slug);
  const utqg = getUtqg(product.brandId, product.modeloBase, product.slug);
  const treadCloseup = getTreadCloseup(product.imageUrl);
  const extraPhotos = [...(treadCloseup ? [treadCloseup] : []), ...getExtraPhotos(product.brandId, product.modeloBase, product.size)];
  const brandLogo = getBrandLogo(product.brandId);
  const brand = BRANDS.find((b) => b.id === product.brandId);
  const speedKmh = product.speedRating ? SPEED_RATING_KMH[product.speedRating] : undefined;
  const loadKg = product.loadIndex ? LOAD_INDEX_KG[product.loadIndex] : undefined;
  const loadDualKg = product.loadIndexDual ? LOAD_INDEX_KG[product.loadIndexDual] : undefined;
  const vehiculos = vehiclesUsingSize(product.size);
  // Un modelo con varias versiones/generaciones en esta medida es un solo ítem.
  const modelosCompatibles: ModeloCompatible[] = [];
  for (const v of vehiculos) {
    const href = `/vehiculos/${vehicleSlug(v.brand, v.model)}`;
    const existente = modelosCompatibles.find((m) => m.href === href);
    const full = [v.generation, v.years, v.version].filter(Boolean).join(" · ");
    if (existente) {
      if (v.years && !existente.detail.split(", ").includes(v.years)) existente.detail = [existente.detail, v.years].filter(Boolean).join(", ");
      if (full) existente.full = [existente.full, full].filter(Boolean).join(" | ");
    } else {
      modelosCompatibles.push({ brand: v.brand, model: v.model, detail: v.years ?? "", full, href, brandHref: `/vehiculos/marca/${marcaSlug(v.brand)}`, foto: vehiclePhoto(vehicleSlug(v.brand, v.model)), rank: popularityRank(v.brand, v.model) });
    }
  }
  // Mismo criterio que los listados: el más barato con stock de su medida y tipo.
  const peers = peersByGroup(productos).get(product.id) ?? [];

  // Una tarjeta por marca (la más barata en stock), no cada SKU — mostrar
  // 3 modelos de la misma marca en distinto precio es ruido, lo que importa
  // acá es "esta medida también la tenés en otra marca".
  const otrasMarcasMismaMedida = (() => {
    const porMarca = new Map<string, typeof product>();
    for (const p of productos) {
      if (p.id === product.id || p.brand === product.brand || !p.enStock) continue;
      if (!sizesEqual(p.size, product.size)) continue;
      const actual = porMarca.get(p.brand);
      if (!actual || p.price < actual.price) porMarca.set(p.brand, p);
    }
    return Array.from(porMarca.values()).sort((a, b) => a.price - b.price).slice(0, 6);
  })();

  // Mismo rodado, otra medida: para quien todavía no cerró la medida o busca
  // algo parecido. Una tarjeta por medida (la más barata en stock), de la
  // misma clase (carga con carga), las de diámetro total más cercano primero.
  const mismoRodado = (() => {
    const diametro = (z: typeof product.size) => z.rim * 25.4 + (2 * z.width * z.profile) / 100;
    const d0 = diametro(product.size);
    const porMedida = new Map<string, typeof product>();
    for (const p of productos) {
      if (p.id === product.id || !p.enStock) continue;
      if (p.size.rim !== product.size.rim || sizesEqual(p.size, product.size)) continue;
      if (Boolean(p.isCarga) !== Boolean(product.isCarga)) continue;
      const key = sizeSlug(p.size);
      const actual = porMedida.get(key);
      if (!actual || p.price < actual.price) porMedida.set(key, p);
    }
    return Array.from(porMedida.values())
      .sort((x, y) => Math.abs(diametro(x.size) - d0) - Math.abs(diametro(y.size) - d0) || x.price - y.price)
      .slice(0, 4);
  })();

  const characteristics = [
    { label: "Ancho", value: `${product.size.width} mm` },
    { label: "Perfil", value: `${product.size.profile}%` },
    { label: "Rodado", value: `R${product.size.rim}` },
    { label: "Marca", value: product.brand },
    { label: "Línea", value: product.model.replace(/^\d+\/\d+ R\d+[A-Z]* /, "").replace(new RegExp(`^${product.brand}\\s+`, "i"), "") },
    ...(tireLabel ? [
      { label: "Eficiencia de combustible", value: `Clase ${tireLabel.energyClass}` },
      { label: "Frenado en mojado", value: `Clase ${tireLabel.wetGripClass}` },
      { label: "Ruido externo", value: `${tireLabel.noiseDb} dB (Clase ${tireLabel.noiseClass})` },
    ] : []),
    ...(product.loadIndex && product.loadIndexDual
      ? [
          {
            label: "Índice de carga (montaje simple)",
            value: loadKg ? `${product.loadIndex} (${loadKg} kg)` : product.loadIndex,
          },
          {
            label: "Índice de carga (rodado dual)",
            value: loadDualKg ? `${product.loadIndexDual} (${loadDualKg} kg)` : product.loadIndexDual,
          },
        ]
      : product.loadIndex
        ? [{ label: "Índice de carga (por rueda)", value: loadKg ? `${product.loadIndex} (${loadKg} kg)` : product.loadIndex }]
        : []),
    ...(product.speedRating
      ? [{ label: "Índice de velocidad", value: speedKmh ? `${product.speedRating} (hasta ${speedKmh} km/h)` : product.speedRating }]
      : []),
    ...(vehiculos.length > 0
      ? [{ label: "Vehículos compatibles", value: `${vehiculos.length} modelos` }]
      : []),
    ...(brand?.origin ? [{ label: "Origen", value: brand.origin }] : []),
    ...(utqg ? [{ label: "UTQG (norma EE. UU.)", value: `${utqg.treadwear} ${utqg.traction} ${utqg.temperature}` }] : []),
    { label: "Garantía", value: "1 año" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pt-3 pb-4 md:pt-4 md:pb-6">
      <JsonLd data={buildProductJsonLd(product, tireLabel)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: `Rodado ${product.size.rim}`, path: `/neumaticos/${rimSlug(product.size.rim)}` },
          { name: formatSize(product.size, product.isCarga), path: `/neumaticos/${sizeSlug(product.size)}` },
          { name: `${product.brand} ${product.model}`, path: `/productos/${product.slug}` },
        ])}
      />
      {/* Migas visibles: además de acompañar al JSON-LD, son el enlace interno
          que conecta cada ficha con su página de medida, que es la que rankea
          para "neumáticos 205/55 R16". */}
      <nav aria-label="Migas de pan" className="mb-3 text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500">
          <li className="flex items-center gap-2">
            <Link href="/neumaticos" className="transition-colors hover:text-navy-700">
              Neumáticos
            </Link>
            <span aria-hidden className="text-slate-300">/</span>
          </li>
          <li className="flex items-center gap-2">
            <Link
              href={`/neumaticos/${rimSlug(product.size.rim)}`}
              className="transition-colors hover:text-navy-700"
            >
              Rodado {product.size.rim}
            </Link>
            <span aria-hidden className="text-slate-300">/</span>
          </li>
          <li className="flex items-center gap-2">
            <Link
              href={`/neumaticos/${sizeSlug(product.size)}`}
              className="font-semibold text-navy-700 transition-colors hover:text-navy-900"
            >
              {formatSize(product.size, product.isCarga)}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 gap-4 md:gap-12">
        {/* Image */}
        <div>
          <ProductImageGallery product={product} extraPhotos={extraPhotos} label={tireLabel} utqg={utqg} />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-normal text-slate-900 mb-3 leading-tight">
            <ProductNameWithHighlightedSize product={product} sizeClassName="font-bold" hideBrand />
          </h1>

          <Link href={`/marcas/${product.brandId}`} className="mb-2 group/brand inline-block">
            {brandLogo ? (
              <img src={brandLogo} alt={product.brand} className={`h-7 w-auto max-w-[140px] ${product.brandId === "pirelli" ? "" : "rounded"} object-contain transition-all hover:scale-105`} />
            ) : (
              <h2 className="text-base font-bold text-navy-600 uppercase tracking-wide group-hover/brand:text-navy-900 transition-colors">
                {product.brand}
              </h2>
            )}
          </Link>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm ${
                    tag.toLowerCase().includes('pack')
                      ? 'bg-black text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="border-t border-slate-100 pt-4 mt-2">
            <LivePrice id={product.id} price={product.price} priceOld={product.priceOld} peers={peers} groupLabel={groupLabel(product)} />

            {/* Client component handles branch-specific WhatsApp link */}
            <ProductPageClient product={product} tuercasMuestra={tuercasMuestra} />
          </div>
        </div>
      </div>

      {/* Descripción + Características técnicas */}
      <div className="grid md:grid-cols-2 gap-10 mt-14 pt-10 border-t border-slate-100">
        <div>
          <h2 className="text-lg font-black text-navy-900 mb-4 uppercase tracking-wide">Descripción</h2>
          <p className="text-slate-600 leading-relaxed">
            Neumático {product.brand} pensado para {vehicleLabel(product)}, en la medida {product.size.width}/{product.size.profile} R{product.size.rim}{product.isCarga ? "C" : ""}.{" "}
            {brand?.fullDescription || brand?.description || `${product.brand} ofrece una relación costo-beneficio competitiva, con buen agarre y durabilidad para uso diario.`}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {product.isCarga ? (
              <>
                {esRodadoCamion(product.size.rim)
                  ? "Es un neumático de carga para camiones medianos."
                  : "Es un neumático de carga (serie C)."}{" "}
                <Link href="/neumaticos/carga" className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900">
                  Ver todos los de carga.
                </Link>
              </>
            ) : product.isAT ? (
              <>
                Es un neumático A/T (All Terrain).{" "}
                <Link href="/neumaticos/at" className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900">
                  Ver todos los A/T.
                </Link>
              </>
            ) : (
              <>
                Es un neumático H/T (Highway Terrain), de calle.{" "}
                <Link href="/neumaticos/ht" className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900">
                  Ver todos los H/T.
                </Link>
              </>
            )}
          </p>
          {tireLabel && <EuLabelBlock
              label={tireLabel}
              alt={`Etiqueta de eficiencia energética UE — ${product.brand} ${product.modeloBase}, ${tireLabel.tyreDesignation}`}
            />}
          {utqg && (
            <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
              <strong className="text-slate-700">UTQG {utqg.treadwear} {utqg.traction} {utqg.temperature}:</strong>{" "}
              desgaste relativo {utqg.treadwear}, tracción {utqg.traction} y temperatura {utqg.temperature}, norma de
              EE. UU. (no forma parte de la etiqueta europea).{" "}
              <Link href="/utqg" className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900">Qué significa.</Link>
            </p>
          )}

          <div id="garantia" className="mt-6 scroll-mt-36 overflow-hidden rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md">
            <div className="flex items-center gap-3 bg-amber-500 px-4 py-3 text-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.75 1.75L14.5 10" />
                </svg>
              </span>
              <div className="leading-tight">
                <p className="text-lg font-black uppercase tracking-tight">Garantía de 1 año</p>
                <Link href="/garantia-neumaticos" className="text-xs font-bold text-amber-50 underline underline-offset-2 hover:text-white">Por defecto de fabricación, gestionada directo con nosotros &rarr;</Link>
              </div>
            </div>
            <div className="grid gap-3 p-4 text-sm leading-snug sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-wide text-emerald-700">&#10003; Cubre</p>
                <p className="text-slate-700">Fallas de fabricación del neumático desde la fecha de compra.</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-wide text-red-700">&#10005; No cubre</p>
                <p className="text-slate-700">Desgaste por uso, pinchaduras, cortes ni daños por golpes, baches o falta de alineación.</p>
              </div>
              <p className="border-t border-amber-200 pt-3 text-xs font-bold text-amber-900 sm:col-span-2">
                Se gestiona en el local presentando la factura de compra.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-black text-navy-900 mb-4 uppercase tracking-wide">Características técnicas</h2>
          <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {characteristics.map((c) => (
              <li key={c.label} className="flex items-center justify-between px-4 py-3 bg-white">
                <span className="text-sm font-semibold text-slate-500">{c.label}</span>
                <span className="text-sm font-black text-navy-900">{c.value}</span>
              </li>
            ))}
          </ul>
          {product.loadIndexDual && (
            <p className="mt-3 text-xs text-slate-500">
              ¿Por qué trae dos índices de carga?{" "}
              <Link
                href="/blog/carga-simple-y-dual-neumaticos-c"
                className="font-bold text-navy-700 underline underline-offset-2"
              >
                Te lo explicamos acá
              </Link>
              .
            </p>
          )}

          <a
            href={`/productos/${product.slug}/ficha-tecnica.pdf`}
            target="_blank"
            rel="noopener"
            className="mt-4 flex items-center justify-between gap-3 rounded-xl border-2 border-navy-900 bg-white px-4 py-3 text-sm font-black text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
              Descargar ficha técnica completa (PDF)
            </span>
            <span className="text-xs font-bold opacity-70">PDF</span>
          </a>
        </div>
      </div>

      {/* Si hay un auto elegido: aviso de compatibilidad, antes de la lista de modelos */}
      <CompatibilidadVehiculo product={product} />

      {/* Modelos de autos compatibles con esta medida */}
      {vehiculos.length > 0 && (
        <div id="vehiculos-compatibles" className="mt-14 pt-10 border-t border-slate-100 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-black text-navy-900 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-5 h-5 text-navy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Modelos de auto compatibles ({formatSize(product.size, product.isCarga)})
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Modelos que utilizan neumáticos {formatSize(product.size, product.isCarga)} de fábrica en alguna de sus versiones:
              </p>
            </div>
            <Link
              href={`/neumaticos/${sizeSlug(product.size)}`}
              className="text-xs font-bold text-navy-700 hover:text-navy-900 underline decoration-navy-300 hover:decoration-navy-900 whitespace-nowrap self-start sm:self-center transition-colors"
            >
              Ver todos en {formatSize(product.size, product.isCarga)} →
            </Link>
          </div>

          <ModelosCompatibles items={modelosCompatibles} />
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            * Te recomendamos verificar la medida grabada en el lateral de tus neumáticos actuales o en el parante de la puerta antes de realizar la compra.
          </p>
        </div>
      )}

      {/* Misma medida en otras marcas */}
      {otrasMarcasMismaMedida.length > 0 && (
        <div className="mt-14 pt-10 border-t border-slate-100">
          <h2 className="text-lg font-black text-navy-900 uppercase tracking-wide flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {formatSize(product.size, product.isCarga)} en otras marcas
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Misma medida, con stock disponible ahora en otras marcas:
          </p>
          <SortedProductGrid
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            items={otrasMarcasMismaMedida.map((p) => ({ product: p }))}
          />
        </div>
      )}

      {/* Mismo rodado, otras medidas */}
      {mismoRodado.length > 0 && (
        <div className="mt-14 pt-10 border-t border-slate-100">
          <h2 className="text-lg font-black text-navy-900 uppercase tracking-wide mb-1">
            Más neumáticos rodado {product.size.rim}
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Otras medidas del mismo rodado con stock ahora. Antes de cambiar de medida, confirmá cuál sirve para tu
            vehículo.{" "}
            {TIRE_RIMS.includes(product.size.rim) && (
              <Link href={`/neumaticos/${rimSlug(product.size.rim)}`} className="font-bold text-[#ff1e00] underline">
                Ver todas las medidas R{product.size.rim}
              </Link>
            )}
          </p>
          <SortedProductGrid
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            items={mismoRodado.map((p) => ({ product: p }))}
          />
        </div>
      )}

      <CompatibleAccessorySection />
    </div>
  );
}
