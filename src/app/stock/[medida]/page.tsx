import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRANCHES, DEFAULT_BRANCH_ID, type Branch } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { NOINDEX, SITE_NAME } from "@/lib/seo";
import { equivalentSizes, formatSize, parseSizeSlug, sizeSlug, sizesEqual } from "@/lib/tire-sizes";
import type { TireProduct, TireSize } from "@/lib/types";

/**
 * Disponibilidad en vivo de una medida en UNA sucursal.
 *
 * Existe porque el bot de WhatsApp lee el catálogo de Meta, que solo tiene
 * "hay" / "no hay": cuando el cliente quiere 4 y quedan 3, el bot no puede
 * contestarlo. El sync del POS ya escribe la cantidad en el título del ítem
 * (ver pos-neumaticos/src/lib/whatsapp-catalog-sync.ts), y esta página es la
 * otra mitad: el link que el bot manda para que el cliente vea la medida
 * completa con los números exactos.
 *
 * Es deliberadamente lo opuesto a /neumaticos/[medida]:
 *
 *  - la sucursal va en la URL y no en la cookie, porque el link nace en un
 *    chat de WhatsApp que ya sabe de qué sucursal habla, y depender de la
 *    cookie del visitante lo rompería en el primer click;
 *  - es dinámica y saltea el caché del POS (`fresh`), porque su único valor
 *    es que el número esté al día;
 *  - es noindex: /neumaticos/[medida] es la que compite en Google, y esta
 *    sería contenido casi duplicado además de una URL por sucursal.
 */
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ medida: string }>;
  searchParams: Promise<{ sucursal?: string }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Hora local de Córdoba: la página se sirve desde un Worker que puede estar
    en cualquier lado, así que sin la zona horaria explícita el "actualizado a
    las…" sale en UTC y parece equivocado. */
function horaCordoba() {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Cordoba",
  }).format(new Date());
}

async function resolver(medidaSlug: string, sucursalSlug: string | undefined) {
  const branch = BRANCHES.find((b) => b.id === (sucursalSlug ?? DEFAULT_BRANCH_ID));
  const size = parseSizeSlug(medidaSlug);
  if (!branch || !size) return null;
  const productos = await getProductosDesdePOS(branch.id, { fresh: true });
  return { branch, size, productos };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ medida }, { sucursal }] = await Promise.all([params, searchParams]);
  const branch = BRANCHES.find((b) => b.id === (sucursal ?? DEFAULT_BRANCH_ID));
  const size = parseSizeSlug(medida);
  if (!branch || !size) return NOINDEX;
  return { title: `Stock de ${formatSize(size)} en ${branch.shortName}`, ...NOINDEX };
}

