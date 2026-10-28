import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { vehiclePhoto } from "@/lib/vehicle-photos";
import { marcaSlug } from "@/lib/marcas-autos";
import { MarcaLogo } from "@/components/ui/MarcaLogo";
import { JsonLd } from "@/components/seo/JsonLd";
import { canonical, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Neumáticos para todos los autos y camionetas: ${POPULAR_VEHICLES.length} modelos con su medida`,
  description:
    "Catálogo de todos los autos, pickups y utilitarios que se venden y circulan en Argentina, por marca, con la medida de neumático original de cada modelo y stock real en Córdoba.",
  alternates: canonical("/vehiculos/todos"),
};

const medidas = (v: (typeof POPULAR_VEHICLES)[number]) => [...new Set(v.sizes.map((s) => `${s.w}/${s.p} R${s.r}`))];

export default function TodosLosVehiculosPage() {
  const porMarca = new Map<string, typeof POPULAR_VEHICLES>();
  for (const v of POPULAR_VEHICLES) porMarca.set(v.brand, [...(porMarca.get(v.brand) ?? []), v]);
  const marcas = [...porMarca.keys()].sort((a, b) => a.localeCompare(b, "es"));

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Neumáticos por vehículo", path: "/vehiculos" },
          { name: "Todos los modelos", path: "/vehiculos/todos" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          POPULAR_VEHICLES.map((v) => ({ name: `Neumáticos para ${v.brand} ${v.model}`, path: `/vehiculos/${vehicleSlug(v.brand, v.model)}` }))
        )}
      />
      <div className="bg-black px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Todos los autos y camionetas</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            {POPULAR_VEHICLES.length} modelos de {marcas.length} marcas con la medida de neumático original. Tocá el tuyo para ver las versiones, el stock y el precio.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <nav aria-label="Marcas" className="mb-10 flex flex-wrap gap-2">
          {marcas.map((m) => (
            <a key={m} href={`#${marcaSlug(m)}`} className="rounded-full bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-orange-600">
              {m}
            </a>
          ))}
        </nav>
        {marcas.map((marca) => (
          <section key={marca} id={marcaSlug(marca)} className="mb-12 scroll-mt-24">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-300 pb-2">
              <h2 className="flex items-center gap-3 text-2xl font-black text-black">
                <MarcaLogo brand={marca} className="h-9 w-9" />
                Neumáticos para {marca}
              </h2>
              <Link href={`/vehiculos/marca/${marcaSlug(marca)}`} className="shrink-0 text-sm font-semibold text-orange-600 hover:underline">
                Página de {marca} →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {porMarca.get(marca)!.map((v) => {
                const slug = vehicleSlug(v.brand, v.model);
                const foto = vehiclePhoto(slug);
                const ms = medidas(v);
                return (
                  <Link key={slug} href={`/vehiculos/${slug}`} className="rounded-lg border border-slate-200 bg-white p-3 hover:border-orange-500">
                    <div className="flex h-24 items-center justify-center">
                      {foto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={foto} alt={`${v.brand} ${v.model}`} width={1000} height={560} loading="lazy" className="max-h-full w-auto object-contain" />
                      ) : (
                        <MarcaLogo brand={v.brand} className="h-14 w-14 opacity-60" />
                      )}
                    </div>
                    <p className="mt-2 truncate text-sm font-bold text-black">{v.brand} {v.model}</p>
                    <p className="truncate text-xs text-slate-600">{ms.slice(0, 3).join(" · ")}{ms.length > 3 ? ` · +${ms.length - 3}` : ""}</p>
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
