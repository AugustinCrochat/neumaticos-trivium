import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { Presion } from "@/components/tools/Presion";

export const metadata = toolMetadata("presion-neumaticos");

const FAQS = [
  { question: "¿Cuántas libras de presión van en un neumático?", answer: "La que indica el fabricante del auto, que figura en una calcomanía en el parante de la puerta del conductor, en la tapa del tanque o en el manual. Como orden de magnitud, entre 29 y 36 PSI en autos y SUV, y entre 35 y 40 PSI en camionetas." },
  { question: "¿Cuántos bar son 32 PSI?", answer: "32 PSI son aproximadamente 2,2 bar (o 2,2 kg/cm²). La conversión es 1 PSI = 0,069 bar." },
  { question: "¿Qué es la presión máxima que dice el neumático?", answer: "El valor grabado en el flanco (por ejemplo, 'MAX PRESS 44 PSI') es el máximo que soporta el neumático, no la presión de trabajo. Inflar hasta ese número endurece el andar y desgasta el centro de la banda." },
  { question: "¿Cuándo se mide la presión?", answer: "En frío, antes de salir o con el auto parado al menos 3 horas. Después de andar, el aire se calienta y la presión sube entre 3 y 6 PSI." },
  { question: "¿Hay que cambiar la presión si viajo cargado?", answer: "Sí, muchos fabricantes indican una presión más alta para carga completa o velocidad sostenida (la calcomanía suele traer las dos). Como regla general, entre 3 y 5 PSI más; lo correcto es seguir el valor de tu manual." },
];

export default function Page() {
  return (
    <ToolPage
      slug="presion-neumaticos"
      intro="Elegí el tipo de vehículo y cuánta carga llevás: te mostramos la presión orientativa en frío, en PSI y en bar, y un conversor para cualquier valor."
      faqs={FAQS}
      guides={[
        { href: "/blog/presion-de-neumaticos", label: "Presión de neumáticos: cuánto ponerles" },
        { href: "/blog/presion-neumaticos-utilitarios-con-carga", label: "Presión en utilitarios con carga" },
        { href: "/servicios", label: "Servicios de gomería" },
      ]}
      article={
        <>
          <h2>Cómo saber qué presión poner</h2>
          <p>
            Cada vehículo tiene su presión recomendada, definida por el fabricante según el peso, la suspensión y la medida de neumático. Esa información está en la <strong>calcomanía del auto</strong>, no en el neumático. Los rangos de esta herramienta son una referencia para que sepas si vas bien encaminado.
          </p>
          <p>
            Una presión baja aumenta el consumo y desgasta los bordes de la banda; una alta endurece el andar y desgasta el centro. Medirla una vez por mes, en frío, es el hábito que más alarga la vida de los neumáticos.
          </p>
        </>
      }
    >
      <Presion />
    </ToolPage>
  );
}
