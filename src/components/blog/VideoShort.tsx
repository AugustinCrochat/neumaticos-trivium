"use client";

import { useState } from "react";

/**
 * Video vertical de YouTube (Short) para las notas con sello Ahorro 360.
 * Muestra la miniatura y recién al tocar carga el reproductor (youtube-nocookie),
 * así la nota no descarga el video ni cookies de quien solo lee.
 */
export function VideoShort({ id, titulo }: { id: string; titulo: string }) {
  const [activo, setActivo] = useState(false);
  return (
    <figure className="mx-auto my-8 w-full max-w-[320px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-lg border-2 border-black bg-black">
        {activo ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
            title={titulo}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setActivo(true)} className="group absolute inset-0 h-full w-full" aria-label={`Ver el video: ${titulo}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/20">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff1e00] text-white shadow-lg">
                <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-center text-sm text-slate-500">Video de 1 minuto · Ahorro 360</figcaption>
    </figure>
  );
}
