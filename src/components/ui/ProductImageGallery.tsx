"use client";

import { EuLabelCard } from "@/components/ui/EuLabelCard";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { TireProduct } from "@/lib/types";
import type { TireLabel } from "@/lib/tire-labels";
import type { Utqg } from "@/lib/utqg";
import { useBranch } from "@/contexts/branch-context";
import { isVisaMasterPromoDay } from "@/lib/promo-day";
import { ImageLightbox } from "./ImageLightbox";
import { ZoomPanel } from "./ZoomPanel";
import { productAlt, productExtraAlt } from "@/lib/image-seo";

const ZOOM_FACTOR = 2.5;

const TIRE_SVG = (
  <svg className="w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" />
    <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
  </svg>
);

type Slide =
  | { kind: "foto"; src: string; alt: string }
  | { kind: "etiqueta"; src: string; thumbSrc: string; alt: string }
  | { kind: "sucursal"; src: string; alt: string; branchName: string; address: string; city: string; hours: string; mapUrl: string };

/** Los enlaces internos del overlay bajan con scroll suave al bloque (sin el salto seco del ancla). */
function scrollSuave(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const destino = document.getElementById(id);
  if (!destino) return;
  e.preventDefault();
  destino.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ProductImageGallery({
  product,
  extraPhotos = [],
  label,
  utqg,
}: {
  product: TireProduct;
  /** Fotos adicionales del modelo (banda, flanco, llanta), antes de la etiqueta UE. */
  extraPhotos?: string[];
  label: TireLabel | null;
  /** Dato separado de la etiqueta UE; se muestra al pie sólo si fue verificado. */
  utqg: Utqg | null;
}) {
  const hasImage = !!product.imageUrl && product.imageUrl !== "/images/tire-placeholder.webp";
  const { selectedBranch } = useBranch();

  // Igual que PaymentMethodsSection: arranca en false y se corrige al montar
  // para no depender del día en que se generó esta página estática.
  const [isPromoDay, setIsPromoDay] = useState(false);
  useEffect(() => {
    const update = () => setIsPromoDay(isVisaMasterPromoDay());
    update();
  }, []);

  const [direccionCopiada, setDireccionCopiada] = useState(false);
  function copiarDireccion(direccion: string) {
    navigator.clipboard
      .writeText(direccion)
      .then(() => {
        setDireccionCopiada(true);
        setTimeout(() => setDireccionCopiada(false), 2000);
      })
      .catch(() => {});
  }

  const slides: Slide[] = [
    ...(hasImage ? [{ kind: "foto" as const, src: product.imageUrl, alt: productAlt(product) }] : []),
    // La etiqueta UE (homologación europea) va segunda, justo después de la
    // principal: es de lo que más se consulta antes de comprar.
    ...(label
      ? [{ kind: "etiqueta" as const, src: label.svgPath, thumbSrc: label.svgPath, alt: `Etiqueta de eficiencia energética UE — ${product.brand} ${product.modeloBase}, ${label.tyreDesignation}` }]
      : []),
    ...extraPhotos.map((src, i) => ({ kind: "foto" as const, src, alt: productExtraAlt(product, src, i) })),
    ...(selectedBranch.facadePhoto
      ? [{
          kind: "sucursal" as const,
          src: selectedBranch.facadePhoto,
          alt: `Fachada de ${selectedBranch.name}`,
          branchName: selectedBranch.shortName,
          address: selectedBranch.address,
          city: selectedBranch.city,
          hours: selectedBranch.hours,
          mapUrl: selectedBranch.mapUrl,
        }]
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
  const touchStartRef = useRef<{ x: number; y: number; w: number; axis: "x" | "y" | null } | null>(null);
  const didSwipeRef = useRef(false);
  // Arrastre en touch: la imagen sigue al dedo (dragX en px) y la vecina se
  // asoma por el costado. `settling` activa la transición al soltar.
  const [dragX, setDragX] = useState(0);
  const [settling, setSettling] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Al cambiar de slide (swipe o miniatura), la tira de miniaturas se
  // desplaza para que la activa quede entera a la vista, sin mover la página.
  useEffect(() => {
    const box = thumbsRef.current;
    const thumb = box?.children[index] as HTMLElement | undefined;
    if (!box || !thumb) return;
    box.scrollTo({ left: thumb.offsetLeft - (box.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);
  useEffect(() => () => { if (settleTimerRef.current) clearTimeout(settleTimerRef.current); }, []);
  const current = slides[index];
  const labelUtqg = current?.kind === "etiqueta" ? utqg : null;
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
    // Un swipe en touch también dispara el click al soltar el dedo — si
    // acabamos de navegar con el gesto, ese click no debe además abrir el
    // lightbox o el link de EPREL.
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }
    // El QR de la etiqueta no se puede escanear desde la propia pantalla del
    // celular: en touch, en vez de ampliar, vamos directo al registro EPREL.
    if (current.kind === "etiqueta" && isTouch() && eprelUrl) {
      window.open(eprelUrl, "_blank", "noopener,noreferrer");
      return;
    }
    // La foto de la sucursal es informativa, no un detalle de producto que
    // valga la pena ampliar con zoom/lightbox.
    if (current.kind === "sucursal") return;
    setLightboxOpen(true);
  }

  function goToSlide(nextIndex: number) {
    // Un cambio manual (miniatura) cancela el swipe que estaba asentándose.
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    setSettling(false);
    setDragX(0);
    setIndex(((nextIndex % slides.length) + slides.length) % slides.length);
    setImgAspect(1);
  }

  function handleTouchStart(e: React.TouchEvent<HTMLButtonElement>) {
    if (settling) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY, w: boxRef.current?.offsetWidth ?? 320, axis: null };
  }

  function handleTouchMove(e: React.TouchEvent<HTMLButtonElement>) {
    const start = touchStartRef.current;
    if (!start || slides.length < 2) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // El eje se decide una sola vez: si el gesto arranca vertical es scroll de
    // la página y no se toca; si arranca horizontal, la imagen sigue al dedo.
    if (!start.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (start.axis === "x") setDragX(dx);
  }

  function handleTouchEnd() {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || start.axis !== "x") return;
    // Soltar un gesto horizontal también dispara el click: se ignora para no
    // abrir el lightbox o el link de EPREL.
    didSwipeRef.current = true;
    const passed = Math.abs(dragX) > Math.min(start.w * 0.2, 80);
    const dir = dragX < 0 ? 1 : -1;
    setSettling(true);
    setDragX(passed ? -dir * start.w : 0);
    settleTimerRef.current = setTimeout(() => {
      if (passed) goToSlide(index + dir);
      setSettling(false);
      setDragX(0);
    }, 220);
  }

  // Slide vecina que se asoma mientras se arrastra con el dedo.
  const peek = dragX !== 0 && slides.length > 1
    ? slides[(((index + (dragX < 0 ? 1 : -1)) % slides.length) + slides.length) % slides.length]
    : null;

  const badges = (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
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

  // Más grande que el resto de los badges de esta esquina a propósito: es el
  // único que vende confianza en vez de describir el producto (OFF/Carga/A-T
  // son datos, esto es una promesa), así que conviene que pese más visualmente.
  // Ícono de escudo (símbolo de garantía/protección más reconocible que un
  // check suelto) + anillo blanco para que lea como sello oficial en vez de
  // una etiqueta más. Es un <a>: el click lleva a la explicación de qué cubre
  // y qué no la garantía (id="garantia" en la página de producto), porque
  // "1 año de garantía" solo, sin condiciones, generaba consultas por
  // WhatsApp preguntando qué cubre.
  const warrantyBadge = (
    <a
      href="#garantia"
      onClick={(e) => scrollSuave(e, "garantia")}
      className={`absolute right-4 z-10 flex items-center gap-2 rounded-full bg-amber-500 py-1.5 pl-1.5 pr-4 text-sm font-black uppercase tracking-tight text-white shadow-lg ring-2 ring-white/80 transition-colors hover:bg-amber-600 ${isPromoDay ? "bottom-16 sm:bottom-4" : "bottom-4"}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-600">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.75 1.75L14.5 10" />
        </svg>
      </span>
      <span className="flex flex-col items-start leading-none">
        <span>Garantía 1 año</span>
        <span className="mt-0.5 text-[10px] font-bold normal-case tracking-normal text-amber-100">Trivium</span>
      </span>
    </a>
  );

  // Sólo miércoles y sábado (ver isVisaMasterPromoDay). Va abajo a la
  // izquierda; la garantía va abajo a la derecha y, en pantallas chicas donde
  // no entran las dos en línea, se apila encima de este.
  const promoBadge = isPromoDay && (
    <a
      href="#metodos-pago"
      onClick={(e) => scrollSuave(e, "metodos-pago")}
      className={`absolute left-4 z-10 flex items-center gap-2 rounded-lg bg-navy-900 px-3 py-2 text-xs font-black text-white shadow-lg ring-2 ring-white/80 transition-colors hover:bg-navy-800 ${label ? "bottom-12" : "bottom-4"}`}
    >
      <span className="flex shrink-0 items-center gap-1.5 rounded bg-white px-1.5 py-1">
        <Image src="/images/payments/visa.svg" alt="" width={32} height={20} className="h-4 w-auto" />
        <Image src="/images/payments/mastercard.svg" alt="" width={32} height={20} className="h-6 w-auto" />
      </span>
      Hoy 3 cuotas sin interés
    </a>
  );

  return (
    <div>
      <div className={`${current?.kind === "etiqueta" ? "bg-white ring-1 ring-slate-200" : "bg-slate-50"} rounded-2xl aspect-square relative group overflow-hidden`}>
        {peek && (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${peek.kind === "etiqueta" ? "bg-white" : "bg-slate-50"}`}
            style={{ transform: `translateX(calc(${dragX < 0 ? "100%" : "-100%"} + ${dragX}px))`, transition: settling ? "transform 220ms ease-out" : "none" }}
          >
            {peek.kind === "etiqueta" ? (
              <EuLabelCard src={peek.src} alt="" utqg={utqg} sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              // El padding va en un contenedor aparte: una <Image fill> ignora el
              // padding de su padre y, sin esto, la vecina se dibuja más grande
              // que la definitiva y al soltar la imagen "salta".
              <div className={`h-full w-full ${peek.kind === "sucursal" ? "" : "p-1 md:p-2"}`}>
                <div className="relative h-full w-full">
                  <Image src={peek.src} alt="" fill className={peek.kind === "sucursal" ? "object-cover" : "object-contain"} sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              </div>
            )}
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ transform: dragX ? `translateX(${dragX}px)` : undefined, transition: settling ? "transform 220ms ease-out" : "none" }}
        >
        {current?.kind === "foto" && index === 0 && (
          <>
            {badges}
            {warrantyBadge}
            {promoBadge}
          </>
        )}
        <div className={`flex h-full w-full items-center justify-center ${current?.kind === "sucursal" || current?.kind === "etiqueta" ? "" : "p-1 md:p-2"}`}>
        {current ? (
          <button
            ref={boxRef}
            type="button"
            onClick={handleImageClick}
            onMouseEnter={() => !isTouch() && current.kind !== "sucursal" && setZoomed(true)}
            onMouseLeave={() => {
              setZoomed(false);
              setFrameRect(null);
            }}
            onMouseMove={(e) => current.kind !== "sucursal" && handleMouseMove(e)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            aria-label={
              current.kind === "etiqueta"
                ? "Ver registro oficial en EPREL"
                : current.kind === "sucursal"
                ? `Sucursal ${current.branchName}`
                : "Ampliar imagen"
            }
            className={`relative h-full w-full touch-pan-y ${current.kind === "sucursal" ? "cursor-default" : "cursor-zoom-in"} `}
          >
            {current.kind === "etiqueta" ? (
              <EuLabelCard src={current.src} alt={current.alt} utqg={labelUtqg} sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <>
                <div className="relative h-full w-full">
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    className={current.kind === "sucursal" ? "object-cover" : "object-contain"}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    onLoad={(e) => setImgAspect(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
                  />
                </div>
              </>
            )}
            {zoomed && current.kind !== "etiqueta" && current.kind !== "sucursal" && (
              <span
                className="hidden lg:block absolute border-2 border-white bg-white/30 shadow-[0_0_0_1px_rgba(0,0,0,0.15)] pointer-events-none"
                style={{ left: lensStyle.left, top: lensStyle.top, width: lensStyle.width, height: lensStyle.height }}
              />
            )}
            {current.kind !== "sucursal" && (
              <span className={`absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6" />
                </svg>
              </span>
            )}
          </button>
        ) : (
          <div className="w-48 h-48">{TIRE_SVG}</div>
        )}
        </div>
        {current?.kind === "sucursal" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-5 pb-5 pt-16 text-left text-white">
            <p className="text-2xl font-black">{current.branchName}</p>
            <p className="mt-1.5 text-base leading-snug text-slate-200">
              {current.address}, {current.city}
            </p>
            <p className="mt-0.5 text-base leading-snug text-slate-200">{current.hours}</p>
            <p className="mt-3 inline-block rounded-md bg-orange-500 px-3 py-1.5 text-xs font-black uppercase tracking-wide">
              Colocación y cambio de válvulas sin cargo
            </p>
            <div className="pointer-events-auto mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copiarDireccion(`${current.address}, ${current.city}`)}
                className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {direccionCopiada ? "¡Copiada!" : "Copiar dirección"}
              </button>
              <a
                href={current.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-black transition-colors hover:bg-orange-600"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Cómo llegar
              </a>
            </div>
          </div>
        )}
        </div>
      </div>

      {zoomed && frameRect && current && current.kind !== "sucursal" && (
        <ZoomPanel
          src={current.src}
          alt={current.alt}
          zoomFactor={ZOOM_FACTOR}
          aspect={imgAspect}
          focal={focal}
          anchorRect={frameRect}
          showEntireImage={current.kind === "etiqueta"}
          utqg={labelUtqg}
        />
      )}

      {lightboxOpen && current && (
        <ImageLightbox
          src={current.src}
          alt={current.alt}
          eprelUrl={current.kind === "etiqueta" ? eprelUrl : undefined}
          utqg={labelUtqg}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {slides.length > 1 && (
        <div ref={thumbsRef} className="relative mt-3 flex gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ touchAction: "pan-x" }}>
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition-colors ${
                index === i ? "border-navy-700" : "border-transparent hover:border-slate-200"
              }`}
              aria-label={
                slide.kind === "etiqueta"
                  ? "Ver etiqueta de eficiencia energética UE"
                  : slide.kind === "sucursal"
                  ? "Ver sucursal"
                  : "Ver foto del producto"
              }
            >
              <Image src={slide.kind === "etiqueta" ? slide.thumbSrc : slide.src} alt="" fill className="object-contain p-1.5" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
