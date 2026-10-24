"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";
import { ImageLightbox } from "./ImageLightbox";
import { ZoomPanel } from "./ZoomPanel";

// Mismo zoom que la galería de neumáticos (ProductImageGallery).
const ZOOM_FACTOR = 2.5;

type Slide =
  | { kind: "foto" | "tarjeta"; src: string; alt: string; label: string }
  | { kind: "sucursal"; src: string; alt: string; label: string; branchName: string; address: string; city: string; hours: string; mapUrl: string };

const LOCK_SVG = (
  <svg className="h-full w-full text-slate-300" viewBox="0 0 100 100" fill="none">
    <rect x="25" y="45" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="8" />
    <path d="M35 45V32a15 15 0 0 1 30 0v13" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <circle cx="50" cy="63" r="6" fill="currentColor" />
  </svg>
);

/**
 * Galería de la ficha de una tuerca antirrobo: foto del POS, tarjeta con los
 * vehículos compatibles (un archivo real, para que salga en la búsqueda de
 * imágenes), foto del taller y fachada de la sucursal.
 */
export function AccessoryGallery({
  nombre,
  imageUrl,
  cardSrc,
  tallerFoto,
  llavesFoto,
}: {
  nombre: string;
  imageUrl: string | null;
  cardSrc: string | null;
  tallerFoto: { src: string; alt: string };
  llavesFoto: { src: string; alt: string };
}) {
  const { selectedBranch } = useBranch();

  const slides: Slide[] = [
    ...(imageUrl ? [{ kind: "foto" as const, src: imageUrl, alt: nombre, label: "Ver foto del producto" }] : []),
    ...(cardSrc
      ? [{ kind: "tarjeta" as const, src: cardSrc, alt: `${nombre}: vehículos compatibles. Incluye 2 llaves`, label: "Ver vehículos compatibles" }]
      : []),
    { kind: "foto" as const, src: llavesFoto.src, alt: llavesFoto.alt, label: "Ver las dos llaves" },
    { kind: "foto" as const, src: tallerFoto.src, alt: tallerFoto.alt, label: "Ver foto del taller" },
    ...(selectedBranch.facadePhoto
      ? [
          {
            kind: "sucursal" as const,
            src: selectedBranch.facadePhoto,
            alt: `Fachada de ${selectedBranch.name}`,
            label: "Ver sucursal",
            branchName: selectedBranch.shortName,
            address: selectedBranch.address,
            city: selectedBranch.city,
            hours: selectedBranch.hours,
            mapUrl: selectedBranch.mapUrl,
          },
        ]
      : []),
  ];

  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [lensStyle, setLensStyle] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [focal, setFocal] = useState({ x: 0.5, y: 0.5 });
  const [frameRect, setFrameRect] = useState<DOMRect | null>(null);
  // Aspect real de la imagen: la lente respeta lo que object-contain dibuja.
  const [imgAspect, setImgAspect] = useState(1);
  const boxRef = useRef<HTMLButtonElement>(null);
  const current = slides[Math.min(index, slides.length - 1)];
  const go = (i: number) => {
    setIndex((i + slides.length) % slides.length);
    setImgAspect(1);
  };
  const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frameAspect = rect.width / rect.height;
    const w = imgAspect > frameAspect ? rect.width : rect.height * imgAspect;
    const hh = imgAspect > frameAspect ? rect.width / imgAspect : rect.height;
    const img = { left: (rect.width - w) / 2, top: (rect.height - hh) / 2, width: w, height: hh };
    const lensW = img.width / ZOOM_FACTOR;
    const lensH = img.height / ZOOM_FACTOR;
    const left = Math.min(Math.max(e.clientX - rect.left - lensW / 2, img.left), img.left + img.width - lensW);
    const top = Math.min(Math.max(e.clientY - rect.top - lensH / 2, img.top), img.top + img.height - lensH);
    setLensStyle({ left, top, width: lensW, height: lensH });
    setFocal({ x: (left - img.left + lensW / 2) / img.width, y: (top - img.top + lensH / 2) / img.height });
    setFrameRect(rect);
  }

  return (
    <div>
      <div
        className={`group relative aspect-square overflow-hidden rounded-2xl bg-slate-50 ${
          current.kind === "foto" && current.src === imageUrl ? "p-8" : ""
        }`}
      >
        {current.kind === "sucursal" ? (
          <div className="relative h-full w-full">
            <Image src={current.src} alt={current.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-5 pb-5 pt-16 text-left text-white">
              <p className="text-2xl font-black">{current.branchName}</p>
              <p className="mt-1.5 text-base leading-snug text-slate-200">
                {current.address}, {current.city}
              </p>
              <p className="mt-0.5 text-base leading-snug text-slate-200">{current.hours}</p>
              <p className="mt-3 inline-block rounded-md bg-orange-500 px-3 py-1.5 text-xs font-black uppercase tracking-wide">
                Colocación sin cargo
              </p>
              <div className="mt-3">
                <a
                  href={current.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-black transition-colors hover:bg-orange-600"
                >
                  Cómo llegar
                </a>
              </div>
            </div>
          </div>
        ) : (
          <button
            ref={boxRef}
            type="button"
            onClick={() => setLightbox(true)}
            onMouseEnter={() => !isTouch() && setZoomed(true)}
            onMouseLeave={() => {
              setZoomed(false);
              setFrameRect(null);
            }}
            onMouseMove={handleMouseMove}
            className="relative block h-full w-full cursor-zoom-in"
            aria-label="Ampliar imagen"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              onLoad={(e) => setImgAspect(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
            />
            {zoomed && (
              <span
                className="pointer-events-none absolute hidden border-2 border-white bg-white/30 shadow-[0_0_0_1px_rgba(0,0,0,0.15)] lg:block"
                style={{ left: lensStyle.left, top: lensStyle.top, width: lensStyle.width, height: lensStyle.height }}
              />
            )}
            <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6" />
              </svg>
            </span>
          </button>
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white transition-opacity hover:bg-black/55 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white transition-opacity hover:bg-black/55 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Imagen siguiente"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {slides.length === 0 && <div className="mx-auto h-48 w-48">{LOCK_SVG}</div>}
      </div>

      {zoomed && frameRect && current.kind !== "sucursal" && (
        <ZoomPanel
          src={current.src}
          alt={current.alt}
          zoomFactor={ZOOM_FACTOR}
          aspect={imgAspect}
          focal={focal}
          anchorRect={frameRect}
          utqg={null}
        />
      )}

      {lightbox && current.kind !== "sucursal" && (
        <ImageLightbox src={current.src} alt={current.alt} onClose={() => setLightbox(false)} />
      )}

      {slides.length > 1 && (
        <div className="mt-3 flex gap-3">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition-colors ${
                index === i ? "border-navy-700" : "border-transparent hover:border-slate-200"
              }`}
              aria-label={slide.label}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="64px"
                className={slide.kind === "foto" && slide.src === imageUrl ? "object-contain p-1.5" : "object-cover"}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
