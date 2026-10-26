import Link from "@/components/ui/Link";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { blogMeta } from "@/lib/blog-meta";
import { BlogCover } from "@/components/blog/BlogCover";

/**
 * Atajos de compra para quien llegó por una duda puntual: la sección más
 * visible de la nota. Botones grandes en grilla de dos columnas (cómodos para
 * el pulgar en móvil); el primero va relleno de rojo Trivium y es el camino
 * principal, los demás son secundarios.
 */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function BlogShopLinks({ slug }: { slug: string }) {
  const { shopIntro, shopLinks } = blogMeta(slug);
  return (
    <nav
      aria-label="Productos relacionados con esta nota"
      className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-black p-4 shadow-lg sm:p-5"
    >
      <p className="mb-1 text-xs font-black uppercase tracking-widest text-orange-400">
        Mirá en el catálogo
      </p>
      <p className="mb-4 text-lg font-black leading-snug text-white">{shopIntro}</p>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {shopLinks.map((l, i) => (
          <li key={l.href} className={i === 0 && shopLinks.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""}>
            <Link
              href={l.href}
              className={`flex min-h-14 items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-black leading-tight !no-underline transition-all active:scale-[0.97] ${
                i === 0
                  ? "bg-orange-500 !text-white shadow-md shadow-orange-900/30 hover:bg-orange-600"
                  : "border border-white/15 bg-white/10 !text-white hover:border-orange-400 hover:bg-white/20"
              }`}
            >
              <span>{l.label}</span>
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  i === 0 ? "bg-white text-orange-600" : "bg-orange-500 text-white"
                }`}
              >
                <ArrowIcon />
              </span>
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
