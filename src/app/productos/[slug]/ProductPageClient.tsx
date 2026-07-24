"use client";

import { useState } from "react";
import { useBranch } from "@/contexts/branch-context";
import type { TireProduct } from "@/lib/types";
import { AddToCartModal } from "@/components/ui/AddToCartModal";

export function ProductPageClient({ product }: { product: TireProduct }) {
  const { selectedBranch } = useBranch();
  const [showModal, setShowModal] = useState(false);

  const waText = encodeURIComponent(
    `Hola, quiero consultar por el neumático ${product.brand} ${product.model} ${product.size.width}/${product.size.profile} R${product.size.rim} (SKU: ${product.id})`
  );

  return (
    <div className="mt-6 flex flex-col gap-3">
      <button onClick={() => setShowModal(true)} disabled={!product.enStock} className="flex items-center justify-center gap-2 bg-[#FFE600] hover:bg-[#f5dc00] disabled:bg-slate-300 disabled:text-white text-navy-900 font-black py-3 rounded-xl text-base transition-colors">
        {product.enStock ? "Comprar ahora" : "Sin stock"}
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
        <div className="flex items-center gap-3 p-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-navy-900 text-sm leading-snug">Retiro gratis en Sucursal {selectedBranch.shortName}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{selectedBranch.address}, {selectedBranch.city} · {selectedBranch.hours}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-600 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
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
