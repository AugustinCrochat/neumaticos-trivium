import Link from "next/link";
import type { TireProduct } from "@/lib/types";
import { BRANCHES } from "@/lib/config";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { bestPriceByGroup, peersByGroup } from "@/lib/best-price";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import type { Faq } from "@/lib/seo";
import {
  MEDIDAS_PRIORITARIAS,
  formatSize,
  rimSlug,
  sizeSlug,
  sizesFromCatalog,
} from "@/lib/tire-sizes";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

function buildFaqs(rim: number, desde: number | null): Faq[] {
  return [
    {
      question: `¿Qué quiere decir "rodado ${rim}"?`,
      answer:
        `El rodado es el diámetro de la llanta sobre la que se monta el neumático, medido en pulgadas. Un rodado ${rim} ` +
        `necesita sí o sí un neumático R${rim}: no es intercambiable con otro rodado. Lo que sí podés cambiar, dentro de ` +
        `ciertos límites, es el ancho y el perfil, siempre que el diámetro externo final quede parecido al original.`,
    },
    {
      question: `¿Cuánto sale un neumático rodado ${rim}?`,
      answer: desde
        ? `En Trivium los rodado ${rim} arrancan en ${formatPrice(desde)} por unidad con IVA incluido. Dentro del mismo ` +
          `rodado, el precio sube con el ancho: un 225 cuesta más que un 195 aunque compartan el R${rim}, porque lleva más material.`
        : `El precio depende del ancho, el perfil y la marca. Consultanos por WhatsApp y te pasamos las opciones que ` +
          `tengamos en rodado ${rim} en el momento.`,
    },
    {
      question: `¿Puedo poner un rodado ${rim} si mi auto trae rodado ${rim - 1}?`,
      answer:
        `Se puede, y se le dice "plus size", pero hay que compensar bajando el perfil para que el diámetro externo total no ` +
        `cambie más de un 3%. También necesitás llantas de rodado ${rim}: el neumático solo no alcanza. Tené en cuenta que ` +
        `subir de rodado endurece el andar y encarece los repuestos futuros. Si querés hacerlo, pasá por el local y ` +
        `calculamos juntos la combinación correcta.`,
    },
  ];
}

export function RimLanding({ rim, productos }: { rim: number; productos: TireProduct[] }) {
  const delRodado = productos.filter((p) => p.size.rim === rim);
  const mejores = bestPriceByGroup(delRodado);
  const peers = peersByGroup(delRodado);
  const enStock = delRodado.filter((p) => p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  const branch = BRANCHES[0];

  // Medidas de este rodado: las que hay en catálogo primero, después las
  // prioritarias que todavía no tienen stock pero sí página propia.
  const enCatalogo = sizesFromCatalog(delRodado);
  const medidasConStock = new Set(
    delRodado.filter((p) => p.enStock).map((p) => sizeSlug(p.size))
  ).size;
  const slugsEnCatalogo = new Set(enCatalogo.map((s) => sizeSlug(s.size)));
  const soloPrioritarias = MEDIDAS_PRIORITARIAS.filter(
    (s) => s.rim === rim && !slugsEnCatalogo.has(sizeSlug(s))
  );

  const ordenados = [...delRodado].sort(
    (a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price
  );

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: `Rodado ${rim}`, path: `/neumaticos/${rimSlug(rim)}` },
        ]}
      />

      <section className="mb-14">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black text-navy-900">Cubiertas R{rim}</h1>
          {medidasConStock > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {medidasConStock} {medidasConStock === 1 ? "medida" : "medidas"} con stock hoy
            </span>
          )}
        </div>
        {ordenados.length > 0 ? (
          <SortedProductGrid
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
            items={ordenados.map((product) => ({ product, isCheapest: mejores.has(product.id), cheapestLabel: mejores.get(product.id), peers: peers.get(product.id) }))}
          />
        ) : (
          <p className="max-w-2xl leading-relaxed text-slate-600">
            Ahora mismo no tenemos stock en rodado {rim}, pero recibimos mercadería todas las
            semanas: consultanos por WhatsApp y te avisamos apenas ingrese.
          </p>
        )}
      </section>

      {(enCatalogo.length > 0 || soloPrioritarias.length > 0) && (
        <section className="mb-14">
          <h2 className="mb-5 text-3xl font-black leading-tight text-navy-900 md:text-5xl">
            Neumáticos rodado {rim}
          </h2>
          <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
            {desde && (
              <>
                Arrancan en <strong className="text-navy-900">{formatPrice(desde)}</strong> por unidad.{" "}
              </>
            )}
            Si no sabés cuál es tu medida exacta, mirala en el flanco del neumático que tenés puesto:
            el número después de la R es el rodado, y tiene que coincidir con el de tu llanta.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {enCatalogo.map(({ size, count }) => (
              <Link
                key={sizeSlug(size)}
                href={`/neumaticos/${sizeSlug(size)}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-orange-400"
              >
                <span className="block font-black text-navy-900">{formatSize(size)}</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">
                  {count} {count === 1 ? "modelo" : "modelos"}
                </span>
              </Link>
            ))}
            {soloPrioritarias.map((size) => (
              <Link
                key={sizeSlug(size)}
                href={`/neumaticos/${sizeSlug(size)}`}
                className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center transition-colors hover:border-navy-300"
              >
                <span className="block font-black text-navy-700">{formatSize(size)}</span>
                <span className="mt-1 block text-xs font-bold text-slate-400">a pedido</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FaqSection faqs={buildFaqs(rim, desde)} title={`Preguntas sobre el rodado ${rim}`} />

      <section className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-black text-navy-900">¿No encontrás tu medida?</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
          Escribinos con la medida que buscás y te decimos si la tenemos, cuándo ingresa o qué
          equivalencia te sirve. Atendemos de {branch.hours.toLowerCase()} en {branch.address},{" "}
          {branch.city}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/neumaticos"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            Ver todas las medidas
          </Link>
          <Link
            href="/calculadora-equivalencia-neumaticos"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-black text-navy-900 transition-colors hover:border-navy-400"
          >
            Calculadora de equivalencias
          </Link>
        </div>
      </section>
    </div>
  );
}
