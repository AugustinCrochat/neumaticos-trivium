import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { canonical, absoluteUrl, SITE_NAME, ORGANIZATION_ID, WEBSITE_ID, type Faq } from "@/lib/seo";
import { poolShare } from "@/lib/share-image";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug } from "@/lib/tire-sizes";

const TITLE = "Buscador de neumáticos por medida o por auto, con stock real";
const DESCRIPTION =
  "Buscá neumáticos por medida (ancho, perfil y rodado) o por marca y modelo de tu auto. Muestra solo lo que hay en stock, con precio, y propone medidas equivalentes si la tuya está agotada.";

const PATH = "/buscador";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical(PATH),
  openGraph: { title: `Buscador de neumáticos — ${SITE_NAME}`, description: DESCRIPTION, url: PATH, ...poolShare("buscador").openGraph },
  twitter: poolShare("buscador").twitter,
};

// Lo que el buscador hace de verdad (ver TireSizeSearch y VehicleSizeSearch). Se
// repite en el texto de la página, en el schema y en llms.txt: si se suma una
// función, actualizar los tres.
const FUNCIONES = [
  "Búsqueda por medida en tres pasos (ancho, perfil y rodado) que solo ofrece combinaciones que existen en el catálogo",
  "Marca con stock las medidas y los modelos que hay hoy en el local",
  "Propone medidas equivalentes con stock (diámetro dentro del ±3 %) cuando la medida pedida está agotada",
  "Búsqueda por marca y modelo del auto, con la medida original de cada versión",
  "Acepta medidas en pulgadas (flotation, por ejemplo 31x10.50 R15) y las convierte a métrica",
  "Incluye neumáticos de carga (serie C) y permite buscar por voz",
  "Gratis y sin registro",
];

const FAQS: Faq[] = [
  {
    question: "¿Cómo busco neumáticos por medida?",
    answer:
      "Escribí el ancho (por ejemplo 185), el perfil (65) y el rodado (15). A medida que completás cada dato, el buscador te muestra qué perfiles y rodados existen para lo que ya escribiste y cuáles tienen stock, así no llegás a una medida que no vendemos.",
  },
  {
    question: "¿Y si no sé qué medida lleva mi auto?",
    answer:
      "Cambiá a la pestaña “Por mi auto”, elegí marca y modelo y el buscador te muestra la medida original de cada versión. También podés leerla en el flanco del neumático que tenés puesto (un código como 185/65 R15) o en la etiqueta del marco de la puerta del conductor.",
  },
  {
    question: "¿Los precios y el stock que muestra son reales?",
    answer:
      "Sí. El buscador lee el catálogo del local, el mismo que usamos para vender en el mostrador, y marca como “sin stock” lo que hoy no está. Los precios son por unidad e incluyen IVA.",
  },
  {
    question: "¿Qué pasa si mi medida no tiene stock?",
    answer:
      "Te lo dice y te muestra medidas equivalentes que sí hay: las que mantienen el diámetro externo dentro del ±3 % de la original, para que el velocímetro y los sistemas de control del auto sigan funcionando bien. Si querés la medida exacta, podemos conseguirla: consultanos por WhatsApp.",
  },
  {
    question: "¿Puedo buscar medidas en pulgadas, como 31x10.50 R15?",
    answer:
      "Sí. Las medidas flotation (típicas de camionetas y 4x4) se convierten a su equivalente métrico y se muestran con la aclaración, para que puedas compararlas con lo que hay.",
  },
  {
    question: "¿Tiene algún costo o hay que registrarse?",
    answer: "No. Es gratis y se usa sin crear cuenta.",
  },
];

const EJEMPLOS_VEHICULOS = ["fiat-cronos", "toyota-hilux", "volkswagen-gol-trend", "chevrolet-onix"]
  .map((slug) => POPULAR_VEHICLES.find((v) => vehicleSlug(v.brand, v.model) === slug))
  .filter((v): v is NonNullable<typeof v> => Boolean(v));

const EJEMPLOS_MEDIDAS = [MEDIDAS_PRIORITARIAS[6], MEDIDAS_PRIORITARIAS[10], MEDIDAS_PRIORITARIAS[2]];

