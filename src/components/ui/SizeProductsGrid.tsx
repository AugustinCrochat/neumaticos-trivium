"use client";

import { useState, useSyncExternalStore } from "react";
import { SortedProductGrid, type GridItem } from "@/components/ui/SortedProductGrid";

type Tipo = "calle" | "at" | "carga";
const NOMBRE: Record<Tipo, string> = { calle: "Auto / calle", at: "A/T", carga: "Carga" };

const tipoDe = (i: GridItem): Tipo => (i.product.isCarga ? "carga" : i.product.isAT ? "at" : "calle");

const suscribirHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

/**
 * Productos de una medida con un filtro por tipo (calle, A/T, carga), que sólo
 * aparece si la medida viene en más de uno. El buscador manda la elección en el
 * hash (#tipo=at): la landing sigue siendo estática y se ve completa sin JS.
 */
export function SizeProductsGrid({ items, className }: { items: GridItem[]; className: string }) {
  // En el servidor no hay hash: se renderiza todo y recién en el cliente se filtra.
  const hash = useSyncExternalStore(suscribirHash, () => window.location.hash, () => "");
  const [elegido, setElegido] = useState<Tipo | "todos" | null>(null);

  const conteo: Record<Tipo, number> = { calle: 0, at: 0, carga: 0 };
  for (const i of items) conteo[tipoDe(i)]++;
  const tipos = (Object.keys(conteo) as Tipo[]).filter((t) => conteo[t] > 0);

  const delHash = /tipo=(calle|at|carga)/.exec(hash)?.[1] as Tipo | undefined;
  const actual: Tipo | "todos" = tipos.length < 2 ? "todos" : (elegido ?? delHash ?? "todos");
  const visibles = actual === "todos" ? items : items.filter((i) => tipoDe(i) === actual);

  const pill = (activo: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-black transition-colors ${
      activo ? "border-[#ff1e00] bg-[#ff1e00] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
    }`;

  return (
    <div>
      {tipos.length > 1 && (
        <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por tipo de neumático">
          <span className="mr-1 text-xs font-black uppercase tracking-widest text-slate-500">Tipo</span>
          <button type="button" className={pill(actual === "todos")} onClick={() => setElegido("todos")}>
            Todos ({items.length})
          </button>
          {tipos.map((t) => (
            <button key={t} type="button" className={pill(actual === t)} onClick={() => setElegido(t)}>
              {NOMBRE[t]} ({conteo[t]})
            </button>
          ))}
        </div>
      )}
      <SortedProductGrid className={className} items={visibles} />
    </div>
  );
}
