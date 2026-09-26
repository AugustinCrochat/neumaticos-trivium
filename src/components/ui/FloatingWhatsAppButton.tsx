"use client";

import { usePathname } from "next/navigation";
import { useBranch } from "@/contexts/branch-context";

// Las fichas de producto y de accesorio ya traen su propio CTA de WhatsApp
// contextual (con el nombre del producto en el mensaje) — mostrar además el
// flotante ahí sería un botón repetido pisando al que ya hace ese trabajo
// mejor. Se muestra en el resto del sitio: home, listados, medida, rodado,
// categorías, blog, etc.
const OCULTAR_EN = [/^\/productos\//, /^\/tuercas-antirrobo\/./];

export function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const { selectedBranch } = useBranch();

  if (OCULTAR_EN.some((re) => re.test(pathname))) return null;

  const waText = encodeURIComponent("Hola! Estoy mirando la web y quería hacer una consulta");

  return (
    <a
      href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Consultar por WhatsApp a ${selectedBranch.shortName}`}
      className="fixed bottom-24 right-5 z-40 sm:bottom-28 sm:right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-navy-900/30 transition-transform hover:scale-105 active:scale-95"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" aria-hidden>
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.66 4.53 1.804 6.393L4 29l7.86-1.76A11.94 11.94 0 0016.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm6.994 16.91c-.297.837-1.47 1.542-2.412 1.74-.642.135-1.48.243-4.302-.923-3.612-1.494-5.94-5.155-6.12-5.394-.18-.24-1.464-1.947-1.464-3.714 0-1.767.927-2.634 1.256-2.994.328-.36.717-.45.956-.45.24 0 .478.003.687.014.22.011.516-.083.807.616.297.716 1.01 2.474 1.098 2.655.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.378.468-.54.63-.18.18-.368.375-.158.735.21.36.936 1.545 2.01 2.502 1.382 1.233 2.548 1.615 2.908 1.795.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.088.984 2.446 1.164.36.18.6.27.687.42.09.15.09.87-.207 1.707z" />
      </svg>
    </a>
  );
}
