import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";

export const metadata = toolMetadata("foto-del-neumatico");

const FAQS = [
  { question: "¿Dónde está la medida en el neumático?", answer: "En el flanco (el costado), grabada en relieve: un código como 185/65 R15. El primer número es el ancho en milímetros, el segundo el perfil en porcentaje y el último el rodado en pulgadas. Suele ir cerca de la llanta, junto a la marca y el modelo." },
  { question: "¿Cómo saco una buena foto?", answer: "Acercate hasta que el código ocupe el círculo y se lean bien las letras y los números. Si hay poca luz, prendé el flash desde la cámara de la herramienta. Si el flanco está sucio, pasale un trapo antes. Mejor de frente que en ángulo." },
  { question: "¿Puedo mandar la foto directo por WhatsApp?", answer: "Sí, es lo más simple: abrí el chat de la sucursal desde el botón verde, tocá el clip (o el ícono de cámara) y sacá o elegí la foto del flanco del neumático. Te respondemos con la medida y el stock." },
  { question: "¿Qué pasa con la foto de la cámara guiada?", answer: "Se recorta y se comparte desde tu teléfono con el menú de compartir: elegís WhatsApp y nuestro chat. No se sube ni se guarda en el sitio." },
  { question: "¿Cuánto tardan en responder?", answer: "Respondemos en horario de atención, de lunes a sábado de 9 a 19 h. Te decimos la medida y qué tenemos en stock en ella." },
  { question: "¿Y si no puedo abrir la cámara?", answer: "Podés elegir una foto de la galería o sacarla con la cámara de tu teléfono y seleccionarla desde el botón “Elegir una foto de la galería”. También podés buscar la medida de tu auto por marca y modelo en el buscador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="foto-del-neumatico"
      hero={false}
      intro="Mandanos por WhatsApp una foto del flanco del neumático: te decimos qué medida lleva y qué tenemos en stock. También podés usar la cámara guiada de esta página."
      faqs={FAQS}
      guides={[
        { href: "/buscador", label: "Buscador de neumáticos por medida o por auto" },
        { href: "/vehiculos", label: "Qué medida lleva tu auto" },
        { href: "/blog/como-leer-medida-neumatico", label: "Cómo leer la medida de un neumático" },
      ]}
      article={
        <>
          <h2>Cómo saber qué medida lleva tu neumático</h2>
          <p>
            La medida está grabada en el flanco de cada neumático, con un formato como <strong>205/55 R16</strong>: ancho en milímetros, perfil en porcentaje del ancho y rodado en pulgadas. Si no la encontrás o no se lee bien, mandanos una foto y lo confirmamos nosotros.
          </p>
          <ul>
            <li><strong>Directo por WhatsApp:</strong> abrí el chat, tocá el clip o la cámara de WhatsApp y mandanos la foto del flanco.</li>
            <li><strong>Con la cámara guiada:</strong> la herramienta abre la cámara con un círculo para encuadrar el flanco y, si tu teléfono lo permite, un botón de flash.</li>
            <li><strong>Sin cámara guiada:</strong> elegí una foto que ya tengas o sacala con la cámara del teléfono.</li>
          </ul>
        </>
      }
    >
      <FotoNeumaticoBloque titulo="Sacá la foto y mandala por WhatsApp" />
    </ToolPage>
  );
}
