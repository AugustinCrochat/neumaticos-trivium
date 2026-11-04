import Link from "@/components/ui/Link";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";
import type { TireProduct, TireSize } from "@/lib/types";
import { BRANCHES } from "@/lib/config";
import { esRangoFlotation, formatFlotationEquivalent, metricToFlotation } from "@/lib/flotation";
import { SizeProductsGrid } from "@/components/ui/SizeProductsGrid";
import { bestPriceByGroup, peersByGroup } from "@/lib/best-price";
import { SizeHeader, SizeNota } from "./SizeHeader";
import { CierreMedida, ConsultaMedidaWa } from "./SizeSucursal";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { LocalProductCarousel } from "@/app/neumaticos-en/LocalProductCarousel";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { itemListJsonLd, type Faq } from "@/lib/seo";
import {
  diameterDiffPercent,
  equivalentSizes,
  formatSize,
  outerDiameterMm,
  rimSlug,
  widthSlug,
  profileSlug,
  sizeSlug,
  sizesEqual,
  vehiclesUsingSize,
} from "@/lib/tire-sizes";
import { filasTecnicas } from "@/lib/medida-tecnica";
import { cargaSlug, formatCargaSize } from "@/lib/carga";
import { sortVehiclesByPopularity, POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { vehiclePhoto } from "@/lib/vehicle-photos";

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
  const equivalentes = equivalentSizes(size).slice(0, 3).map((s) => formatSize(s));

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
      question: `¿Dónde puedo retirar los neumáticos ${label}?`,
      answer:
        `En el local de ${branch.address}, ${branch.city}. Podés ver el precio y el stock en la web, reservar por WhatsApp y ` +
        `retirarlo sin cargo; ahí mismo hacemos la colocación y el balanceo.`,
    },
    {
      question: `¿La colocación de los neumáticos ${label} tiene costo?`,
      answer:
        `No, si comprás el neumático en el local. El arme, el desarme y el cambio de válvulas van sin cargo. El balanceo y la ` +
        `alineación se cobran aparte porque son servicios de taller, y conviene hacerlos al cambiar las cubiertas para que el ` +
        `desgaste sea parejo y no aparezcan vibraciones en el volante.`,
    },
  ];

  const modelos = [...new Set(sortVehiclesByPopularity(vehiclesUsingSize(size)).map((v) => `${v.brand} ${v.model}`))].slice(0, 6);
  if (modelos.length > 0) {
    faqs.splice(1, 0, {
      question: `¿Qué autos llevan neumáticos ${label}?`,
      answer:
        `Entre los modelos que usan ${label} de fábrica están ${modelos.join(", ")}. La medida correcta de tu auto figura ` +
        `en la etiqueta del marco de la puerta del conductor o en el manual; si tenés dudas, buscá tu modelo en la sección ` +
        `de vehículos de esta web.`,
    });
  }

  if (desde) {
    faqs.splice(2, 0, {
      question: `¿Cuánto sale el juego de 4 neumáticos ${label}?`,
      answer:
        `Con el neumático más económico que tenemos hoy, el juego de cuatro sale desde ${formatPrice(desde * 4)} ` +
        `(${formatPrice(desde)} cada uno, IVA incluido), con colocación y válvulas sin cargo el mismo día.`,
    });
  }

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
  const mejores = bestPriceByGroup(productos);
  const peers = peersByGroup(productos);
  const ordenados = [...productos].sort(
    (a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price
  );
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  const vehiculos = sortVehiclesByPopularity(vehiclesUsingSize(size));
  // Una tarjeta por modelo (las versiones se juntan), con foto los que la tienen primero.
  const autos = vehiculos
    .reduce<{ slug: string; brand: string; model: string; versiones: string[] }[]>((acc, v) => {
      const slug = vehicleSlug(v.brand, v.model);
      const previo = acc.find((x) => x.slug === slug);
      if (!previo) acc.push({ slug, brand: v.brand, model: v.model, versiones: v.version ? [v.version] : [] });
      else if (v.version && !previo.versiones.includes(v.version)) previo.versiones.push(v.version);
      return acc;
    }, [])
    .sort((a, b) => Number(!!vehiclePhoto(b.slug)) - Number(!!vehiclePhoto(a.slug)));
  const items = productos.map((p) => ({ id: p.id, price: p.price, enStock: !!p.enStock }));

  // Una fila por marca: su neumático más barato (con stock si lo hay).
  const porMarca = [...new Set(productos.map((p) => p.brand))]
    .map((brand) => {
      const delaMarca = productos.filter((p) => p.brand === brand);
      const conStock = delaMarca.filter((p) => p.enStock);
      const mejor = [...(conStock.length ? conStock : delaMarca)].sort((a, b) => a.price - b.price)[0];
      return { brand, mejor, modelos: delaMarca.length, enStock: conStock.length > 0 };
    })
    .sort((a, b) => Number(b.enStock) - Number(a.enStock) || a.mejor.price - b.mejor.price);

  // Alternativas con stock para que nadie se quede sólo con "sin stock":
  // primero las del mismo rodado (sirven con las mismas llantas), con el
  // diámetro más cercano, después el resto, y a igual cercanía el más barato. Los de carga sólo si esta medida lo es.
  const esMedidaCarga = productos.some((x) => x.isCarga);
  const alternativas = todos
    .filter((p) => p.enStock && !sizesEqual(p.size, size) && !!p.isCarga === esMedidaCarga)
    .map((p) => ({ p, diff: Math.abs(diameterDiffPercent(p.size, size)) }))
    .sort(
      (a, b) =>
        Number(a.p.size.rim !== size.rim) - Number(b.p.size.rim !== size.rim) ||
        Number(a.diff > 3) - Number(b.diff > 3) ||
        Math.round(a.diff) - Math.round(b.diff) ||
        a.p.price - b.p.price
    )
    .slice(0, 24)
    .map(({ p }) => p);
  const mejoresAlternativas = [...bestPriceByGroup(alternativas)];

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
        items={items}
      />

      {ordenados.length > 0 ? (
        <section className="mb-14">
          <h2 className="mb-5 text-2xl font-black text-navy-900">
            Cubiertas {label} disponibles
          </h2>
          <SizeProductsGrid
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
            items={ordenados.map((product) => ({ product, isCheapest: mejores.has(product.id), cheapestLabel: mejores.get(product.id), peers: peers.get(product.id) }))}
          />
          <SizeNota items={items} label={label} />
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
          <ConsultaMedidaWa label={label} />
        </section>
      )}

      <LocalProductCarousel
        autoplay
        productos={alternativas}
        mejores={mejoresAlternativas}
        titulo={enStock.length > 0 ? "Otros neumáticos disponibles en el local" : `Sin ${label}: estos otros están disponibles en el local`}
      />

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

      {/* Datos técnicos: números derivados de la medida, útiles al comparar o convertir */}
      <section className="mb-14">
        <h2 className="mb-3 text-2xl font-black text-navy-900">Datos técnicos de la medida {label}</h2>
        <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
          Todo lo que se calcula a partir de {label}: es lo que cambia (o no) cuando pasás a otra medida y lo que
          usa el auto para calcular la velocidad y el recorrido.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-slate-100">
              {filasTecnicas(size).map((f) => (
                <tr key={f.dato}>
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-black text-navy-900">{f.dato}</th>
                  <td className="whitespace-nowrap px-4 py-3 font-black text-navy-900">{f.valor}</td>
                  <td className="px-4 py-3 text-slate-500">{f.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Precio por marca, con los datos del catálogo */}
      {porMarca.length > 1 && (
        <section className="mb-14">
          <h2 className="mb-3 text-2xl font-black text-navy-900">Precio de {label} por marca</h2>
          <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
            El neumático {label} más económico de cada marca que tenemos hoy, con IVA incluido y por unidad.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Marca</th>
                  <th className="px-4 py-3">Desde</th>
                  <th className="px-4 py-3">Modelos</th>
                  <th className="px-4 py-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {porMarca.map((m) => (
                  <tr key={m.brand}>
                    <td className="px-4 py-3 font-black text-navy-900">
                      <Link href={`/productos/${m.mejor.slug}`} className="hover:text-orange-600">{m.brand}</Link>
                    </td>
                    <td className="px-4 py-3 font-black text-navy-900">{formatPrice(m.mejor.price)}</td>
                    <td className="px-4 py-3 text-slate-600">{m.modelos}</td>
                    <td className="px-4 py-3 text-slate-600">{m.enStock ? "Disponible" : "Sin stock hoy"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

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
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {autos.map((a) => {
              const foto = vehiclePhoto(a.slug);
              const enFicha = POPULAR_VEHICLES.some((p) => p.brand === a.brand && p.model === a.model);
              const contenido = (
                <>
                  <div className="flex h-24 items-center justify-center bg-slate-50 px-3">
                    {foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={foto} alt={`${a.brand} ${a.model}`} loading="lazy" decoding="async" className="max-h-20 w-auto max-w-full object-contain" />
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{a.brand}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-black leading-tight text-navy-900 group-hover:text-orange-600">
                      {a.brand} {a.model}
                    </p>
                    {a.versiones.length > 0 && (
                      <p className="mt-1 text-xs leading-snug text-slate-500">{a.versiones.join(" · ")}</p>
                    )}
                  </div>
                </>
              );
              const clase = "group block h-full overflow-hidden rounded-xl border border-slate-200 bg-white";
              return (
                <li key={a.slug}>
                  {enFicha ? (
                    <Link href={`/vehiculos/${a.slug}`} className={`${clase} transition-colors hover:border-orange-300`}>
                      {contenido}
                    </Link>
                  ) : (
                    <div className={clase}>{contenido}</div>
                  )}
                </li>
              );
            })}
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

      <FotoNeumaticoBloque className="mt-12" />
      <FaqSection faqs={buildFaqs(size, enStock, desde)} title={`Preguntas frecuentes sobre ${label}`} />

      {/* Cierre: dónde comprar */}
      <CierreMedida
        label={label}
        enlaces={[
          { href: `/neumaticos/${rimSlug(size.rim)}`, texto: `Ver todas las medidas rodado ${size.rim}` },
          { href: `/neumaticos/${widthSlug(size.width)}`, texto: `Todo en ancho ${size.width}` },
          { href: `/neumaticos/${profileSlug(size.profile)}`, texto: `Todo en perfil ${size.profile}` },
        ]}
      />
    </div>
  );
}
