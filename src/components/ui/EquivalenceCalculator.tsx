"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { TireProduct, TireSize } from "@/lib/types";

// Tolerancia estándar de la industria: más de ±3% de diámetro desvía el
// velocímetro y puede interferir con el ABS y el control de estabilidad.
const TOLERANCE = 3;
// Se compara la diferencia redondeada a un decimal, que es la que se muestra:
// 175/70 R14 vs 175/65 R14 da +3,0013 % y en pantalla dice +3,00 %, así que
// marcarlo "no equivalente" por una milésima sería incoherente.
const within = (d: number) => Math.round(Math.abs(d) * 10) / 10 <= TOLERANCE;

// Medidas comerciales reales, para sugerir equivalentes que existen en el
// mercado y no cualquier combinación aritmética. Se repiten acá (y no se
// importan de tire-sizes) porque ese módulo arrastra VEHICLE_DB al bundle.
const COMMERCIAL_WIDTHS = [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285];
const COMMERCIAL_PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

type Fields = { w: string; p: string; r: string };

// Una alternativa realista no se aleja más de 30 mm de ancho de la original.
const nearWidth = (a: TireSize, b: TireSize) => Math.abs(a.width - b.width) <= 30;

const diameter = (s: TireSize) => s.rim * 25.4 + 2 * (s.width * (s.profile / 100));
const sidewall = (s: TireSize) => s.width * (s.profile / 100);
const diffPercent = (from: TireSize, to: TireSize) => ((diameter(to) - diameter(from)) / diameter(from)) * 100;
const label = (s: TireSize) => `${s.width}/${s.profile} R${s.rim}`;
const slug = (s: TireSize) => `${s.width}-${s.profile}-r${s.rim}`;
const same = (a: TireSize, b: TireSize) => a.width === b.width && a.profile === b.profile && a.rim === b.rim;
const money = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
const signed = (n: number, d = 2) => `${n > 0 ? "+" : ""}${n.toFixed(d).replace(".", ",")}`;
const num = (n: number, d = 1) => n.toFixed(d).replace(".", ",");

function toSize(f: Fields): TireSize | null {
  const width = parseInt(f.w), profile = parseInt(f.p), rim = parseInt(f.r);
  if (!(width >= 125 && width <= 400) || !(profile >= 20 && profile <= 90) || !(rim >= 10 && rim <= 24)) return null;
  return { width, profile, rim };
}

function parsePasted(text: string): Fields | null {
  const m = text.match(/(\d{3})\s*[/\-x ]\s*(\d{2})\s*(?:zr|r|-)?\s*(\d{2})/i);
  return m ? { w: m[1], p: m[2], r: m[3] } : null;
}

// Cómo cambia la conducción: sirve para decidir, no sólo para aprobar o rechazar.
function benefit(original: TireSize, alt: TireSize): string {
  if (alt.rim !== original.rim) return "Otro rodado: necesita llanta distinta.";
  if (alt.width > original.width) return "Más ancha: más superficie de contacto y agarre en curvas.";
  if (alt.width < original.width) return "Más angosta: menos resistencia a la rodadura y consumo.";
  if (alt.profile > original.profile) return "Perfil más alto: más confort sobre calles rotas.";
  if (alt.profile < original.profile) return "Perfil más bajo: manejo más preciso.";
  return "Diámetro equivalente al original.";
}

