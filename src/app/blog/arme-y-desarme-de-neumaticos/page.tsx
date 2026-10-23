import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "arme-y-desarme-de-neumaticos";
const TITLE = "Arme y desarme de neumáticos: cómo se hace bien y qué máquinas se usan";
const SUBTITLE =
  "Qué incluye el arme y desarme, por qué la válvula se cambia siempre, cómo se cuida la llanta y qué diferencia hace una desmontadora automática.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo es el arme y desarme de neumáticos en una gomería: desmontadora automática, cambio de válvula, cuidado de la llanta y balanceo. Qué mirar para que no te rayen las llantas.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué incluye el arme y desarme?",
    answer:
      "Sacar el neumático viejo de la llanta, limpiar el asiento, colocar el nuevo, cambiar la válvula, inflar a la presión correcta y, normalmente, balancear la rueda. Es el paquete mínimo para un cambio de neumáticos bien hecho.",
  },
  {
    question: "¿Por qué hay que cambiar la válvula en cada arme?",
    answer:
      "La goma de la válvula se reseca con los años y es una causa común de pérdidas lentas de aire. Es una pieza barata y cambiarla evita volver por un problema que se podía prevenir.",
  },
  {
    question: "¿Se pueden rayar las llantas al desarmar?",
    answer:
      "Con una desmontadora automática bien regulada y protectores plásticos no. Con herramienta manual o una máquina mal calibrada, sí. En llantas de aleación o de perfil bajo conviene preguntar con qué equipo trabajan.",
  },
  {
    question: "¿Se arman neumáticos que compré en otro lugar?",
    answer:
      "Sí. El arme y desarme se cobra por rueda cuando la cubierta no es nuestra; si comprás en Neumáticos Trivium, la colocación va sin cargo.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={5} faqs={FAQS}>
      <p>
        El arme y desarme es el servicio base de cualquier gomería: sacar el neumático de la llanta y
        poner el nuevo. Parece simple y, si se hace mal, se paga: una llanta rayada, un talón
        dañado o una válvula que pierde aire. Esta guía explica cómo se hace bien y qué tiene que
        tener el taller.
      </p>

      <h2>Paso a paso</h2>
      <ol>
        <li>Se desmonta la rueda del auto y se saca la válvula para vaciar el aire.</li>
        <li>Se despega el talón del neumático de la llanta y se desmonta con la desmontadora.</li>
        <li>Se limpia el asiento de la llanta y se revisa que no esté torcida ni golpeada.</li>
        <li>Se coloca el neumático nuevo, con lubricante de talón, respetando el sentido de rotación si es direccional.</li>
        <li>Se coloca una válvula nueva, se infla a la presión indicada y se balancea.</li>
      </ol>

      <h2>La máquina importa: desmontadora automática</h2>
      <p>
        Una desmontadora automática tiene un brazo que guía el talón sin forzarlo con palanquetas, y
        eso es lo que evita marcar las llantas de aleación y dañar el talón del neumático. En perfil
        bajo y en llantas grandes la diferencia es todavía más grande. Los neumáticos run flat, con
        flanco muy rígido, directamente necesitan una máquina preparada para ellos.
      </p>
      <p>
        Las desmontadoras profesionales que distribuye <strong>Trivium Pro</strong>, como las{" "}
        <a href="https://pro.trivium.ar/guias/desarmadoras-de-neumaticos/">desarmadoras Hofmann Monty</a>,
        son del tipo que usan los talleres que cuidan la llanta. Si querés ver cómo elegir una para un
        taller propio, esa guía lo explica en detalle.
      </p>

      <h2>El balanceo, siempre después del arme</h2>
      <p>
        Cada vez que se arma un neumático cambia cómo se reparte el peso del conjunto, así que
        corresponde balancear después. Sin balanceo el volante vibra y la suspensión se desgasta
        antes. Mirá cómo funciona en{" "}
        <Link href="/blog/geoliner-630-geodyna-7800p-alineacion-balanceo">nuestra nota sobre la Geodyna 7800P</Link>.
      </p>

      <h2>Qué mirar para elegir dónde hacerlo</h2>
      <ul>
        <li>Que usen desmontadora automática y protectores en las llantas de aleación.</li>
        <li>Que cambien la válvula en cada arme.</li>
        <li>Que balanceen al terminar, no «si hace falta».</li>
        <li>Que te digan el precio por rueda antes de empezar.</li>
      </ul>

      <h2>Hacelo en nuestra gomería</h2>
      <p>
        Si comprás los neumáticos en Neumáticos Trivium, la colocación y el cambio de válvulas van sin
        cargo. Atendemos por orden de llegada en Argüello, Córdoba. Mirá el servicio de{" "}
        <Link href="/servicios/montaje">arme y desarme</Link> y buscá tu medida en el{" "}
        <Link href="/catalogo">catálogo</Link>.
      </p>
    </ArticleLayout>
  );
}
