"use client";

import { createPortal } from "react-dom";
import type { Utqg } from "@/lib/utqg";
import { EuLabelCard } from "@/components/ui/EuLabelCard";

export function ZoomPanel({
  src,
  alt,
  zoomFactor,
  aspect,
  focal,
  anchorRect,
  showEntireImage = false,
  utqg,
}: {
  src: string;
  alt: string;
  zoomFactor: number;
  /** Aspect ratio (ancho/alto) real de la imagen — la etiqueta UE es rectangular, no cuadrada. */
  aspect: number;
  /** Punto focal (0-1, 0-1) dentro de la imagen, ya renderizada con object-contain. */
  focal: { x: number; y: number };
  /** Rect del cuadro de la miniatura, para anclar el panel al costado (viewport coords). */
  anchorRect: DOMRect;
  /** Para etiquetas altas: mostrar la imagen completa dentro de un panel cuadrado. */
  showEntireImage?: boolean;
  /** Dato adicional de EE.UU., verificado para esta medida cuando está presente. */
  utqg: Utqg | null;
}) {
  const gap = 16;
  // Lo más grande posible sin salirse de la ventana (ancho disponible a la
  // derecha/izquierda del frame, y alto disponible desde el top del frame).
  const maxHeight = window.innerHeight - anchorRect.top - gap;
  const spaceRight = window.innerWidth - anchorRect.right - gap * 2;
  const spaceLeft = anchorRect.left - gap * 2;
  const onRight = spaceRight >= spaceLeft;
  const maxWidth = Math.max(onRight ? spaceRight : spaceLeft, anchorRect.width);

  const panelSize = Math.min(anchorRect.width * 1.8, maxWidth, maxHeight);
  const left = onRight ? anchorRect.right + gap : anchorRect.left - gap - panelSize;

  // La etiqueta UE es vertical. En su caso el hover funciona como una vista
  // ampliada completa: un lienzo cuadrado blanco con object-contain evita que
  // se deforme o se recorte información (incluido el QR). Las fotos comunes
  // conservan la lupa que sigue al cursor.
  const panelAspect = 1;
  const baseWidth = aspect > panelAspect ? panelSize : panelSize * aspect;
  const baseHeight = aspect > panelAspect ? panelSize / aspect : panelSize;
  const scaledWidth = baseWidth * zoomFactor;
  const scaledHeight = baseHeight * zoomFactor;
  const backgroundX = Math.min(0, Math.max(panelSize - scaledWidth, panelSize / 2 - focal.x * scaledWidth));
  const backgroundY = Math.min(0, Math.max(panelSize - scaledHeight, panelSize / 2 - focal.y * scaledHeight));

  return createPortal(
    <div
      aria-hidden
      className="hidden lg:block fixed z-50 border border-slate-200 bg-white shadow-2xl overflow-hidden pointer-events-none"
      style={{
        left,
        top: anchorRect.top,
        width: panelSize,
        height: panelSize,
        ...(showEntireImage
          ? {}
          : {
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${scaledWidth}px ${scaledHeight}px`,
              backgroundPosition: `${backgroundX}px ${backgroundY}px`,
            }),
      }}
      role="img"
      title={alt}
    >
      {showEntireImage && <EuLabelCard src={src} alt={alt} utqg={utqg} sizes="40vw" />}
    </div>,
    document.body
  );
}
