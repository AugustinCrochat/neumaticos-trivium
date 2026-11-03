import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { DEFAULT_BRANCH_ID, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { bestPriceByGroup } from "@/lib/best-price";
import { SERVICES } from "@/lib/data";
import {
  LOCALIDADES,
  getBranchForLocalidad,
  getLocalidad,
  type Localidad,
} from "@/lib/localidades";
import { canonical, localidadJsonLd, SITE_NAME, type Faq } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug } from "@/lib/tire-sizes";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { PreselectBranch } from "@/components/ui/PreselectBranch";
import { LocalProductCarousel } from "../LocalProductCarousel";
import { LocalPhotos } from "../LocalPhotos";
import { ZonasAgrupadas } from "@/components/seo/ZonasAgrupadas";
import { poolShare } from "@/lib/share-image";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import Image from "next/image";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { BLOG_POSTS } from "@/lib/data";

/**
 * Landings de SEO local: "neumáticos en Villa Allende", "gomería en Saldán".
 *
 * Existen aparte de /sucursales/[id] porque cubren una intención distinta. La
 * ficha de sucursal responde "dónde queda Trivium Argüello" a alguien que ya
 * conoce la marca; estas responden "dónde compro neumáticos cerca" a alguien
 * que todavía no. Por eso el H1, el copy y las FAQ apuntan a la localidad y no
 * a la marca.
 *
 * El texto único de cada localidad vive en localidades.ts. Si dos páginas
 * terminan diciendo lo mismo con el nombre cambiado, Google las clasifica como
 * doorway pages y puede desindexar todo el conjunto: el contenido propio no es
 * decorativo acá, es lo que sostiene la estrategia.
 *
 * Leen el catálogo (DEFAULT_BRANCH_ID, como el resto de las landings de SEO)
 * solo para el carrusel de productos, y como el sitio es estático sin ISR eso
 * ocurre en el build: el refresco de stock y precios es el redeploy del cron.
 * El stock en vivo lo corrige LiveStockProvider en el cliente.
 */
export const dynamic = "force-static";

type Props = { params: Promise<{ localidad: string }> };

export function generateStaticParams() {
  return LOCALIDADES.map((l) => ({ localidad: l.slug }));
}

function tituloLocal(localidad: Localidad): string {
  // "Baratos" es el modificador de precio con más volumen de búsqueda junto a
  // "neumáticos", y no aparecía en ningún título de esta serie de landings.
  const sucursal = getBranchForLocalidad(localidad);
  if (sucursal.provisorio) {
    return localidad.esCabecera
      ? `Neumáticos baratos en ${localidad.name} — outlet de importación directa`
      : `Neumáticos baratos en ${localidad.name} — precios de outlet, local en ${sucursal.shortName}`;
  }
  // Las páginas comunes (home, catálogo, ofertas…) ya no nombran ninguna ciudad:
  // la búsqueda "neumáticos baratos en Córdoba" es de esta página, la dedicada
  // a la región. El resto de las localidades se diferencian por zona y minutos.
  return localidad.esCabecera
    ? `Neumáticos baratos en ${localidad.name}: cubiertas con stock hoy y colocación sin cargo`
    : `Neumáticos baratos en ${localidad.name} — precios de outlet a ${localidad.minutosHastaSucursal} min`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { localidad: slug } = await params;
  const localidad = getLocalidad(slug);
  if (!localidad) return {};

  const branch = getBranchForLocalidad(localidad);
  const title = tituloLocal(localidad);
  const description = branch.provisorio
    ? `Neumáticos baratos para ${localidad.name} a precio de importación directa. ` +
      `Mirá medidas y precios en la web y pasá por nuestro local de ${branch.address}, ${branch.city}.`
    : localidad.esCabecera && localidad.incluye?.length
      ? `Cubiertas con stock y precio publicado para ${localidad.name} y sus barrios (${localidad.incluye.slice(0, 4).join(", ")} y más). ` +
        `Colocación sin cargo en el día en ${branch.address}, a ${localidad.minutosHastaSucursal} minutos del centro.`
    : `Comprá neumáticos baratos en ${localidad.name}, ${localidad.province}, a precio de importación directa. ` +
      `Medidas y precios con stock real, colocación sin cargo en el día y taller de alineación y balanceo en ${branch.address}, a ` +
      `${localidad.minutosHastaSucursal} minutos de ${localidad.name}.`;

  return {
    title,
    description,
    alternates: canonical(`/neumaticos-en/${localidad.slug}`),
    openGraph: {
      title: `${title} — ${SITE_NAME}`,
      description,
      url: `/neumaticos-en/${localidad.slug}`,
      ...poolShare(localidad.slug).openGraph,
    },
    twitter: poolShare(localidad.slug).twitter,
  };
}

