import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Todas las páginas del sitio",
  description:
    "Índice de Neumáticos Trivium: catálogo, neumáticos por medida y tipo, marcas, gomería y servicios, calculadoras, blog y datos de contacto.",
  alternates: canonical("/mapa-del-sitio"),
};

type Item = { href: string; label: string; hint: string };

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: "Neumáticos",
    items: [
      { href: "/catalogo", label: "Catálogo de neumáticos", hint: "Todo el stock con filtros por medida, marca y precio." },
      { href: "/neumaticos-baratos", label: "Neumáticos baratos", hint: "El mejor precio en cada rodado." },
      { href: "/neumaticos", label: "Neumáticos por medida", hint: "Buscá por ancho, perfil y rodado." },
      { href: "/neumaticos/at", label: "Neumáticos A/T", hint: "Todo terreno para camionetas y 4x4." },
      { href: "/neumaticos/ht", label: "Neumáticos H/T", hint: "Para ruta y uso mixto." },
      { href: "/neumaticos/carga", label: "Neumáticos de carga", hint: "Para utilitarios, furgones y camiones livianos." },
      { href: "/marcas", label: "Marcas", hint: "Cada marca con sus modelos y medidas." },
      { href: "/vehiculos", label: "Por vehículo", hint: "La medida que lleva tu auto o camioneta." },
      { href: "/ofertas", label: "Ofertas", hint: "Precios especiales por tiempo limitado." },
    ],
  },
  {
    title: "Herramientas",
    items: [
      { href: "/calculadora-equivalencia-neumaticos", label: "Calculadora de equivalencias", hint: "Verificá si otra medida es compatible con la tuya." },
      { href: "/cotizador", label: "Cotizador de neumáticos", hint: "Armá tu presupuesto y mandalo por WhatsApp." },
    ],
  },
  {
    title: "Gomería y servicios",
    items: [
      { href: "/servicios", label: "Gomería y servicios", hint: "Todo lo que hacemos en el taller." },
      { href: "/servicios/alineacion", label: "Alineación", hint: "Las ruedas apuntando donde deben." },
      { href: "/servicios/balanceo", label: "Balanceo", hint: "Para que el auto no vibre." },
      { href: "/servicios/rotacion-de-ruedas", label: "Rotación de ruedas", hint: "Desgaste parejo en el juego completo." },
      { href: "/servicios/montaje", label: "Arme y desarme", hint: "Montaje de cubiertas en la llanta." },
      { href: "/tuercas-antirrobo", label: "Tuercas antirrobo", hint: "Seguridad para tus llantas." },
    ],
  },
  {
    title: "Ayuda y contacto",
    items: [
      { href: "/blog", label: "Blog", hint: "Guías para elegir, cuidar y cambiar tus neumáticos." },
      { href: "/sucursales", label: "Sucursales", hint: "Direcciones, horarios y cómo llegar." },
      { href: "/neumaticos-en", label: "Zonas donde atendemos", hint: "Localidades y barrios de Córdoba." },
      { href: "/contacto", label: "Contacto", hint: "WhatsApp, teléfono y mail." },
    ],
  },
];

export default function MapaDelSitioPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Breadcrumbs
          crumbs={[
            { name: "Inicio", path: "/" },
            { name: "Todas las páginas", path: "/mapa-del-sitio" },
          ]}
        />
        <h1 className="text-3xl font-black text-navy-900 md:text-4xl">Todas las páginas</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Un índice de todo lo que hay en el sitio, por tema.</p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 border-b border-slate-200 pb-2 text-sm font-black uppercase tracking-widest text-slate-500">{section.title}</h2>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50">
                      <span className="font-black text-navy-900 group-hover:text-orange-600">{item.label}</span>
                      <span className="block text-sm text-slate-500">{item.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
