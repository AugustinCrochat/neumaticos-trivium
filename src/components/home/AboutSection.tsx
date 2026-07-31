import Link from "next/link";
import { SHIPPING_FLAT_RATE } from "@/lib/config";

/**
 * Bloque de texto largo de la home.
 *
 * La home tenía 264 palabras, casi todas de navegación. Para competir por
 * consultas nacionales genéricas ("comprar neumáticos", "cubiertas precio") hace
 * falta que la página explique de verdad qué vende el negocio y por qué, con
 * enlaces a las páginas que profundizan cada punto. No es relleno: cada párrafo
 * responde una objeción real que aparece en el mostrador.
 */
export function AboutSection() {
  return (
    <section className="border-b border-slate-100 bg-white py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-black text-navy-900">
          Comprar neumáticos sin pagar de más
        </h2>

        <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-600">
          <p>
            El precio de una cubierta en Argentina arrastra varias capas: el importador, el
            distribuidor mayorista, el distribuidor regional y recién ahí la gomería del barrio.
            Cada eslabón suma su margen, y el que paga la suma sos vos. Nosotros importamos
            directo de fábrica y vendemos al público desde nuestro propio local, así que esa cadena
            se acorta a un solo paso.
          </p>
          <p>
            Eso no significa vender cualquier cosa barata. Trabajamos con marcas que tienen
            homologación europea, ensayos de frenado publicados y compuestos con sílice en sus
            líneas medias y altas, además de premium tradicionales cuando el cliente las pide.{" "}
            <Link
              href="/blog/marcas-chinas-neumaticos-comparativa"
              className="font-bold text-navy-800 underline underline-offset-2"
            >
              Escribimos una comparativa honesta de las marcas chinas
            </Link>{" "}
            justamente porque la pregunta aparece todos los días y merece una respuesta con
            matices, no un eslogan.
          </p>

          <h3 className="pt-4 text-2xl font-black text-navy-900">
            Stock real, publicado y verificable
          </h3>
          <p>
            Lo que ves en la web es lo que hay físicamente en el local. El catálogo se sincroniza
            con el sistema de gestión, así que cuando una medida figura disponible es porque está
            en el depósito, y cuando figura agotada te lo decimos en vez de hacerte venir. Es una
            diferencia concreta con el modelo habitual de la gomería, que cotiza, encarga al
            distribuidor y te cita dos días después.
          </p>

          <h3 className="pt-4 text-2xl font-black text-navy-900">
            Cubiertas para auto, camioneta y carga
          </h3>
          <p>
            Cubrimos rodados del 13 al 18 en las medidas de mayor circulación del parque automotor
            argentino, más medidas de camioneta y neumáticos de carga con marcado C para uso
            comercial. Si no sabés cuál es la tuya, está escrita en el flanco del neumático que
            tenés puesto con el formato 205/55 R16 —{" "}
            <Link
              href="/blog/como-leer-medida-neumatico"
              className="font-bold text-navy-800 underline underline-offset-2"
            >
              acá explicamos cómo leerla
            </Link>{" "}
            — o buscá directamente por marca y modelo de tu auto y te decimos qué lleva.
          </p>

          <h3 className="pt-4 text-2xl font-black text-navy-900">
            Taller propio: salís con el auto listo
          </h3>
          <p>
            Comprar la cubierta es la mitad del trabajo. En el mismo local hacemos el arme y el
            desarme, el balanceo dinámico y la alineación computarizada 3D, que es lo que evita que
            un neumático nuevo se empiece a comer de un lado a los pocos miles de kilómetros. Si
            comprás los neumáticos acá, la colocación y el cambio de válvulas no se cobran.{" "}
            <Link
              href="/servicios"
              className="font-bold text-navy-800 underline underline-offset-2"
            >
              Mirá todos los servicios del taller
            </Link>
            .
          </p>

          <h3 className="pt-4 text-2xl font-black text-navy-900">
            Envío a todo el país o retiro sin cargo
          </h3>
          <p>
            Si estás lejos de Córdoba, enviamos a cualquier punto de Argentina por $
            {SHIPPING_FLAT_RATE.toLocaleString("es-AR")} fijos, sin importar cuántos neumáticos
            compres ni a qué provincia van. Si estás cerca, el retiro en el local no tiene costo y
            además te llevás la colocación incluida.{" "}
            <Link
              href="/neumaticos-en"
              className="font-bold text-navy-800 underline underline-offset-2"
            >
              Mirá las zonas que atendemos
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
