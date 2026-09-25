"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { TireProduct } from "@/lib/types";
import type { TireLabel } from "@/lib/tire-labels";
import { ImageLightbox } from "./ImageLightbox";
import { ZoomPanel } from "./ZoomPanel";

const ZOOM_FACTOR = 2.5;

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
  const [zoomed, setZoomed] = useState(false);
  const [lensStyle, setLensStyle] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [focal, setFocal] = useState({ x: 0.5, y: 0.5 });
  const [frameRect, setFrameRect] = useState<DOMRect | null>(null);
  // Aspect ratio real de la imagen (ancho/alto), usado por la lente de las
  // fotos para respetar el área que object-contain dibuja dentro del marco.
  // La etiqueta UE se muestra completa en su panel cuadrado (sin lente).
  const [imgAspect, setImgAspect] = useState(1);
  const boxRef = useRef<HTMLButtonElement>(null);
  const current = slides[index];
  const eprelUrl = label ? `https://eprel.ec.europa.eu/screen/product/tyres/${label.eprelId}` : undefined;

  // Zoom tipo Amazon: solo tiene sentido con mouse (hover real), no en touch.
  const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  // Rectángulo real que ocupa la imagen dentro de un marco de frameW x frameH
  // con object-contain, dado su aspect ratio.
  function containRect(frameW: number, frameH: number, aspect: number) {
    const frameAspect = frameW / frameH;
    if (aspect > frameAspect) {
      const width = frameW;
      const height = frameW / aspect;
      return { left: 0, top: (frameH - height) / 2, width, height };
    }
    const height = frameH;
    const width = frameH * aspect;
    return { left: (frameW - width) / 2, top: 0, width, height };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const img = containRect(rect.width, rect.height, imgAspect);
    const lensW = img.width / ZOOM_FACTOR;
    const lensH = img.height / ZOOM_FACTOR;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const left = Math.min(Math.max(mouseX - lensW / 2, img.left), img.left + img.width - lensW);
    const top = Math.min(Math.max(mouseY - lensH / 2, img.top), img.top + img.height - lensH);
    setLensStyle({ left, top, width: lensW, height: lensH });
    setFocal({
      x: (left - img.left + lensW / 2) / img.width,
      y: (top - img.top + lensH / 2) / img.height,
    });
    setFrameRect(rect);
  }

  function handleImageClick() {
    if (!current) return;
    // El QR de la etiqueta no se puede escanear desde la propia pantalla del
    // celular: en touch, en vez de ampliar, vamos directo al registro EPREL.
    if (current.kind === "etiqueta" && isTouch() && eprelUrl) {
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
      <div className="bg-slate-50 rounded-2xl aspect-square flex items-center justify-center p-8 relative group overflow-hidden">
        {current?.kind === "foto" && index === 0 && badges}
        {current ? (
          <button
            ref={boxRef}
            type="button"
            onClick={handleImageClick}
            onMouseEnter={() => !isTouch() && setZoomed(true)}
            onMouseLeave={() => {
              setZoomed(false);
              setFrameRect(null);
            }}
            onMouseMove={handleMouseMove}
            aria-label={current.kind === "etiqueta" ? "Ver registro oficial en EPREL" : "Ampliar imagen"}
            className={`relative h-full w-full cursor-zoom-in ${current.kind === "etiqueta" ? "p-4" : ""}`}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
              onLoad={(e) => setImgAspect(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
            />
            {zoomed && current.kind !== "etiqueta" && (
              <span
                className="hidden lg:block absolute border-2 border-white bg-white/30 shadow-[0_0_0_1px_rgba(0,0,0,0.15)] pointer-events-none"
                style={{ left: lensStyle.left, top: lensStyle.top, width: lensStyle.width, height: lensStyle.height }}
              />
            )}
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

      {zoomed && frameRect && current && (
        <ZoomPanel
          src={current.src}
          alt={current.alt}
          zoomFactor={ZOOM_FACTOR}
          aspect={imgAspect}
          focal={focal}
          anchorRect={frameRect}
          showEntireImage={current.kind === "etiqueta"}
        />
      )}

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
              onClick={() => {
                setIndex(i);
                setImgAspect(1);
              }}
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
