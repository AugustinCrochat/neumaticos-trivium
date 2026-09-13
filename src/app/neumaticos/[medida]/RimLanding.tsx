import Link from "next/link";
import type { TireProduct } from "@/lib/types";
import { BRANCHES } from "@/lib/config";
import { ProductCard } from "@/components/ui/ProductCard";
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
  const enStock = delRodado.filter((p) => p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  const branch = BRANCHES[0];

  // Medidas de este rodado: las que hay en catálogo primero, después las
  // prioritarias que todavía no tienen stock pero sí página propia.
  const enCatalogo = sizesFromCatalog(delRodado);
  const slugsEnCatalogo = new Set(enCatalogo.map((s) => sizeSlug(s.size)));
  const soloPrioritarias = MEDIDAS_PRIORITARIAS.filter(
    (s) => s.rim === rim && !slugsEnCatalogo.has(sizeSlug(s))
  );

  const ordenados = [...delRodado].sort(
    (a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: `Rodado ${rim}`, path: `/neumaticos/${rimSlug(rim)}` },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">
          Neumáticos rodado {rim}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Todas las medidas R{rim} que manejamos, con stock y precio actualizados.
          {desde && (
            <>
              {" "}
              Arrancan en <strong className="text-navy-900">{formatPrice(desde)}</strong> por unidad.
            </>
          )}{" "}
          Si no sabés cuál es tu medida exacta, mirala en el flanco del neumático que tenés puesto:
          el número después de la R es el rodado, y tiene que coincidir con el de tu llanta.
        </p>
      </header>

      {(enCatalogo.length > 0 || soloPrioritarias.length > 0) && (
        <section className="mb-14">
          <h2 className="mb-5 text-2xl font-black text-navy-900">Medidas rodado {rim}</h2>
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

      {ordenados.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-5 text-2xl font-black text-navy-900">
            Cubiertas R{rim} disponibles
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {ordenados.map((product) => (
              <ProductCard key={product.id} product={product} />
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
