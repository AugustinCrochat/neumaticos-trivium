import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { BRANCHES } from "@/lib/config";
import { ZonasAgrupadas } from "@/components/seo/ZonasAgrupadas";
import { LOCALIDADES, getBranchForLocalidad } from "@/lib/localidades";
import { canonical, SITE_NAME } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { poolShare } from "@/lib/share-image";

export const metadata: Metadata = {
  title: "Zonas donde atendemos — neumáticos baratos en Córdoba y Buenos Aires",
  description:
    "Vendemos neumáticos baratos, a precio de outlet, en Córdoba (Argüello, Villa Allende, Saldán, La Calera y Sierras Chicas) y en Buenos Aires (Lomas del Mirador, San Justo, La Matanza y zona oeste), con gomería propia y taller de alineación y balanceo.",
  alternates: canonical("/neumaticos-en"),
  openGraph: { title: `Zonas donde atendemos — ${SITE_NAME}`, url: "/neumaticos-en", ...poolShare("zonas").openGraph },
    twitter: poolShare("zonas").twitter,
};

export default function ZonasPage() {
  const cabecera = LOCALIDADES.filter((l) => l.esCabecera);
  const resto = LOCALIDADES.filter((l) => !l.esCabecera);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Dónde compramos", path: "/neumaticos-en" },
        ]}
      />

      <header className="mb-10">
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">
          Dónde vendemos neumáticos
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Tenemos local a la calle en Córdoba y estamos abriendo en Buenos Aires, sobre la zona
          oeste y el límite con Capital Federal. Si estás en alguna de estas zonas te conviene
          acercarte: el retiro es sin cargo y la colocación va incluida.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-4 text-xl font-black text-navy-900">Elegí tu ciudad o barrio</h2>
        <ZonasAgrupadas variant="light" />
      </section>

      {[...cabecera, ...resto].length > 0 && (
        <section className="mb-12">
          <div className="grid gap-4 md:grid-cols-2">
            {[...cabecera, ...resto].map((localidad) => {
              const branch = getBranchForLocalidad(localidad);
              return (
                <Link
                  key={localidad.slug}
                  href={`/neumaticos-en/${localidad.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-orange-400"
                >
                  <h2 className="text-xl font-black text-navy-900 group-hover:text-orange-600">
                    Neumáticos en {localidad.name}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-slate-400">
                    {localidad.minutosHastaSucursal} min del local de {branch.shortName}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {localidad.intro}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-gradient-to-br from-navy-950 to-black p-8 text-white">
        <h2 className="text-2xl font-black">¿Estás fuera de estas zonas?</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
          Buscá tu medida, mirá el precio y el stock publicados y consultanos por WhatsApp antes de
          venir: te confirmamos disponibilidad y te esperamos en el local.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/neumaticos"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
          >
            Buscar mi medida
          </Link>
          {BRANCHES.map((branch) => (
            <Link
              key={branch.id}
              href={`/sucursales/${branch.id}`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-black text-white transition-colors hover:bg-white/10"
            >
              Sucursal {branch.shortName}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
