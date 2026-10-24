import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { DEFAULT_BRANCH_ID, SITE_URL } from "@/lib/config";
import { AccessoryConsult } from "@/components/ui/AccessoryConsult";
import { AccessoryGallery } from "@/components/ui/AccessoryGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION_ID } from "@/lib/seo";
import { TUERCA_FOTO_TALLER, tuercaCardPath } from "@/lib/tuercas-fotos";

type Props = { params: Promise<{ slug: string }> };

// Mismo caso que /productos/[slug]: con generateStaticParams las tuercas que
// ya están en el POS salen prerenderizadas y las nuevas se generan on-demand,
// pero cacheadas. Sin esto la ruta era totalmente dinámica.
export async function generateStaticParams() {
  const accesorios = await getAccesoriosDesdePOS(DEFAULT_BRANCH_ID);
  return accesorios.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const accesorios = await getAccesoriosDesdePOS(await getSelectedBranchSlug());
  const accessory = accesorios.find((a) => a.slug === slug);
  if (!accessory) return {};
  const title = accessory.nombre;
  const description = accessory.descripcion
    ? `${accessory.nombre}. Compatible con: ${accessory.descripcion}. Incluye 2 llaves.`
    : `Comprá ${accessory.nombre} al mejor precio, con 2 llaves y colocación sin cargo en nuestra sucursal.`;
  const pageUrl = `${SITE_URL}/tuercas-antirrobo/${accessory.slug}`;
  const card = tuercaCardPath(accessory.codigoTango, accessory.slug);
  const images = [...(accessory.imageUrl ? [accessory.imageUrl] : []), ...(card ? [`${SITE_URL}${card}`] : [])];
  return {
    title,
    description,
    openGraph: { title, description, url: pageUrl, siteName: "Neumáticos Trivium", images, type: "website" },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function AccessoryPage({ params }: Props) {
  const { slug } = await params;
  const accesorios = await getAccesoriosDesdePOS(await getSelectedBranchSlug());
  const accessory = accesorios.find((a) => a.slug === slug);
  if (!accessory) notFound();

  const card = tuercaCardPath(accessory.codigoTango, accessory.slug);
  const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: accessory.nombre,
    description: `${accessory.nombre}.${accessory.descripcion ? ` Compatible con: ${accessory.descripcion}.` : ""} Incluye 2 llaves.`,
    image: [accessory.imageUrl, card, TUERCA_FOTO_TALLER.src].filter((x): x is string => !!x).map(abs),
    sku: accessory.codigoTango ?? accessory.id,
    mpn: accessory.codigoTango ?? accessory.id,
    url: `${SITE_URL}/tuercas-antirrobo/${accessory.slug}`,
    additionalProperty: [{ "@type": "PropertyValue", name: "Incluye", value: "2 llaves" }],
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/tuercas-antirrobo/${accessory.slug}`,
      priceCurrency: "ARS",
      price: accessory.price,
      availability: accessory.enStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORGANIZATION_ID },
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-3 pb-4 md:pt-4 md:pb-6">
      <JsonLd data={productJsonLd} />
      <Link
        href="/tuercas-antirrobo"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 mb-3 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Tuercas Antirrobo
      </Link>

      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 gap-4 md:gap-12">
        <AccessoryGallery
          nombre={accessory.nombre}
          imageUrl={accessory.imageUrl}
          cardSrc={card}
          tallerFoto={TUERCA_FOTO_TALLER}
        />

        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-4 leading-tight">{accessory.nombre}</h1>

          <p className="mb-6 inline-flex items-start gap-2 self-start rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a4 4 0 11-7.9 1L2 13v3h3v-2h2v-2h2l1.6-1.6A4 4 0 0015 7z" />
            </svg>
            <span>
              Incluye 2 llaves
              <span className="block text-xs font-semibold text-red-600">Una de repuesto por si perdés la otra.</span>
            </span>
          </p>

          <div className="border-t border-slate-100 pt-6 mt-auto">
            {accessory.priceOld && (
              <div className="mb-1 flex items-center gap-2">
                <span className="text-slate-400 line-through text-base">{formatPrice(accessory.priceOld)}</span>
                <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-black text-white">
                  {Math.round(((accessory.priceOld - accessory.price) / accessory.priceOld) * 100)}% OFF
                </span>
              </div>
            )}
            <span className="text-4xl font-black text-red-600">{formatPrice(accessory.price)}</span>
            <p className="text-xs text-slate-400 mt-1 mb-4">Precio por juego, con 2 llaves · IVA incluido</p>
            <AccessoryConsult accessory={accessory} />
          </div>
        </div>
      </div>

      <div className="mt-14 pt-10 border-t border-slate-100">
        <h2 className="text-lg font-black text-navy-900 mb-4 uppercase tracking-wide">Qué incluye</h2>
        <p className="text-slate-600 leading-relaxed">
          El juego viene con <strong>2 llaves</strong>: usás una y guardás la otra de repuesto, así que si perdés la
          llave no te quedás sin poder sacar las ruedas. Si igual te pasa, mirá{" "}
          <Link href="/blog/extraccion-de-tuercas-de-seguridad" className="font-bold text-navy-700 underline">
            qué se puede hacer sin la llave
          </Link>{" "}
          y cómo funcionan las{" "}
          <Link href="/blog/tuercas-y-bulones-de-seguridad" className="font-bold text-navy-700 underline">
            tuercas y bulones de seguridad
          </Link>
          .
        </p>
      </div>

      {accessory.descripcion && (
        <div className="mt-10 pt-10 border-t border-slate-100">
          <h2 className="text-lg font-black text-navy-900 mb-4 uppercase tracking-wide">Compatible con</h2>
          <p className="text-slate-600 leading-relaxed">{accessory.descripcion}</p>
        </div>
      )}
    </div>
  );
}
