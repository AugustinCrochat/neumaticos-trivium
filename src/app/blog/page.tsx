import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/data";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guías de neumáticos — mantenimiento, medidas y marcas",
  description:
    "Cómo leer la medida, cada cuánto cambiar las cubiertas, qué marcas convienen y cómo funcionan las equivalencias. Guías escritas por quienes venden y montan neumáticos todos los días.",
  alternates: canonical("/blog"),
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-900 py-14">
        <div className="max-w-5xl mx-auto px-4">
          <span className="inline-block text-orange-400 text-sm font-bold uppercase tracking-widest mb-2">
            Blog y consejos
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Guías de mantenimiento
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-navy-200 hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <div className="bg-gradient-to-br from-navy-700 to-navy-900 h-44 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                      backgroundSize: "24px 24px",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <div className="relative text-center">
                  <svg className="w-12 h-12 text-navy-300 mx-auto mb-2 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-navy-300 text-xs font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-orange-50 text-orange-600 font-semibold px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <time className="text-xs text-slate-400" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>

                <h2 className="font-bold text-slate-800 mb-2 leading-snug group-hover:text-navy-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-navy-600 hover:text-navy-800 text-sm font-semibold transition-colors"
                >
                  Leer artículo
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
