import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { BlogShopLinks } from "@/components/blog/BlogShop";
import { SizesCatalog } from "@/components/blog/SizesCatalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { absoluteUrl, canonical, ORGANIZATION_ID } from "@/lib/seo";
import { sizeSearchHref } from "@/lib/size-href";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-leer-medida-neumatico";
const TITLE = "Cómo leer la medida de un neumático: 205/55 R16 explicado";
const DESCRIPTION =
  "Qué significa 205/55 R16 en el flanco de un neumático: ancho en mm, perfil, construcción radial y diámetro de llanta, con infografía, cálculo del diámetro total y medidas en stock.";
const PUBLISHED = "2025-03-28";
const MODIFIED = "2026-10-21";

const INFOGRAPHIC = "/como-leer-medida-neumatico-205-55-r16.webp";
// Foto real del flanco con cada código señalado (ver "Dónde mirarlo").
const FLANCO_PHOTO = "/donde-encontrar-la-medida-en-el-flanco-del-neumatico.webp";
const FLANCO_ALT =
  "Flanco de un neumático 195/65 R15 95T XL con cada código numerado: 1 ancho 195 mm, 2 perfil 65, 3 construcción radial R, 4 llanta de 15 pulgadas, 5 índice de carga 95, 6 código de velocidad T, 7 XL, 8 M+S y 9 tubeless";

const INFOGRAPHIC_ALT =
  "Infografía de cómo leer la medida 205/55 R16 en el flanco de un neumático: 205 es el ancho en milímetros, 55 el perfil, R la construcción radial y 16 el diámetro de la llanta en pulgadas";

// Los colores son los de la infografía: cada dato se ve igual en la imagen y en el texto.
const PARTS = [
  { number: "205", label: "Ancho", detail: "205 milímetros", copy: "Es el ancho del neumático, medido de flanco a flanco cuando está montado en su llanta.", tone: "border-orange-500 bg-orange-50 text-orange-700" },
  { number: "55", label: "Perfil", detail: "55 % del ancho", copy: "Es la altura del flanco expresada como porcentaje del ancho. En este caso, 205 × 0,55 = 112,75 mm.", tone: "border-navy-400 bg-navy-50 text-navy-700" },
  { number: "R", label: "Radial", detail: "Tipo de construcción", copy: "La R indica construcción radial, la tecnología estándar en los neumáticos modernos. No significa “rin”.", tone: "border-slate-400 bg-slate-100 text-slate-700" },
  { number: "16", label: "Diámetro", detail: "16 pulgadas", copy: "Es el diámetro de la llanta o aro donde se monta (16 × 25,4 = 406,4 mm). No es el diámetro total de la rueda.", tone: "border-orange-300 bg-orange-50 text-orange-800" },
];

// Códigos que siguen a la medida en el flanco. Los valores de carga y velocidad
// son los de la tabla ISO: 91 = 615 kg, V = 240 km/h.
const FULL_CODE = [
  { code: "91", name: "Índice de carga", meaning: "Cada neumático soporta hasta 615 kg." },
  { code: "V", name: "Código de velocidad", meaning: "Velocidad máxima certificada: 240 km/h." },
  { code: "XL", name: "Extra Load", meaning: "Estructura reforzada, soporta más carga a igual medida." },
  { code: "M+S", name: "Barro y nieve", meaning: "Banda pensada para barro y nieve; común en A/T y all season." },
  { code: "TL", name: "Tubeless", meaning: "Sin cámara: el aire queda sellado entre cubierta y llanta." },
  { code: "DOT 2524", name: "Fecha de fabricación", meaning: "Los últimos 4 dígitos son semana y año: semana 25 de 2024." },
];

// Medidas comunes, con el diámetro total calculado: flanco = ancho × perfil,
// total = llanta en mm + 2 flancos.
const EXAMPLES = [
  { size: "185/65 R15", sidewall: "120,25 mm", total: "621,5 mm", note: "Compactos" },
  { size: "195/65 R15", sidewall: "126,75 mm", total: "634,5 mm", note: "Sedanes y compactos" },
  { size: "205/55 R16", sidewall: "112,75 mm", total: "631,9 mm", note: "Autos medianos (el del ejemplo)" },
  { size: "205/60 R16", sidewall: "123 mm", total: "652,4 mm", note: "Sedanes y monovolúmenes" },
];

