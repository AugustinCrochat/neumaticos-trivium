"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data";

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)].sort((a, b) => Number(a) - Number(b));
}

export function TireSizeSearch({
  initialMedida,
}: {
  initialMedida?: string;
}) {
  const router = useRouter();

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

  // 'width' | 'profile' | 'rim' | null
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Custom Camera Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const availableWidths = useMemo(
    () => unique(PRODUCTS.map((p) => p.size.width)),
    []
  );
  const availableProfiles = useMemo(() => {
    if (!width) return unique(PRODUCTS.map((p) => p.size.profile));
    return unique(
      PRODUCTS.filter((p) => p.size.width === Number(width)).map((p) => p.size.profile)
    );
  }, [width]);
  const availableRims = useMemo(
    () =>
      unique(
        PRODUCTS.filter((p) => {
          if (width && p.size.width !== Number(width)) return false;
          if (profile && p.size.profile !== Number(profile)) return false;
          return true;
        }).map((p) => p.size.rim)
      ),
    [width, profile]
  );

  function handleSearch() {
    if (!width && !profile && !rim) return;
    router.push(`/buscar?medida=${width}-${profile}-r${rim}`);
  }

  // Auto-search ONLY when all three are selected
  useEffect(() => {
    if (width && profile && rim && !activeDropdown) {
      handleSearch();
    }
  }, [width, profile, rim, activeDropdown]);

  function onWidthChange(v: string) {
    setWidth(v);
    setProfile("");
    setRim("");
    setActiveDropdown("profile"); // Auto-open next
  }

  function onProfileChange(v: string) {
    setProfile(v);
    setRim("");
    setActiveDropdown("rim"); // Auto-open next
  }

  function onRimChange(v: string) {
    setRim(v);
    setActiveDropdown(null); // Close all
  }

  // --- CAMERA LOGIC ---

  // Track landscape orientation while scanner is open
  useEffect(() => {
    if (!showScanner) return;
    const update = () => setIsLandscape(window.matchMedia('(orientation: landscape)').matches);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [showScanner]);

  async function startCamera() {
    setShowScanner(true);
    setScanError(null);
    // Try to lock landscape (works on Android Chrome; silent fail on iOS)
    try {
      await (screen.orientation as any).lock('landscape');
    } catch {
      // iOS doesn't support orientation lock — user will see the rotation hint
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const track = stream.getVideoTracks()[0];
      if ((track.getCapabilities() as any).torch) {
        setHasTorch(true);
      }
    } catch (err) {
      console.error(err);
      setScanError("No pudimos acceder a tu cámara. Asegúrate de dar permisos.");
      setShowScanner(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    try { (screen.orientation as any).unlock(); } catch { /* not supported */ }
    setShowScanner(false);
    setTorchOn(false);
  }

  async function toggleTorch() {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] } as any);
      setTorchOn(!torchOn);
    } catch (err) {
      console.error("Error toggling torch", err);
    }
  }

  async function captureAndScan() {
    if (!videoRef.current) return;
    setIsScanning(true);
    setScanProgress("Capturando...");

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const base64Image = canvas.toDataURL("image/jpeg", 0.85);

    stopCamera();
    setScanProgress("Analizando con IA...");

    try {
      const res = await fetch("/api/scan-tire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });
      const data = await res.json();

      if (data.found) {
        setWidth(String(data.width));
        setProfile(String(data.profile));
        setRim(String(data.rim));
        setActiveDropdown(null);
        setScanError(null);
      } else {
        setScanError("No se detectó la medida. Intentá enfocar bien los números del lateral del neumático.");
      }
    } catch {
      setScanError("Error de conexión. Verificá tu internet.");
    } finally {
      setIsScanning(false);
      setScanProgress("");
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const isValid = !!(width && profile && rim);
  const canSearch = !!(width || profile || rim);

  return (
    <>
      {/* FULLSCREEN CAMERA OVERLAY */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-150">

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button
              onClick={stopCamera}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm transition-colors"
            >
              Cancelar
            </button>
            {hasTorch && (
              <button
                onClick={toggleTorch}
                className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-sm transition-all shadow-lg ${
                  torchOn
                    ? 'bg-yellow-400 text-black shadow-yellow-400/40'
                    : 'bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300'
                }`}
              >
                <svg className="w-5 h-5" fill={torchOn ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={torchOn ? 0 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {torchOn ? 'Flash ON' : 'Prender flash'}
              </button>
            )}
          </div>

          {/* Camera view */}
          <div className="relative flex-1 overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="absolute w-full h-full object-cover" />

            {/* Curved scan guide — only shown in landscape */}
            {isLandscape && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Dark area top — bottom edge follows the top guide curve */}
                <path d="M0,0 L100,0 L100,36 Q50,32 0,36 Z" fill="rgba(0,0,0,0.5)" />
                {/* Dark area bottom — top edge follows the bottom guide curve */}
                <path d="M0,100 L100,100 L100,64 Q50,68 0,64 Z" fill="rgba(0,0,0,0.5)" />
                {/* Top guide curve */}
                <path d="M0,36 Q50,32 100,36" stroke="#f97316" strokeWidth="0.5" fill="none" />
                {/* Bottom guide curve */}
                <path d="M0,64 Q50,68 100,64" stroke="#f97316" strokeWidth="0.5" fill="none" />
                {/* Corner brackets — top left */}
                <path d="M4,36 L4,41 M4,36 L12,36" stroke="#fb923c" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                {/* Corner brackets — top right */}
                <path d="M96,36 L96,41 M96,36 L88,36" stroke="#fb923c" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                {/* Corner brackets — bottom left */}
                <path d="M4,64 L4,59 M4,64 L12,64" stroke="#fb923c" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                {/* Corner brackets — bottom right */}
                <path d="M96,64 L96,59 M96,64 L88,64" stroke="#fb923c" strokeWidth="0.8" fill="none" strokeLinecap="round" />
              </svg>
            )}

            {/* Scan strip label */}
            {isLandscape && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <span className="text-white/50 text-xs font-semibold tracking-widest uppercase bg-black/30 px-3 py-1 rounded-full">
                  Ej: 205/55 R16
                </span>
              </div>
            )}

            {/* Portrait rotation hint */}
            {!isLandscape && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-5 pointer-events-none">
                <svg viewBox="0 0 48 72" className="w-14 h-20 text-white/70" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="2" width="40" height="68" rx="6" />
                  <circle cx="24" cy="62" r="3" fill="currentColor" strokeWidth="0" />
                </svg>
                <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3H9m6 0a9 9 0 11-6 16.944M15 3l-3 3m3-3l-3-3" />
                </svg>
                <p className="text-white font-bold text-xl">Girá el teléfono</p>
                <p className="text-white/55 text-sm text-center max-w-[220px] leading-relaxed">
                  Rotá a horizontal para escanear el lateral del neumático
                </p>
              </div>
            )}
          </div>

          {/* Capture button — only in landscape */}
          {isLandscape && (
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
              <button
                onClick={captureAndScan}
                className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-full bg-white" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* REGULAR SEARCH FORM */}
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          <CustomSelect 
            label="Ancho" 
            value={width} 
            onChange={onWidthChange} 
            placeholder="Ancho" 
            example="195"
            options={availableWidths.map(String)}
            isOpen={activeDropdown === "width"}
            onToggle={() => setActiveDropdown(activeDropdown === "width" ? null : "width")}
            isActive={activeDropdown === "width"}
          />
          <CustomSelect 
            label="Perfil" 
            value={profile} 
            onChange={onProfileChange} 
            placeholder="Perfil" 
            example="55"
            options={availableProfiles.map(String)}
            isOpen={activeDropdown === "profile"}
            onToggle={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")}
            isActive={activeDropdown === "profile"}
          />
          <CustomSelect 
            label="Rodado" 
            value={rim} 
            onChange={onRimChange} 
            placeholder="Rodado" 
            example="16"
            options={availableRims.map(String)}
            formatOption={(v) => `R${v}`}
            isOpen={activeDropdown === "rim"}
            onToggle={() => setActiveDropdown(activeDropdown === "rim" ? null : "rim")}
            isActive={activeDropdown === "rim"}
          />
        </div>

        <div className="flex gap-2 md:hidden">
          <button
            type="button"
            onClick={startCamera}
            disabled={isScanning || showScanner}
            className="flex-1 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 text-orange-400 font-bold py-3 px-4 rounded-xl border border-navy-700 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isScanning ? (
              <svg className="animate-spin h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            {isScanning ? (scanProgress || "Analizando foto...") : "Abrir cámara inteligente"}
          </button>
        </div>

        {scanError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-3 py-2 rounded-lg text-center font-medium">
            {scanError}
          </div>
        )}

        {(width || profile || rim) && (
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-50/50 rounded-lg border border-orange-100/50">
            <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-700 text-xs font-mono font-bold">
              {width || "—"}/{profile || "—"} R{rim || "—"}
            </span>
          </div>
        )}

        {!isValid && (
          <button
            type="submit"
            disabled={!canSearch}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-navy-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            BUSCAR NEUMÁTICOS
          </button>
        )}
      </form>
    </>
  );
}

function CustomSelect({
  label,
  value,
  example,
  onChange,
  placeholder,
  disabled,
  options,
  formatOption,
  isOpen,
  onToggle,
  isActive
}: {
  label: string;
  value: string;
  example?: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
  options: string[];
  formatOption?: (v: string) => string;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="flex-1 min-w-[80px] flex flex-col relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between
          bg-navy-800 border-2 text-white font-bold rounded-xl px-4 py-3 text-sm transition-all outline-none shadow-inner
          ${disabled ? "opacity-40 cursor-not-allowed border-navy-700" : "cursor-pointer hover:border-navy-600"}
          ${isActive ? "border-orange-500 ring-2 ring-orange-500/20 shadow-orange-500/10" : "border-navy-700"}
        `}
      >
        <span className={value ? "text-white" : "text-slate-500"}>
          {value ? (formatOption ? formatOption(value) : value) : placeholder}
        </span>
        <svg 
          className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-navy-800 border-2 border-navy-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="py-1">
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500 text-center font-medium">No hay opciones</li>
            ) : (
              options.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-navy-700 hover:text-orange-500 ${value === opt ? "text-orange-500 bg-navy-700/50" : "text-white"}`}
                    onClick={() => {
                      onChange(opt);
                    }}
                  >
                    {formatOption ? formatOption(opt) : opt}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {example && (
        <span className={`block text-center text-[10px] font-bold mt-1 uppercase tracking-tighter transition-colors ${isActive ? "text-orange-500" : "text-slate-500"}`}>
          Ej: {example}
        </span>
      )}
    </div>
  );
}
