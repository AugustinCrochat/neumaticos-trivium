"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@/components/ui/Link";
import { ProductCard } from "@/components/ui/ProductCard";
import { useLiveStockMap } from "@/contexts/live-stock-context";
import { sortInStockFirst } from "@/components/ui/SortedProductGrid";
import type { TireProduct } from "@/lib/types";

/**
 * Carrusel de neumáticos con stock para las landings locales: el objetivo es
 * que quien llega buscando "neumáticos en <zona>" caiga en un producto con
 * precio en el primer scroll, sin pasar por el catálogo. Los chips de rodado
 * acotan la lista; el scroll es nativo (snap) y las flechas son un extra para
 * escritorio.
 *
 * Con `autoplay` se mueve solo y se pausa al pasar el mouse, tocar o enfocar.
 * Normalmente es una cinta continua y lenta (sin fin: se arma duplicando las
 * tarjetas sólo en el navegador; el HTML del servidor trae una sola copia, la
 * que lee Google). Si la persona pidió reducir movimiento, en vez de deslizar
 * pasa de a una tarjeta cada unos segundos, sin animación.
 */
const PASO_MS = 4500;
const VELOCIDAD_PX_S = 38;

export function LocalProductCarousel({
  productos,
  mejores,
  titulo,
  autoplay = false,
}: {
  productos: TireProduct[];
  /** id -> medida del tag "Mejor precio" (Map no serializa entre server y client). */
  mejores: [string, string][];
  titulo: string;
  autoplay?: boolean;
}) {
  const [rim, setRim] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const mejoresMap = useMemo(() => new Map(mejores), [mejores]);

  const rodados = useMemo(
    () => [...new Set(productos.map((p) => p.size.rim))].sort((a, b) => a - b),
    [productos]
  );
  const liveStock = useLiveStockMap();
  const filtrada = rim === null ? productos : productos.filter((p) => p.size.rim === rim);
  const lista = useMemo(() => sortInStockFirst(filtrada, (p) => p.id, (p) => p.enStock, liveStock), [filtrada, liveStock]);

  // Cinta sin fin: se activa en el navegador (si hay movimiento permitido y alcanzan las tarjetas para llenar la fila).
  const [modo, setModo] = useState<"cinta" | "pasos" | null>(null);
  const cinta = modo === "cinta";
  useEffect(() => {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModo(autoplay && lista.length >= 4 ? (quieto ? "pasos" : "cinta") : null);
  }, [autoplay, lista.length]);

  useEffect(() => {
    const el = scroller.current;
    if (!modo || !el) return;
    const n = lista.length + 1; // tarjetas + "Ver todo el catálogo"
    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft;
    let puesta = pos;
    let pausaHasta = 0;
    let visible = true;
    const pausar = (ms = Infinity, soloMouse = false) => (ev: Event) => {
      // En celulares, tocar dispara un "mouseenter" falso y nunca el "mouseleave": sólo cuenta el mouse de verdad.
      if (soloMouse && (ev as PointerEvent).pointerType !== "mouse") return;
      pausaHasta = ms === Infinity ? Infinity : performance.now() + ms;
    };
    const eventos: [string, (ev: Event) => void][] = [
      ["pointerenter", pausar(Infinity, true)],
      ["pointerleave", pausar(600, true)],
      ["focusin", pausar()],
      ["focusout", pausar(600)],
      ["touchstart", pausar()],
      ["touchend", pausar(2000)],
      ["touchcancel", pausar(2000)],
      ["wheel", pausar(3000)],
    ];
    eventos.forEach(([e, f]) => el.addEventListener(e, f, { passive: true }));
    const io = new IntersectionObserver(([x]) => (visible = x.isIntersecting));
    io.observe(el);

    // Reducción de movimiento: una tarjeta cada PASO_MS, de golpe (sin deslizar); al final vuelve al principio.
    let timer = 0;
    if (modo === "pasos") {
      timer = window.setInterval(() => {
        if (!visible || document.hidden || performance.now() < pausaHasta) return;
        const paso = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
        const alFinal = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        el.scrollTo({ left: alFinal ? 0 : el.scrollLeft + paso, behavior: "instant" });
      }, PASO_MS);
    }

    const frame = (t: number) => {
      const dt = Math.min(t - last, 64);
      last = t;
      const copia = el.children[n] as HTMLElement | undefined;
      if (visible && !document.hidden && copia) {
        if (t < pausaHasta) {
          pos = el.scrollLeft;
          puesta = pos;
        } else {
          if (Math.abs(el.scrollLeft - puesta) > 1.5) pos = el.scrollLeft; // la persona la movió a mano
          const unidad = copia.offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
          pos += (VELOCIDAD_PX_S * dt) / 1000;
          if (pos >= unidad) pos -= unidad;
          el.scrollLeft = pos;
          puesta = el.scrollLeft;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    if (modo === "cinta") raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
      io.disconnect();
      eventos.forEach(([e, f]) => el.removeEventListener(e, f));
    };
  }, [modo, lista]);

  const mover = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const pill = (activo: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors ${
      activo
        ? "border-[#ff1e00] bg-[#ff1e00] text-white"
        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
    }`;

  // Una vuelta de la cinta. La copia (sólo con la cinta activa) queda fuera del árbol de accesibilidad y del foco.
  const tarjetas = (copia: boolean) => {
    const wrap = (k: string, children: React.ReactNode, cls: string) => (
      <div key={k} className={cls} {...(copia ? { "aria-hidden": true, inert: true } : {})}>
        {children}
      </div>
    );
    return [
      ...lista.map((p) =>
        wrap(
          `${copia ? "c" : "o"}-${p.id}`,
          <ProductCard product={p} isCheapest={mejoresMap.has(p.id)} cheapestLabel={mejoresMap.get(p.id)} />,
          `flex w-[68vw] max-w-[260px] shrink-0 md:w-[250px] [&>article]:w-full ${cinta ? "" : "snap-start"}`
        )
      ),
      wrap(
        `${copia ? "c" : "o"}-todo`,
        <Link
          href="/catalogo"
          tabIndex={copia ? -1 : undefined}
          className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-lg font-black text-navy-900 hover:border-[#ff1e00]"
        >
          Ver todo el catálogo →
        </Link>,
        `flex w-[68vw] max-w-[260px] shrink-0 md:w-[250px] ${cinta ? "" : "snap-start"}`
      ),
    ];
  };

  if (productos.length === 0) return null;

  return (
    <section className="mb-12" aria-label={titulo}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-black text-navy-900">{titulo}</h2>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => mover(-1)}
            aria-label="Anteriores"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-black text-navy-900 hover:border-slate-500"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            aria-label="Siguientes"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-black text-navy-900 hover:border-slate-500"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button type="button" className={pill(rim === null)} onClick={() => setRim(null)}>
          Todos
        </button>
        {rodados.map((r) => (
          <button key={r} type="button" className={pill(rim === r)} onClick={() => setRim(r)}>
            Rodado {r}
          </button>
        ))}
      </div>

      <div
        ref={scroller}
        className={`-mx-4 flex gap-4 overflow-x-auto px-4 py-3 ${cinta ? "" : "snap-x snap-mandatory scroll-smooth scroll-pl-4"}`}
      >
        {tarjetas(false)}
        {cinta && tarjetas(true)}
      </div>
    </section>
  );
}
