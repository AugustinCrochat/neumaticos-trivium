"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export function ImageLightbox({
  src,
  alt,
  eprelUrl,
  onClose,
}: {
  src: string;
  alt: string;
  /** Si es la etiqueta UE, link directo al registro EPREL (el QR no se puede escanear desde la propia pantalla). */
  eprelUrl?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={alt}>
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-zoom-out" />
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="relative w-full h-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-full flex-1 min-h-0">
          <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
        </div>
        {eprelUrl && (
          <a
            href={eprelUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-bold text-navy-700 hover:bg-slate-100 transition-colors"
          >
            Ver registro oficial en EPREL
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        )}
      </div>
    </div>,
    document.body
  );
}
