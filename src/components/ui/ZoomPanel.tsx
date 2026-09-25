"use client";

import { createPortal } from "react-dom";

export function ZoomPanel({
  src,
  alt,
  zoomFactor,
  aspect,
  focal,
  anchorRect,
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

  // Tamaño que ocuparía la imagen completa dentro del panel con object-contain
  // (sin zoom), multiplicado por el factor de zoom — así el background-image
  // mantiene su proporción real en vez de estirarse para llenar el cuadrado.
  const panelAspect = 1; // el panel siempre es cuadrado (panelSize x panelSize)
  const baseWidth = aspect > panelAspect ? panelSize : panelSize * aspect;
  const baseHeight = aspect > panelAspect ? panelSize / aspect : panelSize;
  const scaledWidth = baseWidth * zoomFactor;
  const scaledHeight = baseHeight * zoomFactor;

  return createPortal(
    <div
      aria-hidden
      className="hidden lg:block fixed z-50 border border-slate-200 bg-white shadow-2xl overflow-hidden pointer-events-none"
      style={{
        left,
        top: anchorRect.top,
        width: panelSize,
        height: panelSize,
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${scaledWidth}px ${scaledHeight}px`,
        backgroundPosition: `${-(focal.x * (scaledWidth - panelSize))}px ${-(focal.y * (scaledHeight - panelSize))}px`,
      }}
      role="img"
      title={alt}
    />,
    document.body
  );
}
