import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { vehiclePhoto } from "@/lib/vehicle-photos";

// Página interna para revisar a ojo la foto de cada modelo (no se indexa ni se enlaza).
export const metadata: Metadata = {
  title: "Revisión de fotos de vehículos",
  robots: { index: false, follow: false },
};

export default function RevisionVehiculosPage() {
  const porMarca = new Map<string, typeof POPULAR_VEHICLES>();
  for (const v of POPULAR_VEHICLES) porMarca.set(v.brand, [...(porMarca.get(v.brand) ?? []), v]);
  const marcas = [...porMarca.keys()].sort((a, b) => a.localeCompare(b, "es"));
  const sinFoto = POPULAR_VEHICLES.filter((v) => !vehiclePhoto(vehicleSlug(v.brand, v.model))).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-black text-black">Revisión de fotos de vehículos</h1>
        <p className="mb-8 mt-2 text-slate-600">
          {POPULAR_VEHICLES.length} modelos · {POPULAR_VEHICLES.length - sinFoto} con foto · {sinFoto} sin foto. El slug va debajo de cada
          modelo: es el nombre que se le pasa a scripts/vehicle-photo.py.
        </p>
        {marcas.map((marca) => (
          <section key={marca} className="mb-10">
            <h2 className="mb-3 border-b border-slate-300 pb-1 text-xl font-bold text-black">
              {marca} <span className="text-sm font-normal text-slate-500">({porMarca.get(marca)!.length})</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {porMarca.get(marca)!.map((v) => {
                const slug = vehicleSlug(v.brand, v.model);
                const foto = vehiclePhoto(slug);
                return (
                  <Link key={slug} href={`/vehiculos/${slug}`} className="rounded-lg border border-slate-200 bg-white p-2 hover:border-orange-500">
                    <div className="flex h-24 items-center justify-center rounded bg-slate-100">
                      {foto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={foto} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs font-bold text-orange-600">SIN FOTO</span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-black">{v.model}</p>
                    <p className="truncate text-[11px] text-slate-500">{slug}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
