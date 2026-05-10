import { TireSizeSearch } from "@/components/ui/TireSizeSearch";

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
          </div>

          {/* Right: search */}
          <div className="flex flex-col justify-center pt-0 pb-8 md:py-20">
            <TireSizeSearch />

            <p className="text-center text-xs text-slate-500 mt-5">
              ¿No sabés tu medida?{" "}
              <a
                href="/blog/como-leer-medida-neumatico"
                className="text-slate-600 hover:text-slate-900 font-medium underline underline-offset-2 transition-colors"
              >
                Aprendé a leerla acá
              </a>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
