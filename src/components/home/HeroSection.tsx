"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TIRE_WIDTHS, TIRE_PROFILES, TIRE_RIMS } from "@/lib/config";

export function HeroSection() {
  const router = useRouter();
  const [width, setWidth] = useState("");
  const [profile, setProfile] = useState("");
  const [rim, setRim] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!width || !profile || !rim) return;
    router.push(`/buscar?medida=${width}-${profile}-r${rim}`);
  };

  const isValid = width && profile && rim;

  return (
    <section className="relative overflow-hidden bg-navy-900 min-h-[500px] flex items-center">
      {/* Grid de puntos */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-navy-600/40 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Importación directa — Precios outlet
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            El outlet del{" "}
            <span className="text-orange-500">neumático</span>
          </h1>
          <p className="text-navy-200 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Neumáticos de importación directa a precios imbatibles.
            Buscá por medida y encontrá el que necesitás.
          </p>

          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-left">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Buscá por medida de neumático
            </p>

            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <SelectField
                  label="Ancho"
                  value={width}
                  onChange={setWidth}
                  placeholder="195"
                  hint="mm"
                >
                  {TIRE_WIDTHS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </SelectField>

                <SelectField
                  label="Perfil"
                  value={profile}
                  onChange={setProfile}
                  placeholder="55"
                  hint="%"
                >
                  {TIRE_PROFILES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </SelectField>

                <SelectField
                  label="Rodado"
                  value={rim}
                  onChange={setRim}
                  placeholder="16"
                  hint="R"
                  hintPrefix
                >
                  {TIRE_RIMS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </SelectField>
              </div>

              {/* Preview de medida */}
              {(width || profile || rim) && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-navy-50 rounded-lg border border-navy-100">
                  <svg className="w-4 h-4 text-navy-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-navy-700 text-sm font-mono font-semibold">
                    {width || "—"}/{profile || "—"} R{rim || "—"}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar neumáticos
              </button>
            </form>

            {/* Cómo leer la medida */}
            <p className="text-center text-xs text-slate-400 mt-4">
              ¿No sabés tu medida?{" "}
              <a href="/blog/como-leer-medida-neumatico" className="text-navy-600 hover:text-navy-800 font-medium underline underline-offset-2">
                Aprendé a leerla acá
              </a>
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-navy-300 text-sm">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              +1.000 medidas disponibles
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Importación directa
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Montaje en el local
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  hintPrefix,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint: string;
  hintPrefix?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-50 border-2 border-slate-200 hover:border-navy-300 focus:border-navy-600 focus:bg-white text-slate-800 font-semibold rounded-xl px-3 py-3 pr-8 text-sm transition-colors outline-none cursor-pointer"
        >
          <option value="" disabled>
            {hintPrefix ? `R${placeholder}` : placeholder}
          </option>
          {children}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <span className="block text-center text-xs text-slate-400 mt-1">
        {hintPrefix ? "" : hint}
      </span>
    </div>
  );
}
