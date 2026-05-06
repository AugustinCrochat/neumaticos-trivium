"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data";

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)].sort((a, b) => Number(a) - Number(b));
}

export function TireSizeSearch({
  initialMedida,
  compact = false,
}: {
  initialMedida?: string;
  compact?: boolean;
}) {
  const router = useRouter();

  function parseInitial(medida?: string) {
    if (!medida) return { w: "", p: "", r: "" };
    const m = medida.match(/^(\d+)-(\d+)-r(\d+)$/i);
    return m ? { w: m[1], p: m[2], r: m[3] } : { w: "", p: "", r: "" };
  }

  const init = parseInitial(initialMedida);
  const [width, setWidth] = useState(init.w);
  const [profile, setProfile] = useState(init.p);
  const [rim, setRim] = useState(init.r);

  const availableWidths = useMemo(
    () => unique(PRODUCTS.map((p) => p.size.width)),
    []
  );
  const availableProfiles = useMemo(() => {
    if (!width) return unique(PRODUCTS.map((p) => p.size.profile));
    return unique(
      PRODUCTS.filter((p) => p.size.width === Number(width)).map((p) => p.size.profile)
    );
  }, [width]);
  const availableRims = useMemo(
    () =>
      unique(
        PRODUCTS.filter((p) => {
          if (width && p.size.width !== Number(width)) return false;
          if (profile && p.size.profile !== Number(profile)) return false;
          return true;
        }).map((p) => p.size.rim)
      ),
    [width, profile]
  );

  function onWidthChange(v: string) { setWidth(v); setProfile(""); setRim(""); }
  function onProfileChange(v: string) { setProfile(v); setRim(""); }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!width || !profile || !rim) return;
    router.push(`/buscar?medida=${width}-${profile}-r${rim}`);
  }

  const isValid = !!(width && profile && rim);

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-2">
        <CompactSelect label="Ancho" value={width} onChange={onWidthChange} placeholder="Ej: 195">
          {availableWidths.map((w) => <option key={w} value={w}>{w}</option>)}
        </CompactSelect>
        <CompactSelect label="Perfil" value={profile} onChange={onProfileChange} placeholder="Ej: 55" disabled={!width}>
          {availableProfiles.map((p) => <option key={p} value={p}>{p}</option>)}
        </CompactSelect>
        <CompactSelect label="Rodado" value={rim} onChange={(v) => setRim(v)} placeholder="Ej: R15" disabled={!profile}>
          {availableRims.map((r) => <option key={r} value={r}>R{r}</option>)}
        </CompactSelect>
        <button
          type="submit"
          disabled={!isValid}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-1.5 self-end mb-[1px]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch}>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <FullSelect label="Ancho" hint="mm" value={width} onChange={onWidthChange} placeholder="195">
          {availableWidths.map((w) => <option key={w} value={w}>{w}</option>)}
        </FullSelect>
        <FullSelect label="Perfil" hint="%" value={profile} onChange={onProfileChange} placeholder="55" disabled={!width}>
          {availableProfiles.map((p) => <option key={p} value={p}>{p}</option>)}
        </FullSelect>
        <FullSelect label="Rodado" hint="R" value={rim} onChange={(v) => setRim(v)} placeholder="16" hintPrefix disabled={!profile}>
          {availableRims.map((r) => <option key={r} value={r}>{r}</option>)}
        </FullSelect>
      </div>

      {(width || profile || rim) && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100">
          <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-slate-700 text-sm font-mono font-semibold">
            {width || "—"}/{profile || "—"} R{rim || "—"}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar neumáticos
      </button>
    </form>
  );
}

function FullSelect({
  label, hint, hintPrefix, value, onChange, placeholder, disabled, children,
}: {
  label: string; hint: string; hintPrefix?: boolean; value: string;
  onChange: (v: string) => void; placeholder: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-slate-50 border-2 border-slate-200 hover:border-slate-400 focus:border-orange-500 focus:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl px-3 py-3 pr-8 text-sm transition-colors outline-none cursor-pointer"
        >
          <option value="" disabled>{hintPrefix ? `R${placeholder}` : placeholder}</option>
          {children}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <span className="block text-center text-xs text-slate-400 mt-1">{hintPrefix ? "" : hint}</span>
    </div>
  );
}

function CompactSelect({
  label, value, onChange, placeholder, disabled, children,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-white border border-slate-200 hover:border-slate-400 focus:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg px-3 py-2 text-sm outline-none cursor-pointer min-w-[80px]"
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
    </div>
  );
}
