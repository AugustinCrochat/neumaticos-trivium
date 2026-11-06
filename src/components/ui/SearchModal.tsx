"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { SearchResult } from "@/app/api/search/route";
import type { ContentResult } from "@/lib/search-content";
import { medidaQueryHref } from "@/lib/medida-query";
import { irA } from "@/lib/navigate";
import { PATENTE_RE, normalizarPatente } from "@/lib/patente";
import { goToWhatsApp, trackEvent } from "@/lib/gtag";
import { waHref } from "@/lib/whatsapp";
import { useBranch } from "@/contexts/branch-context";

type Respuesta = { results: SearchResult[]; content?: ContentResult[]; total: number };

const RECIENTES_KEY = "trivium-busquedas";
const MEDIDAS_FRECUENTES = ["175/65 R14", "185/65 R15", "195/55 R16", "205/55 R16", "205/60 R16", "175/70 R13"];
const ATAJOS = [
  { href: "/neumaticos-por-patente", t: "Buscar por patente", d: "Te decimos la medida de tu auto" },
  { href: "/ofertas", t: "Ofertas", d: "Los precios más bajos" },
  { href: "/marcas", t: "Marcas", d: "Pirelli, Fate, Firestone y más" },
  { href: "/tuercas-antirrobo", t: "Tuercas antirrobo", d: "Protegé tus llantas" },
];

// Respuestas ya vistas: volver a una consulta anterior (borrar una letra) es instantáneo.
const cache = new Map<string, Respuesta>();

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

function hrefFor(r: SearchResult) {
  return r.type === "tire" ? `/productos/${r.slug}` : `/tuercas-antirrobo/${r.slug}`;
}

function leerRecientes(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECIENTES_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}

function guardarReciente(q: string) {
  const t = q.trim();
  if (t.length < 2) return;
  try {
    const nuevo = [t, ...leerRecientes().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECIENTES_KEY, JSON.stringify(nuevo));
  } catch {}
}

/** El modelo viene como "175/65 R14 82T GRENLANDER KINGPRO ONE": se saca medida, índice y marca para no repetirlos. */
function nombreCorto(r: SearchResult): string {
  if (!r.marca) return r.title;
  let m = (r.modelo ?? r.title).replace(/\d{3}\/\d{2}\s*Z?R\d{2}C?\s*(\d{2,3}(\/\d{2,3})?[A-Z]{1,2})?\s*/i, "");
  m = m.replace(new RegExp(r.marca.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), "").replace(/\s+/g, " ").trim();
  return `${r.marca} ${m}`.trim();
}

