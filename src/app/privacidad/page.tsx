import type { Metadata } from "next";
import { BRANCHES } from "@/lib/config";
import { LegalPage, LegalSection } from "@/components/ui/LegalPageLayout";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

export const metadata: Metadata = {
  title: "Política de Privacidad — Neumáticos Trivium",
  description: "Cómo recopilamos, usamos y protegemos tus datos personales en Neumáticos Trivium.",
};

export default function PrivacidadPage() {
  const branch = BRANCHES[0];

  return (
    <LegalPage
      title="Política de Privacidad"
      subtitle="Cómo tratamos tus datos personales en este sitio."
      updated="julio de 2026"
    >
      <LegalSection title="Qué información recopilamos">
        <p>
          Cuando comprás en el sitio o nos escribís, recopilamos los datos que nos das voluntariamente:
          nombre, número de contacto, y los datos de la compra (productos, medida, sucursal de retiro).
          No recopilamos datos de tu tarjeta ni de tu cuenta bancaria — eso lo procesa directamente
          Mercado Pago, que tiene su propia política de privacidad.
        </p>
      </LegalSection>

      <LegalSection title="Para qué la usamos">
        <p>
          Usamos tus datos únicamente para procesar tu pedido, coordinar el retiro en sucursal,
          contactarte por WhatsApp o teléfono si hay alguna consulta sobre la compra, y para brindarte
          soporte post-venta. No los usamos para enviarte publicidad no solicitada.
        </p>
      </LegalSection>

      <LegalSection title="Con quién la compartimos">
        <p>
          Compartimos los datos estrictamente necesarios con Mercado Pago para procesar el cobro. No
          vendemos ni cedemos tus datos a terceros con fines comerciales.
        </p>
      </LegalSection>

      <LegalSection title="Cookies y almacenamiento local">
        <p>
          El sitio guarda en tu navegador (localStorage) preferencias como la sucursal elegida, tu
          vehículo y el contenido del carrito, para que no tengas que volver a cargarlos en cada visita.
          Esta información queda en tu dispositivo y no se comparte con terceros.
        </p>
      </LegalSection>

      <LegalSection title="Tus derechos">
        <p>
          De acuerdo a la Ley de Protección de Datos Personales (Ley 25.326), tenés derecho a acceder,
          rectificar o solicitar la supresión de tus datos personales en cualquier momento. La Agencia
          de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley 25.326,
          tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al
          incumplimiento de las normas sobre protección de datos personales.
        </p>
      </LegalSection>

      <LegalSection title="Contacto">
        <p>
          Ante cualquier consulta sobre el tratamiento de tus datos, escribinos por WhatsApp.
        </p>
        <WhatsAppLink
          href={`https://wa.me/${branch.whatsapp}`}
          className="inline-flex items-center gap-2 mt-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Consultar por WhatsApp
        </WhatsAppLink>
      </LegalSection>
    </LegalPage>
  );
}
