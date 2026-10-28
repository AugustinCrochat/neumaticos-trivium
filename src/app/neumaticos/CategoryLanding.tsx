import Link from "@/components/ui/Link";
import type { ReactNode } from "react";
import type { TireProduct, TireSize } from "@/lib/types";
import { BRANCHES } from "@/lib/config";
import { CategoryProductGrid } from "./CategoryProductGrid";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import type { Faq } from "@/lib/seo";
import { formatSize, sizeSlug, sizesFromCatalog } from "@/lib/tire-sizes";

export type CategoryHero = {
  headline: string;
  accent: string;
  bajada: string;
  highlights: { titulo: string; detalle: string }[];
  idealPara: string[];
  noIdealPara: string[];
  /** Foto del taller para el encabezado; sin ella se usa el isotipo de Trivium. */
  image?: { src: string; alt: string; position?: string };
};

/**
 * Landing por categoría de neumático (A/T, carga), hermana de RimLanding pero
 * con el orden invertido: acá el producto es la búsqueda (alguien que ya sabe
 * que quiere un A/T o un de carga), no la medida, así que el listado va
 * primero y las medidas quedan como referencia al final en vez de ocupar el
 * lugar que en /neumaticos/[medida] tiene el resumen con precio desde.
 */
export function CategoryLanding({
  crumbLabel,
  path,
  title,
  productos,
  faqs,
  hero,
  sizeHref = (size) => `/neumaticos/${sizeSlug(size)}`,
  sizeLabel = formatSize,
  extra,
}: {
  crumbLabel: string;
  path: string;
  title: string;
  productos: TireProduct[];
  faqs: Faq[];
  hero: CategoryHero;
  /** Destino de cada medida de la grilla. Por defecto, la landing de auto. */
  sizeHref?: (size: TireSize) => string;
  /** Texto de cada medida (la categoría carga agrega la "C"). */
  sizeLabel?: (size: TireSize) => string;
  /** Contenido editorial propio de la categoría, antes de las preguntas frecuentes. */
  extra?: ReactNode;
}) {
  const branch = BRANCHES[0];
  const ordenados = [...productos].sort(
    (a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price
  );
  const medidas = sizesFromCatalog(productos);
  const slugsConStock = new Set(productos.filter((p) => p.enStock).map((p) => sizeSlug(p.size)));
  const medidasConStock = slugsConStock.size;
  const porAro = [
    ...medidas
      .reduce((m, e) => m.set(e.size.rim, [...(m.get(e.size.rim) ?? []), e]), new Map<number, typeof medidas>())
      .entries(),
  ].sort((a, b) => a[0] - b[0]);

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: crumbLabel, path },
        ]}
      />

      <header className="relative mb-6 overflow-hidden rounded-3xl bg-black">
        {hero.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.image.src}
              alt={hero.image.alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: hero.image.position ?? "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20 max-md:from-black/90 max-md:via-black/75 max-md:to-black/60" />
          </>
        ) : (
          <>
            {/* Mismo recurso que la miniatura de links compartidos (og-layout): el
                isotipo grande, cortado contra la esquina y casi transparente. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/trivium-icon.svg"
              alt=""
              className="pointer-events-none absolute -right-6 top-0 h-64 w-64 opacity-25 md:right-10 md:top-1/2 md:h-[24rem] md:w-[24rem] md:-translate-y-1/2 md:opacity-40"
            />
          </>
        )}
        <div className="relative max-w-2xl px-6 py-10 md:px-10 md:py-16">
          <h1 className="inline-block rounded-md bg-[#ff1e00] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            {title}
          </h1>
          <p className="font-display mt-4 text-4xl font-bold uppercase leading-[0.95] tracking-wide text-white md:text-6xl">
            {hero.headline}
            <br />
            <span className="text-[#ff1e00]">{hero.accent}</span>
          </p>
          <p className="mt-4 max-w-lg text-base text-slate-300 md:text-lg">{hero.bajada}</p>
        </div>
      </header>

      <ul className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {hero.highlights.map((h) => (
          <li key={h.titulo} className="rounded-2xl border border-slate-200 bg-white p-4">
            <span className="font-display block text-xl font-bold uppercase tracking-wide text-slate-900">
              {h.titulo}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-slate-600">{h.detalle}</span>
          </li>
        ))}
      </ul>

      <div className="mb-10 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-emerald-800">Ideal para</p>
          <ul className="space-y-1 text-sm font-medium text-emerald-950">
            {hero.idealPara.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden="true">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">No es lo mejor para</p>
          <ul className="space-y-1 text-sm font-medium text-slate-700">
            {hero.noIdealPara.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden="true">–</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {ordenados.length > 0 ? (
        <section className="mb-14">
          <CategoryProductGrid productos={ordenados} />
        </section>
      ) : (
        <section className="mb-14 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600">
          Ahora mismo no tenemos stock, pero consultanos por WhatsApp: te decimos cuándo entra.
        </section>
      )}

      {medidas.length > 0 && (
        <section className="mb-14">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">
              Medidas disponibles
            </h2>
            {medidasConStock > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {medidasConStock} {medidasConStock === 1 ? "medida" : "medidas"} con stock hoy
              </span>
            )}
          </div>
          <div className="space-y-6">
            {porAro.map(([aro, items]) => (
              <div key={aro}>
                <h3 className="mb-2 flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-500">
                  <span className="rounded-md bg-black px-2 py-0.5 text-white">R{aro}</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {items.map(({ size, count }) => {
                    const hayStock = slugsConStock.has(sizeSlug(size));
                    return (
                      <Link
                        key={sizeSlug(size)}
                        href={sizeHref(size)}
                        className="group relative rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-[#ff1e00]"
                      >
                        {hayStock && (
                          <span
                            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-500"
                            title="Con stock"
                          />
                        )}
                        <span className="block font-black text-slate-900">{sizeLabel(size)}</span>
                        <span className="mt-1 block text-xs font-bold text-slate-500">
                          {count} {count === 1 ? "modelo" : "modelos"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {extra}

      <FaqSection faqs={faqs} />

      <section className="relative mt-14 overflow-hidden rounded-3xl bg-black p-6 md:p-10">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[#ff1e00]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#ff1e00]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/servicios/desarmadora.svg" alt="" className="h-8 w-8 brightness-0 invert" />
            </span>
            <div>
              <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide text-white md:text-4xl">
                Colocación y válvulas <span className="text-[#ff1e00]">sin cargo</span>
              </h2>
              <p className="mt-2 max-w-xl text-slate-300">
                ¿No encontrás tu medida? Escribinos con la medida o el uso que necesitás y te decimos si la tenemos,
                cuándo ingresa o qué alternativa te sirve. Atendemos de {branch.hours.toLowerCase()} en{" "}
                {branch.address}, {branch.city}.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 md:shrink-0">
            <WhatsAppLink
              href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(`Hola! Consulto por neumáticos: ${crumbLabel}`)}`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#ff1e00] px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
            >
              Consultar por WhatsApp
            </WhatsAppLink>
            <Link
              href="/neumaticos"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-black text-white transition-colors hover:border-white"
            >
              Ver todas las medidas
            </Link>
            <Link
              href="/calculadora-equivalencia-neumaticos"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-black text-white transition-colors hover:border-white"
            >
              Calculadora de equivalencias
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
