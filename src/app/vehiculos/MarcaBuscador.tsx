"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { MarcaLogo } from "@/components/ui/MarcaLogo";

export type MarcaItem = {
  brand: string;
  href: string;
  models: { label: string; href: string }[];
};

const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Buscador de marca/modelo con la grilla de marcas (logo + nombre) de /vehiculos. */
export function MarcaBuscador({ items }: { items: MarcaItem[] }) {
  const [q, setQ] = useState("");
  const query = norm(q.trim());
  const marcas = query ? items.filter((i) => norm(i.brand).includes(query) || i.models.some((m) => norm(m.label).includes(query))) : items;
  const modelos = query ? items.flatMap((i) => i.models).filter((m) => norm(m.label).includes(query)) : [];

  return (
    <div>
      <label htmlFor="buscar-marca" className="sr-only">
        Buscá tu marca o modelo
      </label>
      <input
        id="buscar-marca"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscá tu marca o modelo: Corsa, Palio, Hilux..."
        className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-navy-900 outline-none focus:border-navy-400"
      />

      {modelos.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-2">
          {modelos.slice(0, 24).map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="inline-block rounded-xl bg-black px-3.5 py-2 text-sm font-bold text-white hover:bg-orange-600">
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {marcas.map((m) => (
          <li key={m.brand}>
            <Link
              href={m.href}
              className="flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-bold text-navy-900 transition-colors hover:border-navy-300"
            >
              <MarcaLogo brand={m.brand} className="h-8 w-8" />
              <span className="leading-tight">{m.brand}</span>
            </Link>
          </li>
        ))}
      </ul>
      {marcas.length === 0 && (
        <p className="text-slate-600">
          No encontramos esa marca. Probá la{" "}
          <Link href="/calculadora-equivalencia-neumaticos" className="font-bold text-navy-700 underline underline-offset-4">
            calculadora de equivalencias
          </Link>{" "}
          o escribinos.
        </p>
      )}
    </div>
  );
}
