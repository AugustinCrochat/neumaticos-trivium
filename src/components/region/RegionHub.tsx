import Image from "next/image";
import Link from "@/components/ui/Link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ZonasAgrupadas } from "@/components/seo/ZonasAgrupadas";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import { PreselectBranch } from "@/components/ui/PreselectBranch";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { datosSucursal, type DatosSucursal } from "@/app/sucursales/[id]/datos";
import { ProductosSucursal } from "@/app/sucursales/[id]/ProductosSucursal";
import { ServiciosSucursal } from "@/app/sucursales/[id]/ServiciosSucursal";
import type { Branch } from "@/lib/config";
import { REGIONES, sucursalesDeRegion, type Region } from "@/lib/regiones";
import { branchNodeId, itemListJsonLd, type Faq } from "@/lib/seo";
import { formatPrecio } from "@/lib/servicios";

type DatosPorSucursal = { branch: Branch; datos: DatosSucursal };

/** Servicio de taller con el nombre que se usa en la región ("alineado" en Córdoba). */
function taller(region: Region): string {
  return region.slug === "cordoba" ? "alineado y balanceado" : "alineación y balanceo";
}

function faqs(region: Region, lista: DatosPorSucursal[]): Faq[] {
  const ss = lista.map((l) => l.branch);
  const abiertas = lista.filter((l) => l.datos.abierta);
  const locales = ss.map((s) => `${s.shortName} (${s.address})${s.apertura ? `, abre ${s.apertura}` : ""}`).join("; ");
  const principal = abiertas[0];
  const masBarato = principal?.datos.masBarato;
  const combo = principal?.datos.combo.auto;
  return [
    {
      question: `¿Dónde comprar neumáticos baratos en ${region.nombre}?`,
      answer: masBarato
        ? `En Neumáticos Trivium ${principal.branch.shortName}, ${principal.branch.address}, ${principal.branch.city}. Hoy el más económico con stock es el ${masBarato.brand} ${masBarato.model} ${masBarato.size.width}/${masBarato.size.profile} R${masBarato.size.rim}${masBarato.isCarga ? "C" : ""}, a ${formatPrecio(masBarato.price)} por unidad. Son neumáticos nuevos de importación directa, con precio publicado en la web igual al del mostrador y un año de garantía.`
        : `Estamos abriendo en ${region.nombre}: ${locales}. Son neumáticos nuevos de importación directa, con precio publicado en la web y un año de garantía. Mientras tanto podés ver el catálogo y escribirnos por WhatsApp.`,
    },
    {
      question: `¿Dónde hacer ${taller(region)} en ${region.nombre}?`,
      answer: abiertas.length
        ? `En ${principal.branch.shortName}, ${principal.branch.address}: taller propio con equipos computarizados, por orden de llegada y sin turno.${combo ? ` El combo de ${taller(region)} para auto está ${formatPrecio(combo.precio)}.` : ""}`
        : `Va a estar en nuestros locales de ${region.nombre} (${locales}), con taller propio y equipos computarizados.`,
    },
    {
      question: `¿Dónde están los locales de Neumáticos Trivium en ${region.nombre}?`,
      answer: `${locales}.`,
    },
    {
      question: "¿Puedo ver los precios y el stock antes de ir?",
      answer:
        "Sí. En el catálogo cada medida tiene precio y stock publicados. Si preferís confirmar la disponibilidad, escribinos por WhatsApp antes de ir.",
    },
    {
      question: "¿La colocación tiene costo?",
      answer:
        "Comprando el neumático en el local, el arme, el desarme y el cambio de válvulas van sin cargo. La alineación y el balanceo se cobran aparte y conviene hacerlos junto con el cambio.",
    },
    {
      question: "¿Qué garantía tienen los neumáticos?",
      answer: "Todos tienen un año de garantía contra defectos de fabricación, que se gestiona en el local.",
    },
    ...(abiertas.length
      ? [
          {
            question: "¿Hay que sacar turno?",
            answer: "No. Se atiende por orden de llegada. Si querés evitar la espera, escribinos por WhatsApp antes de salir.",
          },
        ]
      : []),
  ];
}

