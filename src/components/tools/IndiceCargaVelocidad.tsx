"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { LOAD_INDEX_KG, SPEED_RATING_KMH } from "@/lib/tire-sizes";
import { LOAD_SPEED_CODES } from "@/lib/load-speed";
import { inputCls, labelCls, Result } from "./ui";

const kg = (n: number) => `${n.toLocaleString("es-AR")} kg`;

/** "91V", "91 v", "104/101R", "91" o "V". */
function leer(texto: string) {
  const t = texto.toUpperCase().replace(/\s+/g, "");
  const m = /^(\d{2,3})(?:\/(\d{2,3}))?([A-Z])?$/.exec(t);
  if (m) return { carga: m[1], dual: m[2] ?? null, vel: m[3] ?? null };
  const v = /^([A-Z])$/.exec(t);
  return v ? { carga: null, dual: null, vel: v[1] } : null;
}

const indiceMinimo = (kgPorNeumatico: number) =>
  Object.entries(LOAD_INDEX_KG).find(([, v]) => v >= kgPorNeumatico)?.[0] ?? null;

export function IndiceCargaVelocidad() {
  const [texto, setTexto] = useState("91V");
  const [eje, setEje] = useState("");

  const r = texto.trim() ? leer(texto) : null;
  const carga = r?.carga ? LOAD_INDEX_KG[r.carga] : undefined;
  const cargaDual = r?.dual ? LOAD_INDEX_KG[r.dual] : undefined;
  const vel = r?.vel ? SPEED_RATING_KMH[r.vel] : undefined;
  const valido = r !== null && (r.carga ? carga !== undefined : true) && (r.vel ? vel !== undefined : true) && (!r.dual || cargaDual !== undefined);
  const codigo = r?.carga && r.vel && !r.dual ? `${r.carga}${r.vel}` : null;
  const conPagina = codigo && (LOAD_SPEED_CODES as readonly string[]).includes(codigo) ? codigo.toLowerCase() : null;

  const pesoEje = Number(eje.replace(/\D/g, ""));
  const minimo = pesoEje > 0 ? indiceMinimo(pesoEje / 2) : null;

  return (
    <div className="space-y-8">
      <div>
        <label className={labelCls} htmlFor="ic">Índice de carga y velocidad (el final de la medida)</label>
        <input id="ic" autoComplete="off" placeholder="Ej: 91V" value={texto} onChange={(e) => setTexto(e.target.value)} className={`${inputCls} max-w-xs text-2xl uppercase tracking-widest`} />
        <p className="mt-2 text-sm text-slate-500">
          Lo ves en el flanco, después de la medida: en <strong>205/55 R16 91V</strong>, el índice es <strong>91V</strong>. Acepta solo la carga (91), solo la velocidad (V) o el doble de utilitarios (104/101R).
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["82T", "88H", "91V", "95H", "98W", "102H", "104/101R"].map((c) => (
            <button key={c} type="button" onClick={() => setTexto(c)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-bold text-tire-950 hover:border-orange-500">
              {c}
            </button>
          ))}
        </div>
      </div>

      {!r ? (
        <Result tone="info" title="Escribí un índice">Por ejemplo 91V: 91 es la carga y V la velocidad.</Result>
      ) : !valido ? (
        <Result tone="bad" title="No reconocemos ese índice">
          La carga va de 60 a 135 y la velocidad es una letra (J, Q, R, S, T, U, H, V, W o Y). Revisá cómo está escrito en el flanco.
        </Result>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            {carga !== undefined && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className={labelCls}>Carga por neumático</p>
                <p className="text-3xl font-black text-tire-950">{kg(carga)}</p>
                {cargaDual !== undefined && <p className="text-sm text-slate-500">en rodado dual: {kg(cargaDual)}</p>}
              </div>
            )}
            {carga !== undefined && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className={labelCls}>Juego de 4</p>
                <p className="text-3xl font-black text-tire-950">{kg(carga * 4)}</p>
                <p className="text-sm text-slate-500">capacidad total de las 4 ruedas</p>
              </div>
            )}
            {vel !== undefined && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className={labelCls}>Velocidad máxima</p>
                <p className="text-3xl font-black text-tire-950">{vel} km/h</p>
                <p className="text-sm text-slate-500">con el neumático a la carga indicada</p>
              </div>
            )}
          </div>
          <Result tone="info" title="Ojo: es un mínimo, no un objetivo">
            El índice del neumático nuevo tiene que ser <strong>igual o mayor</strong> al que pide el fabricante del vehículo. Uno menor es un problema de seguridad aunque tenga la misma medida.
            {conPagina && (
              <> <Link href={`/indice-carga-velocidad/${conPagina}`} className="font-black text-orange-600 underline">Ver más sobre {codigo} →</Link></>
            )}
          </Result>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 p-4">
        <h2 className="text-lg font-black text-tire-950">¿Qué índice necesito?</h2>
        <p className="mt-1 text-sm text-slate-600">Ingresá el peso que carga un eje (lo dice la chapa del vehículo, como &ldquo;PBT por eje&rdquo;): te decimos el índice de carga mínimo.</p>
        <div className="mt-3 max-w-xs">
          <label className={labelCls} htmlFor="eje">Peso máximo por eje (kg)</label>
          <input id="eje" inputMode="numeric" placeholder="Ej: 1100" value={eje} onChange={(e) => setEje(e.target.value)} className={inputCls} />
        </div>
        {pesoEje > 0 && (
          <div className="mt-3">
            {minimo ? (
              <Result tone="ok" title={`Índice de carga mínimo: ${minimo}`}>
                Cada neumático del eje carga {kg(Math.round(pesoEje / 2))}. El índice {minimo} soporta {kg(LOAD_INDEX_KG[minimo])}. Conviene un índice igual o mayor.
              </Result>
            ) : (
              <Result tone="warn" title="Esa carga supera la tabla">Consultá con el taller: son neumáticos de camión.</Result>
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-black text-tire-950">Tabla de velocidad</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr><th className="px-3 py-3">Letra</th><th className="px-3 py-3">Velocidad máxima</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(SPEED_RATING_KMH).map(([l, v]) => (
                <tr key={l}><td className="px-3 py-2 font-black text-tire-950">{l}</td><td className="px-3 py-2 text-slate-700">{v} km/h</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
