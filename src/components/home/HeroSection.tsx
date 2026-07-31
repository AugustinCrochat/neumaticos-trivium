import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";

export function HeroSection() {
  return (
    <section id="hero" className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-0 min-h-[480px]">

          {/* Left: copy */}
          <div className="flex flex-col justify-center pt-10 pb-5 md:py-20 pr-0 md:pr-12">
            <span className="inline-block text-orange-500 text-xs font-black uppercase tracking-widest mb-4">
              Importación directa · Precios outlet
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05]">
              El outlet del{" "}
              <span className="text-orange-500">neumático</span>
            </h1>
            {/* El H1 es la marca; este párrafo es el que nombra el rubro como
                lo busca la gente ("cubiertas", "auto y camioneta", el envío y
                la ciudad). Sin él, la home no tenía ni una frase indexable
                debajo del título. */}
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">
              Cubiertas para auto y camioneta de importación directa, con stock real y precio
              publicado. Envío a todo el país o retiro sin cargo en nuestro local de Córdoba, con
              colocación incluida.
            </p>
            <GoogleRatingBadge className="text-slate-700 mt-5" />
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
