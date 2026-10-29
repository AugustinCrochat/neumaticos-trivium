"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SITE_URL, type Branch } from "@/lib/config";
import { useBranch } from "@/contexts/branch-context";
import { toolPath } from "@/lib/tools";

const CamaraNeumaticoModal = dynamic(() => import("./CamaraNeumaticoModal"), { ssr: false });

/**
 * Bloque "¿No sabés qué medida lleva tu neumático? Mandanos una foto". Abre la
 * cámara con un círculo guía (o la galería) y manda la foto por WhatsApp a la
 * sucursal elegida; si todavía no hay sucursal elegida, la pide antes. En
 * escritorio ofrece un QR para seguir desde el celular. Va donde haya medidas.
 */
export function FotoNeumaticoBloque({ className = "", titulo = "¿No sabés qué medida lleva tu neumático?" }: { className?: string; titulo?: string }) {
  const { hasConfirmedBranch, selectedBranch, openModalForAction } = useBranch();
  const [destino, setDestino] = useState<Branch | null>(null);
  const [camara, setCamara] = useState(false);
  const [qr, setQr] = useState(false);
  const [foto, setFoto] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Con sucursal elegida sigue directo; si no, abre el selector y continúa con la que se elija.
  function conSucursal(seguir: (b: Branch) => void) {
    if (hasConfirmedBranch) seguir(selectedBranch);
    else openModalForAction(seguir);
  }

  const esEscritorio = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function sacarFoto() {
    conSucursal((b) => {
      setDestino(b);
      setFoto(null);
      if (esEscritorio()) setQr(true);
      else setCamara(true);
    });
  }

  function elegirArchivo(f: File) {
    conSucursal((b) => {
      setDestino(b);
      setFoto(f);
      setQr(false);
      setCamara(true);
    });
  }

  return (
    <section className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-navy-900">{titulo}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Sacale una foto al flanco y mandanosla por WhatsApp: te decimos qué medida lleva y qué tenemos en stock. La foto sale de tu dispositivo y no se guarda en el sitio.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <button
            type="button"
            onClick={sacarFoto}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h1.5l1-2h9l1 2H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3.5" strokeWidth={2} />
            </svg>
            Sacar foto del neumático
          </button>
          <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-bold text-emerald-800 underline underline-offset-4">
            Elegir una foto de la galería
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) elegirArchivo(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {qr && destino && (
        <QrCelular
          sucursal={destino}
          onCamaraCompu={() => {
            setQr(false);
            setCamara(true);
          }}
          onArchivo={() => inputRef.current?.click()}
          onClose={() => setQr(false)}
        />
      )}
      {camara && destino && (
        <CamaraNeumaticoModal whatsapp={destino.whatsapp} sucursal={destino.shortName} fotoInicial={foto} onClose={() => setCamara(false)} />
      )}
    </section>
  );
}

/** En escritorio: un QR para seguir desde el celular, que tiene cámara, flash y WhatsApp. */
function QrCelular({ sucursal, onCamaraCompu, onArchivo, onClose }: { sucursal: Branch; onCamaraCompu: () => void; onArchivo: () => void; onClose: () => void }) {
  const [imagen, setImagen] = useState<string | null>(null);
  const url = `${SITE_URL}${toolPath("foto-del-neumatico")}?sucursal=${sucursal.id}`;

  useEffect(() => {
    let cancelado = false;
    import("qrcode")
      .then((m) => m.toDataURL(url, { margin: 1, width: 240, errorCorrectionLevel: "M" }))
      .then((d) => !cancelado && setImagen(d))
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, [url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Abrir en el celular" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-black text-navy-900">Seguí desde tu celular</h3>
        <p className="mt-1 text-sm text-slate-600">Escaneá el código con la cámara del teléfono: ahí la foto sale mejor, con flash, y se manda directo por WhatsApp.</p>
        <div className="mx-auto mt-4 flex h-60 w-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {imagen ? <img src={imagen} alt="Código QR para abrir la herramienta en el celular" width={240} height={240} /> : <span className="text-sm text-slate-400">Generando…</span>}
        </div>
        <p className="mt-3 text-xs text-slate-500">Se abre con la sucursal {sucursal.shortName}.</p>
        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={onCamaraCompu} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-black text-navy-900 hover:border-slate-500">
            Usar la cámara de esta computadora
          </button>
          <button type="button" onClick={onArchivo} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-black text-navy-900 hover:border-slate-500">
            Elegir una foto de esta computadora
          </button>
          <button type="button" onClick={onClose} className="mt-1 text-sm font-bold text-slate-500 underline underline-offset-4">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
