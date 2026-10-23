import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "maquinas-hofmann-y-elevadores-rotary-lift-gomeria";
const TITLE = "Máquinas Hofmann y elevadores Rotary Lift: el equipamiento de una gomería seria";
const SUBTITLE =
  "Alineadoras y balanceadoras Hofmann, elevadores (Rotary Lift y Trivium Pro) y desarmadoras: qué hace cada máquina y por qué cambia la calidad del trabajo.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué máquinas hay detrás de una buena gomería: alineadora 3D Hofmann Geoliner, balanceadora Hofmann Geodyna, elevadores Rotary Lift y Trivium Pro y desarmadoras. Y dónde conseguirlas.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué máquinas necesita una gomería completa?",
    answer:
      "Como mínimo una desmontadora de neumáticos, una balanceadora y un elevador. Si además se quiere ofrecer alineación, se suma una alineadora y un elevador apto para alineación. Cuanto mejor el equipo, más precisa la medición y menos riesgo de dañar llantas y neumáticos.",
  },
  {
    question: "¿Quién fabrica las máquinas Hofmann y los elevadores Rotary Lift?",
    answer:
      "Hofmann es una marca de equipos para taller (alineadoras, balanceadoras y desarmadoras) y Rotary Lift es una marca de elevadores para vehículos. Las dos se consiguen a través de Trivium Pro, nuestra unidad de equipamiento para talleres y gomerías.",
  },
  {
    question: "¿Puedo comprar estos equipos para mi taller?",
    answer:
      "Sí. En pro.trivium.ar está el catálogo completo de alineadoras, balanceadoras, desarmadoras y elevadores, con asesoramiento, instalación y puesta en marcha.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={6} faqs={FAQS}>
      <p>
        Detrás de cada alineación, cada balanceo y cada cambio de neumáticos hay máquinas. Lo que
        medís, cómo se sujeta el auto y cómo se desmonta la cubierta determina si el trabajo queda
        bien o si vuelve el problema a las dos semanas. Acá repasamos las máquinas que usamos y qué
        hace cada una.
      </p>

      <h2>Alineadora 3D Hofmann Geoliner</h2>
      <p>
        La alineadora mide los ángulos de las cuatro ruedas (camber, caster y convergencia) y guía la
        corrección con precisión. En Argüello trabajamos con una{" "}
        <a href="https://pro.trivium.ar/producto/alineadora-3d-hofmann-geoliner-630/">Hofmann Geoliner 630</a>,
        una alineadora 3D compacta con cámaras y targets en las ruedas. Para talleres de más volumen está la{" "}
        <a href="https://pro.trivium.ar/producto/alineadora-3d-hofmann-geoliner-880/">Geoliner 880</a>. Más
        sobre cómo se hace un trabajo con ella en{" "}
        <Link href="/blog/geoliner-630-geodyna-7800p-alineacion-balanceo">esta nota</Link>.
      </p>

      <h2>Balanceadora Hofmann Geodyna</h2>
      <p>
        La balanceadora detecta el desequilibrio de peso del conjunto rueda-neumático y calcula
        dónde poner los contrapesos. Usamos una balanceadora de la familia Hofmann Geodyna, que
        incluye modelos para autos, camionetas y camiones; en{" "}
        <a href="https://pro.trivium.ar/blog/balanceadoras-hofmann-geodyna-cual-elegir-7100-7400l-7600p-7800-9000p-980l/">esta guía</a>{" "}
        explicamos cuál conviene según el taller.
      </p>
      <p>
        La foto de arriba es una rueda de camioneta A/T en nuestra Geodyna: un neumático grande y
        pesado como ese pide una balanceadora con la capacidad y el centrado correctos. Si estás
        armando o renovando una gomería y vas a balancear ruedas de camioneta, en pro.trivium.ar
        está la guía{" "}
        <a href="https://pro.trivium.ar/blog/como-elegir-una-balanceadora-de-ruedas-capacidad-tecnologia-y-modelos/">
          cómo elegir una balanceadora de ruedas
        </a>
        , y{" "}
        <a href="https://pro.trivium.ar/blog/como-centrar-una-rueda-en-la-balanceadora-conos-tuercas-rapidas-y-adaptadores/">
          cómo centrar la rueda
        </a>{" "}
        con conos y adaptadores, que es donde más se nota el trabajo bien hecho.
      </p>

      <h2>Elevadores: tijera para alinear y plancha para gomería</h2>
      <p>
        El elevador es la base del trabajo: sostiene el vehículo para desmontar ruedas, alinear y
        revisar la suspensión. Para alinear usamos un{" "}
        <a href="https://pro.trivium.ar/producto/elevador-tijera-largo-5500-kg-con-kit-de-alineacion/">elevador tijera largo con kit de alineación</a>,
        y para rotación y cambio de neumáticos una{" "}
        <a href="https://pro.trivium.ar/producto/elevador-tijera-gomeria-4500-kg-pl-45h/">plancha de gomería PL-45H</a>,
        que queda al ras del piso. Los dos son de la línea Trivium Pro; el recorrido completo del taller
        está en{" "}
        <a href="https://pro.trivium.ar/blog/las-maquinas-del-taller-de-neumaticos-trivium-arguello/">las máquinas del taller de Argüello</a>.
      </p>
      <p>
        Para quien busca una marca premium, <a href="https://pro.trivium.ar/marca/rotary-lift/">Rotary Lift</a>{" "}
        es una línea de elevadores de dos y cuatro columnas, de tijera y para motos, con certificación
        ALI y de uso extendido en talleres. La guía{" "}
        <a href="https://pro.trivium.ar/guias/elevadores-para-taller/">Elevadores para taller</a> explica
        cómo elegir capacidad y tipo, y{" "}
        <a href="https://pro.trivium.ar/blog/rotary-lift-o-trivium-pro-que-linea-conviene-segun-tu-taller/">Rotary Lift o Trivium Pro</a>{" "}
        compara las dos líneas.
      </p>

      <h2>Desarmadora de neumáticos</h2>
      <p>
        La desarmadora saca y coloca el neumático en la llanta. En Argüello usamos una{" "}
        <a href="https://pro.trivium.ar/producto/desarmadora-de-ruedas-con-brazo-auxiliar-pl-1256s-trivium-center/">desarmadora con brazo auxiliar PL-1256S</a>,
        que sostiene el flanco mientras se monta y protege la llanta de aleación, algo clave en perfil
        bajo y run flat. Si buscás la línea Hofmann, están las{" "}
        <a href="https://pro.trivium.ar/producto/desarmadora-de-neumaticos-hofmann-monty-3300-20/">Hofmann Monty</a>.
        Mirá cómo se hace el trabajo en{" "}
        <Link href="/blog/arme-y-desarme-de-neumaticos">arme y desarme de neumáticos</Link>.
      </p>

      <h2>Si querés equipar tu taller</h2>
      <p>
        Trivium Pro es la unidad del grupo dedicada al equipamiento profesional: alineadoras,
        balanceadoras, desmontadoras, elevadores y herramientas, con instalación y puesta en marcha.
        Podés ver el catálogo completo en <a href="https://pro.trivium.ar">pro.trivium.ar</a> y la guía
        para armar una gomería en{" "}
        <a href="https://pro.trivium.ar/guias/equipar-una-gomeria/">Equipar una gomería</a>.
      </p>
      <p>
        Y si lo que buscás es una gomería para tu auto, esta es la nuestra: mirá los{" "}
        <Link href="/servicios">servicios de Neumáticos Trivium</Link> en Argüello, Córdoba.
      </p>
    </ArticleLayout>
  );
}
