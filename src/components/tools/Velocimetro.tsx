"use client";

import { useState } from "react";
import { Result, MedidaFields, diametroMm, medidaCompleta, type Medida } from "./ui";

const VELOCIDADES = [40, 60, 80, 100, 110, 120, 130];
const num = (n: number, d = 1) => n.toFixed(d).replace(".", ",");

export function Velocimetro() {
  const [a, setA] = useState<Medida>({ w: "195", p: "65", r: "15" });
  const [b, setB] = useState<Medida>({ w: "205", p: "55", r: "16" });
  const listo = medidaCompleta(a) && medidaCompleta(b);
  const ratio = listo ? diametroMm(b) / diametroMm(a) : 1;
  const dif = (ratio - 1) * 100;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-slate-300 bg-slate-100 p-4">
          <p className="mb-2 font-black text-tire-950">Medida original (la del auto)</p>
          <MedidaFields id="vel-a" value={a} onChange={setA} />
        </div>
        <div className="rounded-2xl border-2 border-slate-300 bg-slate-100 p-4">
          <p className="mb-2 font-black text-tire-950">Medida nueva</p>
          <MedidaFields id="vel-b" value={b} onChange={setB} />
        </div>
      </div>

      {listo ? (
        <>
          <Result
            tone={Math.abs(dif) <= 3 ? "ok" : "bad"}
            title={`Diámetro ${dif >= 0 ? "+" : ""}${num(dif, 2)}%: el velocímetro marca ${Math.abs(dif) < 0.05 ? "igual" : dif > 0 ? "de menos" : "de más"}`}
          >
            {Math.abs(dif) <= 3
              ? "Dentro de la tolerancia de ±3 %: el desvío es chico y los sistemas del auto no se enteran."
              : "Pasa el ±3 %: el velocímetro, el cuentakilómetros y el ABS se desajustan. Conviene otra medida."}
          </Result>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-3">Velocímetro marca</th>
                  <th className="px-3 py-3">Velocidad real</th>
                  <th className="px-3 py-3">Diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {VELOCIDADES.map((v) => (
                  <tr key={v}>
                    <td className="px-3 py-2.5 font-black text-tire-950">{v} km/h</td>
                    <td className="px-3 py-2.5 font-black text-tire-950">{num(v * ratio)} km/h</td>
                    <td className="px-3 py-2.5 text-slate-600">{v * ratio - v >= 0 ? "+" : ""}{num(v * ratio - v)} km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-600">
            El cuentakilómetros también se desvía: cada <strong>100 km</strong> marcados son <strong>{num(100 * ratio)} km</strong> reales.
          </p>
        </>
      ) : (
        <Result tone="info" title="Completá las dos medidas">Ancho (3 cifras), perfil (2) y rodado (2) de cada una.</Result>
      )}
    </div>
  );
}
