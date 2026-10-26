import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { EquivalenceCalculator } from "@/components/ui/EquivalenceCalculator";
import { SITE_URL } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { SizesCatalog } from "@/components/blog/SizesCatalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { equivalentSizes, MEDIDAS_PRIORITARIAS, outerDiameterMm } from "@/lib/tire-sizes";
import { sizeSearchHref } from "@/lib/size-href";
import type { TireSize } from "@/lib/types";
import { poolShare } from "@/lib/share-image";

const pageUrl = `${SITE_URL}/calculadora-equivalencia-neumaticos`;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Calculadora de equivalencias de neumáticos: medidas compatibles ±3% | Trivium",
    description:
      "Calculá en segundos si dos medidas de neumáticos son equivalentes: diferencia de diámetro, velocímetro y alternativas en stock. Tabla de equivalencias de 195/65 R15, 205/55 R16 y más.",
    keywords: [
      "calculadora equivalencia neumaticos",
      "equivalencias de neumaticos",
      "medidas compatibles neumaticos",
      "medidas equivalentes cubiertas",
      "neumaticos compatibles",
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title: "Calculadora de equivalencias de neumáticos | Trivium",
      description:
        "Verificá si dos medidas de neumáticos son compatibles y buscá alternativas disponibles.",
      url: pageUrl,
      locale: "es_AR",
      type: "website",
      ...poolShare("calculadora").openGraph,
    },
    twitter: {
      ...poolShare("calculadora").twitter,
      title: "Calculadora de equivalencias de neumáticos | Trivium",
      description:
        "Verificá medidas compatibles de neumáticos y alternativas en stock.",
    },
  };
}

const FAQS = [
  ["¿Cómo saber si dos medidas de neumáticos son equivalentes?", "Compará el diámetro total de ambas: se calcula como rodado × 25,4 + 2 × (ancho × perfil ÷ 100), en milímetros. Si el rodado es el mismo y la diferencia de diámetro no supera ±3 %, las medidas se consideran equivalentes. La calculadora hace la cuenta y te dice el resultado."],
  ["¿Cuál es la equivalencia de 195/65 R15?", "Las más usadas con el mismo rodado son 205/60 R15 (−1,2 %), 185/70 R15 (+0,9 %) y 175/70 R15 (−1,3 %). Con otro rodado, 205/55 R16 (−0,4 %) conserva casi el mismo diámetro total. Antes de cambiar verificá carga, velocidad y que no roce."],
  ["¿Cuál es la equivalencia de 205/55 R16?", "Con el mismo rodado, 215/50 R16 (−1,7 %), 195/60 R16 (+1,4 %) y 215/55 R16 (+1,7 %) quedan dentro de la tolerancia de ±3 %. Con otro rodado, 225/45 R17 (+0,4 %) mantiene casi el mismo diámetro total pero requiere llantas de 17\"."],
  ["¿Qué pasa si el diámetro cambia más de 3 %?", "El velocímetro y el cuentakilómetros dejan de marcar bien, el ABS y el control de estabilidad pueden interpretar mal la velocidad de las ruedas, cambia la altura del vehículo y puede haber roces en el paso de rueda o en la suspensión."],
  ["¿Puedo usar un neumático más ancho o más angosto?", "Sí, si el diámetro total se mantiene dentro de ±3 % y el ancho es compatible con tu llanta (cada llanta admite un rango de ancho de neumático). Más ancho da más agarre en curva; más angosto, menos consumo y mejor resistencia al agua."],
  ["¿Puedo cambiar el rodado, por ejemplo de R15 a R16?", "Sí, con llantas del nuevo rodado y bajando el perfil para conservar el diámetro total. Por ejemplo, 195/65 R15 equivale en diámetro a 205/55 R16. Es un cambio que se hace en el taller: llanta nueva, neumáticos nuevos y verificar que no roce."],
  ["¿El índice de carga y velocidad también cuenta?", "Sí. Una medida equivalente en diámetro no sirve si su índice de carga o su código de velocidad son menores a los que pide tu vehículo. Los vas a encontrar en el flanco, después de la medida (por ejemplo, 91V)."],
  ["¿Hay que cambiar los neumáticos de a pares?", "Siempre de a pares por eje como mínimo, y con la misma medida en cada eje salvo que el fabricante del auto lo especifique distinto. Mezclar diámetros distintos en un mismo eje afecta el frenado y la estabilidad."],
] as const;

