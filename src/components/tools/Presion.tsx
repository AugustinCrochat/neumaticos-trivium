"use client";

import { useState } from "react";
import { inputCls, labelCls, Result } from "./ui";

const TIPOS = [
  { id: "chico", label: "Auto chico (city car, hatchback)", min: 29, max: 33 },
  { id: "sedan", label: "Auto mediano / sedán", min: 32, max: 35 },
  { id: "suv", label: "SUV / crossover", min: 33, max: 36 },
  { id: "pickup", label: "Camioneta (pick-up)", min: 35, max: 40 },
  { id: "carga", label: "Utilitario con neumático de carga (C)", min: 45, max: 65 },
] as const;

const CARGAS = [
  { id: "normal", label: "Uso normal (1-2 personas)", extra: 0 },
  { id: "lleno", label: "Lleno de pasajeros o con equipaje", extra: 3 },
  { id: "viaje", label: "Viaje largo o carga máxima", extra: 5 },
] as const;

const bar = (psi: number) => (psi * 0.0689476).toFixed(1).replace(".", ",");

export function Presion() {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]["id"]>("sedan");
  const [carga, setCarga] = useState<(typeof CARGAS)[number]["id"]>("normal");
  const [psi, setPsi] = useState("32");
  const t = TIPOS.find((x) => x.id === tipo)!;
  const c = CARGAS.find((x) => x.id === carga)!;
  const aplicaExtra = tipo !== "carga";
  const min = t.min + (aplicaExtra ? c.extra : 0);
  const max = t.max + (aplicaExtra ? c.extra : 0);
  const p = Number(psi.replace(",", "."));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="tipo">Tipo de vehículo</label>
          <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)} className={inputCls}>
            {TIPOS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="carga">Carga</label>
          <select id="carga" value={carga} onChange={(e) => setCarga(e.target.value as typeof carga)} disabled={!aplicaExtra} className={inputCls}>
            {CARGAS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          {!aplicaExtra && <p className="mt-1 text-xs text-slate-500">En neumáticos de carga la presión sale de la tabla de carga del fabricante.</p>}
        </div>
      </div>

      <Result tone="info" title={`Presión orientativa en frío: ${min} a ${max} PSI`}>
        Son entre {bar(min)} y {bar(max)} bar (kg/cm²). <strong>El valor de la calcomanía de tu vehículo manda:</strong> está en el parante de la puerta del conductor, en la tapa del tanque o en el manual.
      </Result>

      <div className="rounded-2xl border border-slate-200 p-4">
        <p className="font-black text-navy-900">Conversor PSI a bar</p>
        <div className="mt-3 grid max-w-md grid-cols-2 items-end gap-3">
          <div>
            <label className={labelCls} htmlFor="psi">PSI (libras)</label>
            <input id="psi" inputMode="decimal" value={psi} onChange={(e) => setPsi(e.target.value)} className={inputCls} />
          </div>
          <p className="pb-2 text-2xl font-black text-navy-900">= {Number.isNaN(p) ? "—" : bar(p)} bar</p>
        </div>
      </div>
    </div>
  );
}
