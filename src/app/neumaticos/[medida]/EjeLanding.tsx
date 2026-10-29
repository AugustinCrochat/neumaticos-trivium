import Link from "@/components/ui/Link";
import type { TireProduct } from "@/lib/types";
import { BRANCHES } from "@/lib/config";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { bestPriceByGroup, peersByGroup } from "@/lib/best-price";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { itemListJsonLd, type Faq } from "@/lib/seo";
import {
  MEDIDAS_PRIORITARIAS,
  anchosYPerfiles,
  formatSize,
  profileSlug,
  sizeSlug,
  sizesFromCatalog,
  vehiclesUsingSize,
  widthSlug,
} from "@/lib/tire-sizes";
import { sortVehiclesByPopularity } from "@/lib/vehicles";

export type Eje = "ancho" | "perfil";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Frase propia de cada valor, para que las páginas del mismo eje no sean la
    misma con otro número. Los umbrales siguen el parque automotor argentino. */
function caracterAncho(ancho: number): string {
  if (ancho <= 175) return "Es un ancho angosto, típico de autos chicos y urbanos: rueda liviana, poco consumo y cubiertas de las más económicas.";
  if (ancho <= 195) return "Es un ancho compacto, el de la mayoría de los autos chicos y medianos: buen equilibrio entre consumo, comodidad y precio.";
  if (ancho <= 215) return "Es un ancho medio, el de sedanes medianos, hatchbacks grandes y SUV chicos: más apoyo en curva sin castigar el consumo.";
  if (ancho <= 235) return "Es un ancho generoso, habitual en sedanes grandes, SUV y camionetas livianas: más agarre y estabilidad, con algo más de consumo.";
  return "Es un ancho grande, propio de camionetas, SUV y autos deportivos: mucho apoyo y estabilidad, con mayor consumo y precio por unidad.";
}

function caracterPerfil(perfil: number): string {
  if (perfil <= 40) return "Es un perfil muy bajo, de autos deportivos o con llantas grandes: respuesta directa en curva, pero poco colchón y más sensibilidad a los pozos.";
  if (perfil <= 55) return "Es un perfil bajo, común en sedanes y hatchbacks con llantas de 16 a 18 pulgadas: dirección precisa y buen aspecto, con una marcha algo más firme.";
  if (perfil <= 65) return "Es un perfil medio, el más común en autos de calle: buen equilibrio entre comodidad, respuesta y protección de la llanta.";
  if (perfil <= 75) return "Es un perfil medio-alto, típico de autos compactos y de SUV y camionetas: absorbe bien los pozos y las calles rotas.";
  return "Es un perfil alto, de camionetas, utilitarios y 4x4: mucho colchón de aire, ideal para caminos de tierra y carga.";
}

function buildFaqs(eje: Eje, valor: number, desde: number | null): Faq[] {
  if (eje === "ancho") {
    return [
      {
        question: `¿Qué significa el ${valor} en la medida de un neumático?`,
        answer:
          `Es el ancho del neumático en milímetros: un ${valor} mide ${valor} mm de flanco a flanco. Es el primer número de la ` +
          `medida (por ejemplo ${valor}/65 R15) y aparece marcado en el flanco de la cubierta.`,
      },
      {
        question: `¿Cuánto sale un neumático de ancho ${valor}?`,
        answer: desde
          ? `Los neumáticos de ancho ${valor} arrancan en ${formatPrice(desde)} por unidad con IVA incluido. El precio cambia con el ` +
            `perfil, el rodado y la marca: en el mismo ancho, un rodado mayor cuesta más.`
          : `El precio depende del perfil, el rodado y la marca. Consultanos por WhatsApp y te pasamos las opciones de ancho ${valor} que tengamos.`,
      },
      {
        question: `¿Puedo cambiar mi neumático por uno de ancho ${valor}?`,
        answer:
          `Solo si la llanta admite ese ancho y ajustás el perfil para mantener el diámetro total dentro del ±3 % del original. ` +
          `Con la calculadora de equivalencias lo verificás en un paso, y en el local lo confirmamos antes de montar.`,
      },
    ];
  }
  return [
    {
      question: `¿Qué significa el ${valor} en la medida de un neumático?`,
      answer:
        `Es el perfil: la altura del flanco como porcentaje del ancho. En 205/${valor} R16, el flanco mide el ${valor} % de 205 mm. ` +
        `Un perfil más bajo da un neumático de flanco más corto y una marcha más firme.`,
    },
    {
      question: `¿Cuánto sale un neumático de perfil ${valor}?`,
      answer: desde
        ? `Los neumáticos de perfil ${valor} arrancan en ${formatPrice(desde)} por unidad con IVA incluido. El precio depende del ancho, ` +
          `el rodado y la marca.`
        : `El precio depende del ancho, el rodado y la marca. Consultanos por WhatsApp y te pasamos las opciones de perfil ${valor} que tengamos.`,
    },
    {
      question: `¿Puedo cambiar el perfil de mi neumático a ${valor}?`,
      answer:
        `Se puede si el diámetro externo final queda dentro del ±3 % del original; para eso, el perfil tiene que acompañar al ancho y al ` +
        `rodado. Si cambiás solo el perfil, el velocímetro y la altura de la carrocería se modifican. Consultanos y lo calculamos juntos.`,
    },
  ];
}

