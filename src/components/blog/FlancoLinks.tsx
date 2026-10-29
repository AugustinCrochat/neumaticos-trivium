import Link from "@/components/ui/Link";
import { FLANCO, FLANCO_PILAR } from "@/lib/blog-cluster";
import { BLOG_POSTS } from "@/lib/data";

/** Enlaces cruzados de las notas del código del flanco, sin la actual y solo con las ya publicadas. */
export function FlancoLinks({ current }: { current: string }) {
  const notas = FLANCO.filter((n) => n.slug !== current && BLOG_POSTS.some((p) => p.slug === n.slug));
  if (notas.length === 0 && current === FLANCO_PILAR) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-widest text-orange-600">El código del flanco</p>
      <h2 className="mb-3 mt-1 text-xl font-black text-navy-900">
        {current === FLANCO_PILAR ? (
          "Cada parte del código, explicada"
        ) : (
          <Link href={`/blog/${FLANCO_PILAR}`} className="hover:underline">
            Cómo leer la medida completa de un neumático
          </Link>
        )}
      </h2>
      <ul className="space-y-1.5 text-sm">
        {notas.map((n) => (
          <li key={n.slug}>
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[11px] font-black text-white">{n.numero}</span>
            <Link href={`/blog/${n.slug}`} className="font-bold text-navy-800 hover:underline">
              {n.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
