"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BRANCHES, DEFAULT_BRANCH_ID } from "@/lib/config";
import { useUpsellCombo } from "@/hooks/use-upsell-combo";
import { matchScore } from "@/lib/fuzzy-search";
import { getAllVehicleOptions, getSizesForVehicle } from "@/lib/vehicles";
import { MedidaFields, Result, inputCls, labelCls, medidaCompleta, type Medida } from "./ui";

export type JuegoProducto = {
  id: string;
  label: string;
  brand: string;
  price: number;
  w: number;
  p: number;
  r: number;
  img: string | null;
};

const peso = (n: number) => `$${Math.round(n).toLocaleString("es-AR")}`;

export function ArmaTuJuego({ productos }: { productos: JuegoProducto[] }) {
  // Los precios del listado son los de la sucursal por defecto: el WhatsApp tiene que ser el mismo.
  const selectedBranch = BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID) ?? BRANCHES[0];
  const combo = useUpsellCombo();
  const opciones = useMemo(() => getAllVehicleOptions(), []);

  const [query, setQuery] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const [auto, setAuto] = useState<{ marca: string; modelo: string } | null>(null);
  const marca = auto?.marca ?? "";
  const modelo = auto?.modelo ?? "";
  const [medida, setMedida] = useState<Medida>({ w: "", p: "", r: "" });
  const [elegido, setElegido] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(4);
  const [conServicio, setConServicio] = useState(true);

  // Búsqueda libre: "corsa" encuentra "Chevrolet Corsa" (y sus variantes), tolerando errores de tipeo.
  const sugerencias = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return opciones
      .map((o) => ({ o, score: matchScore(q, `${o.marca} ${o.modelo}`) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.o.label.localeCompare(b.o.label))
      .slice(0, 8)
      .map((x) => x.o);
  }, [query, opciones]);

  function elegirAuto(o: { marca: string; modelo: string }) {
    setAuto({ marca: o.marca, modelo: o.modelo });
    setQuery("");
    setAbierto(false);
    setElegido(null);
    // Si tiene una sola medida, ya la carga.
    const ms = getSizesForVehicle(o.marca, o.modelo);
    const unicasM = (ms ?? []).filter((m, i, a) => a.findIndex((x) => x.w === m.w && x.p === m.p && x.r === m.r) === i);
    setMedida(unicasM.length === 1 ? { w: unicasM[0].w, p: unicasM[0].p, r: unicasM[0].r } : { w: "", p: "", r: "" });
  }

  const medidasAuto = marca && modelo ? getSizesForVehicle(marca, modelo) : null;
  // Una opción por versión/generación: ayuda a aclarar cuál es el auto cuando la medida cambia.
  const unicas = (medidasAuto ?? []).filter(
    (m, i, a) => a.findIndex((x) => x.w === m.w && x.p === m.p && x.r === m.r && x.generation === m.generation && x.version === m.version) === i
  );

  const lista = medidaCompleta(medida)
    ? productos
        .filter((x) => x.w === Number(medida.w) && x.p === Number(medida.p) && x.r === Number(medida.r))
        .sort((a, b) => a.price - b.price)
    : [];
  const producto = lista.find((x) => x.id === elegido) ?? null;

  const subtotal = producto ? producto.price * cantidad : 0;
  const servicio = conServicio && combo ? combo.precio : 0;
  const total = subtotal + servicio;

  const texto = producto
    ? `Hola, quiero este presupuesto: ${cantidad} × ${producto.label} (${peso(producto.price)} c/u)${servicio ? ` + ${combo?.nombre} (${peso(servicio)})` : ""}. Total ${peso(total)}.${marca ? ` Es para un ${marca} ${modelo}.` : ""}`
    : "";

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 font-black text-tire-950">1. ¿Qué auto tenés? <span className="font-normal text-slate-500">(o escribí la medida más abajo)</span></p>
        {auto ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-black px-3 py-2 text-sm font-black text-white">{auto.marca} {auto.modelo}</span>
            <button type="button" onClick={() => { setAuto(null); setMedida({ w: "", p: "", r: "" }); setElegido(null); }} className="text-sm font-bold text-orange-600 underline">
              Cambiar auto
            </button>
          </div>
        ) : (
          <div className="relative">
            <label className={labelCls} htmlFor="aj-auto">Marca y modelo</label>
            <input
              id="aj-auto"
              role="combobox"
              aria-expanded={abierto && sugerencias.length > 0}
              aria-controls="aj-auto-lista"
              autoComplete="off"
              placeholder="Escribí: corsa, hilux, 208, vento…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setAbierto(true); setActivo(0); }}
              onFocus={() => setAbierto(true)}
              onBlur={() => setTimeout(() => setAbierto(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActivo((i) => Math.min(i + 1, sugerencias.length - 1)); }
                else if (e.key === "ArrowUp") { e.preventDefault(); setActivo((i) => Math.max(i - 1, 0)); }
                else if (e.key === "Enter" && sugerencias[activo]) { e.preventDefault(); elegirAuto(sugerencias[activo]); }
                else if (e.key === "Escape") setAbierto(false);
              }}
              className={inputCls}
            />
            {abierto && sugerencias.length > 0 && (
              <ul id="aj-auto-lista" role="listbox" className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border-2 border-slate-300 bg-white shadow-xl">
                {sugerencias.map((o, i) => (
                  <li key={o.label} role="option" aria-selected={i === activo}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => elegirAuto(o)}
                      className={`block w-full px-4 py-2.5 text-left ${i === activo ? "bg-orange-50" : ""}`}
                    >
                      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{o.marca}</span>
                      <span className="block font-bold text-tire-950">{o.modelo}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {abierto && query.trim().length >= 2 && sugerencias.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">No encontramos ese auto: escribí la medida de tu neumático abajo.</p>
            )}
          </div>
        )}
        {unicas.length > 0 && (
          <div className="mt-3">
            <p className={labelCls}>{unicas.length > 1 ? "Elegí la versión de tu auto" : "Medida de fábrica"}</p>
            <div className="flex flex-wrap gap-2">
              {unicas.map((m) => {
                const detalle = [m.generation, m.years, m.version].filter(Boolean).join(" · ");
                const activa = medida.w === m.w && medida.p === m.p && medida.r === m.r;
                return (
                  <button
                    key={`${m.w}-${m.p}-${m.r}-${m.generation ?? ""}-${m.version ?? ""}`}
                    type="button"
                    onClick={() => { setMedida({ w: m.w, p: m.p, r: m.r }); setElegido(null); }}
                    className={`rounded-xl border-2 px-3 py-2 text-left ${activa ? "border-orange-500 bg-orange-50" : "border-slate-300 bg-white"}`}
                  >
                    <span className="block text-sm font-black text-tire-950">{m.w}/{m.p} R{m.r}</span>
                    {detalle && <span className="block text-xs text-slate-500">{detalle}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {marca && modelo && !medidasAuto && (
          <p className="mt-2 text-sm text-slate-500">Todavía no tenemos las medidas de este modelo cargadas: escribí la medida de tu neumático abajo.</p>
        )}
        <div className="mt-4 max-w-sm">
          <p className={labelCls}>Medida</p>
          <MedidaFields id="aj-m" value={medida} onChange={(m) => { setMedida(m); setElegido(null); }} />
        </div>
      </div>

      {medidaCompleta(medida) && (
        <div>
          <p className="mb-2 font-black text-tire-950">2. Elegí un neumático con stock</p>
          {lista.length === 0 ? (
            <Result tone="warn" title={`No tenemos ${medida.w}/${medida.p} R${medida.r} con stock hoy`}>
              Escribinos por WhatsApp y te avisamos cuándo entra o te sugerimos una medida equivalente.
            </Result>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {lista.map((x) => (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => setElegido(x.id)}
                    aria-pressed={elegido === x.id}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left ${elegido === x.id ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white hover:border-slate-400"}`}
                  >
                    {x.img && <Image src={x.img} alt={x.label} width={64} height={64} className="h-16 w-16 shrink-0 rounded-lg object-contain" />}
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-black uppercase text-slate-500">{x.brand}</span>
                      <span className="block text-sm font-bold leading-snug text-tire-950">{x.label}</span>
                      <span className="block text-lg font-black text-tire-950">{peso(x.price)} <span className="text-xs font-normal text-slate-500">c/u</span></span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {producto && (
        <div className="rounded-2xl border-2 border-tire-950 bg-slate-50 p-4">
          <p className="mb-3 font-black text-tire-950">3. Tu presupuesto</p>
          <div className="flex flex-wrap items-center gap-2">
            {[2, 4].map((n) => (
              <button key={n} type="button" onClick={() => setCantidad(n)} className={`rounded-xl border-2 px-4 py-2 text-sm font-black ${cantidad === n ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-300 bg-white text-tire-950"}`}>
                {n === 4 ? "Juego de 4" : "2 neumáticos"}
              </button>
            ))}
          </div>
          {combo && (
            <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={conServicio} onChange={(e) => setConServicio(e.target.checked)} className="mt-1 accent-orange-500" />
              <span><strong>{combo.nombre}</strong> · {peso(combo.precio)}</span>
            </label>
          )}
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><dt>{cantidad} × {peso(producto.price)}</dt><dd className="font-bold">{peso(subtotal)}</dd></div>
            {servicio > 0 && <div className="flex justify-between"><dt>Servicio</dt><dd className="font-bold">{peso(servicio)}</dd></div>}
            <div className="flex justify-between border-t border-slate-300 pt-2 text-xl font-black text-tire-950"><dt>Total</dt><dd>{peso(total)}</dd></div>
          </dl>
          <a
            href={`https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(texto)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-[#25d366] px-5 py-3 font-black text-white hover:brightness-95"
          >
            Enviar presupuesto por WhatsApp
          </a>
          <p className="mt-3 text-xs text-slate-500">Precio de contado en {selectedBranch.shortName}. El stock y el precio se confirman por WhatsApp antes de la compra.</p>
        </div>
      )}
    </div>
  );
}
