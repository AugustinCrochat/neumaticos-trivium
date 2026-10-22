import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { canonical, absoluteUrl, SITE_NAME } from "@/lib/seo";
import { poolShare } from "@/lib/share-image";
import { TOOLS, toolPath } from "@/lib/tools";

const TITLE = "Herramientas para neumáticos: calculadoras y conversores gratis";
const DESCRIPTION =
  "Calculadoras gratuitas de Neumáticos Trivium: equivalencias de medidas, código DOT, cuándo cambiar, presión, velocímetro, costo por kilómetro y conversor flotation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/herramientas"),
  openGraph: { title: `Herramientas — ${SITE_NAME}`, description: DESCRIPTION, url: "/herramientas", ...poolShare("herramientas").openGraph },
  twitter: poolShare("herramientas").twitter,
};

const EXTRA: { href: string; name: string; short: string; image?: { src: string; alt: string } }[] = [
  { href: "/calculadora-equivalencia-neumaticos", name: "Calculadora de equivalencias", short: "Verificá si otra medida es compatible (±3 %) y mirá las que hay en stock.", image: { src: "/images/local/cubierta-perfil-bajo-grenlander-colocada-neumaticos-trivium.webp", alt: "Cubierta de perfil bajo colocada en una llanta" } },
  { href: "/blog/indice-de-carga-y-velocidad", name: "Índices de carga y velocidad", short: "Qué significan los números y letras al final de la medida.", image: { src: "/images/local/balanceadora-y-alineadora-utilitario-taller-trivium-cordoba.webp", alt: "Utilitario en el taller de Trivium" } },
  { href: "/vehiculos", name: "Medida por vehículo", short: "La medida de neumático que lleva tu auto o camioneta.", image: { src: "/images/local/taxi-en-el-taller-neumaticos-trivium-cordoba.webp", alt: "Taxi en el taller de Neumáticos Trivium" } },
  { href: "/cotizador", name: "Cotizador", short: "Armá un presupuesto con varios productos y compartilo por WhatsApp.", image: { src: "/images/local/fachada-local-neumaticos-trivium-cordoba.webp", alt: "Fachada del local de Neumáticos Trivium" } },
];

export default function HerramientasPage() {
  const items = [...TOOLS.map((t) => ({ href: toolPath(t.slug), name: t.name, short: t.short, image: t.image })), ...EXTRA];
  return (
    <div className="bg-slate-50">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: absoluteUrl("/herramientas"),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(it.href) })),
          },
        }}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Breadcrumbs crumbs={[{ name: "Inicio", path: "/" }, { name: "Herramientas", path: "/herramientas" }]} />
        <h1 className="text-3xl font-black leading-tight text-tire-950 md:text-5xl">Herramientas para neumáticos</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
          Calculadoras y conversores gratis para elegir, controlar y cuidar tus neumáticos. Sin registrarte.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={it.href}>
              <Link href={it.href} className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-orange-500">
                {it.image ? (
                  <span className="relative mb-3 block aspect-[16/9] overflow-hidden rounded-2xl bg-slate-200">
                    <Image src={it.image.src} alt={it.image.alt} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform group-hover:scale-105" />
                  </span>
                ) : (
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-black text-white">{i + 1}</span>
                )}
                <span className="text-lg font-black leading-snug text-tire-950 group-hover:text-orange-600">{it.name}</span>
                <span className="mt-1 text-sm leading-snug text-slate-500">{it.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
