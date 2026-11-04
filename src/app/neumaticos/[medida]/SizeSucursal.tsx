"use client";

import Link from "@/components/ui/Link";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { useBranch } from "@/contexts/branch-context";
import { mensajeAvisameApertura, waHref } from "@/lib/whatsapp";

/** WhatsApp de "sin stock" con el número de la sucursal elegida. */
export function ConsultaMedidaWa({ label }: { label: string }) {
  const { selectedBranch: b } = useBranch();
  const texto = b.apertura
    ? mensajeAvisameApertura(b.shortName)
    : `Hola, busco neumáticos en medida ${label}. ¿Tienen stock o fecha de ingreso?`;
  return (
    <WhatsAppLink
      href={waHref(b.whatsapp, texto)}
      className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25d366] px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
    >
      Consultar {label} por WhatsApp
    </WhatsAppLink>
  );
}

/** Cierre de la landing de medida: dónde retirar, según la sucursal elegida (en el build sale la de Argüello). */
export function CierreMedida({ label, enlaces }: { label: string; enlaces: { href: string; texto: string }[] }) {
  const { selectedBranch: b } = useBranch();
  const secundario =
    "inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-black text-white transition-colors hover:bg-white/10";
  return (
    <section className="mt-14 overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-black p-8 text-white">
      <h2 className="text-2xl font-black">Dónde comprar neumáticos {label}</h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
        {b.apertura ? (
          <>
            Nuestro local de {b.shortName} abre {b.apertura} en {b.address}. Mientras tanto podés ver los precios acá y dejarnos
            tu consulta por WhatsApp.
          </>
        ) : (
          <>
            Podés retirarlo sin cargo en {b.address}, {b.city}. Si retirás, la colocación y el cambio de válvulas van sin cargo, y
            tenés {b.province === "Córdoba" ? "alineado y balanceado" : "alineación y balanceo"} en el mismo local para dejar el
            auto listo en una sola visita.
          </>
        )}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/sucursales/${b.id}`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
        >
          Ver la sucursal
        </Link>
        {b.apertura && (
          <WhatsAppLink href={waHref(b.whatsapp, mensajeAvisameApertura(b.shortName))} className={secundario}>
            Avisame cuando abra
          </WhatsAppLink>
        )}
        {enlaces.map((e) => (
          <Link key={e.href} href={e.href} className={secundario}>
            {e.texto}
          </Link>
        ))}
      </div>
    </section>
  );
}
