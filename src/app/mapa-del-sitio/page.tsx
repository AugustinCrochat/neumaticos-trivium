import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Calculator, CircleHelp, MapPin, ShoppingBag, Wrench } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ZonasAgrupadas } from "@/components/seo/ZonasAgrupadas";
import { BLOG_POSTS, BRANDS } from "@/lib/data";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, absoluteUrl, SITE_NAME } from "@/lib/seo";
import { sizeSlug, sizesFromCatalog } from "@/lib/tire-sizes";
import { LOCALIDADES } from "@/lib/localidades";
import { poolShare } from "@/lib/share-image";

const TITLE = "Mapa del sitio: neumáticos, medidas, marcas y servicios";
const DESCRIPTION =
  "Todo Neumáticos Trivium en un solo lugar: catálogo por medida y marca, neumáticos A/T y de carga, calculadoras, gomería (alineación, balanceo, rotación), notas del blog y las zonas que atendemos en Córdoba y Buenos Aires.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/mapa-del-sitio"),
  openGraph: { title: `Mapa del sitio — ${SITE_NAME}`, description: DESCRIPTION, url: "/mapa-del-sitio", ...poolShare("mapa-del-sitio").openGraph },
  twitter: poolShare("mapa-del-sitio").twitter,
};

type Item = { href: string; label: string; hint: string };
type Section = { id: string; title: string; lead: string; icon: typeof ShoppingBag; tone: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    id: "neumaticos",
    title: "Neumáticos",
    lead: "Todo el stock, por medida, por tipo o por marca.",
    icon: ShoppingBag,
    tone: "bg-orange-500",
    items: [
      { href: "/catalogo", label: "Catálogo de neumáticos", hint: "Todo el stock con filtros por medida, marca y precio." },
      { href: "/neumaticos", label: "Neumáticos por medida", hint: "Buscá por ancho, perfil y rodado." },
      { href: "/neumaticos-baratos", label: "Neumáticos baratos", hint: "El mejor precio en cada rodado." },
      { href: "/neumaticos/at", label: "Neumáticos A/T", hint: "Todo terreno para camionetas y 4x4." },
      { href: "/neumaticos/ht", label: "Neumáticos H/T", hint: "Para ruta y uso mixto." },
      { href: "/neumaticos/carga", label: "Neumáticos de carga", hint: "Para utilitarios, furgones y camiones livianos." },
      { href: "/marcas", label: "Marcas", hint: "Cada marca con sus modelos y medidas." },
      { href: "/vehiculos", label: "Por vehículo", hint: "La medida que lleva tu auto o camioneta." },
      { href: "/ofertas", label: "Ofertas", hint: "Precios especiales por tiempo limitado." },
    ],
  },
  {
    id: "herramientas",
    title: "Herramientas",
    lead: "Para decidir con datos antes de comprar.",
    icon: Calculator,
    tone: "bg-navy-900",
    items: [
      { href: "/calculadora-equivalencia-neumaticos", label: "Calculadora de equivalencias", hint: "Verificá si otra medida es compatible con la tuya." },
      { href: "/cotizador", label: "Cotizador de neumáticos", hint: "Armá tu presupuesto y mandalo por WhatsApp." },
      { href: "/indice-de-carga-y-velocidad", label: "Índice de carga y velocidad", hint: "Qué significan los números del final de la medida." },
    ],
  },
  {
    id: "gomeria",
    title: "Gomería y servicios",
    lead: "El taller donde te colocamos las cubiertas.",
    icon: Wrench,
    tone: "bg-emerald-600",
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
    id: "contacto",
    title: "Ayuda y contacto",
    lead: "Dónde estamos y cómo hablar con nosotros.",
    icon: MapPin,
    tone: "bg-sky-600",
    items: [
      { href: "/sucursales", label: "Sucursales", hint: "Direcciones, horarios y cómo llegar." },
      { href: "/neumaticos-en", label: "Zonas donde atendemos", hint: "Localidades y barrios de Córdoba." },
      { href: "/contacto", label: "Contacto", hint: "WhatsApp, teléfono y mail." },
      { href: "/politica-de-devoluciones", label: "Garantía y devoluciones", hint: "Un año por defecto de fabricación." },
    ],
  },
];

const ZONAS = [
  { branchId: "arguello", titulo: "Sucursal Argüello · Córdoba" },
  { branchId: "san-justo", titulo: "Sucursal San Justo · Buenos Aires" },
];

const fecha = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });

