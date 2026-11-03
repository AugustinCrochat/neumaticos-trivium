import Link from "@/components/ui/Link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ZonasAgrupadas } from "@/components/seo/ZonasAgrupadas";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import { PreselectBranch } from "@/components/ui/PreselectBranch";
import { REGIONES, sucursalesDeRegion, type Region } from "@/lib/regiones";
import { itemListJsonLd, type Faq } from "@/lib/seo";

function faqs(region: Region): Faq[] {
  const ss = sucursalesDeRegion(region);
  const abiertas = ss.filter((s) => !s.apertura);
  const lista = ss.map((s) => `${s.shortName} (${s.address})${s.apertura ? `, abre ${s.apertura}` : ""}`).join("; ");
  return [
    {
      question: `¿Dónde están los locales de Neumáticos Trivium en ${region.nombre}?`,
      answer: `${lista}.`,
    },
    {
      question: "¿Puedo ver los precios y el stock antes de ir?",
      answer:
        "Sí. En el catálogo cada medida tiene precio y stock publicados. Si preferís confirmar la disponibilidad, escribinos por WhatsApp antes de ir.",
    },
    {
      question: "¿Qué garantía tienen los neumáticos?",
      answer: "Todos tienen un año de garantía contra defectos de fabricación, que se gestiona en el local.",
    },
    ...(abiertas.length
      ? [
          {
            question: "¿Hay que sacar turno para la colocación?",
            answer: "Se atiende por orden de llegada. Si querés evitar la espera, escribinos por WhatsApp antes de salir.",
          },
        ]
      : []),
  ];
}

/** Portal de una región: sucursales, zonas y accesos al resto del sitio. */
export function RegionHub({ region }: { region: Region }) {
  const sucursales = sucursalesDeRegion(region);
  const otras = REGIONES.filter((r) => r.slug !== region.slug);
  const f = faqs(region);

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-8">
      {/* La URL es una elección explícita de región: pisa la cookie. */}
      <PreselectBranch branchId={sucursales[0].id} forzar />
      <JsonLd
        data={itemListJsonLd(
          sucursales.map((s) => ({ name: `${s.name}`, path: `/sucursales/${s.id}` }))
        )}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: region.nombre, path: `/${region.slug}` },
        ]}
      />

      <header className="mb-10">
        <p className="mb-2 text-sm font-black uppercase tracking-widest text-orange-500">{region.nombre}</p>
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">
          Neumáticos Trivium en {region.nombre}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">{region.intro}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">{region.contexto}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/catalogo"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            Ver el catálogo
          </Link>
          <Link
            href="/ofertas"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            Ofertas
          </Link>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-black text-navy-900">
          {sucursales.length > 1 ? `Nuestros locales en ${region.nombre}` : `Nuestro local en ${region.nombre}`}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sucursales.map((s) => (
            <article key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-black text-navy-900">{s.name}</h3>
              <p className="mt-2 text-slate-700">
                {s.address}, {s.city}
                {s.postalCode && `, ${s.postalCode}`}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                {s.apertura ? `Abrimos ${s.apertura}` : s.provisorio ? "Horario a confirmar" : s.hours}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <WhatsAppLink
                  href={`https://wa.me/${s.whatsapp}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25d366] px-5 text-sm font-black text-white"
                >
                  WhatsApp
                </WhatsAppLink>
                <Link
                  href={`/sucursales/${s.id}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-black text-white"
                >
                  <DirectionsIcon className="h-5 w-5" />
                  Cómo llegar
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-black text-navy-900">Zonas que atendemos en {region.nombre}</h2>
        {sucursales.map((s) => (
          <div key={s.id} className="mb-6">
            {sucursales.length > 1 && <h3 className="mb-2 font-black text-slate-500">Desde {s.shortName}</h3>}
            <ZonasAgrupadas variant="light" prefijo branchId={s.id} />
          </div>
        ))}
      </section>

      <FaqSection faqs={f} title={`Preguntas frecuentes — ${region.nombre}`} />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-black text-navy-900">¿Estás en otra zona?</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {otras.map((r) => (
            <Link key={r.slug} href={`/${r.slug}`} className="font-bold text-navy-700 underline underline-offset-2">
              Neumáticos en {r.nombre}
            </Link>
          ))}
          <Link href="/sucursales" className="font-bold text-navy-700 underline underline-offset-2">
            Todas las sucursales
          </Link>
        </div>
      </section>
    </div>
  );
}
