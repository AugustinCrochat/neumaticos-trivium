"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";
import { useUpsellCombo } from "@/hooks/use-upsell-combo";
import { AlineacionBalanceoIcon } from "@/components/ui/AlineacionBalanceoIcon";
import { TuercaPicker } from "@/components/ui/TuercaPicker";
import { useVehicle } from "@/contexts/vehicle-context";
import { getCompatibleAccessories } from "@/lib/tuercas-vehiculos";
import type { Accessory } from "@/lib/types";
import { InstallmentCalculator, type PagoElegido } from "@/components/ui/InstallmentCalculator";
import { goToWhatsApp } from "@/lib/gtag";
import { CotizadorSelector, type MedidaDisponible } from "./CotizadorSelector";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export type QuoteProduct = {
  id: string;
  label: string;
  price: number;
  imageUrl: string | null;
  /** Para armar el ítem del carrito; sin estos no se ofrece "Comprar". */
  brand?: string;
  model?: string;
  slug?: string;
};
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
  /** Expande el cotizador y baja hasta él, sin tocar lo que ya está cargado. */
  irAlCotizador: () => void;
  /** Expande el cotizador y suma alineación + balanceo al presupuesto. */
  agregarCombo: () => void;
};

export const CotizadorClient = forwardRef<CotizadorHandle, { initialProduct?: QuoteProduct; /** Unidades del ítem precargado (4 = juego de neumáticos). */ initialQuantity?: number; compact?: boolean; /** Tuercas con foto para mostrar en la oferta de tuercas antirrobo. */ tuercasMuestra?: Accessory[]; /** Medidas y neumáticos destacados: con ellos (y sin `compact`) el cotizador es la versión guiada de /cotizador. */ medidas?: MedidaDisponible[]; destacados?: (QuoteProduct & { medida: string })[]; /** Avisa si el presupuesto incluye alineación + balanceo. */ onComboChange?: (incluido: boolean) => void }>(
  function CotizadorClient({ initialProduct, initialQuantity = 4, compact = false, tuercasMuestra = [], medidas, destacados = [], onComboChange }, ref) {
  const { selectedBranch } = useBranch();
  // En Córdoba (Argüello) se dice "alineado y balanceado"; "alineación y
  // balanceo" es como se lo llama en Buenos Aires. El nombre del servicio en
  // el POS (combo.nombre) queda fijo con una sola forma, así que la variante
  // regional se resuelve acá según la sucursal elegida, no en el dato.
  const terminoAlineacion = selectedBranch.id === "arguello" ? "alineado + balanceado" : "alineación + balanceo";
  const combo = useUpsellCombo();
  // Foto de la tuerca de la oferta: la del auto elegido si ya hay uno, sino la primera con foto.
  const { selectedVehicle } = useVehicle();
  const tuercaFoto =
    (selectedVehicle ? getCompatibleAccessories(selectedVehicle.marca, selectedVehicle.modelo, tuercasMuestra)[0] : null) ??
    tuercasMuestra[0] ??
    null;
  // Colapsado por defecto cuando está embebido en la ficha de producto, para
  // no ocupar espacio si nadie lo va a usar; en /cotizador (compact=false) va
  // siempre expandido, no tiene sentido colapsar la página entera.
  const [expanded, setExpanded] = useState(true);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<QuoteProduct[]>([]);
  const [items, setItems] = useState<QuoteItem[]>(
    initialProduct ? [{ product: initialProduct, quantity: initialQuantity }] : []
  );
  const [includeCombo, setIncludeCombo] = useState(false);
  const [tuercas, setTuercas] = useState<Accessory[]>([]);
  const [buscandoTuerca, setBuscandoTuerca] = useState(false);
  const guiado = !compact && !!medidas;
  const [hayMedida, setHayMedida] = useState(false);
  const presupuestoRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Total con el medio de pago elegido: lo reporta la calculadora y lo muestra
  // la barra fija mientras el bloque del total no está a la vista.
  const totalRef = useRef<HTMLDivElement | null>(null);
  const [pagoActual, setPagoActual] = useState<PagoElegido | null>(null);
  const [totalVisible, setTotalVisible] = useState(false);
  const onPago = useCallback((p: PagoElegido) => setPagoActual(p), []);
  const hayCalculadora = items.length > 0;
  useEffect(() => {
    const el = totalRef.current;
    if (!el || !hayCalculadora) return;
    const io = new IntersectionObserver(([e]) => setTotalVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [hayCalculadora, expanded]);
  useEffect(() => {
    onComboChange?.(includeCombo);
  }, [includeCombo, onComboChange]);

  useImperativeHandle(ref, () => ({
    openConUnaUnidad() {
      if (initialProduct) setItems([{ product: initialProduct, quantity: 1 }]);
      setExpanded(true);
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    irAlCotizador() {
      setExpanded(true);
      setTimeout(() => containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    },
    agregarCombo() {
      setIncludeCombo(true);
      setExpanded(true);
      // La tarjeta de alineado de arriba se oculta al agregarlo y el presupuesto
      // se expande: se espera al nuevo layout para frenar en el inicio de la
      // sección, sin bajar hasta el servicio agregado.
      // (El aviso al padre para ocultar la tarjeta llega un render después.)
      setTimeout(() => containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
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
            .map((r) => ({ id: r.id, label: `${r.subtitle} ${r.title}`, price: r.price, imageUrl: r.imageUrl, brand: r.subtitle, model: r.title, slug: r.slug }));
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
    if (guiado) setTimeout(() => presupuestoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
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
  const tuercasTotal = tuercas.reduce((sum, t) => sum + t.price, 0);
  const total = itemsTotal + comboTotal + tuercasTotal;
  const hasItems = items.length > 0;
  const canAddCombo = hasItems && !!combo;

  function shareByWhatsApp(pago?: PagoElegido) {
    const lineas = items.map(
      (it) => `• ${it.quantity} x ${it.product.label} — ${formatPrice(it.product.price * it.quantity)}`
    );
    if (includeCombo && combo) {
      lineas.push(`• ${combo.nombre} — ${formatPrice(combo.precio)}`);
    }
    for (const t of tuercas) lineas.push(`• ${t.nombre} — ${formatPrice(t.price)}`);
    const mensaje = [
      "Hola! Arme este presupuesto en la web y quiero coordinar:",
      "",
      ...lineas,
      "",
      `Total: ${formatPrice(total)}`,
      ...(pago?.esEfectivo ? [`Pagando en efectivo (10% de descuento): ${formatPrice(pago.total)}`] : []),
      `Sucursal: ${selectedBranch.shortName}`,
    ].join("\n");
    goToWhatsApp(`https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(mensaje)}`);
  }

  return (
    <div ref={containerRef} className={`scroll-mt-28 ${compact ? "space-y-4" : "space-y-6"}`}>
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
      {/* Buscador: desde la ficha, con el neumático ya elegido, se oculta hasta que lo quiten. */}
      {guiado && (
        <>
          <Pasos paso={hasItems ? 3 : hayMedida ? 2 : 1} />
          <CotizadorSelector
            medidas={medidas!}
            destacados={destacados}
            agregados={items.map((it) => it.product.id)}
            onAdd={(p) => addProduct(p)}
            onMedida={setHayMedida}
          />
        </>
      )}

      {!guiado && !(initialProduct && items.some((it) => it.product.id === initialProduct.id)) && (
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
      )}

      {/* Ítems agregados */}
      <div ref={presupuestoRef} id="presupuesto" className="scroll-mt-28">
      {guiado && hasItems && (
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">3</span>
          <div>
            <h2 className="text-lg font-black leading-tight text-navy-900">Tu presupuesto</h2>
            <p className="text-xs font-medium text-slate-500">Ajustá cantidades, sumá servicios y compartilo o comprá.</p>
          </div>
        </div>
      )}
      <div className="rounded-2xl border border-slate-200 bg-white">
        {!hasItems ? (
          <p className="p-6 text-center text-sm text-slate-500">
            {guiado ? "Tu presupuesto va a aparecer acá apenas agregues un neumático." : "Todavía no agregaste ningún neumático. Buscalo arriba para empezar."}
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

            <div className="flex items-baseline justify-between gap-3 bg-slate-50 px-4 py-3">
              <span className="text-sm font-bold text-slate-600">Total (precio de lista)</span>
              <span className="text-2xl font-black text-navy-900">{formatPrice(total)}</span>
            </div>

            {includeCombo && combo && (
              <div className="flex items-center gap-4 bg-emerald-50 p-4">
                <AlineacionBalanceoIcon size={36} />
                <span className="flex-1 text-sm">
                  <span className="block text-base font-black text-navy-900">
                    {terminoAlineacion.charAt(0).toUpperCase() + terminoAlineacion.slice(1)} de las 4 ruedas
                  </span>
                  <span className="font-black text-emerald-700">{formatPrice(combo.precio)}</span>
                </span>
                <button onClick={() => setIncludeCombo(false)} className="shrink-0 text-xs font-bold text-slate-400 hover:text-red-600">
                  Quitar
                </button>
              </div>
            )}
            {tuercas.map((t) => (
              <div key={t.id} className="flex items-center gap-4 bg-emerald-50 p-4">
                {t.imageUrl && (
                  <span className="relative h-14 w-14 shrink-0">
                    <Image src={t.imageUrl} alt={t.nombre} fill sizes="56px" className="object-contain" />
                  </span>
                )}
                <span className="flex-1 text-sm">
                  <span className="block text-base font-black text-navy-900">{t.nombre}</span>
                  <span className="font-black text-emerald-700">{formatPrice(t.price)}</span>
                </span>
                <button onClick={() => setTuercas((prev) => prev.filter((x) => x.id !== t.id))} className="shrink-0 text-xs font-bold text-slate-400 hover:text-red-600">
                  Quitar
                </button>
              </div>
            ))}
            {(!(tuercas.length > 0) || (canAddCombo && !includeCombo)) && (
            <div className={`grid divide-x divide-slate-100 bg-white ${canAddCombo && !includeCombo && tuercas.length === 0 ? "grid-cols-[3fr_2fr]" : "grid-cols-1"}`}>
              {canAddCombo && !includeCombo && (
                <button
                  type="button"
                  onClick={() => setIncludeCombo(true)}
                  className="flex items-stretch bg-white text-left transition-colors hover:bg-slate-50"
                >
                  <span className="flex w-16 shrink-0 items-center justify-center self-stretch bg-white">
                    <AlineacionBalanceoIcon size={36} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 py-3 pl-1.5 pr-1">
                    <span className="min-h-[2.5em] text-sm font-black leading-tight text-navy-900">
                      {selectedBranch.id === "arguello" ? "Alineado" : "Alineación"}
                      <br /><span className="whitespace-nowrap">+ 4 {selectedBranch.id === "arguello" ? "balanceado" : "balanceo"}</span>
                    </span>
                    <span className="text-sm font-black leading-none text-orange-700">{formatPrice(combo!.precio)}</span>
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white">Agregar</span>
                  </span>
                </button>
              )}
              {tuercas.length === 0 && (
              <button
                type="button"
                onClick={() => setBuscandoTuerca((v) => !v)}
                aria-expanded={buscandoTuerca}
                className="flex items-stretch bg-white text-left transition-colors hover:bg-slate-50"
              >
                <span className="relative flex w-12 shrink-0 items-center justify-center self-stretch bg-white">
                  {tuercaFoto?.imageUrl && (
                    <Image src={tuercaFoto.imageUrl} alt={tuercaFoto.nombre} fill sizes="96px" className="object-contain p-0.5" />
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 py-3 pl-1.5 pr-1">
                  <span className="min-h-[2.5em] text-xs font-black leading-tight text-navy-900">Tuercas<br />antirrobo</span>
                  {tuercaFoto && <span className="text-xs font-black leading-none text-orange-700">{formatPrice(tuercaFoto.price)}</span>}
                  <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-black text-white">{buscandoTuerca ? "Cerrar" : "Buscar"}</span>
                </span>
              </button>
              )}
            </div>
            )}
            {buscandoTuerca && tuercas.length === 0 && (
              <TuercaPicker
                agregadas={tuercas.map((t) => t.id)}
                onAdd={(a) => {
                  setTuercas((prev) => (prev.some((x) => x.id === a.id) ? prev : [...prev, a]));
                  setBuscandoTuerca(false);
                }}
              />
            )}
          </div>
        )}
      </div>
      </div>

      {hasItems && (
        <InstallmentCalculator
          basePrice={total}
          notaPrecio={`Precio con IVA incluido, retirando en ${selectedBranch.shortName}. No incluye envío.`}
          onShare={shareByWhatsApp}
          onPago={onPago}
          totalRef={totalRef}
        />
      )}
      {!compact && hasItems && !totalVisible && (
        <div className="sticky bottom-20 z-30 md:bottom-3">
          <button
            type="button"
            onClick={() => totalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-black py-3.5 pl-5 pr-20 text-left text-white shadow-2xl md:pr-5"
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold">
                {items.reduce((n, it) => n + it.quantity, 0)} neumático(s) · Total
              </span>
              <span className="block truncate text-xs font-semibold text-white/60">
                {pagoActual?.medio ? `${pagoActual.medio}${pagoActual.esEfectivo ? " · 10% OFF" : ""}` : "Elegí cómo pagar"}
              </span>
            </span>
            <span className="shrink-0 text-2xl font-black">{formatPrice(pagoActual?.total ?? total)}</span>
          </button>
        </div>
      )}
      </>
      )}
    </div>
  );
});

const PASOS = ["Medida", "Neumático", "Presupuesto", "Pagar o enviar"];

/** Indicador de pasos arriba del cotizador guiado. */
function Pasos({ paso }: { paso: number }) {
  return (
    <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Pasos del cotizador">
      {PASOS.map((nombre, i) => {
        const n = i + 1;
        const hecho = n < paso;
        const actual = n === paso;
        return (
          <li key={nombre} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                hecho ? "bg-emerald-500 text-white" : actual ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {hecho ? "✓" : n}
            </span>
            <span className={`hidden truncate text-xs font-black sm:block ${actual ? "text-navy-900" : "text-slate-400"}`}>{nombre}</span>
            {n < PASOS.length && <span className={`h-0.5 flex-1 rounded ${hecho ? "bg-emerald-400" : "bg-slate-200"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
