import type { Metadata } from "next";
import { BlogListado } from "@/components/blog/BlogListado";
import { JsonLd } from "@/components/seo/JsonLd";
import { AHORRO_360 } from "@/lib/ahorro-360";
import { breadcrumbJsonLd, canonical, resumen } from "@/lib/seo";

export const metadata: Metadata = {
  title: AHORRO_360.title,
  description: resumen(AHORRO_360.description),
  alternates: canonical(`/blog/${AHORRO_360.slug}`),
};

// Página del sello: reúne las notas con video corto par (ver lib/ahorro-360.ts).
export default function Ahorro360Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: AHORRO_360.h1, path: `/blog/${AHORRO_360.slug}` },
        ])}
      />
      <BlogListado sello />
    </>
  );
}
