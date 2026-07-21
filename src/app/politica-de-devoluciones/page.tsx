import Link from "next/link";
import type { Metadata } from "next";
import { BRANCHES } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Devoluciones — Neumáticos Trivium",
  description: "Cambios, devoluciones, garantía de fábrica y derecho de arrepentimiento en Neumáticos Trivium.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-black text-navy-900 mb-3">{title}</h2>
      <div className="text-slate-700 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PoliticaDevolucionesPage() {
  const branch = BRANCHES[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-900 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-navy-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Inicio
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Política de Devoluciones</h1>
          <p className="text-navy-300 text-sm">Cambios, devoluciones y garantía en Neumáticos Trivium.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          <Section title="Derecho de arrepentimiento (compras online)">
            <p>
              Conforme a la Ley de Defensa del Consumidor (Ley 24.240), si compraste a través de este
              sitio tenés <strong>10 días hábiles</strong> desde que recibís el producto para arrepentirte
              de la compra, sin necesidad de justificar el motivo.
            </p>
            <p>
              Para ejercer este derecho, el producto tiene que estar sin uso, en su embalaje original y
              con todos sus accesorios. El reintegro se hace por el mismo medio de pago utilizado en la
              compra, una vez que verificamos el estado del producto devuelto.
            </p>
          </Section>

          <Section title="Neumáticos: garantía de fábrica">
            <p>
              Todos nuestros neumáticos tienen <strong>1 año de garantía de fábrica</strong> contra
              defectos de fabricación (no cubre desgaste normal, uso indebido, alineación/balanceo
              deficiente, daños por impacto o presión incorrecta).
            </p>
            <p>
              Si detectás un defecto, comunicate con nosotros con la factura de compra y el neumático
              disponible para inspección — coordinamos el cambio o reintegro según corresponda con el
              fabricante.
            </p>
          </Section>

          <Section title="Tuercas antirrobo y accesorios">
            <p>
              Se pueden cambiar o devolver sin usar, dentro de los 10 días hábiles de la compra. Una vez
              colocadas en el vehículo, solo aplica cambio por falla de fabricación.
            </p>
          </Section>

          <Section title="Servicios (alineación, balanceo, colocación, etc.)">
            <p>
              Los servicios ya realizados no admiten devolución. Si notás un problema con un trabajo
              recién hecho, contactanos y lo revisamos sin cargo.
            </p>
          </Section>

          <Section title="Cómo hacer una devolución o reclamo">
            <p>
              Escribinos por WhatsApp a la sucursal donde compraste o retirás el producto, contándonos
              tu pedido y el motivo. Te confirmamos los pasos a seguir y, si corresponde, coordinamos el
              cambio, reintegro o retiro del producto.
            </p>
            <a
              href={`https://wa.me/${branch.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </Section>

          <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">
            Última actualización: julio de 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
