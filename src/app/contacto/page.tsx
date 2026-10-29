import type { Metadata } from "next";
import { LEGAL_NAME, CUIT, CONTACT_EMAIL } from "@/lib/config";
import { canonical } from "@/lib/seo";
import { HorarioBloque } from "@/components/tools/HorarioBloque";
import { ContactoSucursales } from "./ContactoSucursales";

export const metadata: Metadata = {
  title: "Contacto — WhatsApp, teléfono y ubicación",
  description:
    "Escribinos por WhatsApp, llamanos o pasá por el local. Te asesoramos con la medida, el stock y el precio antes de que hagas el viaje.",
  alternates: canonical("/contacto"),
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <h1 className="sr-only">Contacto</h1>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <ContactoSucursales />

        <HorarioBloque />

        {/* Datos legales */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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
      </div>
    </div>
  );
}
