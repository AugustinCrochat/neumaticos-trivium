"use client";

import { createPortal } from "react-dom";

export function ZoomPanel({
  src,
  alt,
  zoomFactor,
  bgPos,
  anchorRect,
}: {
  src: string;
  alt: string;
  zoomFactor: number;
  bgPos: { x: number; y: number };
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
        backgroundSize: `${zoomFactor * 100}% ${zoomFactor * 100}%`,
        backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
      }}
      role="img"
      title={alt}
    />,
    document.body
  );
}
