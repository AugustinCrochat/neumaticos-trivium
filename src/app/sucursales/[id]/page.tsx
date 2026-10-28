import Link from "@/components/ui/Link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANCHES, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE, SITE_URL, type Branch } from "@/lib/config";
import { canonical, SITE_NAME, type Faq } from "@/lib/seo";
import { localidadesDeSucursal } from "@/lib/localidades";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { BranchStatusBadge } from "./BranchStatusBadge";
import { LazyBranchMiniMap } from "./LazyBranchMiniMap";
import { SetActiveBranch } from "./SetActiveBranch";
import { DirectionsButton } from "./DirectionsButton";
import { ServiciosSucursal } from "./ServiciosSucursal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import { poolShare } from "@/lib/share-image";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return BRANCHES.map((branch) => ({ id: branch.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const branch = BRANCHES.find((b) => b.id === id);
  if (!branch) return { title: "Sucursal no encontrada" };

  // El título lleva "gomería" además de la marca: es como se busca el rubro en
  // Argentina, y la ficha de sucursal es la página que tiene que capturarlo.
  const title = `Gomería y neumáticos baratos en ${branch.neighborhood ?? branch.city} — ${branch.address}`;
  const description = `${SITE_NAME} ${branch.shortName}: neumáticos económicos con stock propio, alineación y balanceo en ${branch.address}, ${branch.city}. ${branch.hours}. Atención por orden de llegada, sin turno.`;

  return {
    title,
    description,
    alternates: canonical(`/sucursales/${branch.id}`),
    openGraph: {
      type: "website",
      title: `${title} — ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/sucursales/${branch.id}`,
      siteName: SITE_NAME,
      locale: "es_AR",
      ...poolShare(branch.id).openGraph,
    },
    twitter: poolShare(branch.id).twitter,
  };
}

/**
 * La ficha local (TireShop, con horarios, geo y rating) ya se emite para todas
 * las sucursales desde el grafo del layout raíz, así que acá no se repite:
 * duplicar el mismo @id en la página sólo agrega ruido al parser. Lo que sí es
 * propio de esta página son las migas y las preguntas frecuentes.
 */
function buildFaqs(branch: Branch): Faq[] {
  const zonas = localidadesDeSucursal(branch.id).map((l) => l.name);
  return [
    {
      question: "¿Necesito turno para cambiar los neumáticos?",
      answer:
        `No. Atendemos por orden de llegada, ${branch.hours.toLowerCase()}. Si querés estimar la espera, escribinos por ` +
        `WhatsApp al ${branch.phone} antes de venir y te contamos cómo está el taller en ese momento.`,
    },
    {
      question: "¿La colocación tiene costo?",
      answer:
        "Comprando el neumático en el local, el arme, el desarme y el cambio de válvulas van sin cargo. La alineación y el " +
        "balanceo se cobran aparte, porque son servicios de taller con equipo propio, y conviene hacerlos junto con el cambio.",
    },
    {
      question: "¿Qué formas de pago aceptan?",
      answer:
        "Efectivo, débito, crédito, transferencia y Mercado Pago. También podés cerrar la compra online desde la web y " +
        "retirar el pedido ya pago en el local, sin hacer cola.",
    },
    {
      question: `¿Desde qué zonas viene la gente a ${branch.shortName}?`,
      answer: zonas.length
        ? `Atendemos principalmente ${zonas.join(", ")}. Estamos sobre ${branch.address}, que es una avenida de acceso ` +
          `directo desde todo el corredor norte, así que llegar es simple incluso en hora pico.`
        : `Estamos en ${branch.address}, ${branch.city}, con acceso directo desde las principales avenidas de la zona.`,
    },
    {
      question: "¿Puedo comprar por internet y retirar en el local?",
      answer:
        `Sí, y es la opción más conveniente: el retiro no tiene costo, mientras que el envío a domicilio es gratis desde ` +
        `$${FREE_SHIPPING_THRESHOLD.toLocaleString("es-AR")} de compra, o $${SHIPPING_FLAT_RATE.toLocaleString("es-AR")} fijos por debajo. Comprás en la web, te confirmamos por WhatsApp que está listo ` +
        `y venís a buscarlo cuando te quede cómodo.`,
    },
  ];
}

