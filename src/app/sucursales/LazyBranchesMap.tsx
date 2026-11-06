"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Branch } from "@/lib/config";

// maplibre-gl pesa ~270 KB comprimido: el mapa ya no es lo primero de la
// página, así que se baja recién cuando está por entrar en pantalla.
const BranchesMap = dynamic(() => import("./BranchesMap").then((m) => m.BranchesMap), { ssr: false });

export function LazyBranchesMap({ branches }: { branches: Branch[] }) {
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
      { rootMargin: "500px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (visible) return <BranchesMap branches={branches} conLista={false} />;
  return (
    <div ref={ref} className="mx-auto max-w-7xl px-4 py-8 2xl:max-w-[96rem]">
      <div className="h-[54vh] min-h-[360px] w-full rounded-2xl border border-slate-200 bg-slate-200 md:h-[720px]" />
    </div>
  );
}
