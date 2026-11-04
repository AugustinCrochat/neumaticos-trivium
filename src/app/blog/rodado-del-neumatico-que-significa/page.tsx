import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { FlancoFoto } from "@/components/blog/FlancoFoto";
import { FlancoLinks } from "@/components/blog/FlancoLinks";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "rodado-del-neumatico-que-significa";
const TITLE = "Rodado del neumático: qué significa el 15 en 195/65 R15";
const SUBTITLE =
  "El último número de la medida es el diámetro de la llanta en pulgadas, y no es el tamaño total de la rueda. Qué pasa si querés cambiar de rodado.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Qué significa el 15 en 195/65 R15: el rodado o diámetro de la llanta en pulgadas. Cómo pasarlo a milímetros, por qué no es el diámetro total de la rueda y qué cambiar si subís de rodado."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  { question: "¿Qué es el rodado de un neumático?", answer: "Es el diámetro de la llanta en pulgadas, el último número de la medida. En 195/65 R15, el rodado es 15." },
  { question: "¿Rodado es lo mismo que el diámetro de la rueda?", answer: "No. El rodado es el diámetro de la llanta; el diámetro total de la rueda suma además dos alturas de flanco." },
  { question: "¿Puedo poner un neumático de otro rodado en mi llanta?", answer: "No: el rodado del neumático tiene que coincidir con el de la llanta. Para cambiar de rodado hay que cambiar también la llanta." },
  { question: "¿Cuántos milímetros son 15 pulgadas?", answer: "15 × 25,4 = 381 mm." },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-11-18"
      readingMinutes={4}
      faqs={FAQS}
      extras={
        <>
          <FotoNeumaticoBloque titulo="¿No sabés qué lleva tu neumático? Mandanos una foto" />
          <FlancoLinks current={SLUG} />
        </>
      }
    >
      <p>El último número de <strong>195/65 R15</strong> es el <strong>rodado</strong>, o diámetro de la llanta (el aro): <strong>15 pulgadas</strong>. En la foto del flanco es el número 4.</p>
      <FlancoFoto numero={4} caption="Número 4: el rodado, 15 pulgadas." />

      <h2>De pulgadas a milímetros</h2>
      <p>Una pulgada son 25,4 mm. Entonces 15 pulgadas = 15 × 25,4 = <strong>381 mm</strong>. Es el diámetro de la llanta donde se apoya el neumático, no el de toda la rueda.</p>

      <h2>El diámetro total es otro dato</h2>
      <p>El diámetro total de la rueda suma la llanta más dos veces la altura del flanco: 381 + 2 × 126,75 = <strong>634,5 mm</strong>. Ese es el número que importa para el velocímetro y para que la rueda entre en el paso de rueda.</p>

      <h2>La medida tiene que coincidir con la llanta</h2>
      <p>El rodado del neumático debe ser exactamente el de la llanta: un neumático R15 solo va en una llanta de 15 pulgadas. No hay forma de «hacerlo entrar» en una de 16.</p>

      <h2>Si querés subir de rodado</h2>
      <p>Al pasar a una llanta más grande, el neumático necesita menos perfil para conservar el diámetro total. Un ejemplo: <strong>195/65 R15</strong> (634,5 mm) y <strong>205/55 R16</strong> (631,9 mm) son equivalentes con apenas 0,4 % de diferencia. Hay que revisar también el índice de carga y que la llanta nueva sea compatible con el auto. Si querés ver qué conviene, usá la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> o leé <Link href="/blog/perfil-bajo-o-perfil-alto">perfil bajo o perfil alto</Link>.</p>
      <p>Todas las medidas por diámetro de llanta: <Link href="/neumaticos/rodado-13">R13</Link>, <Link href="/neumaticos/rodado-14">R14</Link>, <Link href="/neumaticos/rodado-15">R15</Link>, <Link href="/neumaticos/rodado-16">R16</Link>, <Link href="/neumaticos/rodado-17">R17</Link> y <Link href="/neumaticos/rodado-18">R18</Link>.</p>
      <p>Para el resto del código, mirá <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>
    </ArticleLayout>
  );
}