const MISTAKES = [
  ["Confundir la R con “rin”", "La R es radial. El rodado es el número que viene después."],
  ["Mirar sólo el ancho", "Dos neumáticos de 205 mm pueden tener alturas muy distintas según el perfil. Cambia el diámetro total y el velocímetro."],
  ["Ignorar el índice de carga", "Una medida igual con menor índice de carga puede no ser apta para tu vehículo, sobre todo en pickups y utilitarios."],
  ["Comprar por la medida del auto “de la fábrica” sin revisar el flanco", "Muchos autos cambiaron de llanta. Lo que vale es lo que dice el neumático montado hoy o la etiqueta del marco de la puerta."],
  ["Mezclar medidas en el mismo eje", "Un eje con medidas o marcas distintas afecta el frenado y la estabilidad. Cambiá siempre de a pares, o las cuatro."],
];

const CATALOG_BY_USE = [
  { title: "Autos chicos", sizes: [["165", "70", "13"], ["175", "70", "13"], ["175", "65", "14"], ["185", "65", "14"]] },
  { title: "Sedanes y compactos", sizes: [["185", "65", "15"], ["195", "65", "15"], ["195", "55", "16"], ["205", "55", "16"]] },
  { title: "SUV y pickups", sizes: [["215", "65", "16"], ["225", "65", "17"], ["245", "70", "16"], ["265", "65", "17"]] },
] as const;

// Medidas que muestra la vidriera; las que no tengan stock se omiten solas.
const CATALOG_SIZES = CATALOG_BY_USE.flatMap((g) => g.sizes.map(([width, profile, rim]) => ({ width: Number(width), profile: Number(profile), rim: Number(rim) })));

const RIMS = [13, 14, 15, 16, 17, 18];

const FAQS: [string, string][] = [
  ["¿Qué significa 205/55 R16?", "205 es el ancho en milímetros; 55, el perfil o altura del flanco como porcentaje del ancho (112,75 mm); R, construcción radial; y 16, el diámetro de la llanta en pulgadas."],
  ["¿Dónde encuentro la medida del neumático?", "Está moldeada en relieve sobre el flanco, la pared lateral de la cubierta. También figura en la etiqueta del marco de la puerta del conductor, en la tapa de combustible o en el manual del vehículo."],
  ["¿Qué significa la R en la medida de un neumático?", "La R significa radial: las capas internas van en sentido perpendicular a la marcha. No tiene relación con el aro o “rin”; el diámetro de la llanta es el número que sigue a la R."],
  ["¿Cómo se calcula el diámetro total de un neumático?", "Se suma el diámetro de la llanta en milímetros (pulgadas × 25,4) más dos veces la altura del flanco (ancho × perfil ÷ 100). Para 205/55 R16: 406,4 + 2 × 112,75 = 631,9 mm."],
  ["¿Qué significan los números 91V después de la medida?", "Es el índice de carga (91 = 615 kg por neumático) y el código de velocidad (V = hasta 240 km/h). Deben cumplir como mínimo con lo que pide tu vehículo."],
  ["¿Cómo sé la fecha de fabricación de un neumático?", "Buscá el código DOT en el flanco: los últimos cuatro dígitos indican semana y año. Por ejemplo, 2524 es la semana 25 de 2024."],
  ["¿Puedo cambiar el perfil o el rodado?", "Sólo si la equivalencia conserva un diámetro exterior compatible (hasta ±3 %) y respeta carga y velocidad del vehículo. Antes de cambiar la medida usá la calculadora de equivalencias o consultanos."],
  ["¿Qué significa la C al final de la medida, como en 205/65 R16C?", "La C indica neumático de carga o comercial, con estructura reforzada para furgones y utilitarios. No es intercambiable con uno de auto de la misma medida."],
];