export default async function MapaDelSitioPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const enStock = productos.filter((p) => p.enStock && !p.isCarga);

  // Medidas con stock agrupadas por rodado, con el precio mínimo de cada una.
  const medidas = sizesFromCatalog(enStock).map(({ size, count }) => ({
    size,
    count,
    desde: Math.min(...enStock.filter((p) => sizeSlug(p.size) === sizeSlug(size)).map((p) => p.price)),
  }));
  const porRodado = [...medidas.reduce((m, e) => m.set(e.size.rim, [...(m.get(e.size.rim) ?? []), e]), new Map<number, typeof medidas>())]
    .map(([rim, items]) => ({ rim, items: items.sort((a, b) => a.size.width - b.size.width || a.size.profile - b.size.profile) }))
    .sort((a, b) => a.rim - b.rim);

  const marcas = BRANDS.map((brand) => ({
    brand,
    total: productos.filter((p) => p.brandId === brand.id).length,
  })).filter((m) => m.total > 0);

  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const categorias = [...new Set(posts.map((p) => p.category))];

  const stats = [
    { n: enStock.length, label: "modelos con stock" },
    { n: medidas.length, label: "medidas disponibles" },
    { n: marcas.length, label: "marcas" },
    { n: posts.length, label: "guías en el blog" },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/mapa-del-sitio"),
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: SECTIONS.flatMap((s) => s.items).map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        url: absoluteUrl(item.href),
      })),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <JsonLd data={collectionJsonLd} />

      <header className="bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <Breadcrumbs
            crumbs={[
              { name: "Inicio", path: "/" },
              { name: "Mapa del sitio", path: "/mapa-del-sitio" },
            ]}
          />
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            Todo Neumáticos Trivium, <span className="text-orange-500">en un solo lugar</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            Neumáticos nuevos con importación directa, gomería con alineación y balanceo, y herramientas para elegir bien
            la medida. Acá está cada sección del sitio, con las medidas que tenemos en stock hoy.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-black text-white">{s.n}</dd>
                <dd className="text-xs font-bold uppercase tracking-wide text-slate-400">{s.label}</dd>
              </div>
            ))}
          </dl>

          <nav aria-label="Secciones" className="mt-8 flex flex-wrap gap-2">
            {[
              ...SECTIONS.map((s) => ({ id: s.id, title: s.title })),
              { id: "medidas", title: "Medidas con stock" },
              { id: "marcas", title: "Marcas" },
              { id: "blog", title: "Blog" },
              { id: "zonas", title: "Zonas" },
            ].map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-navy-900"
              >
                {a.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-14 px-4 py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white ${section.tone}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-navy-900">{section.title}</h2>
                    <p className="text-sm text-slate-500">{section.lead}</p>
                  </div>
                </div>
                <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="group block h-full rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50">
                        <span className="font-black text-navy-900 group-hover:text-orange-600">{item.label}</span>
                        <span className="block text-sm leading-snug text-slate-500">{item.hint}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <section id="medidas" className="scroll-mt-24">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Medidas de neumáticos con stock</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Cada medida lleva a su página con los modelos, precios y los autos que la usan. Ordenadas por rodado, con el
            precio desde por unidad.
          </p>
          <div className="mt-6 space-y-5">
            {porRodado.map(({ rim, items }) => (
              <div key={rim} className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5">
                <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">Rodado {rim}</h3>
                <ul className="flex flex-wrap gap-2">
                  {items.map(({ size, desde }) => (
                    <li key={sizeSlug(size)}>
                      <Link
                        href={`/neumaticos/${sizeSlug(size)}`}
                        className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-colors hover:border-orange-500 hover:bg-white"
                      >
                        <span className="text-sm font-black text-navy-900">
                          {size.width}/{size.profile} R{size.rim}
                        </span>
                        <span className="text-xs text-slate-500">desde ${desde.toLocaleString("es-AR")}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="marcas" className="scroll-mt-24">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Marcas que vendemos</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {marcas.map(({ brand, total }) => (
              <li key={brand.id}>
                <Link
                  href={`/marcas/${brand.id}`}
                  className="flex h-full flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-orange-500"
                >
                  <span className="relative flex h-12 w-full items-center justify-center">
                    {brand.logoUrl ? (
                      <Image src={brand.logoUrl} alt={`Logo de ${brand.name}`} width={120} height={48} className="max-h-12 w-auto object-contain" />
                    ) : null}
                  </span>
                  <span className="text-sm font-black text-navy-900">{brand.name}</span>
                  <span className="text-xs text-slate-500">{total} {total === 1 ? "modelo" : "modelos"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="blog" className="scroll-mt-24">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <CircleHelp className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Guías y notas del blog</h2>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categorias.map((cat) => (
              <div key={cat} className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="mb-2 text-sm font-black uppercase tracking-widest text-slate-500">{cat}</h3>
                <ul className="space-y-2">
                  {posts
                    .filter((p) => p.category === cat)
                    .map((p) => (
                      <li key={p.slug}>
                        <Link href={`/blog/${p.slug}`} className="group block">
                          <span className="font-bold leading-snug text-navy-900 group-hover:text-orange-600">{p.title}</span>
                          <span className="block text-xs text-slate-400">{fecha(p.date)}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="zonas" className="scroll-mt-24">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Zonas que atendemos</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            {LOCALIDADES.length} localidades y barrios con su página: cómo llegar al local, tiempos y qué hacemos en cada zona.
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {ZONAS.map((z) => (
              <div key={z.branchId} className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">{z.titulo}</h3>
                <ZonasAgrupadas variant="light" prefijo branchId={z.branchId} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
