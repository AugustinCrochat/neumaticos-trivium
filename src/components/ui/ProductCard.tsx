"use client";

import Image from "next/image";
import Link from "next/link";
import { useBranch } from "@/contexts/branch-context";
import { getBrandLogo } from "@/lib/brand-utils";
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
}: {
  product: TireProduct;
  imageFooter?: ReactNode;
  isCheapest?: boolean;
}) {
  const { selectedBranch, hasConfirmedBranch, openModalForAction } = useBranch();
  const hasImage =
    !!product.imageUrl && product.imageUrl !== "/images/tire-placeholder.webp";
  const brandLogo = getBrandLogo(product.brandId);

  return (
    <article className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${isCheapest ? "border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02] relative z-20 ring-4 ring-emerald-500/10" : "border-slate-100 hover:border-navy-200 hover:shadow-xl"}`}>
      {/* Image */}
      <Link href={`/productos/${product.slug}`} className="relative bg-slate-50 pt-[60%] overflow-hidden block">
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
        <div className="absolute inset-0 p-3">
          {hasImage ? (
            <div className="relative w-full h-full">
              <Image
                src={product.imageUrl}
                alt={`${product.brand} ${product.model}`}
                fill
                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
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
              <span className="text-xs font-bold text-navy-600 uppercase tracking-wide group-hover/brand:text-navy-900 transition-colors">
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
            {product.model}
          </Link>
        </h3>

        <p className="text-xs text-slate-400 mb-1 font-mono">SKU: {product.id}</p>

        <p className="text-navy-700 font-mono text-sm font-semibold mb-3">
          {product.size.width}/{product.size.profile} R{product.size.rim}
        </p>

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

          {/* CTA */}
          <button
            onClick={() => {
              const waUrl = (branch: typeof selectedBranch) =>
                `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                  `Hola, quiero consultar por el neumático ${product.brand} ${product.model} (SKU: ${product.id})`
                )}`;
              if (hasConfirmedBranch) {
                window.open(waUrl(selectedBranch), "_blank", "noopener,noreferrer");
              } else {
                openModalForAction((branch) =>
                  window.open(waUrl(branch), "_blank", "noopener,noreferrer")
                );
              }
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            title="Consultar por WhatsApp"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {hasConfirmedBranch ? (
              <>
                <span className="hidden sm:inline">Consultar por WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
              </>
            ) : (
              "Elegir sucursal"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
