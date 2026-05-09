"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Branch } from "@/lib/config";

type BranchesMapProps = {
  branches: Branch[];
};

function cleanPhone(phone: string) {
  return phone.replace(/\s/g, "");
}

export function BranchesMap({ branches }: BranchesMapProps) {
  const [activeBranchId, setActiveBranchId] = useState(branches[0]?.id ?? "");

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === activeBranchId) ?? branches[0],
    [activeBranchId, branches]
  );

  if (!activeBranch) return null;

  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] gap-6 lg:gap-8 items-stretch">
          <div className="relative min-h-[420px] md:min-h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-[#edf4f8] shadow-xl shadow-slate-200/80">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,36,68,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(15,36,68,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_30%,rgba(255,255,255,0.92),rgba(255,255,255,0.25)_38%,rgba(220,234,248,0.1)_65%)]" />

            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 900 620"
              preserveAspectRatio="none"
            >
              <path
                d="M-40 410 C115 335 215 342 340 278 C498 197 570 230 725 153 C810 111 880 88 940 68"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="56"
                strokeLinecap="round"
              />
              <path
                d="M-40 410 C115 335 215 342 340 278 C498 197 570 230 725 153 C810 111 880 88 940 68"
                fill="none"
                stroke="#ffffff"
                strokeWidth="42"
                strokeLinecap="round"
              />
              <path
                d="M-40 410 C115 335 215 342 340 278 C498 197 570 230 725 153 C810 111 880 88 940 68"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray="18 18"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M72 552 C168 459 270 430 376 360 C482 290 530 194 645 126 C706 90 776 68 846 50"
                fill="none"
                stroke="#dceaf8"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M68 116 C158 186 243 208 344 176 C453 141 555 76 652 86"
                fill="none"
                stroke="#dceaf8"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>

            <div className="absolute left-5 top-5 z-10 rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                Sucursales
              </p>
              <p className="text-sm font-black text-navy-900">
                Buenos Aires y Cordoba
              </p>
            </div>

            {branches.map((branch) => {
              const isActive = branch.id === activeBranch.id;

              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setActiveBranchId(branch.id)}
                  className="group absolute z-20 -translate-x-1/2 -translate-y-full outline-none"
                  style={{
                    left: `${branch.mapPosition.x}%`,
                    top: `${branch.mapPosition.y}%`,
                  }}
                  aria-label={`Ver sucursal ${branch.shortName}`}
                >
                  <span
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white shadow-2xl transition-all duration-200 group-hover:-translate-y-1 group-focus-visible:ring-4 group-focus-visible:ring-orange-500/30 ${
                      isActive
                        ? "border-orange-500 shadow-orange-500/30"
                        : "border-white shadow-navy-900/20"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 rounded-full ${
                        isActive ? "animate-ping bg-orange-500/20" : ""
                      }`}
                    />
                    <Image
                      src="/icon.svg"
                      alt=""
                      width={42}
                      height={42}
                      className="relative h-10 w-10 object-contain"
                    />
                  </span>
                  <span
                    className={`mx-auto block h-5 w-5 -translate-y-2 rotate-45 border-b-4 border-r-4 bg-white transition-colors ${
                      isActive ? "border-orange-500" : "border-white"
                    }`}
                  />
                  <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    {branch.shortName}
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-5 left-5 right-5 z-10 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur md:left-auto md:w-[360px]">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Sucursal seleccionada
              </p>
              <h2 className="mt-1 text-xl font-black text-navy-900">
                {activeBranch.name}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {activeBranch.address}, {activeBranch.city}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={activeBranch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                >
                  Como llegar
                </a>
                <a
                  href={`https://wa.me/${activeBranch.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#25d366]/15 px-4 py-2 text-sm font-bold text-[#1f9f4b] transition-colors hover:bg-[#25d366]/25"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {branches.map((branch) => {
              const isActive = branch.id === activeBranch.id;

              return (
                <article
                  key={branch.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
                    isActive
                      ? "border-orange-500 shadow-xl shadow-orange-500/10"
                      : "border-slate-200 hover:border-navy-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveBranchId(branch.id)}
                    className="flex w-full items-start gap-4 text-left"
                  >
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50">
                      <Image
                        src="/icon.svg"
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-black text-navy-900">
                        {branch.name}
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        {branch.address}
                      </span>
                      <span className="block text-sm text-slate-600">
                        {branch.city}
                      </span>
                    </span>
                  </button>

                  <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Horarios
                      </dt>
                      <dd className="mt-0.5 text-slate-700">{branch.hours}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Telefono
                      </dt>
                      <dd className="mt-0.5 text-slate-700">{branch.phone}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={`tel:${cleanPhone(branch.phone)}`}
                      className="rounded-lg bg-navy-100 px-3 py-2 text-xs font-bold text-navy-900 transition-colors hover:bg-navy-200"
                    >
                      Llamar
                    </a>
                    <a
                      href={`https://wa.me/${branch.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#25d366]/15 px-3 py-2 text-xs font-bold text-[#1f9f4b] transition-colors hover:bg-[#25d366]/25"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-orange-100 px-3 py-2 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-200"
                    >
                      Ver mapa
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