function buildFaqs(localidad: Localidad, branch: ReturnType<typeof getBranchForLocalidad>): Faq[] {
  // Sucursal con datos sin confirmar: solo lo que es cierto para cualquier
  // local de Trivium (importación directa, garantía) y la ubicación real.
  if (branch.provisorio) {
    return [
      {
        question: `¿Dónde comprar neumáticos baratos en ${localidad.name}?`,
        answer:
          `Trivium tiene un local en ${branch.address}, ${branch.city}, a unos ${localidad.minutosHastaSucursal} minutos aproximados de ${localidad.name}. ` +
          `Vendemos neumáticos de importación directa, así que el precio no lleva el margen de un distribuidor intermedio. En la web ves las medidas y los precios antes de ir.`,
      },
      {
        question: `¿Vale la pena viajar desde ${localidad.name} para comprar neumáticos?`,
        answer:
          `Depende de cuántos cambies. En un juego de cuatro neumáticos la diferencia de precio entre un outlet de importación directa y una gomería de barrio se multiplica por cuatro, y suele superar el costo del viaje. ` +
          `Mirá tu medida en la web, pedí una cotización en tu zona y compará.`,
      },
      {
        question: `¿Los neumáticos importados tienen garantía?`,
        answer:
          `Sí. Todo lo que vendemos cumple con las homologaciones vigentes, viene con los índices de carga y velocidad marcados en el flanco y tiene un año de garantía por defecto de fabricación.`,
      },
    ];
  }
  return [
    {
      question: `¿Dónde comprar neumáticos baratos en ${localidad.name}?`,
      answer:
        `Trivium atiende ${localidad.name} desde su local de ${branch.address}, ${branch.city}, a unos ` +
        `${localidad.minutosHastaSucursal} minutos en auto. ${localidad.comoLlegar} Trabajamos con importación directa, ` +
        `así que el precio no lleva el margen de un distribuidor intermedio.`,
    },
    {
      question: `¿Hay que sacar turno para cambiar los neumáticos?`,
      answer:
        `No. Atendemos por orden de llegada, de ${branch.hours.toLowerCase()}. Si querés evitar la espera, escribinos por ` +
        `WhatsApp antes de salir de ${localidad.name} y te decimos cómo está el taller en ese momento y si tu medida está ` +
        `en stock, para que hagas el viaje una sola vez.`,
    },
    {
      question: `¿Hacen envíos a ${localidad.name}?`,
      answer:
        `Sí. Podés comprar por la web y recibirlo en ${localidad.name}: gratis en compras desde $${FREE_SHIPPING_THRESHOLD.toLocaleString("es-AR")}, ` +
        `o $${SHIPPING_FLAT_RATE.toLocaleString("es-AR")} fijos por debajo de eso. Ahora bien, si podés acercarte al local te conviene: el retiro es sin cargo y la colocación va incluida, ` +
        `así que te ahorrás el envío y además salís con las ruedas puestas y balanceadas.`,
    },
    {
      question: `¿Hacen alineación y balanceo?`,
      answer:
        `Sí, con equipo de alineación computarizada 3D en el mismo local. Es el complemento lógico del cambio de cubiertas: ` +
        `sin alineación, un neumático nuevo puede empezar a desgastarse de forma despareja en pocos miles de kilómetros. ` +
        `Comprando los neumáticos acá, el arme, el desarme y el cambio de válvulas no se cobran.`,
    },
    {
      question: `¿Los neumáticos importados sirven para las rutas de ${localidad.province}?`,
      answer:
        `Sí. Todo lo que vendemos cumple con las homologaciones de seguridad vigentes y viene con índices de carga y ` +
        `velocidad marcados en el flanco. Lo importante no es el origen sino elegir el índice correcto para tu vehículo y ` +
        `tu uso: te asesoramos con eso antes de venderte nada, y tenés un año de garantía por defecto de fabricación.`,
    },
  ];
}

