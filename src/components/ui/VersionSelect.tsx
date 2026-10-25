"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Selector de versión con el mismo aspecto que el buscador de marca y modelo
 * (VehicleCombobox): campo blanco redondeado y lista flotante en el body, para
 * que ningún contenedor la recorte. `autoOpen` la abre al montarse, así al
 * elegir el auto se pasa directo a elegir la versión.
 */
export function VersionSelect({
  options,
  value,
  onChange,
  autoOpen = false,
}: {
  options: string[];
  value: number | null;
  onChange: (index: number) => void;
  autoOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const update = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (r) setRect({ top: r.bottom + 8, left: r.left, width: r.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen]);

  function pick(i: number) {
    onChange(i);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        onBlur={() => setIsOpen(false)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-navy-500/10"
        autoFocus={autoOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`truncate ${value === null ? "text-slate-400" : ""}`}>
          {value !== null ? options[value] : "Elegí la versión de tu auto"}
        </span>
        <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && rect && createPortal(
        <div
          role="listbox"
          style={{ position: "fixed", top: rect.top, left: rect.left, width: rect.width, maxHeight: Math.max(120, Math.min(288, window.innerHeight - rect.top - 8)) }}
          className="z-[1000] overflow-y-auto rounded-xl border border-slate-100 bg-white py-1 shadow-2xl"
        >
          {options.map((label, i) => (
            <button
              key={i}
              type="button"
              role="option"
              aria-selected={i === value}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(i);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                i === value ? "bg-orange-50 font-bold text-navy-900" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}
