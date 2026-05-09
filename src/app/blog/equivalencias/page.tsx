import Link from "next/link";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { EquivalenceCalculator } from "@/components/ui/EquivalenceCalculator";

export const metadata = {
  title: "Equivalencias de neumáticos: ¿Qué son y cómo funcionan? — Trivium",
  description: "Entendé cómo funcionan las medidas equivalentes, qué significa el ±3% de diferencia de diámetro y qué consideraciones tener.",
};

export default function EquivalenciasPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy-900 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
              ¿Qué es una medida equivalente?
            </h1>
            <p className="text-navy-200 text-lg mb-10">
              A veces no se consigue la medida original de fábrica. Descubrí cómo buscar una alternativa segura.
            </p>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-2xl">
              <TireSizeSearch />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl font-black text-navy-900 mb-8 flex items-center gap-3">
          <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
          El límite del ±3% de diferencia
        </h2>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <p>
            Al cambiar los neumáticos de tu vehículo por unos de diferente medida, es fundamental asegurarse de que el <strong>diámetro total de la nueva rueda no varíe más de un ±3%</strong> con respecto al diámetro del neumático original de fábrica.
          </p>
          
          <p>
            Mantenerse dentro de este margen asegura que el velocímetro siga marcando la velocidad correctamente, que el comportamiento dinámico del auto (frenado, estabilidad) no se vea comprometido y que el desarrollo de la transmisión sea el adecuado.
          </p>

          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 mt-8">
            <h3 className="text-emerald-900 font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Requisitos y precauciones para usar medidas alternativas
            </h3>
            <ul className="list-disc pl-5 space-y-3 text-emerald-800">
              <li><strong>Transmisión manual:</strong> Se recomienda aplicar medidas alternativas únicamente si el auto es de caja manual, ya que las variaciones de desarrollo pueden afectar el comportamiento o la programación de cajas automáticas modernas.</li>
              <li><strong>Mismo rodado (llanta):</strong> La medida alternativa debe mantener el diámetro de la llanta original para que puedas montarla sin tener que cambiar las llantas del vehículo.</li>
              <li><strong>Prueba de roce:</strong> Tras la instalación, es <strong>obligatorio</strong> probar el vehículo girando la dirección de tope a tope y verificar que el neumático no toque partes del tren delantero, amortiguadores, ni los plásticos de los guardabarros (pasarruedas).</li>
            </ul>
          </div>

          <h2 className="text-2xl font-black text-navy-900 mt-12 mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
            ¿Cómo calculamos la equivalencia?
          </h2>
          <p>
            El cálculo consiste en obtener el diámetro total de ambas ruedas y sacar la diferencia porcentual. El diámetro de una rueda se obtiene sumando el diámetro de la llanta en milímetros más dos veces la altura del perfil. 
          </p>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-sm overflow-x-auto text-slate-700">
            Diámetro = (Rodado × 25.4) + 2 × (Ancho × (Perfil / 100))
            <br/><br/>
            Diferencia % = ((Diámetro Nuevo - Diámetro Original) / Diámetro Original) × 100
          </div>
          <p>
            La regla rápida para compensar medidas (manteniendo la misma llanta) es que si <strong>aumentás el ancho</strong> (ej. de 195 a 205), tenés que <strong>bajar el perfil</strong> (ej. de 65 a 60), de modo que el diámetro total se mantenga prácticamente igual.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-black text-navy-900 mb-8 flex items-center gap-3">
            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
            Calculadora de Equivalencias
          </h2>
          <EquivalenceCalculator />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-50 py-16 border-t border-slate-100 text-center">
        <h2 className="text-2xl font-black text-navy-900 mb-6">¿Buscás alternativas para tu auto?</h2>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 bg-navy-900 hover:bg-emerald-600 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-emerald-600/20 active:scale-95"
        >
          Explorar el catálogo
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
