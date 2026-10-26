import Link from "@/components/ui/Link";
import { CLUSTER } from "@/lib/blog-cluster";

/** Enlaces cruzados del clúster "marca vs. alternativas", sin la nota actual. */
export function ClusterLinks({ current }: { current: string }) {
  const otras = CLUSTER.filter((c) => c.slug !== current);
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="!mb-1 !text-xs font-black uppercase tracking-widest !text-orange-600">¿Marca o alternativa?</p>
      <h2 className="!mt-0 !mb-3 !text-xl">Más para decidir con datos</h2>
      <ul className="!mb-0 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {otras.map((c) => (
          <li key={c.slug} className="!leading-snug">
            <Link href={`/blog/${c.slug}`} className="!no-underline hover:!underline">
              {c.title}
            </Link>
            <span className="text-sm text-slate-400"> · {c.short}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
