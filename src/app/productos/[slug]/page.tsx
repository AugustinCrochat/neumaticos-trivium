import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { getBrandLogo } from "@/lib/brand-utils";
import { BRANDS } from "@/lib/data";
import { BRANCHES, DEFAULT_BRANCH_ID, SHIPPING_FLAT_RATE, SITE_URL } from "@/lib/config";
import { ORGANIZATION_ID, branchNodeId, breadcrumbJsonLd, canonical } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildTireDescription,
  formatSize,
  LOAD_INDEX_KG,
  rimSlug,
  SPEED_RATING_KMH,
  sizeSlug,
  vehiclesUsingSize,
} from "@/lib/tire-sizes";
import { sortVehiclesByPopularity } from "@/lib/vehicles";
import { isLowStock, stockLabel } from "@/lib/stock";
import { getTireLabel } from "@/lib/tire-labels";
import { getExtraPhotos } from "@/lib/product-extra-photos";
import { ProductNameWithHighlightedSize } from "@/components/ui/ProductNameWithHighlightedSize";
import { ProductImageGallery } from "@/components/ui/ProductImageGallery";
import { ProductPageClient } from "./ProductPageClient";

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
  const loadSpeed = product.loadIndex && product.speedRating ? ` ${product.loadIndex}${product.speedRating}` : "";
  // El [A-Z]* al final agarra la "C" de los neumáticos de carga (ej. "R15C")
  // — sin esto, el loadSpeed se insertaba entre el rodado y la "C" (ver
  // ProductNameWithHighlightedSize, que ya maneja este mismo caso).
  const sizeRegex = new RegExp(`(${product.size.width}\\s*/\\s*${product.size.profile}\\s*R\\s*${product.size.rim}[A-Z]*)`, "i");
  const title = product.model.replace(sizeRegex, `$1${loadSpeed}`);
  const fullTitle = `${title} — Neumáticos Trivium`;
  const description = `Comprá el neumático ${title} al mejor precio. Outlet de neumáticos importados en Argentina.`;
  const pageUrl = `${SITE_URL}/productos/${product.slug}`;
  // La imagen de OG/Twitter la arma opengraph-image.tsx en esta misma carpeta
  // (compone la foto del producto sobre el fondo de marca en vez de compartir
  // la foto cruda del POS, que tiene relaciones de aspecto variadas y quedaba
  // recortada al compartir el link).
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
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

function vehicleLabel(product: { vehicleType: string[] }) {
  const hasAuto = product.vehicleType.includes("auto");
  const hasCamioneta = product.vehicleType.includes("camioneta");
  if (hasAuto && hasCamioneta) return "autos y camionetas";
  if (hasCamioneta) return "camionetas";
  return "autos";
}

