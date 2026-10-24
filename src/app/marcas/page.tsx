import type { Metadata } from "next";
import Link from "next/link";
import { BRANDS } from "@/lib/data";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getBrandLogo } from "@/lib/brand-utils";
import { canonical, SITE_NAME } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { poolShare } from "@/lib/share-image";

export const metadata: Metadata = {
  title: "Marcas de neumáticos que vendemos en Córdoba",
  description:
    "Todas las marcas de neumáticos que vendemos, con su origen, su posicionamiento real y el stock disponible de cada una. Importación directa con garantía de 1 año.",
  alternates: canonical("/marcas"),
  openGraph: { title: `Marcas de neumáticos — ${SITE_NAME}`, url: "/marcas", ...poolShare("marcas").openGraph },
    twitter: poolShare("marcas").twitter,
};

const FAQS = [
  {
    question: "¿Conviene una marca premium o una de importación directa?",
    answer:
      "Depende de cuántos kilómetros hacés y de cómo manejás. Una premium rinde más kilómetros y frena algo mejor en mojado, pero cuesta bastante más por unidad. Para un uso urbano de 10.000 a 15.000 km al año, una marca de importación directa de gama media cubre la necesidad con holgura y el ahorro es real. Si hacés mucha ruta a velocidad sostenida o el auto es potente, ahí sí la premium se justifica.",
  },
  {
    question: "¿Los neumáticos chinos son seguros?",
    answer:
      "No todos los neumáticos chinos son iguales: hay una franja baja sin homologación seria y una franja media-alta con certificación europea, ensayos de frenado y compuestos con sílice. Nosotros trabajamos con la segunda. Todo lo que vendemos tiene marcado el índice de carga y de velocidad en el flanco y cumple las homologaciones vigentes.",
  },
  {
    question: "¿Puedo mezclar marcas distintas en el mismo auto?",
    answer:
      "En el mismo eje, no: los dos neumáticos de un eje tienen que ser de la misma marca, medida y dibujo, porque si agarran distinto el auto tira para un lado al frenar. Entre ejes se puede, aunque lo ideal es que los cuatro sean iguales. Lo que nunca hay que mezclar es un radial con un convencional en el mismo auto.",
  },
  {
    question: "¿Qué garantía tienen?",
    answer:
      "Un año por defecto de fabricación, sin importar la marca, y se gestiona con nosotros en el local. Cubre fallas de fábrica: deformaciones, separación de capas o pérdida de aire por vicio del material. No cubre pinchaduras, golpes contra un cordón o un bache, ni desgaste irregular por falta de alineación.",
  },
];

export default async function MarcasPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);

  const marcas = BRANDS.map((brand) => {
    const propios = productos.filter((p) => p.brandId === brand.id);
    const enStock = propios.filter((p) => p.enStock);
    return {
      brand,
      total: propios.length,
      enStock: enStock.length,
      desde: enStock.length ? Math.min(...enStock.map((p) => p.price)) : null,
    };
  })
    // Sin productos no hay página que valga la pena enlazar: mandar al crawler a
    // una marca vacía diluye el presupuesto de rastreo.
    .filter((m) => m.total > 0)
    .sort((a, b) => b.enStock - a.enStock || b.total - a.total);

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Marcas", path: "/marcas" },
        ]}
      />

      <header className="mb-10">
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">
          Marcas de neumáticos
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Trabajamos con marcas de importación directa y con premium tradicionales. La diferencia
          honesta entre unas y otras no es tanto la seguridad como la vida útil y el comportamiento
          en mojado a alta velocidad. Abajo está cada marca con su origen y lo que hay en stock; en
          cada ficha explicamos para qué tipo de uso conviene.
        </p>
        <p className="mt-3 max-w-3xl text-slate-600">
          ¿Buscás otra marca china? Mirá{" "}
          <Link href="/marcas-de-neumaticos-chinos" className="font-bold text-orange-600 underline underline-offset-4">
            las marcas de neumáticos chinos que se venden en Argentina
          </Link>
          : Kpatos, Sailun, Goodride, Westlake y más. Y si buscás una marca tradicional, mirá las{" "}
          <Link href="/alternativas" className="font-bold text-orange-600 underline underline-offset-4">
            alternativas a Michelin, Bridgestone, Goodyear y otras
          </Link>
          .
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {marcas.map(({ brand, total, enStock, desde }) => {
          const logo = getBrandLogo(brand.id);
          return (
            <Link
              key={brand.id}
              href={`/marcas/${brand.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-orange-400"
            >
              <div className="mb-4 flex h-12 items-center">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt={brand.name}
                    className={`h-9 w-auto max-w-[150px] ${brand.id === "pirelli" ? "" : "rounded-md"} object-contain`}
                  />
                ) : (
                  <span className="text-2xl font-black uppercase tracking-tight text-navy-900">
                    {brand.name}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-navy-900 group-hover:text-orange-600">
                Neumáticos {brand.name}
              </h2>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-slate-400">
                {brand.origin}
              </p>
              {brand.description && (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {brand.description}
                </p>
              )}
              <p className="mt-4 text-sm font-bold text-slate-500">
                {enStock > 0 ? (
                  <>
                    <span className="text-emerald-600">{enStock} en stock</span>
                    {desde && (
                      <span className="text-slate-400">
                        {" "}
                        · desde ${desde.toLocaleString("es-AR")}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-400">{total} modelos · a pedido</span>
                )}
              </p>
            </Link>
          );
        })}
      </div>

      <FaqSection faqs={FAQS} title="Preguntas frecuentes sobre marcas" />
    </div>
  );
}
