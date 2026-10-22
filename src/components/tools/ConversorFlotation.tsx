"use client";

import { useState } from "react";
import Link from "next/link";
import { flotationToMetric, metricToFlotation, formatFlotationEquivalent } from "@/lib/flotation";
import { sizeSlug } from "@/lib/tire-sizes";
import { Result, MedidaFields, inputCls, labelCls, medidaCompleta, type Medida } from "./ui";

const num = (v: string) => Number(v.replace(",", "."));

export function ConversorFlotation() {
  const [d, setD] = useState("31");
  const [ancho, setAncho] = useState("10.5");
  const [rodado, setRodado] = useState("15");
  const [m, setM] = useState<Medida>({ w: "265", p: "70", r: "16" });

  const fl = { diameterIn: num(d), widthIn: num(ancho), rim: num(rodado) };
  const flOk = fl.diameterIn >= 24 && fl.diameterIn <= 45 && fl.widthIn >= 6 && fl.widthIn <= 18 && fl.rim >= 14 && fl.rim <= 24 && fl.diameterIn > fl.rim;
  const metrica = flOk ? flotationToMetric(fl) : null;

  const mOk = medidaCompleta(m);
  const flDeM = mOk ? metricToFlotation({ width: Number(m.w), profile: Number(m.p), rim: Number(m.r) }) : null;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-black text-navy-900">De flotation (pulgadas) a métrica</h2>
        <div className="flex max-w-lg gap-2">
          <div className="min-w-0 flex-1"><label className={labelCls} htmlFor="fd">Diámetro (pulg.)</label><input id="fd" inputMode="decimal" value={d} onChange={(e) => setD(e.target.value)} className={inputCls} /></div>
          <div className="min-w-0 flex-1"><label className={labelCls} htmlFor="fa">Ancho (pulg.)</label><input id="fa" inputMode="decimal" value={ancho} onChange={(e) => setAncho(e.target.value)} className={inputCls} /></div>
          <div className="min-w-0 flex-1"><label className={labelCls} htmlFor="fr">Rodado (pulg.)</label><input id="fr" inputMode="numeric" value={rodado} onChange={(e) => setRodado(e.target.value)} className={inputCls} /></div>
        </div>
        <div className="mt-4">
          {metrica ? (
            <Result tone="ok" title={`${formatFlotationEquivalent(fl)} ≈ ${metrica.width}/${metrica.profile} R${metrica.rim}`}>
              <Link href={`/neumaticos/${sizeSlug(metrica)}`} className="font-black text-orange-600 underline">Ver neumáticos {metrica.width}/{metrica.profile} R{metrica.rim} en stock →</Link>
            </Result>
          ) : (
            <Result tone="info" title="Ingresá una medida como 31 x 10.5 R15">Diámetro total, ancho de sección y rodado, los tres en pulgadas.</Result>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-black text-navy-900">De métrica a flotation</h2>
        <div className="max-w-lg"><MedidaFields id="cm" value={m} onChange={setM} /></div>
        <div className="mt-4">
          {flDeM ? (
            <Result tone="ok" title={`${m.w}/${m.p} R${m.r} ≈ ${formatFlotationEquivalent(flDeM)}`}>
              Los valores se redondean a los pasos habituales (medias pulgadas). Es una equivalencia aproximada.
            </Result>
          ) : (
            <Result tone="info" title="Ingresá una medida métrica">Ancho (3 cifras), perfil (2) y rodado (2), por ejemplo 265/70 R16.</Result>
          )}
        </div>
      </section>
    </div>
  );
}
