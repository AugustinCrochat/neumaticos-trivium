import Image from "next/image";
import Link from "@/components/ui/Link";
import type { Metadata } from "next";
import { BRANCHES, SITE_URL, type Branch } from "@/lib/config";
import { canonical, resumen, branchNodeId, absoluteUrl, SITE_NAME, type Faq } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { localidadesDeSucursal } from "@/lib/localidades";
import { formatPrecio } from "@/lib/servicios";
import { poolShare } from "@/lib/share-image";
import { datosSucursal } from "./[id]/datos";
import { ListaSucursales, type SucursalItem } from "./ListaSucursales";
import { LazyBranchesMap } from "./LazyBranchesMap";

const abiertas = BRANCHES.filter((b) => !b.apertura);
const porAbrir = BRANCHES.filter((b) => b.apertura);

export const metadata: Metadata = (() => {
  const title = "Sucursales: gomería y neumáticos en Córdoba y Buenos Aires";
  const principal = abiertas[0];
  const description = resumen(
    `Dirección, horarios, teléfono y cómo llegar a Neumáticos Trivium. ${principal ? `Gomería abierta en ${principal.neighborhood ?? principal.city}, ${principal.hours}, sin turno. ` : ""}${
      porAbrir.length ? `Próximas aperturas: ${porAbrir.map((b) => `${b.shortName} (${b.apertura})`).join(" y ")}.` : ""
    }`
  );
  return {
    title,
    description,
    alternates: canonical("/sucursales"),
    openGraph: {
      type: "website",
      title: `${title} — ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/sucursales`,
      siteName: SITE_NAME,
      locale: "es_AR",
      ...poolShare("sucursales").openGraph,
    },
    twitter: poolShare("sucursales").twitter,
  };
})();

/** "Alineado y balanceado" en Córdoba (así se busca ahí); "alineación y balanceo" en el resto. */
function taller(branch: Branch): string {
  return branch.id === "arguello" ? "Alineado y balanceado" : "Alineación y balanceo";
}

function lugarDe(b: Branch) {
  return b.neighborhood ?? b.city;
}

function buildFaqs(items: SucursalItem[]): Faq[] {
  const abiertasItems = items.filter((i) => !i.branch.apertura);
  const ab = abiertasItems[0];
  const lista = (bs: Branch[]) => bs.map((b) => `${b.shortName} (${b.address}, ${b.city})`).join("; ");
  const faqs: Faq[] = [
    {
      question: "¿Dónde están las sucursales de Neumáticos Trivium?",
      answer:
        (abiertas.length
          ? `Hoy atendemos en ${lista(abiertas)}. `
          : "") +
        (porAbrir.length
          ? `Próximas aperturas: ${porAbrir.map((b) => `${b.shortName} (${b.address}, ${b.city}) abre ${b.apertura}`).join("; ")}. `
          : "") +
        "En cada ficha ves la dirección exacta, el horario y el botón de cómo llegar.",
    },
  ];
  if (ab) {
    faqs.push(
      {
        question: `¿Qué horario tiene la gomería de ${lugarDe(ab.branch)}?`,
        answer: `${ab.branch.hours}. Atendemos por orden de llegada y sin turno. Si querés saber cuánta espera hay antes de venir, escribinos por WhatsApp al ${ab.branch.phone}.`,
      },
      {
        question: "¿Necesito turno para cambiar los neumáticos o alinear?",
        answer:
          "No. Atendemos por orden de llegada. Comprando las cubiertas en el local, el montaje, el desmontaje y el cambio de válvulas van sin cargo; la alineación y el balanceo se cobran aparte porque son servicios de taller con equipo propio.",
      },
      {
        question: "¿Qué servicios hay en cada sucursal?",
        answer:
          `En ${ab.branch.shortName} hay neumáticos nuevos con stock propio, ${taller(ab.branch).toLowerCase()} con equipos computarizados, montaje y cambio de válvulas` +
          (ab.combo !== null ? `. El combo ${taller(ab.branch).toLowerCase()} para auto sale desde ${formatPrecio(ab.combo)}` : "") +
          (ab.desde !== null ? `, y los neumáticos nuevos arrancan en ${formatPrecio(ab.desde)} por unidad` : "") +
          ". Las sucursales que todavía no abrieron no prestan servicios hasta su apertura.",
      },
      {
        question: "¿El precio de la web es el mismo que en el local?",
        answer:
          "Sí. El precio y el stock publicados en la web son los del mostrador de cada sucursal. Si un neumático figura disponible, está físicamente en el local.",
      },
      {
        question: "¿Qué formas de pago aceptan?",
        answer: "Efectivo, débito, crédito, transferencia y Mercado Pago.",
      }
    );
  }
  if (porAbrir.length) {
    faqs.push({
      question: "¿Cuándo abren las próximas sucursales?",
      answer: porAbrir
        .map((b) => `${b.shortName} (${b.address}, ${b.city}) abre ${b.apertura}`)
        .join("; ") + ". Mientras tanto podés ver los precios y las medidas en la web y usar la sucursal abierta que te quede más cerca.",
    });
  }
  return faqs;
}

