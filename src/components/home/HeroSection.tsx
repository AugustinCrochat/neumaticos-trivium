import { TireSizeSearch } from "@/components/ui/TireSizeSearch";

export function HeroSection() {
  return (
    <section id="hero" className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-0 min-h-[480px]">

          {/* Left: copy */}
          <div className="flex flex-col justify-center py-14 md:py-20 pr-0 md:pr-12">
            <span className="inline-block text-orange-500 text-xs font-black uppercase tracking-widest mb-4">
              Importación directa · Precios outlet
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-5">
              El outlet del{" "}
              <span className="text-orange-500">neumático</span>
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-sm">
              Más de 180 referencias importadas a precios imbatibles.
              Montaje incluido en el local.
            </p>

            <div className="flex flex-wrap gap-5 mt-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Precios outlet
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Montaje incluido
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                2 sucursales
              </div>
            </div>
          </div>

          {/* Right: search */}
          <div className="flex flex-col justify-center py-10 md:py-20">
            <div className="bg-slate-900 rounded-2xl p-6 md:p-8">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                Buscador de neumáticos
              </p>
              <p className="text-white font-bold text-lg mb-6">
                Ingresá la medida de tu vehículo
              </p>

              <TireSizeSearch />

              <p className="text-center text-xs text-slate-500 mt-5">
                ¿No sabés tu medida?{" "}
                <a
                  href="/blog/como-leer-medida-neumatico"
                  className="text-slate-300 hover:text-white font-medium underline underline-offset-2 transition-colors"
                >
                  Aprendé a leerla acá
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
