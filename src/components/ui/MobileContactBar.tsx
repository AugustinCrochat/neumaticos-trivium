"use client";

import { useBranch } from "@/contexts/branch-context";
import { goToWhatsApp } from "@/lib/gtag";
import { MENSAJE_GENERICO, mensajeAvisameApertura, mensajeSegunPagina, waHref } from "@/lib/whatsapp";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";

/**
 * Barra fija de contacto en celular: WhatsApp, Cómo llegar y Llamar siempre a
 * un toque, en vez de un botón flotante que tapa contenido. En escritorio no
 * se muestra (ahí siguen los flotantes).
 *
 * Con una sucursal que todavía no abrió, "Cómo llegar" no sirve: en su lugar
 * va "Avisame", que deja el pedido por WhatsApp para avisarle el día de la
 * apertura.
 *
 * Los clics se miden igual que en el resto del sitio: WhatsApp por
 * goToWhatsApp, y Maps y tel: por el listener global de GoogleAdsTag.
 */
export function MobileContactBar() {
  const { selectedBranch: branch } = useBranch();
  const tel = `tel:${branch.phone.replace(/[^\d+]/g, "")}`;

  function whatsapp(e: React.MouseEvent<HTMLAnchorElement>, texto: string) {
    e.preventDefault();
    goToWhatsApp(waHref(branch.whatsapp, texto));
  }

  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-black uppercase tracking-wide";

  return (
    <>
      {/* Reserva el alto de la barra para que no tape el final del footer. */}
      <div aria-hidden className="h-16 sm:hidden" />
      <nav
        aria-label="Contacto rápido"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:hidden"
      >
        <a
          href={waHref(branch.whatsapp, MENSAJE_GENERICO)}
          onClick={(e) => whatsapp(e, mensajeSegunPagina())}
          className={`${item} bg-[#25D366] text-white`}
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
        {branch.apertura ? (
          <a
            href={waHref(branch.whatsapp, mensajeAvisameApertura(branch.shortName))}
            onClick={(e) => whatsapp(e, mensajeAvisameApertura(branch.shortName))}
            className={`${item} bg-navy-900 text-white`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Avisame
          </a>
        ) : (
          <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className={`${item} bg-navy-900 text-white`}>
            <DirectionsIcon className="h-6 w-6" />
            Cómo llegar
          </a>
        )}
        <a href={tel} className={`${item} bg-white text-navy-900`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Llamar
        </a>
      </nav>
    </>
  );
}
