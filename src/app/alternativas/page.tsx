import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { canonical, SITE_NAME } from "@/lib/seo";
import { MARCAS_PREMIUM } from "@/lib/marcas-premium";
import { poolShare } from "@/lib/share-image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";

const share = poolShare("alternativas");

export const metadata: Metadata = {
  title: "Alternativas a Michelin, Bridgestone, Goodyear, Fate y otras marcas de neumáticos",
  description:
    "Qué se sabe de las marcas tradicionales de neumáticos (Michelin, Bridgestone, Firestone, Goodyear, Continental, Fate, Hankook, Kumho, Yokohama, Toyo, Nexen, Dunlop), cuándo conviene una premium y qué alternativas tenemos en Córdoba.",
  alternates: canonical("/alternativas"),
  openGraph: { title: `Alternativas a las marcas de neumáticos — ${SITE_NAME}`, url: "/alternativas", ...share.openGraph },
  twitter: share.twitter,
};

const FAQS = [
  {
    question: "¿Qué alternativas hay a las marcas premium de neumáticos?",
    answer:
      "Hay marcas importadas de buen nivel, mucho más económicas, que sirven bien para uso urbano y de ruta moderada. En Neumáticos Trivium tenemos Pirelli como marca de primera línea y Grenlander, Zmax, Firemax y Arivo Premio como marcas importadas.",
  },
  {
    question: "¿Cómo comparo un neumático de marca con uno económico?",
    answer:
      "Mirá la misma medida y los mismos índices de carga y velocidad, la etiqueta europea registrada en EPREL, la fecha de fabricación (DOT) y la garantía, y hacé la cuenta del costo por kilómetro y no solo del precio de góndola.",
  },
];

export default function AlternativasPage() {
  const link = "font-bold text-[#cc1800] underline underline-offset-4";
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Marcas", path: "/marcas" },
          { name: "Alternativas a marcas premium", path: "/alternativas" },
        ]}
      />
      <header className="mb-10 max-w-3xl">
        <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-wide text-slate-900 md:text-5xl">
          Alternativas a las marcas tradicionales
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Si buscás una marca conocida, acá ves qué se sabe de cada una y qué opciones tenemos en tu medida, con
          precio publicado, un año de garantía y colocación sin cargo.
        </p>
      </header>

      <section className="mb-14">
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {MARCAS_PREMIUM.map((m) => (
            <li key={m.slug}>
              <Link href={`/alternativas/${m.slug}`} className="block h-full rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#ff1e00]">
                <span className="block font-black text-slate-900">{m.name}</span>
                <span className="mt-1 block text-sm text-slate-600">Marca de origen: {m.origen}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">Más para comparar</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Link href="/marcas-de-neumaticos-chinos" className={link}>
              Marcas de neumáticos chinos que se venden en Argentina
            </Link>
          </li>
          <li>
            <Link href="/blog/neumaticos-japoneses-europeos-americanos-y-chinos-origen-de-las-marcas" className={link}>
              De dónde es cada marca: japonesas, europeas, americanas y chinas
            </Link>
          </li>
          <li>
            <Link href="/blog/alternativas-a-michelin-y-pirelli" className={link}>
              Alternativas a Michelin y Pirelli
            </Link>
          </li>
          <li>
            <Link href="/neumaticos-baratos" className={link}>
              Neumáticos baratos: el mejor precio en cada rodado
            </Link>
          </li>
        </ul>
      </section>

      <FaqSection faqs={FAQS} />
    </div>
  );
}
