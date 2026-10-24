import Image from "next/image";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { BRANCHES } from "@/lib/config";

export function HeroSection() {
  const foto = BRANCHES[0].facadePhoto;

  return (
    <section id="hero" className="relative overflow-hidden bg-navy-950">
      {/* Foto real del local de fondo, muy tenue: da contexto de negocio físico
          sin competir con el título ni con el buscador. */}
      {foto && (
        <>
          <Image src={foto} alt="" fill priority sizes="100vw" className="object-cover object-top opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10" />
        </>
      )}
      <div className="relative max-w-7xl 2xl:max-w-[96rem] mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-0 min-h-[480px]">

          {/* Left: copy */}
          <div className="flex flex-col justify-center pt-10 pb-5 md:py-20 pr-0 md:pr-12">
            <span className="mb-4 inline-flex w-fit rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              Outlet · Importación directa · Córdoba
            </span>
            <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
              Neumáticos baratos
              <span className="mt-3 block text-3xl font-bold tracking-normal text-slate-200 md:text-4xl lg:text-5xl">
                Precio publicado, stock real
              </span>
            </h1>
            {/* El H1 va por precio, que es lo que impulsamos y lo que busca la
                gente; este párrafo suma el resto del rubro ("cubiertas", "auto
                y camioneta", el envío y la ciudad). */}
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
              Cubiertas al mejor precio para auto, camioneta, A/T y carga, de importación directa,
              con stock real y precio publicado. Retiro en nuestro local de Córdoba con colocación
              incluida, gomería propia (alineación, balanceo y rotación) y envío a todo el país.
            </p>
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
