import type { Metadata } from "next";
import { canonical } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CotizadorClient } from "./CotizadorClient";

export const metadata: Metadata = {
  title: "Cotizador de neumáticos — armá tu presupuesto",
  description:
    "Elegí tus neumáticos y la cantidad, sumá alineación y balanceo si querés, y armá tu presupuesto al instante. Compartilo por WhatsApp para coordinar la compra.",
  alternates: canonical("/cotizador"),
};

export default function CotizadorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Cotizador", path: "/cotizador" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">
          Cotizador de neumáticos
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Elegí los neumáticos y la cantidad que necesitás, sumá el servicio si querés, y mirá el
          total al instante. Después lo compartís por WhatsApp para coordinar la compra o la
          reserva, sin ningún compromiso.
        </p>
      </header>

      <CotizadorClient />
    </div>
  );
}
