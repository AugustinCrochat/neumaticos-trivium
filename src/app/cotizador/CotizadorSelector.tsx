"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useVehicle } from "@/contexts/vehicle-context";
import { useBranch } from "@/contexts/branch-context";
import { VehicleCombobox } from "@/components/ui/VehicleCombobox";
import { VersionSelect } from "@/components/ui/VersionSelect";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import Link from "@/components/ui/Link";
import { getSizesForVehicle } from "@/lib/vehicles";
import type { VehiculoOption } from "@/lib/pos-api";
import type { TireProduct } from "@/lib/types";
import type { QuoteProduct } from "./CotizadorClient";

export type MedidaDisponible = { w: number; p: number; r: number; n: number };
type Medida = { w: string; p: string; r: string };
type Modo = "medida" | "auto" | "texto";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

const SELECT =
  "w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-3 text-base font-bold text-navy-900 outline-none transition-colors focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-300";

function aQuote(p: TireProduct): QuoteProduct {
  return {
    id: p.id,
    label: `${p.brand} ${p.model}`,
    price: p.price,
    imageUrl: p.imageUrl,
    brand: p.brand,
    model: p.model,
    slug: p.slug,
  };
}

/** Calle primero, después A/T y carga; a igual tipo, el más barato. */
const rango = (p: TireProduct) => (p.isCarga ? 2 : p.isAT ? 1 : 0);

/**
 * Pasos 1 y 2 del cotizador: elegir la medida (en tres selectores encadenados,
 * por auto o escribiendo marca/modelo) y ver ahí mismo los neumáticos con stock
 * de esa medida para sumarlos al presupuesto.
 */
