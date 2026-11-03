"use client";

import { useEffect, useRef, useState } from "react";
import type { VehiculoOption } from "@/lib/pos-api";
import { vehiculoDesdePatente } from "@/lib/patente-match";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const PATENTE_RE = /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/;

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

function cargarTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(s);
  });
}

/**
 * "Buscá por patente": completa el vehículo con marca/modelo del registro.
 * Es una ayuda opcional: si algo falla (sin cupo, no se reconoce el modelo)
 * se avisa y la persona elige a mano en el listado de abajo.
 * Sin NEXT_PUBLIC_TURNSTILE_SITE_KEY no se muestra.
 */
export function PlateLookup({
  vehiculos,
  onSelect,
}: {
  vehiculos: VehiculoOption[];
  onSelect: (v: VehiculoOption) => void;
}) {
  const [patente, setPatente] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const cajaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!SITE_KEY) return;
    let vivo = true;
    cargarTurnstile()
      .then(() => {
        if (!vivo || !cajaRef.current || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(cajaRef.current, {
          sitekey: SITE_KEY,
          size: "flexible",
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(null),
          "error-callback": () => setToken(null),
        });
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  if (!SITE_KEY) return null;

  const normalizada = patente.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const valida = PATENTE_RE.test(normalizada);

  const buscar = async () => {
    if (!valida || !token || cargando) return;
    setCargando(true);
    setMensaje(null);
    try {
      const res = await fetch("/api/patente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patente: normalizada, token }),
      });
      if (res.status === 404) {
        setMensaje("No encontramos esa patente. Elegí tu auto en la lista.");
      } else if (res.status === 429) {
        setMensaje("Hiciste muchas consultas seguidas. Probá en unos minutos o elegí tu auto en la lista.");
      } else if (!res.ok) {
        setMensaje("La búsqueda por patente no está disponible ahora. Elegí tu auto en la lista.");
      } else {
        const d = (await res.json()) as { marca: string; modelo: string | null };
        const v = vehiculoDesdePatente(d.marca, d.modelo, vehiculos);
        if (v) onSelect(v);
        else setMensaje(`Encontramos ${d.marca} ${d.modelo ?? ""}, pero no está en la lista. Buscalo abajo.`);
      }
    } catch {
      setMensaje("No pudimos consultar la patente. Elegí tu auto en la lista.");
    }
    // El token de Turnstile sirve una sola vez.
    setToken(null);
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
    setCargando(false);
  };

  return (
    <div className="mb-4 rounded-xl border border-slate-200 p-3">
      <label htmlFor="patente-input" className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
        Buscá por patente
      </label>
      <div className="flex gap-2">
        <input
          id="patente-input"
          value={patente}
          onChange={(e) => setPatente(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
          placeholder="AB123CD"
          maxLength={8}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base font-bold tracking-widest uppercase"
        />
        <button
          type="button"
          onClick={buscar}
          disabled={!valida || !token || cargando}
          className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          {cargando ? "Buscando…" : "Buscar"}
        </button>
      </div>
      <div ref={cajaRef} className="mt-2" />
      {mensaje && <p className="mt-2 text-sm text-slate-600">{mensaje}</p>}
    </div>
  );
}
