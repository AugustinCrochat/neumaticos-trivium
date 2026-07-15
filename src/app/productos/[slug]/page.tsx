import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getBrandLogo } from "@/lib/brand-utils";
import { BRANDS } from "@/lib/data";
import { SITE_URL } from "@/lib/config";
import { ProductNameWithHighlightedSize } from "@/components/ui/ProductNameWithHighlightedSize";
import { ProductPageClient } from "./ProductPageClient";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

// Sin generateStaticParams: las páginas se generan on-demand (ISR) contra el
// catálogo real del POS, no se conoce el set de slugs en build time.

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const productos = await getProductosDesdePOS();
  const product = productos.find((p) => p.slug === slug);
  if (!product) return {};
  const loadSpeed = product.loadIndex && product.speedRating ? ` ${product.loadIndex}${product.speedRating}` : "";
  const sizeRegex = new RegExp(`(${product.size.width}\\s*/\\s*${product.size.profile}\\s*R\\s*${product.size.rim})`, "i");
  const title = product.model.replace(sizeRegex, `$1${loadSpeed}`);
  const fullTitle = `${title} — Neumáticos Trivium`;
  const description = `Comprá el neumático ${title} al mejor precio. Outlet de neumáticos importados en Argentina.`;
  // WhatsApp/redes necesitan una URL absoluta para mostrar la foto al compartir el link.
  const ogImage = product.imageUrl.startsWith("http") ? product.imageUrl : `${SITE_URL}${product.imageUrl}`;
  const pageUrl = `${SITE_URL}/productos/${product.slug}`;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: "Neumáticos Trivium",
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
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

function discount(price: number, priceOld: number) {
  return Math.round(((priceOld - price) / priceOld) * 100);
}

// Tabla de referencia de índices de velocidad habituales en neumáticos de auto/camioneta.
const SPEED_RATING_KMH: Record<string, number> = {
  Q: 160, R: 170, S: 180, T: 190, U: 200, H: 210, V: 240, W: 270, Y: 300,
};

// Tabla ETRTO de índice de carga -> peso máximo por neumático (kg).
const LOAD_INDEX_KG: Record<string, number> = {
  "60": 250, "61": 257, "62": 265, "63": 272, "64": 280, "65": 290, "66": 300, "67": 307, "68": 315, "69": 325,
  "70": 335, "71": 345, "72": 355, "73": 365, "74": 375, "75": 387, "76": 400, "77": 412, "78": 425, "79": 437,
  "80": 450, "81": 462, "82": 475, "83": 487, "84": 500, "85": 515, "86": 530, "87": 545, "88": 560, "89": 580,
  "90": 600, "91": 615, "92": 630, "93": 650, "94": 670, "95": 690, "96": 710, "97": 730, "98": 750, "99": 775,
  "100": 800, "101": 825, "102": 850, "103": 875, "104": 900, "105": 925, "106": 950, "107": 975, "108": 1000, "109": 1030,
  "110": 1060, "111": 1090, "112": 1120, "113": 1150, "114": 1180, "115": 1215, "116": 1250, "117": 1285, "118": 1320, "119": 1360,
  "120": 1400, "121": 1450, "122": 1500, "123": 1550, "124": 1600, "125": 1650, "126": 1700, "127": 1750, "128": 1800, "129": 1850,
  "130": 1900,
};

function vehicleLabel(product: { vehicleType: string[] }) {
  const hasAuto = product.vehicleType.includes("auto");
  const hasCamioneta = product.vehicleType.includes("camioneta");
  if (hasAuto && hasCamioneta) return "autos y camionetas";
  if (hasCamioneta) return "camionetas";
  return "autos";
}

const TIRE_SVG = (
  <svg className="w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" />
    <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
  </svg>
);

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const productos = await getProductosDesdePOS();
  const product = productos.find((p) => p.slug === slug);
  if (!product) notFound();

  const hasImage =
    !!product.imageUrl && product.imageUrl !== "/images/tire-placeholder.webp";
  const brandLogo = getBrandLogo(product.brandId);
  const brand = BRANDS.find((b) => b.id === product.brandId);
  const speedKmh = product.speedRating ? SPEED_RATING_KMH[product.speedRating] : undefined;
  const loadKg = product.loadIndex ? LOAD_INDEX_KG[product.loadIndex] : undefined;
  const loadSpeed = product.loadIndex && product.speedRating ? ` ${product.loadIndex}${product.speedRating}` : "";

  const characteristics = [
    { label: "Ancho", value: `${product.size.width} mm` },
    { label: "Perfil", value: `${product.size.profile}%` },
    { label: "Rodado", value: `R${product.size.rim}` },
    { label: "Marca", value: product.brand },
    { label: "Línea", value: product.model.replace(/^\d+\/\d+ R\d+ /, "").replace(new RegExp(`^${product.brand}\\s+`, "i"), "") },
    ...(product.loadIndex
      ? [{ label: "Índice de carga (por rueda)", value: loadKg ? `${product.loadIndex} (${loadKg} kg)` : product.loadIndex }]
      : []),
    ...(product.speedRating
      ? [{ label: "Índice de velocidad", value: speedKmh ? `${product.speedRating} (hasta ${speedKmh} km/h)` : product.speedRating }]
      : []),
    ...(brand?.origin ? [{ label: "Origen", value: brand.origin }] : []),
    { label: "Garantía", value: "1 año" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <div className="bg-slate-50 rounded-2xl aspect-square flex items-center justify-center p-8 relative">
          {product.priceOld && (
            <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-md shadow-lg uppercase tracking-tighter">
              {discount(product.price, product.priceOld)}% OFF
            </span>
          )}
          {hasImage ? (
            <div className="relative w-full h-full">
              <Image
                src={product.imageUrl}
                alt={`${product.brand} ${product.model}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="w-48 h-48">{TIRE_SVG}</div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Link href={`/marcas/${product.brandId}`} className="mb-6 group/brand inline-block">
            {brandLogo ? (
              <img src={brandLogo} alt={product.brand} className="h-10 md:h-12 w-auto object-contain max-w-[180px] transition-all hover:scale-105" />
            ) : (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Marca</p>
                <h2 className="text-base font-bold text-navy-600 uppercase tracking-wide group-hover/brand:text-navy-900 transition-colors">
                  {product.brand}
                </h2>
              </div>
            )}
          </Link>
          <h1 className="text-2xl md:text-4xl font-normal text-slate-900 mb-2 leading-tight">
            <ProductNameWithHighlightedSize
              product={product}
              sizeClassName="font-bold"
              afterSize={loadSpeed}
            />
          </h1>

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

          {/* Price */}
          <div className="border-t border-slate-100 pt-6 mt-auto">
            {product.priceOld && (
              <span className="text-slate-400 line-through text-sm block mb-1">
                {formatPrice(product.priceOld)}
              </span>
            )}
            <span className="text-4xl font-black text-red-600">
              {formatPrice(product.price)}
            </span>
            <p className="text-xs text-slate-400 mt-1">Precio por unidad · IVA incluido</p>

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
    </div>
  );
}
