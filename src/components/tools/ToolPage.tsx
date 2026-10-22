import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/config";
import { canonical, absoluteUrl, type Faq } from "@/lib/seo";
import { poolShare } from "@/lib/share-image";
import { TOOLS, toolPath, type Tool } from "@/lib/tools";

export function toolMetadata(slug: string): Metadata {
  const tool = TOOLS.find((t) => t.slug === slug) as Tool;
  const share = poolShare(`herramienta-${slug}`);
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: canonical(toolPath(slug)),
    openGraph: { title: tool.metaTitle, description: tool.metaDescription, url: toolPath(slug), locale: "es_AR", type: "website", ...share.openGraph },
    twitter: share.twitter,
  };
}

/**
 * Estructura común de las herramientas: título, la herramienta en sí, texto de
 * apoyo (lo que hace que la página responda la búsqueda), preguntas frecuentes,
 * y enlaces a las demás herramientas. Con schema WebApplication.
 */
export function ToolPage({
  slug,
  intro,
  children,
  article,
  faqs,
  guides = [],
}: {
  slug: string;
  intro: string;
  children: ReactNode;
  /** Texto explicativo debajo de la herramienta. */
  article?: ReactNode;
  faqs: Faq[];
  guides?: { href: string; label: string }[];
}) {
  const tool = TOOLS.find((t) => t.slug === slug) as Tool;
  const path = toolPath(slug);
  const otras = TOOLS.filter((t) => t.slug !== slug);

  return (
    <div className="bg-slate-50">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          description: tool.metaDescription,
          url: absoluteUrl(path),
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          inLanguage: "es-AR",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Breadcrumbs
          crumbs={[
            { name: "Inicio", path: "/" },
            { name: "Herramientas", path: "/herramientas" },
            { name: tool.name, path },
          ]}
        />
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">{tool.name}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">{intro}</p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">{children}</div>

        {article && <div className="prose-tool mt-10 max-w-3xl space-y-4 leading-relaxed text-slate-700 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy-900 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-slate-900">{article}</div>}

        <FaqSection faqs={faqs} />

        {guides.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-black text-navy-900">Para leer también</h2>
            <ul className="flex flex-wrap gap-2">
              {guides.map((g) => (
                <li key={g.href}>
                  <Link href={g.href} className="inline-block rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-navy-900 hover:border-orange-500 hover:text-orange-600">
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-black text-navy-900">Otras herramientas</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {otras.map((t) => (
              <li key={t.slug}>
                <Link href={toolPath(t.slug)} className="block h-full rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-500">
                  <span className="block font-black text-navy-900">{t.name}</span>
                  <span className="mt-1 block text-sm text-slate-500">{t.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
