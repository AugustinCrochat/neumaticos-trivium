"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "@/components/ui/Link";
import { BRANDS } from "@/lib/data";
import { getBrandLogo } from "@/lib/brand-utils";
import { EconomicChip } from "@/components/ui/EconomicChip";
import { PriceTagIcon } from "@/components/ui/PriceTagIcon";
import { ProductCard } from "@/components/ui/ProductCard";
import { bestPriceByGroup, peersByGroup } from "@/lib/best-price";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import { useLiveStockMap } from "@/contexts/live-stock-context";
import { getCompatibleAccessory } from "@/lib/tuercas-vehiculos";
import { goToWhatsApp } from "@/lib/gtag";
import { SPEED_RATING_KMH } from "@/lib/tire-sizes";
import type { Accessory, TireProduct, TireSize, VehicleType } from "@/lib/types";

// Removed PRICE_RANGES in favor of a slider
const MAX_POSSIBLE_PRICE = 6000000; // 6 million limit for the slider
const MIN_POSSIBLE_PRICE = 50000;  // 50k min



function BrandDropdown({
  value,
  onChange,
  className = "",
  availableBrandIds,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  /** Marcas con al menos un producto para mostrar; la elegida se conserva siempre. */
  availableBrandIds: Set<string>;
}) {
  const brands = BRANDS.filter((b) => availableBrandIds.has(b.id) || b.id === value);
  const [isOpen, setIsOpen] = useState(false);
  const selectedBrand = BRANDS.find((b) => b.id === value);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-navy-300 transition-all focus:ring-2 focus:ring-navy-500/10 outline-none"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {selectedBrand ? (
            <>
              {getBrandLogo(selectedBrand.id) ? (
                <img
                  src={getBrandLogo(selectedBrand.id)!}
                  alt={selectedBrand.name}
                  className="h-7 w-auto object-contain max-w-[120px]"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <span className="truncate font-bold text-navy-900">{selectedBrand.name}</span>
              )}
            </>
          ) : (
            <span className="text-slate-500">Todas las marcas</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => {
                onChange("todos");
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
                value === "todos" ? "bg-navy-50 text-navy-700 font-bold" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="w-6 h-6 shrink-0 flex items-center justify-center text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              Todas las marcas
            </button>
            <div className="max-h-[300px] overflow-y-auto">
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onChange(b.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
                    value === b.id ? "bg-navy-50 text-navy-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {getBrandLogo(b.id) ? (
                    <img
                      src={getBrandLogo(b.id)!}
                      alt={b.name}
                      className="h-6 w-auto object-contain max-w-[100px]"
                    />
                  ) : (
                    <span className="font-medium">{b.name}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PriceSlider({
  value,
  onChange,
  max = MAX_POSSIBLE_PRICE,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  const percent = ((value - MIN_POSSIBLE_PRICE) / (max - MIN_POSSIBLE_PRICE)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Precio Máx.</span>
        <span className="text-sm font-black text-navy-900 bg-navy-50 px-2 py-0.5 rounded-md">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          }).format(value)}
        </span>
      </div>
      <div className="relative h-6 flex items-center group">
        <div className="absolute h-1.5 w-full bg-slate-100 rounded-full" />
        <div
          className="absolute h-1.5 bg-neutral-700 rounded-full"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={MIN_POSSIBLE_PRICE}
          max={max}
          step={10000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute w-5 h-5 bg-white border-2 border-navy-600 rounded-full shadow-lg group-hover:scale-110 transition-transform pointer-events-none"
          style={{ left: `clamp(0px, calc(${percent}% - 10px), calc(100% - 20px))` }}
        />
      </div>
    </div>
  );
}

// Logos de los medios de pago, a modo indicativo (el detalle de cuotas está en la ficha).
const MEDIOS_PAGO_CHICOS = [
  { logo: "visa", alt: "Visa", cls: "h-2.5" },
  { logo: "mastercard", alt: "Mastercard", cls: "h-5" },
  { logo: "mercadopago", alt: "Mercado Pago", cls: "h-6" },
  { logo: "naranja-x", alt: "Tarjeta Naranja", cls: "h-4" },
  { logo: "gocuotas", alt: "GOcuotas", cls: "h-4" },
];

function MediosDePagoChicos() {
  return (
    <div className="flex items-center justify-center gap-3 sm:justify-end" aria-label="Medios de pago">
      {MEDIOS_PAGO_CHICOS.map((m) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={m.logo} src={`/images/payments/${m.logo}.svg`} alt={m.alt} className={`${m.cls} w-auto`} loading="lazy" />
      ))}
    </div>
  );
}

function parseMedida(medida: string) {
  const parts = medida.toLowerCase().split("-");
  const width = parts[0] ? Number(parts[0]) : null;
  const profile = parts[1] ? Number(parts[1]) : null;
  const rim = parts[2] && parts[2].startsWith("r") ? Number(parts[2].substring(1)) : null;
  if (!width && !profile && !rim) return null;
  return { width, profile, rim };
}

function formatSizeLabel(size: { width: number | null; profile: number | null; rim: number | null }) {
  const parts: (string | number)[] = [];
  if (size.width) parts.push(size.width);
  if (size.profile) parts.push(size.profile);
  const label = parts.join("/");
  if (size.rim) return label ? `${label} R${size.rim}` : `R${size.rim}`;
  return label || null;
}

function tireDiameter(size: TireSize) {
  return size.rim * 25.4 + 2 * (size.width * (size.profile / 100));
}

function isExactMatch(product: TireProduct, size: { width: number | null; profile: number | null; rim: number | null }) {
  if (size.width && product.size.width !== size.width) return false;
  if (size.profile && product.size.profile !== size.profile) return false;
  if (size.rim && product.size.rim !== size.rim) return false;
  return true;
}

function isCompatibleSize(product: TireProduct, size: { width: number | null; profile: number | null; rim: number | null }) {
  if (!size.width || !size.profile || !size.rim) return false;
  if (product.size.rim !== size.rim) return false;
  if (isExactMatch(product, size)) return false;
  const searchedDiameter = tireDiameter({ width: size.width, profile: size.profile, rim: size.rim });
  const productDiameter = tireDiameter(product.size);
  return Math.abs(productDiameter - searchedDiameter) / searchedDiameter <= 0.03;
}

function diameterDifferencePercent(productSize: TireSize, searchedSize: TireSize) {
  const d = tireDiameter(searchedSize);
  return ((tireDiameter(productSize) - d) / d) * 100;
}

// Mismo rodado siempre (isCompatibleSize lo exige), así que lo que cambia
// entre la medida buscada y la compatible es ancho y/o perfil — de ahí sale
// el beneficio real para el conductor (más agarre vs. más eficiencia/confort).
function compatibilityBenefit(searchedSize: TireSize, productSize: TireSize): string {
  const widthDiff = productSize.width - searchedSize.width;
  if (widthDiff > 0) return "Más ancho: mayor superficie de contacto y agarre en curvas.";
  if (widthDiff < 0) return "Más angosto: menor resistencia a la rodadura y consumo.";

  const profileDiff = productSize.profile - searchedSize.profile;
  if (profileDiff > 0) return "Perfil más alto: mayor confort de manejo.";
  if (profileDiff < 0) return "Perfil más bajo: manejo más preciso.";
  return "Diámetro equivalente al original.";
}

function getUnitPrice(product: TireProduct) {
  const packTag = product.tags.find(t => t.toLowerCase().startsWith("pack"));
  if (packTag) {
    const match = packTag.match(/x(\d+)/i);
    if (match && match[1]) return product.price / parseInt(match[1], 10);
  }
  return product.price;
}

function CargaVelocidadSelects({
  loadOptions, speedOptions, minLoad, setMinLoad, minSpeed, setMinSpeed, className,
}: {
  loadOptions: string[];
  speedOptions: string[];
  minLoad: string;
  setMinLoad: (v: string) => void;
  minSpeed: string;
  setMinSpeed: (v: string) => void;
  className?: string;
}) {
  const sel = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700";
  return (
    <div className={`grid grid-cols-2 gap-3 ${className ?? ""}`}>
      <label className="block">
        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Índice de carga</span>
        <select value={minLoad} onChange={(e) => setMinLoad(e.target.value)} className={sel}>
          <option value="">Todos</option>
          {loadOptions.map((v) => <option key={v} value={v}>{v} o más</option>)}
        </select>
      </label>
      <label className="block">
        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Velocidad</span>
        <select value={minSpeed} onChange={(e) => setMinSpeed(e.target.value)} className={sel}>
          <option value="">Todas</option>
          {speedOptions.map((v) => <option key={v} value={v}>{v} ({SPEED_RATING_KMH[v]} km/h) o más</option>)}
        </select>
      </label>
    </div>
  );
}

type SizeFilter = { w: string; p: string; r: string };

/** Ancho / perfil / rodado sueltos: filtran el catálogo por cualquiera de los tres. */
function FilterBar({
  brandFilter, setBrandFilter,
  availableBrandIds,
  maxPrice, setMaxPrice,
  onlyEconomic, setOnlyEconomic,
  onlyCarga, setOnlyCarga,
  onlyAT, setOnlyAT,
  hasActiveFilters, clearFilters,
  maxPriceLimit, cv,
  layout,
}: {
  availableBrandIds: Set<string>;
  brandFilter: string;
  setBrandFilter: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  onlyEconomic: boolean;
  setOnlyEconomic: (v: boolean) => void;
  onlyCarga: boolean;
  setOnlyCarga: (v: boolean) => void;
  onlyAT: boolean;
  setOnlyAT: (v: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  maxPriceLimit: number;
  cv: Omit<React.ComponentProps<typeof CargaVelocidadSelects>, "className">;
  layout: "horizontal" | "vertical";
}) {
  if (layout === "horizontal") {
    return (
      <div className="flex items-center gap-4 flex-wrap bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm mb-6">
        <BrandDropdown
          value={brandFilter}
          onChange={setBrandFilter}
          availableBrandIds={availableBrandIds}
          className="w-56"
        />
        
        <div className="w-px h-8 bg-slate-100 mx-1 shrink-0" />
        
        <div className="w-64">
          <PriceSlider value={maxPrice} onChange={setMaxPrice} max={maxPriceLimit} />
        </div>

        <div className="w-px h-8 bg-slate-100 mx-1 shrink-0" />

        <CargaVelocidadSelects {...cv} className="w-80" />

        <div className="w-px h-8 bg-slate-100 mx-1 shrink-0" />

        <EconomicChip checked={onlyEconomic} onChange={setOnlyEconomic} />

        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setOnlyCarga(!onlyCarga)}
            className={`w-10 h-5 rounded-full relative transition-all duration-300 ${onlyCarga ? "bg-orange-600 shadow-inner" : "bg-slate-200"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${onlyCarga ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-navy-900 transition-colors">Solo de carga</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setOnlyAT(!onlyAT)}
            className={`w-10 h-5 rounded-full relative transition-all duration-300 ${onlyAT ? "bg-emerald-700 shadow-inner" : "bg-slate-200"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${onlyAT ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-navy-900 transition-colors">Solo A/T</span>
        </label>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="ml-auto text-sm text-navy-600 hover:text-navy-800 font-bold px-3 py-1.5 rounded-lg hover:bg-navy-50 transition-all flex items-center gap-2">
            ✕ Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-8 shadow-sm">
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Marca</p>
        <BrandDropdown value={brandFilter} onChange={setBrandFilter} availableBrandIds={availableBrandIds} className="w-full" />
      </div>

      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-6">Precio</p>
        <PriceSlider value={maxPrice} onChange={setMaxPrice} max={maxPriceLimit} />
      </div>

      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Carga y velocidad</p>
        <CargaVelocidadSelects {...cv} />
      </div>

      <div className="pt-6 border-t border-slate-100">
        <EconomicChip checked={onlyEconomic} onChange={setOnlyEconomic} />
      </div>

      <div className="pt-6 border-t border-slate-100">
        <label className="flex items-center gap-4 cursor-pointer group">
          <div onClick={() => setOnlyCarga(!onlyCarga)}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${onlyCarga ? "bg-orange-600 shadow-inner" : "bg-slate-200"}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${onlyCarga ? "translate-x-7" : "translate-x-1"}`} />
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-navy-900 transition-colors">Solo de carga</span>
        </label>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <label className="flex items-center gap-4 cursor-pointer group">
          <div onClick={() => setOnlyAT(!onlyAT)}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${onlyAT ? "bg-emerald-700 shadow-inner" : "bg-slate-200"}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${onlyAT ? "translate-x-7" : "translate-x-1"}`} />
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-navy-900 transition-colors">Solo A/T</span>
        </label>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="text-sm text-navy-600 hover:text-navy-800 font-bold w-full text-center py-3 bg-navy-50 rounded-xl transition-all">
          ✕ Limpiar filtros
        </button>
      )}
    </div>
  );
}

// Catálogo sin medida: lo más vendido arriba (últimos 180 días en la sucursal),
// y a igualdad de ventas el más barato. Sin esto el orden era el del UUID.
const porPopularidad = (a: TireProduct, b: TireProduct) =>
  (b.vendidos ?? 0) - (a.vendidos ?? 0) || getUnitPrice(a) - getUnitPrice(b);

export function ShopPage({
  showCatalogTitle = false,
  products,
  accesorios = [],
}: {
  showCatalogTitle?: boolean;
  products: TireProduct[];
  accesorios?: Accessory[];
}) {
  const { selectedBranch, hasConfirmedBranch, openModalForAction } = useBranch();
  const { selectedVehicle, openModal: openVehicleModal } = useVehicle();
  const liveStock = useLiveStockMap();
  const searchParams = useSearchParams();
  const medida = searchParams.get("medida") ?? undefined;
  const vehiculoMarca = searchParams.get("marca") ?? selectedVehicle?.marca ?? null;
  const vehiculoModelo = searchParams.get("modelo") ?? selectedVehicle?.modelo ?? null;
  const compatibleAccessory =
    vehiculoMarca && vehiculoModelo ? getCompatibleAccessory(vehiculoMarca, vehiculoModelo, accesorios) : null;

  const [brandFilter, setBrandFilter] = useState("todos");
  // Tope del slider = el neumático más caro del catálogo, redondeado a 10 mil.
  const maxPriceLimit = useMemo(() => {
    const top = Math.max(0, ...products.map((p) => p.price));
    return top > MIN_POSSIBLE_PRICE ? Math.ceil(top / 10000) * 10000 : MAX_POSSIBLE_PRICE;
  }, [products]);
  const [maxPrice, setMaxPrice] = useState(maxPriceLimit);
  const [minLoad, setMinLoad] = useState("");
  const [minSpeed, setMinSpeed] = useState("");
  const loadOptions = useMemo(
    () => [...new Set(products.map((p) => p.loadIndex).filter((v): v is string => !!v))].sort((a, b) => Number(a) - Number(b)),
    [products],
  );
  const speedOptions = useMemo(
    () => [...new Set(products.map((p) => p.speedRating).filter((v): v is string => !!v && v in SPEED_RATING_KMH))]
      .sort((a, b) => SPEED_RATING_KMH[a] - SPEED_RATING_KMH[b]),
    [products],
  );
  const economicosParam = searchParams.get("economicos") === "1";
  const [onlyEconomic, setOnlyEconomic] = useState(economicosParam);
  // El buscador puede volver a mandar a /buscar con otro valor del toggle sin
  // remontar esta página, así que el estado sigue al parámetro.
  const [prevEconomicosParam, setPrevEconomicosParam] = useState(economicosParam);
  if (prevEconomicosParam !== economicosParam) {
    setPrevEconomicosParam(economicosParam);
    setOnlyEconomic(economicosParam);
  }
  const [onlyCarga, setOnlyCarga] = useState(false);
  const [onlyAT, setOnlyAT] = useState(false);
  const [onlyCalle, setOnlyCalle] = useState(false);
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>({ w: "", p: "", r: "" });
  const [showFilters, setShowFilters] = useState(false);
  // En celular el buscador de medida va plegado arriba (ya está el botón flotante de búsqueda).
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  // Lo que se escribe en el buscador de la barra lateral filtra en vivo: con la
  // medida incompleta actúa como los filtros (por prefijo) y con la medida
  // completa muestra exactos y compatibles. Se descarta cuando la URL cambia
  // (Enter, un link, otra búsqueda), que remonta el buscador.
  const [live, setLive] = useState<SizeFilter | null>(null);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [prevMedida, setPrevMedida] = useState(medida);
  if (prevMedida !== medida) {
    setPrevMedida(medida);
    setLive(null);
    setBuscadorAbierto(false);
  }
  const liveComplete = !!live && live.w.length === 3 && live.p.length === 2 && live.r.length === 2;
  const onLiveSize = (v: SizeFilter) => {
    setLive(v);
    setSizeFilter(v.w.length === 3 && v.p.length === 2 && v.r.length === 2 ? { w: "", p: "", r: "" } : v);
    setVisibleCount(24);
  };

  const parsed = useMemo(() => {
    if (live) return liveComplete ? { width: Number(live.w), profile: Number(live.p), rim: Number(live.r) } : null;
    return medida ? parseMedida(medida) : null;
  }, [medida, live, liveComplete]);

  const { exactResults, compatibleResults, allProducts } = useMemo(() => {
    // Stock real: el vivo del POS (LiveStockProvider) si ya llegó, si no el
    // horneado en el build. Lo que se agotó desde el build va al fondo.
    const enStock = (p: TireProduct) => liveStock[p.id]?.enStock ?? !!p.enStock;
    const stockPrimero = (a: TireProduct, b: TireProduct) => Number(enStock(b)) - Number(enStock(a));
    // Al buscar una medida, el neumático de ruta (ni carga ni A/T) va primero.
    const rango = (p: TireProduct) => (p.isCarga ? 2 : p.isAT ? 1 : 0);
    const tipoPrimero = (a: TireProduct, b: TireProduct) => rango(a) - rango(b);
    const ok = (p: TireProduct) => {
      if (brandFilter !== "todos" && p.brandId !== brandFilter) return false;
      if (p.price > maxPrice) return false;
      if (onlyEconomic && !p.isEconomic) return false;
      if (minLoad && !(Number(p.loadIndex) >= Number(minLoad))) return false;
      if (minSpeed && !((p.speedRating ? SPEED_RATING_KMH[p.speedRating] ?? 0 : 0) >= SPEED_RATING_KMH[minSpeed])) return false;
      if (onlyCarga && !p.isCarga) return false;
      if (onlyAT && !p.isAT) return false;
      if (onlyCalle && (p.isCarga || p.isAT)) return false;
      // Con una medida en la URL manda esa; los campos sueltos filtran el catálogo.
      if (!parsed) {
        if (sizeFilter.w && !String(p.size.width).startsWith(sizeFilter.w)) return false;
        if (sizeFilter.p && !String(p.size.profile).startsWith(sizeFilter.p)) return false;
        if (sizeFilter.r && !String(p.size.rim).startsWith(sizeFilter.r)) return false;
      }
      return true;
    };

    if (!parsed) {
      // El catálogo de "explorar" sin medida no muestra productos sin stock —
      // ver antes que nada no vender es peor que no verlo. Pero siguen siendo
      // encontrables buscando por medida o entrando por marca (ver
      // isExactMatch/isCompatibleSize más abajo y /marcas/[slug], que no
      // filtran por stock).
      // Con stock vivo: entra lo que tenía stock en el build o lo tiene ahora,
      // y los sin stock quedan abajo de todo.
      return {
        exactResults: [],
        compatibleResults: [],
        allProducts: products
          .filter(ok)
          .filter((p) => p.enStock || enStock(p))
          .sort((a, b) => stockPrimero(a, b) || porPopularidad(a, b)),
      };
    }

    // Los resultados exactos se recortan a 5 más abajo, así que el stock
    // manda antes que el precio — si no, un modelo sin stock más barato le
    // saca el lugar a uno disponible más caro y el cliente no lo ve.
    const exact = products.filter(p => isExactMatch(p, parsed) && ok(p))
      .sort((a, b) => stockPrimero(a, b) || tipoPrimero(a, b) || getUnitPrice(a) - getUnitPrice(b));
    const compatible = products.filter(p => isCompatibleSize(p, parsed) && ok(p)).sort((a, b) => stockPrimero(a, b) || tipoPrimero(a, b));

    return { exactResults: exact, compatibleResults: compatible, allProducts: [] };
  }, [parsed, brandFilter, maxPrice, minLoad, minSpeed, onlyEconomic, onlyCarga, onlyAT, onlyCalle, sizeFilter, products, liveStock]);

  // Catálogo sin medida en la URL: si ya sabemos la medida del auto elegido,
  // recomendamos esos neumáticos arriba de todo, sin esperar a que busquen.
  const recommendedProducts = useMemo(() => {
    if (parsed || !selectedVehicle?.size) return [];
    const size = { width: Number(selectedVehicle.size.w), profile: Number(selectedVehicle.size.p), rim: Number(selectedVehicle.size.r) };
    return products
      .filter((p) => isExactMatch(p, size) && p.enStock)
      .sort((a, b) => getUnitPrice(a) - getUnitPrice(b))
      .slice(0, 3);
  }, [parsed, selectedVehicle, products]);

  const label = parsed ? formatSizeLabel(parsed) : null;
  const searchedSize: TireSize | null =
    parsed?.width && parsed.profile && parsed.rim
      ? { width: parsed.width, profile: parsed.profile, rim: parsed.rim }
      : null;
  const mejoresExactos = useMemo(() => bestPriceByGroup(exactResults), [exactResults]);
  const mejoresCatalogo = useMemo(() => bestPriceByGroup(allProducts), [allProducts]);
  const peersCatalogo = useMemo(() => peersByGroup(allProducts), [allProducts]);
  const hasActiveFilters =
    brandFilter !== "todos" || maxPrice < maxPriceLimit || !!minLoad || !!minSpeed || onlyEconomic || onlyCarga || onlyAT || onlyCalle || !!(sizeFilter.w || sizeFilter.p || sizeFilter.r);

  const handleWhatsApp = (waLabel: string | null) => {
    const waUrl = (branch: typeof selectedBranch) =>
      `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
        `Hola, no encontré neumáticos en medida ${waLabel || "específica"} en la web. ¿Tienen stock disponible?`
      )}`;
    if (hasConfirmedBranch) {
      goToWhatsApp(waUrl(selectedBranch));
    } else {
      openModalForAction((branch) => goToWhatsApp(waUrl(branch)));
    }
  };

  // Solo marcas con productos para mostrar: con medida, los que coinciden
  // con esa medida (exactos o compatibles); sin medida, los que están en stock
  // (lo único que lista el catálogo). Ignora los otros filtros a propósito
  // para que el desplegable no cambie mientras se tocan.
  const availableBrandIds = useMemo(() => {
    const visibles = parsed
      ? products.filter((p) => isExactMatch(p, parsed) || isCompatibleSize(p, parsed))
      : products.filter((p) => p.enStock);
    return new Set(visibles.map((p) => p.brandId));
  }, [parsed, products]);

  // Tipos en los que existe la medida buscada (calle, A/T, carga): si hay más
  // de uno se ofrecen botones para filtrar, sin tocar el resto de los filtros.
  const tiposDeLaMedida = useMemo(() => {
    if (!parsed) return [];
    const delaMedida = products.filter((p) => isExactMatch(p, parsed) || isCompatibleSize(p, parsed));
    const tipos: { id: "calle" | "at" | "carga"; label: string }[] = [];
    if (delaMedida.some((p) => !p.isCarga && !p.isAT)) tipos.push({ id: "calle", label: "Ruta" });
    if (delaMedida.some((p) => p.isAT)) tipos.push({ id: "at", label: "A/T" });
    if (delaMedida.some((p) => p.isCarga)) tipos.push({ id: "carga", label: "Carga" });
    return tipos;
  }, [parsed, products]);
  const tipoActivo = onlyCarga ? "carga" : onlyAT ? "at" : onlyCalle ? "calle" : "todos";
  const elegirTipo = (t: "todos" | "calle" | "at" | "carga") => {
    setOnlyCarga(t === "carga");
    setOnlyAT(t === "at");
    setOnlyCalle(t === "calle");
  };

  const filterProps = {
    brandFilter, setBrandFilter,
    availableBrandIds,
    maxPrice, setMaxPrice,
    onlyEconomic, setOnlyEconomic,
    onlyCarga, setOnlyCarga,
    onlyAT, setOnlyAT,
    hasActiveFilters,
    maxPriceLimit,
    cv: { loadOptions, speedOptions, minLoad, setMinLoad, minSpeed, setMinSpeed },
    clearFilters() {
      setSizeFilter({ w: "", p: "", r: "" });
      // Vacía también lo escrito en el buscador de la barra lateral.
      setLive(null);
      setSearchResetKey((k) => k + 1);
      setBrandFilter("todos");
      setMaxPrice(maxPriceLimit);
      setMinLoad("");
      setMinSpeed("");
      setOnlyEconomic(false);
      setOnlyCarga(false);
      setOnlyAT(false);
      setOnlyCalle(false);
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 pt-4 pb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-start">

          {/* Sidebar — search widget only */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-32 lg:self-start lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto lg:overscroll-contain">
            <button
              type="button"
              onClick={() => setBuscadorAbierto((v) => !v)}
              aria-expanded={buscadorAbierto}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-left font-bold text-navy-900 lg:hidden"
            >
              <span className="min-w-0 truncate">{label ? `Medida ${label} · cambiar` : "Buscar por medida o por mi auto"}</span>
              <svg className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${buscadorAbierto ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={buscadorAbierto ? "mt-3 lg:mt-0" : "hidden lg:block"}>
              <SizeOrVehicleSearch key={`${medida ?? "empty"}-${economicosParam}-${searchResetKey}`} compact initialMedida={medida} forceVoiceButton initialEconomicos={economicosParam} onLiveChange={onLiveSize} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Mobile: filter toggle + collapsible panel */}
            <div className="lg:hidden mb-4 flex flex-col gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full bg-white rounded-xl border border-slate-200 px-5 py-3 text-slate-700 font-bold shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>{showFilters ? "Ocultar filtros" : "Mostrar filtros"}</span>
                </div>
                <svg className={`w-5 h-5 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFilters && <FilterBar {...filterProps} layout="vertical" />}
            </div>

            {/* Desktop: horizontal filter bar */}
            <div className="hidden lg:block">
              <FilterBar {...filterProps} layout="horizontal" />
            </div>

            {/* ── Catalog mode (no medida) ── */}
            {!parsed && (showCatalogTitle || live !== null) && (
              <>
                {selectedVehicle?.size && recommendedProducts.length > 0 && (
                  <div className="mb-10 rounded-[2rem] border border-orange-100 bg-orange-50/50 p-6 md:p-8">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                      <div>
                        <p className="text-xs font-black text-orange-600 uppercase tracking-wide mb-1">Recomendado para vos</p>
                        <h2 className="text-xl font-black text-navy-900">Neumáticos para tu {selectedVehicle.marca} {selectedVehicle.modelo}</h2>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <button
                          type="button"
                          onClick={openVehicleModal}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
                        >
                          Cambiar vehículo
                        </button>
                        <Link
                          href={`/buscar?medida=${selectedVehicle.size.w}-${selectedVehicle.size.p}-r${selectedVehicle.size.r}&marca=${encodeURIComponent(selectedVehicle.marca)}&modelo=${encodeURIComponent(selectedVehicle.modelo)}`}
                          className="text-sm font-bold text-orange-700 hover:text-orange-800 underline underline-offset-4"
                        >
                          Ver medida {selectedVehicle.size.w}/{selectedVehicle.size.p} R{selectedVehicle.size.r}
                        </Link>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {recommendedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h1 className="text-3xl font-black text-navy-900 mb-1">Catálogo de Neumáticos</h1>
                    <p className="text-slate-500">
                      {allProducts.length} producto{allProducts.length !== 1 ? "s" : ""} encontrados
                    </p>
                  </div>
                  <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
                  <Link
                    href="/cotizador"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 sm:w-auto rounded-xl border-2 border-orange-500 bg-orange-50 px-4 text-sm font-black text-orange-700 transition-colors hover:bg-orange-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    Armar presupuesto
                  </Link>
                  <MediosDePagoChicos />
                  </div>
                </div>
                {allProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-500 font-medium">No hay productos con esos filtros.</p>
                    <button onClick={filterProps.clearFilters} className="mt-3 text-navy-600 hover:text-navy-800 font-semibold text-sm transition-colors">
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {allProducts.slice(0, visibleCount).map(product => (
                        <ProductCard key={product.id} product={product} isCheapest={mejoresCatalogo.has(product.id)} cheapestLabel={mejoresCatalogo.get(product.id)} peers={peersCatalogo.get(product.id)} />
                      ))}
                    </div>
                    {visibleCount < allProducts.length && (
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => setVisibleCount(prev => prev + 24)}
                          className="bg-white border-2 border-slate-200 hover:border-navy-600 text-navy-800 hover:text-navy-900 font-bold py-3 px-8 rounded-xl transition-all shadow-sm"
                        >
                          Ver más neumáticos
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── Buscar mode — no medida entered ── */}
            {!parsed && !showCatalogTitle && live === null && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-slate-400 text-lg font-medium">Ingresá una medida para buscar.</p>
              </div>
            )}

            {/* ── Tuerca antirrobo compatible con el vehículo elegido ── */}
            {parsed && compatibleAccessory && (
              <Link
                href={`/tuercas-antirrobo/${compatibleAccessory.slug}`}
                className="flex items-center gap-4 bg-white border border-slate-200 hover:border-navy-300 rounded-2xl p-4 mb-8 transition-colors"
              >
                <div className="relative w-14 h-14 bg-slate-50 rounded-xl shrink-0 overflow-hidden">
                  {compatibleAccessory.imageUrl && (
                    <Image src={compatibleAccessory.imageUrl} alt="" fill sizes="56px" className="object-contain p-1" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-orange-500 uppercase tracking-wide">También te puede interesar</p>
                  <p className="text-sm font-bold text-navy-900 truncate">
                    Tuerca antirrobo compatible con tu {vehiculoMarca} {vehiculoModelo}
                  </p>
                </div>
                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {/* ── Tipo de neumático (cuando la medida existe en más de uno) ── */}
            {parsed && tiposDeLaMedida.length > 1 && (
              <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por tipo de neumático">
                <span className="mr-1 text-xs font-black uppercase tracking-widest text-slate-500">Tipo</span>
                {[{ id: "todos" as const, label: "Todos" }, ...tiposDeLaMedida].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => elegirTipo(t.id)}
                    aria-pressed={tipoActivo === t.id}
                    className={`rounded-full border-2 px-4 py-1.5 text-sm font-black transition-colors ${tipoActivo === t.id ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* ── Search results ── */}
            {parsed && exactResults.length === 0 && (
              <div className={`mb-12 ${compatibleResults.length === 0 ? 'py-20' : ''}`}>
                <div className={`text-center ${compatibleResults.length > 0 ? 'bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 mb-10' : ''}`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-slate-300 mb-6 shadow-sm">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-800 font-black text-2xl md:text-3xl mb-3">
                    No encontramos neumáticos en medida {label}
                  </h3>
                  <p className="text-slate-500 font-medium mb-8 max-w-lg mx-auto">
                    Consultanos por WhatsApp, es posible que tengamos stock no publicado o alternativas para tu vehículo.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => handleWhatsApp(label)}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-8 rounded-2xl text-base transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Consultar por WhatsApp</span>
                    </button>
                    <Link
                      href="/catalogo"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-navy-800 border-2 border-slate-200 font-black py-4 px-8 rounded-2xl text-base transition-all active:scale-[0.98]"
                    >
                      Ver catálogo completo
                    </Link>
                  </div>
                </div>

                {compatibleResults.length > 0 && (
                  <div className="flex items-start gap-4 bg-navy-50/50 border border-navy-100 p-5 rounded-2xl mb-8">
                    <div className="mt-0.5 w-6 h-6 flex-shrink-0 text-navy-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm md:text-base text-navy-900 font-bold leading-relaxed">
                      No encontramos la medida exacta <strong>{label}</strong>. Pero hay medidas compatibles que pueden funcionar en tu vehículo manteniendo el rodado original.
                    </p>
                  </div>
                )}
              </div>
            )}

            {parsed && exactResults.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-6">
                  <h2 className="flex items-center gap-2 text-2xl font-black text-navy-900">
                    <PriceTagIcon className="h-9 w-6 shrink-0" />
                    Medida buscada
                  </h2>
                  {label && <span className="text-lg font-bold text-slate-500">{label}</span>}
                  <span className="text-sm text-slate-400 font-medium">
                    ({exactResults.length} resultado{exactResults.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {exactResults.map(product => (
                    <ProductCard key={product.id} product={product} isCheapest={mejoresExactos.has(product.id)} cheapestLabel={mejoresExactos.get(product.id)} peers={peersCatalogo.get(product.id)} />
                  ))}
                </div>
              </section>
            )}

            {parsed && compatibleResults.length > 0 && (
              <section className={exactResults.length > 0 ? "mt-16 border-t border-slate-100 pt-10" : ""}>
                <div className="mb-8 rounded-[2.5rem] border border-emerald-100 bg-emerald-50/50 p-6 md:p-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h2 className="text-2xl font-black text-emerald-950">Medidas compatibles</h2>
                        {compatibleResults.length > 5 && (
                          <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                            {compatibleResults.length} resultados
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        Estas medidas mantienen el mismo rodado y un diámetro total dentro de ±3% de la medida {label}.{" "}
                        <Link href="/calculadora-equivalencia-neumaticos" className="text-emerald-700 font-black underline decoration-2 underline-offset-4 hover:text-emerald-800 transition-colors">
                          Calculá tu equivalencia.
                        </Link>
                      </p>
                    </div>
                    {vehiculoMarca && vehiculoModelo && (
                      <div className="flex w-full shrink-0 items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 md:w-auto md:flex-col md:items-start">
                        <p className="text-sm font-bold text-emerald-950">
                          <span className="block text-xs font-black uppercase tracking-wide text-emerald-700">Tu vehículo</span>
                          {vehiculoMarca} {vehiculoModelo}
                        </p>
                        <button
                          type="button"
                          onClick={openVehicleModal}
                          className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-900 transition-colors hover:border-emerald-500 hover:bg-emerald-100"
                        >
                          Cambiar vehículo
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 p-5 bg-white/80 rounded-2xl border border-yellow-200/50 shadow-sm flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0 text-yellow-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      <strong className="text-slate-900">Importante:</strong> Para usar medidas alternativas, el vehículo debe ser de caja manual. Verificá que no toque partes del tren delantero o plásticos tras la instalación.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {compatibleResults.slice(0, 5).map(product => {
                    const diff = searchedSize ? diameterDifferencePercent(product.size, searchedSize) : null;
                    const benefit = searchedSize ? compatibilityBenefit(searchedSize, product.size) : null;
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        note={benefit}
                        imageFooter={
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-white shadow-lg shadow-emerald-900/20">
                            <span>Compatible</span>
                            {diff !== null && (
                              <span className="border-l border-white/30 pl-1.5">
                                {diff >= 0 ? "+" : ""}{diff.toFixed(1)}%
                              </span>
                            )}
                          </span>
                        }
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
