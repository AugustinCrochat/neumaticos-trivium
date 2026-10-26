"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { inputCls, labelCls, Result } from "./ui";

type Nivel = 0 | 1 | 2 | 3; // 0 ok, 1 vigilar, 2 planificar, 3 cambiar ya
const AHORA = new Date();

const PROFUNDIDAD_NUEVO = 8; // mm, aproximado de un neumático de auto nuevo

function porDibujo(mm: number): { nivel: Nivel; texto: string } {
  if (mm <= 1.6) return { nivel: 3, texto: `Con ${fmt(mm)} mm llegaste al límite de 1,6 mm que marca el indicador TWI del neumático. Cambialos ya: en mojado frenan mucho peor.` };
  if (mm <= 3) return { nivel: 2, texto: `Con ${fmt(mm)} mm el agarre en mojado ya cayó bastante. Es momento de planificar el cambio, antes de la lluvia o de un viaje.` };
  if (mm <= 4) return { nivel: 1, texto: `Con ${fmt(mm)} mm todavía te quedan kilómetros, pero revisalos seguido: a partir de los 3 mm el desempeño en piso mojado baja rápido.` };
  return { nivel: 0, texto: `Con ${fmt(mm)} mm el dibujo está bien.` };
}

function porEdad(anios: number): { nivel: Nivel; texto: string } {
  if (anios >= 10) return { nivel: 3, texto: `Tienen ${anios.toFixed(1).replace(".", ",")} años: el caucho envejece aunque haya dibujo. Los fabricantes recomiendan reemplazarlos a los 10 años como máximo.` };
  if (anios >= 6) return { nivel: 2, texto: `Tienen ${anios.toFixed(1).replace(".", ",")} años. Hacelos revisar por grietas en los flancos y planificá el recambio.` };
  if (anios >= 5) return { nivel: 1, texto: `Tienen ${anios.toFixed(1).replace(".", ",")} años: revisá que no haya grietas finas en el flanco o entre tacos.` };
  return { nivel: 0, texto: `La antigüedad (${anios.toFixed(1).replace(".", ",")} años) no es un problema.` };
}

const fmt = (n: number) => n.toFixed(1).replace(".", ",");

export function CuandoCambiar() {
  const [mm, setMm] = useState("5");
  const [dot, setDot] = useState("");
  const [km, setKm] = useState("");

  const prof = Number(mm.replace(",", "."));
  const dibujo = mm !== "" && !Number.isNaN(prof) && prof >= 0 && prof <= 15 ? porDibujo(prof) : null;

  const d = dot.replace(/\D/g, "").slice(0, 4);
  const semana = Number(d.slice(0, 2));
  const anio = 2000 + Number(d.slice(2, 4));
  const dotOk = d.length === 4 && semana >= 1 && semana <= 53 && anio <= AHORA.getFullYear();
  const edad = dotOk ? (AHORA.getTime() - new Date(anio, 0, 1 + (semana - 1) * 7).getTime()) / (365.25 * 24 * 3600 * 1000) : null;
  const antiguedad = edad !== null ? porEdad(edad) : null;

  // Km restantes estimados por desgaste lineal, sólo si se cargaron los km y el dibujo.
  const recorridos = Number(km.replace(/\D/g, ""));
  const gastado = PROFUNDIDAD_NUEVO - prof;
  const restante =
    dibujo && recorridos > 0 && gastado > 0.5 && prof > 1.6
      ? Math.round(((prof - 1.6) * (recorridos / gastado)) / 1000) * 1000
      : null;

  const peor = Math.max(dibujo?.nivel ?? 0, antiguedad?.nivel ?? 0) as Nivel;
  const veredicto = (
    [
      { tone: "ok", title: "Tus neumáticos están bien" },
      { tone: "warn", title: "Vigilalos" },
      { tone: "warn", title: "Planificá el cambio" },
      { tone: "bad", title: "Hay que cambiarlos" },
    ] as const
  )[peor];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor="mm">Profundidad del dibujo (mm)</label>
          <input id="mm" inputMode="decimal" value={mm} onChange={(e) => setMm(e.target.value)} className={inputCls} />
          <input type="range" min={0} max={9} step={0.1} value={Number.isNaN(prof) ? 0 : Math.min(9, prof)} onChange={(e) => setMm(e.target.value)} aria-label="Profundidad del dibujo" className="mt-3 w-full accent-orange-500" />
        </div>
        <div>
          <label className={labelCls} htmlFor="dot">Código DOT (4 números, opcional)</label>
          <input id="dot" inputMode="numeric" placeholder="Ej: 2423" value={d} onChange={(e) => setDot(e.target.value)} className={inputCls} />
          <Link href="/herramientas/codigo-dot" className="mt-2 inline-block text-xs font-bold text-orange-600 underline">¿Dónde lo encuentro?</Link>
        </div>
        <div>
          <label className={labelCls} htmlFor="km">Km que hicieron (opcional)</label>
          <input id="km" inputMode="numeric" placeholder="Ej: 25000" value={km} onChange={(e) => setKm(e.target.value)} className={inputCls} />
        </div>
      </div>

      {dibujo ? (
        <>
          <Result tone={veredicto.tone} title={veredicto.title}>
            <ul className="mt-1 space-y-1">
              <li>{dibujo.texto}</li>
              {antiguedad && <li>{antiguedad.texto}</li>}
              {restante !== null && <li>Al ritmo de desgaste que llevan, les quedan unos <strong>{restante.toLocaleString("es-AR")} km</strong> hasta el límite de 1,6 mm (estimación).</li>}
            </ul>
          </Result>
          {peor >= 2 && (
            <Link href="/catalogo" className="inline-block rounded-xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-600">
              Ver neumáticos en stock
            </Link>
          )}
        </>
      ) : (
        <Result tone="info" title="Ingresá la profundidad del dibujo">Es el dato principal. Un valor entre 0 y 15 mm.</Result>
      )}
    </div>
  );
}
