import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "maquinas-hofmann-y-elevadores-rotary-lift-gomeria";
const TITLE = "Máquinas Hofmann y elevadores Rotary Lift: el equipamiento de una gomería seria";
const SUBTITLE =
  "Alineadoras y balanceadoras Hofmann, elevadores Rotary Lift y desmontadoras: qué hace cada máquina y por qué cambia la calidad del trabajo.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué máquinas hay detrás de una buena gomería: alineadora 3D Hofmann Geoliner, balanceadora Hofmann Geodyna, elevadores Rotary Lift y desmontadoras. Y dónde conseguirlas para tu taller.",
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
      "Hofmann es una marca de equipos para taller (alineadoras, balanceadoras y desmontadoras) y Rotary Lift es una marca de elevadores para vehículos. Las dos se consiguen a través de Trivium Pro, nuestra unidad de equipamiento para talleres y gomerías.",
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
        corrección con precisión. Nuestro taller trabaja con una{" "}
        <a href="https://pro.trivium.ar/producto/alineadora-3d-hofmann-geoliner-630/">Hofmann Geoliner 630</a>,
        una alineadora 3D compacta. Para talleres de más volumen está la{" "}
        <a href="https://pro.trivium.ar/producto/alineadora-3d-hofmann-geoliner-880/">Geoliner 880</a>. Más
        sobre cómo se hace un trabajo con ella en{" "}
        <Link href="/blog/geoliner-630-geodyna-7800p-alineacion-balanceo">esta nota</Link>.
      </p>

      <h2>Balanceadora Hofmann Geodyna</h2>
      <p>
        La balanceadora detecta el desequilibrio de peso del conjunto rueda-neumático y calcula
        dónde poner los contrapesos. Usamos una{" "}
        <a href="https://pro.trivium.ar/producto/balanceadora-de-ruedas-hofmann-geodyna-7800-2p/">Hofmann Geodyna 7800P</a>.
        La familia Geodyna incluye modelos para autos, camionetas y camiones; en{" "}
        <a href="https://pro.trivium.ar/blog/balanceadoras-hofmann-geodyna-cual-elegir-7100-7400l-7600p-7800-9000p-980l/">esta guía</a>{" "}
        explicamos cuál conviene según el taller.
      </p>

      <h2>Elevadores Rotary Lift</h2>
      <p>
        El elevador es la base del trabajo: sostiene el vehículo para desmontar ruedas, alinear y
        revisar la suspensión. <a href="https://pro.trivium.ar/marca/rotary-lift/">Rotary Lift</a> es una
        marca de elevadores de dos y cuatro columnas, de tijera y para motos, de uso extendido en
        talleres. Para alineación hace falta un elevador nivelado y preparado; la guía{" "}
        <a href="https://pro.trivium.ar/guias/elevadores-para-taller/">Elevadores para taller</a> explica
        cómo elegir capacidad y tipo.
      </p>

      <h2>Desmontadoras de neumáticos</h2>
      <p>
        La desmontadora saca y coloca el neumático en la llanta. Una automática, como las{" "}
        <a href="https://pro.trivium.ar/producto/desarmadora-de-neumaticos-hofmann-monty-3300-20/">Hofmann Monty</a>,
        protege la llanta de aleación y el talón del neumático, algo clave en perfil bajo y run flat.
        Mirá cómo funciona en{" "}
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
