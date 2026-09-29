import React from 'react';
import { Volume2, Droplets, Fuel } from 'lucide-react';

export interface ProductBlockProps {
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  decibels?: number;
  wetGrip?: string; // e.g., 'A', 'B', 'C'
  fuelEfficiency?: string; // e.g., 'A', 'B', 'C'
  brand?: string;
}

export function ProductBlock({
  title,
  description,
  imageUrl,
  price,
  decibels,
  wetGrip,
  fuelEfficiency,
  brand
}: ProductBlockProps) {
  return (
    <div className="flex flex-col md:flex-row border rounded-xl overflow-hidden shadow-sm bg-white my-8 hover:shadow-md transition-shadow">
      <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-4">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-auto object-contain max-h-48" />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">Sin imagen</span>
          </div>
        )}
      </div>
      
      <div className="p-6 md:w-2/3 flex flex-col justify-between">
        <div>
          {brand && <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{brand}</span>}
          <h3 className="text-xl font-bold mt-1 text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t pt-4">
          <div className="flex gap-4">
            {decibels && (
              <div className="flex items-center gap-1 text-gray-700 bg-gray-50 px-2 py-1 rounded">
                <Volume2 className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{decibels} dB</span>
              </div>
            )}
            {wetGrip && (
              <div className="flex items-center gap-1 text-gray-700 bg-gray-50 px-2 py-1 rounded" title="Agarre en mojado">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{wetGrip}</span>
              </div>
            )}
            {fuelEfficiency && (
              <div className="flex items-center gap-1 text-gray-700 bg-gray-50 px-2 py-1 rounded" title="Eficiencia de combustible">
                <Fuel className="w-4 h-4 text-green-500" />
                <span className="font-semibold">{fuelEfficiency}</span>
              </div>
            )}
          </div>
          
          {price && (
            <div className="text-lg font-bold text-gray-900">
              ${price.toLocaleString('es-AR')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
