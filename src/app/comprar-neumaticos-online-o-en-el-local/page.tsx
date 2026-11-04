import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME, resumen } from "@/lib/seo";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";
import { poolShare } from "@/lib/share-image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { CuentaTotal } from "./CuentaTotal";

// Como el resto de las landings de SEO usa DEFAULT_BRANCH_ID y no lee la cookie
// de sucursal (ver memoria seo-architecture): tiene que seguir siendo estática.
const share = poolShare("comprar-online-o-local");

export const metadata: Metadata = {
  title: "Comprar neumáticos online o en el local: qué incluye el precio",
  description:
    resumen("Comprar neumáticos online y llevarlos a un taller suma envío, colocación y días de espera. Hacé la cuenta con tus números y compará con neumáticos colocados en el día y sin cargo."),
  alternates: canonical("/comprar-neumaticos-online-o-en-el-local"),
  openGraph: { title: `Comprar neumáticos online o en el local — ${SITE_NAME}`, url: "/comprar-neumaticos-online-o-en-el-local", ...share.openGraph },
  twitter: share.twitter,
};

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const FAQS = [
  {
    question: "¿Conviene comprar neumáticos por internet?",
    answer:
      "Depende de qué incluya el precio. Un neumático suelto más barato puede terminar costando lo mismo o más si después hay que pagar el envío y la colocación en un taller, y esperar a que haya turno. Por eso conviene comparar el total: neumáticos, envío, colocación y válvulas.",
  },
  {
    question: "¿Qué incluye la colocación sin cargo?",
    answer:
      "El armado y desarmado del neumático en la llanta y el cambio de válvulas, si comprás las cubiertas en el local. El balanceo y la alineación son servicios aparte y se cotizan por separado; conviene hacerlos al estrenar el juego para que el desgaste sea parejo.",
  },
  {
    question: "¿Cuánto tarda la colocación?",
    answer:
      "Se hace en el momento, por orden de llegada: comprás, esperás en el local y te llevás el auto con los neumáticos puestos. No hace falta coordinar con otro taller ni volver otro día.",
  },
  {
    question: "¿Y la garantía?",
    answer:
      "Todos los neumáticos tienen un año de garantía por defecto de fabricación y se gestiona directamente con nosotros, en el local donde los compraste y los colocaron. La garantía no cubre golpes, pinchaduras ni desgaste por falta de alineación.",
  },
  {
    question: "¿Puedo reservar un neumático y pasar a retirarlo?",
    answer:
      "Sí. Mirá el precio y el stock en la web, escribinos por WhatsApp para reservar y pasá por el local: lo retirás y lo colocamos en el momento.",
  },
];

export default async function ComprarOnlineOLocalPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const autos = productos.filter((p) => !p.isCarga);
  const enStock = autos.filter((p) => p.enStock && (p.stock ?? 0) >= 3);
  const masBarato = [...enStock].sort((a, b) => a.price - b.price)[0] ?? null;

  // Las medidas que más se venden en el local, con el juego de cuatro desde.
  const vendidas = new Map<string, { size: (typeof autos)[number]["size"]; unidades: number }>();
  for (const p of autos) {
    const k = sizeSlug(p.size);
    const prev = vendidas.get(k);
    vendidas.set(k, { size: p.size, unidades: (prev?.unidades ?? 0) + (p.vendidos ?? 0) });
  }
  const top = [...vendidas.values()]
    .sort((a, b) => b.unidades - a.unidades)
    .map(({ size }) => {
      const delaMedida = enStock.filter((p) => sizeSlug(p.size) === sizeSlug(size));
      return { size, desde: delaMedida.length ? Math.min(...delaMedida.map((p) => p.price)) : null };
    })
    .filter((m) => m.desde !== null)
    .slice(0, 6);

  const FILAS: [string, string, string][] = [
    ["Neumático", "Precio publicado de cada uno", "Precio publicado de cada uno"],
    ["Colocación", "Se contrata aparte en un taller, con su propio precio", "Incluida: armado, desarmado y válvulas sin cargo"],
    ["Cuándo queda listo", "Cuando llega el envío y hay turno en el taller", "En el día, por orden de llegada"],
    ["Quién responde si hay un problema", "Dos partes: quien vendió y quien colocó", "Un solo lugar: el local donde lo compraste y lo colocaron"],
    ["Envío", "Se suma al total, o hay que coordinar la entrega", "No hace falta: lo retirás en el local"],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: "Online o en el local", path: "/comprar-neumaticos-online-o-en-el-local" },
        ]}
      />

      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-black leading-tight text-navy-900 md:text-5xl">
          Comprar neumáticos online o en el local: qué incluye el precio
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          El precio del neumático es solo una parte. Después vienen el envío, la colocación en un taller y los días hasta
          tener el auto andando. Hacé la cuenta completa con tus números.
        </p>
      </header>

      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-black text-navy-900">Hacé la cuenta con tu presupuesto</h2>
        <CuentaTotal precioNuestro={masBarato?.price ?? null} />
        <p className="mt-3 text-sm text-slate-500">
          Los datos que cargás no se guardan ni se envían. La comparación de la derecha usa el neumático nuevo más económico
          que tenemos hoy en stock: para tu medida puntual,{" "}
          <Link href="/neumaticos" className="font-bold text-navy-700 underline underline-offset-4">buscá neumáticos por medida</Link>.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-black text-navy-900">Qué cambia entre una y otra</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Comprar online y colocar aparte</p>
            <ul className="mt-4 space-y-4">
              {FILAS.map(([dato, otro]) => (
                <li key={dato} className="flex gap-3">
                  <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-black text-slate-500">–</span>
                  <span>
                    <span className="block text-xs font-black uppercase tracking-wide text-slate-400">{dato}</span>
                    <span className="block text-slate-600">{otro}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-orange-500 bg-white p-6 shadow-lg shadow-orange-500/10">
            <p className="text-xs font-black uppercase tracking-widest text-orange-600">Comprar en {SITE_NAME}</p>
            <ul className="mt-4 space-y-4">
              {FILAS.map(([dato, , nuestro]) => (
                <li key={dato} className="flex gap-3">
                  <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">✓</span>
                  <span>
                    <span className="block text-xs font-black uppercase tracking-wide text-slate-400">{dato}</span>
                    <span className="block font-bold text-navy-900">{nuestro}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {top.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-2 text-2xl font-black text-navy-900">Las medidas que más vendemos, con colocación</h2>
          <p className="mb-5 max-w-3xl text-slate-600">
            Precio del juego de cuatro con el neumático más económico de cada medida, con colocación y válvulas sin cargo.
            Precios con IVA, de hoy.
          </p>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {top.map(({ size, desde }) => (
              <li key={sizeSlug(size)}>
                <Link href={`/neumaticos/${sizeSlug(size)}`} className="block rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-400">
                  <span className="block text-lg font-black text-navy-900">{formatSize(size)}</span>
                  <span className="mt-1 block text-sm font-bold text-emerald-700">Juego de 4 desde {money(desde! * 4)}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{money(desde!)} c/u · colocación incluida</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-4 rounded-3xl bg-black p-8 text-white md:p-10">
        <h2 className="text-2xl font-black md:text-3xl">Comprás, esperás y te vas andando</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Elegí tu medida, reservá por WhatsApp y pasá por el local: los colocamos en el momento, sin cargo.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/neumaticos" className="inline-flex min-h-12 items-center rounded-xl bg-orange-500 px-6 text-sm font-black !text-white hover:bg-orange-600">
            Buscar neumáticos por medida
          </Link>
          <Link href="/sucursales" className="inline-flex min-h-12 items-center rounded-xl border border-white/30 px-6 text-sm font-black !text-white hover:bg-white/10">
            Cómo llegar
          </Link>
        </div>
      </section>

      <FaqSection faqs={FAQS} title="Preguntas frecuentes" />
    </div>
  );
}
