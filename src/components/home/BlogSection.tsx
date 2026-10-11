import Link from "next/link";
import { BLOG_POSTS } from "@/lib/data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogSection() {
  return (
    <section id="blog" className="py-16 bg-slate-50">
      <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block text-orange-500 text-sm font-bold uppercase tracking-widest mb-2">
              Blog y consejos
            </span>
            <h2 className="text-3xl font-black text-navy-900">
              Guías de mantenimiento
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-navy-600 hover:text-navy-800 font-semibold text-sm transition-colors"
          >
            Ver todos los artículos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <article
              key={post.id}
              className={`group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-navy-200 hover:shadow-lg transition-all duration-200 ${
                i === 0 ? "md:col-span-1" : ""
              }`}
            >
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-navy-950 to-black h-44 flex items-center justify-center relative overflow-hidden">
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
                  <svg
                    className="w-12 h-12 text-slate-400 mx-auto mb-2 group-hover:text-orange-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-orange-50 text-orange-600 font-semibold px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <time className="text-xs text-slate-400" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>

                <h3 className="font-bold text-slate-800 mb-2 leading-snug group-hover:text-navy-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
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

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-navy-600 hover:text-navy-800 font-semibold text-sm transition-colors"
          >
            Ver todos los artículos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
