"use client";

import { useState } from "react";
import { inputCls, labelCls, Result } from "./ui";

const AHORA = new Date();

/** Semana ISO-like del DOT: la semana 1 arranca el 1 de enero. */
function fechaDeSemana(semana: number, anio: number) {
  const d = new Date(anio, 0, 1 + (semana - 1) * 7);
  return d;
}

export function CodigoDot() {
  const [dot, setDot] = useState("");
  const limpio = dot.replace(/\D/g, "").slice(0, 4);
  const completo = limpio.length === 4;
  const semana = Number(limpio.slice(0, 2));
  const yy = Number(limpio.slice(2, 4));
  const anio = 2000 + yy;
  const valido = completo && semana >= 1 && semana <= 53 && anio <= AHORA.getFullYear();

  let edad = 0;
  if (valido) {
    const f = fechaDeSemana(semana, anio);
    edad = (AHORA.getTime() - f.getTime()) / (365.25 * 24 * 3600 * 1000);
  }
  const edadTxt = edad < 1 ? `${Math.max(0, Math.round(edad * 12))} meses` : `${edad.toFixed(1).replace(".", ",")} años`;

  return (
    <div>
      <label className={labelCls} htmlFor="dot">Últimos 4 números del código DOT</label>
      <input
        id="dot"
        inputMode="numeric"
        autoComplete="off"
        placeholder="Ej: 2423"
        value={limpio}
        onChange={(e) => setDot(e.target.value)}
        className={`${inputCls} max-w-xs text-2xl tracking-[0.3em]`}
      />
      <p className="mt-2 text-sm text-slate-500">
        Buscá en el flanco las letras <strong>DOT</strong> seguidas de varios caracteres: los últimos 4 son números dentro de un óvalo.
      </p>

      <div className="mt-5">
        {completo && !valido && (
          <Result tone="bad" title="Ese código no parece un DOT válido">
            Los primeros 2 números son la semana (01 a 53) y los últimos 2 el año. Revisá que no te falte ningún dígito. Los neumáticos fabricados antes del 2000 usan un código de 3 dígitos.
          </Result>
        )}
        {valido && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className={labelCls}>Semana</p>
                <p className="text-3xl font-black text-tire-950">{semana}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className={labelCls}>Año</p>
                <p className="text-3xl font-black text-tire-950">{anio}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className={labelCls}>Antigüedad</p>
                <p className="text-3xl font-black text-tire-950">{edadTxt}</p>
              </div>
            </div>
            <div className="mt-4">
              {edad < 2 ? (
                <Result tone="ok" title="Neumático reciente">Fabricado hace poco: es lo que esperás de un neumático nuevo.</Result>
              ) : edad < 5 ? (
                <Result tone="ok" title="Edad normal">Mientras el dibujo y los flancos estén bien, no hay problema por antigüedad.</Result>
              ) : edad < 10 ? (
                <Result tone="warn" title="Conviene hacerlo revisar">
                  Con más de 5 años el caucho empieza a resecarse. Revisá que no tenga grietas finas en los flancos ni en la base del dibujo.
                </Result>
              ) : (
                <Result tone="bad" title="Muy viejo: recomendamos cambiarlo">
                  Pasados los 10 años, aunque tenga dibujo, el compuesto perdió elasticidad y es más probable que falle. Los fabricantes recomiendan reemplazarlo.
                </Result>
              )}
            </div>
            <p className="mt-3 text-xs text-slate-500">Si compraste neumáticos nuevos, el DOT te dice cuánto estuvieron almacenados. Por debajo de 2 años es lo habitual.</p>
          </>
        )}
      </div>
    </div>
  );
}
