"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TireProduct, TireSize } from "@/lib/types";

function tireDiameter(size: TireSize) {
  return size.rim * 25.4 + 2 * (size.width * (size.profile / 100));
}

function diameterDifferencePercent(size1: TireSize, size2: TireSize) {
  const d1 = tireDiameter(size1);
  const d2 = tireDiameter(size2);
  return ((d2 - d1) / d1) * 100;
}

export function EquivalenceCalculator({ products }: { products: TireProduct[] }) {
  const [mode, setMode] = useState<"check" | "list">("check");

  // Size 1
  const [w1, setW1] = useState("195");
  const [p1, setP1] = useState("65");
  const [r1, setR1] = useState("15");

  // Size 2 (for check mode)
  const [w2, setW2] = useState("205");
  const [p2, setP2] = useState("60");
  const [r2, setR2] = useState("15");

  const [copied, setCopied] = useState(false);

  // Prefill values from the URL when arriving from a shared link.
  // Format: ?modo=check|list&original=195-65-15&equivalente=205-60-15
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const modo = params.get("modo");
    if (modo === "check" || modo === "list") setMode(modo);

    const parseSize = (value: string | null) => {
      if (!value) return null;
      const m = value.match(/^(\d+)-(\d+)-(\d+)$/);
      return m ? { width: m[1], profile: m[2], rim: m[3] } : null;
    };

    const original = parseSize(params.get("original"));
    if (original) {
      setW1(original.width);
      setP1(original.profile);
      setR1(original.rim);
    }

    const equivalente = parseSize(params.get("equivalente"));
    if (equivalente) {
      setW2(equivalente.width);
      setP2(equivalente.profile);
      setR2(equivalente.rim);
    }
  }, []);

  // Parse inputs safely
  const s1: TireSize | null = (w1 && p1 && r1) ? { width: parseInt(w1), profile: parseInt(p1), rim: parseInt(r1) } : null;
  const s2: TireSize | null = (w2 && p2 && r2) ? { width: parseInt(w2), profile: parseInt(p2), rim: parseInt(r2) } : null;

  // Calculation for Check Mode
  const checkDiff = (s1 && s2) ? diameterDifferencePercent(s1, s2) : null;
  const isCheckCompatible = checkDiff !== null && Math.abs(checkDiff) <= 3 && s1?.rim === s2?.rim;

  // Calculation for List Mode
  let compatibleInStock: Array<{ size: TireSize; diff: number; count: number }> = [];
  if (s1) {
    const uniqueSizes = new Map<string, { size: TireSize; diff: number; count: number }>();

    for (const product of products) {
      if (product.size.width === s1.width && product.size.profile === s1.profile && product.size.rim === s1.rim) {
        continue; // Skip exact match
      }

      if (product.size.rim === s1.rim) {
        const diff = diameterDifferencePercent(s1, product.size);
        if (Math.abs(diff) <= 3) {
          const key = `${product.size.width}-${product.size.profile}-r${product.size.rim}`;
          if (uniqueSizes.has(key)) {
            uniqueSizes.get(key)!.count++;
          } else {
            uniqueSizes.set(key, { size: product.size, diff, count: 1 });
          }
        }
      }
    }

    compatibleInStock = Array.from(uniqueSizes.values()).sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
  }

  // Reset the "copied" hint whenever the inputs or mode change.
  useEffect(() => {
    setCopied(false);
  }, [mode, w1, p1, r1, w2, p2, r2]);

  function buildShareUrl() {
    const params = new URLSearchParams();
    params.set("modo", mode);
    if (s1) params.set("original", `${s1.width}-${s1.profile}-${s1.rim}`);
    if (mode === "check" && s2) params.set("equivalente", `${s2.width}-${s2.profile}-${s2.rim}`);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  async function handleShare() {
    const url = buildShareUrl();
    // Keep the address bar in sync so a manual copy also works.
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const shareButton = (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {copied ? "¡Enlace copiado!" : "Compartir esta equivalencia"}
    </button>
  );

  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-center outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8">
        <button 
          onClick={() => setMode("check")}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${mode === "check" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
        >
          Verificar 2 medidas
        </button>
        <button 
          onClick={() => setMode("list")}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${mode === "list" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
        >
          Listar compatibles en stock
        </button>
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* Medida Original */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-4 text-center uppercase tracking-wider">Medida Original</p>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input type="number" value={w1} onChange={e => setW1(e.target.value)} className={inputClass} placeholder="195" />
              <p className="text-[10px] text-center text-slate-400 mt-1 uppercase">Ancho</p>
            </div>
            <div>
              <input type="number" value={p1} onChange={e => setP1(e.target.value)} className={inputClass} placeholder="65" />
              <p className="text-[10px] text-center text-slate-400 mt-1 uppercase">Perfil</p>
            </div>
            <div>
              <input type="number" value={r1} onChange={e => setR1(e.target.value)} className={inputClass} placeholder="15" />
              <p className="text-[10px] text-center text-slate-400 mt-1 uppercase">Rodado</p>
            </div>
          </div>
        </div>

        {/* Divider icon */}
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
            {mode === "check" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
        </div>

        {/* Medida a Verificar */}
        {mode === "check" && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-4 text-center uppercase tracking-wider">Medida a Verificar</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input type="number" value={w2} onChange={e => setW2(e.target.value)} className={inputClass} placeholder="205" />
                <p className="text-[10px] text-center text-slate-400 mt-1 uppercase">Ancho</p>
              </div>
              <div>
                <input type="number" value={p2} onChange={e => setP2(e.target.value)} className={inputClass} placeholder="60" />
                <p className="text-[10px] text-center text-slate-400 mt-1 uppercase">Perfil</p>
              </div>
              <div>
                <input type="number" value={r2} onChange={e => setR2(e.target.value)} className={inputClass} placeholder="15" />
                <p className="text-[10px] text-center text-slate-400 mt-1 uppercase">Rodado</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {mode === "check" && checkDiff !== null && s1 && s2 && (
        <div className={`mt-8 p-5 rounded-2xl border ${isCheckCompatible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCheckCompatible ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {isCheckCompatible ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <div>
              <h4 className={`font-black text-lg ${isCheckCompatible ? 'text-emerald-950' : 'text-red-950'}`}>
                {isCheckCompatible ? '¡Medida Compatible!' : 'No Compatible'}
              </h4>
              <p className={isCheckCompatible ? 'text-emerald-800' : 'text-red-800'}>
                Diferencia de diámetro: <strong>{checkDiff > 0 ? '+' : ''}{checkDiff.toFixed(2)}%</strong>
              </p>
              {!isCheckCompatible && s1.rim !== s2.rim && (
                <p className="text-sm text-red-700 mt-1">Atención: El rodado (llanta) es diferente.</p>
              )}
              {isCheckCompatible && (
                <Link 
                  href={`/buscar?medida=${s2.width}-${s2.profile}-r${s2.rim}`}
                  className="inline-block mt-3 text-sm font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
                >
                  Buscar stock de {s2.width}/{s2.profile} R{s2.rim}
                </Link>
              )}
              <div>{shareButton}</div>
            </div>
          </div>
        </div>
      )}

      {mode === "list" && (
        <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-black text-slate-900 mb-4 text-lg">Alternativas disponibles en stock</h4>
          
          {!s1 && <p className="text-slate-500">Ingresá una medida original válida arriba.</p>}
          
          {s1 && compatibleInStock.length === 0 && (
            <p className="text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
              No encontramos alternativas equivalentes en stock para esta medida actualmente.
            </p>
          )}

          {s1 && compatibleInStock.length > 0 && (
            <div className="grid gap-3">
              {compatibleInStock.map(({ size, diff, count }) => (
                <Link 
                  key={`${size.width}-${size.profile}-r${size.rim}`}
                  href={`/buscar?medida=${size.width}-${size.profile}-r${size.rim}`}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-xl transition-colors group"
                >
                  <div>
                    <span className="font-black text-lg text-navy-900 group-hover:text-emerald-900 transition-colors">
                      {size.width}/{size.profile} R{size.rim}
                    </span>
                    <span className="ml-3 text-sm font-semibold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800">
                      {diff > 0 ? '+' : ''}{diff.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{count} producto{count !== 1 ? 's' : ''}</span>
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {s1 && shareButton}
        </div>
      )}
    </div>
  );
}
