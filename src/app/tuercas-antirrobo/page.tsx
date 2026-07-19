import type { Metadata } from "next";
import { AccessoryCard } from "@/components/ui/AccessoryCard";
import { getAccesoriosDesdePOS } from "@/lib/pos-api";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tuercas Antirrobo — Trivium",
  description: "Tuercas antirrobo para tu auto o camioneta, colocación incluida en nuestra sucursal.",
};

export default async function TuercasAntirroboPage() {
  const accesorios = await getAccesoriosDesdePOS();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-1">Tuercas Antirrobo</h1>
      <p className="text-slate-500 mb-6">Protegé tus llantas. Colocación sin cargo en nuestra sucursal.</p>

      {accesorios.length === 0 ? (
        <p className="text-slate-500">No hay tuercas antirrobo disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {accesorios.map((accesorio) => (
            <AccessoryCard key={accesorio.id} accessory={accesorio} />
          ))}
        </div>
      )}
    </div>
  );
}
