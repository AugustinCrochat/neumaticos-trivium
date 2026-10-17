import Link from "next/link";
import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { BLOG_POSTS } from "@/lib/data";
import { blogMeta } from "@/lib/blog-meta";
import { BlogCover } from "@/components/blog/BlogCover";
import { BlogSearchCard, BlogShopLinks } from "@/components/blog/BlogShop";
import { BRANCHES } from "@/lib/config";
import { absoluteUrl, ORGANIZATION_ID, SITE_NAME } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Faq } from "@/lib/seo";

// La tipografía del cuerpo se define una sola vez con selectores descendentes,
// así las notas escriben HTML plano sin clases. Es una constante porque el
// texto se parte en dos tramos (ver ArticleLayout) y ambos deben verse igual.
const TYPO = `
  [&_a]:font-bold [&_a]:text-navy-800 [&_a]:underline [&_a]:underline-offset-2
  [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy-900
  [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-navy-900
  [&_li]:leading-relaxed [&_li]:text-slate-600
  [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
  [&_p]:mb-5 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-slate-600
  [&_strong]:font-bold [&_strong]:text-navy-900
  [&_table]:mb-6 [&_table]:w-full [&_table]:text-left [&_table]:text-sm
  [&_td]:border-t [&_td]:border-slate-100 [&_td]:px-3 [&_td]:py-2.5 [&_td]:text-slate-600
  [&_th]:bg-slate-50 [&_th]:px-3 [&_th]:py-2.5 [&_th]:font-black [&_th]:text-navy-900
  [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
`;

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
  date,
  updated,
  readingMinutes,
  faqs,
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
  children: ReactNode;
}) {
  const branch = BRANCHES[0];
  const relacionadas = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
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
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <Image
            src={meta.figure.src}
            alt={meta.figure.alt}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className={meta.figure.fit === "contain" ? "object-contain p-4" : "object-cover"}
            style={meta.figure.position ? { objectPosition: meta.figure.position } : undefined}
          />
        </div>
        <figcaption className="mt-2 text-sm text-slate-500">{meta.figure.caption}</figcaption>
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

      <header className="border-b border-slate-100 bg-slate-50 py-10 md:py-14">
        <div className="mx-auto max-w-3xl px-4">
          <Breadcrumbs
            crumbs={[
              { name: "Inicio", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: title, path: `/blog/${slug}` },
            ]}
          />
          <span className="mb-3 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-orange-700">
            {category}
          </span>
          <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-4xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{subtitle}</p>
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

      {/* Portada y atajos a los productos del tema: lo primero que ve quien
          llegó por una duda puntual. */}
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <BlogCover
          image={meta.cover}
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="aspect-[16/9] rounded-2xl sm:aspect-[2/1]"
        />
        <div className="mt-5">
          <BlogShopLinks slug={slug} />
        </div>
      </div>

      <div className={`mx-auto max-w-3xl px-4 pt-4 ${TYPO}`}>{antes}</div>

      <div className="mx-auto max-w-3xl px-4">
        <BlogSearchCard slug={slug} />
      </div>

      <article className={`mx-auto max-w-3xl px-4 pb-12 ${TYPO}`}>
        {despues}

        {faqs && faqs.length > 0 && <FaqSection faqs={faqs} />}

        {/* Cierre comercial: la nota atrae la visita informativa, este bloque
            la conecta con la página que vende. */}
        <aside className="mt-14 rounded-2xl bg-gradient-to-br from-navy-950 to-black p-7 text-white">
          <h2 className="!mt-0 text-2xl font-black !text-white">
            ¿Te toca cambiar los neumáticos?
          </h2>
          <p className="!text-slate-300">
            Buscá tu medida y mirá precio y stock al instante. Importamos directo de fábrica, así
            que el precio no arrastra el margen de tres intermediarios. Envío a todo el país o
            retiro sin cargo en {branch.address}, {branch.city}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/neumaticos"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black !text-white !no-underline transition-transform active:scale-[0.98] hover:bg-orange-600"
            >
              Buscar mi medida
            </Link>
            <Link
              href={`/sucursales/${branch.id}`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-black !text-white !no-underline transition-colors hover:bg-white/10"
            >
              Ver el local
            </Link>
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
      </article>
    </div>
  );
}
