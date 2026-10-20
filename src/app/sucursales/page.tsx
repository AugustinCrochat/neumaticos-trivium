import Link from "next/link";
import type { Metadata } from "next";
import { BRANCHES } from "@/lib/config";
import { BranchesMap } from "./BranchesMap";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sucursales de neumáticos y gomería en Córdoba",
  description:
    "Dirección, horarios, teléfono y cómo llegar a las sucursales de Neumáticos Trivium. Local con stock propio y taller de alineación y balanceo en Córdoba.",
  alternates: canonical("/sucursales"),
};

export default function SucursalesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-black py-10 md:py-14">
        <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4">
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
      />
    </div>
  );
}