export default async function LocalidadPage({ params }: Props) {
  const { localidad: slug } = await params;
  const localidad = getLocalidad(slug);
  if (!localidad) notFound();

  const branch = getBranchForLocalidad(localidad);
  const medidas = MEDIDAS_PRIORITARIAS.slice(0, 12);
  // Lo más vendido primero, y a igual venta el más barato: el carrusel tiene
  // que abrir con lo que más probablemente convierte.
  const todos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const conStock = todos
    .filter((p) => p.enStock)
    .sort((a, b) => (b.vendidos ?? 0) - (a.vendidos ?? 0) || a.price - b.price);
  const mejores = [...bestPriceByGroup(conStock)];
  const otras = LOCALIDADES.filter((l) => l.slug !== localidad.slug);
  // Notas ya publicadas del mismo local (las programadas todavía no existen y darían 404).
  const claveNota = branch.province === "Córdoba" ? /cordoba/ : /(buenos-aires|san-justo|lomas|oeste)/;
  const notasLocales = BLOG_POSTS.filter((p) => claveNota.test(p.slug)).slice(0, 4);

  const waLink = `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
    `Hola, escribo desde ${localidad.name}. Quería consultar por neumáticos.`
  )}`;

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-8">
      <PreselectBranch branchId={branch.id} />
      <JsonLd data={localidadJsonLd(localidad, branch)} />
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Dónde compramos", path: "/neumaticos-en" },
          { name: localidad.name, path: `/neumaticos-en/${localidad.slug}` },
        ]}
      />

      <header className="mb-10 grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div>
        <p className="mb-2 text-sm font-black uppercase tracking-widest text-orange-500">
          {localidad.name}, {localidad.province}
          {branch.apertura && (
            <span className="ml-3 rounded-full bg-navy-100 px-3 py-1 text-xs font-black normal-case tracking-normal text-navy-800">
              Abrimos {branch.apertura}
            </span>
          )}
        </p>
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">
          {localidad.esCabecera && !branch.provisorio ? `Cubiertas en ${localidad.name}, barrio por barrio` : `Neumáticos baratos en ${localidad.name}`}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">{localidad.intro}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">{localidad.porQue}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <WhatsAppLink
            href={waLink}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25d366] px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            Consultar por WhatsApp
          </WhatsAppLink>
          <a
            href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-navy-900 bg-white px-6 text-sm font-black text-navy-900 transition-transform active:scale-[0.98]"
          >
            Llamar
          </a>
          <Link
            href={`/sucursales/${branch.id}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-black px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            <DirectionsIcon className="h-6 w-6" />
            Cómo llegar al local
          </Link>
        </div>
        </div>
        {branch.facadePhoto && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
            <Image
              src={branch.facadePhoto}
              alt={`Fachada del local de ${SITE_NAME} en ${branch.neighborhood ?? branch.city}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {branch.googleRating && !branch.provisorio && (
              <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-2 shadow">
                <GoogleRatingBadge branchId={branch.id} />
              </div>
            )}
          </div>
        )}
      </header>

      {/* Resumen citable: la respuesta directa a "dónde compro neumáticos en X" */}
      <section className="mb-10 rounded-2xl border-l-4 border-[#ff1e00] bg-navy-50 p-5 md:p-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-navy-700">Respuesta rápida</h2>
        <p data-speakable className="mt-2 text-base leading-relaxed text-slate-800 md:text-lg">
          {branch.apertura ? (
            <>
              Para comprar neumáticos en {localidad.name}, Neumáticos Trivium abre su local de <strong>{branch.shortName}</strong>{" "}
              ({branch.address}, {branch.city}) <strong>{branch.apertura}</strong>, a unos {localidad.minutosHastaSucursal} minutos.
              Mientras tanto podés ver precios y medidas en la web y consultar por WhatsApp. Todos los neumáticos son nuevos y tienen
              1 año de garantía por defecto de fabricación.
            </>
          ) : (
            <>
              Neumáticos Trivium vende neumáticos nuevos en {localidad.name} desde su local de <strong>{branch.shortName}</strong>{" "}
              ({branch.address}, {branch.city}), a unos {localidad.minutosHastaSucursal} minutos. Horario: {branch.hours}, sin turno.
              Colocación y válvulas sin cargo al comprar ahí, alineación y balanceo en el mismo local y 1 año de garantía por defecto de
              fabricación.
            </>
          )}
        </p>
      </section>

      {!branch.provisorio && (
        <ul className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Colocación sin cargo", "Armado y válvulas incluidas", "/servicios"],
            ["1 año de garantía", "Por defecto de fabricación", "/garantia-neumaticos"],
            ["Sin turno", "Por orden de llegada", "/servicios"],
            ["Precio publicado", "El mismo que en el local", "/catalogo"],
          ].map(([t, d, href]) => (
            <li key={t}>
              <Link href={href} className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-400">
                <span className="block font-black text-navy-900">{t}</span>
                <span className="mt-0.5 block text-sm text-slate-500">{d}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="mb-12 rounded-2xl bg-slate-50 p-5 md:p-6">
        <h2 className="mb-3 text-xl font-black text-navy-900">Encontrá tus neumáticos</h2>
        <SizeOrVehicleSearch compact lado hideLearnLink />
      </section>

      <LocalProductCarousel
        productos={conStock}
        mejores={mejores}
        titulo={`Neumáticos con stock y precio hoy — para ${localidad.name}`}
      />

      {/* Datos del local: el bloque NAP que Google cruza con la ficha de Maps */}
      <section className="mb-12 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-black text-navy-900">
            Tu local más cercano desde {localidad.name}
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-black uppercase tracking-widest text-slate-400">Local</dt>
              <dd className="mt-0.5 text-base font-bold text-navy-900">
                {SITE_NAME} {branch.shortName}
              </dd>
            </div>
            <div>
              <dt className="font-black uppercase tracking-widest text-slate-400">Dirección</dt>
              <dd className="mt-0.5 text-slate-700">
                {branch.address}, {branch.city}
                {branch.postalCode && `, ${branch.postalCode}`}
              </dd>
            </div>
            {!branch.provisorio && (
              <div>
                <dt className="font-black uppercase tracking-widest text-slate-400">Horario</dt>
                <dd className="mt-0.5 text-slate-700">{branch.hours}</dd>
              </div>
            )}
            <div>
              <dt className="font-black uppercase tracking-widest text-slate-400">Teléfono</dt>
              <dd className="mt-0.5">
                <a
                  href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`}
                  className="font-bold text-navy-700 underline underline-offset-2"
                >
                  {branch.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-black uppercase tracking-widest text-slate-400">
                Distancia desde {localidad.name}
              </dt>
              <dd className="mt-0.5 text-slate-700">
                {localidad.minutosHastaSucursal} minutos en auto
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl bg-slate-50 p-5">
          <h3 className="mb-2 font-black text-navy-900">Cómo llegar desde {localidad.name}</h3>
          <p className="leading-relaxed text-slate-600">{localidad.comoLlegar}</p>
          {branch.googleMapsEmbedUrl && !branch.provisorio && (
            <iframe
              src={branch.googleMapsEmbedUrl}
              title={`Mapa del local de ${branch.shortName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mb-5 mt-5 h-56 w-full rounded-xl border-0"
            />
          )}
          {localidad.incluye && localidad.incluye.length > 0 && (
            <>
              <h3 className="mb-2 mt-5 font-black text-navy-900">También atendemos</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {localidad.incluye.join(" · ")}
              </p>
            </>
          )}
        </div>
      </section>

      {!branch.provisorio && <LocalPhotos zona={localidad.name} />}

      {/* Servicios: solo con taller confirmado */}
      {!branch.provisorio && (
      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-black text-navy-900">
          Gomería y taller para clientes de {localidad.name}
        </h2>
        <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
          Taller propio en el mismo local: cambiás las cubiertas y salís con todo listo, sin tener
          que ir a otro lado a balancear.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              href={`/servicios/${service.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-orange-400"
            >
              <h3 className="font-black text-navy-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* Medidas más pedidas — enlaza el cluster nacional desde el local */}
      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-black text-navy-900">Medidas más pedidas</h2>
        <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
          Entrá a tu medida para ver los modelos disponibles con precio y stock actualizado.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {medidas.map((size) => (
            <Link
              key={sizeSlug(size)}
              href={`/neumaticos/${sizeSlug(size)}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-orange-400"
            >
              <span className="block font-black text-navy-900">{formatSize(size)}</span>
              <span className="mt-1 block text-xs font-bold text-slate-500">Ver precios</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-black text-navy-900">¿Qué necesitás para tu auto?</h2>
        <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
          Elegí lo tuyo y vas directo a los precios con stock.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {[
            ["Neumáticos baratos", "/neumaticos-baratos", "/images/local/cubierta-perfil-bajo-grenlander-colocada-neumaticos-trivium.webp"],
            ["Ofertas", "/ofertas", "/images/local/neumatico-grenlander-kingpro-one-pickup-trivium.webp"],
            ["Camioneta y 4x4 (A/T)", "/neumaticos/at", "/images/local/neumatico-at-grenlander-maga-at-two-camioneta-clasica-trivium.webp"],
            ["Cubiertas de carga", "/neumaticos/carga", "/images/local/fiat-ducato-con-cubiertas-de-carga-nuevas-en-el-taller-trivium.webp"],
            ["Remises, taxis y apps", "/neumaticos-para-remises-taxis-y-uber", "/images/local/taxi-en-el-taller-neumaticos-trivium-cordoba.webp"],
            ["Alineado y balanceado", "/servicios", "/images/local/tecnico-colocando-target-de-alineacion-3d-en-auto-trivium-cordoba.webp"],
          ].map(([t, href, img]) => (
            <Link key={href} href={href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-orange-400">
              <span className="relative block aspect-[4/3] bg-slate-100">
                <Image src={img} alt={t} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 17vw" />
              </span>
              <span className="block p-3 text-sm font-black text-navy-900">{t} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-black text-navy-900">Mirá todo el catálogo</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
          Todas las marcas y medidas con precio y stock actualizado al momento.
        </p>
        <Link
          href="/catalogo"
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
        >
          Ver el catálogo completo
        </Link>
      </section>

      <section className="mb-12 rounded-2xl bg-black p-6 text-white md:flex md:items-center md:justify-between md:gap-6 md:p-8">
        <div>
          <h2 className="text-2xl font-black">¿Tu medida está en stock?</h2>
          <p className="mt-1 max-w-xl text-slate-300">
            Escribinos con la medida o la patente y te confirmamos precio y disponibilidad en el momento.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
          <WhatsAppLink
            href={waLink}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25d366] px-6 text-sm font-black text-white"
          >
            WhatsApp
          </WhatsAppLink>
          <a
            href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white px-6 text-sm font-black text-white"
          >
            Llamar
          </a>
        </div>
      </section>

      {notasLocales.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-black text-navy-900">Guías para decidir mejor</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {notasLocales.map((n) => (
              <Link key={n.slug} href={`/blog/${n.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-400">
                <span className="block font-black text-navy-900">{n.title}</span>
                <span className="mt-1 block text-sm text-slate-500">{n.excerpt}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FaqSection
        faqs={buildFaqs(localidad, branch)}
        title={`Preguntas frecuentes — ${localidad.name}`}
      />

      {otras.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-black text-navy-900">Otras zonas que atendemos</h2>
          <ZonasAgrupadas variant="light" actual={localidad.slug} />
        </section>
      )}
    </div>
  );
}
