import type { Metadata } from "next";
import { BRANCHES, CONTACT_EMAIL } from "@/lib/config";
import { LegalPage, LegalSection } from "@/components/ui/LegalPageLayout";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

export const metadata: Metadata = {
  title: "Botón de Arrepentimiento — Neumáticos Trivium",
  description: "Ejercé tu derecho de arrepentimiento (Ley 24.240) sobre una compra realizada en neumaticos.trivium.ar.",
};

export default function ArrepentimientoPage() {
  const branch = BRANCHES[0];

  return (
    <LegalPage
      title="Botón de Arrepentimiento"
      subtitle="Derecho de revocación de compras a distancia — Ley 24.240, Resolución 424/2020."
      updated="julio de 2026"
    >
      <LegalSection title="Tu derecho">
        <p>
          La Ley de Defensa del Consumidor (Ley 24.240, artículo 34) te da un mínimo de{" "}
          <strong>10 días hábiles</strong> desde que recibís el producto para arrepentirte de la
          compra, sin costo y sin necesidad de justificar el motivo. En neumaticos.trivium.ar
          extendemos ese plazo a <strong>30 días corridos</strong> desde la recepción.
        </p>
      </LegalSection>

      <LegalSection title="Cómo ejercerlo">
        <p>
          Escribinos indicando el número de pedido o el medio de pago usado, el producto que querés
          devolver y tu nombre completo. Te confirmamos la recepción del reclamo y coordinamos el
          retiro/devolución y el reintegro por el mismo medio de pago utilizado en la compra.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <WhatsAppLink
            href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent("Hola, quiero ejercer mi derecho de arrepentimiento sobre una compra que hice en la web.")}`}
            className="inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            Reclamar por WhatsApp
          </WhatsAppLink>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Derecho de arrepentimiento")}`}
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            Reclamar por email
          </a>
        </div>
      </LegalSection>

      <LegalSection title="Condiciones para la devolución">
        <p>
          El producto tiene que estar sin uso, en su embalaje original y con todos sus accesorios. Más
          detalle en nuestra política de devoluciones.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