function SizeInput({ title, tone, value, onChange, placeholder, widthRef, onDone }: {
  title: string; tone: "red" | "navy"; value: Fields; onChange: (f: Fields) => void;
  placeholder: Fields; widthRef?: React.Ref<HTMLInputElement>; onDone?: () => void;
}) {
  const pRef = useRef<HTMLInputElement>(null);
  const rRef = useRef<HTMLInputElement>(null);
  const digits = (s: string, max: number) => s.replace(/\D/g, "").slice(0, max);
  const field = "w-full rounded-xl border-2 border-slate-200 bg-white px-2 py-2 text-center text-xl font-black text-navy-900 outline-none transition-colors focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 placeholder:text-slate-300 focus:placeholder:text-transparent sm:text-2xl";
  const onPaste = (e: React.ClipboardEvent) => {
    const parsed = parsePasted(e.clipboardData.getData("text"));
    if (parsed) { e.preventDefault(); onChange(parsed); }
  };
  return (
    <div className={`rounded-2xl border-t-4 bg-slate-50 p-3 sm:p-4 ${tone === "red" ? "border-orange-500" : "border-navy-700"}`}>
      <p className="mb-2 text-center text-xs font-black uppercase tracking-widest text-slate-500">{title}</p>
      <div className="grid grid-cols-[1.25fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-2" onPaste={onPaste}>
        <input aria-label={`${title}: ancho en milímetros`} inputMode="numeric" autoComplete="off" ref={widthRef} value={value.w} placeholder={placeholder.w} className={field}
          onFocus={(e) => e.target.select()}
          onChange={(e) => { const w = digits(e.target.value, 3); onChange({ ...value, w }); if (w.length === 3) pRef.current?.focus(); }} />
        <span className="text-2xl font-black text-slate-300">/</span>
        <input ref={pRef} aria-label={`${title}: perfil`} inputMode="numeric" autoComplete="off" value={value.p} placeholder={placeholder.p} className={field}
          onFocus={(e) => e.target.select()}
          onChange={(e) => { const p = digits(e.target.value, 2); onChange({ ...value, p }); if (p.length === 2) rRef.current?.focus(); }} />
        <span className="text-2xl font-black text-slate-300">R</span>
        <input ref={rRef} aria-label={`${title}: rodado en pulgadas`} inputMode="numeric" autoComplete="off" value={value.r} placeholder={placeholder.r} className={field}
          onFocus={(e) => e.target.select()}
          onChange={(e) => { const r = digits(e.target.value, 2); onChange({ ...value, r }); if (r.length === 2) onDone?.(); }} />
      </div>
      <div className="mt-1.5 grid grid-cols-[1.25fr_auto_1fr_auto_1fr] gap-1.5 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:gap-2">
        <span>Ancho</span><span className="w-3" /><span>Perfil</span><span className="w-3" /><span>Rodado</span>
      </div>
    </div>
  );
}

