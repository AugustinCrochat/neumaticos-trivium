import Link from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { estaPublicada } from "@/lib/publicacion";
import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { BLOG_POSTS, fechaDeNota } from "@/lib/data";
import { blogMeta } from "@/lib/blog-meta";
import { categoriaPorNombre, estiloCategoria } from "@/lib/blog-categorias";
import { BlogCover } from "@/components/blog/BlogCover";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogSearchCard, BlogShopLinks } from "@/components/blog/BlogShop";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { SizesCatalog } from "@/components/blog/SizesCatalog";
import { BRANCHES } from "@/lib/config";
import { COMBO_ID } from "@/lib/servicios-seo";
import { absoluteUrl, ORGANIZATION_ID, SITE_NAME } from "@/lib/seo";
import { WhatsAppSucursal } from "@/components/ui/SucursalBits";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Faq } from "@/lib/seo";

// La tipografía del cuerpo se define una sola vez con selectores descendentes,
// así las notas escriben HTML plano sin clases. Es una constante porque el
// texto se parte en dos tramos (ver ArticleLayout) y ambos deben verse igual.
const TYPO = `
  [&_a]:font-bold [&_a]:text-navy-800 [&_a]:underline [&_a]:underline-offset-2
  [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:border-l-[6px] [&_h2]:border-orange-500 [&_h2]:pl-3 [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:text-navy-900
  [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-navy-900
  [&_li]:leading-relaxed [&_li]:text-slate-600
  [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
  [&_p]:mb-5 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-slate-600
  [&_strong]:font-bold [&_strong]:text-navy-900
  [&_table]:mb-6 [&_table]:w-full [&_table]:text-left [&_table]:text-sm
  [&_td]:border-t [&_td]:border-slate-100 [&_td]:px-2 sm:[&_td]:px-3 [&_td]:py-2.5 [&_td]:text-slate-600
  [&_th]:bg-black [&_th]:px-2 sm:[&_th]:px-3 [&_th]:py-2.5 [&_th]:font-black [&_th]:text-white
  [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
`;

const COL = "mx-auto max-w-3xl px-4 lg:mx-0 lg:max-w-none lg:px-0";

const isH2 = (node: ReactNode) => isValidElement(node) && node.type === "h2";

/**
 * Envoltorio común de las notas del blog.
 *
 * Las notas viejas traen su propio maquetado completo, que quedó bien pero
 * obliga a repetir el schema, las migas y la tipografía en cada archivo. Las
 * nuevas usan esto para que escribir una nota sea escribir el texto y nada más,
 * y para que el BlogPosting salga siempre igual de completo.
 */
