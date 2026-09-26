"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { TireProduct } from "@/lib/types";
import { useBranch } from "@/contexts/branch-context";
import { useUpsellCombo } from "@/hooks/use-upsell-combo";
import { AlineacionBalanceoIcon } from "@/components/ui/AlineacionBalanceoIcon";
import { goToWhatsApp } from "@/lib/gtag";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

type QuoteItem = { product: TireProduct; quantity: number };

export function CotizadorClient({ productos }: { productos: TireProduct[] }) {
  const { selectedBranch } = useBranch();
  const combo = useUpsellCombo();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [includeCombo, setIncludeCombo] = useState(false);

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    const starts: TireProduct[] = [];
    const includes: TireProduct[] = [];
    for (const p of productos) {
      const haystack = normalize(`${p.brand} ${p.model}`);
      if (haystack.startsWith(q) || normalize(p.brand).startsWith(q)) starts.push(p);
      else if (haystack.includes(q)) includes.push(p);
    }
    return [...starts, ...includes].slice(0, 8);
  }, [productos, query]);

  function addProduct(product: TireProduct) {
    setItems((prev) => {
      if (prev.some((it) => it.product.id === product.id)) return prev;
      return [...prev, { product, quantity: 2 }];
    });
    setQuery("");
    setIsOpen(false);
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((it) => it.product.id !== productId)
        : prev.map((it) => (it.product.id === productId ? { ...it, quantity: Math.min(8, quantity) } : it))
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  }

  const itemsTotal = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const comboTotal = includeCombo && combo ? combo.precio : 0;
  const total = itemsTotal + comboTotal;
  const hasItems = items.length > 0;
  const canAddCombo = hasItems && !!combo;

  function shareByWhatsApp() {
    const lineas = items.map(
      (it) => `• ${it.quantity} x ${it.product.brand} ${it.product.model} — ${formatPrice(it.product.price * it.quantity)}`
    );
    if (includeCombo && combo) {
      lineas.push(`• ${combo.nombre} — ${formatPrice(combo.precio)}`);
    }
    const mensaje = [
      "Hola! Arme este presupuesto en la web y quiero coordinar:",
      "",
      ...lineas,
      "",
      `Total: ${formatPrice(total)}`,
      `Sucursal: ${selectedBranch.shortName}`,
    ].join("\n");
    goToWhatsApp(`https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(mensaje)}`);
  }

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Buscá por marca o modelo, ej: Grenlander, Colo H02..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-navy-500/10"
        />

        {isOpen && query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-100 bg-white py-1 shadow-2xl">
            {matches.length > 0 ? (
              matches.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addProduct(p);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50"
                >
                  <div className="relative h-10 w-10 shrink-0 rounded-lg bg-slate-50">
                    {p.imageUrl && <Image src={p.imageUrl} alt="" fill sizes="40px" className="object-contain p-1" />}
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-navy-900">{p.brand} {p.model}</span>
                    <span className="text-xs font-black text-red-600">{formatPrice(p.price)}</span>
                  </span>
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-slate-400">No encontramos ese modelo con stock.</p>
            )}
          </div>
        )}
      </div>

      {/* Ítems agregados */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        {!hasItems ? (
          <p className="p-6 text-center text-sm text-slate-500">
            Todavía no agregaste ningún neumático. Buscalo arriba para empezar.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 p-4">
                <div className="relative h-16 w-16 shrink-0 rounded-lg bg-slate-50">
                  {product.imageUrl && <Image src={product.imageUrl} alt="" fill sizes="64px" className="object-contain p-1" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-bold leading-snug text-navy-900">{product.brand} {product.model}</p>
                  <p className="mt-1 text-sm font-black text-red-600">{formatPrice(product.price)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-slate-200">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50" aria-label="Reducir cantidad">−</button>
                      <span className="w-7 text-center text-sm font-bold">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50" aria-label="Aumentar cantidad">+</button>
                    </div>
                    <button onClick={() => removeItem(product.id)} className="text-xs font-bold text-slate-400 hover:text-red-600">
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {canAddCombo && !includeCombo && (
              <button
                onClick={() => setIncludeCombo(true)}
                className="flex w-full items-center gap-3 border-dashed p-4 text-left transition-colors hover:bg-orange-50"
              >
                <AlineacionBalanceoIcon size={28} />
                <span className="flex-1 text-sm">
                  <span className="block font-bold text-navy-900">¿Sumamos {combo!.nombre.toLowerCase()}?</span>
                  <span className="text-slate-500">+{formatPrice(combo!.precio)}</span>
                </span>
                <span className="shrink-0 text-xs font-black text-orange-600">Agregar</span>
              </button>
            )}
            {includeCombo && combo && (
              <div className="flex items-center gap-3 p-4">
                <AlineacionBalanceoIcon size={28} />
                <span className="flex-1 text-sm">
                  <span className="block font-bold text-navy-900">{combo.nombre}</span>
                  <span className="text-slate-500">+{formatPrice(combo.precio)}</span>
                </span>
                <button onClick={() => setIncludeCombo(false)} className="text-xs font-bold text-slate-400 hover:text-red-600">
                  Quitar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Total y compartir */}
      {hasItems && (
        <div className="rounded-2xl bg-navy-950 p-6 text-white">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-slate-300">Total</span>
            <span className="text-3xl font-black">{formatPrice(total)}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Precio con IVA incluido, retirando en {selectedBranch.shortName}. No incluye envío.
          </p>
          <button
            onClick={shareByWhatsApp}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-base font-black text-white transition-colors hover:bg-[#1ebe57]"
          >
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Compartir presupuesto por WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