const RULES = [
  ["Mismo rodado (o llanta nueva)", "Los neumáticos se montan en una llanta de un rodado concreto. Para cambiar de R15 a R16 necesitás llantas nuevas."],
  ["Ancho de llanta", "Cada llanta admite un rango de ancho de neumático. Un neumático muy ancho en una llanta angosta se deforma y gasta mal."],
  ["Índice de carga", "El nuevo neumático debe soportar como mínimo la carga del original, sobre todo en pickups y utilitarios."],
  ["Código de velocidad", "La letra de velocidad (T, H, V…) no puede ser menor a la que pide el fabricante del vehículo."],
  ["Espacio en el paso de rueda", "Más ancho o más alto puede rozar en giros completos o con la suspensión comprimida. Se prueba en el taller."],
  ["Velocímetro y ABS", "Con ±3 % el desvío es mínimo. Más que eso, el tablero marca de menos o de más y los sistemas de seguridad pueden fallar."],
] as const;

const POPULAR = MEDIDAS_PRIORITARIAS.slice(0, 12).map((size) => ({
  size,
  // Sólo alternativas realistas: a más de 30 mm de ancho ya es otro tipo de neumático.
  equivalents: equivalentSizes(size).filter((e) => Math.abs(e.width - size.width) <= 30).slice(0, 4).map((e) => ({ size: e, diff: ((outerDiameterMm(e) - outerDiameterMm(size)) / outerDiameterMm(size)) * 100 })),
}));

const fmt = (s: TireSize) => `${s.width}/${s.profile} R${s.rim}`;
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1).replace(".", ",")}%`;
const mm = (n: number) => n.toFixed(1).replace(".", ",");

// Ejemplo trabajado de la sección "cómo se calcula", con números reales.
const EX_A: TireSize = { width: 195, profile: 65, rim: 15 };
const EX_B: TireSize = { width: 205, profile: 60, rim: 15 };
const exDiff = ((outerDiameterMm(EX_B) - outerDiameterMm(EX_A)) / outerDiameterMm(EX_A)) * 100;

const SPEEDS = [60, 100, 120];

const GUIDES = [
  ["/blog/equivalencias", "Equivalencias de neumáticos: qué son y cómo funcionan", "Guía"],
  ["/blog/como-leer-medida-neumatico", "Cómo leer la medida de un neumático (205/55 R16)", "Guía"],
  ["/blog/indice-de-carga-y-velocidad", "Índice de carga y velocidad: qué significan", "Guía"],
  ["/herramientas/indice-carga-velocidad", "Tabla de índices de carga y velocidad", "Herramienta"],
  ["/vehiculos", "Medidas de neumáticos por auto y modelo", "Herramienta"],
  ["/blog/presion-de-neumaticos", "Presión de neumáticos: cuánto ponerles", "Guía"],
  ["/servicios", "Colocación, alineación y balanceo en Córdoba", "Servicio"],
  ["/neumaticos-baratos", "Neumáticos baratos en Córdoba", "Catálogo"],
] as const;

const RIMS = [13, 14, 15, 16, 17, 18];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${pageUrl}#app`,
      name: "Calculadora de equivalencias de neumáticos",
      description: "Calculá si dos medidas de neumáticos son equivalentes: diferencia de diámetro, error del velocímetro y alternativas con stock.",
      url: pageUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      inLanguage: "es-AR",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "HowTo",
      name: "Cómo calcular la equivalencia entre dos medidas de neumáticos",
      step: [
        { "@type": "HowToStep", position: 1, name: "Anotá tu medida", text: "Leé ancho, perfil y rodado en el flanco del neumático, por ejemplo 195/65 R15." },
        { "@type": "HowToStep", position: 2, name: "Calculá el diámetro total", text: "Rodado × 25,4 + 2 × (ancho × perfil ÷ 100), en milímetros." },
        { "@type": "HowToStep", position: 3, name: "Comparalo con la alternativa", text: "Si el rodado es el mismo y la diferencia de diámetro es de hasta ±3 %, las medidas son equivalentes." },
        { "@type": "HowToStep", position: 4, name: "Verificá carga, velocidad y espacio", text: "Confirmá que el índice de carga y velocidad sea igual o mayor y que no roce." },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Calculadora de equivalencias de neumáticos", item: pageUrl },
      ],
    },
  ],
};