function buildProductJsonLd(product: {
  id: string; slug: string; brand: string; model: string; imageUrl: string; price: number; enStock?: boolean;
  size: { width: number; profile: number; rim: number }; loadIndex?: string; speedRating?: string;
  vehicleType: string[];
}) {
  const url = `${SITE_URL}/productos/${product.slug}`;
  const image = product.imageUrl.startsWith("http") ? product.imageUrl : `${SITE_URL}${product.imageUrl}`;
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
        ? [{ "@type": "PropertyValue", name: "Índice de carga", value: product.loadIndex }]
        : []),
      ...(product.speedRating
        ? [{ "@type": "PropertyValue", name: "Índice de velocidad", value: product.speedRating }]
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
        merchantReturnDays: 60,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const productos = await getProductosDesdePOS(await getSelectedBranchSlug());
  const product = productos.find((p) => p.slug === slug);
  if (!product) notFound();

  const tireLabel = getTireLabel(product.slug);
  const extraPhotos = getExtraPhotos(product.brandId, product.modeloBase);
  const brandLogo = getBrandLogo(product.brandId);
  const brand = BRANDS.find((b) => b.id === product.brandId);
  const speedKmh = product.speedRating ? SPEED_RATING_KMH[product.speedRating] : undefined;
  const loadKg = product.loadIndex ? LOAD_INDEX_KG[product.loadIndex] : undefined;
  const loadSpeed = product.loadIndex && product.speedRating ? ` ${product.loadIndex}${product.speedRating}` : "";
  const vehiculos = vehiclesUsingSize(product.size);
  const popularPreview = Array.from(
    new Set(sortVehiclesByPopularity(vehiculos).map((v) => `${v.brand} ${v.model}`))
  )
    .slice(0, 5)
    .join(", ");

  const characteristics = [
    { label: "Ancho", value: `${product.size.width} mm` },
    { label: "Perfil", value: `${product.size.profile}%` },
    { label: "Rodado", value: `R${product.size.rim}` },
    { label: "Marca", value: product.brand },
    { label: "Línea", value: product.model.replace(/^\d+\/\d+ R\d+[A-Z]* /, "").replace(new RegExp(`^${product.brand}\\s+`, "i"), "") },
    ...(product.loadIndex
      ? [{ label: "Índice de carga (por rueda)", value: loadKg ? `${product.loadIndex} (${loadKg} kg)` : product.loadIndex }]
      : []),
    ...(product.speedRating
      ? [{ label: "Índice de velocidad", value: speedKmh ? `${product.speedRating} (hasta ${speedKmh} km/h)` : product.speedRating }]
      : []),
    ...(vehiculos.length > 0
      ? [{ label: "Vehículos compatibles", value: `${vehiculos.length} modelos` }]
      : []),
    ...(brand?.origin ? [{ label: "Origen", value: brand.origin }] : []),
    { label: "Garantía", value: "1 año" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pt-3 pb-4 md:pt-4 md:pb-6">
      <JsonLd data={buildProductJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: `Rodado ${product.size.rim}`, path: `/neumaticos/${rimSlug(product.size.rim)}` },
          { name: formatSize(product.size), path: `/neumaticos/${sizeSlug(product.size)}` },
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
              {formatSize(product.size)}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-4 md:gap-12">
        {/* Image */}
        <div>
          <ProductImageGallery product={product} extraPhotos={extraPhotos} label={tireLabel} />
          {tireLabel && (
            <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
              <strong className="text-slate-700">Certificado en la UE:</strong> eficiencia de
              combustible {tireLabel.energyClass}, frenado en mojado {tireLabel.wetGripClass} y{" "}
              {tireLabel.noiseDb} dB de ruido externo, con registro público verificable en{" "}
              <a
                href={`https://eprel.ec.europa.eu/screen/product/tyres/${tireLabel.eprelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900"
              >
                EPREL
              </a>
              . <Link href="/blog/etiqueta-europea-neumaticos" className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900">Qué significa cada dato.</Link>
            </p>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-normal text-slate-900 mb-3 leading-tight">
            <ProductNameWithHighlightedSize
              product={product}
              sizeClassName="font-bold"
              afterSize={loadSpeed}
            />
          </h1>

          <Link href={`/marcas/${product.brandId}`} className="mb-4 group/brand inline-block">
            {brandLogo ? (
              <img src={brandLogo} alt={product.brand} className="h-7 w-auto max-w-[140px] rounded object-contain transition-all hover:scale-105" />
            ) : (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Marca</p>
                <h2 className="text-base font-bold text-navy-600 uppercase tracking-wide group-hover/brand:text-navy-900 transition-colors">
                  {product.brand}
                </h2>
              </div>
            )}
          </Link>

          {popularPreview && (
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Usado en: <span className="font-semibold text-slate-700">{popularPreview}</span>{" "}
              <Link href="#vehiculos-compatibles" className="font-semibold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900 transition-colors">
                y más.
              </Link>
            </p>
          )}

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm ${
                    tag.toLowerCase().includes('pack')
                      ? 'bg-navy-900 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            {product.priceOld && (
              <span className="text-slate-400 line-through text-sm block mb-1">
                {formatPrice(product.priceOld)}
              </span>
            )}
            <span className="text-4xl font-black text-red-600">
              {formatPrice(product.price)}
            </span>
            <p className="text-xs text-slate-400 mt-1">Precio por unidad · IVA incluido</p>
            {typeof product.stock === "number" && product.enStock && (
              <p className={`text-xs font-bold mt-1.5 flex items-center gap-1.5 ${isLowStock(product.stock) ? "text-amber-600" : "text-emerald-600"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLowStock(product.stock) ? "bg-amber-500" : "bg-emerald-500"}`} />
                {stockLabel(product.stock)}
              </p>
            )}

            {/* Client component handles branch-specific WhatsApp link */}
            <ProductPageClient product={product} />
          </div>
        </div>
      </div>

      {/* Descripción + Características técnicas */}
      <div className="grid md:grid-cols-2 gap-10 mt-14 pt-10 border-t border-slate-100">
        <div>
          <h2 className="text-lg font-black text-navy-900 mb-4 uppercase tracking-wide">Descripción</h2>
          <p className="text-slate-600 leading-relaxed">
            Neumático {product.brand} pensado para {vehicleLabel(product)}, en la medida {product.size.width}/{product.size.profile} R{product.size.rim}.{" "}
            {brand?.fullDescription || brand?.description || `${product.brand} ofrece una relación costo-beneficio competitiva, con buen agarre y durabilidad para uso diario.`}
          </p>
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
        </div>
      </div>

      {/* Modelos de autos compatibles con esta medida */}
      {vehiculos.length > 0 && (
        <div id="vehiculos-compatibles" className="mt-14 pt-10 border-t border-slate-100 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-black text-navy-900 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-5 h-5 text-navy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Modelos de auto compatibles ({formatSize(product.size)})
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Modelos que utilizan neumáticos {formatSize(product.size)} de fábrica en alguna de sus versiones:
              </p>
            </div>
            <Link
              href={`/neumaticos/${sizeSlug(product.size)}`}
              className="text-xs font-bold text-navy-700 hover:text-navy-900 underline decoration-navy-300 hover:decoration-navy-900 whitespace-nowrap self-start sm:self-center transition-colors"
            >
              Ver todos en {formatSize(product.size)} →
            </Link>
          </div>

          <ul className="flex flex-wrap gap-2">
            {vehiculos.map((v) => (
              <li
                key={`${v.brand}-${v.model}-${v.generation ?? ""}-${v.version ?? ""}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm"
              >
                <span className="font-bold text-navy-900">
                  {v.brand} {v.model}
                </span>
                {(v.generation || v.version) && (
                  <span className="text-slate-500 font-normal text-xs">
                    ({[v.generation, v.years && `${v.years}`, v.version].filter(Boolean).join(" · ")})
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            * Te recomendamos verificar la medida grabada en el lateral de tus neumáticos actuales o en el parante de la puerta antes de realizar la compra.
          </p>
        </div>
      )}
    </div>
  );
}
