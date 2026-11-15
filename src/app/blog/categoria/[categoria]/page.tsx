import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListado } from "@/components/blog/BlogListado";
import { JsonLd } from "@/components/seo/JsonLd";
import { BLOG_CATEGORIAS } from "@/lib/blog-categorias";
import { breadcrumbJsonLd, canonical, resumen } from "@/lib/seo";

type Props = { params: Promise<{ categoria: string }> };

// Sólo existen las categorías declaradas: cualquier otra ruta es un 404 y no
// se renderiza en el Worker (el sitio es estático).
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_CATEGORIAS.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const c = BLOG_CATEGORIAS.find((x) => x.slug === categoria);
  if (!c) return {};
  return {
    title: c.title,
    description: resumen(c.description),
    alternates: canonical(`/blog/categoria/${c.slug}`),
  };
}

export default async function BlogCategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const c = BLOG_CATEGORIAS.find((x) => x.slug === categoria);
  if (!c) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: c.h1, path: `/blog/categoria/${c.slug}` },
        ])}
      />
      <BlogListado categoria={c} />
    </>
  );
}
