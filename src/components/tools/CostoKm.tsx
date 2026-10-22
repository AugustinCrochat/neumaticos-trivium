"use client";

import { useState } from "react";
import { inputCls, labelCls, Result } from "./ui";

const peso = (n: number) => `$${Math.round(n).toLocaleString("es-AR")}`;
const limpiar = (v: string) => Number(v.replace(/\D/g, ""));

function Columna({ titulo, precio, setPrecio, km, setKm }: { titulo: string; precio: string; setPrecio: (v: string) => void; km: string; setKm: (v: string) => void }) {
  return (
    <div className="rounded-2xl border-2 border-slate-300 bg-slate-100 p-4">
      <p className="mb-3 font-black text-navy-900">{titulo}</p>
      <label className={labelCls} htmlFor={`${titulo}-p`}>Precio por neumático ($)</label>
      <input id={`${titulo}-p`} inputMode="numeric" value={precio} onChange={(e) => setPrecio(e.target.value)} className={inputCls} />
      <label className={`${labelCls} mt-3`} htmlFor={`${titulo}-k`}>Vida útil estimada (km)</label>
      <input id={`${titulo}-k`} inputMode="numeric" value={km} onChange={(e) => setKm(e.target.value)} className={inputCls} />
    </div>
  );
}

export function CostoKm() {
  const [pa, setPa] = useState("180000");
  const [ka, setKa] = useState("60000");
  const [pb, setPb] = useState("110000");
  const [kb, setKb] = useState("35000");
  const [anual, setAnual] = useState("15000");

  const A = { precio: limpiar(pa), km: limpiar(ka) };
  const B = { precio: limpiar(pb), km: limpiar(kb) };
  const ok = A.precio > 0 && A.km > 0 && B.precio > 0 && B.km > 0;
  const por1000 = (x: typeof A) => (x.precio / x.km) * 1000;
  const kmAnual = limpiar(anual);
  const aniosA = kmAnual > 0 ? A.km / kmAnual : 0;
  const aniosB = kmAnual > 0 ? B.km / kmAnual : 0;
  const mejor = ok ? (por1000(A) <= por1000(B) ? "A" : "B") : null;
  const ahorroAnual = ok && kmAnual > 0 ? Math.abs(por1000(A) - por1000(B)) * 4 * (kmAnual / 1000) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Columna titulo="Neumático A" precio={pa} setPrecio={setPa} km={ka} setKm={setKa} />
        <Columna titulo="Neumático B" precio={pb} setPrecio={setPb} km={kb} setKm={setKb} />
      </div>
      <div className="max-w-xs">
        <label className={labelCls} htmlFor="anual">Km que hacés por año</label>
        <input id="anual" inputMode="numeric" value={anual} onChange={(e) => setAnual(e.target.value)} className={inputCls} />
      </div>

      {ok ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {([["A", A], ["B", B]] as const).map(([n, x]) => (
              <div key={n} className={`rounded-2xl border-2 p-4 ${mejor === n ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Neumático {n}</p>
                <p className="text-3xl font-black text-navy-900">{peso(por1000(x))}</p>
                <p className="text-sm text-slate-600">cada 1.000 km{kmAnual > 0 && <> · dura unos {(x.km / kmAnual).toFixed(1).replace(".", ",")} años</>}</p>
              </div>
            ))}
          </div>
          <Result tone="info" title={`El neumático ${mejor} cuesta menos por kilómetro`}>
            {kmAnual > 0 && <>En un juego de 4, la diferencia es de unos <strong>{peso(ahorroAnual)} por año</strong> a {kmAnual.toLocaleString("es-AR")} km anuales. </>}
            {aniosA > 0 && aniosB > 0 && <>Ojo: la vida útil es una estimación; tomá la de tu estilo de manejo, no un valor de folleto.</>}
          </Result>
        </>
      ) : (
        <Result tone="info" title="Completá precio y vida útil de los dos">Todos los campos son números, sin puntos.</Result>
      )}
    </div>
  );
}
