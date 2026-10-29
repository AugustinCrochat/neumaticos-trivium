"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  whatsapp: string;
  /** Una foto elegida de la galería o hecha con la cámara nativa: salta directo a la vista previa. */
  fotoInicial?: Blob | null;
  onClose: () => void;
};

type Estado = "iniciando" | "camara" | "sin-camara" | "foto";

const MENSAJE = "¡Hola! Te mando la foto del flanco de mi neumático desde la web de Neumáticos Trivium. ¿Qué medida lleva?";

/**
 * Cámara a pantalla completa con un círculo guía para encuadrar el flanco del
 * neumático, flash (donde el navegador lo permite) y envío por WhatsApp.
 *
 * La foto no se sube a ningún servidor nuestro: se recorta en el teléfono y se
 * comparte desde ahí con el menú de compartir del sistema (donde se elige
 * WhatsApp y el chat). Los navegadores no pueden adjuntar un archivo a un chat
 * de WhatsApp por enlace, así que sin menú de compartir se descarga la foto y se
 * abre el chat para adjuntarla.
 */
export default function CamaraNeumaticoModal({ whatsapp, fotoInicial = null, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const circuloRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [estado, setEstado] = useState<Estado>(fotoInicial ? "foto" : "iniciando");
  const [flash, setFlash] = useState(false);
  const [flashDisponible, setFlashDisponible] = useState(false);
  const [foto, setFotoBlob] = useState<Blob | null>(fotoInicial);
  const [fotoUrl, setFotoUrl] = useState<string | null>(() => (fotoInicial ? URL.createObjectURL(fotoInicial) : null));
  const fotoUrlRef = useRef<string | null>(fotoUrl);

  // La URL de la vista previa se crea y se libera junto con la foto, desde los
  // manejadores (no desde un efecto).
  const guardarFoto = useCallback((blob: Blob | null) => {
    if (fotoUrlRef.current) URL.revokeObjectURL(fotoUrlRef.current);
    const url = blob ? URL.createObjectURL(blob) : null;
    fotoUrlRef.current = url;
    setFotoBlob(blob);
    setFotoUrl(url);
  }, []);
  const [aviso, setAviso] = useState<string | null>(null);

  const detener = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const abrirCamara = useCallback(async () => {
    await null; // el primer setState ocurre ya fuera del efecto que lo llama
    if (!navigator.mediaDevices?.getUserMedia) {
      setEstado("sin-camara");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      const caps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & { torch?: boolean };
      setFlashDisponible(Boolean(caps.torch));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setEstado("camara");
    } catch {
      setEstado("sin-camara");
    }
  }, []);

  // Arranca la cámara al abrir (salvo que ya venga una foto) y la apaga al cerrar.
  useEffect(() => {
    // abrirCamara cambia el estado recién después de un await (no en el efecto).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!fotoInicial) void abrirCamara();
    document.body.style.overflow = "hidden";
    return () => {
      detener();
      document.body.style.overflow = "";
    };
  }, [fotoInicial, abrirCamara, detener]);

  useEffect(
    () => () => {
      if (fotoUrlRef.current) URL.revokeObjectURL(fotoUrlRef.current);
    },
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function alternarFlash() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    const siguiente = !flash;
    try {
      await track.applyConstraints({ advanced: [{ torch: siguiente } as MediaTrackConstraintSet] });
      setFlash(siguiente);
    } catch {
      setFlashDisponible(false);
    }
  }

  function sacarFoto() {
    const video = videoRef.current;
    const circulo = circuloRef.current;
    if (!video || !circulo || !video.videoWidth) return;
    // El video se ve con object-cover: se traduce el círculo de pantalla a
    // coordenadas del video para recortar justo lo que se encuadró.
    const v = video.getBoundingClientRect();
    const c = circulo.getBoundingClientRect();
    const escala = Math.max(v.width / video.videoWidth, v.height / video.videoHeight);
    const offX = (video.videoWidth * escala - v.width) / 2;
    const offY = (video.videoHeight * escala - v.height) / 2;
    const margen = 1.1;
    const lado = (c.width * margen) / escala;
    let sx = (c.left - v.left + c.width / 2 + offX) / escala - lado / 2;
    let sy = (c.top - v.top + c.height / 2 + offY) / escala - lado / 2;
    sx = Math.max(0, Math.min(sx, video.videoWidth - lado));
    sy = Math.max(0, Math.min(sy, video.videoHeight - lado));
    const ladoFinal = Math.min(lado, video.videoWidth, video.videoHeight);
    const canvas = document.createElement("canvas");
    const out = Math.min(1280, Math.round(ladoFinal));
    canvas.width = out;
    canvas.height = out;
    canvas.getContext("2d")?.drawImage(video, sx, sy, ladoFinal, ladoFinal, 0, 0, out, out);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        detener();
        setFlash(false);
        guardarFoto(blob);
        setEstado("foto");
      },
      "image/jpeg",
      0.88
    );
  }

  async function enviar() {
    if (!foto) return;
    const archivo = new File([foto], "flanco-neumatico.jpg", { type: "image/jpeg" });
    const puedeCompartir = typeof navigator.canShare === "function" && navigator.canShare({ files: [archivo] });
    if (puedeCompartir) {
      try {
        await navigator.share({ files: [archivo], text: MENSAJE });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    // Sin menú de compartir (escritorio): se baja la foto y se abre el chat.
    const a = document.createElement("a");
    a.href = URL.createObjectURL(archivo);
    a.download = archivo.name;
    a.click();
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(MENSAJE)}`, "_blank", "noopener");
    setAviso("Se descargó la foto: adjuntala en el chat de WhatsApp que se abrió.");
  }

  function repetir() {
    guardarFoto(null);
    setAviso(null);
    setFlash(false);
    setEstado("iniciando");
    void abrirCamara();
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black text-white" role="dialog" aria-modal="true" aria-label="Foto del neumático">
      {estado !== "foto" && (
        <video ref={videoRef} playsInline muted autoPlay className="absolute inset-0 h-full w-full object-cover" />
      )}

      {/* Barra superior */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-2xl font-black" aria-label="Cerrar">
          ×
        </button>
        {estado === "camara" && flashDisponible && (
          <button
            type="button"
            onClick={alternarFlash}
            aria-pressed={flash}
            className={`flex h-11 items-center gap-2 rounded-full px-4 text-sm font-black ${flash ? "bg-yellow-400 text-black" : "bg-black/50 text-white"}`}
          >
            <span aria-hidden="true">⚡</span> Flash {flash ? "prendido" : "apagado"}
          </button>
        )}
      </div>

      {estado === "camara" && (
        <>
          <div className="pointer-events-none relative z-10 mt-2 px-6 text-center">
            <p className="text-lg font-black drop-shadow">Encuadrá el flanco del neumático en el círculo</p>
            <p className="mt-1 text-sm text-slate-200 drop-shadow">Acercate hasta que se lean bien las letras y los números.</p>
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            <div
              ref={circuloRef}
              className="aspect-square rounded-full border-4 border-dashed border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
              style={{ width: "min(80vw, 56dvh)" }}
            />
          </div>
          <div className="relative z-10 mt-auto flex flex-col items-center gap-3 pb-8">
            <button
              type="button"
              onClick={sacarFoto}
              aria-label="Sacar foto"
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20 active:scale-95"
            >
              <span className="h-14 w-14 rounded-full bg-white" />
            </button>
            {!flashDisponible && <p className="px-6 text-center text-xs text-slate-300">Con poca luz, usá una linterna o sacá la foto con la cámara del teléfono.</p>}
          </div>
        </>
      )}

      {estado === "iniciando" && <p className="relative z-10 m-auto text-lg font-bold">Abriendo la cámara…</p>}

      {estado === "sin-camara" && (
        <div className="relative z-10 m-auto max-w-sm px-6 text-center">
          <p className="text-lg font-black">No pudimos abrir la cámara</p>
          <p className="mt-2 text-sm text-slate-300">
            Puede que el navegador no tenga permiso. Cerrá y usá “Elegir o sacar una foto”: se abre la cámara o la galería de tu teléfono.
          </p>
          <button type="button" onClick={onClose} className="mt-5 rounded-xl bg-white px-6 py-3 font-black text-black">
            Volver
          </button>
        </div>
      )}

      {estado === "foto" && fotoUrl && (
        <div className="relative z-10 flex flex-1 flex-col items-center gap-4 overflow-y-auto px-4 pb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fotoUrl} alt="Foto del neumático" className="max-h-[55dvh] w-auto max-w-full rounded-2xl" />
          <p className="max-w-sm text-center text-sm text-slate-300">
            Si se leen las letras y los números, mandala. Te respondemos con la medida en horario de atención.
          </p>
          <button
            type="button"
            onClick={enviar}
            className="flex min-h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-[#25d366] px-4 text-base font-black text-white"
          >
            Enviar por WhatsApp
          </button>
          <button type="button" onClick={repetir} className="text-sm font-bold underline underline-offset-4">
            Sacar otra
          </button>
          {aviso && <p className="max-w-sm text-center text-sm font-bold text-yellow-300">{aviso}</p>}
        </div>
      )}
    </div>
  );
}
