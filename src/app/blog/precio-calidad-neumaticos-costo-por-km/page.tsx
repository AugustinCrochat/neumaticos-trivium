import Link from "next/link";
import type { Metadata } from "next";
import { breadcrumbJsonLd, canonical } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { BlogCoverStrip, BlogSearchStrip } from "@/components/blog/BlogShop";
import { blogShare } from "@/lib/blog-meta";

export const metadata: Metadata = {
  ...blogShare("precio-calidad-neumaticos-costo-por-km"),
  title: "Precio y calidad en neumáticos: cuánto sale cada kilómetro — Trivium",
  description:
    "El precio de lista no dice nada solo: lo que importa es cuánto cuesta cada kilómetro recorrido. Comparamos Grenlander contra otras marcas por costo/km, estándares de fabricación y homologación en Europa, Estados Unidos y Argentina.",
  alternates: canonical("/blog/precio-calidad-neumaticos-costo-por-km"),
};

export default function PrecioCalidadNeumaticosPage() {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: "Precio y calidad", path: "/blog/precio-calidad-neumaticos-costo-por-km" },
        ])}
      />

      {/* Header */}
      <div className="bg-zinc-950 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-red-600 text-white font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Marcas
              </span>
              <time className="text-zinc-400 text-sm">26 de septiembre de 2026</time>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Precio y calidad: cuánto sale realmente cada kilómetro
            </h1>
            <p className="text-zinc-300 text-lg leading-relaxed">
              El precio de lista no dice nada por sí solo. Lo que define si un neumático es una
              buena compra es cuánto cuesta cada kilómetro que te lleva, y ahí la cuenta cambia
              bastante respecto de mirar solo el cartel del mostrador.
            </p>
          </div>
        </div>
      </div>

      <BlogCoverStrip slug="precio-calidad-neumaticos-costo-por-km" />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="space-y-10 text-zinc-600 leading-relaxed text-base md:text-lg">

          {/* Intro */}
          <p>
            &ldquo;¿Cuál es el más barato?&rdquo; es la pregunta que más escuchamos en el mostrador, y
            es la pregunta equivocada. El precio de compra es un solo número en una cuenta que
            tiene más variables: cuántos kilómetros te da ese neumático antes de tener que
            cambiarlo, qué tan seguro es en mojado, y si vas a poder hacer valer la garantía si
            algo sale mal. Comprar por precio de lista, sin mirar el resto, es la forma más común
            de terminar pagando más por kilómetro recorrido con un neumático &ldquo;barato&rdquo; que con
            uno de precio medio bien elegido.
          </p>
          <p>
            En esta nota armamos la cuenta completa: cómo calcular el costo real por kilómetro,
            dónde se ubica <strong className="text-zinc-900">Grenlander</strong> frente a otras
            marcas del mercado argentino en esa cuenta, qué estándares de fabricación hay detrás
            de un neumático serio, y qué significan las homologaciones que vas a encontrar
            grabadas en el flanco en Europa, Estados Unidos y Argentina.
          </p>

          {/* Section 1: la cuenta */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            La cuenta que importa: precio ÷ kilómetros de vida útil
          </h2>
          <p>
            El costo por kilómetro se calcula así: <strong className="text-zinc-900">precio del
            neumático dividido los kilómetros reales que te va a durar</strong>. No es una cuenta
            exótica, es la misma lógica que usás para comparar el gasto en combustible entre dos
            autos, y en neumáticos es la que de verdad separa una buena compra de una mala.
          </p>

          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
            <h3 className="text-zinc-900 font-bold mb-3">Ejemplo (números redondos, a modo ilustrativo)</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-white rounded-xl border border-zinc-100">
                <p className="font-bold text-zinc-900 mb-1">Neumático económico sin trazabilidad</p>
                <p className="text-zinc-500">Precio: $100.000 · Dura ~25.000 km</p>
                <p className="mt-2 font-black text-red-600">≈ $4,00 por km</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-emerald-200">
                <p className="font-bold text-zinc-900 mb-1">Grenlander (calidad real)</p>
                <p className="text-zinc-500">Precio: $150.000 · Dura ~55.000 km</p>
                <p className="mt-2 font-black text-emerald-600">≈ $2,73 por km</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
              El neumático más caro de los dos termina siendo, en los hechos, el más barato: cuesta
              50% más al mostrador pero te da más del doble de kilómetros, así que el costo por
              kilómetro recorrido es menor. Los precios y km de este ejemplo son ilustrativos —
              usá los precios reales publicados en cada{" "}
              <Link href="/marcas" className="font-bold text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-900">
                ficha de marca
              </Link>{" "}
              y el kilometraje reportado por otros usuarios para hacer la cuenta con tu propio
              vehículo y uso.
            </p>
          </div>

          <p>
            Esta cuenta es la que explica por qué un neumático de franja de entrada, sin
            trazabilidad ni homologación verificable, casi nunca es la compra más barata a pesar
            de tener el precio de etiqueta más bajo: suele durar menos, desgastarse de forma
            irregular y no tener garantía real detrás si algo falla antes de tiempo.
          </p>

          {/* Section 2: comparativa */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Dónde se ubica Grenlander frente a otras marcas
          </h2>
          <p>
            Ordenando las opciones más habituales del mercado argentino por esta misma lógica —no
            por precio de lista solo, sino por precio relativo contra durabilidad esperada— el
            panorama queda así:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-950 text-white">
                  <th className="text-left px-4 py-3 font-bold">Marca</th>
                  <th className="text-center px-4 py-3 font-bold">Precio relativo</th>
                  <th className="text-center px-4 py-3 font-bold">Vida útil estimada</th>
                  <th className="text-center px-4 py-3 font-bold">Costo por km</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="bg-red-50">
                  <td className="px-4 py-3 font-bold text-zinc-900">Grenlander</td>
                  <td className="px-4 py-3 text-center">💲💲</td>
                  <td className="px-4 py-3 text-center text-zinc-600">50.000–65.000 km</td>
                  <td className="px-4 py-3 text-center font-black text-emerald-600">Bajo</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-zinc-900">Zmax</td>
                  <td className="px-4 py-3 text-center">💲💲</td>
                  <td className="px-4 py-3 text-center text-zinc-600">45.000–60.000 km</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600">Bajo</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="px-4 py-3 font-bold text-zinc-900">Fate</td>
                  <td className="px-4 py-3 text-center">💲💲</td>
                  <td className="px-4 py-3 text-center text-zinc-600">45.000–55.000 km</td>
                  <td className="px-4 py-3 text-center font-bold text-amber-600">Medio</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-zinc-900">Dunlop</td>
                  <td className="px-4 py-3 text-center">💲💲💲</td>
                  <td className="px-4 py-3 text-center text-zinc-600">50.000–65.000 km</td>
                  <td className="px-4 py-3 text-center font-bold text-amber-600">Medio</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="px-4 py-3 font-bold text-zinc-900">Firestone</td>
                  <td className="px-4 py-3 text-center">💲💲💲</td>
                  <td className="px-4 py-3 text-center text-zinc-600">50.000–65.000 km</td>
                  <td className="px-4 py-3 text-center font-bold text-amber-600">Medio</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-zinc-900">BFGoodrich</td>
                  <td className="px-4 py-3 text-center">💲💲💲</td>
                  <td className="px-4 py-3 text-center text-zinc-600">50.000–70.000 km</td>
                  <td className="px-4 py-3 text-center font-bold text-amber-600">Medio</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="px-4 py-3 font-bold text-zinc-900">Goodyear</td>
                  <td className="px-4 py-3 text-center">💲💲💲💲</td>
                  <td className="px-4 py-3 text-center text-zinc-600">55.000–70.000 km</td>
                  <td className="px-4 py-3 text-center font-bold text-amber-600">Medio-alto</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-zinc-900">Pirelli / Michelin</td>
                  <td className="px-4 py-3 text-center">💲💲💲💲💲</td>
                  <td className="px-4 py-3 text-center text-zinc-600">55.000–75.000 km</td>
                  <td className="px-4 py-3 text-center font-bold text-amber-600">Medio-alto</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-400">
            Vida útil estimada según uso mixto ciudad/ruta y reportes de posventa; varía según
            vehículo, alineación y tipo de manejo. No reemplaza el kilometraje real de tu auto.
          </p>

          <p>
            La lectura de la tabla es clara contra el grupo de marcas de fábrica reconocida y
            trayectoria real —que es la comparación que importa, no contra una franja de entrada
            sin trazabilidad que ya de por sí pierde por goleada—. Fate, Dunlop, Firestone y
            BFGoodrich rinden una durabilidad pareja o apenas mayor a la de Grenlander, pero
            cuestan entre 50% y el doble más. Goodyear, Pirelli y Michelin duran algo más y frenan
            mejor en mojado, pero cuestan entre el doble y 3 veces más. En todos los casos el costo
            por kilómetro de Grenlander queda igual o por debajo, que es justamente el punto: no
            hace falta pagar la marca más cara para tener un costo por kilómetro competitivo, si el
            fabricante detrás cumple con estándares y homologación reales.
          </p>

          {/* Section 3: estándares de fabricación */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Qué hay detrás del precio: estándares de fabricación
          </h2>
          <p>
            La razón por la que esta cuenta le sale bien a Grenlander no es casualidad de
            marketing: está fabricada por <strong className="text-zinc-900">Zodo Tyre</strong>,
            un grupo con décadas de trayectoria, en plantas propias certificadas bajo la norma{" "}
            <strong className="text-zinc-900">ISO/TS 16949</strong> (el estándar de gestión de
            calidad específico para la industria automotriz, más exigente que un ISO 9001
            genérico). Tres decisiones de fabricación explican la diferencia en durabilidad:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600">
            <li>
              <strong className="text-zinc-900">Carcasa radial de acero</strong> en toda la gama:
              sostiene la forma del neumático bajo carga y calor en vez de deformarse con el uso,
              que es lo que determina que el desgaste sea parejo y no prematuro.
            </li>
            <li>
              <strong className="text-zinc-900">Compuestos con carga de sílice</strong> en los
              modelos de mayor segmento: bajan la resistencia a la rodadura (menos desgaste, menos
              consumo) sin perder tanto agarre en mojado como un compuesto genérico de caucho.
            </li>
            <li>
              <strong className="text-zinc-900">Desarrollo propio de banda de rodamiento</strong>{" "}
              con canales de evacuación de agua diseñados para el modelo, no una copia genérica de
              dibujo —la diferencia entre un neumático diseñado y uno ensamblado.
            </li>
          </ul>
          <p>
            Una fábrica sin estos tres puntos puede vender un neumático más barato al mostrador,
            pero esa plata la termina cobrando en kilómetros perdidos, no en la caja.
          </p>

          {/* Section 4: homologaciones */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Homologaciones: el dato objetivo grabado en el flanco
          </h2>
          <p>
            Si no querés depender de la palabra de nadie, la homologación es el dato más objetivo
            que existe: es un código grabado en el flanco del neumático que certifica que pasó
            ensayos estandarizados de resistencia estructural, velocidad y frenado. No lo emite el
            fabricante por su cuenta, lo exige el organismo regulador del mercado donde se vende.
            Grenlander trae, según el mercado de destino del modelo, homologación europea o
            estadounidense — acá te explicamos cada una y qué exige en la Argentina.
          </p>

          <div className="space-y-4">
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">🇪🇺 Europa — ECE R30</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                El Reglamento N.º 30 de Naciones Unidas (adoptado por la Unión Europea) exige que
                cada neumático supere ensayos de resistencia de la carcasa bajo carga, velocidad
                máxima sostenida según el índice marcado, y comportamiento en condiciones límite.
                Sin esta homologación, un neumático no puede venderse legalmente en el mercado
                europeo. Es la referencia técnica más citada a nivel mundial porque es de las más
                exigentes.
              </p>
            </div>
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2">🇺🇸 Estados Unidos — DOT / FMVSS</h3>
              <p className="text-sm text-indigo-800 leading-relaxed">
                El Departamento de Transporte (DOT) exige el cumplimiento de las normas federales{" "}
                <strong>FMVSS 109 y 119</strong> según el tipo de vehículo. El cumplimiento se
                identifica con el código DOT grabado en el flanco (el Tire Identification Number),
                que además permite rastrear la planta y la fecha de fabricación de ese neumático
                puntual — un dato de trazabilidad que un neumático sin homologación simplemente no
                tiene.
              </p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-2">🇦🇷 Argentina</h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                La Ley Nacional de Tránsito (24.449) y su reglamentación exigen que los componentes
                de seguridad del vehículo, neumáticos incluidos, cumplan normas de seguridad
                reconocidas internacionalmente. En la práctica, lo que se verifica al importar y
                comercializar un neumático en el país es precisamente esa homologación de origen
                —ECE R30 o DOT/FMVSS— grabada en el flanco: no hay una norma paralela e
                independiente para el mercado argentino, se apoya en las mismas exigencias que ya
                cumplió el neumático para poder venderse en Europa o Estados Unidos. Por eso el
                dato más simple y verificable al comprar es mirar el flanco: si tiene la marca ECE
                o DOT, ya superó los ensayos serios; si no la tiene, es un neumático sin
                trazabilidad real.
              </p>
            </div>
          </div>

          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
            <h3 className="text-zinc-900 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Toda la gama Grenlander que vendemos está homologada
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              La gama de Grenlander que comercializamos en Trivium cumple ECE R30, la homologación
              europea. Es uno de los filtros que usamos para elegir con qué fabricantes trabajar:
              no vendemos neumáticos sin homologación verificable, sin importar cuánto más barato
              salga el precio de lista.
            </p>
          </div>

          {/* Veredicto */}
          <div className="p-6 bg-zinc-950 rounded-2xl text-white">
            <h3 className="font-bold text-lg mb-2">Veredicto Trivium</h3>
            <p className="text-zinc-300 leading-relaxed">
              El precio de etiqueta es el dato menos importante de la ecuación. Lo que hace que un
              neumático sea una buena compra es su costo por kilómetro real, respaldado por
              estándares de fabricación serios y una homologación verificable en el flanco.
              Medido así, <strong className="text-white">Grenlander</strong> queda arriba de la
              franja económica por lejos, y compite de cerca con marcas premium que cuestan varias
              veces más — esa es la razón concreta, no de marketing, por la que la recomendamos
              primero para uso cotidiano en Argentina.
            </p>
          </div>

        </div>
      </div>

            <div className="max-w-3xl mx-auto px-4 pb-10">
        <ClusterLinks current="precio-calidad-neumaticos-costo-por-km" />
      </div>

      <BlogSearchStrip slug="precio-calidad-neumaticos-costo-por-km" />

      {/* CTA */}
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
