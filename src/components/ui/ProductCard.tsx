"use client";

import Image from "next/image";
import Link from "next/link";
import { getBrandLogo } from "@/lib/brand-utils";
import { ProductNameWithHighlightedSize } from "@/components/ui/ProductNameWithHighlightedSize";
import { isLowStock, stockLabel } from "@/lib/stock";
import { useLiveStock } from "@/contexts/live-stock-context";
import type { TireProduct } from "@/lib/types";
import type { ReactNode } from "react";

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
  cheapestLabel,
  note,
}: {
  product: TireProduct;
  imageFooter?: ReactNode;
  isCheapest?: boolean;
  /** Medida a la que se refiere el tag, para listados con medidas mezcladas. */
  cheapestLabel?: string;
  note?: ReactNode;
}) {
  const hasImage =
    !!product.imageUrl && product.imageUrl !== "/images/tire-placeholder.webp";
  const brandLogo = getBrandLogo(product.brandId);

  // Corrige stock/precio horneados en el build con el valor real del POS
  // apenas se resuelve el fetch del catálogo vivo (ver LiveStockProvider).
  const live = useLiveStock(product.id);
  const price = live?.price ?? product.price;
  const stock = live?.stock ?? product.stock;
  const enStock = live?.enStock ?? product.enStock;

  return (
    <article className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${isCheapest ? "border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02] relative z-20 ring-4 ring-emerald-500/10" : "border-slate-100 hover:border-navy-200 hover:shadow-xl"}`}>
      {/* Image */}
      <Link href={`/productos/${product.slug}`} className="relative bg-white pt-[95%] overflow-hidden block">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 items-start">
          {isCheapest && (
            <span className="flex max-w-[11rem] items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 py-1 pl-1.5 pr-2.5 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-white">
              <svg className="h-4 w-4 shrink-0 text-amber-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L10 14.9l-5.25 2.8 1-5.85L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
              <span className="flex flex-col leading-none">
                <span className="text-[11px] font-black uppercase tracking-wider">Mejor precio</span>
                {cheapestLabel && <span className="mt-0.5 text-[10px] font-bold text-emerald-50">{cheapestLabel}</span>}
              </span>
            </span>
          )}
          {product.priceOld && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg uppercase tracking-tighter">
              {discount(price, product.priceOld)}% OFF
            </span>
          )}
          {product.isCarga && (
            <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
              Carga
            </span>
          )}
          {product.isAT && (
            <span className="bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
              A/T
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
                ? 'bg-black text-white' 
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

        {note && (
          <p className="text-xs text-emerald-700 font-semibold leading-snug mb-2">
            {note}
          </p>
        )}



        {/* Price */}
        <div className="mt-auto">
          {product.priceOld && (
            <span className="text-slate-400 line-through text-xs block break-words">
              {formatPrice(product.priceOld)}
            </span>
          )}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-2xl font-black text-red-600 break-words">
              {formatPrice(price)}
            </span>
            {product.tags.find(t => t.toLowerCase().startsWith('pack')) && (() => {
              const packTag = product.tags.find(t => t.toLowerCase().startsWith('pack'));
              const match = packTag?.match(/x(\d+)/i);
              if (match && match[1]) {
                const qty = parseInt(match[1], 10);
                const unitPrice = price / qty;
                return (
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded">
                    {formatPrice(unitPrice)} c/u
                  </span>
                );
              }
              return null;
            })()}
          </div>

          {typeof stock === "number" && enStock && (
            <p className={`text-[11px] font-bold mt-1.5 flex items-center gap-1.5 ${isLowStock(stock) ? "text-amber-600" : "text-emerald-600"}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLowStock(stock) ? "bg-amber-500" : "bg-emerald-500"}`} />
              {stockLabel(stock)}
            </p>
          )}

          <Link
            href={`/productos/${product.slug}`}
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-black !text-white !no-underline transition-all ${
              enStock
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98]"
                : "bg-slate-300 text-white pointer-events-none"
            }`}
          >
            {enStock ? (
              <>
                Ver detalle
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              "Sin stock"
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}
