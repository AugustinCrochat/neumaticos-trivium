"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * "¿Dónde veo mi medida?": abre sobre el buscador la foto real del flanco con
 * cada código numerado, para que quien no sabe qué escribir lo resuelva sin
 * irse de la página. El link a la guía completa queda adentro.
 *
 * <dialog> nativo: trae foco atrapado, Esc y fondo bloqueado sin código extra.
 */
export function MedidaHelpDialog({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className={`inline-flex items-center gap-1.5 font-bold text-red-600 underline underline-offset-2 hover:text-red-700 ${compact ? "text-xs" : "text-sm"}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2M12 17h.01" />
        </svg>
        ¿Dónde veo mi medida?
      </button>

      <dialog
        ref={ref}
        aria-labelledby="medida-help-title"
        onClick={(e) => {
          // Clic en el fondo (el propio <dialog>, fuera del contenido) cierra.
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto w-[min(96vw,56rem)] max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-black/70"
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-orange-600">Tu medida está en el flanco</p>
              <h2 id="medida-help-title" className="mt-1 text-2xl font-black text-navy-900">¿Dónde veo mi medida?</h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Cerrar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-600 hover:bg-slate-200"
            >
              ×
            </button>
          </div>

          <p className="mt-3 text-slate-600">
            Mirá el costado del neumático: la medida es el primer código grande, por ejemplo <strong className="text-navy-900">195/65 R15</strong>. Escribí los
            números <strong className="text-navy-900">1, 2 y 4</strong> (ancho, perfil y rodado).
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <Image
              src="/donde-encontrar-la-medida-en-el-flanco-del-neumatico.webp"
              alt="Flanco de un neumático 195/65 R15 95T XL con cada código numerado: 1 ancho, 2 perfil, 3 construcción radial, 4 rodado, 5 índice de carga, 6 velocidad, 7 XL, 8 M+S y 9 tubeless"
              width={1600}
              height={1093}
              sizes="(max-width: 900px) 96vw, 56rem"
              className="h-auto w-full"
            />
          </div>

          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>También figura en la etiqueta del marco de la puerta del conductor y en el manual del vehículo.</li>
            <li>Si no la encontrás, buscá por tu auto en la pestaña <strong className="text-navy-900">“Por mi auto”</strong>.</li>
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/blog/como-leer-medida-neumatico"
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-orange-600"
            >
              Leer la guía completa →
            </Link>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 hover:border-slate-500"
            >
              Ya la encontré
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
