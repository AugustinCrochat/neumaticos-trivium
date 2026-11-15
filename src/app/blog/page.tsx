import type { Metadata } from "next";
import { BlogListado } from "@/components/blog/BlogListado";
import { canonical, resumen } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guías de neumáticos — mantenimiento, medidas y marcas",
  description:
    resumen("Cómo leer la medida, cada cuánto cambiar las cubiertas, qué marcas convienen y cómo funcionan las equivalencias. Guías escritas por quienes venden y montan neumáticos todos los días."),
  alternates: canonical("/blog"),
};

export default function BlogPage() {
  return <BlogListado />;
}
