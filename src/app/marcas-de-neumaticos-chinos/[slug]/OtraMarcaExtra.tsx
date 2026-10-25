import Link from "next/link";
import type { TireProduct } from "@/lib/types";
import { BRANDS } from "@/lib/data";
import { OTRAS_MARCAS, type OtraMarca } from "@/lib/marcas-chinas";
import { getTireLabel } from "@/lib/tire-labels";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

const link = "font-bold text-[#cc1800] underline underline-offset-4";
const h2 = "font-display mb-3 text-3xl font-bold uppercase tracking-wide text-slate-900";

/** Misma pareja que verificamos en EPREL: el FM601 175/70 R14 84H de Kpatos y de Firemax. */
const FM601_SLUG = "firemax-fm601-175-70-r14-84h";

export function OtraMarcaExtra({ marca, productos }: { marca: OtraMarca; productos: TireProduct[] }) {
  const nuestras = BRANDS.filter((b) => b.origin === "China" && productos.some((p) => p.brandId === b.id));
  const fm601 = productos.find((p) => p.slug === FM601_SLUG);
  const fm601Label = getTireLabel(FM601_SLUG);
  const hermanas = OTRAS_MARCAS.filter((m) => m.slug !== marca.slug);

  return (
    <>
      {marca.mismoFabricante === "firemax" && (
        <section className="mb-14 rounded-3xl border border-[#ff1e00]/30 bg-red-50/40 p-6 md:p-8">
          <h2 className={h2}>{marca.name} y Firemax: el mismo fabricante</h2>
          <div className="max-w-3xl space-y-3 leading-relaxed text-slate-700">
            <p>
              Según los datos públicos del fabricante, {marca.name} pertenece a {marca.empresa}, la misma empresa
              dueña de Firemax. Firemax sí está en nuestro catálogo, así que si buscabas {marca.name} podés ver sus
              neumáticos en esta misma página.
            </p>
            {fm601 && fm601Label && (
              <p>
                Un ejemplo concreto: en el registro europeo EPREL, el {marca.name} FM601 175/70 R14 84H y el Firemax
                FM601 de la misma medida figuran con los mismos datos de etiqueta (combustible {fm601Label.energyClass},
                frenado en mojado {fm601Label.wetGripClass} y {fm601Label.noiseDb} dB) y el mismo proveedor. Todo indica
                que es el mismo neumático vendido con otro nombre; igual conviene confirmarlo en el flanco, mirando la
                medida, los índices y el código DOT.
              </p>
            )}
            {fm601 && (
              <p>
                <Link href={`/productos/${fm601.slug}`} className={link}>
                  Ver el Firemax FM601 175/70 R14 84H
                </Link>
                {fm601.enStock ? ` — ${formatPrice(fm601.price)} por unidad, con stock.` : "."}
              </p>
            )}
          </div>
        </section>
      )}

      {marca.produccion && (
        <section className="mb-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className={h2}>Fábricas distintas, resultados distintos</h2>
          <div className="max-w-3xl space-y-3 leading-relaxed text-slate-700">
            <p>{marca.produccion}</p>
            <p>
              Es lo contrario de un fabricante integrado. Grenlander y Zmax son del grupo Zodo, que figura como
              fabricante en la homologación europea de ambas marcas y produce en sus propias plantas. Eso se nota en la
              consistencia: el mismo modelo sale siempre de la misma línea y con el mismo control de calidad.
            </p>
            <p>
              <Link href="/marcas/grenlander" className={link}>
                Ver los neumáticos Grenlander
              </Link>
              .
            </p>
          </div>
        </section>
      )}

      <section className="mb-14 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className={h2}>Qué se sabe de {marca.name}</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Origen:</strong> China.
          </li>
          <li>
            <strong>Empresa:</strong> {marca.empresa}
            {marca.sede ? `, con sede en ${marca.sede}` : ""}.
          </li>
          {marca.hermanas && (
            <li>
              <strong>Marcas del mismo grupo:</strong> {marca.hermanas.join(", ")}.
            </li>
          )}
          {marca.dato && <li>{marca.dato}</li>}
          {marca.nota && (
            <li>
              Más detalle en la nota{" "}
              <Link href={`/blog/${marca.nota}`} className={link}>
                Neumáticos {marca.name}: quién los fabrica, opiniones y alternativas
              </Link>
              .
            </li>
          )}
          <li>Se comercializa en Argentina a través de importadores y de publicaciones online.</li>
        </ul>
        <p>
          <strong>No vendemos {marca.name}</strong> y no la probamos, así que no podemos opinar sobre su desempeño.
          Lo que sí podemos es mostrarte cómo comparar cualquier neumático, y ofrecerte marcas chinas que tenemos en
          stock, con garantía y colocación sin cargo.
        </p>
      </section>

      {nuestras.length > 0 && (
        <section className="mb-14">
          <h2 className={h2}>Las marcas chinas que sí tenemos</h2>
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {nuestras.map((b) => (
              <li key={b.id}>
                <Link href={`/marcas/${b.id}`} className="block h-full rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#ff1e00]">
                  <span className="block font-black text-slate-900">{b.name}</span>
                  <span className="mt-1 block text-sm text-slate-600">{b.description}</span>
                  <span className="mt-2 block text-xs font-bold text-slate-500">
                    {productos.filter((p) => p.brandId === b.id).length} modelos y medidas
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-14 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className={h2}>Cómo comparar un neumático chino con otro</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Etiqueta europea y registro EPREL.</strong> Muestra eficiencia, frenado en mojado y ruido de ese
            neumático exacto, y se puede verificar en una base pública:{" "}
            <Link href="/blog/etiqueta-europea-neumaticos" className={link}>
              cómo leerla
            </Link>
            .
          </li>
          <li>
            <strong>La medida y los índices.</strong> Comparar solo cuando coinciden la medida, el índice de carga y el
            de velocidad:{" "}
            <Link href="/blog/indice-de-carga-y-velocidad" className={link}>
              qué significan
            </Link>
            .
          </li>
          <li>
            <strong>La fecha de fabricación (DOT).</strong> Cuatro dígitos en el flanco que dicen semana y año:{" "}
            <Link href="/herramientas/codigo-dot" className={link}>
              calculá la edad
            </Link>
            .
          </li>
          <li>
            <strong>Garantía y quién responde.</strong> Preguntá si hay garantía por defecto de fabricación y quién la
            gestiona.
          </li>
        </ul>
        <p>
          Más en{" "}
          <Link href="/blog/como-elegir-neumatico-importado-seguro" className={link}>
            cómo elegir un neumático importado seguro
          </Link>
          ,{" "}
          <Link href="/blog/son-malos-los-neumaticos-chinos" className={link}>
            ¿son malos los neumáticos chinos?
          </Link>{" "}
          y{" "}
          <Link href="/blog/marcas-chinas-neumaticos-comparativa" className={link}>
            marcas chinas: ¿cuál es la mejor?
          </Link>
          .
        </p>
      </section>

      <section className="mb-14">
        <h2 className={h2}>Otras marcas chinas que se buscan</h2>
        <ul className="flex flex-wrap gap-2">
          {hermanas.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/marcas-de-neumaticos-chinos/${m.slug}`}
                className="inline-block rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#ff1e00]"
              >
                {m.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/marcas-de-neumaticos-chinos" className="inline-block rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
              Ver todas
            </Link>
          </li>
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          {marca.name} es una marca de su titular y no tenemos relación con la empresa. La información sale de datos
          públicos del fabricante y de registros oficiales.
        </p>
      </section>
    </>
  );
}
