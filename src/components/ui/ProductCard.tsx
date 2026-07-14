"use client";

import Image from "next/image";
import Link from "next/link";
import { getBrandLogo } from "@/lib/brand-utils";
import { ProductNameWithHighlightedSize } from "@/components/ui/ProductNameWithHighlightedSize";
import type { TireProduct } from "@/lib/types";
import type { ReactNode } from "react";
import { useCart } from "@/contexts/cart-context";

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
  <svg
    className="w-full h-full text-slate-300 group-hover:text-slate-400 transition-colors"
    viewBox="0 0 100 100"
    fill="none"
  >
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" />
    <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
  </svg>
);

export function ProductCard({
  product,
  imageFooter,
  isCheapest,
}: {
  product: TireProduct;
  imageFooter?: ReactNode;
  isCheapest?: boolean;
}) {
  const { addItem } = useCart();
  const hasImage =
    !!product.imageUrl && product.imageUrl !== "/images/tire-placeholder.webp";
  const brandLogo = getBrandLogo(product.brandId);

  return (
    <article className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${isCheapest ? "border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02] relative z-20 ring-4 ring-emerald-500/10" : "border-slate-100 hover:border-navy-200 hover:shadow-xl"}`}>
      {/* Image */}
      <Link href={`/productos/${product.slug}`} className="relative bg-white pt-[95%] overflow-hidden block">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 items-start">
          {isCheapest && (
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md animate-pulse">
              Mejor precio
            </span>
          )}
          {product.priceOld && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg uppercase tracking-tighter">
              {discount(product.price, product.priceOld)}% OFF
            </span>
          )}
        </div>
        <div className="absolute inset-0 p-1">
          {hasImage ? (
            <div className="relative w-full h-full">
              <Image
                src={product.imageUrl}
                alt={`${product.brand} ${product.model}`}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full max-h-32">
              {TIRE_SVG}
            </div>
          )}
        </div>

        {imageFooter && (
          <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center px-3">
            {imageFooter}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Link href={`/marcas/${product.brandId}`} className="group/brand">
            {brandLogo ? (
              <img src={brandLogo} alt={product.brand} className="h-6 w-auto object-contain max-w-[100px] transition-all hover:scale-105" />
            ) : (
              <span className="text-sm font-black text-navy-700 uppercase tracking-tight group-hover/brand:text-navy-900 transition-colors">
                {product.brand}
              </span>
            )}
          </Link>
          {product.tags[0] && (
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider whitespace-nowrap shadow-sm ${
              product.tags[0].toLowerCase().includes('pack') 
                ? 'bg-navy-900 text-white' 
                : 'bg-slate-200 text-slate-700'
            }`}>
              {product.tags[0]}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2" title={product.model}>
          <Link href={`/productos/${product.slug}`} className="hover:text-navy-700 transition-colors">
            <ProductNameWithHighlightedSize product={product} />
          </Link>
        </h3>

        {/* Price */}
        <div className="mt-auto">
          {product.priceOld && (
            <span className="text-slate-400 line-through text-xs block">
              {formatPrice(product.priceOld)}
            </span>
          )}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-2xl font-black text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.tags.find(t => t.toLowerCase().startsWith('pack')) && (() => {
              const packTag = product.tags.find(t => t.toLowerCase().startsWith('pack'));
              const match = packTag?.match(/x(\d+)/i);
              if (match && match[1]) {
                const qty = parseInt(match[1], 10);
                const unitPrice = product.price / qty;
                return (
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded">
                    {formatPrice(unitPrice)} c/u
                  </span>
                );
              }
              return null;
            })()}
          </div>

          <button onClick={() => addItem(product)} disabled={!product.enStock} className="mt-3 w-full bg-navy-800 hover:bg-navy-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
            {product.enStock ? "Agregar al carrito" : "Sin stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
