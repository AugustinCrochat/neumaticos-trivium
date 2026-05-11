"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBranch } from "@/contexts/branch-context";
import { TireDiagram } from "./TireDiagram";

type FullscreenDocumentElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type TorchMediaTrackCapabilities = MediaTrackCapabilities & {
  torch?: boolean;
};

type ScanTireResponse = {
  found?: boolean;
  width?: string | number;
  profile?: string | number;
  rim?: string | number;
  message?: string;
};

type SpeechRecognitionResultEvent = Event & {
  results: {
    length: number;
    [resultIndex: number]: {
      [alternativeIndex: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((ev: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

type MeasureSegment = 'width' | 'aspect' | 'rim';

export function TireSizeSearch({
  initialMedida,
  compact = false,
  forceVoiceButton = false,
  hideLearnLink = false,
}: {
  initialMedida?: string;
  compact?: boolean;
  forceVoiceButton?: boolean;
  hideLearnLink?: boolean;
}) {
  const router = useRouter();
  const { selectedBranch } = useBranch();

  function parseInitial(medida?: string) {
    if (!medida) return { w: "", p: "", r: "" };
    const parts = medida.toLowerCase().split("-");
    return {
      w: parts[0] || "",
      p: parts[1] || "",
      r: (parts[2] && parts[2].startsWith("r")) ? parts[2].substring(1) : ""
    };
  }

  const init = parseInitial(initialMedida);
  const [width, setWidth] = useState(init.w);
  const [profile, setProfile] = useState(init.p);
  const [rim, setRim] = useState(init.r);
  const [shouldClearInitialOnEdit, setShouldClearInitialOnEdit] = useState(Boolean(initialMedida));
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const [showPopular, setShowPopular] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const POPULAR_SIZES = [
    { w: "205", p: "55", r: "16" }, // Muy popular (Cruze, Corolla, Focus, etc)
    { w: "175", p: "65", r: "14" }, // Muy popular (Gol, Etios, Ka, etc)
    { w: "195", p: "65", r: "15" }, // Muy popular (Peugeot 308/408, Corolla, Vento)
    { w: "225", p: "45", r: "17" }, // Muy popular (Sedanes alta gama, SUVs)
    { w: "185", p: "60", r: "15" }, // Popular (Etios, Onix, Prisma)
    { w: "185", p: "65", r: "15" }, // Popular (Logan, Sandero, Partner, Berlingo)
    { w: "215", p: "65", r: "16" }, // Popular (Duster, Oroch, Renegade)
    { w: "265", p: "60", r: "18" }, // Muy popular (Hilux, Ranger, Amarok)
    { w: "265", p: "65", r: "17" }, // Muy popular (Hilux, Ranger, Amarok, SW4)
    { w: "175", p: "70", r: "13" }, // Popular Rodado 13 (Corsa, Gol viejo, Fiat Uno)
    { w: "165", p: "70", r: "13" }, // Popular Rodado 13 (Fiat Uno, Palio, Clio)
    { w: "195", p: "55", r: "15" }, // Popular (Punto, Fiesta, Fit)
    { w: "225", p: "40", r: "18" }, // Popular Deportivo (Vento, Scirocco)
    { w: "205", p: "60", r: "16" }, // Popular (EcoSport, Stepway)
    { w: "185", p: "60", r: "14" }, // Popular (Corsa, Palio)
  ];

  const filteredSizes = POPULAR_SIZES.filter(s => {
    // If all fields are filled and match exactly, don't show any options
    if (width === s.w && profile === s.p && rim === s.r) return false;
    
    const wMatch = !width || s.w.startsWith(width);
    const pMatch = !profile || s.p.startsWith(profile);
    const rMatch = !rim || s.r.startsWith(rim);
    
    return wMatch && pMatch && rMatch;
  }).slice(0, 8);

  // Check if the current input is already a "complete" valid size from our list
  const isComplete = POPULAR_SIZES.some(s => s.w === width && s.p === profile && s.r === rim);
  const shouldShowDropdown = showPopular && filteredSizes.length > 0 && !isComplete;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((index) => (index + 1) % POPULAR_SIZES.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [POPULAR_SIZES.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPopular(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasInput = width.trim() !== "" || profile.trim() !== "" || rim.trim() !== "";
  const placeholderSize = POPULAR_SIZES[placeholderIndex];

  const sizeWarning = useMemo(() => {
    // Validate against standard tire size ranges
    if (width.length >= 3) {
      const w = Number(width);
      if (w < 135 || w > 355 || w % 5 !== 0) {
        return `Ancho no estándar. Los anchos van de 135 a 355 en múltiplos de 5 (ej: 195, 205, 225)`;
      }
    }
    if (profile.length >= 2) {
      const p = Number(profile);
      if (p < 25 || p > 85 || p % 5 !== 0) {
        return `Perfil no estándar. Los perfiles van de 25 a 85 en múltiplos de 5 (ej: 45, 55, 65)`;
      }
    }
    if (rim.length >= 2) {
      const r = Number(rim);
      if (r < 13 || r > 24) {
        return `Rodado no estándar. Los rodados van del 13 al 24 (ej: 15, 16, 17)`;
      }
    }
    return null;
  }, [width, profile, rim]);

  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lightSampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [lowLight, setLowLight] = useState(false);

  const widthRef = useRef<HTMLInputElement | null>(null);
  const profileRef = useRef<HTMLInputElement | null>(null);
  const rimRef = useRef<HTMLInputElement | null>(null);
  const tireEditorRef = useRef<HTMLDivElement | null>(null);
  const diagramFreshSelectionRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const autoAdvancingRef = useRef(false);

  const [focused, setFocused] = useState<MeasureSegment | null>(null);
  const [listening, setListening] = useState(false);

  const performSearch = (w: string, p: string, rVal: string) => {
    if (!w && !p && !rVal) return;
    const medida = `${w}-${p}-r${rVal}`;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setShowPopular(false); // Ocultar dropdown después de búsqueda
    router.push(`/buscar?medida=${medida}`);
  };

  function executeSearch() {
    performSearch(width, profile, rim);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  };

  const clearInitialMeasureForEdit = () => {
    if (!shouldClearInitialOnEdit) return;
    setWidth("");
    setProfile("");
    setRim("");
    setShouldClearInitialOnEdit(false);
  };

  const handleMeasureInputFocus = (
    e: React.FocusEvent<HTMLInputElement>,
    segment: MeasureSegment,
  ) => {
    if (!autoAdvancingRef.current) clearInitialMeasureForEdit();
    autoAdvancingRef.current = false;
    selectInputText(e);
    setShowPopular(true);
    setFocused(segment);
  };

  const getInputForSegment = (segment: MeasureSegment) => {
    if (segment === 'width') return widthRef.current;
    if (segment === 'aspect') return profileRef.current;
    return rimRef.current;
  };

  const focusDiagramSegment = (segment: MeasureSegment) => {
    clearInitialMeasureForEdit();
    setFocused(segment);
    setShowPopular(true);
    diagramFreshSelectionRef.current = true;
    window.requestAnimationFrame(() => {
      const input = getInputForSegment(segment);
      if (input) {
        input.focus();
        input.select();
      } else {
        tireEditorRef.current?.focus();
      }
    });
  };

  const getSegmentValue = (segment: MeasureSegment) => {
    if (segment === 'width') return width;
    if (segment === 'aspect') return profile;
    return rim;
  };

  const setSegmentValue = (segment: MeasureSegment, value: string) => {
    if (segment === 'width') setWidth(value);
    else if (segment === 'aspect') setProfile(value);
    else setRim(value);
  };

  const nextSegment = (segment: MeasureSegment): MeasureSegment => {
    if (segment === 'width') return 'aspect';
    if (segment === 'aspect') return 'rim';
    return 'rim';
  };

  const previousSegment = (segment: MeasureSegment): MeasureSegment => {
    if (segment === 'rim') return 'aspect';
    if (segment === 'aspect') return 'width';
    return 'width';
  };

  const handleDiagramKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const activeSegment = focused ?? 'width';

    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setFocused(null);
      tireEditorRef.current?.blur();
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusDiagramSegment(nextSegment(activeSegment));
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusDiagramSegment(previousSegment(activeSegment));
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      const currentValue = getSegmentValue(activeSegment);
      setSegmentValue(activeSegment, currentValue.slice(0, -1));
      diagramFreshSelectionRef.current = false;
      return;
    }

    if (!/^[0-9]$/.test(e.key)) return;

    e.preventDefault();
    const maxLength = activeSegment === 'width' ? 3 : 2;
    const currentValue = diagramFreshSelectionRef.current ? "" : getSegmentValue(activeSegment);
    const nextValue = `${currentValue}${e.key}`.slice(0, maxLength);

    setSegmentValue(activeSegment, nextValue);
    setShowPopular(true);
    diagramFreshSelectionRef.current = false;

    if (nextValue.length >= maxLength && activeSegment !== 'rim') {
      focusDiagramSegment(nextSegment(activeSegment));
    }
  };

  useEffect(() => {
    if (!showScanner) return;

    function sampleLight() {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;

      const canvas = lightSampleCanvasRef.current ?? document.createElement("canvas");
      lightSampleCanvasRef.current = canvas;
      canvas.width = 24;
      canvas.height = 24;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let totalLuma = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        totalLuma += 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
      }

      const averageLuma = totalLuma / (pixels.length / 4);
      setLowLight(averageLuma < 58);
    }

    const firstSample = window.setTimeout(sampleLight, 600);
    const interval = window.setInterval(sampleLight, 800);
    return () => {
      window.clearTimeout(firstSample);
      window.clearInterval(interval);
    };
  }, [showScanner]);

  async function startCamera() {
    setShowScanner(true); setScanError(null); setLowLight(false);
    try {
      const el = document.documentElement as FullscreenDocumentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } catch { }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as TorchMediaTrackCapabilities;
      if (capabilities.torch) setHasTorch(true);
    } catch { setScanError("No pudimos acceder a tu cámara."); setShowScanner(false); }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch { }
    setShowScanner(false); setHasTorch(false); setTorchOn(false); setLowLight(false);
  }

  async function toggleTorch() {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const torchConstraint = { torch: !torchOn } as MediaTrackConstraintSet;
    try { await track.applyConstraints({ advanced: [torchConstraint] }); setTorchOn(t => !t); } catch { }
  }

  function captureFrame(): { original: string; processed: string } {
    const video = videoRef.current!;
    const natW = video.videoWidth; const natH = video.videoHeight;
    const shortSide = Math.min(natW, natH);
    const cropSize = Math.round(shortSide * 0.98);
    const cropX = Math.round((natW - cropSize) / 2);
    const cropY = Math.round((natH - cropSize) / 2);
    const TARGET_SIZE = 1024;
    const canvas1 = document.createElement("canvas"); canvas1.width = TARGET_SIZE; canvas1.height = TARGET_SIZE;
    const ctx1 = canvas1.getContext("2d")!;
    ctx1.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, TARGET_SIZE, TARGET_SIZE);
    const original = canvas1.toDataURL("image/jpeg", 0.85);
    const canvas2 = document.createElement("canvas"); canvas2.width = TARGET_SIZE; canvas2.height = TARGET_SIZE;
    const ctx2 = canvas2.getContext("2d")!;
    ctx2.filter = "contrast(2.0) brightness(1.05) saturate(0)";
    ctx2.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, TARGET_SIZE, TARGET_SIZE);
    const processed = canvas2.toDataURL("image/jpeg", 0.85);
    return { original, processed };
  }

  async function tryScan(images: { original: string; processed: string }) {
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch("/api/scan-tire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ base64Image: images.original, base64Processed: images.processed }), signal: controller.signal });
      return res.json() as Promise<ScanTireResponse>;
    } finally { clearTimeout(timeout); }
  }

  async function captureAndScan() {
    if (!videoRef.current || isScanning) return;
    setIsScanning(true); setScanError(null); setScanProgress("Analizando...");
    try {
      const images = captureFrame();
      const data = await tryScan(images);
      if (data.found && data.width) {
        setWidth(String(data.width)); setProfile(String(data.profile)); setRim(String(data.rim));
        stopCamera();
      } else { 
        setScanError(data.message || "No pudimos detectar la medida automáticamente."); 
        stopCamera();
      }
    } catch { 
      setScanError("La IA tardó demasiado."); 
      stopCamera();
    }
    finally { setIsScanning(false); setScanProgress(""); }
  }

  const measureInputClass = "w-full min-w-0 bg-white border-2 border-slate-300 rounded-xl px-2 sm:px-3 py-3 text-navy-950 font-black text-center shadow-sm transition-all outline-none placeholder:text-slate-600 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-lg focus:shadow-orange-500/10";
  const measureSeparatorClass = "flex h-[52px] items-center justify-center text-lg font-black text-slate-500";
  
  const voiceButtonClass = `h-[52px] w-12 shrink-0 flex items-center justify-center rounded-xl border transition-all ${
    listening
      ? "bg-red-700 text-white border-red-400 shadow-lg shadow-red-700/25"
      : "bg-red-600 text-white border-red-400 shadow-lg shadow-red-700/20 hover:bg-red-500 hover:border-red-300"
  }`;

  const searchButtonClass = `h-[52px] w-12 shrink-0 flex items-center justify-center rounded-xl border transition-all bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20 hover:bg-orange-400`;

  const selectInputText = (e: React.SyntheticEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  function startVoiceForMeasure() {
    // Borrar todos los valores cuando se activa el reconocimiento de voz
    setWidth(""); setProfile(""); setRim("");
    
    const Speech = (window as SpeechRecognitionWindow).SpeechRecognition || (window as SpeechRecognitionWindow).webkitSpeechRecognition;
    if (!Speech) return alert('Tu navegador no soporta reconocimiento de voz');
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; setListening(false); return; }
    const r = new Speech(); r.lang = 'es-AR'; r.interimResults = false; r.maxAlternatives = 1;
    r.continuous = true;
    
    let searchTimeout: ReturnType<typeof setTimeout> | undefined;
    let hasNavigated = false;

    const navigate = (w: string, p: string, rVal: string) => {
      if (hasNavigated) return;
      if (!w || !p || !rVal) return;
      hasNavigated = true;
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      router.push(`/buscar?medida=${w}-${p}-r${rVal}`);
    };

    r.onresult = (ev) => {
      let fullTranscript = '';
      for (let i = 0; i < ev.results.length; i++) {
        fullTranscript += (ev.results[i][0].transcript || '') + ' ';
      }
      const txt = fullTranscript.replace(/[^0-9 ]/g, ' ').trim();
      const nums = txt.split(/\s+/).filter(Boolean);

      let w = '';
      let p = '';
      let rimVal = '';

      nums.forEach(numStr => {
        const num = parseInt(numStr, 10);
        if (num >= 12 && num <= 28) rimVal = numStr;
        else if (num >= 30 && num <= 95) p = numStr;
        else if (num >= 135 && num <= 355) w = numStr;
      });

      if (w) { w = w.slice(0,3); setWidth(w); }
      if (p) { p = p.slice(0,2); setProfile(p); }
      if (rimVal) { rimVal = rimVal.slice(0,2); setRim(rimVal); }

      clearTimeout(searchTimeout);

      if (w && p && rimVal) {
        r.stop();
        navigate(w, p, rimVal);
      } else if (w || p || rimVal) {
        // Focus the first missing field without triggering the clear-all behavior
        if (!w && widthRef.current) { autoAdvancingRef.current = true; widthRef.current.focus(); }
        else if (!p && profileRef.current) { autoAdvancingRef.current = true; profileRef.current.focus(); }
        else if (!rimVal && rimRef.current) { autoAdvancingRef.current = true; rimRef.current.focus(); }
      }
    };
    r.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      clearTimeout(searchTimeout);
    };
    recognitionRef.current = r; setListening(true);
    r.start();
  }

  return (
    <div className={`bg-slate-100 rounded-2xl border border-slate-200 ${compact ? 'p-4' : 'p-6'} shadow-xl shadow-slate-300/40 relative group w-full`}>
      <p className={`font-black text-navy-900 ${compact ? 'text-sm mb-2' : 'text-base mb-3'}`}>
        Buscar por medida
      </p>
      {!hideLearnLink && (
        <p className={`text-slate-600 ${compact ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
          ¿No sabés tu medida?{" "}
          <Link href="/blog/como-leer-medida-neumatico" className="font-bold text-red-600 underline underline-offset-2 hover:text-red-700">
            Aprendé a leerla acá
          </Link>
        </p>
      )}
      <div
        ref={tireEditorRef}
        tabIndex={0}
        role="group"
        aria-label="Editar medida desde el neumático"
        onFocus={(e) => {
          if (e.target === e.currentTarget && !focused) focusDiagramSegment('width');
        }}
        onBlur={() => setFocused(null)}
        onKeyDown={handleDiagramKeyDown}
        className="rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20"
      >
        <TireDiagram
          width={width}
          aspect={profile}
          rim={rim}
          placeholderSize={placeholderSize}
          focused={focused}
          compact={compact}
          onSegmentSelect={focusDiagramSegment}
        />
      </div>

      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={stopCamera} className="bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm">Cancelar</button>
            {hasTorch && (
              <button 
                onClick={toggleTorch} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs sm:text-sm transition-all shadow-lg border-2 ${
                  torchOn 
                    ? 'bg-yellow-400 text-black border-yellow-300 shadow-yellow-400/50 scale-105' 
                    : 'bg-black/40 text-yellow-400 border-yellow-400/50 backdrop-blur-md'
                }`}
              >
                <svg className="w-4 h-4" fill={torchOn ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {torchOn ? 'FLASH ENCENDIDO' : 'ACTIVAR FLASH'}
              </button>
            )}
          </div>

          {lowLight && !isScanning && (
            <div className="absolute top-20 left-4 right-4 z-20 flex justify-center">
              {hasTorch && !torchOn ? (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className="inline-flex items-center gap-2 rounded-full border border-yellow-300/60 bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-black shadow-lg shadow-yellow-500/30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Poca luz · Activar flash
                </button>
              ) : (
                <span className="inline-flex items-center rounded-full border border-yellow-300/40 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-wide text-yellow-300 shadow-lg backdrop-blur-md">
                  Hay poca luz
                </span>
              )}
            </div>
          )}

          <div className="flex-1 flex items-center justify-center bg-black">
            <div className="relative rounded-full overflow-hidden" style={{ width: '90vmin', height: '90vmin', boxShadow: '0 0 0 9999px #000' }}>
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-dashed animate-[spin_20s_linear_infinite] pointer-events-none" />
            </div>
            <div className="absolute pointer-events-none flex items-center justify-center top-1/2 -translate-y-1/2">
              <span className="text-white font-black text-sm tracking-widest uppercase bg-black/70 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-xl whitespace-nowrap">
                Centrá el neumático
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 pb-12 pt-8 z-20 flex flex-col items-center gap-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            {isScanning ? (
              <span className="text-white/90 text-sm font-bold tracking-widest uppercase animate-pulse">{scanProgress}</span>
            ) : (
              <span className="text-white text-sm sm:text-base font-black uppercase tracking-[0.2em] animate-pulse bg-black/60 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 whitespace-nowrap shadow-2xl">
                Presioná para escanear
              </span>
            )}
            <button onClick={captureAndScan} disabled={isScanning} className="w-20 h-20 rounded-full border-4 border-white/60 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 shadow-2xl">
              {isScanning ? (
                <svg className="w-10 h-10 text-white animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div ref={containerRef} className="relative">
          {compact ? (
            // Compact: single DOM — 3-column + button on mobile, stacked on desktop
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] lg:grid-cols-1 gap-2">
              <input
                ref={widthRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={width}
                onFocus={(e) => handleMeasureInputFocus(e, 'width')}
                onBlur={() => setFocused(null)}
                onClick={(e) => { selectInputText(e); setShowPopular(true); }}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, '').slice(0,3);
                  setWidth(v);
                  if (v.length >= 3 && profileRef.current) { autoAdvancingRef.current = true; profileRef.current.focus(); }
                }}
                onKeyDown={handleKeyDown}
                placeholder="ancho"
                aria-label="Ancho del neumático"
                className={measureInputClass}
              />
              <span aria-hidden="true" className={`${measureSeparatorClass} lg:hidden`}>/</span>
              <input
                ref={profileRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={profile}
                onFocus={(e) => handleMeasureInputFocus(e, 'aspect')}
                onBlur={() => setFocused(null)}
                onClick={(e) => { selectInputText(e); setShowPopular(true); }}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2);
                  setProfile(v);
                  if (v.length >= 2 && rimRef.current) { autoAdvancingRef.current = true; rimRef.current.focus(); }
                }}
                onKeyDown={handleKeyDown}
                placeholder="perfil"
                aria-label="Perfil del neumático"
                className={measureInputClass}
              />
              <span aria-hidden="true" className={`${measureSeparatorClass} lg:hidden`}>R</span>
              <input
                ref={rimRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={rim}
                onFocus={(e) => handleMeasureInputFocus(e, 'rim')}
                onBlur={() => setFocused(null)}
                onClick={(e) => { selectInputText(e); setShowPopular(true); }}
                onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2); setRim(v); }}
                onKeyDown={handleKeyDown}
                placeholder="rodado"
                aria-label="Rodado del neumático"
                className={measureInputClass}
              />
              {/* Inline button: mobile only (desktop gets full-width button below) */}
              <div className="lg:hidden">
                {!forceVoiceButton && hasInput ? (
                  <button type="button" onClick={executeSearch} aria-label="Buscar medida" className={searchButtonClass}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button type="button" onClick={startVoiceForMeasure} aria-label="Ingresar medida por voz" className={voiceButtonClass}>
                    <svg className="w-5 h-5" viewBox="0 0 82.05 122.88" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M59.89,20.83V52.3c0,27-37.73,27-37.73,0V20.83c0-27.77,37.73-27.77,37.73,0Zm-14.18,76V118.2a4.69,4.69,0,0,1-9.37,0V96.78a40.71,40.71,0,0,1-12.45-3.51A41.63,41.63,0,0,1,12.05,85L12,84.91A41.31,41.31,0,0,1,3.12,71.68,40.73,40.73,0,0,1,0,56a4.67,4.67,0,0,1,8-3.31l.1.1A4.68,4.68,0,0,1,9.37,56a31.27,31.27,0,0,0,2.4,12.06A32,32,0,0,0,29,85.28a31.41,31.41,0,0,0,24.13,0,31.89,31.89,0,0,0,10.29-6.9l.08-.07a32,32,0,0,0,6.82-10.22A31.27,31.27,0,0,0,72.68,56a4.69,4.69,0,0,1,9.37,0,40.65,40.65,0,0,1-3.12,15.65A41.45,41.45,0,0,1,70,85l-.09.08a41.34,41.34,0,0,1-11.75,8.18,40.86,40.86,0,0,1-12.46,3.51Z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Non-compact: always horizontal
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] gap-2 sm:gap-3">
              <div className="min-w-0">
                <input
                  ref={widthRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={width}
                  onFocus={(e) => handleMeasureInputFocus(e, 'width')}
                  onBlur={() => setFocused(null)}
                  onClick={(e) => { selectInputText(e); setShowPopular(true); }}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '').slice(0,3);
                    setWidth(v);
                    if (v.length >= 3 && profileRef.current) { autoAdvancingRef.current = true; profileRef.current.focus(); }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="ancho"
                  aria-label="Ancho del neumático"
                  className={measureInputClass}
                />
              </div>
              <span aria-hidden="true" className={measureSeparatorClass}>/</span>
              <div className="min-w-0">
                <input
                  ref={profileRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={profile}
                  onFocus={(e) => handleMeasureInputFocus(e, 'aspect')}
                  onBlur={() => setFocused(null)}
                  onClick={(e) => { selectInputText(e); setShowPopular(true); }}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2);
                    setProfile(v);
                    if (v.length >= 2 && rimRef.current) { autoAdvancingRef.current = true; rimRef.current.focus(); }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="perfil"
                  aria-label="Perfil del neumático"
                  className={measureInputClass}
                />
              </div>
              <span aria-hidden="true" className={measureSeparatorClass}>R</span>
              <div className="min-w-0">
                <input
                  ref={rimRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={rim}
                  onFocus={(e) => handleMeasureInputFocus(e, 'rim')}
                  onBlur={() => setFocused(null)}
                  onClick={(e) => { selectInputText(e); setShowPopular(true); }}
                  onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2); setRim(v); }}
                  onKeyDown={handleKeyDown}
                  placeholder="rodado"
                  aria-label="Rodado del neumático"
                  className={measureInputClass}
                />
              </div>

              {!forceVoiceButton && hasInput ? (
                <button type="button" onClick={executeSearch} aria-label="Buscar medida" className={searchButtonClass}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button type="button" onClick={startVoiceForMeasure} aria-label="Ingresar medida por voz" className={voiceButtonClass}>
                  <svg className="w-5 h-5" viewBox="0 0 82.05 122.88" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M59.89,20.83V52.3c0,27-37.73,27-37.73,0V20.83c0-27.77,37.73-27.77,37.73,0Zm-14.18,76V118.2a4.69,4.69,0,0,1-9.37,0V96.78a40.71,40.71,0,0,1-12.45-3.51A41.63,41.63,0,0,1,12.05,85L12,84.91A41.31,41.31,0,0,1,3.12,71.68,40.73,40.73,0,0,1,0,56a4.67,4.67,0,0,1,8-3.31l.1.1A4.68,4.68,0,0,1,9.37,56a31.27,31.27,0,0,0,2.4,12.06A32,32,0,0,0,29,85.28a31.41,31.41,0,0,0,24.13,0,31.89,31.89,0,0,0,10.29-6.9l.08-.07a32,32,0,0,0,6.82-10.22A31.27,31.27,0,0,0,72.68,56a4.69,4.69,0,0,1,9.37,0,40.65,40.65,0,0,1-3.12,15.65A41.45,41.45,0,0,1,70,85l-.09.08a41.34,41.34,0,0,1-11.75,8.18,40.86,40.86,0,0,1-12.46,3.51Z"/>
                  </svg>
                </button>
              )}
            </div>
          )}

          {shouldShowDropdown && (
            <div className={`absolute left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${compact ? 'top-full mt-2 right-[56px] lg:right-0' : 'top-full mt-2 right-[56px]'}`}>
              <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 bg-slate-50">
                Medidas populares
              </p>
              <div className="max-h-[240px] overflow-y-auto">
                {filteredSizes.map((s) => (
                  <button
                    key={`${s.w}-${s.p}-${s.r}`}
                    type="button"
                    onMouseDown={(e) => {
                      // Use onMouseDown to prevent blur before click
                      e.preventDefault();
                      setWidth(s.w);
                      setProfile(s.p);
                      setRim(s.r);
                      setShowPopular(false);
                      performSearch(s.w, s.p, s.r);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center justify-between group border-b border-slate-100 last:border-0"
                  >
                    <span className="text-navy-900 font-bold">
                      {s.w} / {s.p} <span className="text-slate-500 font-medium">R</span>{s.r}
                    </span>
                    <svg className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {compact && (
          <div className="hidden lg:block">
            {!forceVoiceButton && hasInput ? (
              <button type="button" onClick={executeSearch} aria-label="Buscar medida"
                className="w-full h-[52px] bg-orange-500 hover:bg-orange-400 text-white font-black rounded-xl border border-orange-400 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
                Buscar medida
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button type="button" onClick={startVoiceForMeasure} aria-label="Ingresar medida por voz"
                className={`w-full h-[52px] font-bold text-sm rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  listening
                    ? "bg-red-700 text-white border-red-400 shadow-lg shadow-red-700/25"
                    : "bg-red-600 text-white border-red-400 shadow-lg shadow-red-700/20 hover:bg-red-500 hover:border-red-300"
                }`}>
                <svg className="w-4 h-4" viewBox="0 0 82.05 122.88" fill="currentColor">
                  <path d="M59.89,20.83V52.3c0,27-37.73,27-37.73,0V20.83c0-27.77,37.73-27.77,37.73,0Zm-14.18,76V118.2a4.69,4.69,0,0,1-9.37,0V96.78a40.71,40.71,0,0,1-12.45-3.51A41.63,41.63,0,0,1,12.05,85L12,84.91A41.31,41.31,0,0,1,3.12,71.68,40.73,40.73,0,0,1,0,56a4.67,4.67,0,0,1,8-3.31l.1.1A4.68,4.68,0,0,1,9.37,56a31.27,31.27,0,0,0,2.4,12.06A32,32,0,0,0,29,85.28a31.41,31.41,0,0,0,24.13,0,31.89,31.89,0,0,0,10.29-6.9l.08-.07a32,32,0,0,0,6.82-10.22A31.27,31.27,0,0,0,72.68,56a4.69,4.69,0,0,1,9.37,0,40.65,40.65,0,0,1-3.12,15.65A41.45,41.45,0,0,1,70,85l-.09.08a41.34,41.34,0,0,1-11.75,8.18,40.86,40.86,0,0,1-12.46,3.51Z"/>
                </svg>
                {listening ? 'Escuchando...' : 'Ingresar por voz'}
              </button>
            )}
          </div>
        )}

        {sizeWarning && (
          <p className="flex items-start gap-1.5 text-orange-700 text-[11px] font-medium leading-snug">
            <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {sizeWarning}
          </p>
        )}

        <button
          type="button"
          onClick={startCamera}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 text-white font-black py-4 rounded-xl border border-red-300/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 active:scale-[0.98] lg:hidden"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
          </svg>
          <span>Reconocer medida con IA</span>
          <span className="relative -ml-0.5 inline-flex w-5 h-5 items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z" />
            </svg>
            <svg className="absolute -bottom-0.5 -right-0.5 w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2 4.8L19 9l-5 2.2L12 16l-2-4.8L5 9l5-2.2L12 2z" />
            </svg>
          </span>
        </button>

        {scanError && (
          <div className="bg-white p-5 rounded-xl border border-orange-200 flex flex-col gap-4 animate-in fade-in zoom-in duration-300 mt-2">
            <div>
              <p className="text-orange-700 font-bold text-sm">No pudimos leer la medida.</p>
              <p className="text-slate-600 text-xs leading-relaxed mt-1">
                {scanError}
              </p>
            </div>
            <button
              onClick={() => {
                const waText = encodeURIComponent(`Hola Trivium ${selectedBranch.shortName}! Estoy intentando buscar mis neumáticos pero el escáner no los detecta. ¿Me ayudan por favor? Ahora saco una foto nueva y se las envío por WhatsApp.`);
                window.open(`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`, "_blank");
              }}
              type="button"
              className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm border border-[#25D366]/30"
            >
              Consultar por WhatsApp
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
