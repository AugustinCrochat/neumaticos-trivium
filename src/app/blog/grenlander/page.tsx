import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grenlander: ¿Son buenos los neumáticos? Análisis y comparativa — Trivium",
  description:
    "Analizamos la marca Grenlander en profundidad: calidad, tecnología, comparación con Zmax, Pirelli y BFGoodrich, y cuándo conviene elegirlos.",
};

export default function GrenlanderPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-zinc-950 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-red-600 text-white font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Marcas
              </span>
              <time className="text-zinc-400 text-sm">29 de mayo de 2026</time>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Grenlander: ¿son buenos los neumáticos?
            </h1>
            <p className="text-zinc-300 text-lg leading-relaxed">
              Analizamos a fondo esta marca china de crecimiento acelerado:
              su historia, tecnología, rendimiento real y cómo se compara con
              otras opciones del mercado.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="space-y-10 text-zinc-600 leading-relaxed text-base md:text-lg">

          {/* Intro */}
          <p>
            Grenlander es una marca china fundada en 2009, parte del grupo{" "}
            <strong className="text-zinc-900">Sailun Tire</strong> —uno de los
            diez mayores fabricantes de neumáticos del mundo—. Desde su lanzamiento
            opera como línea de valor accesible con ambiciones técnicas serias:
            certificaciones europeas (ECE), homologaciones de transporte pesado y
            una gama que cubre desde autos de ciudad hasta camiones y SUVs de uso
            intensivo.
          </p>
          <p>
            En Argentina su presencia creció de forma notable a partir de 2022,
            cuando la brecha cambiaria encareció las marcas europeas y japonesas.
            Hoy ocupa un nicho claro: muy buen neumático a precio accesible, con
            respaldo de posventa local.
          </p>

          {/* Section 1 */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Tecnología y fabricación
          </h2>
          <p>
            Los neumáticos Grenlander se fabrican en plantas de Qingdao y
            Shenyang bajo estándares ISO/TS 16949. La construcción es{" "}
            <strong className="text-zinc-900">radial de acero</strong> en toda
            la gama, con compuestos de silicio en los modelos de mayor segmento
            que reducen la resistencia de rodadura y mejoran el agarre en mojado.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600">
            <li>
              <strong className="text-zinc-900">Línea Passenger (ENRI U08, JOURNEY):</strong> orientada a sedanes y hatchbacks. Banda de rodamiento asimétrica con canales de evacuación de agua de 4.ª generación.
            </li>
            <li>
              <strong className="text-zinc-900">Línea SUV / 4×4 (MAHO, EXPLORER):</strong> talón reforzado, carcasa de alta carga para vehículos pesados. Algunos modelos son All-Terrain con certificación M+S.
            </li>
            <li>
              <strong className="text-zinc-900">Línea Commercial (ESTONE):</strong> diseñada para camionetas de trabajo (Hilux, Ranger, S10). Alta resistencia a perforaciones laterales.
            </li>
          </ul>

          {/* Info box */}
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
            <h3 className="text-zinc-900 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Certificaciones que importan
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Toda la gama Grenlander comercializada en Argentina cumple con la
              norma <strong>ECE R30</strong> (Europa) o <strong>DOT</strong>{" "}
              (EE.UU.), lo que garantiza que superaron pruebas estandarizadas de
              resistencia estructural, velocidad máxima y frenado. No son
              neumáticos "sin certificar": pasaron los mismos tests de homologación
              que las marcas premium.
            </p>
          </div>

          {/* Section 2 */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Rendimiento real: lo bueno y lo justo
          </h2>
          <p>
            Basándonos en reseñas de propietarios, comparativas publicadas en
            foros especializados y pruebas independientes, Grenlander tiene un
            perfil de rendimiento bastante definido:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-3">Puntos fuertes</h3>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  Durabilidad sobre el promedio para la categoría precio. Usuarios reportan 50.000–65.000 km en uso urbano/ruta.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  Buen comportamiento en ruta seca. Respuesta de dirección precisa, sin deriva.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  Bajo nivel de ruido en autopista comparado con otros neumáticos de precio similar.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  Relación precio/kilometraje muy competitiva en Argentina.
                </li>
              </ul>
            </div>
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
              <h3 className="font-bold text-amber-900 mb-3">Aspectos a considerar</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">→</span>
                  El agarre en mojado es correcto pero no excepcional. En condiciones de lluvia intensa conviene manejar con más precaución que con marcas premium.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">→</span>
                  El confort en adoquinado o caminos irregulares es levemente inferior al de neumáticos con perfil más alto de marcas europeas.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">→</span>
                  No es la opción para manejo deportivo extremo o pistas. Está diseñado para uso cotidiano y turismo.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 — Comparativa */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Comparativa con otras marcas
          </h2>
          <p>
            Para entender mejor dónde encaja Grenlander, la comparamos con
            cuatro referencias habituales en el mercado argentino:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-950 text-white">
                  <th className="text-left px-4 py-3 font-bold">Marca</th>
                  <th className="text-center px-4 py-3 font-bold">Origen</th>
                  <th className="text-center px-4 py-3 font-bold">Precio relativo</th>
                  <th className="text-center px-4 py-3 font-bold">Durabilidad</th>
                  <th className="text-center px-4 py-3 font-bold">Agarre mojado</th>
                  <th className="text-center px-4 py-3 font-bold">Mejor para</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="bg-red-50">
                  <td className="px-4 py-3 font-bold text-zinc-900">Grenlander</td>
                  <td className="px-4 py-3 text-center text-zinc-600">China</td>
                  <td className="px-4 py-3 text-center">💲</td>
                  <td className="px-4 py-3 text-center">★★★★☆</td>
                  <td className="px-4 py-3 text-center">★★★☆☆</td>
                  <td className="px-4 py-3 text-zinc-600">Ciudad / ruta / SUV trabajo</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-zinc-900">Zmax</td>
                  <td className="px-4 py-3 text-center text-zinc-600">China</td>
                  <td className="px-4 py-3 text-center">💲</td>
                  <td className="px-4 py-3 text-center">★★★★☆</td>
                  <td className="px-4 py-3 text-center">★★★☆☆</td>
                  <td className="px-4 py-3 text-zinc-600">Utilitarios y SUVs medianos</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="px-4 py-3 font-bold text-zinc-900">BFGoodrich</td>
                  <td className="px-4 py-3 text-center text-zinc-600">EE.UU.</td>
                  <td className="px-4 py-3 text-center">💲💲💲</td>
                  <td className="px-4 py-3 text-center">★★★★★</td>
                  <td className="px-4 py-3 text-center">★★★★☆</td>
                  <td className="px-4 py-3 text-zinc-600">Off-road intensivo y 4×4</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-zinc-900">Pirelli</td>
                  <td className="px-4 py-3 text-center text-zinc-600">Italia</td>
                  <td className="px-4 py-3 text-center">💲💲💲💲</td>
                  <td className="px-4 py-3 text-center">★★★★★</td>
                  <td className="px-4 py-3 text-center">★★★★★</td>
                  <td className="px-4 py-3 text-zinc-600">Performance y autos de lujo</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="px-4 py-3 font-bold text-zinc-900">Michelin</td>
                  <td className="px-4 py-3 text-center text-zinc-600">Francia</td>
                  <td className="px-4 py-3 text-center">💲💲💲💲💲</td>
                  <td className="px-4 py-3 text-center">★★★★★</td>
                  <td className="px-4 py-3 text-center">★★★★★</td>
                  <td className="px-4 py-3 text-zinc-600">Máxima seguridad y kilómetros</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            La conclusión de la tabla es clara: <strong className="text-zinc-900">Grenlander y Zmax
            están al mismo nivel de precio y prestaciones generales</strong>, con
            diferencias menores según el modelo. BFGoodrich, Pirelli y Michelin
            son superiores en agarre extremo, pero cuestan entre 3 y 6 veces más
            en el mercado argentino actual. Para el conductor promedio que hace
            ciudad y ruta, la diferencia de rendimiento cotidiano no justifica
            esa brecha.
          </p>

          {/* Section 4 */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            ¿A quién le recomendamos Grenlander?
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 rounded-xl border border-zinc-100 bg-zinc-50">
              <span className="text-2xl flex-shrink-0">🚗</span>
              <div>
                <p className="font-bold text-zinc-900">Conductores de uso urbano y ruta</p>
                <p className="text-sm text-zinc-600">Si manejás un sedán o hatchback para ir al trabajo y salidas de fin de semana, Grenlander te da un excelente kilometraje a un precio muy accesible.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-xl border border-zinc-100 bg-zinc-50">
              <span className="text-2xl flex-shrink-0">🛻</span>
              <div>
                <p className="font-bold text-zinc-900">Propietarios de SUVs y pick-ups de trabajo</p>
                <p className="text-sm text-zinc-600">La línea ESTONE y MAHO está diseñada para cargas pesadas y uso off-road moderado. Son una alternativa real frente a marcas comerciales más caras.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-xl border border-zinc-100 bg-zinc-50">
              <span className="text-2xl flex-shrink-0">📦</span>
              <div>
                <p className="font-bold text-zinc-900">Empresas con flota</p>
                <p className="text-sm text-zinc-600">El costo por kilómetro de Grenlander lo hace muy atractivo para flotas de reparto o remises donde el volumen de compra es alto y el margen cuenta.</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-950 rounded-2xl text-white">
            <h3 className="font-bold text-lg mb-2">Veredicto Trivium</h3>
            <p className="text-zinc-300 leading-relaxed">
              Grenlander es un neumático <strong className="text-white">genuinamente bueno</strong> para
              su categoría de precio. No compite con Michelin o Pirelli en las
              métricas técnicas de punta, pero tampoco lo pretende: compite en
              la relación <em>costo total de uso / kilómetros recorridos</em>, y
              ahí tiene mucho para ofrecer. Es una marca que recomendamos con
              confianza para el uso cotidiano argentino.
            </p>
          </div>

        </div>
      </div>

      {/* Models section */}
      <div className="bg-zinc-50 border-t border-zinc-100 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-zinc-900 mb-2 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Modelos disponibles en Trivium
          </h2>
          <p className="text-zinc-500 mb-10">
            Estos son los modelos Grenlander que podés encontrar en nuestro catálogo.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Turismo / Ciudad</p>
              <h3 className="text-lg font-black text-zinc-900 mb-2">COLO H02</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Neumático de turismo para uso urbano y ruta. Banda asimétrica con buena evacuación de agua y rodadura silenciosa. Apunta a sedanes y hatchbacks de uso diario.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Turismo / Ciudad</p>
              <h3 className="text-lg font-black text-zinc-900 mb-2">KINGPRO ONE</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Orientado a autos compactos y medianos. Diseño de banda enfocado en la durabilidad y el bajo consumo de combustible, ideal para quienes buscan largo kilometraje.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">SUV / Crossover</p>
              <h3 className="text-lg font-black text-zinc-900 mb-2">L-MAX9</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Diseñado para SUVs y vehículos de mayor porte. Carcasa reforzada para soportar más carga, con buen desempeño tanto en asfalto como en camino consolidado.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">SUV / Crossover</p>
              <h3 className="text-lg font-black text-zinc-900 mb-2">L-ZEAL56</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Perfil deportivo para SUVs. Mayor respuesta de dirección y agarre en curva, pensado para vehículos donde el conductor busca algo más de dinamismo.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">SUV / Larga distancia</p>
              <h3 className="text-lg font-black text-zinc-900 mb-2">STRATOUR E1</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Touring de larga distancia. Perfil optimizado para minimizar el calentamiento en viajes largos y autopista, con bajo nivel sonoro y estabilidad a alta velocidad.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">All-Terrain / 4×4</p>
              <h3 className="text-lg font-black text-zinc-900 mb-2">MAGA A/T TWO</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                All-Terrain para pick-ups y 4×4. Tacos pronunciados con certificación M+S, pensado para quienes alternan asfalto con ripio, campo o caminos de tierra.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:col-span-2">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Comercial / Carga</p>
              <h3 className="text-lg font-black text-zinc-900 mb-2">AA112</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Neumático para uso comercial y vehículos de carga liviana. Alta resistencia a la deformación bajo peso sostenido, indicado para furgones, camionetas de reparto y flotas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA — Link to brand page */}
      <div className="bg-zinc-950 py-16 text-center">
        <p className="text-zinc-400 text-sm uppercase tracking-widest mb-3 font-semibold">
          Disponible en Trivium
        </p>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
          Explorá todos los neumáticos Grenlander
        </h2>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          Encontrá el modelo y la medida que necesitás, con stock disponible y envío a todo el país.
        </p>
        <Link
          href="/marcas/grenlander"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-red-600/30 active:scale-95"
        >
          Ver neumáticos Grenlander
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
