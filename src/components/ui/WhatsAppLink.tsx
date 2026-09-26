"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { goToWhatsApp } from "@/lib/gtag";

/** <a> a wa.me que reporta la conversión de Google Ads antes de abrir el
    chat. Reemplazo directo de un <a href="https://wa.me/..." target="_blank"
    rel="noopener noreferrer">: mismo comportamiento visual, sólo cambia qué
    pasa al hacer click. */
export function WhatsAppLink({
  href,
  onClick,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onClick?.(e);
    goToWhatsApp(href);
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
