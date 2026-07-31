import Link from "next/link";
import type { Metadata } from "next";
import { BRANCHES, LEGAL_NAME, CUIT, CONTACT_EMAIL } from "@/lib/config";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contacto — WhatsApp, teléfono y ubicación",
  description:
    "Escribinos por WhatsApp, llamanos o pasá por el local. Te asesoramos con la medida, el stock y el precio antes de que hagas el viaje.",
  alternates: canonical("/contacto"),
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-900 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-navy-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Inicio
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Contacto</h1>
          <p className="text-navy-300 text-sm">
            Elegí una sucursal para llamar, escribir por WhatsApp o abrir indicaciones.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-navy-900 font-bold text-sm">{LEGAL_NAME}</p>
            <p className="text-slate-500 text-xs">CUIT {CUIT}</p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 font-semibold text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {CONTACT_EMAIL}
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BRANCHES.map((branch) => (
            <div key={branch.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-navy-900 font-bold text-lg">{branch.name}</p>
              <p className="text-slate-600 text-sm mt-1">{branch.address}</p>
              <p className="text-slate-600 text-sm">{branch.city}</p>
              <p className="text-slate-500 text-xs mt-2">{branch.hours}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${branch.phone.replace(/\s/g, "")}`}
                  className="bg-navy-100 hover:bg-navy-200 text-navy-900 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  Llamar
                </a>
                <a
                  href={`https://wa.me/${branch.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#1f9f4b] text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  Ver mapa
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
