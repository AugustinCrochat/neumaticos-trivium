"use client";

import { useState } from "react";
import Image from "next/image";
import type { TireProduct } from "@/lib/types";
import type { TireLabel } from "@/lib/tire-labels";

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

export function ProductImageGallery({ product, label }: { product: TireProduct; label: TireLabel | null }) {
  const hasImage = !!product.imageUrl && product.imageUrl !== "/images/tire-placeholder.webp";
  const [selected, setSelected] = useState<"foto" | "etiqueta">("foto");

  const badges = (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
      {product.priceOld && (
        <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-md shadow-lg uppercase tracking-tighter">
          {discount(product.price, product.priceOld)}% OFF
        </span>
      )}
      {product.isCarga && (
        <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-md">
          Carga
        </span>
      )}
      {product.isAT && (
        <span className="bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-md">
          A/T
        </span>
      )}
    </div>
  );

  return (
    <div>
      <div className="bg-slate-50 rounded-2xl aspect-square flex items-center justify-center p-8 relative">
        {selected === "foto" && badges}
        {selected === "foto" ? (
          hasImage ? (
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
          )
        ) : (
          label && (
            <div className="relative h-full w-full p-4">
              <Image
                src={label.imagePath}
                alt={`Etiqueta de eficiencia energética UE — ${product.brand} ${product.modeloBase}, ${label.tyreDesignation}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )
        )}
      </div>

      {label && (
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => setSelected("foto")}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition-colors ${
              selected === "foto" ? "border-navy-700" : "border-transparent hover:border-slate-200"
            }`}
            aria-label="Ver foto del producto"
          >
            {hasImage ? (
              <Image src={product.imageUrl} alt="" fill className="object-contain p-1.5" sizes="64px" />
            ) : (
              <div className="p-3">{TIRE_SVG}</div>
            )}
          </button>
          <button
            onClick={() => setSelected("etiqueta")}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors ${
              selected === "etiqueta" ? "border-navy-700" : "border-transparent hover:border-slate-200"
            }`}
            aria-label="Ver etiqueta de eficiencia energética UE"
          >
            <Image src={label.thumbPath} alt="" fill className="object-contain p-1" sizes="64px" />
          </button>
        </div>
      )}
    </div>
  );
}
