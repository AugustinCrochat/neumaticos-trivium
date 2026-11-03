"use client";

import { useEffect, useRef, useState } from "react";
import type { VehiculoOption } from "@/lib/pos-api";
import { resolverPatente } from "@/lib/patente-match";
import { PATENTE_RE, estiloPatente, formatearPatente, normalizarPatente, type EstiloPatente } from "@/lib/patente";

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
  estilo,
  onChange,
  onEnter,
  autoFocus,
  pequena,
}: {
  valor: string;
  estilo: EstiloPatente;
  onChange: (normalizada: string) => void;
  onEnter: () => void;
  autoFocus?: boolean;
  pequena?: boolean;
}) {
  const mercosur = estilo === "mercosur";
  // La chapa es una imagen (SVG propio) y las letras se escriben en vivo encima.
  return (
    <div
      className={`relative mx-auto w-full [container-type:inline-size] ${pequena ? "max-w-full" : "max-w-sm"}`}
      style={{
        // La anterior es más angosta que la Mercosur (294 de 400 mm) y casi igual de alta.
        width: mercosur ? undefined : `${(294 / 400) * 100}%`,
        // Medidas reales: Mercosur 400×130 mm, formato anterior 294×129 mm.
        aspectRatio: mercosur ? "400 / 130" : "294 / 129",
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
        className={`absolute bg-transparent text-center font-display uppercase leading-none tracking-[0.06em] outline-none ${
          mercosur
            ? "inset-x-[8%] bottom-[8%] top-[26%] w-[84%] text-[14.5cqw] font-bold text-zinc-700 placeholder:text-zinc-300"
            : "inset-x-[5%] bottom-[15.5%] top-[22.3%] w-[90%] text-[19.5cqw] font-semibold text-white placeholder:text-zinc-700"
        }`}
      />
    </div>
  );
}

/** Interruptor de formato: por si alguien no entiende que el campo se adapta solo. */
function SelectorFormato({ estilo, onChange }: { estilo: EstiloPatente; onChange: (e: EstiloPatente) => void }) {
  const op = (valor: EstiloPatente, texto: string) => (
    <button
      type="button"
      aria-pressed={estilo === valor}
      onClick={() => onChange(valor)}
      className={`flex-1 rounded-full px-3 py-1.5 text-xs font-black transition-colors ${
        estilo === valor ? "bg-navy-900 text-white" : "text-slate-600 hover:text-navy-900"
      }`}
    >
      {texto}
    </button>
  );
  return (
    <div role="group" aria-label="Formato de la patente" className="mx-auto mt-2 flex w-full max-w-xs gap-1 rounded-full bg-slate-100 p-1">
      {op("mercosur", "Nueva (AB 123 CD)")}
      {op("anterior", "Anterior (ABC 123)")}
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
  pequena,
  onNoEncontrada,
}: {
  vehiculos: VehiculoOption[];
  onFound: (v: VehiculoOption, anio: number | null, version: string) => void;
  autoFocus?: boolean;
  /** Chapa más chica (buscador apilado con las tres opciones a la vista). */
  pequena?: boolean;
  /** La patente no se pudo resolver: quien llama pasa a elegir el auto a mano. */
  onNoEncontrada?: (motivo: string) => void;
}) {
  // Última patente consultada: evita repetir la misma consulta sola.
  const ultima = useRef<string | null>(null);
  const [patente, setPatenteCrudo] = useState("");
  // Formato elegido a mano con el interruptor; null = el campo lo decide según lo que se escribe.
  const [manual, setManual] = useState<EstiloPatente | null>(null);
  const estilo = manual ?? estiloPatente(patente);
  // ¿Lo escrito define el formato sin dudas? (letra de la serie vieja, o ya hay un dígito en 3.ª posición)
  const definido = (v: string): EstiloPatente | null =>
    estiloPatente(v) === "anterior" ? "anterior" : v.length >= 3 ? "mercosur" : null;
  const setPatente = (v: string) => {
    const d = definido(v);
    if (manual && d && d !== manual) setManual(null);
    setPatenteCrudo(v);
  };
  const cambiarFormato = (nuevo: EstiloPatente) => {
    setManual(nuevo);
    // Si lo escrito es del otro formato, se borra (no se puede reinterpretar).
    const d = definido(patente);
    if (d && d !== nuevo) {
      ultima.current = null;
      setPatenteCrudo("");
      setMensaje(null);
    }
  };
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

  const valida = PATENTE_RE.test(patente);

  // Si quien usa el buscador sabe elegir el auto a mano, se le pasa el control; si no, se muestra el aviso.
  const falla = (texto: string) => (onNoEncontrada ? onNoEncontrada(texto) : setMensaje(texto));

  const buscar = async () => {
    if (patente.length < 6 || !token || cargando) return;
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
        falla("No encontramos esa patente. Elegí tu auto de la lista.");
      } else if (res.status === 400) {
        setMensaje("Esa patente no tiene un formato válido (ej. AB 123 CD o ABC 123). Revisala.");
      } else if (res.status === 429) {
        falla("Hiciste muchas consultas seguidas. Elegí tu auto de la lista.");
      } else if (!res.ok) {
        falla("La búsqueda por patente no está disponible ahora. Elegí tu auto de la lista.");
      } else {
        const d = (await res.json()) as { marca: string; modelo: string | null; anio: number | null };
        const r = resolverPatente(d.marca, d.modelo, vehiculos);
        if (r) onFound(r.vehiculo, d.anio, r.version);
        else falla(`Encontramos ${d.marca} ${d.modelo ?? ""}, pero todavía no lo tenemos en la lista. Elegí tu auto de la lista.`);
      }
    } catch {
      falla("No pudimos consultar la patente. Elegí tu auto de la lista.");
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

  const borrar = () => {
    ultima.current = null;
    setPatente("");
    setMensaje(null);
  };

  if (pequena) {
    // Versión compacta: chapa chica y botones chicos a la derecha.
    return (
      <div className="w-full">
        <p className="mb-2 text-center text-sm font-bold text-navy-900">Buscá tu auto por patente</p>
        <div className="flex items-center justify-center gap-2">
          <div className="min-w-0 flex-1 sm:max-w-[15rem]">
            <Chapa valor={patente} estilo={estilo} onChange={setPatente} onEnter={buscar} autoFocus={autoFocus} pequena />
          </div>
          <button
            type="button"
            onClick={buscar}
            disabled={patente.length < 6 || !token || cargando}
            aria-label="Buscar mi auto"
            className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-black text-white transition-colors hover:bg-orange-600 disabled:opacity-40"
          >
            {cargando ? "…" : "Buscar"}
          </button>
          {patente && (
            <button
              type="button"
              onClick={borrar}
              aria-label="Borrar patente"
              className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-lg font-bold text-slate-500 hover:bg-slate-50"
            >
              ×
            </button>
          )}
        </div>
        <SelectorFormato estilo={estilo} onChange={cambiarFormato} />
        <div ref={cajaRef} className="mt-2 flex justify-center" />
        {mensaje && (
          <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm text-slate-600">{mensaje}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-sm font-bold text-navy-900">Buscá tu auto por patente</p>
      <Chapa valor={patente} estilo={estilo} onChange={setPatente} onEnter={buscar} autoFocus={autoFocus} pequena={pequena} />
      <SelectorFormato estilo={estilo} onChange={cambiarFormato} />
      <div ref={cajaRef} className="mt-2 flex justify-center" />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={buscar}
          disabled={patente.length < 6 || !token || cargando}
          className="flex-1 rounded-xl bg-orange-500 py-3.5 text-base font-black text-white transition-colors hover:bg-orange-600 disabled:opacity-40"
        >
          {cargando ? "Buscando…" : "Buscar mi auto"}
        </button>
        {patente && (
          <button
            type="button"
            onClick={borrar}
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
