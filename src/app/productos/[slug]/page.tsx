import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getBrandLogo } from "@/lib/brand-utils";
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
  const title = `${product.brand} ${product.model} ${product.size.width}/${product.size.profile} R${product.size.rim}`;
  return {
    title: `${title} — Neumáticos Trivium`,
    description: `Comprá el neumático ${title} al mejor precio. Outlet de neumáticos importados en Argentina.`,
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 mb-8 transition-colors"
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
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
            <ProductNameWithHighlightedSize
              product={product}
              sizeClassName="inline-flex rounded-xl bg-orange-100 px-2.5 py-1 font-black text-orange-700"
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
    </div>
  );
}
