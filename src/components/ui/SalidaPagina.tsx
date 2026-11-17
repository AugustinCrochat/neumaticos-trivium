"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { useBranch } from "@/contexts/branch-context";
import { mensajeSegunPagina, waHref } from "@/lib/whatsapp";

/**
 * Qué pasa cuando alguien se va de la página, sin pop-ups que tapen nada:
 *
 * 1. Título de la pestaña: al cambiar de pestaña pasa de "Neumáticos Trivium"
 *    a un recordatorio de lo que se estaba mirando; al volver se restaura.
 *    Vale en escritorio y celular.
 * 2. Tarjeta chica abajo a la derecha, sólo en escritorio, cuando el mouse
 *    sube hacia la barra de pestañas: una vez por visita, y sólo en fichas de
 *    producto y buscadores (donde hay intención de compra). Ofrece el
 *    WhatsApp con la consulta ya escrita; no promete nada que no sea cierto.
 */
const CON_TARJETA = /^\/(productos|buscar|buscador|cotizador|neumaticos)(\/|$)/;
const CLAVE = "salida-pagina-mostrada";

// Mensajes que rotan en la pestaña mientras la persona está en otra. Todo es
// cierto en el sitio: precio publicado, servicio sin cargo, nombre y lema. Sólo
// se nombra lo que se miraba si es una medida de neumático (repetir el H1 de
// cualquier página daba cosas como "Tu Gomería y taller propio sigue acá"); el
// precio, si está en la descripción de la ficha.
const MEDIDA = /\d{3}\/\d{2}\s*R\d{2}/i;
const PRECIO = /\$\s?\d{1,3}(?:\.\d{3})+/;

function mensajes(h1: string | undefined): string[] {
  const medida = h1?.replace(/\s+/g, " ").match(MEDIDA)?.[0]?.toUpperCase();
  const descripcion = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
  const precio = descripcion.match(PRECIO)?.[0];
  const pagina = medida ? (precio ? `${medida} a ${precio}` : `Tu ${medida} sigue acá`) : "Precios y stock publicados";
  // Lo de la página va una de cada dos; entre medio rotan servicio, outlet y nombre.
  const resto = ["Colocación y válvulas sin cargo", "El outlet del neumático", "Neumáticos Trivium"];
  return resto.flatMap((m) => [pagina, m]);
}

const CADA_MS = 2000;
const MAX_MS = 60000;

export function SalidaPagina() {
  const pathname = usePathname();
  const { selectedBranch: b } = useBranch();
  const [abierta, setAbierta] = useState<{ href: string; pathname: string } | null>(null);
  const original = useRef<string | null>(null);

  // 1. Título de la pestaña: rota cada 2 s mientras está oculta y se queda en el
  // nombre del sitio a los 60 s, para no insistir sin fin.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    const parar = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const alCambiar = () => {
      parar();
      if (document.hidden) {
        original.current = document.title;
        const lista = mensajes(document.querySelector("main h1")?.textContent ?? undefined);
        let i = 0;
        document.title = `${lista[0]} | Trivium`;
        const desde = Date.now();
        timer = setInterval(() => {
          if (Date.now() - desde >= MAX_MS) {
            document.title = "Neumáticos Trivium";
            parar();
            return;
          }
          i = (i + 1) % lista.length;
          document.title = lista[i] === "Neumáticos Trivium" ? lista[i] : `${lista[i]} | Trivium`;
        }, CADA_MS);
      } else if (original.current !== null) {
        document.title = original.current;
        original.current = null;
      }
    };
    document.addEventListener("visibilitychange", alCambiar);
    return () => {
      parar();
      document.removeEventListener("visibilitychange", alCambiar);
      if (original.current !== null) document.title = original.current;
    };
  }, []);

  // 2. Tarjeta al sacar el mouse por arriba.
  useEffect(() => {
    // Al cambiar de página la tarjeta abierta se cierra desde el handler, no acá.
    if (!CON_TARJETA.test(pathname)) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    try {
      if (sessionStorage.getItem(CLAVE)) return;
    } catch {}
    const desde = Date.now();
    const alSalir = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 0 || Date.now() - desde < 6000) return;
      try {
        sessionStorage.setItem(CLAVE, "1");
      } catch {}
      setAbierta({ href: waHref(b.whatsapp, mensajeSegunPagina()), pathname });
      document.removeEventListener("mouseout", alSalir);
    };
    document.addEventListener("mouseout", alSalir);
    return () => document.removeEventListener("mouseout", alSalir);
  }, [pathname, b.whatsapp]);

  if (!abierta || abierta.pathname !== pathname) return null;
  const href = abierta.href;
  return (
    <div role="dialog" aria-label="¿Te ayudamos?" className="fixed bottom-6 right-6 z-[60] hidden w-80 border-2 border-black bg-white p-4 shadow-[6px_6px_0_0_#ff1e00] md:block">
      <button type="button" onClick={() => setAbierta(null)} aria-label="Cerrar" className="absolute right-2 top-1 text-2xl leading-none text-slate-500 hover:text-black">
        ×
      </button>
      <p className="font-display text-xl font-extrabold uppercase italic leading-tight text-black">¿No encontraste tu medida?</p>
      <p className="mt-1 text-sm text-slate-600">Escribinos y te decimos precio y stock al momento. Colocación y válvulas sin cargo en el local.</p>
      <WhatsAppLink
        href={href}
        onClick={() => setAbierta(null)}
        className="mt-3 flex items-center justify-center bg-[#25d366] px-4 py-2.5 text-sm font-black text-black !no-underline hover:brightness-95"
      >
        Consultar por WhatsApp
      </WhatsAppLink>
    </div>
  );
}
