import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { DEFAULT_BRANCH_ID, SITE_URL } from "@/lib/config";
import { AccessoryConsult } from "@/components/ui/AccessoryConsult";

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
  const title = `${accessory.nombre} — Neumáticos Trivium`;
  const description = accessory.descripcion
    ? `${accessory.nombre}. Compatible con: ${accessory.descripcion}.`
    : `Comprá ${accessory.nombre} al mejor precio, colocación sin cargo en nuestra sucursal.`;
  const pageUrl = `${SITE_URL}/tuercas-antirrobo/${accessory.slug}`;
  const images = accessory.imageUrl ? [accessory.imageUrl] : [];
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

const LOCK_SVG = (
  <svg className="w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none">
    <rect x="25" y="45" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="8" />
    <path d="M35 45V32a15 15 0 0 1 30 0v13" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <circle cx="50" cy="63" r="6" fill="currentColor" />
  </svg>
);

export default async function AccessoryPage({ params }: Props) {
  const { slug } = await params;
  const accesorios = await getAccesoriosDesdePOS(await getSelectedBranchSlug());
  const accessory = accesorios.find((a) => a.slug === slug);
  if (!accessory) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 pt-3 pb-4 md:pt-4 md:pb-6">
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
        <div className="bg-slate-50 rounded-2xl aspect-square flex items-center justify-center p-8 relative">
          {accessory.imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={accessory.imageUrl}
                alt={accessory.nombre}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="w-48 h-48">{LOCK_SVG}</div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-6 leading-tight">{accessory.nombre}</h1>

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
            <p className="text-xs text-slate-400 mt-1 mb-4">Precio por juego · IVA incluido</p>
            <AccessoryConsult accessory={accessory} />
          </div>
        </div>
      </div>

      {accessory.descripcion && (
        <div className="mt-14 pt-10 border-t border-slate-100">
          <h2 className="text-lg font-black text-navy-900 mb-4 uppercase tracking-wide">Compatible con</h2>
          <p className="text-slate-600 leading-relaxed">{accessory.descripcion}</p>
        </div>
      )}
    </div>
  );
}
