import Link from "next/link";
import type { Metadata } from "next";
import { ClusterLinks } from "@/components/blog/ClusterLinks";
import { BlogCoverStrip, BlogSearchStrip } from "@/components/blog/BlogShop";
import { blogShare } from "@/lib/blog-meta";

export const metadata: Metadata = {
  ...blogShare("marcas-chinas-neumaticos-comparativa"),
  title: "Marcas chinas de neumáticos: ¿cuál es la mejor? — Trivium",
  description:
    "Comparamos las distintas franjas de calidad de los neumáticos chinos —de entrada, intermedios y de calidad real— y por qué Grenlander (Zodo Tyre) lidera el ranking.",
};

export default function MarcasChinasComparativaPage() {
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
              <time className="text-zinc-400 text-sm">11 de julio de 2026</time>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Marcas chinas de neumáticos: ¿cuál es la mejor?
            </h1>
            <p className="text-zinc-300 text-lg leading-relaxed">
              &ldquo;Neumático chino&rdquo; no es una sola categoría. Hay una franja de
              entrada sin trazabilidad, una intermedia correcta, y una de
              fabricantes con décadas de experiencia y homologación europea.
              Te ayudamos a distinguirlas.
            </p>
          </div>
        </div>
      </div>

      <BlogCoverStrip slug="marcas-chinas-neumaticos-comparativa" />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="space-y-10 text-zinc-600 leading-relaxed text-base md:text-lg">

          {/* Intro */}
          <p>
            China es, por lejos, el mayor productor de neumáticos del mundo.
            Esa escala trae una consecuencia lógica: conviven en el mismo país
            fábricas de última generación que exportan a Europa y Estados
            Unidos, junto con talleres pequeños que arman cubiertas sin
            ningún control de calidad serio. Meter a todas bajo la misma
            etiqueta de &ldquo;neumático chino&rdquo; es el error más común —y el que más
            dinero le cuesta a quien compra mal.
          </p>
          <p>
            En Trivium elegimos con qué fabricantes trabajar, así que vale la
            pena explicar cómo distinguimos las franjas de calidad y por qué,
            dentro de las opciones chinas, <strong className="text-zinc-900">Grenlander</strong>{" "}
            —fabricada por <strong className="text-zinc-900">Zodo Tyre</strong>—
            es la que recomendamos primero.
          </p>

          {/* Section 1: Las tres franjas */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Tres franjas, no una sola categoría
          </h2>
          <p>
            Cuando alguien pregunta &ldquo;¿son buenos los neumáticos chinos?&rdquo;, la
            respuesta honesta es: depende de cuál. El mercado se ordena, en la
            práctica, en tres niveles claramente distintos.
          </p>

          <div className="space-y-4">
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
              <h3 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                <span className="text-rose-600">●</span> Franja de entrada
              </h3>
              <p className="text-sm text-rose-800 leading-relaxed">
                Fábricas chicas, sin certificación internacional verificable
                o con homologaciones dudosas, sin control constante de
                composición del caucho y sin respaldo de posventa real. Es la
                franja donde aparecen los problemas típicos que dañan la
                reputación de &ldquo;lo chino en general&rdquo;: desgaste irregular,
                deformaciones y falta de garantía efectiva. No trabajamos con
                proveedores de este nivel.
              </p>
            </div>
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                <span className="text-amber-600">●</span> Franja intermedia
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                Fabricantes con cierta escala y controles de calidad básicos,
                que cumplen homologaciones (ECE o DOT) y ofrecen un producto
                correcto para uso cotidiano. Marcas como Doubleking o Firemax
                entran acá: cumplen, rinden razonablemente y tienen buena relación
                precio-kilometraje, pero no invierten al nivel de un
                fabricante de primera línea en compuestos ni en desarrollo de
                banda de rodamiento.
              </p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <span className="text-emerald-600">●</span> Franja de calidad real
              </h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Grupos con décadas de trayectoria fabricando neumáticos,
                plantas propias auditadas bajo normas internacionales,
                homologación europea plena y respaldo de garantía real. Acá es
                donde ubicamos a <strong>Grenlander</strong> (Zodo Tyre) y a
                otros nombres serios de la industria como Linglong o Triangle.
                Es la franja que compite de igual a igual con marcas
                asiáticas y europeas de gama media.
              </p>
            </div>
          </div>

          {/* Section 2: Grenlander */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Por qué Grenlander encabeza el ranking
          </h2>
          <p>
            Grenlander es la marca de neumáticos de{" "}
            <strong className="text-zinc-900">Zodo Tyre</strong>, un grupo con
            largas décadas de trayectoria fabricando cubiertas, no un
            ensamblador nuevo que apareció con la ola exportadora de los
            últimos años. Esa experiencia se nota en cuatro puntos concretos
            que la diferencian del resto de las opciones chinas:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-600">
            <li>
              <strong className="text-zinc-900">Tecnología de fabricación madura:</strong>{" "}
              construcción radial de acero en toda la gama, con desarrollo
              propio de banda de rodamiento y canales de evacuación de agua,
              en plantas propias que no dependen de terceros.
            </li>
            <li>
              <strong className="text-zinc-900">Composición del caucho:</strong>{" "}
              compuestos con carga de sílice en los modelos de mayor
              segmento, que bajan la resistencia a la rodadura y mejoran el
              agarre en mojado sin sacrificar durabilidad —el mismo enfoque
              que usan fabricantes de gama media-alta, aplicado a un precio
              mucho más accesible.
            </li>
            <li>
              <strong className="text-zinc-900">Homologación europea:</strong>{" "}
              toda la gama comercializada en Argentina cumple la norma{" "}
              <strong className="text-zinc-900">ECE R30</strong>, el mismo
              estándar de certificación que exige la Unión Europea a
              cualquier neumático que se venda en su mercado. No es una
              certificación de mínima: implica pruebas estandarizadas de
              resistencia estructural, velocidad máxima y frenado.
            </li>
            <li>
              <strong className="text-zinc-900">Garantía real de 1 año:</strong>{" "}
              Grenlander respalda sus neumáticos con un año de garantía de
              fábrica contra defectos, algo que la franja de entrada
              directamente no ofrece o no puede sostener en la práctica.
            </li>
          </ul>

          {/* Info box */}
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
            <h3 className="text-zinc-900 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              La homologación es el filtro más simple
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Si querés distinguir rápido en qué franja está un neumático
              chino sin conocer la marca, el dato más objetivo es la
              homologación grabada en el flanco. La norma{" "}
              <strong>ECE R30</strong> (Europa) exige pasar los mismos tests
              de resistencia y frenado que cualquier neumático europeo. Un
              neumático sin esa marca, o con certificaciones que no se pueden
              verificar, corresponde casi siempre a la franja de entrada.
            </p>
          </div>

          {/* Section 3: Tabla comparativa */}
          <h2 className="text-2xl font-black text-zinc-900 pt-4 flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full flex-shrink-0" />
            Ranking comparativo
          </h2>
          <p>
            Así se ordenan, en nuestra experiencia de posventa, las marcas
            chinas más habituales en el mercado argentino:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-950 text-white">
                  <th className="text-left px-4 py-3 font-bold">#</th>
                  <th className="text-left px-4 py-3 font-bold">Marca</th>
                  <th className="text-center px-4 py-3 font-bold">Fabricante</th>
                  <th className="text-center px-4 py-3 font-bold">Homologación</th>
                  <th className="text-center px-4 py-3 font-bold">Garantía</th>
                  <th className="text-center px-4 py-3 font-bold">Franja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="bg-red-50">
                  <td className="px-4 py-3 font-black text-red-600">1</td>
                  <td className="px-4 py-3 font-bold text-zinc-900">Grenlander</td>
                  <td className="px-4 py-3 text-center text-zinc-600">Zodo Tyre</td>
                  <td className="px-4 py-3 text-center">ECE R30</td>
                  <td className="px-4 py-3 text-center">1 año</td>
                  <td className="px-4 py-3 text-zinc-600">Calidad real</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-black text-zinc-400">2</td>
                  <td className="px-4 py-3 font-bold text-zinc-900">Linglong</td>
                  <td className="px-4 py-3 text-center text-zinc-600">Linglong Tire</td>
                  <td className="px-4 py-3 text-center">ECE R30</td>
                  <td className="px-4 py-3 text-center">Variable</td>
                  <td className="px-4 py-3 text-zinc-600">Calidad real</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="px-4 py-3 font-black text-zinc-400">3</td>
                  <td className="px-4 py-3 font-bold text-zinc-900">Doubleking</td>
                  <td className="px-4 py-3 text-center text-zinc-600">—</td>
                  <td className="px-4 py-3 text-center">ECE / DOT</td>
                  <td className="px-4 py-3 text-center">Variable</td>
                  <td className="px-4 py-3 text-zinc-600">Intermedia</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-black text-zinc-400">4</td>
                  <td className="px-4 py-3 font-bold text-zinc-900">Firemax</td>
                  <td className="px-4 py-3 text-center text-zinc-600">—</td>
                  <td className="px-4 py-3 text-center">ECE / DOT</td>
                  <td className="px-4 py-3 text-center">Variable</td>
                  <td className="px-4 py-3 text-zinc-600">Intermedia</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="px-4 py-3 font-black text-zinc-400">5</td>
                  <td className="px-4 py-3 font-bold text-zinc-900">Marcas sin trazabilidad</td>
                  <td className="px-4 py-3 text-center text-zinc-600">Desconocido</td>
                  <td className="px-4 py-3 text-center">No verificable</td>
                  <td className="px-4 py-3 text-center">Nula</td>
                  <td className="px-4 py-3 text-zinc-600">Entrada</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            El patrón es consistente: a medida que baja la trayectoria del
            fabricante, baja también la trazabilidad de la homologación y la
            garantía real detrás del producto. Grenlander es la única marca
            de esta lista que combina fabricante de larga trayectoria,
            homologación europea verificable y un año de garantía formal.
          </p>

          {/* Verdict */}
          <div className="p-6 bg-zinc-950 rounded-2xl text-white">
            <h3 className="font-bold text-lg mb-2">Veredicto Trivium</h3>
            <p className="text-zinc-300 leading-relaxed">
              No existe &ldquo;el neumático chino&rdquo; como categoría única: existe una
              franja de entrada que conviene evitar, una intermedia
              aceptable, y una de fabricantes serios que hoy compiten de
              igual a igual con marcas asiáticas y europeas de gama media.{" "}
              <strong className="text-white">Grenlander, fabricada por Zodo Tyre</strong>,
              está en esa franja superior: tecnología de construcción madura,
              compuestos de caucho con sílice, homologación ECE R30 y un año
              de garantía real. Es la marca china que recomendamos primero.
            </p>
          </div>

        </div>
      </div>

            <div className="max-w-3xl mx-auto px-4 pb-10">
        <ClusterLinks current="marcas-chinas-neumaticos-comparativa" />
      </div>

      <BlogSearchStrip slug="marcas-chinas-neumaticos-comparativa" />

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
