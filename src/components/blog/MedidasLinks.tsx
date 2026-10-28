import Link from "@/components/ui/Link";
import { MEDIDAS } from "@/lib/blog-cluster";
import { BLOG_POSTS } from "@/lib/data";

/** Enlaces cruzados entre las notas por medida, sin la nota actual. */
export function MedidasLinks({ current }: { current: string }) {
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="!mb-1 !text-xs font-black uppercase tracking-widest !text-orange-600">Medidas de neumáticos</p>
      <h2 className="!mt-0 !mb-3 !text-xl">Otras medidas populares</h2>
      <ul className="!mb-3 flex flex-wrap gap-2 !pl-0 !list-none">
        {MEDIDAS.filter((m) => m.slug !== current && BLOG_POSTS.some((p) => p.slug === m.slug)).map((m) => (
          <li key={m.slug} className="!leading-snug">
            <Link
              href={`/blog/${m.slug}`}
              className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 !text-sm !no-underline hover:border-navy-300"
            >
              {m.size}
            </Link>
          </li>
        ))}
      </ul>
      <p className="!mb-0 !text-sm">
        ¿No ves la tuya? <Link href="/blog/como-leer-medida-neumatico">Cómo leer la medida</Link> o la{" "}
        <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link>.
      </p>
    </section>
  );
}
