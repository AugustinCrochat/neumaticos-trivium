"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { TireProduct } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { getBrandLogo } from "@/lib/brand-utils";
import { bestPriceByGroup } from "@/lib/best-price";

/**
 * Listado de una landing de categoría con filtros de aro, marca y "sólo en
 * stock". Recibe los productos ya ordenados (stock primero, después precio) y
 * renderiza todos en el primer paint —sin filtros activos— así el HTML del
 * server sigue siendo el listado completo e indexable.
 */
export function CategoryProductGrid({ productos }: { productos: TireProduct[] }) {
  const [aro, setAro] = useState<number | null>(null);
  const [marca, setMarca] = useState<string | null>(null);
  const [soloStock, setSoloStock] = useState(false);

  const aros = useMemo(() => {
    const map = new Map<number, number>();
    for (const p of productos) map.set(p.size.rim, (map.get(p.size.rim) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [productos]);

  const marcas = useMemo(() => {
    const map = new Map<string, { nombre: string; count: number }>();
    for (const p of productos) {
      const e = map.get(p.brandId);
      if (e) e.count += 1;
      else map.set(p.brandId, { nombre: p.brand, count: 1 });
    }
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [productos]);

  const filtrados = productos.filter(
    (p) => (aro == null || p.size.rim === aro) && (marca == null || p.brandId === marca) && (!soloStock || p.enStock)
  );
  const conStock = filtrados.filter((p) => p.enStock).length;
  const hayFiltros = aro != null || marca != null || soloStock;

  // Mejor precio por medida y tipo, sobre el listado completo (no sobre el
  // filtrado) así el tag no salta de producto al filtrar. Con medidas mezcladas
  // se aclara la medida en el tag.
  const mejores = useMemo(() => bestPriceByGroup(productos), [productos]);
  const variasMedidas = aros.length > 1 || new Set(productos.map((p) => `${p.size.width}/${p.size.profile}`)).size > 1;
  const lista = filtrados;

  const pill = (activo: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors ${
      activo
        ? "border-[#ff1e00] bg-[#ff1e00] text-white"
        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
    }`;

  return (
    <div>
      <div className="mb-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        {aros.length > 1 && (
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Rodado</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={pill(aro == null)} onClick={() => setAro(null)}>
                Todos
              </button>
              {aros.map(([r, count]) => (
                <button key={r} type="button" className={pill(aro === r)} onClick={() => setAro(aro === r ? null : r)}>
                  R{r} <span className="opacity-60">· {count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {marcas.length > 1 && (
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Marca</p>
            <div className="flex flex-wrap gap-2">
              {marcas.map(([id, { nombre, count }]) => {
                const logo = getBrandLogo(id);
                const activa = marca === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMarca(activa ? null : id)}
                    aria-pressed={activa}
                    className={`flex h-11 items-center gap-2 rounded-xl border px-3 transition-colors ${
                      activa ? "border-[#ff1e00] bg-orange-50" : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    {logo ? (
                      <Image src={logo} alt={nombre} width={72} height={28} className="h-6 w-auto max-w-[72px] object-contain" />
                    ) : (
                      <span className="text-sm font-black text-slate-800">{nombre}</span>
                    )}
                    <span className="text-xs font-bold text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={soloStock}
              onChange={(e) => setSoloStock(e.target.checked)}
              className="h-4 w-4 accent-[#ff1e00]"
            />
            Sólo con stock
          </label>
          <p className="text-sm text-slate-500">
            <span className="font-black text-slate-900">
              {filtrados.length} {filtrados.length === 1 ? "modelo" : "modelos"}
            </span>{" "}
            · {conStock} con stock
            {hayFiltros && (
              <button
                type="button"
                onClick={() => {
                  setAro(null);
                  setMarca(null);
                  setSoloStock(false);
                }}
                className="ml-3 font-black text-[#cc1800] underline underline-offset-2"
              >
                Limpiar filtros
              </button>
            )}
          </p>
        </div>
      </div>

      {lista.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {lista.map((p) => (
            <ProductCard key={p.id} product={p} isCheapest={mejores.has(p.id)} cheapestLabel={variasMedidas ? mejores.get(p.id) : undefined} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
          No hay modelos con esa combinación. Probá sacar algún filtro.
        </p>
      )}
    </div>
  );
}
