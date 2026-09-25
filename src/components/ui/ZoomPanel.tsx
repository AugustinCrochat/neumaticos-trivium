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
  const panelWidth = anchorRect.width;
  const spaceRight = window.innerWidth - anchorRect.right;
  const onRight = spaceRight >= panelWidth + gap;
  const left = onRight ? anchorRect.right + gap : Math.max(gap, anchorRect.left - gap - panelWidth);

  return createPortal(
    <div
      aria-hidden
      className="hidden lg:block fixed z-50 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden pointer-events-none"
      style={{
        left,
        top: anchorRect.top,
        width: panelWidth,
        height: anchorRect.height,
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