export default function BuscadorPage() {
  const modelos = POPULAR_VEHICLES.length;
  const marcas = new Set(POPULAR_VEHICLES.map((v) => v.brand)).size;

  return (
    <div className="bg-slate-50 pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "@id": `${absoluteUrl(PATH)}#buscador`,
          name: "Buscador de neumáticos de Neumáticos Trivium",
          url: absoluteUrl(PATH),
          description: DESCRIPTION,
          applicationCategory: "ShoppingApplication",
          operatingSystem: "Web",
          browserRequirements: "Requiere JavaScript",
          inLanguage: "es-AR",
          isAccessibleForFree: true,
          featureList: FUNCIONES,
          offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
          areaServed: { "@type": "Country", name: "Argentina" },
          provider: { "@id": ORGANIZATION_ID },
          isPartOf: { "@id": WEBSITE_ID },
        }}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Breadcrumbs crumbs={[{ name: "Inicio", path: "/" }, { name: "Buscador de neumáticos", path: PATH }]} />
        <h1 className="text-3xl font-black leading-tight text-tire-950 md:text-5xl">Buscador de neumáticos por medida o por auto</h1>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
          Elegí tu medida, o tu marca y modelo, y mirá en la misma pantalla qué neumáticos hay, a qué precio y si están en
          stock hoy. Si tu medida está agotada, te mostramos equivalentes que sí tenemos.
        </p>

        <div className="mt-8 max-w-3xl rounded-2xl bg-white p-4 shadow-lg md:p-6">
          <SizeOrVehicleSearch />
        </div>

        <section className="mt-12 max-w-3xl">
          <h2 className="mb-3 text-2xl font-black text-tire-950">Qué hace este buscador</h2>
          <ul className="space-y-2 text-slate-700">
            {FUNCIONES.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden="true" className="font-black text-orange-500">✓</span>
                <span>{f}.</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="mb-3 text-2xl font-black text-tire-950">Se adapta a lo que tenemos</h2>
          <p className="mb-3 text-slate-700">
            El buscador no trabaja con un catálogo teórico: parte del stock del local. Por eso, en cada paso solo ofrece medidas que
            existen, indica cuáles están disponibles hoy y, cuando una no está, sugiere las equivalentes que sí. Se apoya en la
            medida original de {modelos} modelos de {marcas} marcas, cargada versión por versión.
          </p>
          <p className="text-slate-700">
            Si tu auto no está en la lista o preferís confirmarlo, escribinos por <Link href="/contacto" className="font-bold text-orange-600 underline underline-offset-4">WhatsApp</Link> y
            lo verificamos con el taller.
          </p>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="mb-3 text-2xl font-black text-tire-950">Probalo con un ejemplo</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-bold text-tire-950">Por medida</h3>
              <ul className="space-y-1">
                {EJEMPLOS_MEDIDAS.map((m) => (
                  <li key={sizeSlug(m)}>
                    <Link href={`/neumaticos/${sizeSlug(m)}`} className="font-bold text-orange-600 underline underline-offset-4">
                      Neumáticos {formatSize(m)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-bold text-tire-950">Por auto</h3>
              <ul className="space-y-1">
                {EJEMPLOS_VEHICULOS.map((v) => (
                  <li key={vehicleSlug(v.brand, v.model)}>
                    <Link href={`/vehiculos/${vehicleSlug(v.brand, v.model)}`} className="font-bold text-orange-600 underline underline-offset-4">
                      Medida de neumáticos del {v.brand} {v.model}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/vehiculos/todos" className="font-bold text-slate-600 underline underline-offset-4">
                    Ver los {modelos} modelos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="max-w-3xl">
          <FaqSection faqs={FAQS} />
        </div>

        <p className="mt-10 max-w-3xl text-sm text-slate-500">
          Más ayuda para elegir:{" "}
          <Link href="/calculadora-equivalencia-neumaticos" className="underline underline-offset-4">calculadora de equivalencias</Link>,{" "}
          <Link href="/herramientas" className="underline underline-offset-4">todas las herramientas</Link> y{" "}
          <Link href="/vehiculos/mas-atendidos" className="underline underline-offset-4">las medidas más cambiadas en Córdoba</Link>.
        </p>
      </div>
    </div>
  );
}