function sinAcentos(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Marca en negrita las palabras que escribió la persona (sin importar acentos ni mayúsculas). */
function resaltar(texto: string, query: string): ReactNode {
  const tokens = sinAcentos(query).split(/[\s/\-]+/).filter((t) => t.length >= 2);
  if (!tokens.length) return texto;
  const plano = sinAcentos(texto);
  const marcado = new Array<boolean>(texto.length).fill(false);
  for (const t of tokens) {
    let i = plano.indexOf(t);
    while (i !== -1) {
      for (let k = i; k < i + t.length; k++) marcado[k] = true;
      i = plano.indexOf(t, i + t.length);
    }
  }
  const out: ReactNode[] = [];
  let ini = 0;
  for (let i = 1; i <= texto.length; i++) {
    if (i === texto.length || marcado[i] !== marcado[ini]) {
      const trozo = texto.slice(ini, i);
      out.push(marcado[ini] ? <mark key={ini} className="bg-transparent font-black text-[#ff1e00]">{trozo}</mark> : trozo);
      ini = i;
    }
  }
  return out;
}

type Fila = { key: string; href?: string; accion?: () => void };

export function SearchModal({ onClose }: { onClose: () => void }) {
  const { selectedBranch } = useBranch();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Respuesta | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activo, setActivo] = useState(-1);
  const [recientes, setRecientes] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);

  const q = query.trim();
  const medidaHref = useMemo(() => medidaQueryHref(q), [q]);
  const patente = useMemo(() => {
    const p = normalizarPatente(q);
    return q.length >= 6 && PATENTE_RE.test(p) ? p : null;
  }, [q]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecientes(leerRecientes());
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Búsqueda: debounce corto, caché local, cancela la anterior y NO borra los
  // resultados viejos mientras llega la nueva (la lista no parpadea al tipear).
  useEffect(() => {
    if (q.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null); setLoading(false); setFailed(false);
      return;
    }
    const clave = q.toLowerCase();
    const guardada = cache.get(clave);
    if (guardada) {
      setData(guardada); setLoading(false); setFailed(false);
      return;
    }
    setLoading(true);
    const ctl = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctl.signal })
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.json() as Promise<Respuesta>;
        })
        .then((d) => {
          cache.set(clave, d);
          setData(d); setFailed(false); setLoading(false);
          if (d.results.length === 0 && (d.content ?? []).length === 0) trackEvent("search_sin_resultados", { search_term: q });
        })
        .catch((err) => {
          if (err?.name === "AbortError") return;
          setFailed(true); setLoading(false);
        });
    }, 160);
    return () => { clearTimeout(timeout); ctl.abort(); };
  }, [q]);

  const results = useMemo(() => data?.results ?? [], [data]);
  const content = useMemo(() => data?.content ?? [], [data]);
  const total = data?.total ?? 0;
  const vacio = q.length >= 2 && !loading && !failed && data !== null && results.length === 0 && content.length === 0;

  const ir = useCallback((href: string) => {
    guardarReciente(q);
    trackEvent("search", { search_term: q });
    irA(href);
    onClose();
  }, [q, onClose]);

  function verTodos() {
    if (!q) return;
    ir(medidaHref ?? `/busqueda?q=${encodeURIComponent(q)}`);
  }

  // Filas navegables con el teclado, en el orden en que se ven.
  const filas: Fila[] = useMemo(() => {
    const f: Fila[] = [];
    if (patente) f.push({ key: "patente", href: "/neumaticos-por-patente" });
    if (medidaHref) f.push({ key: "medida", href: medidaHref });
    results.forEach((r) => f.push({ key: `r-${r.type}-${r.id}`, href: hrefFor(r) }));
    content.forEach((c) => f.push({ key: `c-${c.href}`, href: c.href }));
    if (q && total > results.length) f.push({ key: "todos" });
    return f;
  }, [patente, medidaHref, results, content, q, total]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivo(-1);
  }, [data, q]);

  useEffect(() => {
    if (activo < 0) return;
    listaRef.current?.querySelector(`[data-fila="${activo}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activo]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" && filas.length) {
      e.preventDefault();
      setActivo((a) => (a + 1) % filas.length);
    } else if (e.key === "ArrowUp" && filas.length) {
      e.preventDefault();
      setActivo((a) => (a <= 0 ? filas.length - 1 : a - 1));
    } else if (e.key === "Enter" && activo >= 0) {
      e.preventDefault();
      const f = filas[activo];
      if (f.href) ir(f.href);
      else verTodos();
    }
  }

  let idx = -1;
  const siguiente = () => ++idx;
  const claseFila = (i: number) =>
    `flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${i === activo ? "bg-slate-100" : ""}`;
  const props = (i: number, href: string) => ({
    id: `sr-${i}`,
    role: "option" as const,
    "aria-selected": i === activo,
    "data-fila": i,
    href,
    onClick: (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      ir(href);
    },
  });

  const mensajeWa = `Hola! Busqué "${q}" en la web y no lo encontré. ¿Me ayudan?`;

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center sm:items-start sm:p-4 sm:pt-24" role="dialog" aria-modal="true" aria-label="Buscar productos">
      <button aria-label="Cerrar" onClick={onClose} tabIndex={-1} className="absolute inset-0 hidden bg-black/70 backdrop-blur-sm sm:block" />

      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[min(34rem,80vh)] sm:max-w-xl sm:rounded-2xl">
        <form
          onSubmit={(e) => { e.preventDefault(); if (activo < 0) verTodos(); }}
          className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-4 py-3"
          role="search"
        >
          <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Medida, marca, modelo o patente"
            role="combobox"
            aria-expanded={filas.length > 0}
            aria-controls="sr-lista"
            aria-activedescendant={activo >= 0 ? `sr-${activo}` : undefined}
            aria-label="Buscar productos"
            className="min-w-0 flex-1 bg-transparent text-base text-navy-900 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Borrar" className="shrink-0 rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-slate-200">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
          <button type="button" onClick={onClose} className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold text-slate-500 hover:text-navy-900">
            Cerrar
          </button>
        </form>

        <div className={`h-0.5 shrink-0 overflow-hidden bg-transparent ${loading ? "" : "opacity-0"}`} aria-hidden>
          <div className="h-full w-1/3 animate-pulse bg-[#ff1e00]" />
        </div>

        <div ref={listaRef} id="sr-lista" role="listbox" aria-label="Resultados" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {q.length < 2 && (
            <div className="p-4">
              {recientes.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-black uppercase tracking-wide text-slate-400">Tus últimas búsquedas</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {recientes.map((r) => (
                      <li key={r}>
                        <button onClick={() => setQuery(r)} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-navy-900 hover:bg-slate-200">{r}</button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section className={recientes.length ? "mt-5" : ""}>
                <h3 className="text-[11px] font-black uppercase tracking-wide text-slate-400">Medidas más buscadas</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {MEDIDAS_FRECUENTES.map((m) => (
                    <li key={m}>
                      <button onClick={() => setQuery(m)} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-bold text-navy-900 hover:border-[#ff1e00] hover:text-[#ff1e00]">{m}</button>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="mt-5">
                <h3 className="text-[11px] font-black uppercase tracking-wide text-slate-400">Ir directo a</h3>
                <ul className="mt-2 grid grid-cols-2 gap-2">
                  {ATAJOS.map((a) => (
                    <li key={a.href}>
                      <a href={a.href} onClick={(e) => { e.preventDefault(); irA(a.href); onClose(); }} className="block rounded-xl border border-slate-200 p-3 hover:border-[#ff1e00]">
                        <span className="block text-sm font-black text-navy-900">{a.t}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{a.d}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
              <p className="mt-5 text-xs text-slate-400">Tip: escribí la medida de corrido, por ejemplo <strong className="text-slate-600">1756514</strong>.</p>
            </div>
          )}

          {q.length >= 2 && (
            <>
              {patente && (
                <a {...props(siguiente(), "/neumaticos-por-patente")} className={`${claseFila(idx)} border-b border-slate-100`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-900 text-xs font-black text-white">ABC</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-navy-900">¿Es la patente {patente}?</span>
                    <span className="block text-xs text-slate-500">Te decimos qué medida lleva tu auto</span>
                  </span>
                  <span className="font-black text-[#ff1e00]" aria-hidden>→</span>
                </a>
              )}
              {medidaHref && (
                <a {...props(siguiente(), medidaHref)} className={`${claseFila(idx)} border-b border-slate-100`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#ff1e00] text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /></svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-navy-900">Ver todos los neumáticos de esa medida</span>
                    <span className="block text-xs text-slate-500">Con stock y precio en el local</span>
                  </span>
                  <span className="font-black text-[#ff1e00]" aria-hidden>→</span>
                </a>
              )}

              {failed && (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500">No pudimos buscar ahora.</p>
                  <button onClick={verTodos} className="mt-3 rounded-full bg-navy-900 px-4 py-2 text-sm font-black text-white">Ver resultados de &quot;{q}&quot;</button>
                </div>
              )}

              {!failed && data === null && loading && (
                <ul className="p-2" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <li key={i} className="flex animate-pulse items-center gap-3 px-2 py-3">
                      <div className="h-12 w-12 rounded-lg bg-slate-100" />
                      <div className="flex-1 space-y-2"><div className="h-3 w-2/3 rounded bg-slate-100" /><div className="h-3 w-1/3 rounded bg-slate-100" /></div>
                    </li>
                  ))}
                </ul>
              )}

              {!failed && results.length > 0 && (
                <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
                  {results.map((r) => {
                    const i = siguiente();
                    const nombre = nombreCorto(r);
                    return (
                      <a key={`${r.type}-${r.id}`} {...props(i, hrefFor(r))} className={`${claseFila(i)} border-b border-slate-50`}>
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                          {r.imageUrl && <Image src={r.imageUrl} alt="" fill sizes="48px" className="object-contain p-1" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-navy-900">{resaltar(nombre, q)}</p>
                          <p className="truncate text-xs text-slate-500">
                            {r.medida ? <>{resaltar(r.medida, q)}{r.indice ? ` · ${r.indice}` : ""}</> : r.subtitle}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-black text-navy-900">{formatPrice(r.price)}</p>
                          <p className={`text-[11px] font-bold ${r.enStock ? "text-emerald-600" : "text-slate-400"}`}>{r.enStock ? "En stock" : "Sin stock"}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}

              {!failed && content.length > 0 && (
                <div className="border-t border-slate-100">
                  <h3 className="px-4 pt-3 text-[11px] font-black uppercase tracking-wide text-slate-400">Notas y páginas</h3>
                  {content.map((c) => {
                    const i = siguiente();
                    return (
                      <a key={c.href + c.title} {...props(i, c.href)} className={`${claseFila(i)} border-b border-slate-50`}>
                        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">{c.kind}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-navy-900">{resaltar(c.title, q)}</span>
                          <span className="block truncate text-xs text-slate-500">{c.description}</span>
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}

              {!failed && q && total > results.length && (() => {
                const i = siguiente();
                return (
                  <button id={`sr-${i}`} role="option" aria-selected={i === activo} data-fila={i} onClick={verTodos} className={`${claseFila(i)} justify-center text-sm font-black text-[#ff1e00]`}>
                    Ver los {total} resultados →
                  </button>
                );
              })()}

              {vacio && !medidaHref && !patente && (
                <div className="p-6 text-center">
                  <p className="font-black text-navy-900">No encontramos &quot;{q}&quot;</p>
                  <p className="mt-1 text-sm text-slate-500">Probá con la medida (175/65 R14), la marca o el modelo. Si no, te ayudamos por WhatsApp.</p>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <a
                      href={waHref(selectedBranch.whatsapp, mensajeWa)}
                      onClick={(e) => { e.preventDefault(); trackEvent("search_whatsapp", { search_term: q }); goToWhatsApp(waHref(selectedBranch.whatsapp, mensajeWa)); }}
                      className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-black text-white"
                    >
                      Preguntar por WhatsApp
                    </a>
                    <a href="/neumaticos-por-patente" onClick={(e) => { e.preventDefault(); irA("/neumaticos-por-patente"); onClose(); }} className="text-sm font-bold text-navy-900 underline">
                      Buscar por patente
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="hidden shrink-0 items-center justify-between border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400 sm:flex">
          <span>↑↓ para moverte · Enter para abrir · Esc para cerrar</span>
          <span>Precios y stock del local</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
