import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { BRANDS } from "@/lib/data";
import { canonical, SITE_NAME } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import {
  MEDIDAS_PRIORITARIAS,
  formatSize,
  rimSlug,
  sizeSlug,
  sizesFromCatalog,
  sizesEqual,
} from "@/lib/tire-sizes";
import type { TireSize } from "@/lib/types";
import { poolShare } from "@/lib/share-image";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { MarcaLogo } from "@/components/ui/MarcaLogo";
import { peersByGroup } from "@/lib/best-price";
import { MEDIDAS } from "@/lib/blog-cluster";
import { BLOG_POSTS } from "@/lib/data";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { vehiclePhoto } from "@/lib/vehicle-photos";
import { vehiclesUsingSize } from "@/lib/tire-sizes";
import { itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Buscar neumáticos por medida: precio y stock al instante",
  description:
    "Buscá neumáticos por medida (185/65 R15, 205/55 R16, 175/70 R14 y más) o por tu auto y mirá precio y stock al instante, con las equivalencias de cada medida. Importación directa, colocación sin cargo y 1 año de garantía.",
  alternates: canonical("/neumaticos"),
  openGraph: {
    title: `Buscar neumáticos por medida — ${SITE_NAME}`,
    url: "/neumaticos",
    ...poolShare("neumaticos").openGraph,
  },
    twitter: poolShare("neumaticos").twitter,
};

const FAQS = [
  {
    question: "¿Cómo sé qué medida de neumático lleva mi auto?",
    answer:
      "Está escrita en el flanco del neumático que tenés puesto, con el formato 205/55 R16. También figura en la calcomanía del parante de la puerta del conductor y en el manual del vehículo. Si el auto ya vino con neumáticos cambiados, la referencia válida es la calcomanía o el manual, no lo que tiene puesto.",
  },
  {
    question: "¿Puedo poner una medida distinta a la original?",
    answer:
      "Sí, siempre que el diámetro externo total quede dentro del ±3% del original y el rodado sea el mismo que el de tu llanta. Fuera de ese margen, el velocímetro empieza a marcar mal y el ABS y el control de estabilidad trabajan con una referencia equivocada. En cada página de medida listamos las equivalencias calculadas, y tenemos una calculadora para verificar cualquier combinación.",
  },
  {
    question: "¿Conviene cambiar los cuatro neumáticos juntos?",
    answer:
      "Lo ideal es de a cuatro, porque así el desgaste queda parejo y el auto se comporta de forma previsible. Si el presupuesto no da, el mínimo aceptable es de a dos, siempre en el mismo eje y con los más nuevos atrás: neumáticos nuevos adelante y gastados atrás hacen que el tren trasero pierda agarre antes en una frenada sobre piso mojado.",
  },
  {
    question: "¿Los neumáticos importados tienen garantía en Argentina?",
    answer:
      "Sí. Todos los que vendemos tienen un año de garantía por defecto de fabricación, y se gestiona directamente con nosotros, en el local. La garantía cubre fallas de fábrica, no daños por golpes, baches, pinchaduras ni desgaste por falta de alineación.",
  },
];

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const parseMedida = (k: string): TireSize => {
  const [, w, p, r] = k.match(/(\d+)\/(\d+) R(\d+)/)!;
  return { width: +w, profile: +p, rim: +r };
};

const USOS = [
  { href: "/neumaticos/ht", titulo: "H/T · Highway Terrain", texto: "Para camionetas y SUV que andan sobre todo en asfalto: silenciosas y cómodas.", foto: "/images/usos/ht.webp" },
  { href: "/neumaticos/at", titulo: "A/T · All Terrain", texto: "Para pickups que también salen a tierra y ripio: dibujo más agresivo.", foto: "/images/usos/at.webp" },
  { href: "/neumaticos/carga", titulo: "De carga (C)", texto: "Para utilitarios y furgones: construcción reforzada y más índice de carga.", foto: "/images/usos/carga.webp" },
];

// Los autos que más se patentan en Argentina en 2026 (Hilux, Cronos, 208 y
// Ranger al frente según El Cero Km), para entrar por el modelo.
const AUTOS_POPULARES: [string, string][] = [
  ["Toyota", "Hilux"], ["Fiat", "Cronos"], ["Peugeot", "208"], ["Ford", "Ranger"],
  ["Ford", "Territory"], ["Volkswagen", "Amarok"], ["Chevrolet", "Tracker"], ["Toyota", "Yaris"],
  ["Fiat", "Argo"], ["Fiat", "Strada"], ["Renault", "Kwid"], ["Chevrolet", "Onix"],
];

