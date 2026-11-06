"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link";
import type { Branch } from "@/lib/config";
import { useBranch } from "@/contexts/branch-context";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { BranchStatusBadge } from "./[id]/BranchStatusBadge";
import { DirectionsButton } from "./[id]/DirectionsButton";

export type SucursalItem = {
  branch: Branch;
  /** Precio del neumático más barato con stock (null si no hay datos). */
  desde: number | null;
  /** Precio del combo de alineado + balanceo para auto (null si no hay datos). */
  combo: number | null;
  /** Nombre del servicio de taller como se dice en la zona. */
  taller: string;
  /** Localidades que atiende, ya listas para mostrar. */
  zonas: string[];
};

const peso = (n: number) => `$${n.toLocaleString("es-AR")}`;

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function distanciaTexto(d: number) {
  if (d < 1) return "a menos de 1 km";
  if (d < 100) return `a ${Math.round(d)} km`;
  return `a ${Math.round(d / 10) * 10} km`;
}

function Tarjeta({
  item,
  destacada,
  esTuya,
  distancia,
}: {
  item: SucursalItem;
  destacada: boolean;
  esTuya: boolean;
  distancia: number | null;
}) {
  const { branch } = item;
  const abierta = !branch.apertura;
  const lugar = branch.neighborhood ?? branch.city;
  const tel = `tel:${branch.phone.replace(/[^\d+]/g, "")}`;
  const wa = `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
    `¡Hola! Te escribo desde la web, sucursal ${branch.shortName}. Quería hacer una consulta.`
  )}`;

  return (
    <article
      id={`sucursal-${branch.id}`}
      className={`flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow ${
        destacada ? "border-[#ff1e00] shadow-lg shadow-[#ff1e00]/10" : "border-slate-200"
      }`}
    >
      {branch.facadePhoto ? (
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={branch.facadePhoto}
            alt={`Fachada del local de Neumáticos Trivium ${branch.shortName}, ${branch.address}, ${branch.city}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-700">
          <div className="text-center">
            <Image src="/icon.svg" alt="" width={44} height={44} className="mx-auto h-11 w-11 object-contain opacity-90" />
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-orange-400">Próxima apertura</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          {esTuya && (
            <span className="rounded-full bg-[#ff1e00]/10 px-2.5 py-0.5 text-xs font-black text-[#cc1800]">Tu sucursal</span>
          )}
          {distancia !== null && (
            <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">
              {distanciaTexto(distancia)}
            </span>
          )}
        </div>

        <h2 className="mt-2 text-xl font-black leading-tight text-navy-900">
          <Link href={`/sucursales/${branch.id}`} className="hover:text-[#ff1e00]">
            Gomería y neumáticos en {lugar}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {branch.address}, {branch.city}
          {branch.province !== branch.city ? `, ${branch.province}` : ""}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {abierta ? (
            <BranchStatusBadge branch={branch} />
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Abrimos {branch.apertura}
            </span>
          )}
          {abierta && branch.googleRating && !branch.provisorio && (
            <GoogleRatingBadge branchId={branch.id} className="text-sm text-slate-700" />
          )}
        </div>

        {abierta ? (
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 font-bold text-slate-400">Horario</dt>
              <dd className="text-slate-700">{branch.hours}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 font-bold text-slate-400">Teléfono</dt>
              <dd>
                <a href={tel} className="font-semibold text-slate-700 hover:text-[#ff1e00]">
                  {branch.phone}
                </a>
              </dd>
            </div>
            {item.combo !== null && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-bold text-slate-400">{item.taller.split(" ")[0]}</dt>
                <dd className="text-slate-700">
                  Combo {item.taller.toLowerCase()} desde <strong>{peso(item.combo)}</strong>
                </dd>
              </div>
            )}
            {item.desde !== null && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-bold text-slate-400">Neumáticos</dt>
                <dd className="text-slate-700">
                  Nuevos desde <strong>{peso(item.desde)}</strong>
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Neumáticos nuevos con stock propio y taller en {branch.address}. Todavía no atendemos acá: abrimos {branch.apertura}.
            Mientras tanto, usá la sucursal abierta que te quede más cerca.
          </p>
        )}

        {abierta && (
          <ul className="mt-4 flex flex-wrap gap-1.5 text-xs font-bold text-navy-800">
            {["Sin turno", "Colocación sin cargo", "1 año de garantía"].map((t) => (
              <li key={t} className="rounded-full bg-slate-100 px-2.5 py-1">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          {abierta && (
            <WhatsAppLink
              href={wa}
              className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 text-sm font-black text-white shadow-sm shadow-[#25d366]/20 transition-colors hover:bg-[#1fbd59]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Escribir por WhatsApp
            </WhatsAppLink>
          )}
          <DirectionsButton
            lat={branch.coordinates.lat}
            lng={branch.coordinates.lng}
            label={`Neumáticos Trivium ${branch.shortName}`}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-navy-900 transition-colors hover:border-[#ff1e00] hover:text-[#cc1800]"
          >
            <DirectionsIcon className="h-5 w-5 text-[#ff1e00]" />
            Cómo llegar
          </DirectionsButton>
          <Link
            href={`/sucursales/${branch.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-3 text-sm font-black text-white transition-colors hover:bg-zinc-800"
          >
            Ver sucursal
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Las sucursales como tarjetas, antes que el mapa: lo que la gente viene a
 * buscar es la dirección, el horario y el botón de cómo llegar, no explorar un
 * mapa. "Sucursal más cercana" ordena por distancia real y la marca.
 */
export function ListaSucursales({ items }: { items: SucursalItem[] }) {
  const { selectedBranch, hasConfirmedBranch } = useBranch();
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [estado, setEstado] = useState<"idle" | "buscando" | "listo" | "error">("idle");

  const ordenadas = useMemo(() => {
    const conDistancia = items.map((item) => ({
      item,
      d: ubicacion ? km(ubicacion, item.branch.coordinates) : null,
    }));
    return conDistancia.sort((a, b) => {
      // Las que ya atienden van antes que las que todavía no abrieron.
      const pa = a.item.branch.apertura ? 1 : 0;
      const pb = b.item.branch.apertura ? 1 : 0;
      if (ubicacion) {
        // Con ubicación: la más cercana que ya abrió primero; las próximas después, por cercanía.
        if (pa !== pb) return pa - pb;
        return (a.d ?? 0) - (b.d ?? 0);
      }
      if (pa !== pb) return pa - pb;
      if (hasConfirmedBranch) {
        if (a.item.branch.id === selectedBranch.id) return -1;
        if (b.item.branch.id === selectedBranch.id) return 1;
      }
      return 0;
    });
  }, [items, ubicacion, hasConfirmedBranch, selectedBranch.id]);

  const destacadaId = ordenadas[0]?.item.branch.id;

  function ubicar() {
    if (!navigator.geolocation) {
      setEstado("error");
      return;
    }
    setEstado("buscando");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setUbicacion({ lat: p.coords.latitude, lng: p.coords.longitude });
        setEstado("listo");
        requestAnimationFrame(() => document.getElementById("lista-sucursales")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      },
      () => setEstado("error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  return (
    <section id="lista-sucursales" className="scroll-mt-20">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {ubicacion ? "Ordenadas por distancia desde tu ubicación." : "Elegí la que te queda más cómoda."}
        </p>
        <button
          type="button"
          onClick={ubicar}
          disabled={estado === "buscando"}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff1e00] px-4 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#cc1800] disabled:cursor-wait disabled:opacity-80"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
          {estado === "buscando" ? "Buscando…" : "Usar mi ubicación"}
        </button>
      </div>
      {estado === "error" && (
        <p role="status" className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
          No pudimos obtener tu ubicación. Elegí la sucursal de la lista.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ordenadas.map(({ item, d }) => (
          <Tarjeta
            key={item.branch.id}
            item={item}
            destacada={!!ubicacion && item.branch.id === destacadaId}
            esTuya={hasConfirmedBranch && item.branch.id === selectedBranch.id}
            distancia={d}
          />
        ))}
      </div>
    </section>
  );
}
