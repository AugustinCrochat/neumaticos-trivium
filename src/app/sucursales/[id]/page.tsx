import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANCHES, SHIPPING_FLAT_RATE, SITE_URL, type Branch } from "@/lib/config";
import { SERVICES } from "@/lib/data";
import { canonical, SITE_NAME, type Faq } from "@/lib/seo";
import { localidadesDeSucursal } from "@/lib/localidades";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { BranchStatusBadge } from "./BranchStatusBadge";
import { BranchMiniMap } from "./BranchMiniMap";
import { SetActiveBranch } from "./SetActiveBranch";
import { DirectionsButton } from "./DirectionsButton";

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
    },
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
        `Sí, y es la opción más conveniente: el retiro no tiene costo, mientras que el envío a domicilio son ` +
        `$${SHIPPING_FLAT_RATE.toLocaleString("es-AR")} fijos. Comprás en la web, te confirmamos por WhatsApp que está listo ` +
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
      <header className="bg-navy-900 pb-8 pt-8 md:pb-12 md:pt-12">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href="/sucursales"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-navy-300 transition-colors hover:text-white"
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
          <p className="mt-3 text-lg font-bold text-navy-200">
            Neumáticos Trivium {branch.shortName}
          </p>
          <p className="mt-3 flex items-start gap-2 text-base leading-relaxed text-navy-200">
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

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Breadcrumbs
          crumbs={[
            { name: "Inicio", path: "/" },
            { name: "Sucursales", path: "/sucursales" },
            { name: branch.shortName, path: `/sucursales/${branch.id}` },
          ]}
        />

        {/* Acciones principales */}
        <section className="grid grid-cols-2 gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#25d366] px-4 text-base font-black text-white shadow-sm shadow-[#25d366]/20 transition-transform active:scale-[0.98]"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribir por WhatsApp
          </a>
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
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-navy-900 shadow-sm transition-colors hover:border-orange-400 hover:text-orange-700"
          >
            <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 011-1h5V7.5l3.5 3.5z" />
            </svg>
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

        {/* Ubicacion + mapa */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-black text-navy-900">Ubicación y cómo llegar</h2>
          <p className="mb-4 text-sm text-slate-600">
            {branch.address}, {branch.city}
          </p>
          <BranchMiniMap branch={branch} />
          <DirectionsButton
            lat={branch.coordinates.lat}
            lng={branch.coordinates.lng}
            label={`Neumáticos Trivium ${branch.shortName}`}
            className="mt-4 inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 011-1h5V7.5l3.5 3.5z" />
            </svg>
            Cómo llegar
          </DirectionsButton>
        </section>

        {/* Servicios */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-black text-navy-900">Servicios en esta sucursal</h2>
          <p className="mb-4 text-sm text-slate-500">Taller propio con equipos de última generación.</p>
          <div className="space-y-3">
            {SERVICES.map((service) => (
              <div key={service.id} className="rounded-xl bg-slate-50 p-4">
                <h3 className="font-bold text-navy-900">{service.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Resena en Google */}
        {branch.reviewUrl && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center shadow-sm">
            <div className="mb-2 flex items-center justify-center gap-1" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-7 w-7 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.363 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.375-2.455a1 1 0 00-1.176 0l-3.375 2.455c-.784.57-1.838-.196-1.539-1.118l1.286-3.966a1 1 0 00-.362-1.118L2.343 9.393c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.287-3.966z" />
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
              className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 text-sm font-black text-navy-950 transition-transform active:scale-[0.98] hover:bg-amber-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.363 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.375-2.455a1 1 0 00-1.176 0l-3.375 2.455c-.784.57-1.838-.196-1.539-1.118l1.286-3.966a1 1 0 00-.362-1.118L2.343 9.393c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.287-3.966z" />
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
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 p-6 text-white shadow-sm">
          <h2 className="text-xl font-black">Catálogo de neumáticos</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-200">
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
