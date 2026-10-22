"use client";

import { useState } from "react";

const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });

function num(v: string) {
  const n = Number(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Compara el costo por kilómetro de dos neumáticos: precio ÷ km de vida útil. */
export function CostPerKmCalculator() {
  const [a, setA] = useState({ precio: "", km: "" });
  const [b, setB] = useState({ precio: "", km: "" });

  const costo = (v: { precio: string; km: string }) => {
    const p = num(v.precio);
    const k = num(v.km);
    return p && k ? p / k : null;
  };
  const ca = costo(a);
  const cb = costo(b);

  const campo = (v: { precio: string; km: string }, set: (x: { precio: string; km: string }) => void, nombre: string) => (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="!mb-3 text-sm font-black text-navy-900">{nombre}</p>
      <label className="mb-2 block text-xs font-bold text-slate-500">
        Precio de un neumático ($)
        <input
          inputMode="numeric"
          value={v.precio}
          onChange={(e) => set({ ...v, precio: e.target.value })}
          placeholder="Ej: 100000"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base font-bold text-slate-800 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
        />
      </label>
      <label className="block text-xs font-bold text-slate-500">
        Kilómetros que esperás que dure
        <input
          inputMode="numeric"
          value={v.km}
          onChange={(e) => set({ ...v, km: e.target.value })}
          placeholder="Ej: 40000"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base font-bold text-slate-800 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
        />
      </label>
    </div>
  );

  let veredicto: string | null = null;
  if (ca && cb) {
    const dif = Math.abs(ca - cb) / Math.max(ca, cb);
    if (dif < 0.03) veredicto = "Con estos números el costo por kilómetro es prácticamente el mismo: decidí por seguridad, ruido y garantía.";
    else veredicto = `${ca < cb ? "La opción A" : "La opción B"} sale ${Math.round(dif * 100)}% más barata por kilómetro.`;
  }

  return (
    <section className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5" aria-label="Calculadora de costo por kilómetro">
      <h3 className="!mt-0 !mb-1">Calculá el costo por kilómetro</h3>
      <p className="!mb-4 !text-base">Ingresá precio y duración esperada de dos neumáticos. La duración es un supuesto tuyo: probá con un rango conservador y uno optimista.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {campo(a, setA, "Opción A")}
        {campo(b, setB, "Opción B")}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="!mb-0 rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-500">
          A: <span className="text-lg font-black text-navy-900">{ca ? `${peso.format(ca)} / km` : "—"}</span>
        </p>
        <p className="!mb-0 rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-500">
          B: <span className="text-lg font-black text-navy-900">{cb ? `${peso.format(cb)} / km` : "—"}</span>
        </p>
      </div>
      {veredicto && <p className="!mb-0 mt-3 rounded-xl bg-navy-900 px-4 py-3 text-center !text-base font-black !text-white">{veredicto}</p>}
    </section>
  );
}
