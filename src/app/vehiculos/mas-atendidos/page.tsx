import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { vehiclePhoto } from "@/lib/vehicle-photos";
import { VENTAS_MODELO, VENTAS_DATOS_AL } from "@/lib/ventas-modelo";
import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug } from "@/lib/tire-sizes";
import { MarcaLogo } from "@/components/ui/MarcaLogo";
import { JsonLd } from "@/components/seo/JsonLd";
import { canonical, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Los autos y las medidas de neumáticos que más cambiamos en Córdoba",
  description: `Ranking real de nuestro taller de Argüello: qué autos y camionetas llegan más a cambiar neumáticos y qué medidas se llevan, con datos al ${VENTAS_DATOS_AL}.`,
  alternates: canonical("/vehiculos/mas-atendidos"),
};

const prioritarias = new Map(MEDIDAS_PRIORITARIAS.map((s) => [formatSize(s), sizeSlug(s)]));

export default function MasAtendidosPage() {
  const modelos = Object.entries(VENTAS_MODELO)
    .map(([name, d]) => ({ name, ...d, v: POPULAR_VEHICLES.find((x) => `${x.brand} ${x.model}` === name) }))
    .filter((m) => m.v)
    .sort((a, b) => b.n - a.n);
  const total = modelos.reduce((a, m) => a + m.n, 0);

  const porMedida = new Map<string, number>();
  for (const m of modelos) for (const [med, u] of m.top) porMedida.set(med, (porMedida.get(med) ?? 0) + u);
  const medidas = [...porMedida.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Neumáticos por vehículo", path: "/vehiculos" },
          { name: "Los más atendidos", path: "/vehiculos/mas-atendidos" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(modelos.map((m) => ({ name: `Neumáticos para ${m.name}`, path: `/vehiculos/${vehicleSlug(m.v!.brand, m.v!.model)}` })))}
      />
      <div className="bg-black px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Qué autos y qué medidas cambiamos más</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Ranking real de nuestro taller de Argüello (Córdoba): {total} neumáticos colocados en {modelos.length} modelos, con datos al {VENTAS_DATOS_AL}.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 pt-10">
        <h2 className="mb-2 text-2xl font-black text-black">Las medidas que más se llevan</h2>
        <p className="mb-4 text-slate-600">
          Suma de lo que colocamos en estos {modelos.length} modelos. Es lo que eligió el cliente, que no siempre coincide con la medida de fábrica.
        </p>
        <ol className="mb-12 grid gap-2 sm:grid-cols-2">
          {medidas.map(([med, u], i) => {
            const slug = prioritarias.get(med);
            return (
              <li key={med} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                <span className="w-6 text-lg font-black text-orange-600">{i + 1}</span>
                {slug ? (
                  <Link href={`/neumaticos/${slug}`} className="font-bold text-black hover:text-orange-600">{med}</Link>
                ) : (
                  <span className="font-bold text-black">{med}</span>
                )}
                <span className="ml-auto text-sm text-slate-500">{u} u.</span>
              </li>
            );
          })}
        </ol>
        <h2 className="mb-2 text-2xl font-black text-black">Los autos que más atendemos</h2>
        <p className="mb-4 text-slate-600">Solo modelos con 20 o más neumáticos colocados. Tocá uno para ver su medida original y qué medidas se llevan.</p>
        <ol className="space-y-2">
          {modelos.map((m, i) => {
            const slug = vehicleSlug(m.v!.brand, m.v!.model);
            const foto = vehiclePhoto(slug);
            const [med, u] = m.top[0];
            return (
              <li key={m.name}>
                <Link href={`/vehiculos/${slug}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:border-orange-500">
                  <span className="w-7 text-center text-lg font-black text-orange-600">{i + 1}</span>
                  <div className="flex h-14 w-24 shrink-0 items-center justify-center">
                    {foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={foto} alt={m.name} width={1000} height={560} loading="lazy" className="max-h-full w-auto object-contain" />
                    ) : (
                      <MarcaLogo brand={m.v!.brand} className="h-10 w-10" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-black">{m.name}</p>
                    <p className="text-sm text-slate-600">
                      {m.n} neumáticos · la más elegida: {med} ({Math.round((u / m.n) * 100)}%)
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
