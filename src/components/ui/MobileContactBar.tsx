"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useBranch } from "@/contexts/branch-context";
import { goToWhatsApp } from "@/lib/gtag";
import { MENSAJE_GENERICO, mensajeAvisameApertura, mensajeSegunPagina, waHref } from "@/lib/whatsapp";
import { getBranchStatus, type BranchStatus } from "@/lib/branch-status";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";

/**
 * Barra fija de contacto en celular. Un solo color de marca (rojo Trivium) sobre
 * fondo oscuro: WhatsApp ocupa más de la mitad, con un texto de acción según la
 * página y el estado del local abajo (abierto / cierra / abre); Cómo llegar y
 * Llamar son botones de ícono. Se esconde al bajar y vuelve al subir. En
 * escritorio no se muestra (ahí siguen los flotantes).
 *
 * Con una sucursal que todavía no abrió, WhatsApp pasa a "Avisame cuando abra"
 * y Cómo llegar no se ofrece.
 *
 * Sin sucursal elegida, los contactos no tienen a quién apuntar: toda la barra
 * es un solo botón que abre el selector de sucursal.
 *
 * Los clics se miden igual que en el resto del sitio: WhatsApp por
 * goToWhatsApp, y Maps y tel: por el listener global de GoogleAdsTag.
 */

/** Texto del botón de WhatsApp según la página. */
function accionSegunRuta(ruta: string): string {
  if (ruta.startsWith("/productos/")) return "Consultar este neumático";
  if (ruta.startsWith("/servicios")) return "Cotizar mi servicio";
  if (ruta.startsWith("/neumaticos/") || ruta.startsWith("/buscar") || ruta.startsWith("/catalogo")) return "Consultar precio y stock";
  if (ruta.startsWith("/ofertas")) return "Consultar esta oferta";
  if (ruta.startsWith("/blog") || ruta.startsWith("/herramientas")) return "Preguntanos por WhatsApp";
  return "Pedí tu precio";
}

/** Se esconde al bajar y reaparece al subir (o cerca del tope / del final). */
function useBarraVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let ultimo = window.scrollY;
    const alScroll = () => {
      const y = window.scrollY;
      const dy = y - ultimo;
      const alFinal = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (y < 80 || alFinal || dy < -8) setVisible(true);
      else if (dy > 8) setVisible(false);
      if (Math.abs(dy) > 8) ultimo = y;
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);
  // Los flotantes (buscador) leen este atributo para bajar a la esquina cuando la barra se esconde.
  useEffect(() => {
    document.documentElement.dataset.barra = visible ? "visible" : "oculta";
    return () => {
      delete document.documentElement.dataset.barra;
    };
  }, [visible]);
  return visible;
}

export function MobileContactBar() {
  const { selectedBranch: branch, hasConfirmedBranch, openModal } = useBranch();
  const ruta = usePathname() ?? "/";
  const visible = useBarraVisible();
  // La hora real se calcula en el cliente: el sitio es estático.
  const [estado, setEstado] = useState<BranchStatus | null>(null);
  useEffect(() => {
    const actualizar = () => setEstado(getBranchStatus(branch, new Date()));
    actualizar();
    const t = setInterval(actualizar, 60_000);
    return () => clearInterval(t);
  }, [branch]);

  const tel = `tel:${branch.phone.replace(/[^\d+]/g, "")}`;

  function whatsapp(e: React.MouseEvent<HTMLAnchorElement>, texto: string) {
    e.preventDefault();
    goToWhatsApp(waHref(branch.whatsapp, texto));
  }

  const caja = `fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950 shadow-[0_-4px_16px_rgba(0,0,0,0.25)] transition-transform duration-200 motion-reduce:transition-none sm:hidden ${
    visible ? "translate-y-0" : "translate-y-full"
  }`;

  if (!hasConfirmedBranch) {
    return (
      <>
        <div aria-hidden className="h-14 sm:hidden" />
        <nav aria-label="Contacto rápido" className={`${caja} pb-[env(safe-area-inset-bottom)]`}>
          <button
            type="button"
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 bg-[#ff1e00] py-3 text-sm font-black uppercase tracking-wide text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Elegí tu sucursal
          </button>
        </nav>
      </>
    );
  }

  const abre = Boolean(branch.apertura);
  const accion = abre ? "Avisame cuando abra" : accionSegunRuta(ruta);
  const mensajeBase = abre ? mensajeAvisameApertura(branch.shortName) : MENSAJE_GENERICO;
  // "Cierra 19:00" → "hasta 19" (la hora sin ":00" si es en punto).
  const detalle = estado?.detail.replace(/^Cierra (\d{1,2}):00$/, "hasta $1").replace(/^Cierra /, "hasta ") ?? "";
  // Abierto: "Abierto hasta 19". Cerrado: "Cerrado, abre mañana 9:00".
  const textoEstado = !estado
    ? ""
    : abre || !estado.detail
      ? estado.label
      : estado.isOpen
        ? `Abierto ${detalle}`
        : `${estado.label}, ${detalle.charAt(0).toLowerCase()}${detalle.slice(1)}`;
  const abiertoAhora = Boolean(estado?.isOpen) && !abre;
  const lateral = "flex w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white active:bg-white/20";

  return (
    <>
      {/* Reserva el alto de la barra para que no tape el final del footer. */}
      <div aria-hidden className="h-14 sm:hidden" />
      <nav aria-label="Contacto rápido" className={`${caja} flex items-stretch gap-2 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]`}>
        <a
          href={waHref(branch.whatsapp, mensajeBase)}
          onClick={(e) => whatsapp(e, abre ? mensajeBase : mensajeSegunPagina())}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg bg-[#ff1e00] px-3 py-1.5 text-white active:bg-[#d91a00]"
        >
          <svg className="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[13px] font-black">{accion}</span>
            {textoEstado && (
              <span className="flex items-center gap-1 text-[10px] font-semibold leading-none text-white/85">
                {abiertoAhora && <span aria-hidden className="h-1.5 w-1.5 shrink-0 -translate-y-[1px] rounded-full bg-emerald-400" />}
                <span className="truncate">{textoEstado}</span>
              </span>
            )}
          </span>
        </a>
        {!abre && (
          <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Cómo llegar" className={lateral}>
            <DirectionsIcon className="h-5 w-5" />
          </a>
        )}
        <a href={tel} aria-label="Llamar" className={lateral}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </nav>
    </>
  );
}
