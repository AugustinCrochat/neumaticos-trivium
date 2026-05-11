import Link from "next/link";
import Image from "next/image";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";

export const metadata = {
  title: "¿Cómo leer la medida de tu neumático? — Trivium",
  description: "Aprendé a identificar el ancho, perfil y rodado de tus cubiertas de forma fácil con nuestra guía visual.",
};

export default function ComoLeerMedidaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header / Search Area */}
      <div className="bg-navy-900 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
              ¿No sabés tu medida?
            </h1>
            <p className="text-navy-200 text-lg mb-10">
              Ingresala acá abajo si ya la tenés, o seguí leyendo para aprender a identificarla en tu rueda.
            </p>

            <TireSizeSearch hideLearnLink />
          </div>
        </div>
      </div>

      {/* Guide Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Visual Diagram Image */}
          <div className="relative group overflow-hidden shadow-2xl shadow-navy-900/10 border border-slate-100">
            <Image 
              src="/como-leer-la-medida-de-un-neumatico.webp" 
              alt="Diagrama explicativo de cómo leer un neumático"
              width={800}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Text Guide */}
          <div>
            <h2 className="text-2xl font-black text-navy-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
              Guía rápida de lectura
            </h2>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-orange-600 mb-2 uppercase tracking-tight">1. Ancho (Ej: 195)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Es el primer número que aparece en la serie. Indica el ancho del neumático en milímetros. En nuestro ejemplo, el neumático tiene <span className="font-bold text-slate-900">195 mm</span> de ancho de pared a pared.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-blue-600 mb-2 uppercase tracking-tight">2. Perfil (Ej: 55)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Es la relación porcentual entre la altura del flanco y el ancho del neumático. Un perfil <span className="font-bold text-slate-900">55</span> significa que la altura de la goma es el 55% de su ancho.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-green-600 mb-2 uppercase tracking-tight">3. Rodado (Ej: 15)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Acompañado de una <span className="font-bold text-slate-900">R</span> (de estructura Radial), este número indica el diámetro de la llanta en pulgadas. Es fundamental para que el neumático calce perfectamente en tu vehículo.
                </p>
              </section>
            </div>

            <div className="mt-12 p-6 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-orange-900 font-bold mb-2">💡 Tip Trivium:</p>
              <p className="text-orange-800 text-sm leading-relaxed">
                Podés encontrar esta medida grabada en el **costado (flanco)** de tus neumáticos actuales. También suele figurar en una calcomanía en el marco de la puerta del conductor o en el manual del auto.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-50 py-16 border-t border-slate-100 text-center">
        <h2 className="text-2xl font-black text-navy-900 mb-6">¿Ya encontraste tu medida?</h2>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 bg-navy-900 hover:bg-orange-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-orange-500/20 active:scale-95"
        >
          Explorar todo el catálogo
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
