import React from 'react';
import { getProductosDesdePOS } from '@/lib/pos-api';
import { SortedProductGrid } from '@/components/ui/SortedProductGrid';
import type { TireSize } from '@/lib/types';
import type { VehicleTireProfile } from '@/lib/vehicles';
import Link from 'next/link';
import { peersByGroup } from '@/lib/best-price';

interface CatalogWidgetProps {
  size?: TireSize;
  /** Filtra por el código real del flanco, ej. 86T. Se puede combinar con medida. */
  loadIndex?: string;
  speedRating?: string;
  /** Compatibilidad estructural cuando el widget se usa desde una ficha de vehículo. */
  vehicleProfile?: VehicleTireProfile;
  title?: string;
  limit?: number;
  branch?: string;
}

export async function CatalogWidget({ size, loadIndex, speedRating, vehicleProfile, title, limit = 4, branch = 'arguello' }: CatalogWidgetProps) {
  const allProducts = await getProductosDesdePOS(branch);
  
  if (!allProducts) return null;

  let filtered = allProducts.filter(p => p.enStock);

  if (size) {
    filtered = filtered.filter(p => 
      p.size.width === size.width && 
      p.size.profile === size.profile && 
      p.size.rim === size.rim
    );
  }

  if (loadIndex) {
    filtered = filtered.filter((p) => p.loadIndex === loadIndex);
  }

  if (speedRating) {
    filtered = filtered.filter((p) => p.speedRating === speedRating);
  }

  // Igual medida no equivale a igual aplicación: una cubierta C trabaja con
  // presiones y carga distintas. Las pickups pueden usar A/T, los autos de
  // calle no, y los furgones necesitan la construcción comercial.
  if (vehicleProfile === "commercial") {
    filtered = filtered.filter((p) => p.isCarga);
  } else if (vehicleProfile === "pickup") {
    filtered = filtered.filter((p) => !p.isCarga);
  } else if (vehicleProfile === "passenger") {
    filtered = filtered.filter((p) => !p.isCarga && !p.isAT);
  }

  // Sort by price ascending, or keep some variety
  filtered.sort((a, b) => a.price - b.price);

  const displayProducts = filtered.slice(0, limit);
  const peers = peersByGroup(allProducts);

  if (displayProducts.length === 0) {
    return null; // Don't show the widget if no stock
  }

  return (
    <div className="my-10 bg-slate-50 p-6 rounded-2xl border border-slate-100 not-prose [&_a]:!no-underline">
      {title && <h3 className="text-2xl font-black text-navy-900 mb-6">{title}</h3>}
      <SortedProductGrid
        className="grid grid-cols-2 gap-3 sm:gap-4"
        items={displayProducts.map((p) => ({ product: p, peers: peers.get(p.id) }))}
      />
      {size && (
        <div className="mt-6 text-center">
          <Link href={`/neumaticos/${size.width}-${size.profile}-r${size.rim}`} className="text-sm font-bold text-navy-700 hover:text-navy-900 underline underline-offset-4">
            Ver todas las opciones en {size.width}/{size.profile} R{size.rim} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