const CONFIANZA = [
  "Colocación sin cargo",
  "Retiro en el local",
  "1 año de garantía de fábrica",
  "Importación directa",
];

/** Agrupa por rodado para que la grilla se lea como el catálogo mental del
    comprador: primero "qué rodado tengo", después "qué ancho y perfil". */
function agruparPorRodado(sizes: { size: TireSize; count: number }[]) {
  const porRodado = new Map<number, { size: TireSize; count: number }[]>();
  for (const entry of sizes) {
    const lista = porRodado.get(entry.size.rim);
    if (lista) lista.push(entry);
    else porRodado.set(entry.size.rim, [entry]);
  }
  return [...porRodado.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([rim, medidas]) => ({
      rim,
      medidas: medidas.sort(
        (a, b) => a.size.width - b.size.width || a.size.profile - b.size.profile
      ),
    }));
}

export default async function NeumaticosPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const peers = peersByGroup(productos);
  const enStock = productos.filter((p) => p.enStock && !p.isCarga);

  // Catálogo real + medidas prioritarias sin stock: unificarlas evita que el
  // hub tenga menos enlaces que el sitemap y deje páginas huérfanas.
  const delCatalogo = sizesFromCatalog(productos);
  const slugs = new Set(delCatalogo.map((s) => sizeSlug(s.size)));
  const todas = [
    ...delCatalogo,
    ...MEDIDAS_PRIORITARIAS.filter((s) => !slugs.has(sizeSlug(s))).map((size) => ({
      size,
      count: 0,
    })),
  ];
  const grupos = agruparPorRodado(todas);
  const marcasConProductos = BRANDS.filter((b) =>
    productos.some((p) => p.brandId === b.id)
  );

  // Precio más bajo con stock de cada medida, para mostrar "desde $" en toda la grilla.
  // Con colchón de stock (3 o más): el sitio se congela en cada build y una
  // unidad suelta puede agotarse antes del próximo, dejando una tarjeta "Sin stock".
  const firmes = enStock.filter((p) => (p.stock ?? 0) >= 3);
  const desde = new Map<string, number>();
  for (const p of firmes.length ? firmes : enStock) {
    const k = sizeSlug(p.size);
    desde.set(k, Math.min(desde.get(k) ?? Infinity, p.price));
  }

  // Las medidas más buscadas (las de las notas por medida), con los autos que
  // la llevan y la foto del primero que la tiene.
  const populares = MEDIDAS.filter(({ slug }) => BLOG_POSTS.some((p) => p.slug === slug)).map(({ slug, size }) => {
    const t = parseMedida(size);
    const modelos = new Map<string, { nombre: string; slug: string }>();
    for (const v of vehiclesUsingSize(t)) {
      const key = `${v.brand} ${v.model}`;
      if (!modelos.has(key)) modelos.set(key, { nombre: key, slug: vehicleSlug(v.brand, v.model) });
    }
    const orden = POPULAR_VEHICLES.map((v) => `${v.brand} ${v.model}`);
    const lista = [...modelos.values()].sort((a, b) => orden.indexOf(a.nombre) - orden.indexOf(b.nombre));
    // Foto del neumático: el más barato con stock de esa medida.
    const foto = enStock.filter((p) => sizesEqual(p.size, t)).sort((a, b) => a.price - b.price)[0]?.imageUrl ?? null;
    return { slug, size, t, total: lista.length, nombres: lista.slice(0, 3).map((m) => m.nombre), foto, desde: desde.get(sizeSlug(t)) };
  });

  // Los más baratos de todo el catálogo con stock, de menor a mayor precio y
  // una tarjeta por medida (si no, un mismo modelo ocuparía toda la fila).
  const destacados: typeof firmes = [];
  const vistas = new Set<string>();
  for (const p of [...(firmes.length ? firmes : enStock)].sort((a, b) => a.price - b.price)) {
    const k = sizeSlug(p.size);
    if (vistas.has(k)) continue;
    vistas.add(k);
    destacados.push(p);
    if (destacados.length === 4) break;
  }

  // Autos más vendidos del país, con foto, para entrar por el modelo.
  const autos = AUTOS_POPULARES.map(([brand, model]) => ({ brand, model })).filter((v) => vehiclePhoto(vehicleSlug(v.brand, v.model)));

  return (
    <div className="bg-white pb-16">
      <JsonLd
        data={itemListJsonLd(
          todas.map(({ size }) => ({ name: `Neumáticos ${formatSize(size)}`, path: `/neumaticos/${sizeSlug(size)}` }))
        )}
      />

      {/* Héroe: lo primero es encontrar la medida. */}
      <section className="bg-black px-4 pb-14 pt-8 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <div className="[&_ol]:justify-center">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Inicio", path: "/" },
              { name: "Neumáticos", path: "/neumaticos" },
            ]}
          />
          </div>
          <h1 className="mt-6 text-balance text-4xl font-black leading-tight md:text-5xl">
            Buscá tus neumáticos <span className="text-orange-500">por medida</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
            Escribí tu medida o elegí tu auto y mirá en la misma página qué modelos hay, a qué precio y si están en stock ahora.
            Importamos directo de fábrica: sin distribuidor en el medio.
          </p>
          <div className="mx-auto mt-8 max-w-3xl rounded-3xl bg-white p-4 text-left text-navy-900 shadow-2xl ring-4 ring-white/10 md:p-6">
            <SizeOrVehicleSearch />
          </div>
          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-bold text-slate-400">Las más pedidas:</span>
            {populares.slice(0, 5).map((m) => (
              <Link key={m.slug} href={`/neumaticos/${sizeSlug(m.t)}`} className="rounded-full border border-white/20 px-3 py-1 text-sm font-black !text-white hover:border-orange-500 hover:bg-white/10">
                {m.size}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-400">
            <Link href="/buscador" className="font-bold text-slate-200 underline underline-offset-4">Cómo funciona el buscador</Link>: stock real, equivalentes si tu medida está agotada y búsqueda por auto.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-slate-200">
            {CONFIANZA.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-orange-500">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* Medidas más buscadas */}
        <section className="pt-12">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Las medidas más buscadas</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Las que llevan los autos más comunes. Cada una tiene su guía con los modelos que la usan y las equivalencias.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {populares.map((m) => (
              <div key={m.slug} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <Link href={`/neumaticos/${sizeSlug(m.t)}`} className="relative block bg-slate-100">
                  <span className="flex aspect-[4/3] items-center justify-center p-3">
                    {m.foto && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.foto} alt={`Neumático ${m.size}`} loading="lazy" decoding="async" className="h-full w-auto max-w-full object-contain mix-blend-multiply" />
                    )}
                  </span>
                  <span className="absolute left-3 top-3 rounded-lg bg-black px-3 py-1 text-lg font-black italic text-white">{m.size}</span>
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-sm font-black text-navy-900">
                    {m.desde ? `Desde ${money(m.desde)}` : "Consultá stock"}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-slate-600">
                    Lo llevan {m.nombres.join(", ")}
                    {m.total > 3 ? ` y ${m.total - 3} modelos más` : ""}.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-sm font-bold">
                    <Link href={`/neumaticos/${sizeSlug(m.t)}`} className="text-orange-600 underline underline-offset-2">
                      Ver neumáticos
                    </Link>
                    <Link href={`/blog/${m.slug}`} className="text-navy-700 underline underline-offset-2">
                      Guía
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Los más económicos hoy */}
        {destacados.length > 0 && (
          <section className="mt-14 rounded-3xl bg-orange-500 p-5 text-white md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-white/80">Precio bajo de verdad</p>
                <h2 className="mt-1 text-3xl font-black md:text-4xl">Lo más económico en stock hoy</h2>
                <p className="mt-2 max-w-2xl text-white/90">Los neumáticos nuevos más baratos que tenemos ahora, ordenados de menor a mayor precio.</p>
              </div>
              <Link href="/neumaticos-baratos" className="inline-flex min-h-11 items-center rounded-xl bg-black px-5 text-sm font-black !text-white hover:bg-slate-900">
                Ver todos los económicos →
              </Link>
            </div>
            <div className="mt-6 rounded-2xl bg-white p-3 text-navy-900 sm:p-4 [&_a]:!no-underline">
              <SortedProductGrid
                className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
                items={destacados.map((p) => ({ product: p, peers: peers.get(p.id) }))}
              />
            </div>
          </section>
        )}

        {/* Por auto */}
        <section className="pt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-black text-navy-900 md:text-3xl">¿No sabés tu medida? Buscá por tu auto</h2>
            <Link href="/vehiculos" className="text-sm font-bold text-navy-700 underline underline-offset-2">
              Ver todas las marcas →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {autos.map((v) => {
              const slug = vehicleSlug(v.brand, v.model);
              return (
                <Link key={slug} href={`/vehiculos/${slug}`} className="group rounded-xl border border-slate-200 bg-white p-3 text-center transition-colors hover:border-orange-400">
                  <span className="flex h-20 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={vehiclePhoto(slug)!} alt="" loading="lazy" decoding="async" className="max-h-20 w-auto max-w-full object-contain" />
                  </span>
                  <span className="mt-2 flex items-center justify-center gap-1.5 text-sm font-black text-navy-900">
                    <MarcaLogo brand={v.brand} className="h-4 w-4" />
                    {v.model}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Por uso */}
        <section className="pt-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Por tipo de uso</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {USOS.map((u) => (
              <Link key={u.href} href={u.href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-orange-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.foto} alt={u.titulo} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="block p-5">
                  <span className="block font-black text-navy-900">{u.titulo}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-600">{u.texto}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Todas las medidas por rodado */}
        <section className="pt-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Todas las medidas por rodado</h2>
          <nav aria-label="Ir a un rodado" className="mt-4 flex flex-wrap gap-2">
            {grupos.map(({ rim }) => (
              <a key={rim} href={`#rodado-${rim}`} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-black text-navy-900 hover:border-orange-400">
                R{rim}
              </a>
            ))}
          </nav>
          {grupos.map(({ rim, medidas }) => (
            <div key={rim} id={`rodado-${rim}`} className="mt-8 scroll-mt-28">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-black text-navy-900">Rodado {rim}</h3>
                <Link href={`/neumaticos/${rimSlug(rim)}`} className="text-sm font-bold text-navy-600 underline underline-offset-2 hover:text-navy-900">
                  Ver todo R{rim}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {medidas.map(({ size, count }) => (
                  <Link
                    key={sizeSlug(size)}
                    href={`/neumaticos/${sizeSlug(size)}`}
                    className={`rounded-xl border p-4 text-center transition-colors ${
                      count > 0 ? "border-slate-200 bg-white hover:border-orange-400" : "border-dashed border-slate-200 bg-slate-50 hover:border-navy-300"
                    }`}
                  >
                    <span className="block font-black text-navy-900">{formatSize(size)}</span>
                    <span className="mt-1 block text-xs font-bold text-slate-500">
                      {desde.get(sizeSlug(size))
                        ? `desde ${money(desde.get(sizeSlug(size))!)}`
                        : count > 0
                          ? `${count} ${count === 1 ? "modelo" : "modelos"}`
                          : "a pedido"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Marcas */}
        {marcasConProductos.length > 0 && (
          <section className="pt-14">
            <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Marcas que trabajamos</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {marcasConProductos.map((brand) => (
                <Link key={brand.id} href={`/marcas/${brand.id}`} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-navy-400">
                  {brand.logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logoUrl} alt={`Logo ${brand.name}`} loading="lazy" decoding="async" className="h-10 w-auto max-w-full object-contain" />
                  )}
                  <span className="font-black text-navy-900">{brand.name}</span>
                  <span className="text-xs font-medium text-slate-400">{brand.origin}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Guías */}
        <section className="pt-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Guías para elegir bien</h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <Link href="/blog/como-leer-medida-neumatico" className="block rounded-xl border border-slate-200 bg-slate-50 p-4 font-bold text-navy-900 hover:border-orange-400">
                Cómo leer la medida de un neumático
              </Link>
            </li>
            <li>
              <Link href="/calculadora-equivalencia-neumaticos" className="block rounded-xl border border-slate-200 bg-slate-50 p-4 font-bold text-navy-900 hover:border-orange-400">
                Calculadora de equivalencias
              </Link>
            </li>
            <li>
              <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa" className="block rounded-xl border border-slate-200 bg-slate-50 p-4 font-bold text-navy-900 hover:border-orange-400">
                Cómo ahorrar en neumáticos
              </Link>
            </li>
            <li>
              <Link href="/herramientas" className="block rounded-xl border border-slate-200 bg-slate-50 p-4 font-bold text-navy-900 hover:border-orange-400">
                Herramientas y calculadoras
              </Link>
            </li>
          </ul>
        </section>

        {/* Servicio */}
        <section className="mt-14 rounded-3xl bg-black p-8 text-white md:p-10">
          <h2 className="text-2xl font-black md:text-3xl">Los colocamos en el momento</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Comprás, retirás y los montamos en el taller del local, con alineado y balanceado si los necesitás.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/servicios" className="inline-flex min-h-12 items-center rounded-xl bg-orange-500 px-6 text-sm font-black !text-white hover:bg-orange-600">
              Ver servicios
            </Link>
            <Link href="/sucursales" className="inline-flex min-h-12 items-center rounded-xl border border-white/30 px-6 text-sm font-black !text-white hover:bg-white/10">
              Cómo llegar
            </Link>
          </div>
        </section>

        <FaqSection faqs={FAQS} title="Preguntas frecuentes sobre medidas de neumáticos" />
      </div>
    </div>
  );
}