export default async function BranchPage({ params }: Props) {
  const { id } = await params;
  const branch = BRANCHES.find((b) => b.id === id);
  if (!branch) notFound();

  const waMessage = encodeURIComponent(
    `¡Hola! Te escribo desde la sucursal ${branch.shortName}. Quería hacer una consulta.`
  );
  const waLink = `https://wa.me/${branch.whatsapp}?text=${waMessage}`;
  const telLink = `tel:${branch.phone.replace(/[^\d+]/g, "")}`;
  const zonas = localidadesDeSucursal(branch.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <SetActiveBranch branchId={branch.id} />

      {/* Hero */}
      <header className="bg-black pb-8 pt-8 md:pb-12 md:pt-12">
        <div className="mx-auto max-w-6xl px-4">
          <Link
            href="/sucursales"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Todas las sucursales
          </Link>

          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-orange-400">
            Sucursal {branch.shortName}
          </p>
          <h1 className="text-3xl font-black leading-tight text-white md:text-4xl">
            Gomería y neumáticos baratos en {branch.neighborhood ?? branch.city}
          </h1>
          <p className="mt-3 text-lg font-bold text-slate-300">
            Neumáticos Trivium {branch.shortName}
          </p>
          <p className="mt-3 flex items-start gap-2 text-base leading-relaxed text-slate-300">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              {branch.address}
              <br />
              {branch.city}
            </span>
          </p>
          <div className="mt-4">
            <BranchStatusBadge branch={branch} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Breadcrumbs
          crumbs={[
            { name: "Inicio", path: "/" },
            { name: "Sucursales", path: "/sucursales" },
            { name: branch.shortName, path: `/sucursales/${branch.id}` },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {branch.facadePhoto && (
          // aspect-[4/3] en todos los tamaños: es la proporción real de la
          // foto — a partir de sm pasaba a aspect-video (16:9) y se comía
          // buena parte de la imagen.
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src={branch.facadePhoto}
              alt={`Fachada del local de Neumáticos Trivium ${branch.shortName}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 576px"
              priority
            />
          </div>
        )}

        <div className="space-y-6">
        {/* Acciones principales */}
        <section className="grid grid-cols-2 gap-3">
          <WhatsAppLink
            href={waLink}
            className="col-span-2 inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#25d366] px-4 text-base font-black text-white shadow-sm shadow-[#25d366]/20 transition-transform active:scale-[0.98]"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribir por WhatsApp
          </WhatsAppLink>
          <a
            href={telLink}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-navy-900 shadow-sm transition-colors hover:border-navy-300"
          >
            <svg className="h-5 w-5 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Llamar
          </a>
          <DirectionsButton
            lat={branch.coordinates.lat}
            lng={branch.coordinates.lng}
            label={`Neumáticos Trivium ${branch.shortName}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-navy-900 shadow-sm transition-colors hover:border-orange-400 hover:text-orange-600"
          >
            <DirectionsIcon className="h-6 w-6 text-orange-500" />
            Cómo llegar
          </DirectionsButton>
        </section>

        {/* Horarios */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-navy-900">Horarios de atención</h2>
            <BranchStatusBadge branch={branch} />
          </div>
          <dl className="divide-y divide-slate-100 text-sm">
            {branch.schedule.map((rule, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <dt className="font-semibold text-slate-700">{formatDays(rule.days)}</dt>
                <dd className="font-mono text-slate-600">
                  {rule.open} – {rule.close}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
            Atención por orden de llegada, sin turnos. Consultá tiempos de espera por WhatsApp.
          </p>
        </section>

        </div>
        </div>

        {/* Ubicacion + mapa */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-black text-navy-900">Ubicación y cómo llegar</h2>
          <p className="mb-4 text-sm text-slate-600">
            {branch.address}, {branch.city}
          </p>
          <LazyBranchMiniMap branch={branch} />
          <DirectionsButton
            lat={branch.coordinates.lat}
            lng={branch.coordinates.lng}
            label={`Neumáticos Trivium ${branch.shortName}`}
            className="mt-4 inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            <DirectionsIcon className="h-6 w-6" />
            Cómo llegar
          </DirectionsButton>
        </section>

        {/* Servicios */}
        <ServiciosSucursal branch={branch} />

        {/* Resena en Google */}
        {branch.reviewUrl && (
          <section className="rounded-2xl border border-orange-100 bg-orange-50 p-5 text-center shadow-sm">
            <div className="mb-2 flex items-center justify-center gap-1" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-7 w-7 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
                </svg>
              ))}
            </div>
            <h2 className="text-lg font-black text-navy-900">¿Nos visitaste?</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Tu reseña nos ayuda muchísimo. Contanos cómo te fue en la sucursal {branch.shortName}.
            </p>
            <a
              href={branch.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
              </svg>
              Dejar mi reseña en Google
            </a>
            <a
              href={branch.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-xs font-bold text-navy-600 underline underline-offset-2 hover:text-navy-800"
            >
              Ver nuestra ficha en Google Maps
            </a>
          </section>
        )}

        {/* Catalogo */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-black p-6 text-white shadow-sm">
          <h2 className="text-xl font-black">Catálogo de neumáticos</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Mirá todas las marcas y medidas disponibles a precio outlet. Consultá stock y precio
            directo por WhatsApp con la sucursal {branch.shortName}.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/catalogo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
            >
              Ver catálogo y precios
            </Link>
            <Link
              href="/neumaticos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-sm font-black text-white transition-colors hover:bg-white/10"
            >
              Buscar por medida
            </Link>
          </div>
        </section>

        {/* Las zonas atendidas se mencionan en prosa dentro de las preguntas
            frecuentes, no como botonera de accesos directos. La señal local la
            da el texto y el areaServed del schema; las landings de
            /neumaticos-en se descubren por el footer y el sitemap. */}
        <FaqSection faqs={buildFaqs(branch)} />
      </main>
    </div>
  );
}

const DAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function formatDays(days: number[]): string {
  if (days.length === 0) return "";
  const sorted = [...days].sort((a, b) => a - b);
  // Rango contiguo -> "Lun a Vie"; si no, lista -> "Lun, Mié, Vie"
  const contiguous = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  if (contiguous && sorted.length > 1) {
    return `${DAY_SHORT[sorted[0]]} a ${DAY_SHORT[sorted[sorted.length - 1]]}`;
  }
  return sorted.map((d) => DAY_SHORT[d]).join(", ");
}
