import type { Metadata } from "next";
import { AccessoryCard } from "@/components/ui/AccessoryCard";
import { CompatibleTuercaBanner } from "@/components/ui/CompatibleTuercaBanner";
import { getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tuercas antirrobo para llantas — auto y camioneta",
  description:
    "Tuercas antirrobo para auto y camioneta, con juego de llave codificada. Colocación sin cargo en el local de Córdoba y envío a todo el país.",
  alternates: canonical("/tuercas-antirrobo"),
};

export default async function TuercasAntirroboPage() {
  const accesorios = await getAccesoriosDesdePOS(await getSelectedBranchSlug());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-1">Tuercas Antirrobo</h1>
      <p className="text-slate-500 mb-6">Protegé tus llantas. Colocación sin cargo en nuestra sucursal.</p>

      <CompatibleTuercaBanner accesorios={accesorios} />

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
