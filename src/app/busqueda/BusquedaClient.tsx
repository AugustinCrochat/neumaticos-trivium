"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { AccessoryCard } from "@/components/ui/AccessoryCard";
import type { TireProduct, Accessory } from "@/lib/types";

type Match = { type: "tire"; item: TireProduct } | { type: "accessory"; item: Accessory };

export function BusquedaClient() {
  const query = useSearchParams().get("q")?.trim() ?? "";
  // `done` guarda la consulta ya resuelta: mientras no coincida con `query`
  // se muestra "Buscando…" sin tener que resetear estado dentro del efecto.
  const [state, setState] = useState<{ done: string; matches: Match[]; failed: boolean }>({
    done: "",
    matches: [],
    failed: false,
  });

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    fetch(`/api/search?q=${encodeURIComponent(query)}&full=1`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: { matches: Match[] }) => {
        if (!cancelled) setState({ done: query, matches: data.matches, failed: false });
      })
      .catch(() => {
        if (!cancelled) setState({ done: query, matches: [], failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!query) {
    return (
      <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg font-medium">Ingresá un término de búsqueda.</p>
      </div>
    );
  }

  if (state.done !== query) {
    return <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 py-20 text-center text-slate-400">Buscando…</div>;
  }

  const { matches, failed } = state;

  return (
    <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-1">
        Resultados para &quot;{query}&quot;
      </h1>
      {!failed && (
        <p className="text-slate-500 mb-6">
          {matches.length} resultado{matches.length !== 1 ? "s" : ""}
        </p>
      )}

      {failed ? (
        <div className="py-20 text-center">
          <p className="text-slate-500 font-medium">No pudimos buscar ahora. Probá de nuevo en un momento.</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500 font-medium">No encontramos nada para &quot;{query}&quot;.</p>
          <p className="text-sm text-slate-400 mt-1">Probá con otra marca, medida o código.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {matches.map((m) =>
            m.type === "tire" ? (
              <ProductCard key={`tire-${m.item.id}`} product={m.item} />
            ) : (
              <AccessoryCard key={`accessory-${m.item.id}`} accessory={m.item} />
            )
          )}
        </div>
      )}
    </div>
  );
}