const VENTAJAS = [
  {
    titulo: "Precio publicado",
    texto: "El precio de la web es el del mostrador. Sin sorpresas ni “consultá”.",
    icono: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    titulo: "Importación directa",
    texto: "Marcas de primera línea y alternativas económicas, todas nuevas, al mejor precio.",
    icono: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
  },
  {
    titulo: "Taller propio",
    texto: "Alineación 3D y balanceo computarizados, con colocación sin cargo si comprás las cubiertas.",
    icono: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
  {
    titulo: "1 año de garantía",
    texto: "Contra defectos de fabricación, y se gestiona en el mismo local.",
    icono: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

/** Portal de una región: hero con precios reales, buscador, neumáticos, servicios, locales, zonas y preguntas. */
export async function RegionHub({ region }: { region: Region }) {
  const sucursales = sucursalesDeRegion(region);
  const lista: DatosPorSucursal[] = await Promise.all(
    sucursales.map(async (branch) => ({ branch, datos: await datosSucursal(branch) }))
  );
  const abiertas = lista.filter((l) => l.datos.abierta);
  const principal = abiertas[0] ?? lista[0];
  const { branch: sp, datos: dp } = principal;
  const otras = REGIONES.filter((r) => r.slug !== region.slug);
  const f = faqs(region, lista);
  const hayAbierta = abiertas.length > 0;
  const tallerTxt = taller(region);
  const wa = `https://wa.me/${sp.whatsapp}?text=${encodeURIComponent(
    hayAbierta ? `¡Hola! Te escribo desde la web (${region.nombre}). Quería hacer una consulta.` : `¡Hola! Quiero que me avisen cuando abran en ${region.nombre}.`
  )}`;
  const comboAuto = dp.combo.auto;

  return (
    <div className="bg-slate-50">
      {/* La URL es una elección explícita de región: pisa la cookie. */}
      <PreselectBranch branchId={sucursales[0].id} forzar />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { ...itemListJsonLd(sucursales.map((s) => ({ name: s.name, path: `/sucursales/${s.id}` }))), "@context": undefined },
            {
              "@type": "CollectionPage",
              name: region.titulo,
              description: region.descripcion,
              about: sucursales.map((s) => ({ "@id": branchNodeId(s) })),
              areaServed: { "@type": "AdministrativeArea", name: region.nombre },
            },
          ],
        }}
      />

      {/* Hero */}
      <header className="bg-black pb-10 pt-8 md:pb-14 md:pt-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1.15fr_1fr] lg:items-center 2xl:max-w-[96rem]">
          <div>
            <Breadcrumbs
              dark
              crumbs={[
                { name: "Inicio", path: "/" },
                { name: region.nombre, path: `/${region.slug}` },
              ]}
            />
            <p className="mb-2 mt-5 text-sm font-black uppercase tracking-widest text-orange-400">{region.nombre}</p>
            <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
              Neumáticos baratos y {tallerTxt} en {region.nombre}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{region.intro}</p>
            {hayAbierta && sp.googleRating && <GoogleRatingBadge branchId={sp.id} className="mt-3 text-slate-200" />}

            <ul className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-white">
              {hayAbierta && dp.desde !== null && (
                <li className="rounded-full bg-orange-500 px-3 py-1.5">Neumáticos desde {formatPrecio(dp.desde)}</li>
              )}
              {hayAbierta && comboAuto && (
                <li className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20">
                  Combo {tallerTxt} {formatPrecio(comboAuto.precio)}
                </li>
              )}
              <li className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20">Colocación sin cargo</li>
              <li className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20">1 año de garantía</li>
              {!hayAbierta && (
                <li className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20">
                  Abrimos {lista.map((l) => `${l.branch.shortName} ${l.branch.apertura ?? ""}`.trim()).join(" · ")}
                </li>
              )}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${region.slug}/catalogo`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
              >
                Ver neumáticos y precios
              </Link>
              <WhatsAppLink
                href={wa}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25d366] px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
              >
                {hayAbierta ? "Consultar por WhatsApp" : "Avisame cuando abran"}
              </WhatsAppLink>
              {hayAbierta && (
                <Link
                  href={`/sucursales/${sp.id}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-black text-white transition-colors hover:bg-white/10"
                >
                  <DirectionsIcon className="h-5 w-5" />
                  Cómo llegar
                </Link>
              )}
            </div>
          </div>

          {sp.facadePhoto ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src={sp.facadePhoto}
                alt={`Local de Neumáticos Trivium ${sp.shortName}, ${sp.city}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-widest text-orange-400">Próxima apertura</p>
              <ul className="mt-3 space-y-3">
                {lista.map(({ branch: b }) => (
                  <li key={b.id}>
                    <p className="text-lg font-black">{b.shortName}</p>
                    <p className="text-sm text-slate-300">{b.address}</p>
                    <p className="text-sm font-bold text-orange-300">Abrimos {b.apertura}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 2xl:max-w-[96rem]">
        {/* Respuesta rápida: lo que contestaría un asistente a "neumáticos / alineado en {región}" */}
        <section className="rounded-2xl border-l-4 border-[#ff1e00] bg-navy-50 p-5 md:p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-navy-700">Respuesta rápida</h2>
          <p data-speakable className="mt-2 text-base leading-relaxed text-slate-800 md:text-lg">
            {hayAbierta ? (
              <>
                Neumáticos Trivium es una gomería de {region.nombre} en {sp.address}, {sp.city}: vende{" "}
                <strong>neumáticos nuevos baratos</strong>
                {dp.desde !== null && (
                  <> desde <strong>{formatPrecio(dp.desde)}</strong></>
                )}{" "}
                con precio publicado en la web y hace <strong>{tallerTxt}</strong> computarizado
                {comboAuto && (
                  <> (combo desde <strong>{formatPrecio(comboAuto.precio)}</strong>)</>
                )}
                . Abre {sp.hours.toLowerCase()}, por orden de llegada y sin turno; la colocación va sin cargo comprando las cubiertas y todos tienen un año de garantía.
              </>
            ) : (
              <>
                Neumáticos Trivium abre {lista.map((l) => `${l.branch.shortName} ${l.branch.apertura}`).join(" y ")} en {region.nombre}: gomería con{" "}
                <strong>neumáticos nuevos baratos</strong> de importación directa, <strong>{tallerTxt}</strong> con taller propio, colocación sin cargo y un año de garantía. Mientras tanto podés ver el catálogo y avisarnos por WhatsApp.
              </>
            )}
          </p>
        </section>

        {/* Buscador */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="sr-only">Encontrá tus neumáticos por medida, auto o patente</h2>
          <SizeOrVehicleSearch compact lado hideLearnLink />
        </section>

        {/* Neumáticos con stock de cada local abierto */}
        {abiertas.map(({ branch, datos }) => (
          <ProductosSucursal key={branch.id} branch={branch} datos={datos} />
        ))}

        {/* Servicios */}
        <ServiciosSucursal branch={sp} />

        {/* Por qué Trivium */}
        <section>
          <h2 className="mb-4 text-2xl font-black text-navy-900">Por qué comprar tus neumáticos en Trivium</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VENTAJAS.map((v) => (
              <article key={v.titulo} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={v.icono} />
                  </svg>
                </span>
                <h3 className="mt-3 font-black text-navy-900">{v.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{v.texto}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Locales */}
        <section>
          <h2 className="mb-4 text-2xl font-black text-navy-900">
            {sucursales.length > 1 ? `Nuestros locales en ${region.nombre}` : `Nuestro local en ${region.nombre}`}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sucursales.map((s) => (
              <article key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
                    {s.apertura ? "Ver el local" : "Cómo llegar"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Zonas */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-1 text-2xl font-black text-navy-900">Zonas que atendemos en {region.nombre}</h2>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-600">{region.contexto}</p>
          {sucursales.map((s) => (
            <div key={s.id} className="mb-6 last:mb-0">
              {sucursales.length > 1 && <h3 className="mb-2 font-black text-slate-500">Desde {s.shortName}</h3>}
              <ZonasAgrupadas variant="light" prefijo branchId={s.id} />
            </div>
          ))}
        </section>

        {/* Recorridos útiles */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/ofertas", t: "Ofertas", d: "Las medidas que más salen, con descuento" },
            { href: "/servicios", t: "Servicios de gomería", d: "Alineación, balanceo y colocación" },
            { href: "/marcas", t: "Marcas de neumáticos", d: "Comparalas y elegí la tuya" },
            { href: "/neumaticos-por-patente", t: "Buscar por patente", d: "Te decimos la medida de tu auto" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-orange-400"
            >
              <p className="font-black text-navy-900">{l.t}</p>
              <p className="mt-0.5 text-sm text-slate-500">{l.d}</p>
            </Link>
          ))}
        </section>

        <FaqSection faqs={f} title={`Preguntas frecuentes — ${region.nombre}`} />

        {/* Cierre con conversión */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-black p-6 text-white md:p-8">
          <h2 className="text-2xl font-black">
            {hayAbierta ? `Cambiá tus neumáticos hoy en ${sp.shortName}` : `Enterate cuando abramos en ${region.nombre}`}
          </h2>
          <p className="mt-2 max-w-2xl text-slate-300">
            {hayAbierta
              ? "Mirá el precio publicado, reservá por WhatsApp y vení: se atiende por orden de llegada y la colocación va sin cargo."
              : "Escribinos por WhatsApp y te avisamos el día de la apertura. Mientras tanto, mirá el catálogo y las medidas."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <WhatsAppLink
              href={wa}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25d366] px-6 text-sm font-black text-white"
            >
              {hayAbierta ? "Escribir por WhatsApp" : "Avisame cuando abran"}
            </WhatsAppLink>
            <Link
              href={`/${region.slug}/catalogo`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black text-white"
            >
              Ver el catálogo
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400">
            ¿Estás en otra zona?{" "}
            {otras.map((r) => (
              <Link key={r.slug} href={`/${r.slug}`} className="font-bold text-white underline underline-offset-2">
                Neumáticos en {r.nombre}
              </Link>
            ))}{" "}
            ·{" "}
            <Link href="/sucursales" className="font-bold text-white underline underline-offset-2">
              Todas las sucursales
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
