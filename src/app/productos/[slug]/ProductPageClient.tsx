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
      <button onClick={() => setShowModal(true)} disabled={!product.enStock} className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-black py-3 rounded-xl text-base transition-colors">
        {product.enStock ? "Agregar al carrito" : "Sin stock"}
      </button>
      {showModal && <AddToCartModal product={product} onClose={() => setShowModal(false)} />}
      <a
        href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 rounded-xl text-base transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Consultar en {selectedBranch.shortName}
      </a>

      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-black text-navy-900 text-sm">Retiro gratis en Sucursal {selectedBranch.shortName}</p>
          <p className="text-sm text-slate-600 mt-0.5">{selectedBranch.address}, {selectedBranch.city} · {selectedBranch.hours}</p>
        </div>
      </div>
    </div>
  );
}
