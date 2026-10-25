"use client";

import { useVehicle } from "@/contexts/vehicle-context";
import type { TireProduct } from "@/lib/types";
import { diameterDiffPercent, formatSize } from "@/lib/tire-sizes";

/**
 * Aviso de compatibilidad con el vehículo elegido (persistido de una visita
 * anterior). Va en la descripción larga, antes de la lista de modelos
 * compatibles; si no hay vehículo elegido no muestra nada.
 */
export function CompatibilidadVehiculo({ product }: { product: TireProduct }) {
  const { selectedVehicle } = useVehicle();
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
  const isCompatible = vehicleSize && Math.round(Math.abs(diffPercent) * 10) / 10 <= 3;

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

  if (!selectedVehicle) return null;

  return (
    <div className="mt-10">
      {/* Módulo interactivo de Compatibilidad: solo se muestra si ya hay un
          vehículo elegido (persistido de una visita anterior); no invita a
          elegir uno acá. */}
      <div>
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
        ) : vehicleSize ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-0.5 text-xs font-black">!</div>
            <div>
              <p className="text-sm font-black text-red-950 leading-none">Esta medida no es la de tu auto</p>
              <p className="text-xs text-red-800 mt-1.5 leading-relaxed">
                Tu <span className="font-bold">{selectedVehicle.marca} {selectedVehicle.modelo}</span> usa {formatSize(vehicleSize!)}
                {" "}y esta medida difiere {Math.abs(diffPercent).toFixed(1)}% en diámetro (el límite tolerado es ±3%). Consultanos antes de comprarla.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
