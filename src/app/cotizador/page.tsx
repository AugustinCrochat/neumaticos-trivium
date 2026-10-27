import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { absoluteUrl, breadcrumbJsonLd, canonical, SITE_NAME } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { sizeCatalogHref } from "@/lib/size-href";
import { poolShare } from "@/lib/share-image";
import { CotizadorClient, type QuoteProduct } from "./CotizadorClient";
import type { MedidaDisponible } from "./CotizadorSelector";

const TITLE = "Cotizador de neumáticos en Córdoba: armá tu presupuesto";
const DESCRIPTION =
  "Elegí tu medida o tu auto, mirá los neumáticos con stock y precio real, sumá alineado y balanceado y armá tu presupuesto al instante. Compartilo por WhatsApp y coordiná en el local de Córdoba.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/cotizador"),
  openGraph: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION, url: "/cotizador", ...poolShare("cotizador").openGraph },
  twitter: poolShare("cotizador").twitter,
};

const FAQS = [
  {
    question: "¿Los precios del cotizador son finales?",
    answer:
      "Son los precios de lista del local, con IVA incluido, para retirar en la sucursal. No incluyen envío. El precio y el stock se confirman al coordinar la compra.",
  },
  {
    question: "¿Cuántos neumáticos conviene cotizar?",
    answer:
      "Lo habitual es un juego de 4, pero podés cotizar 1, 2 o la cantidad que necesites.",
  },
  {
    question: "¿Cómo sé qué medida necesita mi auto?",
    answer:
      "Está en el lateral del neumático, con un formato como 205/55 R16 (ancho, perfil y rodado). También podés elegir tu auto en el cotizador y te mostramos la medida de fábrica, o consultarnos por WhatsApp.",
  },
  {
    question: "¿Puedo sumar alineado y balanceado al presupuesto?",
    answer:
      "Sí. Una vez que agregás los neumáticos, el cotizador te ofrece sumar alineado y balanceado de las 4 ruedas, y también tuercas antirrobo para tu auto.",
  },
  {
    question: "¿Qué medios de pago puedo usar?",
    answer:
      "Efectivo (con descuento), tarjetas Visa y Mastercard, Mercado Pago, Tarjeta Naranja y GOcuotas. El cotizador calcula las cuotas disponibles sobre el total de tu presupuesto.",
  },
  {
    question: "¿Los neumáticos tienen garantía?",
    answer:
      "Sí, todos los neumáticos nuevos tienen 1 año de garantía por defecto de fabricación, gestionada directo con nosotros en el local.",
  },
  {
    question: "¿Cotizar me obliga a comprar?",
    answer:
      "No. Es una herramienta para que veas el total antes de decidir. Si querés avanzar, compartís el presupuesto por WhatsApp y coordinamos la compra o la reserva.",
  },
];

const COMO_FUNCIONA = [
  { n: "1", titulo: "Elegí tu medida", texto: "Por medida, por modelo de auto o buscando la marca. Si no sabés cuál es, te ayudamos." },
  { n: "2", titulo: "Mirá los neumáticos con stock", texto: "Ves precio real, tipo (calle, A/T o carga) y disponibilidad. Agregás los que querés." },
  { n: "3", titulo: "Sumá servicios", texto: "Alineado y balanceado, tuercas antirrobo y el cálculo de cuotas según cómo prefieras pagar." },
  { n: "4", titulo: "Compartilo o pasá por el local", texto: "Mandás el presupuesto por WhatsApp y coordinamos. Sin compromiso." },
];

