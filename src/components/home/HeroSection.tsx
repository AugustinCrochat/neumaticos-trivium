import Image from "next/image";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { BRANCHES } from "@/lib/config";

export function HeroSection() {
  const foto = BRANCHES[0].facadePhoto;

  return (
    <section id="hero" className="relative overflow-hidden bg-navy-950">
      {/* Foto real del local de fondo, muy tenue: da contexto de negocio físico
          sin competir con el título ni con el buscador. */}
      {foto && (
        <>
          <Image src={foto} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/50" />
        </>
      )}
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-0 min-h-[480px]">

          {/* Left: copy */}
          <div className="flex flex-col justify-center pt-10 pb-5 md:py-20 pr-0 md:pr-12">
            <span className="mb-4 inline-flex w-fit rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              Importación directa · Precios outlet
            </span>
            <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
              El outlet del{" "}
              <span className="text-orange-500">neumático</span>
            </h1>
            {/* El H1 es la marca; este párrafo es el que nombra el rubro como
                lo busca la gente ("cubiertas", "auto y camioneta", el envío y
                la ciudad). Sin él, la home no tenía ni una frase indexable
                debajo del título. */}
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
              Cubiertas para auto y camioneta de importación directa, con stock real y precio
              publicado. Envío a todo el país o retiro sin cargo en nuestro local de Córdoba, con
              colocación incluida.
            </p>
            <GoogleRatingBadge className="text-white mt-5" />
          </div>

          {/* Right: search */}
          <div className="flex flex-col justify-center pt-0 pb-8 md:py-20">
            <SizeOrVehicleSearch />
          </div>

        </div>
      </div>
    </section>
  );
}
