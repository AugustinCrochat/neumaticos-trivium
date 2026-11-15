import Link from "@/components/ui/Link";
import { BlogCover } from "@/components/blog/BlogCover";
import { PrecioTag } from "@/components/ui/PrecioTag";
import { preciosAncla } from "@/components/home/HeroTrustRow";
import { BLOG_CATEGORIAS, type BlogCategoria } from "@/lib/blog-categorias";
import { blogMeta } from "@/lib/blog-meta";
import { BLOG_POSTS } from "@/lib/data";
import { getProductosDesdePOS, getServiciosPrecios } from "@/lib/pos-api";
import { money } from "@/lib/precios-hoy";
import { COMBO_ID, preciosTaller } from "@/lib/servicios-seo";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

const Flechas = () => (
  <svg aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="square" d="M5 5l7 7-7 7M13 5l7 7-7 7" />
  </svg>
);

/**
 * Listado del blog: el índice general y cada página de categoría usan el mismo
 * armado (encabezado, cinta de precios, chips de categoría y grilla).
 */
export async function BlogListado({ categoria }: { categoria?: BlogCategoria }) {
  // Precios de hoy arriba de las notas: quien entra al blog a leer también ve,
  // sin buscarlo, cuánto sale su medida y el alineado.
  const [productos, servicios] = await Promise.all([getProductosDesdePOS(), getServiciosPrecios()]);
  const medidas = preciosAncla(productos, 8);
  const combo = preciosTaller(servicios).comboAuto;
  const etiqueta = "flex shrink-0 items-center gap-2 rounded-md border-2 border-black py-1 pl-2.5 pr-1 text-sm font-black text-black hover:bg-slate-100";
  const posts = categoria ? BLOG_POSTS.filter((p) => p.category === categoria.categoria) : BLOG_POSTS;
  const chip = (activo: boolean) =>
    `shrink-0 rounded-md border-2 px-3 py-1.5 text-sm font-black !no-underline transition-colors ${activo ? "border-black bg-black !text-white" : "border-slate-300 bg-white !text-black hover:border-black"}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-black py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4">
          <span className="mb-3 inline-block -skew-x-12 bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
            <span className="inline-block skew-x-12">Blog de la gomería</span>
          </span>
          <h1 className="text-5xl font-extrabold leading-[0.95] text-white md:text-6xl">
            {categoria ? categoria.h1 : "Guías de neumáticos y taller"}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-snug text-slate-300">
            {categoria ? categoria.bajada : "Escritas por quienes venden, colocan y alinean neumáticos todos los días."}
          </p>
        </div>
      </div>

      {(medidas.length > 0 || combo) && (
        <div className="flex items-stretch border-b-2 border-black bg-white">
          <span className="font-display z-10 flex shrink-0 items-center bg-black px-4 text-xl font-extrabold uppercase italic text-white">Precios de hoy</span>
          {/* Cinta que avanza sola: dos copias iguales, la segunda oculta a lectores de pantalla. */}
          <div className="cinta-caja min-w-0 flex-1 overflow-hidden py-3">
            <div className="cinta flex w-max">
              {[0, 1].map((copia) => (
                <div key={copia} aria-hidden={copia === 1} className="flex gap-3 pr-3">
                  {medidas.map((a) => (
                    <Link key={sizeSlug(a.size)} tabIndex={copia === 1 ? -1 : undefined} href={`/neumaticos/${sizeSlug(a.size)}`} className={etiqueta}>
                      {formatSize(a.size)} <PrecioTag size="sm">{money(a.precio)}</PrecioTag>
                    </Link>
                  ))}
                  {combo && (
                    <Link tabIndex={copia === 1 ? -1 : undefined} href={`/servicios/${COMBO_ID}`} className={etiqueta}>
                      Alineado + balanceado <PrecioTag size="sm">{money(combo)}</PrecioTag>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Temas: cada chip es una página propia, no un filtro. */}
        <nav aria-label="Temas del blog" className="mb-8 flex gap-2 overflow-x-auto pb-1">
          <Link href="/blog" aria-current={categoria ? undefined : "page"} className={chip(!categoria)}>Todas</Link>
          {BLOG_CATEGORIAS.map((c) => (
            <Link key={c.slug} href={`/blog/categoria/${c.slug}`} aria-current={categoria?.slug === c.slug ? "page" : undefined} className={chip(categoria?.slug === c.slug)}>
              {c.chip}
            </Link>
          ))}
          <Link href="/opiniones-y-comparativas" className={chip(false)}>Opiniones y comparativas</Link>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
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