// Escala de -5 % a +5 %: la zona verde es la tolerancia de ±3 %.
function Gauge({ diff }: { diff: number }) {
  const clamped = Math.max(-5, Math.min(5, diff));
  const left = ((clamped + 5) / 10) * 100;
  const ok = within(diff);
  return (
    <div className="mt-4" role="img" aria-label={`Diferencia de diámetro ${signed(diff)} por ciento; tolerancia de más o menos 3 por ciento`}>
      <div className="relative h-3 rounded-full bg-red-200">
        <div className="absolute inset-y-0 rounded-full bg-emerald-400" style={{ left: "20%", width: "60%" }} />
        <div className={`absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-md ${ok ? "bg-emerald-600" : "bg-red-600"}`} style={{ left: `${left}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-bold text-slate-500">
        <span>-5%</span><span>-3%</span><span>0</span><span>+3%</span><span>+5%</span>
      </div>
    </div>
  );
}

type Row = { size: TireSize; diff: number; count: number; from: number };

function RowLink({ row, original }: { row: Row; original: TireSize }) {
  return (
    <Link href={`/neumaticos/${slug(row.size)}`} className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-orange-300 hover:shadow-md">
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-black text-navy-900">{label(row.size)}</span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">{signed(row.diff)}%</span>
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-500">{benefit(original, row.size)}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-black text-orange-600">desde {money(row.from)}</p>
        <p className="text-xs text-slate-500">{row.count} {row.count === 1 ? "opción" : "opciones"} →</p>
      </div>
    </Link>
  );
}

export function EquivalenceCalculator({ products }: { products: TireProduct[] }) {
  const [mode, setMode] = useState<"check" | "list">("check");
  const [a, setA] = useState<Fields>({ w: "", p: "", r: "" });
  const [b, setB] = useState<Fields>({ w: "", p: "", r: "" });
  const [copied, setCopied] = useState(false);
  const w2Ref = useRef<HTMLInputElement>(null);

  // Link compartido: ?modo=check|list&original=195-65-15&equivalente=205-60-15
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");
    if (modo === "check" || modo === "list") setMode(modo);
    const parse = (v: string | null): Fields | null => {
      const m = v?.match(/^(\d+)-(\d+)-(\d+)$/);
      return m ? { w: m[1], p: m[2], r: m[3] } : null;
    };
    const o = parse(params.get("original"));
    if (o) setA(o);
    const e = parse(params.get("equivalente"));
    if (e) setB(e);
  }, []);

  useEffect(() => setCopied(false), [mode, a, b]);

  const s1 = toSize(a);
  const s2 = toSize(b);

  // Medidas con stock, con cantidad y precio mínimo.
  const stock = useMemo(() => {
    const map = new Map<string, { size: TireSize; count: number; from: number }>();
    for (const p of products) {
      if (p.enStock === false || p.isCarga) continue;
      const k = slug(p.size);
      const e = map.get(k);
      if (e) { e.count++; e.from = Math.min(e.from, p.price); }
      else map.set(k, { size: p.size, count: 1, from: p.price });
    }
    return [...map.values()];
  }, [products]);

  const groups = useMemo(() => {
    if (!s1) return null;
    const rows = stock
      .filter((e) => !same(e.size, s1))
      .map((e): Row => ({ ...e, diff: diffPercent(s1, e.size) }))
      .filter((r) => within(r.diff))
      .sort((x, y) => Math.abs(x.diff) - Math.abs(y.diff));
    const sameRim = rows.filter((r) => r.size.rim === s1.rim);
    const otherRim = rows.filter((r) => r.size.rim !== s1.rim);
    const inStock = new Set(rows.map((r) => slug(r.size)));
    const noStock: TireSize[] = [];
    for (const width of COMMERCIAL_WIDTHS) for (const profile of COMMERCIAL_PROFILES) {
      const c = { width, profile, rim: s1.rim };
      if (!same(c, s1) && nearWidth(c, s1) && !inStock.has(slug(c)) && within(diffPercent(s1, c))) noStock.push(c);
    }
    noStock.sort((x, y) => Math.abs(diffPercent(s1, x)) - Math.abs(diffPercent(s1, y)));
    return { sameRim, otherRim, noStock: noStock.slice(0, 10) };
  }, [s1, stock]);

  // Sugerencias para completar la segunda medida con un toque.
  const suggestions = useMemo(() => {
    if (!s1) return [];
    const out: TireSize[] = [];
    for (const width of COMMERCIAL_WIDTHS) for (const profile of COMMERCIAL_PROFILES) {
      const c = { width, profile, rim: s1.rim };
      if (!same(c, s1) && nearWidth(c, s1) && within(diffPercent(s1, c))) out.push(c);
    }
    return out.sort((x, y) => Math.abs(diffPercent(s1, x)) - Math.abs(diffPercent(s1, y))).slice(0, 6);
  }, [s1]);

  const diff = s1 && s2 ? diffPercent(s1, s2) : null;
  const sameRim = !!s1 && !!s2 && s1.rim === s2.rim;
  const inTolerance = diff !== null && within(diff);
  const verdict: "ok" | "rim" | "no" | null = diff === null ? null : inTolerance && sameRim ? "ok" : inTolerance ? "rim" : "no";

  async function share() {
    const params = new URLSearchParams({ modo: mode });
    if (s1) params.set("original", `${s1.width}-${s1.profile}-${s1.rim}`);
    if (mode === "check" && s2) params.set("equivalente", `${s2.width}-${s2.profile}-${s2.rim}`);
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    window.history.replaceState(null, "", url);
    try { await navigator.clipboard.writeText(url); setCopied(true); } catch { setCopied(false); }
  }

  const shareBtn = (
    <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
      {copied ? "¡Enlace copiado!" : "Compartir resultado"}
    </button>
  );

  const tab = (m: "check" | "list", text: string) => (
    <button type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
      className={`flex-1 rounded-xl px-3 py-2 text-sm font-black transition-all sm:text-base ${mode === m ? "bg-navy-900 text-white shadow-md" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}>
      {text}
    </button>
  );

  return (
    <div className="rounded-3xl bg-white p-3 text-slate-900 shadow-2xl shadow-black/30 sm:p-5">
      <div role="tablist" aria-label="Modo de cálculo" className="flex gap-1.5 rounded-2xl bg-slate-100 p-1.5">
        {tab("check", "Comparar 2 medidas")}
        {tab("list", "Ver equivalentes en stock")}
      </div>

      <div className="mt-3 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <SizeInput title="Tu medida actual" tone="red" value={a} onChange={setA} placeholder={{ w: "195", p: "65", r: "15" }} onDone={() => mode === "check" && w2Ref.current?.focus()} />
        {mode === "check" ? (
          <button type="button" aria-label="Intercambiar las dos medidas" onClick={() => { setA(b); setB(a); }}
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-white shadow-md transition-transform hover:rotate-180 hover:bg-orange-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          </button>
        ) : <span className="hidden md:block" />}
        {mode === "check" ? <SizeInput title="Medida a verificar" tone="navy" value={b} onChange={setB} placeholder={{ w: "205", p: "60", r: "15" }} widthRef={w2Ref} /> : (
          <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm leading-relaxed text-slate-500">
            Mostramos todas las medidas con el mismo diámetro (±3 %) que hay en stock, y cuáles existen aunque hoy no las tengamos.
          </p>
        )}
      </div>

      {mode === "check" && s1 && suggestions.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-black uppercase tracking-widest text-slate-400">Posibles equivalencias de {label(s1)}: tocá una para comparar</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button key={slug(s)} type="button" onClick={() => setB({ w: String(s.width), p: String(s.profile), r: String(s.rim) })}
                    className="rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-sm font-black text-navy-800 transition-colors hover:border-navy-700 hover:bg-navy-900 hover:text-white">
                    {label(s)}
                  </button>
                ))}
              </div>
            </div>
        )}

      {!s1 && <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Escribí la medida que figura en el flanco de tu neumático. También podés pegarla completa.</p>}

      {/* Modo comparar */}
      {mode === "check" && s1 && (
        <div className="mt-3">
          {s2 && diff !== null && verdict && (
            <div className={`mt-4 rounded-2xl border-2 p-4 sm:p-5 ${verdict === "ok" ? "border-emerald-300 bg-emerald-50" : verdict === "rim" ? "border-orange-300 bg-orange-50" : "border-red-300 bg-red-50"}`} aria-live="polite">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${verdict === "ok" ? "bg-emerald-600" : verdict === "rim" ? "bg-orange-500" : "bg-red-600"}`}>
                  {verdict === "ok" ? <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    : verdict === "rim" ? <span className="text-2xl font-black">!</span>
                    : <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>}
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy-900 sm:text-2xl">
                    {verdict === "ok" && (Math.abs(diff) <= 1 ? "Equivalente: casi idéntica" : "Compatible: dentro de la tolerancia")}
                    {verdict === "rim" && "Diámetro compatible, pero cambia el rodado"}
                    {verdict === "no" && "No es equivalente"}
                  </h3>
                  <p className="mt-1 text-slate-700">
                    {label(s2)} es <strong>{signed(diff)}%</strong> {diff >= 0 ? "más grande" : "más chica"} que {label(s1)} en diámetro total.
                    {verdict === "rim" && " Necesitás una llanta de otro rodado: consultá antes de cambiar."}
                    {verdict === "no" && !sameRim && !inTolerance && " Además cambia el rodado."}
                    {verdict === "no" && inTolerance === false && sameRim && " Supera el ±3% que se acepta."}
                  </p>
                  {verdict === "ok" && <p className="mt-1 text-sm font-bold text-emerald-800">{benefit(s1, s2)}</p>}
                </div>
              </div>

              <Gauge diff={diff} />

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                {[
                  ["Ancho", `${s1.width} → ${s2.width} mm`],
                  ["Flanco", `${num(sidewall(s1))} → ${num(sidewall(s2))} mm`],
                  ["Diámetro total", `${num(diameter(s1))} → ${num(diameter(s2))} mm`],
                  ["Velocímetro", `100 km/h marcan ${num(100 * diameter(s2) / diameter(s1))} reales`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-white/80 p-3">
                    <dt className="text-[11px] font-black uppercase tracking-widest text-slate-500">{k}</dt>
                    <dd className="mt-1 font-black text-navy-900">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link href={`/neumaticos/${slug(s2)}`} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-orange-600">
                  Ver neumáticos {label(s2)} →
                </Link>
                {shareBtn}
              </div>

              {verdict !== "ok" && groups && groups.sameRim.length > 0 && (
                <div className="mt-6 border-t border-black/10 pt-5">
                  <p className="mb-3 text-sm font-black text-slate-700">Sí son equivalentes de {label(s1)} y hay stock:</p>
                  <div className="grid gap-2.5 sm:grid-cols-2">{groups.sameRim.slice(0, 4).map((r) => <RowLink key={slug(r.size)} row={r} original={s1} />)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modo listar */}
      {mode === "list" && s1 && groups && (
        <div className="mt-6 space-y-6" aria-live="polite">
          <div>
            <h3 className="text-lg font-black text-navy-900">Mismo rodado, en stock ({groups.sameRim.length})</h3>
            {groups.sameRim.length > 0 ? (
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">{groups.sameRim.map((r) => <RowLink key={slug(r.size)} row={r} original={s1} />)}</div>
            ) : (
              <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Hoy no tenemos equivalentes de {label(s1)} en stock. Mirá las que existen más abajo o consultanos: podemos conseguirlas.</p>
            )}
          </div>
          {groups.otherRim.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-navy-900">Con otro rodado (mismo diámetro total)</h3>
              <p className="mt-1 text-sm text-slate-500">Mismo diámetro final, pero necesitan una llanta de otra medida.</p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">{groups.otherRim.slice(0, 6).map((r) => <RowLink key={slug(r.size)} row={r} original={s1} />)}</div>
            </div>
          )}
          {groups.noStock.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-navy-900">También equivalentes (sin stock hoy)</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {groups.noStock.map((s) => (
                  <Link key={slug(s)} href={`/buscar?medida=${slug(s)}`} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-bold text-slate-700 hover:border-orange-400 hover:text-orange-600">
                    {label(s)} <span className="text-xs text-slate-400">{signed(diffPercent(s1, s), 1)}%</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div>{shareBtn}</div>
        </div>
      )}
    </div>
  );
}
