"use client";

import { useEffect, useRef, useState } from "react";
import { useBranch } from "@/contexts/branch-context";
import { useLiveStock } from "@/contexts/live-stock-context";
import type { TireProduct } from "@/lib/types";
import { SITE_URL } from "@/lib/config";
import { isLowStock, stockLabel } from "@/lib/stock";
import { BranchStatusBadge } from "@/app/sucursales/[id]/BranchStatusBadge";
import { AlineacionBalanceoIcon } from "@/components/ui/AlineacionBalanceoIcon";
import { useUpsellCombo } from "@/hooks/use-upsell-combo";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { PaymentMethodsSection } from "@/components/ui/PaymentMethodsSection";
import { CotizadorClient, type CotizadorHandle } from "@/app/cotizador/CotizadorClient";
import { getPickupLabel, type PickupTiming } from "@/lib/branch-status";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";

// Debajo de este número el dato no suma confianza (y un "1 vendido" juega en contra).
const VENDIDOS_MINIMO = 5;

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export function ProductPageClient({ product }: { product: TireProduct }) {
  const { selectedBranch, openModal } = useBranch();
  const cotizadorRef = useRef<CotizadorHandle | null>(null);
  const combo = useUpsellCombo();
  // Si el presupuesto ya incluye el servicio, se oculta la sección que lo ofrece.
  const [comboEnPresupuesto, setComboEnPresupuesto] = useState(false);
  // En Córdoba (Argüello) se dice "alineado y balanceado"; en Buenos Aires,
  // "alineación y balanceo" (mismo criterio que el cotizador).
  const servicioLabel = selectedBranch.id === "arguello" ? "Alineado y balanceado" : "Alineación y balanceo";

  // El stock de `product` viene horneado en el HTML del último build (hasta 2 h
  // de atraso). Se corrige con el catálogo vivo (/api/catalogo-vivo, caché de
  // 60 s) que LiveStockProvider ya pidió para toda la página: antes la ficha
  // hacía además su propio /api/stock/[id] con lectura fresca al POS, la ruta
  // más pesada del sitio y una vía directa a los 1102.
  const live = useLiveStock(product.id);
  const enStock = live?.enStock ?? product.enStock ?? false;
  const stock = live?.stock ?? product.stock ?? 0;
  // Unidades vendidas en esta sucursal en los últimos 180 días (dato del POS).
  const vendidos = live?.vendidos ?? product.vendidos ?? 0;
  const price = live?.price ?? product.price;

  // Se calcula en el cliente (como BranchStatusBadge) para usar la hora real
  // y evitar mismatch de hidratación entre servidor y navegador.
  const [pickup, setPickup] = useState<PickupTiming | null>(null);
  useEffect(() => {
    const update = () => setPickup(getPickupLabel(selectedBranch));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [selectedBranch]);

  const waText = encodeURIComponent(
    `Hola, quiero consultar por el neumático ${product.model}\n${SITE_URL}/productos/${product.slug}`
  );

  return (
    <div className="mt-6 flex flex-col gap-3">
      {enStock && stock > 0 && (
        <p className={`text-xs font-bold flex items-center gap-1.5 ${isLowStock(stock) ? "text-amber-600" : "text-emerald-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLowStock(stock) ? "bg-amber-500" : "bg-emerald-500"}`} />
          {stockLabel(stock)}
        </p>
      )}

      {vendidos >= VENDIDOS_MINIMO && (
        <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {vendidos} {vendidos === 1 ? "unidad vendida" : "unidades vendidas"} en {selectedBranch.shortName} en los últimos 6 meses
        </p>
      )}

      <div className="flex gap-2">
        <WhatsAppLink
          href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-3 rounded-xl text-base transition-colors"
        >
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </WhatsAppLink>
        <a
          href={selectedBranch.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-navy-900 hover:bg-slate-50 text-navy-900 font-semibold py-3 rounded-xl text-base transition-colors"
        >
          <DirectionsIcon className="h-6 w-6 shrink-0" />
          Cómo llegar
        </a>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-600/30">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-navy-900 text-base leading-snug">Colocación y válvulas en {selectedBranch.shortName} sin cargo</p>
            {enStock ? (
              <p
                className={`text-sm font-bold mt-0.5 ${
                  pickup && !pickup.sameDay ? "text-amber-600" : "text-emerald-700"
                }`}
              >
                {pickup?.label ?? "Retiro el mismo día"} · <span className="font-semibold">atendemos por orden de llegada</span>
              </p>
            ) : (
              <p className="text-sm font-bold text-red-600 mt-0.5">Sin stock para retiro</p>
            )}
            <p className="text-xs text-slate-600 mt-1 leading-snug">{selectedBranch.address}, {selectedBranch.city} · <span className="font-bold">{selectedBranch.hours}</span></p>
            <div className="mt-2">
              <BranchStatusBadge branch={selectedBranch} />
            </div>
            {!enStock && (
              <button
                onClick={() => openModal()}
                className="text-xs text-navy-600 hover:text-navy-900 font-semibold underline mt-1.5 inline-block"
              >
                Consultar disponibilidad en otras sucursales
              </button>
            )}
          </div>
        </div>
      </div>

      <PaymentMethodsSection
        basePrice={price}
        onCalcularCuotas={() => cotizadorRef.current?.openConUnaUnidad()}
      />

      {combo && !comboEnPresupuesto && (
        <div className="flex items-center gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <AlineacionBalanceoIcon size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-base font-black leading-snug text-navy-900">{servicioLabel} de las 4 ruedas</p>
            <p className="mt-0.5 text-sm text-slate-600">
              Sumalo a tu compra y salís con el auto listo.{" "}
              <span className="font-black text-orange-700">+{formatPrice(combo.precio)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => cotizadorRef.current?.agregarCombo()}
            className="shrink-0 rounded-full bg-orange-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-orange-500/30 transition-colors hover:bg-orange-600"
          >
            Agregar
          </button>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <CotizadorClient
          ref={cotizadorRef}
          compact
          onComboChange={setComboEnPresupuesto}
          initialProduct={{ id: product.id, label: `${product.brand} ${product.model}`, price, imageUrl: product.imageUrl, brand: product.brand, model: product.model, slug: product.slug }}
        />
      </div>
    </div>
  );
}
