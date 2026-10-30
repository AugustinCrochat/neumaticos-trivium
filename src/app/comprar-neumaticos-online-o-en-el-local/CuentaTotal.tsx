"use client";

import { useState } from "react";

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

/**
 * Cuenta para comparar: lo que el visitante vio en otro lado más lo que suma
 * la colocación aparte, contra el precio publicado acá (colocación sin cargo).
 * No trae ningún valor precargado: los números son los suyos.
 */
export function CuentaTotal({ precioNuestro }: { precioNuestro: number | null }) {
  const [precio, setPrecio] = useState("");
  const [envio, setEnvio] = useState("");
  const [colocacion, setColocacion] = useState("");
  const [cantidad, setCantidad] = useState(4);

  const num = (v: string) => Number(v.replace(/\D/g, "")) || 0;
  const otro = num(precio) * cantidad + num(envio) + num(colocacion) * cantidad;
  const nuestro = precioNuestro ? precioNuestro * cantidad : null;
  const campo = "mt-1 h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-3 text-lg font-black text-navy-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20";

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold text-slate-700">
          Precio por neumático que viste
          <input inputMode="numeric" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="$" className={campo} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Cuántos neumáticos
          <select value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className={campo}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Envío (total)
          <input inputMode="numeric" value={envio} onChange={(e) => setEnvio(e.target.value)} placeholder="$ 0 si es gratis" className={campo} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Colocación en un taller, por neumático
          <input inputMode="numeric" value={colocacion} onChange={(e) => setColocacion(e.target.value)} placeholder="$ lo que te cobren" className={campo} />
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Comprando afuera y colocando aparte</p>
          <p className="mt-1 text-3xl font-black text-navy-900">{otro > 0 ? money(otro) : "—"}</p>
          <p className="mt-1 text-xs text-slate-500">Neumáticos + envío + colocación. Más el día extra de espera.</p>
        </div>
        <div className="rounded-2xl border-2 border-orange-500 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-widest text-orange-600">En Trivium, colocados</p>
          <p className="mt-1 text-3xl font-black text-navy-900">{nuestro ? money(nuestro) : "Consultá"}</p>
          <p className="mt-1 text-xs text-slate-500">
            {nuestro ? `Con el neumático más económico que tenemos hoy (${money(precioNuestro!)} c/u). ` : ""}
            Colocación y válvulas sin cargo.
          </p>
        </div>
      </div>
    </div>
  );
}
