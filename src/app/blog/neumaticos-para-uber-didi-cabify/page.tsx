import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-para-uber-didi-cabify";
const TITLE = "Neumáticos para Uber, DiDi y Cabify: cuáles elegir para gastar menos";
const SUBTITLE =
  "Si manejás para una aplicación, las cubiertas son un costo que se repite todo el año. Cómo elegir la medida, el índice de carga y una cubierta económica sin arriesgar seguridad.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué neumáticos conviene para manejar en Uber, DiDi o Cabify: medida, índice de carga con GNC y pasajeros, cuándo cambiarlos y cómo calcular el costo por kilómetro. Córdoba.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué neumáticos conviene comprar para manejar en Uber o DiDi?",
    answer:
      "La medida que lleva tu auto, nuevos y con un índice de carga igual o mayor al original. Entre las marcas, una cubierta económica de buen nivel suele ser la decisión más inteligente en uso urbano intensivo, porque lo que importa es cuánto te cuesta cada kilómetro.",
  },
  {
    question: "¿Cuántos kilómetros hace un auto que trabaja en aplicaciones?",
    answer:
      "Depende de las horas, pero con jornadas largas es común superar los 150 km por día. A 150 km por día, seis días a la semana, son unos 46.800 km por año: un juego de cubiertas económicas puede cambiarse más de una vez en ese tiempo.",
  },
  {
    question: "¿Tengo que cambiar las cuatro cubiertas a la vez?",
    answer:
      "Para un auto que trabaja todo el día conviene cambiar las cuatro: se desgastan parejo y no mezclás un neumático nuevo con uno gastado. Si cambiás de a dos, las nuevas van atrás y de la misma medida que las otras.",
  },
  {
    question: "¿Cambia algo si el auto anda con GNC?",
    answer:
      "El tanque suma peso en el baúl, así que el auto va más cargado. Elegí un índice de carga igual o mayor al original y ajustá la presión según la carga, como indica la calcomanía de la puerta.",
  },
  {
    question: "¿Cuándo hay que cambiarlas?",
    answer:
      "Cuando el dibujo se acerca al límite de 1,6 mm que marcan los testigos (TWI) de la banda, o antes si ves cortes, hernias en el flanco o desgaste desparejo. En uso intensivo conviene mirarlas todos los meses.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={6} faqs={FAQS}>
      <p>
        Quien maneja para Uber, DiDi, Cabify o cualquier otra aplicación tiene un gasto que no se ve en la
        pantalla del celular: las cubiertas. Un auto de trabajo hace en pocos meses los kilómetros que un auto
        particular hace en años, y cada cambio de neumáticos sale de la ganancia. Esta guía es para elegir bien
        sin pagar de más.
      </p>

      <h2>El criterio que importa: el costo por kilómetro</h2>
      <p>
        Comparar neumáticos por el precio de góndola engaña. Lo que cuenta es cuánto cuesta cada kilómetro que
        rodás. La cuenta es simple: el precio del juego dividido por los kilómetros que te rinde.
      </p>
      <p>
        Con números redondos, solo de ejemplo: si un juego de cuatro cuesta $400.000 y rinde 40.000 km, te sale
        $10.000 cada 1.000 km. Si otro juego cuesta $600.000 y rinde 50.000 km, te sale $12.000 cada 1.000 km: el
        más caro no necesariamente es el que más conviene. Probá con tus precios y tus kilómetros en la{" "}
        <Link href="/herramientas/costo-por-kilometro">calculadora de costo por kilómetro</Link>, y mirá la nota{" "}
        <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio, calidad y costo por km</Link>.
      </p>

      <h2>La medida: la que lleva tu auto</h2>
      <p>
        Está impresa en el flanco del neumático que tenés puesto y en la calcomanía de la puerta del conductor,
        con el formato 185/65 R15 (ancho, perfil y rodado). Mantener la medida original evita problemas de
        velocímetro, de altura y de roce en el guardabarros. Si tu auto es un Onix, un Cronos, un Etios, un Logan
        o un Gol, en la landing de{" "}
        <Link href="/neumaticos-para-remises-taxis-y-uber">neumáticos para remises, taxis y Uber</Link> están las
        medidas por modelo y el precio de cada una.
      </p>

      <h2>El índice de carga: más importante de lo que parece</h2>
      <p>
        Cada neumático tiene un índice que indica cuánto peso puede soportar. En un auto de aplicación suele
        viajar el conductor, hasta cuatro pasajeros, el equipaje y, en muchos casos, el tanque de GNC en el baúl.
        Por eso el índice no puede ser menor al original. Si querés entender cómo se lee, la nota{" "}
        <Link href="/blog/indice-de-carga-y-velocidad">índice de carga y velocidad</Link> lo explica.
      </p>

      <h2>Marca premium o económica</h2>
      <p>
        Para uso urbano, con velocidades moderadas y mucho tráfico, una cubierta económica de buen nivel cumple de
        sobra, y la diferencia de precio se nota en cada juego. Lo que sí hay que cuidar es que sea nueva, de la
        medida correcta y con garantía. Los argumentos completos están en{" "}
        <Link href="/blog/neumaticos-economicos-para-uso-urbano">neumáticos económicos para uso urbano</Link> y en{" "}
        <Link href="/blog/cuatro-economicos-o-dos-de-marca">4 económicos o 2 de marca</Link>.
      </p>

      <h2>Cuándo cambiarlas</h2>
      <p>
        El límite legal es de 1,6 mm de profundidad de dibujo, y los testigos (TWI) que vienen moldeados en la banda
        te lo indican. Con lluvia el agarre cae mucho antes, así que conviene cambiarlas con algo más de margen. Con
        tantos kilómetros, revisá el dibujo una vez por mes; la herramienta{" "}
        <Link href="/herramientas/cuando-cambiar-neumaticos">cuándo cambiar los neumáticos</Link> te calcula cuánto
        te queda.
      </p>

      <h2>Alineación y balanceo: lo que hace que rindan</h2>
      <p>
        Un auto que trabaja todo el día sufre baches, cordones y frenadas, y con el tiempo el tren delantero se
        desalinea. Una cubierta nueva sobre un auto desalineado se gasta de un solo lado y pierde kilómetros. Al
        cambiar el juego conviene dejar hecha la <Link href="/servicios/alineacion">alineación</Link> y el{" "}
        <Link href="/servicios/balanceo">balanceo</Link>. Más consejos en{" "}
        <Link href="/blog/como-hacer-durar-los-neumaticos-de-taxis-y-remises">cómo hacer durar los neumáticos de
        un taxi o un remis</Link>.
      </p>

      <h2>Dónde cambiarlas en Córdoba</h2>
      <p>
        En nuestro local de Argüello, Córdoba, vendemos neumáticos nuevos con garantía y los colocamos, alineamos y
        balanceamos en el mismo taller, por orden de llegada. Si comprás las cubiertas ahí, la colocación y las
        válvulas no tienen cargo. Mirá el catálogo en{" "}
        <Link href="/neumaticos-baratos">neumáticos baratos</Link> o escribinos por WhatsApp con la medida de tu auto.
      </p>
    </ArticleLayout>
  );
}