function Head({ kicker, title, children, dark }: { kicker: string; title: string; children?: React.ReactNode; dark?: boolean }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className={`text-sm font-black uppercase tracking-widest ${dark ? "text-orange-400" : "text-orange-600"}`}>{kicker}</p>
      <h2 className={`mt-2 text-3xl font-black tracking-tight md:text-4xl ${dark ? "text-white" : "text-navy-900"}`}>{title}</h2>
      {children && <p className={`mt-3 text-lg leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{children}</p>}
    </div>
  );
}

export default async function CalculadoraEquivalenciaNeumaticosPage() {
  const branch = await getSelectedBranchSlug();
  const productos = await getProductosDesdePOS(branch);

  return (
    <div className="overflow-hidden bg-white">
      <JsonLd data={jsonLd} />

      <section className="relative isolate bg-black pb-8 pt-6 text-white md:pb-12 md:pt-8">
        <div className="mx-auto max-w-5xl px-4">
          <nav aria-label="Migas de pan" className="mb-3 text-sm text-slate-400">
            <Link href="/" className="hover:text-white">Inicio</Link> <span aria-hidden="true">/</span> <span className="text-slate-200">Calculadora de equivalencias</span>
          </nav>
          <h1 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Calculadora de equivalencias de neumáticos
          </h1>
          <div id="calculadora" className="mt-5 scroll-mt-20">
            <EquivalenceCalculator products={productos} />
          </div>
        </div>
      </section>

      {/* Respuesta directa */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-orange-600">En una frase</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-navy-900 md:text-4xl">¿Qué es una medida equivalente?</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Dos medidas de neumáticos son <strong className="text-navy-900">equivalentes</strong> cuando entran en la misma llanta y su <strong className="text-navy-900">diámetro total difiere hasta un 3 %</strong>. Así la rueda recorre prácticamente la misma distancia por vuelta: el velocímetro marca bien, el ABS y el control de estabilidad leen la velocidad correcta y el auto mantiene su altura.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Sirve cuando no conseguís tu medida original, cuando querés más agarre (más ancho) o más confort (perfil más alto) o cuando evaluás cambiar de rodado.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-3 text-center lg:grid-cols-1">
              {[["±3 %", "diferencia máxima de diámetro"], ["= rodado", "o llanta nueva si cambia"], ["≥ carga y velocidad", "que pide tu vehículo"]].map(([v, t]) => (
                <div key={t} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xl font-black text-orange-600 sm:text-2xl">{v}</dt>
                  <dd className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">{t}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Cómo se calcula */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <Head kicker="La cuenta, paso a paso" title="Cómo se calcula la equivalencia">
            Ejemplo real: ¿se puede reemplazar un {fmt(EX_A)} por un {fmt(EX_B)}?
          </Head>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "Flanco", "ancho × perfil ÷ 100", `${fmt(EX_A)}: ${mm(EX_A.width * EX_A.profile / 100)} mm\n${fmt(EX_B)}: ${mm(EX_B.width * EX_B.profile / 100)} mm`],
              ["2", "Diámetro total", "rodado × 25,4 + 2 × flanco", `${fmt(EX_A)}: ${mm(outerDiameterMm(EX_A))} mm\n${fmt(EX_B)}: ${mm(outerDiameterMm(EX_B))} mm`],
              ["3", "Diferencia", "(nuevo − original) ÷ original", `${pct(exDiff)} → ${Math.round(Math.abs(exDiff) * 10) / 10 <= 3 ? "dentro de ±3 %: equivalente" : "fuera de ±3 %"}`],
            ].map(([n, name, formula, result]) => (
              <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-lg font-black text-white">{n}</p>
                <h3 className="mt-4 text-xl font-black text-navy-900">{name}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{formula}</p>
                <p className="mt-4 whitespace-pre-line rounded-xl bg-navy-50 px-4 py-3 text-sm font-black text-navy-800">{result}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-black p-6 text-white sm:p-8">
            <h3 className="text-xl font-black">¿Cuánto se desvía el velocímetro?</h3>
            <p className="mt-2 text-sm text-slate-300">Velocidad real cuando el tablero marca cada valor, si el diámetro es 3 % menor o 3 % mayor que el original.</p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-slate-400">
                    <th scope="col" className="py-2 pr-4 font-black">El tablero marca</th>
                    <th scope="col" className="py-2 pr-4 font-black">Diámetro −3 %</th>
                    <th scope="col" className="py-2 font-black">Diámetro +3 %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {SPEEDS.map((v) => (
                    <tr key={v}>
                      <th scope="row" className="py-3 pr-4 font-black">{v} km/h</th>
                      <td className="py-3 pr-4 text-navy-200">{(v * 0.97).toFixed(1).replace(".", ",")} km/h reales</td>
                      <td className="py-3 text-orange-300">{(v * 1.03).toFixed(1).replace(".", ",")} km/h reales</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla de equivalencias */}
      <section id="tabla" className="scroll-mt-20 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <Head kicker="Tabla de equivalencias" title="Equivalencias de las medidas más usadas">
            Con el mismo rodado y hasta ±3 % de diferencia de diámetro. Tocá una medida para ver precios y stock.
          </Head>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Medidas de neumáticos y sus equivalentes con el mismo rodado</caption>
              <thead className="bg-black text-white">
                <tr>
                  <th scope="col" className="px-2.5 py-3 sm:px-5 font-black">Medida original</th>
                  <th scope="col" className="px-2.5 py-3 sm:px-5 font-black">Equivalentes (diferencia de diámetro)</th>
                  <th scope="col" className="px-2.5 py-3 sm:px-5 font-black"><span className="sr-only">Calcular</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {POPULAR.map(({ size, equivalents }) => (
                  <tr key={fmt(size)} className="align-top">
                    <th scope="row" className="px-2.5 py-4 sm:px-5 text-base font-black text-navy-900">
                      <Link href={sizeSearchHref(String(size.width), String(size.profile), String(size.rim))} className="underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-600">{fmt(size)}</Link>
                    </th>
                    <td className="px-2.5 py-4 sm:px-5">
                      <ul className="flex flex-wrap gap-2">
                        {equivalents.map((e) => (
                          <li key={fmt(e.size)}>
                            <Link href={sizeSearchHref(String(e.size.width), String(e.size.profile), String(e.size.rim))} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-bold text-slate-700 hover:border-orange-400 hover:text-orange-600">
                              {fmt(e.size)} <span className="text-xs font-semibold text-slate-400">{pct(e.diff)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-2.5 py-4 sm:px-5 text-right">
                      <Link href={`/calculadora-equivalencia-neumaticos?modo=list&original=${size.width}-${size.profile}-${size.rim}#calculadora`} className="whitespace-nowrap text-xs font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-600">Ver en stock →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Qué mirar además */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <Head kicker="Antes de cambiar" title="Qué revisar además del diámetro">
            El diámetro es condición necesaria, no suficiente. Estos seis puntos completan la decisión.
          </Head>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {RULES.map(([title, text], i) => (
              <li key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-600">{i + 1}</span>
                <h3 className="mt-3 font-black text-navy-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-600">
            ¿No estás seguro de qué dice tu cubierta?{" "}
            <Link href="/blog/como-leer-medida-neumatico" className="font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4">Aprendé a leer la medida de un neumático</Link> o{" "}
            <Link href="/vehiculos" className="font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4">buscá la medida original de tu auto</Link>.
          </p>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="scroll-mt-20 bg-black py-14 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <Head kicker="Catálogo" title="Neumáticos en stock, medida por medida" dark>
              Lo más barato con stock de las medidas más pedidas, con colocación y balanceo en nuestro taller de Córdoba.
            </Head>
            <Link href="/neumaticos" className="mb-10 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-orange-600">Ver todo el catálogo →</Link>
          </div>
          <SizesCatalog
            branch={branch}
            sizes={[[185, 65, 15], [195, 65, 15], [205, 55, 16], [205, 60, 16], [175, 65, 14], [185, 60, 15], [215, 65, 16], [225, 45, 17]].map(([width, profile, rim]) => ({ width, profile, rim }))}
          />
          <div className="mt-8">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Por rodado</p>
            <ul className="flex flex-wrap gap-2">
              {RIMS.map((rim) => (
                <li key={rim}>
                  <Link href={`/neumaticos/rodado-${rim}`} className="block rounded-full border border-white/20 px-5 py-2 text-sm font-black !text-white !no-underline transition-colors hover:border-orange-400 hover:bg-orange-500">Rodado {rim}</Link>
                </li>
              ))}
              <li><Link href="/ofertas" className="block rounded-full bg-orange-500 px-5 py-2 text-sm font-black !text-white !no-underline hover:bg-orange-600">% Ofertas</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Links internos */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <Head kicker="Seguí leyendo" title="Guías y herramientas relacionadas" />
          <ul className="grid gap-3 sm:grid-cols-2">
            {GUIDES.map(([href, text, tag]) => (
              <li key={href}>
                <Link href={href} className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg">
                  <span>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600">{tag}</span>
                    <span className="mt-1 block font-black text-navy-900">{text}</span>
                  </span>
                  <span aria-hidden="true" className="text-xl text-orange-500 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-center text-sm font-black uppercase tracking-widest text-orange-600">Preguntas frecuentes</p>
          <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-navy-900">Dudas sobre equivalencias de neumáticos</h2>
          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {FAQS.map(([question, answer]) => (
              <details key={question} className="group p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-black text-navy-900 marker:hidden">
                  {question}
                  <span className="float-right text-xl text-orange-500 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-600">
            ¿Querés que lo veamos juntos? Pasá por{" "}
            <Link href="/sucursales" className="font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4">nuestro local</Link> o escribinos desde{" "}
            <Link href="/contacto" className="font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4">contacto</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
