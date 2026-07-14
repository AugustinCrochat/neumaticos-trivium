import type { Metadata } from "next";
import Link from "next/link";
import { EquivalenceCalculator } from "@/components/ui/EquivalenceCalculator";
import { SITE_URL } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";

export const revalidate = 300;

const pageUrl = `${SITE_URL}/calculadora-equivalencia-neumaticos`;

export const metadata: Metadata = {
  title: "Calculadora de equivalencias de neumáticos | Trivium",
  description:
    "Calculá medidas compatibles y equivalencias de neumáticos. Compará ancho, perfil y rodado, verificá la diferencia de diámetro y encontrá alternativas en stock.",
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
  },
  twitter: {
    card: "summary",
    title: "Calculadora de equivalencias de neumáticos | Trivium",
    description:
      "Verificá medidas compatibles de neumáticos y alternativas en stock.",
  },
};

const faqs = [
  {
    question: "¿Cómo saber si dos medidas de neumáticos son compatibles?",
    answer:
      "Compará el diámetro total de ambas medidas. Como referencia técnica habitual, la diferencia debe mantenerse dentro de ±3% y conservar el mismo rodado. También hay que verificar que no haya roces y respetar las especificaciones del vehículo.",
  },
  {
    question: "¿Qué significan los números de una medida como 195/65 R15?",
    answer:
      "195 es el ancho en milímetros, 65 es el perfil —la altura del flanco como porcentaje del ancho— y R15 indica una llanta de 15 pulgadas.",
  },
  {
    question: "¿Puedo cambiar el ancho del neumático?",
    answer:
      "Puede ser posible si el diámetro exterior se mantiene dentro de la tolerancia y la medida es adecuada para la llanta y el vehículo. Antes de instalarla, confirmalo con un profesional y verificá que no roce al girar o circular.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Calculadora de equivalencias de neumáticos",
      description:
        "Herramienta para comparar medidas compatibles y equivalencias de neumáticos.",
      url: pageUrl,
      inLanguage: "es-AR",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default async function CalculadoraEquivalenciaNeumaticosPage() {
  const productos = await getProductosDesdePOS();

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-navy-900 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-3">
              Herramienta gratuita
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-5">
              Calculadora de equivalencias de neumáticos
            </h1>
            <p className="text-navy-100 text-lg leading-relaxed mb-9">
              Ingresá la medida original de tu neumático para comprobar si otra medida es compatible o para ver alternativas disponibles en stock.
            </p>
            <div className="shadow-2xl">
              <EquivalenceCalculator products={productos} />
            </div>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-2xl md:text-3xl font-black text-navy-900 mb-5">
            Encontrá medidas compatibles para tu auto
          </h2>
          <p>
            Esta calculadora compara el diámetro exterior de dos neumáticos. Es útil cuando no conseguís la medida original o querés evaluar una alternativa, por ejemplo, pasar de 195/65 R15 a 205/60 R15.
          </p>
          <p className="mt-4">
            Una medida equivalente no depende solo del diámetro: también debe ser apta para la llanta, el vehículo y su uso. El resultado es una referencia para orientar la búsqueda; confirmá siempre la alternativa con un profesional antes de comprar o instalar.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl md:text-3xl font-black text-navy-900 mb-6">
            Cómo usar el calculador de equivalencias
          </h2>
          <ol className="grid gap-4 md:grid-cols-3 list-none p-0 m-0">
            {[
              ["1", "Ingresá tu medida", "Escribí ancho, perfil y rodado tal como aparecen en el flanco del neumático."],
              ["2", "Compará o listá", "Verificá dos medidas o elegí la opción para ver alternativas con stock."],
              ["3", "Confirmá el ajuste", "Revisá que conserve el rodado, no roce y sea una opción aprobada para tu vehículo."],
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-orange-500 text-white font-black mb-4">
                  {number}
                </span>
                <h3 className="font-black text-navy-900 mb-2">{title}</h3>
                <p className="text-sm">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 md:p-8">
          <h2 className="text-2xl font-black text-emerald-950 mb-4">
            Qué revisa la calculadora
          </h2>
          <p className="text-emerald-900">
            Calculamos el diámetro de la rueda a partir del ancho, el perfil y el rodado. Para considerar una alternativa, usamos como referencia una variación máxima de ±3% y el mismo diámetro de llanta.
          </p>
          <div className="mt-5 rounded-xl bg-white/80 border border-emerald-100 p-4 font-mono text-sm text-emerald-950 overflow-x-auto">
            Diámetro = (Rodado × 25.4) + 2 × (Ancho × Perfil / 100)
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl md:text-3xl font-black text-navy-900 mb-6">
            Preguntas frecuentes sobre equivalencias de neumáticos
          </h2>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq) => (
              <section key={faq.question} className="py-6">
                <h3 className="font-black text-navy-900 text-lg mb-2">{faq.question}</h3>
                <p>{faq.answer}</p>
              </section>
            ))}
          </div>
        </section>

        <aside className="mt-14 border-l-4 border-orange-500 bg-orange-50 px-5 py-4 text-orange-950">
          ¿No sabés qué significan los números de tu cubierta?{" "}
          <Link href="/blog/como-leer-medida-neumatico" className="font-bold underline underline-offset-2">
            Aprendé cómo leer la medida de un neumático.
          </Link>
        </aside>
      </article>
    </div>
  );
}
