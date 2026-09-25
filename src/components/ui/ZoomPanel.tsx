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

  // El panel debe conservar la misma proporción de la imagen. Un panel
  // cuadrado para una etiqueta vertical veía un área más ancha que la lupa y
  // por eso el encuadre se corría/cortaba. Con la misma relación de aspecto,
  // la lente y el panel muestran exactamente el mismo sector ampliado.
  const panelWidth = Math.min(anchorRect.width * 1.8, maxWidth, maxHeight * aspect);
  const panelHeight = panelWidth / aspect;
  const left = onRight ? anchorRect.right + gap : anchorRect.left - gap - panelWidth;
  const scaledWidth = panelWidth * zoomFactor;
  const scaledHeight = panelHeight * zoomFactor;
  const backgroundX = Math.min(0, Math.max(panelWidth - scaledWidth, panelWidth / 2 - focal.x * scaledWidth));
  const backgroundY = Math.min(0, Math.max(panelHeight - scaledHeight, panelHeight / 2 - focal.y * scaledHeight));

  return createPortal(
    <div
      aria-hidden
      className="hidden lg:block fixed z-50 border border-slate-200 bg-white shadow-2xl overflow-hidden pointer-events-none"
      style={{
        left,
        top: anchorRect.top,
        width: panelWidth,
        height: panelHeight,
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${scaledWidth}px ${scaledHeight}px`,
        backgroundPosition: `${backgroundX}px ${backgroundY}px`,
      }}
      role="img"
      title={alt}
    />,
    document.body
  );
}
