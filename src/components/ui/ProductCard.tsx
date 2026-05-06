"use client";

import Image from "next/image";
import Link from "next/link";
import { useBranch } from "@/contexts/branch-context";
import type { TireProduct } from "@/lib/types";

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

export function ProductCard({ product }: { product: TireProduct }) {
  const { selectedBranch } = useBranch();
  const hasImage =
    !!product.imageUrl && product.imageUrl !== "/images/tire-placeholder.webp";

  return (
    <article className="group bg-white rounded-2xl border border-slate-100 hover:border-navy-200 hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/productos/${product.slug}`} className="relative bg-slate-50 pt-[60%] overflow-hidden block">
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

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.priceOld && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              −{discount(product.price, product.priceOld)}%
            </span>
          )}
          {product.isImported && (
            <span className="bg-navy-800 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Importado
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-navy-600 uppercase tracking-wide">
            {product.brand}
          </span>
          {product.tags[0] && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
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

        {/* Stock badge */}
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-2 mb-4 text-xs text-slate-500 border border-slate-100">
          <svg className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>Consultar stock en <strong>{selectedBranch.shortName}</strong></span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          {product.priceOld && (
            <span className="text-slate-400 line-through text-xs block">
              {formatPrice(product.priceOld)}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-900">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* CTA */}
          <a
            href={`https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(
              `Hola, quiero consultar por el neumático ${product.brand} ${product.model} (SKU: ${product.id})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
