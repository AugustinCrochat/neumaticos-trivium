"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Keyboard } from "lucide-react";
import { cargarMedidas } from "@/components/ui/TireSizeSearch";
import { TireDiagram } from "@/components/ui/TireDiagram";
import { MedidaHelpDialog } from "@/components/ui/MedidaHelpDialog";
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
  // Opción sobre la que está el cursor: se muestra en el neumático antes de elegirla.
  const [previa, setPrevia] = useState("");
  // Las medidas de ejemplo giran en el neumático, como en el buscador libre.
  const [giro, setGiro] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setGiro((i) => i + 1), 1800);
    return () => window.clearInterval(t);
  }, []);

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

  // Las más buscadas se adaptan a lo que ya se eligió (ancho y perfil).
  const populares = useMemo(() => {
    const porClave = new Map<string, MedidaCatalogo>();
    for (const m of base) {
      if (w && String(m.w) !== w) continue;
      if (p && String(m.p) !== p) continue;
      const k = `${m.w}-${m.p}-${m.r}`;
      const prev = porClave.get(k);
      if (!prev || m.s > prev.s) porClave.set(k, m);
    }
    return [...porClave.values()].sort((a, b) => b.s - a.s || b.n - a.n).slice(0, 12);
  }, [base, w, p]);

  // Se ven de a 4; si hay más, van rotando (y se frenan con el cursor encima).
  const [paginaPop, setPaginaPop] = useState(0);
  const [pausaPop, setPausaPop] = useState(false);
  useEffect(() => {
    if (populares.length <= 4 || pausaPop) return;
    const t = window.setInterval(() => setPaginaPop((i) => i + 1), 4000);
    return () => window.clearInterval(t);
  }, [populares.length, pausaPop]);
  const visibles = useMemo(() => {
    if (populares.length <= 4) return populares;
    const paginas = Math.ceil(populares.length / 4);
    const ini = (paginaPop % paginas) * 4;
    const cola = populares.slice(ini, ini + 4);
    return cola.length === 4 ? cola : [...cola, ...populares.slice(0, 4 - cola.length)];
  }, [populares, paginaPop]);

  // Ejemplos que respetan lo ya elegido: con 205 sólo giran medidas que existen con 205.
  const ejemplos = useMemo(() => {
    const lista = base
      .filter((m) => (!w || String(m.w) === w) && (!p || String(m.p) === p))
      .sort((a, b) => b.s - a.s || b.n - a.n)
      .slice(0, 12)
      .map((m) => ({ w: String(m.w), p: String(m.p), r: String(m.r) }));
    return lista.length > 0 ? lista : [{ w: "205", p: "55", r: "16" }];
  }, [base, w, p]);
  const ejemplo = ejemplos[giro % ejemplos.length];

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
  // Mismos colores que el neumático: el botón de cada paso hace juego con su número.
  const color = paso === "ancho" ? "#ff1e00" : paso === "perfil" ? "#6ba0d8" : "#ff8066";
  const titulo = paso === "ancho" ? "Elegí el ancho" : paso === "perfil" ? "Elegí el perfil" : "Elegí el rodado";

  return (
    <div className="w-full">
      {w && (
        <button
          type="button"
          onClick={() => (p ? setP("") : setW(""))}
          className="mb-2 inline-flex items-center gap-1 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver
        </button>
      )}

      <div className="mb-2">
        <MedidaHelpDialog compact />
      </div>

      {/* El neumático se va completando con lo elegido y marca el paso actual. */}
      <div className="mx-auto mb-3 w-full max-w-[250px]">
        <TireDiagram
          width={paso === "ancho" ? previa : w}
          aspect={paso === "perfil" ? previa : p}
          rim={paso === "rodado" ? previa : ""}
          focused={paso === "ancho" ? "width" : paso === "perfil" ? "aspect" : "rim"}
          placeholderSize={ejemplo}
          slim
        />
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
              onClick={() => {
                setPrevia("");
                if (paso === "ancho") setW(o);
                else if (paso === "perfil") setP(o);
                else ir(w, p, o);
              }}
              onMouseEnter={() => setPrevia(o)}
              onMouseLeave={() => setPrevia("")}
              onFocus={() => setPrevia(o)}
              onBlur={() => setPrevia("")}
              // Con el cursor encima se rellena con el color del paso y el número pasa a blanco.
              style={{ borderColor: color, color: previa === o ? "#ffffff" : color, backgroundColor: previa === o ? color : undefined }}
              className="rounded-lg border-2 bg-white py-2.5 text-sm font-black transition-colors"
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {populares.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
            {w ? `Las medidas más buscadas con ${w}${p ? `/${p}` : ""}` : "Las medidas más buscadas"}
          </p>
          <div className="grid grid-cols-2 gap-2" onMouseEnter={() => setPausaPop(true)} onMouseLeave={() => setPausaPop(false)}>
            {visibles.map((m) => (
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
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white py-2.5 text-sm font-black text-navy-900 transition-colors hover:border-orange-500 hover:text-orange-600"
      >
        <Keyboard className="h-4 w-4" aria-hidden="true" /> Prefiero escribir mi medida
      </button>
    </div>
  );
}