export const metadata: Metadata = {
  ...blogShare("como-leer-medida-neumatico"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical(`/blog/${SLUG}`),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: absoluteUrl(`/blog/${SLUG}`),
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    images: [{ url: absoluteUrl(INFOGRAPHIC), width: 1600, height: 1260, alt: INFOGRAPHIC_ALT }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [absoluteUrl(INFOGRAPHIC)] },
};

function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-sm font-black uppercase tracking-widest text-orange-600">{kicker}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-navy-900 md:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-lg leading-relaxed text-slate-600">{children}</p>}
    </div>
  );
}

export default function ComoLeerMedidaPage() {
  const url = absoluteUrl(`/blog/${SLUG}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: TITLE,
        description: DESCRIPTION,
        image: [absoluteUrl(INFOGRAPHIC), absoluteUrl(FLANCO_PHOTO)],
        datePublished: PUBLISHED,
        dateModified: MODIFIED,
        inLanguage: "es-AR",
        mainEntityOfPage: url,
        about: { "@type": "Thing", name: "Medida de neumáticos" },
        author: { "@type": "Organization", "@id": ORGANIZATION_ID, name: "Neumáticos Trivium" },
        publisher: { "@type": "Organization", "@id": ORGANIZATION_ID, name: "Neumáticos Trivium", logo: { "@type": "ImageObject", url: absoluteUrl("/logo-neumaticos-trivium.svg") } },
      },
      {
        "@type": "ImageObject",
        "@id": `${url}#infografia`,
        contentUrl: absoluteUrl(INFOGRAPHIC),
        url: absoluteUrl(INFOGRAPHIC),
        width: 1600,
        height: 1260,
        name: "Cómo leer la medida 205/55 R16",
        caption: INFOGRAPHIC_ALT,
        creator: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "ImageObject",
        "@id": `${url}#flanco`,
        contentUrl: absoluteUrl(FLANCO_PHOTO),
        url: absoluteUrl(FLANCO_PHOTO),
        width: 1600,
        height: 1093,
        name: "Dónde encontrar la medida en el flanco del neumático",
        caption: FLANCO_ALT,
        creator: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "HowTo",
        name: "Cómo leer la medida de un neumático",
        description: "Pasos para interpretar una medida como 205/55 R16 grabada en el flanco.",
        image: absoluteUrl(INFOGRAPHIC),
        step: PARTS.map((p, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: `${p.label}: ${p.number}`,
          text: `${p.detail}. ${p.copy}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: "Cómo leer la medida de un neumático", item: url },
        ],
      },
    ],
  };

  return (
    <main className="overflow-hidden bg-white">
      <JsonLd data={jsonLd} />

      {/* Hero: respuesta directa + infografía */}
      <section className="relative isolate overflow-hidden bg-black py-12 text-white md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-orange-400">Guía práctica de neumáticos</p>
            <h1 className="text-4xl font-black leading-[.98] tracking-tight sm:text-5xl md:text-6xl">Cómo leer la medida de un neumático</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              En <strong className="text-white">205/55 R16</strong>, 205 es el <strong className="text-orange-400">ancho en milímetros</strong>, 55 el{" "}
              <strong className="text-navy-300">perfil</strong> (la altura del flanco, 55 % del ancho), R la construcción{" "}
              <strong className="text-slate-200">radial</strong> y 16 el <strong className="text-orange-300">diámetro de la llanta en pulgadas</strong>.
            </p>
            <p className="mt-3 text-sm text-slate-400">Actualizado el 21 de octubre de 2026 · 5 min de lectura</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#guia" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-orange-600">Ver paso a paso</Link>
              <Link href="#catalogo" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/20">Ir al catálogo</Link>
            </div>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <Image src={INFOGRAPHIC} alt={INFOGRAPHIC_ALT} width={1600} height={1260} priority sizes="(max-width: 1024px) 100vw, 55vw" className="h-auto w-full" />
          </figure>
        </div>
      </section>

      {/* Índice */}
      <nav aria-label="Contenido de la guía" className="border-b border-slate-200 bg-white">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 text-sm font-black text-navy-800 [scrollbar-width:none]">
          {[["#guia", "Los 4 datos"], ["#flanco", "Dónde mirarlo"], ["#codigo", "Código completo"], ["#calculo", "Diámetro total"], ["#errores", "Errores comunes"], ["#catalogo", "Catálogo"], ["#faq", "Preguntas"]].map(([href, label]) => (
            <li key={href} className="shrink-0">
              <Link href={href} className="block rounded-full bg-slate-100 px-4 py-1.5 transition-colors hover:bg-orange-500 hover:text-white">{label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Los 4 datos */}
      <section id="guia" className="scroll-mt-16 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead kicker="205/55 R16, sin vueltas" title="Cada número cuenta algo distinto">
            Leé de izquierda a derecha. Estos cuatro datos definen qué neumático entra en tu llanta y en tu vehículo.
          </SectionHead>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PARTS.map((part, i) => (
              <li key={part.number} className={`rounded-2xl border-t-4 p-5 shadow-sm ${part.tone}`}>
                <p className="text-xs font-black uppercase tracking-widest opacity-70">Paso {i + 1}</p>
                <p className="mt-4 text-5xl font-black italic tracking-tighter">{part.number}</p>
                <h3 className="mt-3 text-xl font-black">{part.label}</h3>
                <p className="mt-1 text-sm font-bold opacity-80">{part.detail}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{part.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Dónde mirarlo */}
      <section id="flanco" className="scroll-mt-16 bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <SectionHead kicker="Dónde mirarlo" title="El flanco es tu punto de partida">
            La medida está moldeada en relieve sobre el flanco, la pared lateral del neumático, junto al índice de carga, el código de velocidad y otras marcas. Así se ve en un neumático real:
          </SectionHead>
          <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-navy-900/10">
            <Image src={FLANCO_PHOTO} alt={FLANCO_ALT} width={1600} height={1093} sizes="(max-width: 1024px) 100vw, 1024px" className="h-auto w-full" />
            <figcaption className="px-2.5 py-3 sm:px-5 text-sm text-slate-500">Ejemplo real: 195/65 R15 95T XL, moldeado en relieve sobre el flanco. Cada número de la foto se explica en el cuadro.</figcaption>
          </figure>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ul className="space-y-3 text-slate-600">
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />En el neumático montado: agachate y mirá el costado de la cubierta.</li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />En la etiqueta del marco de la puerta del conductor, con las presiones recomendadas.</li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />En el manual del vehículo, en la tapa de combustible o en la guantera.</li>
            </ul>
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <p className="font-black text-orange-800">Tip Trivium</p>
              <p className="mt-1 text-sm leading-relaxed text-orange-900">No elijas un neumático sólo porque “parece del mismo tamaño”. La medida, el índice de carga y el de velocidad deben respetar la especificación del vehículo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Código completo */}
      <section id="codigo" className="scroll-mt-16 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead kicker="Más allá de la medida" title="205/55 R16 91V: el código completo del flanco">
            Después de la medida vienen otros códigos. Estos son los que más vas a ver y qué significan.
          </SectionHead>
          <div className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-8">
            <p className="text-center text-4xl font-black italic tracking-tight sm:text-6xl">
              <span className="text-orange-500">205</span><span className="text-slate-500">/</span><span className="text-navy-300">55</span> <span className="text-slate-300">R</span><span className="text-orange-300">16</span> <span className="text-white">91V</span>
            </p>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FULL_CODE.map((c) => (
                <div key={c.code} className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
                  <dt className="flex items-baseline justify-between gap-3">
                    <span className="text-2xl font-black italic text-orange-400">{c.code}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300">{c.name}</span>
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-300">{c.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Link href="/blog/indice-de-carga-y-velocidad" className="mt-6 inline-flex text-sm font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-600">
            Tabla completa de índice de carga y velocidad →
          </Link>
        </div>
      </section>

      {/* Cálculo */}
      <section id="calculo" className="scroll-mt-16 bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead kicker="Con calculadora en mano" title="Cómo calcular la altura y el diámetro total">
            Dos cuentas simples te dicen cuánto mide realmente la rueda. Sirven para comparar medidas y entender las equivalencias.
          </SectionHead>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "Altura del flanco", "ancho × perfil ÷ 100", "205 × 55 ÷ 100 = 112,75 mm"],
              ["2", "Diámetro de la llanta", "pulgadas × 25,4", "16 × 25,4 = 406,4 mm"],
              ["3", "Diámetro total", "llanta + 2 flancos", "406,4 + 2 × 112,75 = 631,9 mm"],
            ].map(([n, name, formula, result]) => (
              <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-lg font-black text-white">{n}</p>
                <h3 className="mt-4 text-xl font-black text-navy-900">{name}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{formula}</p>
                <p className="mt-4 rounded-xl bg-navy-50 px-4 py-3 text-base font-black text-navy-800">{result}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Altura de flanco y diámetro total de medidas de neumáticos comunes</caption>
              <thead className="bg-black text-white">
                <tr>
                  <th scope="col" className="px-2.5 py-3 sm:px-5 font-black">Medida</th>
                  <th scope="col" className="px-2.5 py-3 sm:px-5 font-black">Flanco</th>
                  <th scope="col" className="px-2.5 py-3 sm:px-5 font-black">Diámetro total</th>
                  <th scope="col" className="px-2.5 py-3 sm:px-5 font-black">Uso habitual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EXAMPLES.map((e) => (
                  <tr key={e.size} className={e.size === "205/55 R16" ? "bg-orange-50" : ""}>
                    <th scope="row" className="px-2.5 py-3 sm:px-5 font-black text-navy-900">
                      <Link href={sizeSearchHref(...(e.size.match(/\d+/g) as [string, string, string]))} className="underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-600">{e.size}</Link>
                    </th>
                    <td className="px-2.5 py-3 sm:px-5 text-slate-600">{e.sidewall}</td>
                    <td className="px-2.5 py-3 sm:px-5 text-slate-600">{e.total}</td>
                    <td className="px-2.5 py-3 sm:px-5 text-slate-600">{e.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Para cambiar de medida, el diámetro total no debería variar más de ±3 %. Probalo en la{" "}
            <Link href="/calculadora-equivalencia-neumaticos" className="font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4">calculadora de equivalencias</Link>.
          </p>
        </div>
      </section>

      {/* Errores */}
      <section id="errores" className="scroll-mt-16 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead kicker="Lo que nos preguntan en el local" title="Errores comunes al leer la medida" />
          <ul className="grid gap-4 md:grid-cols-2">
            {MISTAKES.map(([title, text]) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-black text-orange-600">!</span>
                <div>
                  <h3 className="font-black text-navy-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="scroll-mt-16 bg-black py-14 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-widest text-orange-400">Catálogo</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Ya sabés tu medida: elegí tus neumáticos</h2>
              <p className="mt-3 text-lg leading-relaxed text-slate-300">Precio y stock reales, con colocación y balanceo en nuestro taller de Córdoba.</p>
            </div>
            <Link href="/neumaticos" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-orange-600">Ver todo el catálogo →</Link>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-4 text-slate-900 sm:p-6">
            <TireSizeSearch compact hideLearnLink />
          </div>

          <div className="mt-10">
            <h3 className="mb-5 text-2xl font-black">Lo más barato en stock, medida por medida</h3>
            <SizesCatalog sizes={CATALOG_SIZES} />
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Por rodado</p>
            <ul className="flex flex-wrap gap-2">
              {RIMS.map((rim) => (
                <li key={rim}>
                  <Link href={`/neumaticos/rodado-${rim}`} className="block rounded-full border border-white/20 px-5 py-2 text-sm font-black !text-white !no-underline transition-colors hover:border-orange-400 hover:bg-orange-500">
                    Rodado {rim}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <BlogShopLinks slug={SLUG} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-center text-sm font-black uppercase tracking-widest text-orange-600">Preguntas frecuentes</p>
          <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-navy-900">Dudas comunes sobre la medida del neumático</h2>
          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {FAQS.map(([question, answer]) => (
              <details key={question} className="group p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-black text-navy-900 marker:hidden">
                  {question}
                  <span className="float-right text-xl text-orange-500 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            ¿Seguís con dudas? Pasá por el local o escribinos por{" "}
            <Link href="/contacto" className="font-black text-navy-800 underline decoration-orange-500 decoration-2 underline-offset-4">contacto</Link>: leemos la medida con vos.
          </p>
        </div>
      </section>
    </main>
  );
}
