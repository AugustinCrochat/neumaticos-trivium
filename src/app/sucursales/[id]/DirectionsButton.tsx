"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  lat: number;
  lng: number;
  label: string;
  className?: string;
  children: ReactNode;
};

/**
 * Boton "Como llegar" que deja que el telefono abra su app de mapas por defecto.
 * - iOS: Apple Maps (app de mapas por defecto del sistema).
 * - Android: esquema geo: -> el sistema abre su app de mapas / muestra el selector.
 * - Escritorio (fallback SSR): Google Maps en el navegador.
 */
export function DirectionsButton({ lat, lng, label, className, children }: Props) {
  const webHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const [href, setHref] = useState(webHref);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      setHref(`https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`);
    } else if (/Android/i.test(ua)) {
      setHref(`geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`);
    }
  }, [lat, lng, label]);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
