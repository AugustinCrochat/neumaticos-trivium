"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cargarMedidas } from "@/components/ui/TireSizeSearch";
import type { MedidaCatalogo } from "@/app/api/medidas/route";
import { sizeCatalogHref } from "@/lib/size-href";
import { irA } from "@/lib/navigate";

const formatPrecio = (n: number) => `$${n.toLocaleString("es-AR")}`;

/**
 * Búsqueda por medida en pasos: ancho -> perfil -> rodado, con botones y sólo
 * las combinaciones que existen en el catálogo (con stock cuando hay). Al elegir
 * el rodado va directo a los resultados. A un costado, las medidas más buscadas.
 */
export function MedidaPasos({
  economicos = false,
  onNavigate,
  onEscribir,
}: {
  economicos?: boolean;
  onNavigate?: () => void;
  /** Pasar a escribir la medida a mano. */
  onEscribir: () => void;
}) {
  const [medidas, setMedidas] = useState<MedidaCatalogo[] | null>(null);
  const [fallo, setFallo] = useState(false);
  const [w, setW] = useState("");
  const [p, setP] = useState("");

  useEffect(() => {
    let vivo = true;
    cargarMedidas().then((m) => {
      if (!vivo) return;
      if (m) setMedidas(m);
      else setFallo(true);
    });
    return () => {
      vivo = false;
    };
  }, []);

  // Sólo medidas de calle/A-T con stock; si no hay ninguna con stock, todas.
  const base = useMemo(() => {
    if (!medidas) return [];
    const utiles = medidas.filter((m) => m.t !== "c");
    const conStock = utiles.filter((m) => m.s > 0);
    return conStock.length > 0 ? conStock : utiles;
  }, [medidas]);

  const unicos = (vals: number[]) => [...new Set(vals)].sort((a, b) => a - b).map(String);
  const anchos = useMemo(() => unicos(base.map((m) => m.w)), [base]);
  const perfiles = useMemo(() => unicos(base.filter((m) => String(m.w) === w).map((m) => m.p)), [base, w]);
  const rodados = useMemo(
    () => unicos(base.filter((m) => String(m.w) === w && String(m.p) === p).map((m) => m.r)),
    [base, w, p]
  );

  const populares = useMemo(() => {
    const porClave = new Map<string, MedidaCatalogo>();
    for (const m of base) {
      const k = `${m.w}-${m.p}-${m.r}`;
      const prev = porClave.get(k);
      if (!prev || m.s > prev.s) porClave.set(k, m);
    }
    return [...porClave.values()].sort((a, b) => b.s - a.s || b.n - a.n).slice(0, 4);
  }, [base]);

  function ir(ancho: string, perfil: string, rodado: string) {
    onNavigate?.();
    irA(sizeCatalogHref(ancho, perfil, rodado, economicos));
  }

  if (fallo) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
        <p className="mb-2 text-sm font-semibold text-slate-600">No pudimos cargar las medidas.</p>
        <button type="button" onClick={onEscribir} className="text-sm font-bold text-orange-600 hover:underline">
          Escribir la medida
        </button>
      </div>
    );
  }

  const paso = !w ? "ancho" : !p ? "perfil" : "rodado";
  const opciones = paso === "ancho" ? anchos : paso === "perfil" ? perfiles : rodados;
  const titulo = paso === "ancho" ? "Elegí el ancho" : paso === "perfil" ? "Elegí el perfil" : "Elegí el rodado";

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        {w ? (
          <button
            type="button"
            onClick={() => (p ? setP("") : setW(""))}
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
        <span className="rounded-lg bg-white px-3 py-1 font-display text-lg font-bold tracking-wide text-navy-900 ring-1 ring-slate-200">
          <span className={paso === "ancho" ? "text-orange-600" : ""}>{w || "205"}</span>
          <span className="text-slate-400">/</span>
          <span className={paso === "perfil" ? "text-orange-600" : ""}>{p || "55"}</span>
          <span className="text-slate-400"> R</span>
          <span className={paso === "rodado" ? "text-orange-600" : ""}>16</span>
        </span>
      </div>

      <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">{titulo}</p>

      {!medidas ? (
        <p className="py-6 text-center text-sm font-semibold text-slate-400">Cargando medidas…</p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {opciones.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => (paso === "ancho" ? setW(o) : paso === "perfil" ? setP(o) : ir(w, p, o))}
              className="rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-black text-navy-900 transition-colors hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {populares.length > 0 && !w && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Las medidas más buscadas</p>
          <div className="grid grid-cols-2 gap-2">
            {populares.map((m) => (
              <button
                key={`${m.w}-${m.p}-${m.r}`}
                type="button"
                onClick={() => ir(String(m.w), String(m.p), String(m.r))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-left transition-colors hover:border-orange-500"
              >
                <span className="block text-sm font-black text-navy-900">
                  {m.w}/{m.p} R{m.r}
                </span>
                {m.d !== null && <span className="block text-xs font-semibold text-slate-500">desde {formatPrecio(m.d)}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onEscribir}
        className="mt-3 w-full text-center text-xs font-bold text-slate-500 transition-colors hover:text-slate-800"
      >
        Prefiero escribir la medida
      </button>
    </div>
  );
}
