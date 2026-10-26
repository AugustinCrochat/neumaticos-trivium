import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME } from "@/lib/seo";
import { getUtqg } from "@/lib/utqg";
import { sizeLabel } from "@/lib/best-price";
import { poolShare } from "@/lib/share-image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";

// Como el resto de las landings de SEO usa DEFAULT_BRANCH_ID y no lee la cookie
// de sucursal (ver memoria seo-architecture): tiene que seguir siendo estática.
const share = poolShare("utqg");

export const metadata: Metadata = {
  title: "UTQG: qué significa, para qué sirve y cómo leer 400 A A en un neumático",
  description:
    "Qué es el UTQG de un neumático, para qué sirve y cómo leerlo: treadwear (desgaste), tracción (AA, A, B, C) y temperatura (A, B, C). Tabla para decodificarlo y los neumáticos de nuestro catálogo que lo tienen.",
  alternates: canonical("/utqg"),
  openGraph: { title: `UTQG: qué significa y cómo leerlo — ${SITE_NAME}`, url: "/utqg", ...share.openGraph },
  twitter: share.twitter,
};

const FAQS = [
  {
    question: "¿Qué es el UTQG de un neumático?",
    answer:
      "UTQG significa Uniform Tire Quality Grading. Es una clasificación de Estados Unidos que el fabricante declara para cada neumático de auto y camioneta: un número de desgaste (treadwear), una calificación de tracción en mojado (AA, A, B o C) y otra de resistencia a la temperatura (A, B o C). Se lee en ese orden: por ejemplo, 420 A A.",
  },
  {
    question: "¿Para qué sirve el UTQG?",
    answer:
      "Sirve para comparar neumáticos con un criterio común: cuánto debería durar la banda de rodamiento respecto de uno de referencia, cómo frena en línea recta sobre mojado y cuánto calor soporta a velocidad sostenida. Es una guía para comparar, no una garantía de kilómetros ni de rendimiento en curva.",
  },
  {
    question: "¿Qué significa el treadwear 400 en un neumático?",
    answer:
      "Que en la pista de prueba del fabricante se desgastó unas cuatro veces más lento que el neumático de referencia, que vale 100. Es un número relativo y autodeclarado: no equivale a una cantidad de kilómetros y sirve sobre todo para comparar modelos de la misma marca entre sí.",
  },
  {
    question: "¿Qué es un buen UTQG?",
    answer:
      "Depende del uso. En treadwear, un número más alto sugiere más vida útil (300 es típico de un deportivo, 400 a 500 de un neumático de uso diario), pero en general un desgaste alto va con menos adherencia. En tracción conviene AA o A, y en temperatura A. Con A en tracción y A en temperatura ya tenés los dos mejores niveles que usan la mayoría de los neumáticos de calle.",
  },
  {
    question: "¿Qué significan las letras AA, A, B y C del UTQG?",
    answer:
      "La primera letra es la tracción en frenado sobre pavimento mojado, de AA (mejor) a C. La segunda es la resistencia a la temperatura a alta velocidad, de A (mejor) a C. Las dos clases más bajas siguen superando el mínimo exigido en Estados Unidos.",
  },
  {
    question: "¿UTQG y etiqueta europea son lo mismo?",
    answer:
      "No. La etiqueta europea mide eficiencia de combustible, frenado en mojado y ruido, con letras de colores y un registro público (EPREL). El UTQG es de Estados Unidos y mide desgaste, tracción y temperatura. Algunos neumáticos traen los dos porque se venden en ambos mercados.",
  },
  {
    question: "¿Por qué mi neumático no tiene UTQG?",
    answer:
      "Porque no es obligatorio en Argentina: solo lo declaran los fabricantes que venden ese modelo en Estados Unidos. Tampoco aplica a los neumáticos de carga LT. La falta de UTQG no indica peor calidad; en esos casos conviene mirar la etiqueta europea y los índices de carga y velocidad.",
  },
  {
    question: "¿Dónde se ve el UTQG en el neumático?",
    answer:
      "Está moldeado en el flanco, junto a las palabras TREADWEAR, TRACTION y TEMPERATURE, con el número y las letras. Si el neumático no se vende en Estados Unidos, es probable que no lo traiga.",
  },
];

const TRACCION = [
  ["AA", "La mejor", "Mejor frenado en línea recta sobre mojado"],
  ["A", "Muy buena", "Buen frenado sobre mojado"],
  ["B", "Intermedia", "Frenado aceptable sobre mojado"],
  ["C", "Mínima", "Cumple el mínimo exigido, con menor margen"],
];
const TEMPERATURA = [
  ["A", "La mejor", "Mayor margen frente al calor a velocidad sostenida"],
  ["B", "Intermedia", "Buen margen, algo menor"],
  ["C", "Mínima", "Cumple el mínimo exigido"],
];

