import { faqJsonLd, type Faq } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/**
 * Preguntas frecuentes con su FAQPage schema.
 *
 * Usa <details>/<summary> nativo en lugar de un acordeón con estado: el texto
 * de la respuesta queda en el HTML aunque esté colapsado (Google lo indexa
 * igual, y es requisito para que el FAQPage sea válido), no necesita JS, y es
 * accesible por teclado sin trabajo extra.
 */
export function FaqSection({
  faqs,
  title = "Preguntas frecuentes",
}: {
  faqs: Faq[];
  title?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-12">
      <JsonLd data={faqJsonLd(faqs)} />
      <h2 className="mb-4 text-2xl font-black text-navy-900">{title}</h2>
      <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {faqs.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold text-navy-900 transition-colors hover:bg-slate-50">
              <h3 className="text-base font-bold">{faq.question}</h3>
              <svg
                aria-hidden
                className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
