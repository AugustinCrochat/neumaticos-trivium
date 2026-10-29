"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { BRANCHES } from "@/lib/config";

const CamaraNeumaticoModal = dynamic(() => import("./CamaraNeumaticoModal"), { ssr: false });

/**
 * Bloque "¿No sabés qué medida lleva tu neumático? Mandanos una foto". Abre la
 * cámara con un círculo guía (o, si no hay cámara, la del teléfono o la
 * galería) y manda la foto por WhatsApp. Va donde haya medidas de neumático.
 */
export function FotoNeumaticoBloque({ className = "", titulo = "¿No sabés qué medida lleva tu neumático?" }: { className?: string; titulo?: string }) {
  const [abierto, setAbierto] = useState(false);
  const [foto, setFoto] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const whatsapp = BRANCHES[0].whatsapp;

  return (
    <section className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-navy-900">{titulo}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Sacale una foto al flanco y mandanosla por WhatsApp: te decimos qué medida lleva y qué tenemos en stock. La foto sale de tu teléfono y no se guarda en el sitio.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <button
            type="button"
            onClick={() => {
              setFoto(null);
              setAbierto(true);
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h1.5l1-2h9l1 2H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3.5" strokeWidth={2} />
            </svg>
            Sacar foto del neumático
          </button>
          <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-bold text-emerald-800 underline underline-offset-4">
            Elegir una foto de la galería
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFoto(f);
                setAbierto(true);
              }
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {abierto && <CamaraNeumaticoModal whatsapp={whatsapp} fotoInicial={foto} onClose={() => setAbierto(false)} />}
    </section>
  );
}
