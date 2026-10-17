import Link from "next/link";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { blogMeta } from "@/lib/blog-meta";
import { BlogCover } from "@/components/blog/BlogCover";

/**
 * Atajos de compra para quien llegó por una duda puntual: links a las
 * categorías relacionadas con la nota. En móvil se desplazan de costado para
 * no empujar el texto hacia abajo.
 */
export function BlogShopLinks({ slug }: { slug: string }) {
  const { shopIntro, shopLinks } = blogMeta(slug);
  return (
    <nav aria-label="Productos relacionados con esta nota" >
      <p className="mb-2 text-sm font-black text-navy-900">{shopIntro}</p>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {shopLinks.map((l) => (
          <li key={l.href} className="shrink-0">
            <Link
              href={l.href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-navy-900 !text-navy-900 !no-underline shadow-sm transition-colors hover:border-orange-500 hover:!text-orange-600 active:scale-[0.98]"
            >
              {l.label}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Buscador por medida o por auto, con los atajos de la nota debajo. */
export function BlogSearchCard({ slug, title = "Buscá tu medida" }: { slug: string; title?: string }) {
  return (
    <section
      aria-label={title}
      className="my-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <h2 className="mb-1 text-xl font-black text-navy-900">{title}</h2>
      <p className="!mb-4 !text-base text-slate-500">
        Elegí tu medida o tu auto y mirá precio y stock al instante.
      </p>
      <SizeOrVehicleSearch compact hideLearnLink />
      <div className="mt-5">
        <BlogShopLinks slug={slug} />
      </div>
    </section>
  );
}

/**
 * Portada y atajos para las notas con maquetado propio (las que no usan
 * ArticleLayout). Lleva su propio ancho y márgenes.
 */
export function BlogCoverStrip({ slug }: { slug: string }) {
  const { cover } = blogMeta(slug);
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <BlogCover image={cover} priority sizes="(min-width: 768px) 768px, 100vw" className="aspect-[16/9] rounded-2xl sm:aspect-[2/1]" />
      <div className="mt-5">
        <BlogShopLinks slug={slug} />
      </div>
    </div>
  );
}

/** Buscador a ancho de columna para las notas con maquetado propio. */
export function BlogSearchStrip({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <BlogSearchCard slug={slug} />
    </div>
  );
}
