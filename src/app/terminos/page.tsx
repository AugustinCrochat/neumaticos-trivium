import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/ui/LegalPageLayout";

export const metadata: Metadata = {
  title: "Términos de Uso — Neumáticos Trivium",
  description: "Condiciones de uso del sitio y de compra en Neumáticos Trivium.",
};

export default function TerminosPage() {
  return (
    <LegalPage
      title="Términos de Uso"
      subtitle="Condiciones de uso de este sitio y de las compras realizadas en él."
      updated="julio de 2026"
    >
      <LegalSection title="Aceptación de los términos">
        <p>
          Al navegar o comprar en neumaticos.trivium.ar aceptás estos términos de uso. Si no estás de
          acuerdo con alguno de los puntos, te pedimos que no uses el sitio.
        </p>
      </LegalSection>

      <LegalSection title="Sobre el sitio">
        <p>
          Neumáticos Trivium es el outlet de neumáticos de importación directa con sucursal en
          Córdoba. A través de este sitio podés consultar el catálogo de neumáticos y tuercas
          antirrobo, ver precios y stock, y comprar online para retirar en sucursal.
        </p>
      </LegalSection>

      <LegalSection title="Precios y disponibilidad">
        <p>
          Los precios publicados están expresados en pesos argentinos (ARS) e incluyen los impuestos
          correspondientes. Aunque hacemos lo posible por mantener el catálogo actualizado, el stock y
          el precio final quedan sujetos a validación al momento de confirmar el pedido — si hubiera
          alguna diferencia, te avisamos antes de procesar el cobro.
        </p>
      </LegalSection>

      <LegalSection title="Compra y pago">
        <p>
          Los pagos se procesan a través de Mercado Pago. Una vez acreditado el pago, coordinamos el
          retiro del producto en la sucursal elegida. Para cambios, devoluciones y garantía, consultá
          nuestra{" "}
          <Link href="/politica-de-devoluciones" className="text-red-600 font-bold underline underline-offset-2 hover:text-red-700">
            Política de Devoluciones
          </Link>.
        </p>
      </LegalSection>

      <LegalSection title="Propiedad intelectual">
        <p>
          El contenido de este sitio (textos, imágenes, logo, diseño) pertenece a Neumáticos Trivium o
          se usa con la debida autorización. No está permitida su reproducción sin nuestro consentimiento.
        </p>
      </LegalSection>

      <LegalSection title="Uso del sitio">
        <p>
          Te pedimos que uses el sitio de buena fe y no intentes vulnerar su seguridad, interferir con
          su funcionamiento normal, ni usarlo con fines ilícitos.
        </p>
      </LegalSection>

      <LegalSection title="Modificaciones">
        <p>
          Podemos actualizar estos términos en cualquier momento para reflejar cambios en el sitio o en
          la normativa vigente. La fecha de la última actualización figura al pie de esta página.
        </p>
      </LegalSection>

      <LegalSection title="Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de la República Argentina. Ante cualquier controversia,
          las partes se someten a los tribunales ordinarios de la Ciudad de Córdoba.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