export function EjeLanding({ eje, valor, productos }: { eje: Eje; valor: number; productos: TireProduct[] }) {
  const campo = eje === "ancho" ? "width" : "profile";
  const delEje = productos.filter((p) => p.size[campo] === valor);
  const mejores = bestPriceByGroup(delEje);
  const peers = peersByGroup(delEje);
  const enStock = delEje.filter((p) => p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  const branch = BRANCHES[0];

  const enCatalogo = sizesFromCatalog(delEje);
  const medidasConStock = new Set(enStock.map((p) => sizeSlug(p.size))).size;
  const slugsEnCatalogo = new Set(enCatalogo.map((s) => sizeSlug(s.size)));
  const soloPrioritarias = MEDIDAS_PRIORITARIAS.filter(
    (s) => s[campo] === valor && !slugsEnCatalogo.has(sizeSlug(s))
  );

  const ordenados = [...delEje].sort(
    (a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price
  );

  // Autos que usan alguna medida de este valor: el contenido propio de cada página.
  const todasLasMedidas = [...enCatalogo.map((s) => s.size), ...soloPrioritarias];
  const vistos = new Set<string>();
  const autos = sortVehiclesByPopularity(todasLasMedidas.flatMap((s) => vehiclesUsingSize(s)))
    .filter((v) => {
      const k = `${v.brand} ${v.model}`;
      if (vistos.has(k)) return false;
      vistos.add(k);
      return true;
    })
    .slice(0, 12);

  const { anchos, perfiles } = anchosYPerfiles(productos);
  const hermanos = eje === "ancho" ? anchos : perfiles;
  const nombre = eje === "ancho" ? `ancho ${valor}` : `perfil ${valor}`;
  const ruta = eje === "ancho" ? widthSlug : profileSlug;
  const notaSlug = eje === "ancho" ? "ancho-del-neumatico-que-significa" : "perfil-del-neumatico-que-significa";
  const unidad = eje === "ancho" ? "mm de ancho" : "% de perfil";

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: eje === "ancho" ? `Ancho ${valor}` : `Perfil ${valor}`, path: `/neumaticos/${ruta(valor)}` },
        ]}
      />

      {ordenados.length > 0 && (
        <JsonLd
          data={itemListJsonLd(ordenados.map((p) => ({ name: `${p.brand} ${p.model}`, path: `/productos/${p.slug}` })))}
        />
      )}

      <section className="mb-14">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black text-navy-900">
            {eje === "ancho" ? `Neumáticos de ancho ${valor}` : `Neumáticos de perfil ${valor}`}
          </h1>
          {medidasConStock > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {medidasConStock} {medidasConStock === 1 ? "medida" : "medidas"} con stock hoy
            </span>
          )}
        </div>
        <p className="mb-6 max-w-3xl leading-relaxed text-slate-600">
          {eje === "ancho"
            ? `Un ${valor} es un neumático de ${valor} ${unidad}. `
            : `Un perfil ${valor} es un flanco de ${valor} % del ancho. `}
          {eje === "ancho" ? caracterAncho(valor) : caracterPerfil(valor)}
          {desde && (
            <>
              {" "}Arrancan en <strong className="text-navy-900">{formatPrice(desde)}</strong> por unidad.
            </>
          )}
        </p>
        {ordenados.length > 0 ? (
          <SortedProductGrid
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
            items={ordenados.map((product) => ({ product, isCheapest: mejores.has(product.id), cheapestLabel: mejores.get(product.id), peers: peers.get(product.id) }))}
          />
        ) : (
          <p className="max-w-2xl leading-relaxed text-slate-600">
            Ahora mismo no tenemos stock en {nombre}, pero recibimos mercadería todas las semanas: consultanos por
            WhatsApp y te avisamos apenas ingrese.
          </p>
        )}
      </section>

      {(enCatalogo.length > 0 || soloPrioritarias.length > 0) && (
        <section className="mb-14">
          <h2 className="mb-5 text-3xl font-black leading-tight text-navy-900 md:text-5xl">
            Medidas con {nombre}
          </h2>
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

      {autos.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-3 text-2xl font-black text-navy-900">Autos que usan {nombre}</h2>
          <p className="mb-4 max-w-3xl leading-relaxed text-slate-600">
            Algunos de los modelos que salen de fábrica con una medida de {nombre}. La versión exacta de tu auto
            la confirmás en la página de cada modelo.
          </p>
          <ul className="flex flex-wrap gap-2">
            {autos.map((v) => (
              <li key={`${v.brand}-${v.model}`} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy-900">
                {v.brand} {v.model}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-14">
        <h2 className="mb-3 text-2xl font-black text-navy-900">
          {eje === "ancho" ? "Otros anchos" : "Otros perfiles"}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {hermanos.map((h) => (
            <li key={h}>
              <Link
                href={`/neumaticos/${ruta(h)}`}
                className={`inline-block rounded-xl border px-3.5 py-2 text-sm font-bold ${
                  h === valor ? "border-navy-900 bg-navy-900 text-white" : "border-slate-200 bg-white text-navy-900 hover:border-navy-300"
                }`}
              >
                {eje === "ancho" ? h : `${h} %`}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-600">
          ¿Querés entender qué es el {eje}?{" "}
          <Link href={`/blog/${notaSlug}`} className="font-bold text-navy-700 underline underline-offset-4">
            Leé la explicación completa
          </Link>
          . Si buscás por diámetro de llanta, mirá los <Link href="/neumaticos" className="font-bold text-navy-700 underline underline-offset-4">rodados disponibles</Link>.
        </p>
      </section>

      <FaqSection faqs={buildFaqs(eje, valor, desde)} title={`Preguntas sobre el ${nombre}`} />

      <section className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-black text-navy-900">¿No encontrás tu medida?</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
          Escribinos con la medida que buscás y te decimos si la tenemos, cuándo ingresa o qué equivalencia te
          sirve. Atendemos de {branch.hours.toLowerCase()} en {branch.address}, {branch.city}.
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
