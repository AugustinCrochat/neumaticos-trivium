"use client";

import { useEffect, useRef, useState } from "react";
import type { VehiculoOption } from "@/lib/pos-api";
import { resolverPatente } from "@/lib/patente-match";
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
  // La chapa es una imagen (SVG propio) y las letras se escriben en vivo encima.
  return (
    <div
      className="relative mx-auto w-full max-w-sm"
      style={{
        aspectRatio: "400 / 130",
        backgroundImage: `url(/images/patente/${mercosur ? "chapa-mercosur" : "chapa-anterior"}.svg)`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
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
        className={`absolute bottom-[8%] top-[26%] bg-transparent text-center font-display text-[3.4rem] font-bold uppercase leading-none tracking-[0.06em] outline-none sm:text-[3.8rem] ${
          mercosur
            ? "inset-x-[8%] w-[84%] text-zinc-700 placeholder:text-zinc-300"
            : "inset-x-[5%] w-[90%] text-white placeholder:text-zinc-700"
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
  onFound: (v: VehiculoOption, anio: number | null, version: string) => void;
  autoFocus?: boolean;
}) {
  const [patente, setPatente] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const cajaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  // Última patente consultada: evita repetir la misma consulta sola.
  const ultima = useRef<string | null>(null);

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

  const valida = PATENTE_RE.test(patente);

  const buscar = async () => {
    if (!valida || !token || cargando) return;
    ultima.current = patente;
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
        const r = resolverPatente(d.marca, d.modelo, vehiculos);
        if (r) onFound(r.vehiculo, d.anio, r.version);
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

  // Apenas la patente está completa (y la verificación lista) se consulta sola.
  useEffect(() => {
    if (valida && token && !cargando && ultima.current !== patente) void buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valida, token, patente, cargando]);

  if (!SITE_KEY) return null;

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-sm font-bold text-navy-900">Buscá tu auto por patente</p>
      <Chapa valor={patente} onChange={setPatente} onEnter={buscar} autoFocus={autoFocus} />
      <div ref={cajaRef} className="mt-2 flex justify-center" />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={buscar}
          disabled={!valida || !token || cargando}
          className="flex-1 rounded-xl bg-orange-500 py-3.5 text-base font-black text-white transition-colors hover:bg-orange-600 disabled:opacity-40"
        >
          {cargando ? "Buscando…" : "Buscar mi auto"}
        </button>
        {patente && (
          <button
            type="button"
            onClick={() => {
              ultima.current = null;
              setPatente("");
              setMensaje(null);
            }}
            aria-label="Borrar patente"
            className="w-12 shrink-0 rounded-xl border border-slate-300 bg-white text-lg font-bold text-slate-500 transition-colors hover:bg-slate-50"
          >
            ×
          </button>
        )}
      </div>
      {mensaje && (
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm text-slate-600">{mensaje}</p>
      )}
    </div>
  );
}
