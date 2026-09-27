"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";
import { useUpsellCombo } from "@/hooks/use-upsell-combo";
import { AlineacionBalanceoIcon } from "@/components/ui/AlineacionBalanceoIcon";
import { InstallmentCalculator } from "@/components/ui/InstallmentCalculator";
import { goToWhatsApp } from "@/lib/gtag";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export type QuoteProduct = { id: string; label: string; price: number; imageUrl: string | null };
type QuoteItem = { product: QuoteProduct; quantity: number };

type SearchApiResult = {
  type: "tire" | "accessory";
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  imageUrl: string | null;
  enStock: boolean;
};

/**
 * Cotizador de neumáticos: buscador liviano (pega a /api/search, la misma
 * búsqueda "inteligente" del resto del sitio — entiende medidas escritas
 * pegadas y en cualquier orden, ver searchCatalog) en vez de recibir el
 * catálogo entero como prop, que en la ficha de producto se repetiría en
 * cada página.
 *
 * `initialProduct` precarga un ítem — se usa para embeber el cotizador en
 * la ficha de producto con esa medida ya agregada.
 */
export type CotizadorHandle = {
  /** Expande el cotizador (si está colapsado) y deja cargado únicamente
      `initialProduct` con 1 unidad — para el botón "Calcular cuotas" de
      PaymentMethodsSection, que quiere ver el precio de 1 sola cubierta, no
      el juego de 4 que carga por defecto al embeber el cotizador. */
  openConUnaUnidad: () => void;
};

export const CotizadorClient = forwardRef<CotizadorHandle, { initialProduct?: QuoteProduct; compact?: boolean }>(
  function CotizadorClient({ initialProduct, compact = false }, ref) {
  const { selectedBranch } = useBranch();
  // En Córdoba (Argüello) se dice "alineado y balanceado"; "alineación y
  // balanceo" es como se lo llama en Buenos Aires. El nombre del servicio en
  // el POS (combo.nombre) queda fijo con una sola forma, así que la variante
  // regional se resuelve acá según la sucursal elegida, no en el dato.
  const terminoAlineacion = selectedBranch.id === "arguello" ? "alineado + balanceado" : "alineación + balanceo";
  const combo = useUpsellCombo();
  // Colapsado por defecto cuando está embebido en la ficha de producto, para
  // no ocupar espacio si nadie lo va a usar; en /cotizador (compact=false) va
  // siempre expandido, no tiene sentido colapsar la página entera.
  const [expanded, setExpanded] = useState(!compact);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<QuoteProduct[]>([]);
  const [items, setItems] = useState<QuoteItem[]>(
    initialProduct ? [{ product: initialProduct, quantity: 4 }] : []
  );
  const [includeCombo, setIncludeCombo] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    openConUnaUnidad() {
      if (initialProduct) setItems([{ product: initialProduct, quantity: 1 }]);
      setExpanded(true);
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  }));

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      const clear = () => setResults([]);
      clear();
      return;
    }
    let cancelado = false;
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { results?: SearchApiResult[] } | null) => {
          if (cancelado || !data?.results) return;
          const productos: QuoteProduct[] = data.results
            .filter((r) => r.type === "tire" && r.enStock)
            .map((r) => ({ id: r.id, label: `${r.subtitle} ${r.title}`, price: r.price, imageUrl: r.imageUrl }));
          setResults(productos);
        })
        .catch(() => {});
    }, 250);
    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [query]);

  function addProduct(product: QuoteProduct, quantity = 4) {
    setItems((prev) => {
      if (prev.some((it) => it.product.id === product.id)) return prev;
      return [...prev, { product, quantity }];
    });
    setQuery("");
    setIsOpen(false);
  }

  // Antes bajar el − a 0 borraba el ítem sin avisar — quedaba raro tocar el
  // stepper y que desaparezca la fila entera. Ahora el mínimo es 1: para
  // sacar el ítem hay que usar el botón "Quitar", explícito.
  function updateQuantity(productId: string, quantity: number) {
    const clamped = Math.min(8, Math.max(1, quantity));
    setItems((prev) => prev.map((it) => (it.product.id === productId ? { ...it, quantity: clamped } : it)));
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
      (it) => `• ${it.quantity} x ${it.product.label} — ${formatPrice(it.product.price * it.quantity)}`
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
    <div ref={containerRef} className={compact ? "space-y-4" : "space-y-6"}>
      {compact && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="-m-2 flex min-h-11 w-[calc(100%+1rem)] items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50"
          aria-expanded={expanded}
        >
          <h2 className="text-xs font-black uppercase tracking-wide text-navy-900">Armá tu presupuesto</h2>
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {expanded && (
      <>
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
          placeholder="Buscá por marca, modelo o medida, ej: Grenlander, 205 55 16..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-navy-500/10"
        />

        {isOpen && query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-100 bg-white py-1 shadow-2xl">
            {results.length > 0 ? (
              results.map((p) => (
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
                    <span className="block truncate font-bold text-navy-900">{p.label}</span>
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
                  <p className="line-clamp-2 text-sm font-bold leading-snug text-navy-900">{product.label}</p>
                  <p className="mt-1 text-sm font-black text-red-600">{formatPrice(product.price)}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {[1, 2, 4].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => updateQuantity(product.id, preset)}
                          className={`rounded-lg border-2 px-2.5 py-1 text-xs font-black transition-colors ${quantity === preset ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                        >
                          {preset}
                        </button>
                      ))}
                      <div className="inline-flex items-center rounded-lg border border-slate-200">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= 8}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
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
                className="flex w-full items-center gap-4 bg-orange-50 p-4 text-left transition-colors hover:bg-orange-100"
              >
                <AlineacionBalanceoIcon size={36} />
                <span className="flex-1 text-sm">
                  <span className="block text-base font-black leading-snug text-navy-900">
                    ¿Sumamos {terminoAlineacion} de las 4 ruedas?
                  </span>
                  <span className="font-black text-orange-700">+{formatPrice(combo!.precio)}</span>
                </span>
                <span className="shrink-0 rounded-full bg-orange-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-orange-500/30">
                  Agregar
                </span>
              </button>
            )}
            {includeCombo && combo && (
              <div className="flex items-center gap-4 bg-emerald-50 p-4">
                <AlineacionBalanceoIcon size={36} />
                <span className="flex-1 text-sm">
                  <span className="block text-base font-black text-navy-900">
                    {terminoAlineacion.charAt(0).toUpperCase() + terminoAlineacion.slice(1)} de las 4 ruedas
                  </span>
                  <span className="font-black text-emerald-700">+{formatPrice(combo.precio)}</span>
                </span>
                <button onClick={() => setIncludeCombo(false)} className="shrink-0 text-xs font-bold text-slate-400 hover:text-red-600">
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
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3.5 text-center text-sm font-black leading-snug text-white transition-colors hover:bg-[#1ebe57] sm:text-base"
          >
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="min-w-0">Compartir presupuesto por WhatsApp</span>
          </button>
        </div>
      )}

      {hasItems && <InstallmentCalculator basePrice={total} />}
      </>
      )}
    </div>
  );
});
