import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_BRANCH_ID, SHIPPING_FLAT_RATE } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { BRANDS } from "@/lib/data";
import { canonical, SITE_NAME } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import {
  MEDIDAS_PRIORITARIAS,
  formatSize,
  rimSlug,
  sizeSlug,
  sizesFromCatalog,
} from "@/lib/tire-sizes";
import type { TireSize } from "@/lib/types";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Neumáticos por medida — todas las medidas y precios",
  description:
    "Buscá tu medida de neumático y mirá precio y stock al instante. Cubiertas para auto y camioneta de importación directa, rodado 13 al 20, con envío a todo el país.",
  alternates: canonical("/neumaticos"),
  openGraph: {
    title: `Neumáticos por medida — ${SITE_NAME}`,
    url: "/neumaticos",
  },
};

const FAQS = [
  {
    question: "¿Cómo sé qué medida de neumático lleva mi auto?",
    answer:
      "Está escrita en el flanco del neumático que tenés puesto, con el formato 205/55 R16. También figura en la calcomanía del parante de la puerta del conductor y en el manual del vehículo. Si el auto ya vino con neumáticos cambiados, la referencia válida es la calcomanía o el manual, no lo que tiene puesto.",
  },
  {
    question: "¿Puedo poner una medida distinta a la original?",
    answer:
      "Sí, siempre que el diámetro externo total quede dentro del ±3% del original y el rodado sea el mismo que el de tu llanta. Fuera de ese margen, el velocímetro empieza a marcar mal y el ABS y el control de estabilidad trabajan con una referencia equivocada. En cada página de medida listamos las equivalencias calculadas, y tenemos una calculadora para verificar cualquier combinación.",
  },
  {
    question: "¿Conviene cambiar los cuatro neumáticos juntos?",
    answer:
      "Lo ideal es de a cuatro, porque así el desgaste queda parejo y el auto se comporta de forma previsible. Si el presupuesto no da, el mínimo aceptable es de a dos, siempre en el mismo eje y con los más nuevos atrás: neumáticos nuevos adelante y gastados atrás hacen que el tren trasero pierda agarre antes en una frenada sobre piso mojado.",
  },
  {
    question: "¿Los neumáticos importados tienen garantía en Argentina?",
    answer:
      "Sí. Todos los que vendemos tienen un año de garantía por defecto de fabricación, y se gestiona directamente con nosotros, en el local. La garantía cubre fallas de fábrica, no daños por golpes, baches, pinchaduras ni desgaste por falta de alineación.",
  },
  {
    question: "¿Hacen envíos a todo el país?",
    answer:
      `Sí, a cualquier punto de Argentina por $${SHIPPING_FLAT_RATE.toLocaleString("es-AR")} fijos, sin importar la cantidad de neumáticos ni la provincia. También podés retirar sin cargo en el local de Córdoba, donde la colocación va incluida.`,
  },
];

/** Agrupa por rodado para que la grilla se lea como el catálogo mental del
    comprador: primero "qué rodado tengo", después "qué ancho y perfil". */
function agruparPorRodado(sizes: { size: TireSize; count: number }[]) {
  const porRodado = new Map<number, { size: TireSize; count: number }[]>();
  for (const entry of sizes) {
    const lista = porRodado.get(entry.size.rim);
    if (lista) lista.push(entry);
    else porRodado.set(entry.size.rim, [entry]);
  }
  return [...porRodado.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([rim, medidas]) => ({
      rim,
      medidas: medidas.sort(
        (a, b) => a.size.width - b.size.width || a.size.profile - b.size.profile
      ),
    }));
}

export default async function NeumaticosPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);

  // Catálogo real + medidas prioritarias sin stock: unificarlas evita que el
  // hub tenga menos enlaces que el sitemap y deje páginas huérfanas.
  const delCatalogo = sizesFromCatalog(productos);
  const slugs = new Set(delCatalogo.map((s) => sizeSlug(s.size)));
  const todas = [
    ...delCatalogo,
    ...MEDIDAS_PRIORITARIAS.filter((s) => !slugs.has(sizeSlug(s))).map((size) => ({
      size,
      count: 0,
    })),
  ];
  const grupos = agruparPorRodado(todas);
  const marcasConProductos = BRANDS.filter((b) =>
    productos.some((p) => p.brandId === b.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
        ]}
      />

      <header className="mb-10">
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">
          Neumáticos por medida
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Elegí tu medida y vas a ver, en la misma página, qué modelos hay, a qué precio y si están
          en stock ahora. Trabajamos con importación directa: compramos en fábrica y vendemos al
          público sin distribuidor en el medio, que es de dónde sale la diferencia de precio.
          Enviamos a todo el país por ${SHIPPING_FLAT_RATE.toLocaleString("es-AR")} fijos o podés
          retirar sin cargo en Córdoba.
        </p>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-500">
          ¿No sabés cuál es tu medida? Está escrita en el flanco del neumático que tenés puesto, con
          el formato <span className="font-mono font-bold text-navy-800">205/55 R16</span>.{" "}
          <Link
            href="/blog/como-leer-medida-neumatico"
            className="font-bold text-navy-700 underline underline-offset-2"
          >
            Te explicamos cómo leerla acá
          </Link>
          , o buscá directamente por marca y modelo de auto.
        </p>
      </header>

      {grupos.map(({ rim, medidas }) => (
        <section key={rim} className="mb-10">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-black text-navy-900">Rodado {rim}</h2>
            <Link
              href={`/neumaticos/${rimSlug(rim)}`}
              className="text-sm font-bold text-navy-600 underline underline-offset-2 hover:text-navy-900"
            >
              Ver todo R{rim}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {medidas.map(({ size, count }) => (
              <Link
                key={sizeSlug(size)}
                href={`/neumaticos/${sizeSlug(size)}`}
                className={`rounded-xl border p-4 text-center transition-colors ${
                  count > 0
                    ? "border-slate-200 bg-white hover:border-orange-400"
                    : "border-dashed border-slate-200 bg-slate-50 hover:border-navy-300"
                }`}
              >
                <span className="block font-black text-navy-900">{formatSize(size)}</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">
                  {count > 0 ? `${count} ${count === 1 ? "modelo" : "modelos"}` : "a pedido"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {marcasConProductos.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-black text-navy-900">Marcas que trabajamos</h2>
          <div className="flex flex-wrap gap-3">
            {marcasConProductos.map((brand) => (
              <Link
                key={brand.id}
                href={`/marcas/${brand.id}`}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-navy-900 transition-colors hover:border-navy-400"
              >
                {brand.name}
                <span className="ml-2 text-xs font-medium text-slate-400">{brand.origin}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FaqSection faqs={FAQS} title="Preguntas frecuentes sobre medidas de neumáticos" />
    </div>
  );
}
