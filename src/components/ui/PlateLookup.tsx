"use client";

import { useEffect, useRef, useState } from "react";
import type { VehiculoOption } from "@/lib/pos-api";
import { vehiculoDesdePatente } from "@/lib/patente-match";
import { PATENTE_RE, estiloPatente, formatearPatente, normalizarPatente } from "@/lib/patente";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** La búsqueda por patente sólo existe si está configurada la verificación. */
export const PATENTE_HABILITADA = Boolean(SITE_KEY);

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
 * Chapa que se dibuja mientras se escribe: Mercosur (blanca con franja azul)
 * o formato anterior (negra con letras blancas), según lo que se tipea.
 */
function Chapa({
  valor,
  onChange,
  onEnter,
  autoFocus,
}: {
  valor: string;
  onChange: (normalizada: string) => void;
  onEnter: () => void;
  autoFocus?: boolean;
}) {
  const estilo = estiloPatente(valor);
  const mercosur = estilo === "mercosur";
  return (
    <div
      className={`mx-auto w-full max-w-xs overflow-hidden rounded-xl border-[3px] shadow-sm transition-colors ${
        mercosur ? "border-slate-800 bg-white" : "border-white bg-black ring-2 ring-slate-800"
      }`}
    >
      {mercosur && (
        <div className="bg-[#1b4f9c] py-0.5 text-center text-[10px] font-bold tracking-[0.3em] text-white">ARGENTINA</div>
      )}
      <input
        id="patente-input"
        aria-label="Patente"
        value={formatearPatente(valor, estilo)}
        onChange={(e) => onChange(normalizarPatente(e.target.value))}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder={mercosur ? "AB 123 CD" : "ABC 123"}
        autoFocus={autoFocus}
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        inputMode="text"
        className={`w-full bg-transparent px-3 py-2 text-center text-3xl font-black uppercase tracking-[0.12em] outline-none sm:text-4xl ${
          mercosur ? "text-slate-900 placeholder:text-slate-300" : "text-white placeholder:text-slate-600"
        }`}
      />
    </div>
  );
}

/**
 * Campo de patente + verificación + consulta. Devuelve el vehículo de la
 * lista del buscador y el año. Es una ayuda: si algo falla (sin cupo, modelo
 * que no está en la lista) avisa y la persona elige a mano.
 */
export function PlateLookup({
  vehiculos,
  onFound,
  autoFocus,
}: {
  vehiculos: VehiculoOption[];
  onFound: (v: VehiculoOption, anio: number | null) => void;
  autoFocus?: boolean;
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
          // Sólo se ve si Cloudflare necesita que la persona haga algo.
          appearance: "interaction-only",
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

  const valida = PATENTE_RE.test(patente);

  const buscar = async () => {
    if (!valida || !token || cargando) return;
    setCargando(true);
    setMensaje(null);
    try {
      const res = await fetch("/api/patente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patente, token }),
      });
      if (res.status === 404) {
        setMensaje("No encontramos esa patente. Probá con “Por mi auto”.");
      } else if (res.status === 429) {
        setMensaje("Hiciste muchas consultas seguidas. Probá en unos minutos o usá “Por mi auto”.");
      } else if (!res.ok) {
        setMensaje("La búsqueda por patente no está disponible ahora. Usá “Por mi auto”.");
      } else {
        const d = (await res.json()) as { marca: string; modelo: string | null; anio: number | null };
        const v = vehiculoDesdePatente(d.marca, d.modelo, vehiculos);
        if (v) onFound(v, d.anio);
        else setMensaje(`Encontramos ${d.marca} ${d.modelo ?? ""}, pero todavía no lo tenemos en la lista. Probá con “Por mi auto”.`);
      }
    } catch {
      setMensaje("No pudimos consultar la patente. Probá con “Por mi auto”.");
    }
    // El token de Turnstile sirve una sola vez.
    setToken(null);
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
    setCargando(false);
  };

  return (
    <div className="w-full">
      <Chapa valor={patente} onChange={setPatente} onEnter={buscar} autoFocus={autoFocus} />
      <div ref={cajaRef} className="mt-2 flex justify-center" />
      <button
        type="button"
        onClick={buscar}
        disabled={!valida || !token || cargando}
        className="mt-3 w-full rounded-xl bg-orange-500 py-3.5 text-base font-black text-white transition-colors hover:bg-orange-600 disabled:opacity-40"
      >
        {cargando ? "Buscando…" : "Buscar mi auto"}
      </button>
      {mensaje && <p className="mt-2 text-center text-sm text-slate-600">{mensaje}</p>}
    </div>
  );
}
