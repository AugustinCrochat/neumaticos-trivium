"use client";

import Image from "next/image";
import { useState } from "react";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import type { TireProduct } from "@/lib/types";
import { AddToCartModal } from "@/components/ui/AddToCartModal";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/config";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

// Diámetro en mm: rodado en pulgadas * 25.4 + 2 * (ancho * perfil / 100)
function outerDiameterMm(size: { width: number; profile: number; rim: number }): number {
  return size.rim * 25.4 + 2 * (size.width * (size.profile / 100));
}

function diameterDiffPercent(
  a: { width: number; profile: number; rim: number },
  b: { width: number; profile: number; rim: number }
): number {
  const da = outerDiameterMm(a);
  const db = outerDiameterMm(b);
  return ((da - db) / db) * 100;
}

function formatSize(size: { width: number; profile: number; rim: number }): string {
  return `${size.width}/${size.profile} R${size.rim}`;
}

export function ProductPageClient({ product }: { product: TireProduct }) {
  const { selectedBranch, openModal } = useBranch();
  const { selectedVehicle } = useVehicle();
  const [showModal, setShowModal] = useState(false);

  const waText = encodeURIComponent(
    `Hola, quiero consultar por el neumático ${product.brand} ${product.model} ${product.size.width}/${product.size.profile} R${product.size.rim} (SKU: ${product.id})`
  );

  // Convertimos la medida del vehículo a tipo TireSize
  const vehicleSize = selectedVehicle?.size ? {
    width: Number(selectedVehicle.size.w),
    profile: Number(selectedVehicle.size.p),
    rim: Number(selectedVehicle.size.r),
  } : null;

  const isExactMatch = vehicleSize && 
    vehicleSize.width === product.size.width &&
    vehicleSize.profile === product.size.profile &&
    vehicleSize.rim === product.size.rim;

  const diffPercent = vehicleSize ? diameterDiffPercent(product.size, vehicleSize) : 0;
  const isCompatible = vehicleSize && Math.abs(diffPercent) <= 3;

  const getBenefits = () => {
    if (!vehicleSize) return [];
    const benefits: string[] = [];

    // Ancho
    if (product.size.width > vehicleSize.width) {
      benefits.push(
        `Al ser más ancho (${product.size.width} mm vs ${vehicleSize.width} mm), ofrece mejor adherencia al asfalto, mayor estabilidad lateral y menor distancia de frenado.`
      );
    } else if (product.size.width < vehicleSize.width) {
      benefits.push(
        `Al ser más angosto (${product.size.width} mm vs ${vehicleSize.width} mm), reduce el coeficiente de fricción (ahorrando combustible) y disminuye el riesgo de aquaplaning en lluvia.`
      );
    }

    // Perfil
    if (product.size.profile < vehicleSize.profile) {
      benefits.push(
        `Con un perfil más bajo (${product.size.profile}% vs ${vehicleSize.profile}%), la dirección se siente más deportiva, firme y directa en curvas.`
      );
    } else if (product.size.profile > vehicleSize.profile) {
      benefits.push(
        `Con un perfil más alto (${product.size.profile}% vs ${vehicleSize.profile}%), la cubierta tiene mayor capacidad de amortiguación, haciendo el andar más suave frente a baches.`
      );
    }

    // Rodado
    if (product.size.rim !== vehicleSize.rim) {
      benefits.push(
        `Ten en cuenta que esta medida requiere llantas rodado R${product.size.rim} (tu llanta original es rodado R${vehicleSize.rim}).`
      );
    }

    return benefits;
  };

  const benefits = getBenefits();

  return (
    <div className="mt-6 flex flex-col gap-3">
      {/* Módulo interactivo de Compatibilidad: solo se muestra si ya hay un
          vehículo elegido (persistido de una visita anterior); no invita a
          elegir uno acá. */}
      {selectedVehicle && (
      <div className="mb-2">
        {isExactMatch ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-black text-emerald-950 leading-none">¡Medida Original Confirmada!</p>
              <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
                Este neumático es en la medida recomendada de fábrica para tu <span className="font-bold">{selectedVehicle.marca} {selectedVehicle.modelo}</span>{[selectedVehicle.size?.generation, selectedVehicle.size?.version].filter(Boolean).length > 0 ? ` (${[selectedVehicle.size?.generation, selectedVehicle.size?.version].filter(Boolean).join(" — ")})` : ""}.
              </p>
            </div>
          </div>
        ) : isCompatible ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-orange-950 leading-none">Medida Equivalente Compatible</p>
                <p className="text-xs text-orange-850 mt-1.5 leading-relaxed">
                  Es una alternativa segura para tu <span className="font-bold">{selectedVehicle.marca} {selectedVehicle.modelo}</span> (original: {formatSize(vehicleSize!)}).
                </p>
                <p className="text-[10px] text-orange-700 font-medium mt-1">
                  Variación de diámetro: {diffPercent > 0 ? "+" : ""}{diffPercent.toFixed(1)}% (el límite tolerado es ±3%).
                </p>
              </div>
            </div>
            {benefits.length > 0 && (
              <details className="pt-2.5 border-t border-orange-200/50 group">
                <summary className="text-[10px] font-black text-orange-900 uppercase tracking-wider cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
                  Efectos de esta medida en tu auto
                  <svg className="w-3.5 h-3.5 text-orange-600 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <ul className="space-y-1.5 mt-3">
                  {benefits.map((b, idx) => (
                    <li key={idx} className="text-xs text-orange-800 flex items-start gap-1.5 leading-normal">
                      <span className="text-orange-500 shrink-0 mt-1">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ) : null}
      </div>
      )}

      <button onClick={() => setShowModal(true)} disabled={!product.enStock} className="flex items-center justify-center gap-2 bg-[#FFE600] hover:bg-[#f5dc00] disabled:bg-slate-300 disabled:text-white text-navy-900 font-black py-3 rounded-xl text-base transition-colors cursor-pointer">
        {product.enStock ? (
          <>
            Comprar ahora
            <Image src="/images/mercadopago-logo.svg" alt="Mercado Pago" width={180} height={45} className="h-6 w-auto" />
          </>
        ) : (
          "Sin stock"
        )}
      </button>
      {showModal && <AddToCartModal product={product} onClose={() => setShowModal(false)} />}
      <a
        href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-3 rounded-xl text-base transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Consultar en {selectedBranch.shortName}
      </a>

      <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden bg-white">
        <div className="flex items-start gap-3 p-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-navy-900 text-sm leading-snug">Retiro gratis en Sucursal {selectedBranch.shortName}</p>
            {product.enStock ? (
              <p className="text-xs font-bold text-emerald-600 mt-0.5">Retiro el mismo día</p>
            ) : (
              <p className="text-xs font-bold text-red-600 mt-0.5">Sin stock para retiro</p>
            )}
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{selectedBranch.address}, {selectedBranch.city} · {selectedBranch.hours}</p>
            <button
              onClick={() => openModal()}
              className="text-xs text-navy-600 hover:text-navy-900 font-semibold underline mt-1.5 inline-block"
            >
              Consultar disponibilidad en otras sucursales
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-600 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h1m9 0h4m-4 0H7m9 0V9h4l3 4v3h-2m-9-6h6" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-navy-900 text-sm leading-snug">Envío a todo el país</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Gratis desde {formatPrice(FREE_SHIPPING_THRESHOLD)} de compra, o {formatPrice(SHIPPING_FLAT_RATE)} fijos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-600 shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
              <circle cx="328" cy="424" r="8" />
              <circle cx="296" cy="424" r="8" />
              <circle cx="264" cy="424" r="8" />
              <path d="m 496,432 h -96 v -64 h 16 v -48 h -24 c 0,-5.826 -1.573,-11.289 -4.305,-16 H 400 c 13.233,0 24,-10.767 24,-24 v -9.376 c 9.311,-3.303 16,-12.195 16,-22.624 v -32 c 0,-13.234 -10.766,-24 -24,-24 H 304 c -13.234,0 -24,10.766 -24,24 v 32 c 0,10.429 6.689,19.321 16,22.624 V 280 c 0,13.233 10.767,24 24,24 h 12.305 C 329.573,308.711 328,314.174 328,320 H 219.314 L 144,244.687 V 208 h 32 v -64 h -32 v -32 h 192 v 16 h -16 v 48 h 80 V 128 H 384 V 80 h 16 V 32 H 384 V 0 H 336 V 32 H 288 V 48 H 144 V 32 H 128 V 0 H 80 V 32 H 64 V 272 H 40 C 17.944,272 0,289.944 0,312 v 48 c 0,22.056 17.944,40 40,40 h 24 v 96 h 336 v -16 h 96 z M 416,256 h -12.686 l -16,-16 H 424 v 8 c 0,4.411 -3.589,8 -8,8 z m -112,0 c -4.411,0 -8,-3.589 -8,-8 v -8 h 20.686 l 16,16 z m 35.314,-32 16,-16 h 25.373 l -16,16 z m 16,32 -16,-16 h 25.372 l 16,16 z M 424,216 v 8 h -36.686 l 16,-16 H 416 c 4.411,0 8,3.589 8,8 z m -120,-8 h 28.686 l -16,16 H 296 v -8 c 0,-4.411 3.589,-8 8,-8 z m 8,72 v -8 h 96 v 8 c 0,4.411 -3.589,8 -8,8 h -80 c -4.411,0 -8,-3.589 -8,-8 z m 48,24 c 8.822,0 16,7.178 16,16 h -32 c 0,-8.822 7.178,-16 16,-16 z m 40,32 v 16 H 64 v -16 z m -288,32 h 240 v 80 H 112 Z m 84.686,-48 H 144 V 267.314 Z M 160,160 v 32 h -16 v -32 z m 224,0 h -48 v -16 h 48 z M 368,128 H 352 V 80 h 16 z M 352,16 h 16 v 16 h -16 z m -48,32 h 80 v 16 h -80 z m -16,16 v 16 h 48 V 96 H 144 V 64 Z M 96,16 h 16 V 32 H 96 Z M 80,48 h 48 V 320 H 80 V 288 H 96 V 272 H 80 Z M 40,384 C 26.767,384 16,373.233 16,360 v -48 c 0,-13.233 10.767,-24 24,-24 h 24 v 32 H 48 v 48 h 16 v 16 z m 40,96 V 368 h 16 v 96 h 272 v -96 h 16 v 112 z m 400,-16 h -80 v -16 h 80 z" />
            </svg>
          </div>
          <p className="font-bold text-navy-900 text-sm leading-snug">Colocación y válvulas sin cargo</p>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-600 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <p className="font-bold text-navy-900 text-sm leading-snug">1 año de garantía de fábrica</p>
        </div>
      </div>
    </div>
  );
}
