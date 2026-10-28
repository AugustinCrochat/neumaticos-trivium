"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Branch } from "@/lib/config";

// maplibre-gl pesa ~270 KB comprimido y arrastraba a todas las páginas que
// incluyen el mapa (contacto, cada sucursal) aunque el mapa quede abajo del
// todo. Se baja recién cuando el recuadro está por entrar en pantalla.
const BranchMiniMap = dynamic(() => import("./BranchMiniMap").then((m) => m.BranchMiniMap), { ssr: false });

export function LazyBranchMiniMap({ branch }: { branch: Branch }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (visible) return <BranchMiniMap branch={branch} />;
  // Mismo tamaño que el mapa, para que la página no salte al cargarlo.
  return <div ref={ref} className="h-[420px] w-full rounded-2xl border border-slate-200 bg-slate-200 shadow-sm md:h-[560px] lg:h-[640px]" />;
}