export default async function CotizadorPage() {
  const sucursal = await getSelectedBranchSlug();
  const productos = await getProductosDesdePOS(sucursal);
  const conStock = productos.filter((p) => p.enStock);

  const porMedida = new Map<string, MedidaDisponible>();
  for (const p of conStock) {
    const k = `${p.size.width}-${p.size.profile}-${p.size.rim}`;
    const actual = porMedida.get(k);
    if (actual) actual.n += 1;
    else porMedida.set(k, { w: p.size.width, p: p.size.profile, r: p.size.rim, n: 1 });
  }
  const medidas = [...porMedida.values()];

  const vistos = new Set<string>();
  const destacados = [...conStock]
    .filter((p) => !p.isCarga && !p.isAT)
    .sort((a, b) => (b.vendidos ?? 0) - (a.vendidos ?? 0) || a.price - b.price)
    .filter((p) => {
      const k = `${p.brand} ${p.model}`;
      if (vistos.has(k)) return false;
      vistos.add(k);
      return true;
    })
    .slice(0, 8)
    .map((p): QuoteProduct & { medida: string } => ({
      id: p.id,
      label: `${p.brand} ${p.model}`,
      price: p.price,
      imageUrl: p.imageUrl,
      brand: p.brand,
      model: p.model,
      slug: p.slug,
      medida: `${p.size.width}/${p.size.profile} R${p.size.rim}`,
    }));

  const medidasPopulares = [...medidas].sort((a, b) => b.n - a.n).slice(0, 12);

  return (
    <div className="bg-slate-50">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Cotizador", path: "/cotizador" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Cotizador de neumáticos",
          description: DESCRIPTION,
          url: absoluteUrl("/cotizador"),
          applicationCategory: "ShoppingApplication",
          operatingSystem: "Web",
          inLanguage: "es-AR",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 pt-4">
        <Breadcrumbs
          crumbs={[
            { name: "Inicio", path: "/" },
            { name: "Cotizador", path: "/cotizador" },
          ]}
        />
      </div>

      <section className="relative overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-orange-600/15 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-7 md:py-12">
          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Cotizador de neumáticos <span className="text-orange-500">en Córdoba</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Elegí tu medida o tu auto, mirá los neumáticos que hay en stock con su precio real y armá tu presupuesto en
            un minuto. Después lo compartís por WhatsApp, sin compromiso.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs font-bold md:mt-6 md:gap-2.5 md:text-sm">
            {["Precio con IVA incluido", "Stock real del local", "1 año de garantía", "Alineado y balanceado en el mismo lugar"].map((t) => (
              <li key={t} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <span className="text-orange-400">&#10003;</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <CotizadorClient medidas={medidas} destacados={destacados} />

        <section className="mt-16">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Cómo funciona el cotizador</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {COMO_FUNCIONA.map((p) => (
              <div key={p.n} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-black text-white">{p.n}</span>
                <div>
                  <h3 className="font-black text-navy-900">{p.titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {medidasPopulares.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-black text-navy-900">Medidas más cotizadas</h2>
            <p className="mt-2 text-slate-600">
              Entrá a la medida para ver todos los modelos con stock, o elegila arriba y sumala a tu presupuesto.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {medidasPopulares.map((m) => (
                <li key={`${m.w}-${m.p}-${m.r}`}>
                  <Link
                    href={sizeCatalogHref(String(m.w), String(m.p), String(m.r))}
                    className="inline-block rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-black text-navy-900 transition-colors hover:border-orange-500 hover:text-orange-600"
                  >
                    {m.w}/{m.p} R{m.r}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { href: "/servicios", t: "Alineado y balanceado", d: "Servicio en el mismo local donde comprás." },
            { href: "/garantia-neumaticos", t: "Garantía de 1 año", d: "Por defecto de fabricación, gestionada con nosotros." },
            { href: "/calculadora-equivalencia-neumaticos", t: "Calculadora de equivalencia", d: "Compará medidas antes de cambiar de rodado." },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg">
              <h3 className="font-black text-navy-900">{l.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{l.d}</p>
              <span className="mt-3 inline-block text-sm font-black text-orange-600">Ver más &rarr;</span>
            </Link>
          ))}
        </section>

        <FaqSection faqs={FAQS} />
      </div>
    </div>
  );
}
