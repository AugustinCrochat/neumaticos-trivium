import Link from "next/link";
import { MARCAS_PREMIUM, type MarcaPremium } from "@/lib/marcas-premium";

const link = "font-bold text-[#cc1800] underline underline-offset-4";
const h2 = "font-display mb-3 text-3xl font-bold uppercase tracking-wide text-slate-900";

export function AlternativaExtra({ marca }: { marca: MarcaPremium }) {
  const otras = MARCAS_PREMIUM.filter((m) => m.slug !== marca.slug);

  return (
    <>
      <section className="mb-14 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className={h2}>Qué se sabe de {marca.name}</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Origen de la marca:</strong> {marca.origen}.
          </li>
          {marca.hermanas && (
            <li>
              <strong>Del mismo grupo:</strong> {marca.hermanas.join(", ")}.
            </li>
          )}
          {marca.datos?.map((d) => <li key={d}>{d}</li>)}
          <li>
            El país de la marca no siempre es el país donde se fabrica cada neumático: mirá el flanco y los
            primeros caracteres del código DOT, que identifican la planta.
          </li>
        </ul>
        <p>
          <strong>No vendemos {marca.name}</strong> y no la probamos, así que no opinamos sobre su desempeño. Lo que
          sí hacemos es mostrarte opciones nuevas, con precio publicado, un año de garantía y colocación sin cargo.
        </p>
      </section>

      {marca.slug === "fate" && (
        <section className="mb-14 max-w-3xl space-y-3 rounded-3xl border border-[#ff1e00]/30 bg-red-50/40 p-6 leading-relaxed text-slate-700 md:p-8">
          <h2 className={h2}>Tenés cubiertas Fate: qué comprar para reemplazarlas</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Leé la medida en el flanco.</strong> Tiene el formato 185/65 R15 (ancho, perfil y rodado). Es la
              que tenés que buscar, sin importar la marca.
            </li>
            <li>
              <strong>Anotá los índices de carga y velocidad</strong> (por ejemplo 88H): no pueden ser menores a los
              originales.{" "}
              <Link href="/blog/indice-de-carga-y-velocidad" className={link}>
                Cómo leerlos
              </Link>
              .
            </li>
            <li>
              <strong>Filtrá por tu medida</strong> en esta página, o mirá la{" "}
              <Link href="/calculadora-equivalencia-neumaticos" className={link}>
                calculadora de equivalencias
              </Link>{" "}
              si no está exacta.
            </li>
            <li>
              <strong>Cambiá el juego completo si podés</strong>, así se gastan parejo:{" "}
              <Link href="/blog/cuatro-economicos-o-dos-de-marca" className={link}>
                4 económicos o 2 de marca
              </Link>
              .
            </li>
          </ol>
          <p>
            Si no sabés la medida, buscá tu auto en{" "}
            <Link href="/vehiculos" className={link}>
              medida por vehículo
            </Link>
            .
          </p>
        </section>
      )}

      <section className="mb-14 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className={h2}>Cuándo conviene una premium y cuándo una alternativa</h2>
        <p>
          Una marca de primera línea tiene sentido cuando el uso es exigente: velocidad sostenida en ruta, mucho
          piso mojado, o cuando valorás una trayectoria y una red de respaldo por encima del precio. Una alternativa
          más económica tiene sentido para uso urbano o de ruta moderada, un segundo auto, o cuando hay que cambiar
          el juego completo con un presupuesto ajustado.
        </p>
        <p>
          La decisión se hace con la cuenta, no con el nombre: mirá{" "}
          <Link href="/blog/neumaticos-de-marca-vs-importados-cual-conviene" className={link}>
            marca o importado: cuál conviene
          </Link>
          ,{" "}
          <Link href="/blog/cuatro-economicos-o-dos-de-marca" className={link}>
            4 económicos o 2 de marca
          </Link>{" "}
          y la{" "}
          <Link href="/herramientas/costo-por-kilometro" className={link}>
            calculadora de costo por kilómetro
          </Link>
          . Si preferís una marca de primera línea, tenemos{" "}
          <Link href="/marcas/pirelli" className={link}>
            Pirelli
          </Link>
          .
        </p>
      </section>

      <section className="mb-14 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className={h2}>Cómo comparar con cualquier alternativa</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            La{" "}
            <Link href="/blog/etiqueta-europea-neumaticos" className={link}>
              etiqueta europea
            </Link>
            : eficiencia, frenado en mojado y ruido, verificable en EPREL.
          </li>
          <li>
            La medida y los{" "}
            <Link href="/blog/indice-de-carga-y-velocidad" className={link}>
              índices de carga y velocidad
            </Link>
            .
          </li>
          <li>
            La{" "}
            <Link href="/herramientas/codigo-dot" className={link}>
              fecha de fabricación (DOT)
            </Link>
            .
          </li>
          <li>La garantía y quién la gestiona.</li>
        </ul>
        <p>
          También podés ver todas las{" "}
          <Link href="/marcas-de-neumaticos-chinos" className={link}>
            marcas de neumáticos chinos que se venden en Argentina
          </Link>{" "}
          y la guía{" "}
          <Link href="/blog/neumaticos-japoneses-europeos-americanos-y-chinos-origen-de-las-marcas" className={link}>
            de dónde es cada marca
          </Link>
          .
        </p>
      </section>

      <section className="mb-14">
        <h2 className={h2}>Otras marcas que se buscan</h2>
        <ul className="flex flex-wrap gap-2">
          {otras.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/alternativas/${m.slug}`}
                className="inline-block rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#ff1e00]"
              >
                {m.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/alternativas" className="inline-block rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
              Ver todas
            </Link>
          </li>
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          {marca.name} es una marca de su titular y no tenemos relación con la empresa. La información sale de datos
          públicos y de notas periodísticas.
        </p>
      </section>
    </>
  );
}
