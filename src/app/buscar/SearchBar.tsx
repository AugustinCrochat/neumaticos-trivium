"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data";

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)].sort((a, b) => Number(a) - Number(b));
}

function parseMedida(medida?: string) {
  if (!medida) return null;
  const match = medida.match(/^(\d+)-(\d+)-r(\d+)$/i);
  if (!match) return null;
  return { width: String(match[1]), profile: String(match[2]), rim: String(match[3]) };
}

export function SearchBar({ initialMedida }: { initialMedida?: string }) {
  const router = useRouter();
  const initial = parseMedida(initialMedida);

  const [width, setWidth] = useState(initial?.width ?? "");
  const [profile, setProfile] = useState(initial?.profile ?? "");
  const [rim, setRim] = useState(initial?.rim ?? "");

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

  const availableRims = useMemo(() => {
    return unique(
      PRODUCTS.filter((p) => {
        if (width && p.size.width !== Number(width)) return false;
        if (profile && p.size.profile !== Number(profile)) return false;
        return true;
      }).map((p) => p.size.rim)
    );
  }, [width, profile]);

  function handleWidthChange(v: string) {
    setWidth(v);
    setProfile("");
    setRim("");
  }

  function handleProfileChange(v: string) {
    setProfile(v);
    setRim("");
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!width || !profile || !rim) return;
    router.push(`/buscar?medida=${width}-${profile}-r${rim}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
      <div className="flex gap-2">
        <Select
          label="Ancho"
          value={width}
          onChange={handleWidthChange}
          placeholder="195"
        >
          {availableWidths.map((w) => <option key={w} value={w}>{w}</option>)}
        </Select>
        <Select
          label="Perfil"
          value={profile}
          onChange={handleProfileChange}
          placeholder="55"
          disabled={!width}
        >
          {availableProfiles.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Select
          label="Rodado"
          value={rim}
          onChange={setRim}
          placeholder="R16"
          disabled={!profile}
        >
          {availableRims.map((r) => <option key={r} value={r}>R{r}</option>)}
        </Select>
      </div>
      <button
        type="submit"
        disabled={!width || !profile || !rim}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar
      </button>
    </form>
  );
}

function Select({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wide mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-navy-800 border border-navy-600 hover:border-navy-400 focus:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-3 py-2.5 text-sm outline-none cursor-pointer min-w-[72px]"
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
    </div>
  );
}
