"use client";

import { useState } from "react";
import Image from "next/image";
import type { TireProduct } from "@/lib/types";
import type { TireLabel } from "@/lib/tire-labels";
import { ImageLightbox } from "./ImageLightbox";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const current = slides[index];
  const eprelUrl = label ? `https://eprel.ec.europa.eu/screen/product/tyres/${label.eprelId}` : undefined;

  function handleImageClick() {
    if (!current) return;
    // El QR de la etiqueta no se puede escanear desde la propia pantalla del
    // celular: en touch, en vez de ampliar, vamos directo al registro EPREL.
    const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
    if (current.kind === "etiqueta" && isTouch && eprelUrl) {
      window.open(eprelUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setLightboxOpen(true);
  }

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
      <div className="bg-slate-50 rounded-2xl aspect-square flex items-center justify-center p-8 relative group">
        {current?.kind === "foto" && index === 0 && badges}
        {current ? (
          <button
            type="button"
            onClick={handleImageClick}
            aria-label={current.kind === "etiqueta" ? "Ver registro oficial en EPREL" : "Ampliar imagen"}
            className={`relative h-full w-full cursor-zoom-in ${current.kind === "etiqueta" ? "p-4" : ""}`}
          >
            <Image src={current.src} alt={current.alt} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" priority={index === 0} />
            <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6" />
              </svg>
            </span>
          </button>
        ) : (
          <div className="w-48 h-48">{TIRE_SVG}</div>
        )}
      </div>

      {lightboxOpen && current && (
        <ImageLightbox
          src={current.src}
          alt={current.alt}
          eprelUrl={current.kind === "etiqueta" ? eprelUrl : undefined}
          onClose={() => setLightboxOpen(false)}
        />
      )}

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
