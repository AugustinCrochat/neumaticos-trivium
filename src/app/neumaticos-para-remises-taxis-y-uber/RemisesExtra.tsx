import Image from "next/image";
import Link from "next/link";
import type { TireProduct, TireSize } from "@/lib/types";
import { POPULAR_VEHICLES, getSizesForVehicle, vehicleSlug } from "@/lib/vehicles";
import { sizeSlug } from "@/lib/tire-sizes";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

// Autos muy comunes en remises, taxis y aplicaciones. Las medidas salen de la
// base de vehículos (varían según la versión) y el precio, del catálogo: no
// hay cifras escritas a mano que puedan quedar viejas.
const AUTOS: [string, string][] = [
  ["Chevrolet", "Onix"],
  ["Chevrolet", "Prisma"],
  ["Fiat", "Cronos"],
  ["Fiat", "Argo"],
  ["Fiat", "Grand Siena"],
  ["Toyota", "Etios"],
  ["Volkswagen", "Gol Trend"],
  ["Volkswagen", "Voyage"],
  ["Renault", "Logan"],
  ["Renault", "Sandero"],
  ["Nissan", "Versa"],
  ["Toyota", "Corolla"],
];

const link = "font-bold text-[#cc1800] underline underline-offset-4";

export function RemisesExtra({ productos }: { productos: TireProduct[] }) {
  const desdePorMedida = new Map<string, number>();
  const conLanding = new Set<string>();
  for (const p of productos) {
    const k = sizeSlug(p.size);
    conLanding.add(k);
    if (p.enStock && p.price < (desdePorMedida.get(k) ?? Infinity)) desdePorMedida.set(k, p.price);
  }
  const conPagina = new Set(POPULAR_VEHICLES.map((v) => `${v.brand} ${v.model}`));

  const filas = AUTOS.map(([brand, model]) => {
    const vistos = new Set<string>();
    const medidas: TireSize[] = [];
    for (const s of getSizesForVehicle(brand, model) ?? []) {
      const size = { width: Number(s.w), profile: Number(s.p), rim: Number(s.r) };
      if (size.rim > 16) continue; // 17" o más no es lo que lleva un auto de trabajo
      const k = sizeSlug(size);
      if (!vistos.has(k)) {
        vistos.add(k);
        medidas.push(size);
      }
    }
    medidas.sort((a, b) => a.rim - b.rim || a.width - b.width);
    return { brand, model, medidas };
  }).filter((f) => f.medidas.length > 0);

  return (
    <>
      <section className="mb-14 grid items-center gap-8 md:grid-cols-[minmax(0,22rem)_1fr]">
        <figure>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src="/images/local/remis-cambio-de-cuatro-neumaticos-con-alineacion-y-balanceo-trivium-cordoba.webp"
              alt="Remis sobre el elevador del taller de Neumáticos Trivium durante el cambio de las cuatro cubiertas, con la balanceadora al fondo"
              fill
              sizes="(min-width: 768px) 352px, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 55%" }}
            />
          </div>
          <figcaption className="mt-2 text-sm text-slate-500">
            Un remis en el taller de Argüello: las cuatro cubiertas, la alineación y el balanceo en el mismo lugar.
          </figcaption>
        </figure>
        <div className="space-y-4 leading-relaxed text-slate-700">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">
            Cuando el auto es tu herramienta de trabajo
          </h2>
          <p>
            Un taxi, un remis o un auto de Uber, DiDi o Cabify hace en un mes los kilómetros que un auto particular
            hace en varios. Las cubiertas se gastan rápido y se cambian seguido, así que el precio de cada juego se
            repite una y otra vez. Por eso lo que importa no es la marca de la góndola sino{" "}
            <strong>cuánto cuesta cada kilómetro</strong> y que el cambio te saque el auto de circulación el menor
            tiempo posible.
          </p>
          <p>
            Nuestras cubiertas son nuevas, importadas de forma directa y con un año de garantía por defecto de
            fabricación. Para uso urbano intensivo una cubierta económica de buen nivel cumple de sobra:{" "}
            <Link href="/blog/neumaticos-economicos-para-uso-urbano" className={link}>
              te explicamos cuándo no necesitás una premium
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mb-14 grid grid-cols-3 gap-2 sm:gap-4">
        {[
          {
            src: "/images/local/taxi-entrando-al-local-neumaticos-trivium-cordoba.webp",
            alt: "Taxi entrando al local de Neumáticos Trivium en Argüello, con el cartel de la fachada y las cubiertas nuevas en el exhibidor",
            caption: "Entrando al local de Argüello",
          },
          {
            src: "/images/local/remis-en-el-taller-con-balanceadora-y-neumaticos-trivium-cordoba.webp",
            alt: "Remis dentro del taller de Neumáticos Trivium, con la balanceadora y las estanterías de cubiertas al fondo",
            caption: "En el taller, con el stock a la vista",
          },
          {
            src: "/images/local/taxi-rueda-delantera-en-el-taller-neumaticos-trivium-cordoba.webp",
            alt: "Rueda delantera de un taxi en el taller de Neumáticos Trivium, con la balanceadora y las plataformas de la alineadora al fondo",
            caption: "Con la alineadora y la balanceadora a mano",
          },
        ].map((f) => (
          <figure key={f.src}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 sm:rounded-2xl">
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 280px, 33vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-xs text-slate-500 sm:text-sm">{f.caption}</figcaption>
          </figure>
        ))}
      </section>

      <section className="mb-14">
        <h2 className="font-display mb-2 text-3xl font-bold uppercase tracking-wide text-slate-900">
          La medida de los autos más usados en remises y apps
        </h2>
        <p className="mb-5 max-w-3xl text-slate-600">
          La medida exacta depende de la versión y está impresa en el flanco de tu neumático. Estas son las que lleva
          cada modelo (hasta rodado 16), con el precio por unidad más bajo que tenemos con stock.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2.5 py-3 sm:px-4">Auto</th>
                <th className="px-2.5 py-3 sm:px-4">Medidas según versión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filas.map(({ brand, model, medidas }) => (
                <tr key={`${brand}-${model}`}>
                  <td className="px-2.5 py-3 font-black text-slate-900 sm:px-4">
                    {conPagina.has(`${brand} ${model}`) ? (
                      <Link href={`/vehiculos/${vehicleSlug(brand, model)}`} className="hover:text-[#ff1e00]">
                        {brand} {model}
                      </Link>
                    ) : (
                      <>
                        {brand} {model}
                      </>
                    )}
                  </td>
                  <td className="px-2.5 py-3 sm:px-4">
                    <ul className="flex flex-wrap gap-2">
                      {medidas.map((m) => {
                        const k = sizeSlug(m);
                        const precio = desdePorMedida.get(k);
                        const texto = `${m.width}/${m.profile} R${m.rim}`;
                        const chip = (
                          <>
                            <span className="block font-black text-slate-900">{texto}</span>
                            <span className="block text-xs text-slate-500">
                              {precio ? `desde ${formatPrice(precio)}` : "consultar stock"}
                            </span>
                          </>
                        );
                        return (
                          <li key={k}>
                            {conLanding.has(k) ? (
                              <Link
                                href={`/neumaticos/${k}`}
                                className="block rounded-lg border border-slate-200 px-3 py-1.5 hover:border-[#ff1e00]"
                              >
                                {chip}
                              </Link>
                            ) : (
                              <span className="block rounded-lg border border-dashed border-slate-200 px-3 py-1.5">{chip}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          ¿No está tu auto? Buscalo en{" "}
          <Link href="/vehiculos" className={link}>
            medida por vehículo
          </Link>{" "}
          o escribinos por WhatsApp con la medida del flanco.
        </p>
      </section>

      <section className="mb-14 max-w-3xl space-y-4 leading-relaxed text-slate-700">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">
          Qué mirar al elegir para trabajar con el auto
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>La medida original.</strong> Es la que figura en la calcomanía de la puerta del conductor.
            Cambiarla trae problemas de velocímetro y de altura; si dudás, mirá las{" "}
            <Link href="/calculadora-equivalencia-neumaticos" className={link}>
              equivalencias
            </Link>
            .
          </li>
          <li>
            <strong>El índice de carga.</strong> Un auto con cuatro pasajeros, equipaje y, en muchos casos, el tanque de
            GNC en el baúl trabaja cargado casi todo el día. El índice de carga no puede ser menor al original:{" "}
            <Link href="/blog/indice-de-carga-y-velocidad" className={link}>
              acá está cómo leerlo
            </Link>
            .
          </li>
          <li>
            <strong>El costo por kilómetro.</strong> Calculalo con tus kilómetros reales en la{" "}
            <Link href="/herramientas/costo-por-kilometro" className={link}>
              calculadora de costo por kilómetro
            </Link>{" "}
            y no con el precio de góndola.
          </li>
          <li>
            <strong>Juego de cuatro o de a dos.</strong> Si trabajás todo el día, conviene cambiar las cuatro; la nota{" "}
            <Link href="/blog/cuatro-economicos-o-dos-de-marca" className={link}>
              4 económicos o 2 de marca
            </Link>{" "}
            hace la cuenta.
          </li>
        </ul>
      </section>

      <section className="mb-14 max-w-3xl space-y-4 leading-relaxed text-slate-700">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">
          Cómo hacer que las cubiertas rindan más kilómetros
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Alineación.</strong> Un tren delantero desalineado gasta un lado de la cubierta en poco tiempo, y
            con tantos kilómetros se nota rápido.{" "}
            <Link href="/servicios/alineacion" className={link}>
              Alineación 3D en Córdoba
            </Link>
            .
          </li>
          <li>
            <strong>Balanceo.</strong> Evita vibraciones y desgaste irregular.{" "}
            <Link href="/servicios/balanceo" className={link}>
              Balanceo en Córdoba
            </Link>
            .
          </li>
          <li>
            <strong>Rotación.</strong> Cambiar las ruedas de lugar reparte el desgaste;{" "}
            <Link href="/blog/rotacion-de-neumaticos" className={link}>
              cada cuánto y en qué orden
            </Link>
            .
          </li>
          <li>
            <strong>Presión.</strong> Revisala seguido y ajustala según la carga:{" "}
            <Link href="/blog/presion-de-neumaticos" className={link}>
              cuántas libras poner
            </Link>
            .
          </li>
        </ul>
        <p>
          Todo eso se hace en el taller de Argüello, por orden de llegada. Si cambiás las cuatro cubiertas, podés
          dejar hecha la alineación y el balanceo en la misma visita; consultanos por WhatsApp con tu modelo.
        </p>
      </section>
    </>
  );
}
