import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { vehiclePhoto } from "@/lib/vehicle-photos";
import { marcaSlug } from "@/lib/marcas-autos";
import { MarcaLogo } from "@/components/ui/MarcaLogo";
import { CatalogoBuscador } from "./CatalogoBuscador";
import { JsonLd } from "@/components/seo/JsonLd";
import { canonical, breadcrumbJsonLd, itemListJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Medida de neumáticos de ${POPULAR_VEHICLES.length} autos y camionetas, por modelo`,
  description:
    "¿Qué medida de neumático lleva tu auto? Listado por marca de autos, pickups y utilitarios que circulan en Argentina, con la medida original de cada modelo y stock real en Córdoba.",
  alternates: canonical("/vehiculos/todos"),
};

const FAQS = [
  {
    question: "¿Cómo sé qué medida de neumático lleva mi auto?",
    answer:
      "Mirá el flanco del neumático: tiene un código como 185/65 R15 (ancho en mm, perfil en % y rodado en pulgadas). También está en la etiqueta del marco de la puerta del conductor y en el manual. O buscá tu modelo en este catálogo.",
  },
  {
    question: "¿La medida es la misma para todas las versiones de un modelo?",
    answer:
      "No siempre. Las versiones de entrada suelen usar rodado 14, 15 o 16 y las más equipadas 17 o más. Cada ficha de modelo lista la medida por versión y año.",
  },
  {
    question: "¿Puedo poner una medida distinta a la original?",
    answer:
      "Se puede usar una medida equivalente si mantiene el diámetro total de la rueda y la capacidad de carga. Usá la calculadora de equivalencias o consultanos en el taller.",
  },
  {
    question: "¿Tienen stock y precio de la medida de mi auto?",
    answer:
      "Sí: cada ficha muestra los neumáticos disponibles en nuestras sucursales de Córdoba con precio actualizado.",
  },
];

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
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd
        data={itemListJsonLd(
          POPULAR_VEHICLES.map((v) => ({ name: `Neumáticos para ${v.brand} ${v.model}`, path: `/vehiculos/${vehicleSlug(v.brand, v.model)}` }))
        )}
      />
      <div className="bg-black px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Medida de neumáticos de todos los autos</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            {POPULAR_VEHICLES.length} modelos de {marcas.length} marcas con la medida de neumático original. Tocá el tuyo para ver las versiones, el stock y el precio.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <CatalogoBuscador
          marcas={marcas.map((marca) => ({
            brand: marca,
            anchor: marcaSlug(marca),
            href: `/vehiculos/marca/${marcaSlug(marca)}`,
            models: porMarca.get(marca)!.map((v) => {
              const slug = vehicleSlug(v.brand, v.model);
              return { name: v.model, href: `/vehiculos/${slug}`, foto: vehiclePhoto(slug), medidas: medidas(v) };
            }),
          }))}
        />
        <section className="mx-auto mt-4 max-w-3xl">
          <h2 className="mb-3 text-2xl font-black text-black">¿Qué medida de neumático lleva mi auto?</h2>
          <p className="mb-3 text-slate-700">
            La medida original de tu auto figura en el flanco del neumático que tiene puesto (por ejemplo <strong>185/65 R15</strong>), en la
            etiqueta del marco de la puerta del conductor y en el manual. Si todavía no sabés cuál es, buscá tu modelo arriba: cada ficha trae
            la medida de cada versión y año, el stock y el precio en nuestras sucursales de Córdoba.
          </p>
          <p className="mb-6 text-slate-700">
            Muchas versiones de un mismo modelo usan rodados distintos (por ejemplo 15, 16 o 17 pulgadas). Fijate en la ficha cuál corresponde a
            tu versión, o consultanos y lo confirmamos.
          </p>
          <h2 className="mb-3 text-2xl font-black text-black">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question}>
                <h3 className="font-bold text-black">{f.question}</h3>
                <p className="text-slate-700">{f.answer}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-slate-700">
            ¿Querés ver qué se lleva la gente? Mirá{" "}
            <Link href="/vehiculos/mas-atendidos" className="font-bold text-orange-600 hover:underline">
              los autos y medidas que más cambiamos
            </Link>{" "}
            o la{" "}
            <Link href="/herramientas" className="font-bold text-orange-600 hover:underline">
              calculadora de medidas equivalentes
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
