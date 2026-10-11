import Link from "next/link";
import type { TireProduct, TireSize } from "@/lib/types";
import { BRANCHES, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/config";
import { esRangoFlotation, formatFlotationEquivalent, metricToFlotation } from "@/lib/flotation";
import { ProductCard } from "@/components/ui/ProductCard";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { SizeHeader } from "./SizeHeader";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { itemListJsonLd, type Faq } from "@/lib/seo";
import {
  diameterDiffPercent,
  equivalentSizes,
  formatSize,
  outerDiameterMm,
  rimSlug,
  sizeSlug,
  sizesEqual,
  vehiclesUsingSize,
} from "@/lib/tire-sizes";
import { cargaSlug, formatCargaSize } from "@/lib/carga";
import { sortVehiclesByPopularity } from "@/lib/vehicles";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Alto del flanco en mm: el "55" de 205/55 es el porcentaje del ancho. Es la
    parte que más confunde al comprar, así que la mostramos resuelta. */
function sidewallMm(size: TireSize) {
  return Math.round(size.width * (size.profile / 100) * 10) / 10;
}

function buildFaqs(size: TireSize, productos: TireProduct[], desde: number | null): Faq[] {
  const label = formatSize(size);
  const branch = BRANCHES[0];
  const equivalentes = equivalentSizes(size).slice(0, 3).map(formatSize);

  const faqs: Faq[] = [
    {
      question: `¿Qué significa la medida ${label}?`,
      answer:
        `${size.width} es el ancho de la banda de rodamiento en milímetros. ${size.profile} es el perfil: ` +
        `la altura del flanco expresada como porcentaje del ancho, o sea ${sidewallMm(size)} mm en este caso. ` +
        `R${size.rim} indica construcción radial y un rodado de ${size.rim} pulgadas, que es el diámetro de la llanta. ` +
        `El diámetro externo total del neumático montado queda en ${Math.round(outerDiameterMm(size))} mm.`,
    },
    {
      question: `¿Cuánto cuesta un neumático ${label}?`,
      answer: desde
        ? `En Trivium arrancan en ${formatPrice(desde)} por unidad con IVA incluido. El precio varía según la marca y ` +
          `el índice de carga y velocidad. Al importar de forma directa, sin distribuidor intermedio, el mismo neumático ` +
          `suele quedar bastante por debajo del precio de lista de una cadena. Los precios publicados en la web son los ` +
          `que se cobran en el local.`
        : `El precio de un ${label} depende de la marca, el índice de carga y el de velocidad. Ahora mismo no tenemos ` +
          `esta medida en stock, pero recibimos mercadería todas las semanas: escribinos por WhatsApp y te pasamos el ` +
          `precio y la fecha estimada de ingreso.`,
    },
    {
      question: `¿Qué medidas son equivalentes a ${label}?`,
      answer: equivalentes.length
        ? `Manteniendo el mismo rodado R${size.rim}, las alternativas más cercanas en diámetro son ${equivalentes.join(", ")}. ` +
          `Todas quedan dentro del ±3% de diámetro respecto de ${label}, que es el margen que no altera de forma apreciable ` +
          `el velocímetro ni el funcionamiento del ABS. Antes de cambiar de medida conviene verificar que el neumático no ` +
          `roce el tren delantero ni los plásticos al girar a tope.`
        : `Para ${label} no encontramos alternativas comerciales dentro del ±3% de diámetro manteniendo el rodado R${size.rim}. ` +
          `Lo más seguro es respetar la medida original que indica el manual del vehículo.`,
    },
    {
      question: `¿Puedo comprar neumáticos ${label} online y recibirlos en casa?`,
      answer:
        `Sí. Podés comprar por la web y elegir envío a domicilio a cualquier punto del país: gratis desde ${formatPrice(FREE_SHIPPING_THRESHOLD)} ` +
        `de compra, o ${formatPrice(SHIPPING_FLAT_RATE)} fijos por debajo de eso, sin importar la provincia. La otra opción es retirar sin cargo en el local de ${branch.address}, ` +
        `${branch.city}, donde además hacemos la colocación y el balanceo.`,
    },
    {
      question: `¿La colocación de los neumáticos ${label} tiene costo?`,
      answer:
        `No, si comprás el neumático en el local. El arme, el desarme y el cambio de válvulas van sin cargo. El balanceo y la ` +
        `alineación se cobran aparte porque son servicios de taller, y conviene hacerlos al cambiar las cubiertas para que el ` +
        `desgaste sea parejo y no aparezcan vibraciones en el volante.`,
    },
  ];

  if (productos.length > 0) {
    const marcas = [...new Set(productos.map((p) => p.brand))];
    faqs.splice(2, 0, {
      question: `¿Qué marcas de ${label} tienen disponibles?`,
      answer:
        `Hoy tenemos ${marcas.join(", ")} en esta medida. Todas son de importación directa y vienen con un año de garantía. ` +
        `Si buscás una marca puntual que no figura, consultanos: trabajamos con más marcas de las que están publicadas en ` +
        `cada momento y recibimos mercadería semanalmente.`,
    });
  }

  return faqs;
}

export function SizeLanding({
  size,
  productos,
  todos,
}: {
  size: TireSize;
  /** Productos exactamente de esta medida. */
  productos: TireProduct[];
  /** Catálogo completo, para saber qué equivalencias tienen stock real. */
  todos: TireProduct[];
}) {
  const label = formatSize(size);
  const slug = sizeSlug(size);
  const enStock = productos.filter((p) => p.enStock);
  const ordenados = [...productos].sort(
    (a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price
  );
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  const vehiculos = sortVehiclesByPopularity(vehiclesUsingSize(size));
  const branch = BRANCHES[0];

  // Sólo se ofrecen como alternativa las equivalencias que además tienen stock:
  // mandar al visitante a otra página vacía es peor que no ofrecer nada.
  const equivalentes = equivalentSizes(size).map((eq) => ({
    size: eq,
    diff: diameterDiffPercent(eq, size),
    stock: todos.filter((p) => sizesEqual(p.size, eq) && p.enStock).length,
  }));
  const equivalentesConStock = equivalentes.filter((e) => e.stock > 0).slice(0, 6);
  const equivalentesRestantes = equivalentes.filter((e) => e.stock === 0).slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: `Rodado ${size.rim}`, path: `/neumaticos/${rimSlug(size.rim)}` },
          { name: label, path: `/neumaticos/${slug}` },
        ]}
      />

      {ordenados.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            ordenados.map((p) => ({
              name: `${p.brand} ${p.model}`,
              path: `/productos/${p.slug}`,
            }))
          )}
        />
      )}

      <SizeHeader
        size={size}
        label={label}
        enStockCount={enStock.length}
        desde={desde}
        branchCity={branch.city}
      />

      {ordenados.length > 0 ? (
        <section className="mb-14">
          <h2 className="mb-5 text-2xl font-black text-navy-900">
            Cubiertas {label} disponibles
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {ordenados.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-14 rounded-2xl border border-orange-200 bg-orange-50 p-6">
          <h2 className="text-xl font-black text-navy-900">
            Sin stock de {label} en este momento
          </h2>
          <p className="mt-2 max-w-2xl text-slate-700">
            Escribinos con tu medida y te avisamos apenas ingrese, o te proponemos una equivalencia
            segura si necesitás resolverlo ya.
          </p>
          <WhatsAppLink
            href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
              `Hola, busco neumáticos en medida ${label}. ¿Tienen stock o fecha de ingreso?`
            )}`}
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25d366] px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            Consultar {label} por WhatsApp
          </WhatsAppLink>
        </section>
      )}

      {productos.some((p) => p.isCarga) && (
        <p className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Esta medida también existe en versión de carga (C) para furgones y utilitarios:{" "}
          <Link href={`/neumaticos/carga/${cargaSlug(size)}`} className="font-bold text-[#ff1e00] underline">
            ver neumáticos {formatCargaSize(size)}
          </Link>
          .
        </p>
      )}

      {/* Desglose de la medida */}
      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-black text-navy-900">
          Qué significa la medida {label}
        </h2>
        <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
          Los números del flanco no son un código arbitrario: describen la geometría exacta del
          neumático. Entenderlos es lo que te permite saber si una medida alternativa te sirve o no.
        </p>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: `${size.width}`,
              title: "Ancho de sección",
              value: `${size.width} mm`,
              desc: "El ancho de la banda de rodamiento, de flanco a flanco, medido en milímetros.",
            },
            {
              label: `${size.profile}`,
              title: "Perfil",
              value: `${sidewallMm(size)} mm de flanco`,
              desc: `El alto del flanco es el ${size.profile}% del ancho. Cuanto más bajo el número, más chico el flanco y más duro el andar.`,
            },
            {
              label: `R${size.rim}`,
              title: "Rodado",
              value: `${size.rim} pulgadas`,
              desc: "Diámetro de la llanta sobre la que se monta. La R indica construcción radial.",
            },
            {
              label: "Ø",
              title: "Diámetro total",
              value: `${Math.round(outerDiameterMm(size))} mm`,
              desc: "Diámetro externo con el neumático montado. Es el número que hay que respetar al buscar equivalencias.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-2 inline-flex rounded-lg bg-black px-2.5 py-1 font-mono text-sm font-black text-white">
                {item.label}
              </div>
              <dt className="text-xs font-black uppercase tracking-widest text-slate-400">
                {item.title}
              </dt>
              <dd className="mt-1 text-lg font-black text-navy-900">{item.value}</dd>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </dl>
        {esRangoFlotation(size.width) && (
          <p className="mt-5 max-w-3xl leading-relaxed text-slate-600">
            En camionetas y 4x4, esta medida también se puede encontrar marcada en el sistema{" "}
            <Link href="/blog/medidas-flotation-camionetas" className="font-bold text-navy-900 underline underline-offset-2">
              flotation
            </Link>
            , en pulgadas, como <strong className="text-navy-900">{formatFlotationEquivalent(metricToFlotation(size))}</strong>.
            Es el mismo neumático — la diferencia está solo en cómo se escribe la medida en el flanco.
          </p>
        )}
      </section>

      {/* Autos que usan la medida */}
      {vehiculos.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-3 text-2xl font-black text-navy-900">
            Qué autos usan neumáticos {label}
          </h2>
          <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
            Estos son modelos que traen {label} de fábrica en alguna de sus versiones. Si tu auto
            está en la lista, esta es tu medida — igual conviene confirmarla contra el flanco del
            neumático que tenés puesto o la calcomanía del parante de la puerta del conductor, porque
            una misma versión puede haber salido con más de una medida.
          </p>
          <ul className="flex flex-wrap gap-2">
            {vehiculos.map((v) => (
              <li
                key={`${v.brand}-${v.model}-${v.version ?? ""}`}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
              >
                <span className="font-bold text-navy-900">
                  {v.brand} {v.model}
                </span>
                {v.version && <span className="ml-1.5 text-slate-500">{v.version}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Equivalencias */}
      <section className="mb-14">
        <h2 className="mb-3 text-2xl font-black text-navy-900">Medidas equivalentes a {label}</h2>
        <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
          Una medida equivalente mantiene el rodado R{size.rim} y un diámetro externo dentro del ±3%
          respecto del original. Dentro de ese margen el velocímetro sigue marcando bien y el ABS y
          el control de estabilidad trabajan con la referencia correcta. Fuera de ese margen, no.
        </p>

        {equivalentesConStock.length > 0 && (
          <>
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-emerald-600">
              Equivalencias con stock disponible
            </h3>
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {equivalentesConStock.map((eq) => (
                <Link
                  key={sizeSlug(eq.size)}
                  href={`/neumaticos/${sizeSlug(eq.size)}`}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center transition-colors hover:border-emerald-400"
                >
                  <span className="block font-black text-navy-900">{formatSize(eq.size)}</span>
                  <span className="mt-0.5 block text-xs font-bold text-emerald-700">
                    {eq.stock} en stock
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {eq.diff > 0 ? "+" : ""}
                    {eq.diff.toFixed(1)}% Ø
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

        {equivalentesRestantes.length > 0 && (
          <>
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-400">
              Otras equivalencias técnicas
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
              {equivalentesRestantes.map((eq) => (
                <Link
                  key={sizeSlug(eq.size)}
                  href={`/neumaticos/${sizeSlug(eq.size)}`}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center transition-colors hover:border-navy-300"
                >
                  <span className="block text-sm font-black text-navy-900">
                    {formatSize(eq.size)}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {eq.diff > 0 ? "+" : ""}
                    {eq.diff.toFixed(1)}% Ø
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
          <strong>Antes de cambiar de medida:</strong> verificá que el neumático no roce el tren
          delantero, los pasarruedas ni los plásticos al girar el volante a tope y con el auto
          cargado. Si tenés dudas, pasá por el local y lo chequeamos con la rueda montada.{" "}
          <Link
            href={`/calculadora-equivalencia-neumaticos?original=${size.width}-${size.profile}-${size.rim}`}
            className="font-bold underline underline-offset-2"
          >
            Probá la calculadora de equivalencias
          </Link>
          .
        </p>
      </section>

      <FaqSection faqs={buildFaqs(size, enStock, desde)} title={`Preguntas frecuentes sobre ${label}`} />

      {/* Cierre: dónde comprar */}
      <section className="mt-14 overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-black p-8 text-white">
        <h2 className="text-2xl font-black">Dónde comprar neumáticos {label}</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
          Podés comprar online y recibirlo en tu casa en cualquier punto del país: gratis desde{" "}
          {formatPrice(FREE_SHIPPING_THRESHOLD)} de compra, o {formatPrice(SHIPPING_FLAT_RATE)} fijos
          por debajo de eso. También podés retirarlo sin cargo en {branch.address},{" "}
          {branch.city}. Si retirás, la colocación y el cambio de válvulas van sin cargo, y tenés
          alineación y balanceo en el mismo local para dejar el auto listo en una sola visita.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/sucursales/${branch.id}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
          >
            Ver la sucursal {branch.shortName}
          </Link>
          <Link
            href={`/neumaticos/${rimSlug(size.rim)}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-black text-white transition-colors hover:bg-white/10"
          >
            Ver todas las medidas rodado {size.rim}
          </Link>
        </div>
      </section>
    </div>
  );
}