export function ArticleLayout({
  slug,
  title,
  subtitle,
  category,
  date: fechaPagina,
  updated,
  readingMinutes,
  faqs,
  extras,
  children,
}: {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  /** ISO (YYYY-MM-DD). */
  date: string;
  /** ISO. Sólo si el contenido se revisó después de publicarlo. */
  updated?: string;
  readingMinutes: number;
  faqs?: Faq[];
  /** Bloques con su propio estilo (no heredan la tipografía de la nota), después del texto y las preguntas. */
  extras?: ReactNode;
  children: ReactNode;
}) {
  // Nota programada: hasta su fecha la URL no existe (ver publicacion.ts).
  const date = fechaDeNota(slug) ?? fechaPagina;
  if (!estaPublicada(date)) notFound();
  const branch = BRANCHES[0];
  // Primero las de la misma categoría: quien leyó de alineado sigue con alineado.
  const otras = BLOG_POSTS.filter((p) => p.slug !== slug);
  const relacionadas = [...otras.filter((p) => p.category === category), ...otras.filter((p) => p.category !== category)].slice(0, 3);
  const deTaller = category === "Servicios" || category === "Mantenimiento";
  // Notas que ya traen su propia vidriera de productos: no se repite otra.
  const traeVidriera = Children.toArray(children).some((n) => isValidElement(n) && (n.type === CatalogWidget || n.type === SizesCatalog));
  const meta = blogMeta(slug);

  // El texto se parte en dos tramos para intercalar, sin que la tipografía
  // descendente de TYPO le pise los estilos, una foto (antes del 2.º h2) y el
  // buscador por medida (antes del 3.º h2, o del último si hay menos).
  const nodes = Children.toArray(children);
  const h2At = nodes.flatMap((n, i) => (isH2(n) ? [i] : []));
  const figureAt = h2At.length >= 2 ? h2At[1] : -1;
  const searchAt = h2At.length >= 2 ? h2At[Math.min(2, h2At.length - 1)] : nodes.length;
  const antes = nodes.slice(0, searchAt);
  const despues = nodes.slice(searchAt);
  if (figureAt >= 0) {
    antes.splice(
      figureAt,
      0,
      <figure key="blog-figure" className="my-10">
        <div
          className={`relative overflow-hidden rounded-lg border border-slate-200 bg-white ${
            meta.figure.portrait ? "mx-auto aspect-[4/5] max-w-sm" : "aspect-[16/10]"
          }`}
        >
          <Image
            src={meta.figure.src}
            alt={meta.figure.alt}
            fill
            sizes={meta.figure.portrait ? "384px" : "(min-width: 768px) 768px, 100vw"}
            className={meta.figure.fit === "contain" ? "object-contain p-4" : "object-cover"}
            style={meta.figure.position ? { objectPosition: meta.figure.position } : undefined}
          />
        </div>
        <figcaption className={`mt-2 text-sm text-slate-500 ${meta.figure.portrait ? "mx-auto max-w-sm" : ""}`}>
          {meta.figure.caption}
        </figcaption>
      </figure>,
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(`/blog/${slug}#article`),
    headline: title,
    description: subtitle,
    datePublished: date,
    dateModified: updated ?? date,
    articleSection: category,
    image: absoluteUrl(meta.cover.src),
    inLanguage: "es-AR",
    // El autor es la empresa, no una persona inventada: firmar con un nombre
    // que no existe es exactamente lo que las guidelines de E-E-A-T penalizan.
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${slug}`) },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={articleJsonLd} />

      {/* Encabezado en negro, como el header y la portada: la nota es parte del
          mismo local, no un blog aparte. */}
      <header className="bg-black py-8 text-white md:py-12">
        <div className="mx-auto max-w-7xl px-4 [&>*]:max-w-4xl">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Inicio", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: title, path: `/blog/${slug}` },
            ]}
          />
          {(() => {
            // La categoría enlaza a su página índice, cuando la tiene.
            const hub = categoriaPorNombre(category);
            const cls = `mb-3 inline-block -skew-x-12 ${estiloCategoria(category).fondo} px-3 py-1 text-xs font-black uppercase tracking-widest !text-white !no-underline`;
            return hub ? (
              <Link href={`/blog/categoria/${hub.slug}`} className={cls}><span className="inline-block skew-x-12">{category}</span></Link>
            ) : (
              <span className={cls}><span className="inline-block skew-x-12">{category}</span></span>
            );
          })()}
          <h1 className="text-4xl font-extrabold leading-[0.95] text-white md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{subtitle}</p>
          <p className="mt-5 text-sm text-slate-400">
            <time dateTime={updated ?? date}>
              {new Date(`${updated ?? date}T12:00:00`).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {" · "}
            {readingMinutes} min de lectura
            {" · "}
            {SITE_NAME}
          </p>
        </div>
      </header>

      {/* Escritorio: texto a la izquierda y columna fija de precios a la derecha,
          en vez de una columna angosta con márgenes vacíos. En celular la
          columna no se muestra: los mismos atajos van intercalados en el texto. */}
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 lg:px-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-16">
      <div className="min-w-0">
      {/* Portada y atajos a los productos del tema: lo primero que ve quien
          llegó por una duda puntual. */}
      <div className={`${COL} pt-8`}>
        <BlogCover
          image={meta.cover}
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className={`rounded-lg ${meta.cover.tall ? "aspect-[4/3]" : "aspect-[16/9] sm:aspect-[2/1]"}`}
        />
        <div className="mt-5">
          <BlogShopLinks slug={slug} />
        </div>
      </div>

      <div className={`${COL} pt-4 ${TYPO}`}>{antes}</div>

      <div className={COL}>
        <BlogSearchCard slug={slug} sinProductos={traeVidriera} />
      </div>

      <article className={`${COL} ${TYPO}`}>
        {despues}

        {faqs && faqs.length > 0 && <FaqSection faqs={faqs} />}
      </article>

      {extras && <div className="mx-auto max-w-3xl space-y-8 px-4 pb-4">{extras}</div>}

      <div className={`${COL} pb-12 ${TYPO}`}>
        {/* Cierre comercial: la nota atrae la visita informativa, este bloque
            la conecta con la página que vende. */}
        <aside className="mt-14 rounded-lg bg-black p-6 text-white sm:p-7">
          <h2 className="!mt-0 !border-0 !pl-0 !text-4xl !text-white">
            {deTaller ? "Traé el auto, sin turno" : "¿Te toca cambiar los neumáticos?"}
          </h2>
          <p className="!text-slate-300">
            {deTaller
              ? `Alineado 3D y balanceado por orden de llegada en ${branch.address}, ${branch.city}. Mirá el precio y qué incluye antes de venir.`
              : `Buscá tu medida y mirá precio y stock al instante. Importamos directo de fábrica y los colocamos sin cargo en ${branch.address}, ${branch.city}.`}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={deTaller ? `/servicios/${COMBO_ID}` : "/neumaticos"}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-orange-500 px-6 text-sm font-black !text-white !no-underline transition-transform active:scale-[0.98] hover:bg-orange-600"
            >
              {deTaller ? "Ver precio del alineado y balanceado" : "Buscar mi medida"}
            </Link>
            <Link
              href={deTaller ? "/neumaticos" : `/sucursales/${branch.id}`}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/30 px-6 text-sm font-black !text-white !no-underline transition-colors hover:bg-white/10"
            >
              {deTaller ? "Ver neumáticos" : "Ver el local"}
            </Link>
            <WhatsAppSucursal
              texto={`Hola! Leí la nota "${title}" y quiero consultar por ${deTaller ? "el taller" : "neumáticos"}.`}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#25D366] px-6 text-sm font-black !text-white !no-underline transition-transform active:scale-[0.98] hover:brightness-95"
            >
              Consultar por WhatsApp
            </WhatsAppSucursal>
          </div>
        </aside>

        {relacionadas.length > 0 && (
          <section className="mt-12">
            <h2>Seguí leyendo</h2>
            <ul className="!list-none !pl-0">
              {relacionadas.map((post) => (
                <li key={post.slug} className="border-t border-slate-100 py-4">
                  <Link href={`/blog/${post.slug}`} className="!no-underline">
                    <span className="block font-black text-navy-900">{post.title}</span>
                    <span className="mt-1 block text-sm font-normal text-slate-500">
                      {post.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 pb-12 pt-8">
          <BlogSidebar title={title} deTaller={deTaller} />
        </div>
      </aside>
      </div>
    </div>
  );
}
