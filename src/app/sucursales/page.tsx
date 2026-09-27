import Link from "next/link";
import type { Metadata } from "next";
import { BRANCHES } from "@/lib/config";
import { BranchesMap } from "./BranchesMap";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sucursales — dónde estamos",
  description:
    "Dirección, horarios, teléfono y cómo llegar a las sucursales de Neumáticos Trivium. Local con stock propio y taller de alineación y balanceo en Córdoba.",
  alternates: canonical("/sucursales"),
};

export default function SucursalesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-black py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Inicio
          </Link>

          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-orange-400">
              Red de atencion
            </p>
            <h1 className="text-3xl font-black text-white md:text-5xl">
              Sucursales Neumaticos Trivium
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
              Elegi la sucursal mas cercana, revisa horarios y abri las
              indicaciones para llegar directo desde tu ubicacion.
            </p>
          </div>
        </div>
      </div>

      <BranchesMap
        branches={BRANCHES}
        comingSoon={[
          {
            id: "san-justo",
            name: "San Justo",
            address: "Pres. Juan Domingo Perón 2847, San Justo, La Matanza, Buenos Aires",
            // Coordenadas exactas (de Google Maps, ubicación real del local).
            coordinates: { lat: -34.6736285, lng: -58.5606326 },
          },
        ]}
      />

      {/* San Justo todavía no tiene POS, teléfono ni horarios propios, así
          que no entra en BRANCHES (eso rompería checkout, el feed de Google
          Merchant y /sucursales/[id], que asumen una sucursal operativa).
          Es solo un anuncio hasta que abra. */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-6 md:p-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-orange-600">
            Próximamente
          </p>
          <h2 className="text-xl font-black text-navy-900 md:text-2xl">Nueva sucursal en San Justo</h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
            En aproximadamente 2 meses abrimos en San Justo, partido de La Matanza, provincia de Buenos Aires:
            Presidente Juan Domingo Perón 2847 (CP 1745).
          </p>
        </div>
      </div>
    </div>
  );
}