export default async function UtqgPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const conUtqg = productos
    .map((p) => ({ p, u: getUtqg(p.brandId, p.modeloBase, p.slug) }))
    .filter((x): x is { p: (typeof productos)[number]; u: NonNullable<ReturnType<typeof getUtqg>> } => x.u !== null)
    .sort((a, b) => Number(b.p.enStock) - Number(a.p.enStock) || b.u.treadwear - a.u.treadwear || a.p.price - b.p.price);

  const link = "font-bold text-[#cc1800] underline underline-offset-4";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "UTQG", path: "/utqg" },
        ]}
      />

      <header className="mb-10 max-w-3xl">
        <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-wide text-slate-900 md:text-5xl">
          UTQG: qué significa en un neumático
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Es el código de un número y dos letras que aparece en el flanco de muchos neumáticos, por ejemplo{" "}
          <strong>400 A A</strong>. Acá te explicamos para qué sirve, cómo leerlo y cuáles de los neumáticos que
          vendemos lo tienen.
        </p>
      </header>

      <section className="mb-12 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">Qué es el UTQG</h2>
        <p>
          UTQG son las siglas de <strong>Uniform Tire Quality Grading</strong>, una clasificación que exige el
          Departamento de Transporte de Estados Unidos a los neumáticos de auto y camioneta que se venden allá. El
          fabricante declara tres datos, siempre en este orden: <strong>desgaste</strong> (treadwear),{" "}
          <strong>tracción</strong> y <strong>temperatura</strong>.
        </p>
        <p>
          Sirve para comparar neumáticos con una vara común. No es obligatorio en Argentina, así que solo lo
          tienen los modelos que el fabricante también vende en Estados Unidos. Para el detalle de cómo se prueba
          cada dato, mirá la nota{" "}
          <Link href="/blog/utqg-desgaste-traccion-temperatura" className={link}>
            UTQG: desgaste, tracción y temperatura
          </Link>
          .
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-display mb-4 text-3xl font-bold uppercase tracking-wide text-slate-900">
          Cómo leer 400 A A
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className="block text-4xl font-black text-slate-900">400</span>
            <span className="mt-1 block font-bold text-slate-900">Desgaste (treadwear)</span>
            <p className="mt-2 text-sm text-slate-600">
              Número relativo a un neumático de referencia que vale 100. Más alto sugiere más vida útil, pero no son
              kilómetros y solo se compara bien dentro de la misma marca.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className="block text-4xl font-black text-slate-900">A</span>
            <span className="mt-1 block font-bold text-slate-900">Tracción</span>
            <p className="mt-2 text-sm text-slate-600">
              Frenado en línea recta sobre pavimento mojado: AA, A, B o C. No mide el agarre en curva.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className="block text-4xl font-black text-slate-900">A</span>
            <span className="mt-1 block font-bold text-slate-900">Temperatura</span>
            <p className="mt-2 text-sm text-slate-600">
              Resistencia al calor a velocidad sostenida: A, B o C. Importa sobre todo en ruta y con calor.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12 grid gap-8 md:grid-cols-2">
        {[
          { titulo: "Tracción (primera letra)", filas: TRACCION },
          { titulo: "Temperatura (segunda letra)", filas: TEMPERATURA },
        ].map((t) => (
          <div key={t.titulo}>
            <h2 className="font-display mb-3 text-2xl font-bold uppercase tracking-wide text-slate-900">{t.titulo}</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Letra</th>
                    <th className="px-4 py-2">Nivel</th>
                    <th className="px-4 py-2">Qué indica</th>
                  </tr>
                </thead>
                <tbody>
                  {t.filas.map(([l, n, d]) => (
                    <tr key={l} className="border-t border-slate-100">
                      <td className="px-4 py-2 font-black text-slate-900">{l}</td>
                      <td className="px-4 py-2 text-slate-700">{n}</td>
                      <td className="px-4 py-2 text-slate-600">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-12 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">
          Qué número de treadwear conviene
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Hasta 300</strong>: neumáticos deportivos o de alta performance. Más adherencia, se desgastan
            antes.
          </li>
          <li>
            <strong>350 a 450</strong>: uso diario en ciudad y ruta, el equilibrio más común.
          </li>
          <li>
            <strong>Más de 450</strong>: pensados para durar, típico de neumáticos todo terreno (A/T) y de ruta.
          </li>
        </ul>
        <p>
          Son rangos orientativos para comparar, no una promesa. La vida real depende de la presión, la{" "}
          <Link href="/servicios" className={link}>
            alineación, balanceo y rotación
          </Link>{" "}
          y el estilo de manejo.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="font-display mb-3 text-3xl font-bold uppercase tracking-wide text-slate-900">
          Neumáticos de nuestro catálogo con UTQG
        </h2>
        <p className="mb-5 max-w-3xl text-slate-600">
          Cargamos el dato solo cuando lo publica el fabricante para esa medida. Si un modelo no figura acá, no lo
          declara. Cada ficha tiene el UTQG junto a la{" "}
          <Link href="/blog/etiqueta-europea-neumaticos" className={link}>
            etiqueta europea
          </Link>
          .
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2">Neumático</th>
                <th className="px-4 py-2">Medida</th>
                <th className="px-4 py-2">UTQG</th>
                <th className="px-4 py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {conUtqg.map(({ p, u }) => (
                <tr key={p.slug} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <Link href={`/productos/${p.slug}`} className="font-bold text-slate-900 hover:text-[#cc1800]">
                      {p.brand} {p.model}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-slate-700">{sizeLabel(p)}</td>
                  <td className="px-4 py-2 font-black text-slate-900">
                    {u.treadwear} {u.traction} {u.temperature}
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {p.enStock ? `$${p.price.toLocaleString("es-AR")}` : "Sin stock"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          ¿No encontrás tu medida?{" "}
          <Link href="/neumaticos" className={link}>
            Buscala por ancho, perfil y rodado
          </Link>{" "}
          o mirá los{" "}
          <Link href="/neumaticos-baratos" className={link}>
            neumáticos baratos
          </Link>
          .
        </p>
      </section>

      <FaqSection faqs={FAQS} />
    </div>
  );
}