function waHref(branch: Branch, texto: string) {
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/** `model` ya viene del POS como "205/55 R16 MARCA MODELO [De Carga] [A/T]"
    (ver `toTireProduct` en pos-api.ts), así que anteponerle `brand` repetía la
    marca y volvía a decir la medida que el h1 de esta página ya encabeza — en
    el WhatsApp prellenado salía dos veces. Le sacamos el prefijo de medida y
    dejamos el resto tal cual: los sufijos de carga y A/T ya están adentro. */
function nombreProducto(p: TireProduct) {
  return p.model.replace(/^\d+\/\d+\s*R\d+C?\s*/i, "").trim() || p.model;
}

function FilaProducto({
  p,
  branch,
  size,
}: {
  p: TireProduct;
  branch: Branch;
  size: TireSize;
}) {
  const stock = p.stock ?? 0;
  const label = formatSize(size);
  const texto =
    stock > 0
      ? `Hola! Vi en la web que tienen ${stock} ${nombreProducto(p)} ${label} en ${branch.shortName}. Quiero reservar.`
      : `Hola! Quiero consultar por ${nombreProducto(p)} en ${label}.`;

  return (
    <li className="flex flex-col gap-3 border-b border-slate-200 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <Link href={`/productos/${p.slug}`} className="font-black text-navy-900 hover:underline">
          {nombreProducto(p)}
        </Link>
        {(p.loadIndex || p.speedRating) && (
          <span className="ml-2 text-sm text-slate-500">
            {p.loadIndex}
            {p.speedRating}
          </span>
        )}
        <div className="mt-1 text-sm text-slate-600">
          {formatPrice(p.price)} c/u
          {stock >= 4 && (
            <span className="ml-2 text-slate-400">· {formatPrice(p.price * 4)} las 4</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`rounded-lg px-2.5 py-1 text-sm font-black ${
            stock === 0
              ? "bg-slate-100 text-slate-400"
              : stock >= 4
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
          }`}
        >
          {stock === 0 ? "sin stock" : stock === 1 ? "queda 1" : `quedan ${stock}`}
        </span>
        <a
          href={waHref(branch, texto)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-navy-900 px-3 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {stock > 0 ? "Reservar" : "Consultar"}
        </a>
      </div>
    </li>
  );
}

export default async function StockMedidaPage({ params, searchParams }: Props) {
  const [{ medida }, { sucursal }] = await Promise.all([params, searchParams]);
  const resuelto = await resolver(medida, sucursal);
  if (!resuelto) notFound();
  const { branch, size, productos } = resuelto;

  const label = formatSize(size);
  const deLaMedida = productos
    .filter((p) => sizesEqual(p.size, size))
    .sort((a, b) => a.price - b.price);

  const paraLasCuatro = deLaMedida.filter((p) => (p.stock ?? 0) >= 4);
  const pocas = deLaMedida.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 4);
  const agotados = deLaMedida.filter((p) => (p.stock ?? 0) === 0);
  const unidadesTotales = deLaMedida.reduce((acc, p) => acc + (p.stock ?? 0), 0);

  // Equivalentes con stock: el mismo criterio de ±3% de diámetro que usa la
  // landing de SEO. Acá importan porque si la medida pedida no llega a 4
  // unidades, la equivalente puede resolver la venta en el momento.
  const equivalentes = equivalentSizes(size)
    .map((eq) => ({
      size: eq,
      unidades: productos
        .filter((p) => sizesEqual(p.size, eq))
        .reduce((acc, p) => acc + (p.stock ?? 0), 0),
    }))
    .filter((eq) => eq.unidades > 0)
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 6);

  const sucursalQuery = `?sucursal=${branch.id}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-black uppercase tracking-widest text-navy-400">
        {SITE_NAME} · {branch.shortName}
      </p>
      <h1 className="mt-1 text-4xl font-black text-navy-900">{label}</h1>
      <p className="mt-2 text-slate-600">
        {unidadesTotales === 0
          ? `Ahora mismo no tenemos unidades de esta medida en ${branch.shortName}.`
          : `${unidadesTotales} ${unidadesTotales === 1 ? "unidad" : "unidades"} en ${branch.address}, ${branch.city}.`}{" "}
        <span className="text-slate-400">Actualizado a las {horaCordoba()}.</span>
      </p>

      {paraLasCuatro.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-1 text-sm font-black uppercase tracking-widest text-emerald-600">
            Alcanza para las 4 ruedas
          </h2>
          <ul>
            {paraLasCuatro.map((p) => (
              <FilaProducto key={p.id} p={p} branch={branch} size={size} />
            ))}
          </ul>
        </section>
      )}

      {pocas.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-1 text-sm font-black uppercase tracking-widest text-amber-600">
            Quedan pocas unidades
          </h2>
          <ul>
            {pocas.map((p) => (
              <FilaProducto key={p.id} p={p} branch={branch} size={size} />
            ))}
          </ul>
        </section>
      )}

      {equivalentes.length > 0 && (
        <section className="mt-10 rounded-2xl bg-slate-50 p-5">
          <h2 className="mb-1 text-sm font-black uppercase tracking-widest text-navy-900">
            Medidas equivalentes con stock
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Mantienen el rodado R{size.rim} y el diámetro externo dentro del ±3%, así que el
            velocímetro y el ABS siguen trabajando con la referencia correcta.
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {equivalentes.map((eq) => (
              <Link
                key={sizeSlug(eq.size)}
                href={`/stock/${sizeSlug(eq.size)}${sucursalQuery}`}
                className="rounded-xl border border-slate-200 bg-white p-3 text-center transition-colors hover:border-navy-400"
              >
                <span className="block font-black text-navy-900">{formatSize(eq.size)}</span>
                <span className="mt-0.5 block text-xs font-bold text-emerald-700">
                  {eq.unidades} {eq.unidades === 1 ? "unidad" : "unidades"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {agotados.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm font-black uppercase tracking-widest text-slate-400">
            Sin stock en {branch.shortName} ({agotados.length})
          </summary>
          <ul className="mt-2">
            {agotados.map((p) => (
              <FilaProducto key={p.id} p={p} branch={branch} size={size} />
            ))}
          </ul>
        </details>
      )}

      {deLaMedida.length === 0 && (
        <p className="mt-8 rounded-2xl bg-slate-50 p-5 text-slate-600">
          No tenemos cargada la medida {label} en el catálogo de {branch.shortName}. Escribinos y la
          conseguimos: recibimos mercadería todas las semanas.
        </p>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={waHref(branch, `Hola! Consulto por neumáticos ${label} en ${branch.shortName}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-orange-600 px-5 py-3 font-black text-white transition-opacity hover:opacity-90"
        >
          Escribinos por WhatsApp
        </a>
        <Link
          href={`/neumaticos/${sizeSlug(size)}`}
          className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-navy-900 transition-colors hover:border-navy-400"
        >
          Ver todo sobre la medida {label}
        </Link>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        El stock se descuenta al facturar en el local, así que puede cambiar entre que cargás la
        página y llegás. Si vas a buscar una medida puntual, avisanos y te la apartamos.
      </p>
    </div>
  );
}
