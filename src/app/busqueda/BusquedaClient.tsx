"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { medidaQueryHref } from "@/lib/medida-query";
import type { ContentResult } from "@/lib/search-content";
import { ProductCard } from "@/components/ui/ProductCard";
import { AccessoryCard } from "@/components/ui/AccessoryCard";
import type { TireProduct, Accessory } from "@/lib/types";

type Match = { type: "tire"; item: TireProduct } | { type: "accessory"; item: Accessory };

export function BusquedaClient() {
  const router = useRouter();
  const query = useSearchParams().get("q")?.trim() ?? "";
  const medidaHref = medidaQueryHref(query);
  // `done` guarda la consulta ya resuelta: mientras no coincida con `query`
  // se muestra "Buscando…" sin tener que resetear estado dentro del efecto.
  const [state, setState] = useState<{ done: string; matches: Match[]; content: ContentResult[]; failed: boolean }>({
    done: "",
    matches: [],
    content: [],
    failed: false,
  });

  useEffect(() => {
    // Una medida pegada (/busqueda?q=1756514) se resuelve como búsqueda por medida.
    if (medidaHref) {
      router.replace(medidaHref);
      return;
    }
    if (!query) return;
    let cancelled = false;
    fetch(`/api/search?q=${encodeURIComponent(query)}&full=1`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: { matches: Match[]; content?: ContentResult[] }) => {
        if (!cancelled) setState({ done: query, matches: data.matches, content: data.content ?? [], failed: false });
      })
      .catch(() => {
        if (!cancelled) setState({ done: query, matches: [], content: [], failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [query, medidaHref, router]);

  if (!query) {
    return (
      <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg font-medium">Ingresá un término de búsqueda.</p>
      </div>
    );
  }

  if (medidaHref || state.done !== query) {
    return <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 py-20 text-center text-slate-400">Buscando…</div>;
  }

  const { matches, content, failed } = state;

  return (
    <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-1">
        Resultados para &quot;{query}&quot;
      </h1>
      {!failed && (
        <p className="text-slate-500 mb-6">
          {matches.length} producto{matches.length !== 1 ? "s" : ""}{content.length > 0 ? ` y ${content.length} nota${content.length !== 1 ? "s" : ""} o página${content.length !== 1 ? "s" : ""}` : ""}
        </p>
      )}

      {failed ? (
        <div className="py-20 text-center">
          <p className="text-slate-500 font-medium">No pudimos buscar ahora. Probá de nuevo en un momento.</p>
        </div>
      ) : matches.length === 0 && content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500 font-medium">No encontramos nada para &quot;{query}&quot;.</p>
          <p className="text-sm text-slate-400 mt-1">Probá con otra marca, medida o código.</p>
        </div>
      ) : (
        <>
        {matches.length > 0 && (
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
        {content.length > 0 && (
          <section className={matches.length > 0 ? "mt-12" : ""}>
            <h2 className="mb-3 text-lg font-black text-navy-900">Notas y páginas</h2>
            <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              {content.map((c) => (
                <li key={c.href + c.title}>
                  <Link href={c.href} className="flex items-start gap-3 p-4 transition-colors hover:bg-slate-50">
                    <span className="mt-0.5 shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">{c.kind}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-navy-900">{c.title}</span>
                      <span className="block text-sm text-slate-500">{c.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        </>
      )}
    </div>
  );
}
