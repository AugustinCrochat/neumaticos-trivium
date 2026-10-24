import type { Metadata } from "next";
import Link from "next/link";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { JsonLd } from "@/components/seo/JsonLd";
import { canonical, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { marcaSlug } from "@/lib/marcas-autos";
import { MarcaLogo } from "@/components/ui/MarcaLogo";
import { MarcaBuscador } from "./MarcaBuscador";

export const metadata: Metadata = {
  title: "Neumáticos por vehículo: medidas originales de cada auto",
  description:
    "Buscá tu auto o camioneta y mirá las medidas de neumáticos originales de cada versión, con stock y precio reales. Hilux, Cronos, Onix, 208, Amarok y más.",
  alternates: canonical("/vehiculos"),
};

export default function VehiculosIndexPage() {
  const porMarca = new Map<string, typeof POPULAR_VEHICLES>();
  for (const v of POPULAR_VEHICLES) porMarca.set(v.brand, [...(porMarca.get(v.brand) ?? []), v]);
  const marcas = [...porMarca.keys()].sort((a, b) => a.localeCompare(b, "es"));

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Neumáticos por vehículo", path: "/vehiculos" }])} />
      <JsonLd
        data={itemListJsonLd(
          POPULAR_VEHICLES.map((v) => ({ name: `Neumáticos para ${v.brand} ${v.model}`, path: `/vehiculos/${vehicleSlug(v.brand, v.model)}` }))
        )}
      />
      <div className="bg-navy-950 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Neumáticos por vehículo</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Elegí tu auto o camioneta para ver la medida original de cada versión y los neumáticos que tenemos en stock.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 pt-10">
        <MarcaBuscador
          items={marcas.map((marca) => ({
            brand: marca,
            href: `/vehiculos/marca/${marcaSlug(marca)}`,
            models: porMarca.get(marca)!.map((v) => ({ label: `${v.brand} ${v.model}`, href: `/vehiculos/${vehicleSlug(v.brand, v.model)}` })),
          }))}
        />
        <h2 className="mb-6 mt-12 text-2xl font-black text-navy-900">Todos los modelos por marca</h2>
        <div className="space-y-8">
          {marcas.map((marca) => (
            <section key={marca}>
              <h3 className="mb-3 flex items-center gap-2.5 text-xl font-black text-navy-900">
                <MarcaLogo brand={marca} className="h-7 w-7" />
                <Link href={`/vehiculos/marca/${marcaSlug(marca)}`} className="hover:text-orange-600">
                  {marca}
                </Link>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {porMarca.get(marca)!.map((v) => (
                  <li key={v.model}>
                    <Link
                      href={`/vehiculos/${vehicleSlug(v.brand, v.model)}`}
                      className="inline-block rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy-900 hover:border-navy-300"
                    >
                      {v.brand} {v.model}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 text-slate-600">
          ¿No está tu modelo? Probá la{" "}
          <Link href="/calculadora-equivalencia-neumaticos" className="font-bold text-navy-700 underline underline-offset-4">
            calculadora de equivalencias
          </Link>{" "}
          o <Link href="/contacto" className="font-bold text-navy-700 underline underline-offset-4">escribinos</Link>.
        </p>
      </div>
    </main>
  );
}