export default async function SucursalesPage() {
  const items: SucursalItem[] = await Promise.all(
    BRANCHES.map(async (branch) => {
      const d = await datosSucursal(branch);
      return {
        branch,
        desde: d.desde,
        combo: d.combo.auto?.precio ?? null,
        taller: taller(branch),
        zonas: localidadesDeSucursal(branch.id).map((l) => l.name),
      };
    })
  );
  const faqs = buildFaqs(items);
  const principal = items.find((i) => !i.branch.apertura);

  // Las fichas TireShop completas ya salen del grafo del layout raíz: acá sólo
  // se referencian por @id, sin duplicar nodos.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/sucursales")}#pagina`,
    url: absoluteUrl("/sucursales"),
    name: "Sucursales de Neumáticos Trivium",
    inLanguage: "es-AR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: BRANCHES.length,
      itemListElement: BRANCHES.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/sucursales/${b.id}`),
        item: { "@id": branchNodeId(b) },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <JsonLd data={jsonLd} />

      <header className="relative isolate overflow-hidden bg-black pb-8 pt-6 md:pb-12 md:pt-8">
        {/* Foto del local de fondo, con transparencia: se funde con el negro hacia la izquierda, donde va el texto. */}
        <Image
          src="/images/branches/arguello-fachada.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[center_35%] opacity-60"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-transparent md:via-black/60" />
        <div className="mx-auto max-w-7xl px-4 2xl:max-w-[96rem]">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Inicio", path: "/" },
              { name: "Sucursales", path: "/sucursales" },
            ]}
          />
          <div className="max-w-3xl">
            <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
              Sucursales de Neumáticos Trivium
            </h1>
            <p className="mt-2 text-lg font-bold text-[#ff1e00] md:text-xl">
              Gomería y neumáticos baratos en Córdoba y Buenos Aires
            </p>
            <p data-speakable className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
              {principal ? (
                <>
                  Abrimos en <strong className="text-white">{principal.branch.address}, {principal.branch.city}</strong>,{" "}
                  {principal.branch.hours.toLowerCase()}, sin turno: neumáticos nuevos con stock propio y{" "}
                  {principal.taller.toLowerCase()} en el mismo lugar.
                </>
              ) : (
                <>Neumáticos nuevos con stock propio y taller de alineación y balanceo.</>
              )}{" "}
              {porAbrir.length > 0 && (
                <>
                  Próximas aperturas:{" "}
                  {porAbrir.map((b, i) => (
                    <span key={b.id}>
                      {i > 0 && " y "}
                      <strong className="text-white">{b.shortName}</strong> ({b.apertura})
                    </span>
                  ))}
                  .
                </>
              )}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-white">
              {["Sin turno", "Colocación sin cargo comprando acá", "1 año de garantía", "Precio de la web = precio del local"].map((t) => (
                <li key={t} className="rounded-full bg-white/10 px-3 py-1.5">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-10 2xl:max-w-[96rem]">
          <ListaSucursales items={items} />

          {/* Qué hay en cada una y a quién atiende: contenido propio y rastreable, no sólo el mapa. */}
          <section className="mt-12">
            <h2 className="text-2xl font-black text-navy-900">Zonas que atiende cada sucursal</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map(({ branch }) => {
                const locs = localidadesDeSucursal(branch.id);
                return (
                  <div key={branch.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="font-black text-navy-900">
                      <Link href={`/sucursales/${branch.id}`} className="hover:text-[#ff1e00]">
                        {branch.shortName}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {branch.address}, {branch.city}
                    </p>
                    {branch.areaServed.length > 0 && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        {branch.apertura ? "Va a atender: " : "Atiende: "}
                        {branch.areaServed.join(", ")}.
                      </p>
                    )}
                    {locs.length > 0 && !branch.apertura && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {locs.slice(0, 8).map((l) => (
                          <li key={l.slug}>
                            <Link
                              href={`/neumaticos-en/${l.slug}`}
                              className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-navy-800 transition-colors hover:bg-[#ff1e00] hover:text-white"
                            >
                              Neumáticos en {l.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <LazyBranchesMap branches={BRANCHES} />

        <div className="mx-auto max-w-4xl px-4 pb-12">
          <FaqSection faqs={faqs} title="Preguntas frecuentes sobre las sucursales" />

          <nav aria-label="Seguí explorando" className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { href: "/servicios", t: "Servicios de gomería", d: "Alineado, balanceo y montaje, con precios." },
              { href: "/catalogo", t: "Ver neumáticos con stock", d: "Buscá tu medida y mirá el precio." },
              { href: "/contacto", t: "Contacto", d: "WhatsApp, teléfono y formulario." },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-[#ff1e00]"
              >
                <span className="block font-black text-navy-900">{l.t}</span>
                <span className="mt-1 block text-sm text-slate-600">{l.d}</span>
              </Link>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}
