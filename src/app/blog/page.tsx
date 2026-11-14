import Link from "@/components/ui/Link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/data";
import { blogMeta } from "@/lib/blog-meta";
import { BlogCover } from "@/components/blog/BlogCover";
import { canonical, resumen } from "@/lib/seo";
import { PrecioTag } from "@/components/ui/PrecioTag";
import { preciosAncla } from "@/components/home/HeroTrustRow";
import { getProductosDesdePOS, getServiciosPrecios } from "@/lib/pos-api";
import { money } from "@/lib/precios-hoy";
import { COMBO_ID, preciosTaller } from "@/lib/servicios-seo";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";

export const metadata: Metadata = {
  title: "Guías de neumáticos — mantenimiento, medidas y marcas",
  description:
    resumen("Cómo leer la medida, cada cuánto cambiar las cubiertas, qué marcas convienen y cómo funcionan las equivalencias. Guías escritas por quienes venden y montan neumáticos todos los días."),
  alternates: canonical("/blog"),
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Flechas = () => (
  <svg aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="square" d="M5 5l7 7-7 7M13 5l7 7-7 7" />
  </svg>
);

export default async function BlogPage() {
  // Precios de hoy arriba de las notas: quien entra al blog a leer también ve,
  // sin buscarlo, cuánto sale su medida y el alineado.
  const [productos, servicios] = await Promise.all([getProductosDesdePOS(), getServiciosPrecios()]);
  const medidas = preciosAncla(productos, 5);
  const combo = preciosTaller(servicios).comboAuto;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-black py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4">
          <span className="mb-3 inline-block -skew-x-12 bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
            <span className="inline-block skew-x-12">Blog de la gomería</span>
          </span>
          <h1 className="text-5xl font-extrabold leading-[0.95] text-white md:text-6xl">
            Guías de neumáticos y taller
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-snug text-slate-300">
            Escritas por quienes venden, colocan y alinean neumáticos todos los días.
          </p>
        </div>
      </div>

      {(medidas.length > 0 || combo) && (
        <div className="border-b-2 border-black bg-white">
          <div className="mx-auto flex max-w-5xl items-center gap-3 overflow-x-auto px-4 py-3">
            <span className="font-display shrink-0 text-xl font-extrabold uppercase italic text-black">Precios de hoy</span>
            {medidas.map((a) => (
              <Link key={sizeSlug(a.size)} href={`/neumaticos/${sizeSlug(a.size)}`} className="flex shrink-0 items-center gap-2 rounded-md border-2 border-black py-1 pl-2.5 pr-1 text-sm font-black text-black transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#ff1e00]">
                {formatSize(a.size)} <PrecioTag size="sm">{money(a.precio)}</PrecioTag>
              </Link>
            ))}
            {combo && (
              <Link href={`/servicios/${COMBO_ID}`} className="flex shrink-0 items-center gap-2 rounded-md border-2 border-black py-1 pl-2.5 pr-1 text-sm font-black text-black transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#ff1e00]">
                Alineado + balanceado <PrecioTag size="sm">{money(combo)}</PrecioTag>
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border-2 border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-[5px_5px_0_0_#ff1e00]"
            >
              <BlogCover image={blogMeta(post.slug).cover} className="aspect-[2/1]" />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="-skew-x-12 bg-black px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                    <span className="inline-block skew-x-12">{post.category}</span>
                  </span>
                  <time className="text-xs text-slate-500" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>

                <h2 className="mb-2 font-sans text-lg font-black normal-case not-italic leading-snug tracking-normal text-black">
                  {post.title}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-black text-orange-600 after:absolute after:inset-0 after:content-['']"
                >
                  Leer la guía
                  <Flechas />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
