"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sizeSearchHref } from "@/lib/size-href";

/**
 * "¿Dónde veo mi medida?": muestra la foto real del flanco con cada código
 * numerado y, ahí mismo, tres campos para buscar con lo que se lee.
 *
 * Se abre con un clic. En computadora queda anclado debajo del botón (posición
 * fija, para que ningún contenedor con overflow-hidden lo recorte); en celular
 * ocupa la pantalla. Se cierra con la ×, con Esc o haciendo clic afuera.
 */
export function MedidaHelpDialog({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // null = pantalla completa (celular); con valores = anclado al botón (mouse).
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [w, setW] = useState("");
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pRef = useRef<HTMLInputElement>(null);
  const rRef = useRef<HTMLInputElement>(null);
  const wInputRef = useRef<HTMLInputElement>(null);

  const conMouse = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function abrir() {
    if (conMouse() && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const ancho = Math.min(704, vw - 16);
      setPos({ top: rect.bottom, left: Math.max(8, Math.min(rect.left, vw - ancho - 8)) });
    } else {
      setPos(null);
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Anclado: un clic fuera del botón y de la tarjeta lo cierra.
    const onDown = (e: MouseEvent) => {
      const dentro = wrapRef.current?.contains(e.target as Node) || panelRef.current?.contains(e.target as Node);
      if (pos && !dentro) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    const onScroll = () => pos && setOpen(false); // anclado: al scrollear se descoloca
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, pos]);

  const digits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);
  const campo = "h-11 w-full min-w-0 rounded-xl border-2 border-slate-300 bg-white text-center text-lg font-black text-navy-950 outline-none focus:border-orange-500";

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (w.length < 3) return wInputRef.current?.focus();
    if (p.length < 2) return pRef.current?.focus();
    if (r.length < 2) return rRef.current?.focus();
    setOpen(false);
    router.push(sizeSearchHref(w, p, r));
  }

  const tarjeta = (
    <div className="rounded-3xl bg-white p-4 text-slate-900 shadow-2xl ring-1 ring-black/10 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-orange-600">Tu medida está en el flanco</p>
          <h2 className="mt-0.5 text-xl font-black text-navy-900">¿Dónde veo mi medida?</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-600 hover:bg-slate-200"
        >
          ×
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
        <Image
          src="/donde-encontrar-la-medida-en-el-flanco-del-neumatico.webp"
          alt="Flanco de un neumático 195/65 R15 95T XL con cada código numerado: 1 ancho, 2 perfil, 3 construcción radial, 4 rodado, 5 índice de carga, 6 velocidad, 7 XL, 8 M+S y 9 tubeless"
          width={1600}
          height={1093}
          sizes="(max-width: 760px) 92vw, 44rem"
          className="h-auto w-full"
        />
      </div>

      <form onSubmit={buscar} className="mt-4">
        <p className="text-sm font-bold text-navy-900">
          Escribí los números{" "}
          <span className="text-[#ff1e00]">1</span>, <span className="text-[#3d80c8]">2</span> y <span className="text-[#e8532e]">4</span> (ancho, perfil y rodado):
        </p>
        <div className="mt-2 flex items-center gap-2">
          <input ref={wInputRef} aria-label="Ancho" inputMode="numeric" autoComplete="off" placeholder="195" value={w} className={campo}
            onChange={(e) => { const v = digits(e.target.value, 3); setW(v); if (v.length === 3) pRef.current?.focus(); }} />
          <span aria-hidden="true" className="font-black text-slate-400">/</span>
          <input ref={pRef} aria-label="Perfil" inputMode="numeric" autoComplete="off" placeholder="65" value={p} className={campo}
            onChange={(e) => { const v = digits(e.target.value, 2); setP(v); if (v.length === 2) rRef.current?.focus(); }} />
          <span aria-hidden="true" className="font-black text-slate-400">R</span>
          <input ref={rRef} aria-label="Rodado" inputMode="numeric" autoComplete="off" placeholder="15" value={r} className={campo}
            onChange={(e) => setR(digits(e.target.value, 2))} />
          <button type="submit" className="h-11 shrink-0 rounded-xl bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600">
            Buscar
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        También figura en la etiqueta del marco de la puerta del conductor y en el manual. Si no la encontrás, buscá en la pestaña “Por mi auto”.{" "}
        <Link href="/blog/como-leer-medida-neumatico" className="font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-2">
          Leer la guía completa →
        </Link>
      </p>
    </div>
  );

  return (
    <div ref={wrapRef} className="inline-block">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : abrir())}
        className={`inline-flex items-center gap-1.5 font-bold text-red-600 underline underline-offset-2 hover:text-red-700 ${compact ? "text-xs" : "text-sm"}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2M12 17h.01" />
        </svg>
        ¿Dónde veo mi medida?
      </button>

      {open &&
        // Portal al <body>: dentro del buscador quedaba detrás de las tarjetas del
        // catálogo (que crean su propia capa con z-index y escala).
        createPortal(
          pos ? (
          // Con mouse: anclado justo debajo del botón.
          <div ref={panelRef} role="dialog" aria-label="¿Dónde veo mi medida?" className="fixed z-[1000] w-[min(44rem,calc(100vw-1rem))]" style={{ top: pos.top, left: pos.left }}>
            <div className="pt-2">{tarjeta}</div>
          </div>
        ) : (
          // Sin mouse (celular): ocupa la pantalla; tocar el fondo cierra.
          <div
            role="dialog"
            aria-modal="true"
            aria-label="¿Dónde veo mi medida?"
            className="fixed inset-0 z-[1000] overflow-y-auto bg-black/70 p-3"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <div className="mx-auto my-4 max-w-3xl">{tarjeta}</div>
          </div>
        ),
          document.body
        )}
    </div>
  );
}
