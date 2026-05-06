"use client";

import { useState, useMemo, useRef, useEffect, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data";

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)].sort((a, b) => Number(a) - Number(b));
}

export function TireSizeSearch({
  initialMedida,
}: {
  initialMedida?: string;
}) {
  const router = useRouter();
  const profileRef = useRef<HTMLSelectElement>(null);
  const rimRef = useRef<HTMLSelectElement>(null);

  function parseInitial(medida?: string) {
    if (!medida) return { w: "", p: "", r: "" };
    const parts = medida.toLowerCase().split("-");
    return { 
      w: parts[0] || "", 
      p: parts[1] || "", 
      r: (parts[2] && parts[2].startsWith("r")) ? parts[2].substring(1) : "" 
    };
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

  function handleSearch() {
    if (!width && !profile && !rim) return;
    router.push(`/buscar?medida=${width}-${profile}-r${rim}`);
  }

  // Auto-search ONLY when all three are selected
  useEffect(() => {
    if (width && profile && rim) {
      handleSearch();
    }
  }, [width, profile, rim]);

  function onWidthChange(v: string) {
    setWidth(v);
    setProfile("");
    setRim("");
    setTimeout(() => profileRef.current?.focus(), 10);
  }

  function onProfileChange(v: string) {
    setProfile(v);
    setRim("");
    setTimeout(() => rimRef.current?.focus(), 10);
  }

  const isValid = !!(width && profile && rim);
  const canSearch = !!(width || profile || rim);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <Select label="Ancho" value={width} onChange={onWidthChange} placeholder="Ancho" example="195">
          {availableWidths.map((w) => <option key={w} value={w}>{w}</option>)}
        </Select>
        <Select label="Perfil" value={profile} onChange={onProfileChange} placeholder="Perfil" example="55" ref={profileRef}>
          {availableProfiles.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Select label="Rodado" value={rim} onChange={(v) => setRim(v)} placeholder="Rodado" example="16" ref={rimRef}>
          {availableRims.map((r) => <option key={r} value={r}>R{r}</option>)}
        </Select>
      </div>

      {(width || profile || rim) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50/50 rounded-lg border border-orange-100/50">
          <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-slate-700 text-xs font-mono font-bold">
            {width || "—"}/{profile || "—"} R{rim || "—"}
          </span>
        </div>
      )}

      {!isValid && (
        <button
          type="submit"
          disabled={!canSearch}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-navy-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          BUSCAR NEUMÁTICOS
        </button>
      )}
    </form>
  );
}

const Select = forwardRef<HTMLSelectElement, {
  label: string; value: string; example?: string; onChange: (v: string) => void; placeholder: string; disabled?: boolean; children: React.ReactNode;
}>(({ value, example, onChange, placeholder, disabled, children }, ref) => {
  return (
    <div className="flex-1 min-w-[80px]">
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-navy-800 border-2 border-navy-700 hover:border-navy-600 focus:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 py-3 pr-8 text-sm transition-all outline-none cursor-pointer shadow-inner"
        >
          <option value="" disabled className="text-slate-500">{placeholder}</option>
          {children}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {example && (
        <span className="block text-center text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">
          Ej: {example}
        </span>
      )}
    </div>
  );
});
Select.displayName = "Select";
