"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { filasTecnicas } from "@/lib/medida-tecnica";
import type { TireSize } from "@/lib/types";

type Info = {
  key: string;
  vehiculos: { brand: string; model: string; slug: string; ficha: boolean }[];
  equivalentes: { w: number; p: number; r: number; diff: number }[];
};

/**
 * Debajo de los resultados de /buscar: qué significa la medida, qué autos la
 * traen y qué equivalencias tiene, para que quien busca pueda confirmar que es
 * la suya sin salir de la página. Enlaza a la guía completa de la medida
 * (/neumaticos/[medida]), que es la página indexable.
 */
export function MedidaInfoBloque({ size }: { size: TireSize }) {
  const { width: w, profile: p, rim: r } = size;
  const key = `${w}-${p}-${r}`;
  const [info, setInfo] = useState<Info | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch(`/api/medida-info?w=${w}&p=${p}&r=${r}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d: Omit<Info, "key"> | null) => {
        if (vivo && d) setInfo({ ...d, key });
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [w, p, r, key]);

  const datos = info?.key === key ? info : null;
  const label = `${w}/${p} R${r}`;
  const slug = `${w}-${p}-r${r}`;

  return (
    <section className="mt-16 border-t border-slate-100 pt-10" aria-label={`Información de la medida ${label}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-black text-navy-900">Todo sobre la medida {label}</h2>
        <Link href={`/neumaticos/${slug}`} className="text-sm font-bold text-orange-600 underline underline-offset-4">
          Ver la guía completa de {label} →
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <h3 className="bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500">Datos técnicos</h3>
          <dl className="divide-y divide-slate-100">
            {filasTecnicas(size).map((f) => (
              <div key={f.dato} className="grid grid-cols-[1fr_auto] gap-x-4 px-4 py-2.5">
                <dt className="text-sm font-bold text-navy-900">{f.dato}</dt>
                <dd className="text-right text-sm font-black text-navy-900">{f.valor}</dd>
                <p className="col-span-2 text-xs text-slate-500">{f.nota}</p>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-6">
          {datos && datos.vehiculos.length > 0 && (
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Autos que la traen de fábrica</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {datos.vehiculos.map((v) => (
                  <li key={v.slug}>
                    {v.ficha ? (
                      <Link href={`/vehiculos/${v.slug}`} className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-navy-900 hover:border-orange-400">
                        {v.brand} {v.model}
                      </Link>
                    ) : (
                      <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-bold text-slate-600">
                        {v.brand} {v.model}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Confirmá la medida en el flanco del neumático que tenés puesto o en la calcomanía de la puerta del conductor: una misma versión puede haber salido con más de una.
              </p>
            </div>
          )}

          {datos && datos.equivalentes.length > 0 && (
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Medidas equivalentes (±3% de diámetro)</h3>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {datos.equivalentes.map((e) => (
                  <li key={`${e.w}-${e.p}-${e.r}`}>
                    <Link href={`/buscar?medida=${e.w}-${e.p}-r${e.r}`} className="block rounded-xl border border-slate-200 p-2 text-center hover:border-orange-400">
                      <span className="block text-sm font-black text-navy-900">{e.w}/{e.p} R{e.r}</span>
                      <span className="block text-xs text-slate-500">{e.diff > 0 ? "+" : ""}{String(e.diff).replace(".", ",")}% Ø</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Mismo rodado y diámetro casi igual. <Link href={`/calculadora-equivalencia-neumaticos?original=${w}-${p}-${r}`} className="font-bold underline underline-offset-2">Verificá con la calculadora</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
