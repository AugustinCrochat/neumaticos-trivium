import ReactDOM from "react-dom";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { BRANCHES } from "@/lib/config";
import { HeroTrustRow } from "@/components/home/HeroTrustRow";
import { HeroEtiqueta, HeroTexto } from "@/components/home/HeroCopy";
import type { TireProduct } from "@/lib/types";

export function HeroSection({ productos }: { productos: TireProduct[] }) {
  const foto = BRANCHES[0].facadePhoto;
  // La foto de fondo es el LCP de la portada: en celular bajaba el archivo de
  // escritorio (207 KB, 1445 px) para pintarlo a 412 px. Se sirven tres
  // tamaños y el navegador elige; se precarga con prioridad alta.
  const fotoBase = foto?.replace(/\.webp$/, "");
  const fotoSrcSet = fotoBase ? `${fotoBase}-640.webp 640w, ${fotoBase}-1024.webp 1024w, ${foto} 1445w` : undefined;
  if (foto && fotoSrcSet) {
    ReactDOM.preload(foto, { as: "image", imageSrcSet: fotoSrcSet, imageSizes: "100vw", fetchPriority: "high" });
  }

  return (
    <section id="hero" className="relative overflow-hidden bg-navy-950">
      {/* Foto real del local de fondo, muy tenue: da contexto de negocio físico
          sin competir con el título ni con el buscador. */}
      {foto && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={foto}
            srcSet={fotoSrcSet}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10" />
        </>
      )}
      <div className="relative max-w-7xl 2xl:max-w-[96rem] mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-0 min-h-[480px]">

          {/* Left: copy */}
          <div className="flex flex-col justify-center pt-10 pb-5 md:py-20 pr-0 md:pr-12">
            <HeroEtiqueta />
            <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
              El outlet del{" "}
              <span className="text-orange-500">neumático</span>
            </h1>
            <HeroTexto />
            <HeroTrustRow productos={productos} />
          </div>

          {/* Right: search */}
          <div className="flex flex-col justify-center pt-0 pb-8 md:py-20">
            <SizeOrVehicleSearch />
          </div>

        </div>
      </div>
    </section>
  );
}
