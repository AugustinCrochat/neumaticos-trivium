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

type Slide =
  | { kind: "foto"; src: string; alt: string }
  | { kind: "etiqueta"; src: string; thumbSrc: string; alt: string };

export function ProductImageGallery({
  product,
  extraPhotos = [],
  label,
}: {
  product: TireProduct;
  /** Fotos adicionales del modelo (banda, flanco, llanta), antes de la etiqueta UE. */
  extraPhotos?: string[];
  label: TireLabel | null;
}) {
  const hasImage = !!product.imageUrl && product.imageUrl !== "/images/tire-placeholder.webp";

  const slides: Slide[] = [
    ...(hasImage ? [{ kind: "foto" as const, src: product.imageUrl, alt: `${product.brand} ${product.model}` }] : []),
    ...extraPhotos.map((src) => ({ kind: "foto" as const, src, alt: `${product.brand} ${product.modeloBase} — otro ángulo` })),
    ...(label
      ? [{ kind: "etiqueta" as const, src: label.imagePath, thumbSrc: label.thumbPath, alt: `Etiqueta de eficiencia energética UE — ${product.brand} ${product.modeloBase}, ${label.tyreDesignation}` }]
      : []),
  ];

  const [index, setIndex] = useState(0);
  const current = slides[index];

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
        {current?.kind === "foto" && index === 0 && badges}
        {current ? (
          <div className={`relative h-full w-full ${current.kind === "etiqueta" ? "p-4" : ""}`}>
            <Image src={current.src} alt={current.alt} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" priority={index === 0} />
          </div>
        ) : (
          <div className="w-48 h-48">{TIRE_SVG}</div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex gap-3">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition-colors ${
                index === i ? "border-navy-700" : "border-transparent hover:border-slate-200"
              }`}
              aria-label={slide.kind === "etiqueta" ? "Ver etiqueta de eficiencia energética UE" : "Ver foto del producto"}
            >
              <Image src={slide.kind === "etiqueta" ? slide.thumbSrc : slide.src} alt="" fill className="object-contain p-1.5" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