export function CotizadorSelector({
  medidas,
  destacados,
  agregados,
  onAdd,
  onMedida,
}: {
  medidas: MedidaDisponible[];
  destacados: (QuoteProduct & { medida: string })[];
  agregados: string[];
  onAdd: (p: QuoteProduct) => void;
  onMedida: (hay: boolean) => void;
}) {
  const { selectedBranch } = useBranch();
  const { vehiculos, loadVehiculos } = useVehicle();
  const [modo, setModo] = useState<Modo>("medida");
  const [sel, setSel] = useState<Medida>({ w: "", p: "", r: "" });
  const [veh, setVeh] = useState<VehiculoOption | null>(null);
  const [version, setVersion] = useState<number | null>(null);
  const [texto, setTexto] = useState("");
  const [productos, setProductos] = useState<TireProduct[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [resultadosTexto, setResultadosTexto] = useState<QuoteProduct[]>([]);

  const anchos = useMemo(() => [...new Set(medidas.map((m) => m.w))].sort((a, b) => a - b), [medidas]);
  const perfiles = useMemo(
    () => [...new Set(medidas.filter((m) => String(m.w) === sel.w).map((m) => m.p))].sort((a, b) => a - b),
    [medidas, sel.w],
  );
  const rodados = useMemo(
    () => [...new Set(medidas.filter((m) => String(m.w) === sel.w && String(m.p) === sel.p).map((m) => m.r))].sort((a, b) => a - b),
    [medidas, sel.w, sel.p],
  );
  const populares = useMemo(() => [...medidas].sort((a, b) => b.n - a.n).slice(0, 8), [medidas]);

  const sizesAuto = veh ? getSizesForVehicle(veh.marca, veh.modelo) : null;
  const medidaAuto: Medida | null =
    sizesAuto && sizesAuto.length > 0
      ? sizesAuto.length === 1
        ? { w: sizesAuto[0].w, p: sizesAuto[0].p, r: sizesAuto[0].r }
        : version !== null
          ? { w: sizesAuto[version].w, p: sizesAuto[version].p, r: sizesAuto[version].r }
          : null
      : null;

  const medidaElegida: Medida | null =
    modo === "medida" ? (sel.w && sel.p && sel.r ? sel : null) : modo === "auto" ? medidaAuto : null;
  const clave = medidaElegida ? `${medidaElegida.w}-${medidaElegida.p}-${medidaElegida.r}` : "";

  useEffect(() => {
    onMedida(!!clave || resultadosTexto.length > 0);
  }, [clave, resultadosTexto.length, onMedida]);

  // Neumáticos con stock de la medida elegida.
  useEffect(() => {
    if (!clave) {
      const limpiar = () => setProductos(null);
      limpiar();
      return;
    }
    const [w, p, r] = clave.split("-");
    let cancelado = false;
    const arrancar = () => setCargando(true);
    arrancar();
    fetch(`/api/search?q=${encodeURIComponent(`${w} ${p} r${r}`)}&full=1`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { matches?: { type: string; item: TireProduct }[] } | null) => {
        if (cancelado) return;
        const lista = (data?.matches ?? [])
          .filter((m) => m.type === "tire")
          .map((m) => m.item)
          .filter((t) => String(t.size.width) === w && String(t.size.profile) === p && String(t.size.rim) === r && t.enStock)
          .sort((a, b) => rango(a) - rango(b) || a.price - b.price);
        setProductos(lista);
      })
      .catch(() => !cancelado && setProductos([]))
      .finally(() => !cancelado && setCargando(false));
    return () => {
      cancelado = true;
    };
  }, [clave]);

  // Búsqueda libre por marca, modelo o medida escrita.
  useEffect(() => {
    const q = texto.trim();
    if (modo !== "texto" || !q) {
      const limpiar = () => setResultadosTexto([]);
      limpiar();
      return;
    }
    let cancelado = false;
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { results?: { type: string; id: string; slug: string; title: string; subtitle: string; price: number; imageUrl: string | null; enStock: boolean }[] } | null) => {
          if (cancelado || !data?.results) return;
          setResultadosTexto(
            data.results
              .filter((r) => r.type === "tire" && r.enStock)
              .map((r) => ({ id: r.id, label: `${r.subtitle} ${r.title}`, price: r.price, imageUrl: r.imageUrl, brand: r.subtitle, model: r.title, slug: r.slug })),
          );
        })
        .catch(() => {});
    }, 250);
    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [texto, modo]);

  function elegirMedida(m: { w: number; p: number; r: number }) {
    setModo("medida");
    setSel({ w: String(m.w), p: String(m.p), r: String(m.r) });
  }

  const tab = (id: Modo, label: string) => (
    <button
      type="button"
      onClick={() => {
        setModo(id);
        if (id === "auto") loadVehiculos();
      }}
      onMouseEnter={id === "auto" ? loadVehiculos : undefined}
      className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-black transition-colors ${modo === id ? "bg-black text-white shadow" : "text-slate-500 hover:text-slate-800"}`}
    >
      {label}
    </button>
  );

  const tarjeta = (q: QuoteProduct, extra?: { isAT?: boolean; isCarga?: boolean; medida?: string }) => {
    const ya = agregados.includes(q.id);
    return (
      <div key={q.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
        <div className="relative aspect-square bg-slate-50">
          {q.imageUrl && <Image src={q.imageUrl} alt={q.label} fill sizes="(max-width: 640px) 45vw, 220px" className="object-contain p-3" />}
          {(extra?.isAT || extra?.isCarga) && (
            <span className="absolute left-2 top-2 rounded-md bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
              {extra.isCarga ? "Carga" : "A/T"}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-navy-900">{q.label}</p>
          {extra?.medida && <p className="mt-0.5 text-xs font-semibold text-slate-400">{extra.medida}</p>}
          <p className="mt-1 text-lg font-black text-red-600">{formatPrice(q.price)}</p>
          <p className="text-[11px] font-bold text-slate-400">por unidad · juego de 4: {formatPrice(q.price * 4)}</p>
          <button
            type="button"
            disabled={ya}
            onClick={() => onAdd(q)}
            className={`mt-3 w-full rounded-xl py-2.5 text-sm font-black transition-all ${
              ya ? "bg-emerald-100 text-emerald-700" : "bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98]"
            }`}
          >
            {ya ? "✓ En tu presupuesto" : "Agregar juego x4"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">1</span>
          <div>
            <h2 className="text-lg font-black leading-tight text-navy-900">¿Qué medida necesitás?</h2>
            <p className="text-xs font-medium text-slate-500">La encontrás en el lateral de tu cubierta, ej. 205/55 R16.</p>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            {tab("medida", "Tengo la medida")}
            {tab("auto", "Por mi auto")}
            {tab("texto", "Buscar modelo")}
          </div>

          {modo === "medida" && (
            <>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-slate-400">Ancho</span>
                  <select className={SELECT} value={sel.w} onChange={(e) => setSel({ w: e.target.value, p: "", r: "" })}>
                    <option value="">205…</option>
                    {anchos.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-slate-400">Perfil</span>
                  <select className={SELECT} disabled={!sel.w} value={sel.p} onChange={(e) => setSel({ ...sel, p: e.target.value, r: "" })}>
                    <option value="">55…</option>
                    {perfiles.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-slate-400">Rodado</span>
                  <select className={SELECT} disabled={!sel.p} value={sel.r} onChange={(e) => setSel({ ...sel, r: e.target.value })}>
                    <option value="">R16…</option>
                    {rodados.map((v) => <option key={v} value={v}>R{v}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs font-bold text-slate-400">O elegí una de las más pedidas:</p>
                <div className="flex flex-wrap gap-2">
                  {populares.map((m) => {
                    const activa = sel.w === String(m.w) && sel.p === String(m.p) && sel.r === String(m.r);
                    return (
                      <button
                        key={`${m.w}-${m.p}-${m.r}`}
                        type="button"
                        onClick={() => elegirMedida(m)}
                        className={`rounded-full border-2 px-3 py-1.5 text-sm font-black transition-colors ${activa ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                      >
                        {m.w}/{m.p} R{m.r}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {modo === "auto" && (
            <div>
              {!veh ? (
                <VehicleCombobox vehiculos={vehiculos} onSelect={(v) => { setVeh(v); setVersion(null); }} placeholder="Escribí tu auto: Sandero, Corolla, Amarok, 208…" />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-orange-500 bg-orange-50 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Tu vehículo</p>
                      <p className="truncate text-base font-bold text-navy-900">{veh.marca} {veh.modelo}</p>
                    </div>
                    <button type="button" onClick={() => { setVeh(null); setVersion(null); }} className="shrink-0 text-xs font-bold text-slate-500 hover:text-slate-700">
                      Cambiar
                    </button>
                  </div>
                  {sizesAuto && sizesAuto.length > 1 && (
                    <VersionSelect
                      options={sizesAuto.map((s) => [[s.generation, s.years && `(${s.years})`].filter(Boolean).join(" "), s.version].filter(Boolean).join(" — ") || `${s.w}/${s.p} R${s.r}`)}
                      value={version}
                      onChange={setVersion}
                      autoOpen={version === null}
                    />
                  )}
                  {(!sizesAuto || sizesAuto.length === 0) && (
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm font-semibold text-slate-600">
                      Todavía no tenemos cargada la medida de este modelo.{" "}
                      <WhatsAppLink
                        href={`https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(`Hola, quiero saber la medida de neumático de mi ${veh.marca} ${veh.modelo}`)}`}
                        className="font-black text-orange-600 hover:underline"
                      >
                        Consultanos por WhatsApp
                      </WhatsAppLink>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {modo === "texto" && (
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Marca, modelo o medida, ej: Grenlander, Pirelli, 205 55 16…"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-base font-medium text-slate-700 outline-none focus:border-orange-500"
            />
          )}
        </div>
      </section>

      {/* Paso 2: neumáticos de la medida elegida */}
      {(medidaElegida || (modo === "texto" && texto.trim())) && (
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">2</span>
            <div>
              <h2 className="text-lg font-black leading-tight text-navy-900">
                {medidaElegida ? `Neumáticos ${medidaElegida.w}/${medidaElegida.p} R${medidaElegida.r} con stock` : "Neumáticos con stock"}
              </h2>
              <p className="text-xs font-medium text-slate-500">Tocá «Agregar» y lo sumamos a tu presupuesto. Después ajustás la cantidad.</p>
            </div>
          </div>

          {modo === "texto" ? (
            resultadosTexto.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{resultadosTexto.map((q) => tarjeta(q))}</div>
            ) : (
              <p className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500">No encontramos ese modelo con stock.</p>
            )
          ) : cargando && !productos ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : productos && productos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {productos.map((t) => tarjeta(aQuote(t), { isAT: t.isAT, isCarga: t.isCarga }))}
            </div>
          ) : productos ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="font-bold text-navy-900">Esta medida no tiene stock en este momento.</p>
              <p className="mt-1 text-sm text-slate-500">Escribinos y te decimos cuándo entra o qué alternativa compatible tenemos.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {medidaElegida && (
                  <WhatsAppLink
                    href={`https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(`Hola, busco neumáticos ${medidaElegida.w}/${medidaElegida.p} R${medidaElegida.r}`)}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-black text-white hover:bg-[#1ebe57]"
                  >
                    Consultar por WhatsApp
                  </WhatsAppLink>
                )}
                {medidaElegida && (
                  <Link
                    href={`/buscar?medida=${medidaElegida.w}-${medidaElegida.p}-r${medidaElegida.r}`}
                    className="inline-flex items-center rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 hover:border-slate-300"
                  >
                    Ver medidas compatibles
                  </Link>
                )}
              </div>
            </div>
          ) : null}
        </section>
      )}

      {/* Sin medida elegida todavía: atajos con los más elegidos */}
      {!medidaElegida && !(modo === "texto" && texto.trim()) && destacados.length > 0 && (
        <section>
          <h2 className="mb-1 text-lg font-black text-navy-900">Los más elegidos</h2>
          <p className="mb-3 text-xs font-medium text-slate-500">¿Todavía no sabés cuál? Arrancá con uno de los neumáticos más vendidos, con stock hoy.</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {destacados.map((q) => tarjeta(q, { medida: q.medida }))}
          </div>
        </section>
      )}
    </div>
  );
}
