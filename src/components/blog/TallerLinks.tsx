import Link from "@/components/ui/Link";
import { TALLER, TALLER_PILAR } from "@/lib/blog-cluster";
import { BLOG_POSTS } from "@/lib/data";

/** Enlaces cruzados del clúster "alineado y balanceado", sin la nota actual. */
export function TallerLinks({ current }: { current: string }) {
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="!mb-1 !text-xs font-black uppercase tracking-widest !text-orange-600">Alineado y balanceado</p>
      <h2 className="!mt-0 !mb-3 !text-xl">
        {current === TALLER_PILAR ? (
          "Todas las notas del taller"
        ) : (
          <Link href={`/blog/${TALLER_PILAR}`} className="!no-underline hover:!underline">
            La guía completa de alineado y balanceado
          </Link>
        )}
      </h2>
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {TALLER.map((g) => (
          <div key={g.grupo}>
            <p className="!mb-1 !text-sm font-black !text-navy-900">{g.grupo}</p>
            <ul className="!mb-0 !space-y-0.5 !pl-5">
              {g.notas
                .filter((n) => n.slug !== current && BLOG_POSTS.some((p) => p.slug === n.slug))
                .map((n) => (
                  <li key={n.slug} className="!leading-snug">
                    <Link href={`/blog/${n.slug}`} className="!text-sm !no-underline hover:!underline">
                      {n.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
