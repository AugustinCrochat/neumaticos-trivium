"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data";

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)].sort((a, b) => Number(a) - Number(b));
}

const VEHICLE_DB = [
  { brand: "Toyota", model: "Hilux", sizes: [{ w: "265", p: "65", r: "17" }, { w: "265", p: "60", r: "18" }, { w: "225", p: "70", r: "17" }] },
  { brand: "Peugeot", model: "208", sizes: [{ w: "195", p: "55", r: "16" }, { w: "185", p: "65", r: "15" }, { w: "205", p: "45", r: "17" }] },
  { brand: "Fiat", model: "Cronos", sizes: [{ w: "185", p: "60", r: "15" }, { w: "195", p: "55", r: "16" }] },
  { brand: "Volkswagen", model: "Amarok", sizes: [{ w: "245", p: "70", r: "16" }, { w: "245", p: "65", r: "17" }, { w: "255", p: "60", r: "18" }, { w: "255", p: "50", r: "20" }] },
  { brand: "Volkswagen", model: "Gol Trend", sizes: [{ w: "175", p: "70", r: "14" }, { w: "195", p: "55", r: "15" }] },
  { brand: "Volkswagen", model: "Taos", sizes: [{ w: "215", p: "55", r: "18" }] },
  { brand: "Ford", model: "Ranger", sizes: [{ w: "255", p: "70", r: "16" }, { w: "265", p: "65", r: "17" }, { w: "265", p: "60", r: "18" }] },
  { brand: "Ford", model: "Territory", sizes: [{ w: "235", p: "50", r: "18" }, { w: "235", p: "55", r: "19" }] },
  { brand: "Chevrolet", model: "Onix", sizes: [{ w: "185", p: "65", r: "15" }, { w: "195", p: "55", r: "16" }] },
  { brand: "Chevrolet", model: "Tracker", sizes: [{ w: "215", p: "60", r: "16" }, { w: "215", p: "55", r: "17" }] },
  { brand: "Toyota", model: "Corolla", sizes: [{ w: "205", p: "55", r: "16" }, { w: "225", p: "45", r: "17" }] },
  { brand: "Toyota", model: "Yaris", sizes: [{ w: "185", p: "60", r: "15" }, { w: "195", p: "50", r: "16" }] },
  { brand: "Toyota", model: "Corolla Cross", sizes: [{ w: "215", p: "60", r: "17" }, { w: "225", p: "50", r: "18" }] },
  { brand: "Renault", model: "Kangoo", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "Renault", model: "Sandero", sizes: [{ w: "185", p: "65", r: "15" }, { w: "195", p: "55", r: "16" }] },
  { brand: "Nissan", model: "Frontier", sizes: [{ w: "255", p: "70", r: "16" }, { w: "255", p: "60", r: "18" }] },
  { brand: "Jeep", model: "Renegade", sizes: [{ w: "215", p: "65", r: "16" }, { w: "215", p: "60", r: "17" }, { w: "225", p: "55", r: "18" }] },
  { brand: "Honda", model: "HR-V", sizes: [{ w: "215", p: "55", r: "17" }] }
].sort((a, b) => a.brand.localeCompare(b.brand));

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

  const [searchMode, setSearchMode] = useState<"medida" | "vehiculo">("medida");
  const [vehBrand, setVehBrand] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehActiveDropdown, setVehActiveDropdown] = useState<string | null>(null);

  // Custom Camera Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);
  const [showRotateHint, setShowRotateHint] = useState(false);

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

  const availableBrands = useMemo(() => Array.from(new Set(VEHICLE_DB.map(v => v.brand))), []);
  const availableModels = useMemo(() => {
    if (!vehBrand) return [];
    return VEHICLE_DB.filter(v => v.brand === vehBrand).map(v => v.model);
  }, [vehBrand]);
  const selectedVehicle = useMemo(() => {
    return VEHICLE_DB.find(v => v.brand === vehBrand && v.model === vehModel);
  }, [vehBrand, vehModel]);

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

  // Auto-hide rotate hint when phone goes landscape
  useEffect(() => {
    if (!showScanner) return;
    const check = () => {
      if (window.matchMedia('(orientation: landscape)').matches) setShowRotateHint(false);
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [showScanner]);

  async function startCamera() {
    setShowScanner(true);
    setScanError(null);
    setShowRotateHint(false);

    // Hide browser nav bar on Android Chrome
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    } catch { /* iOS ignores */ }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const track = stream.getVideoTracks()[0];
      if ((track.getCapabilities() as any).torch) {
        setHasTorch(true);
        try {
          await track.applyConstraints({ advanced: [{ torch: true }] } as any);
          setTorchOn(true);
        } catch { /* device accepted capability but rejects apply — ignore */ }
      }

      // Show rotate hint if phone is in portrait after camera loads
      setTimeout(() => {
        if (window.matchMedia('(orientation: portrait)').matches) setShowRotateHint(true);
      }, 600);
    } catch (err) {
      console.error(err);
      setScanError("No pudimos acceder a tu cámara. Asegurate de dar permisos.");
      setShowScanner(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch { /* ignored */ }
    try { if (window.screen && window.screen.orientation && window.screen.orientation.unlock) window.screen.orientation.unlock(); } catch { /* ignored */ }
    setShowScanner(false);
    setHasTorch(false);
    setTorchOn(false);
    setShowRotateHint(false);
  }

  async function toggleTorch() {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] } as any);
      setTorchOn(t => !t);
    } catch (err) {
      console.error("Error toggling torch", err);
    }
  }

  function captureFrame(): string {
    const video = videoRef.current!;
    const MAX_W = 1280;
    const s = Math.min(1, MAX_W / Math.max(video.videoWidth, 1));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * s);
    canvas.height = Math.round(video.videoHeight * s);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Grayscale + contrast boost: embossed text on black rubber becomes more visible
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < img.data.length; i += 4) {
      const g = 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
      const b = Math.min(255, Math.max(0, (g - 128) * 1.8 + 128));
      img.data[i] = img.data[i + 1] = img.data[i + 2] = b;
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.85);
  }

  async function tryScan(base64Image: string) {
    const res = await fetch("/api/scan-tire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image }),
    });
    return res.json() as Promise<{ found: boolean; width?: number; profile?: number; rim?: number }>;
  }

  // Burst: 2 attempts with camera live, stop only when done
  async function captureAndScan() {
    if (!videoRef.current || isScanning) return;
    setIsScanning(true);
    setScanError(null);
    let found = false;

    for (let attempt = 1; attempt <= 2; attempt++) {
      setScanProgress(attempt === 1 ? "Analizando..." : "Segundo intento...");
      try {
        const base64Image = captureFrame();
        const data = await tryScan(base64Image);
        if (data.found && data.width) {
          setWidth(String(data.width));
          setProfile(String(data.profile));
          setRim(String(data.rim));
          setActiveDropdown(null);
          setScanError(null);
          found = true;
          break;
        }
      } catch { /* network error — try next */ }

      if (attempt < 2) await new Promise(r => setTimeout(r, 1200));
    }

    if (!found) setScanError("No se detectó. Acercate más y asegurate que los números sean visibles.");
    stopCamera();
    setIsScanning(false);
    setScanProgress("");
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
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
                    : 'bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300 animate-pulse'
                }`}
              >
                <svg className="w-5 h-5" fill={torchOn ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={torchOn ? 0 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {torchOn ? 'Flash ON' : 'Flash'}
              </button>
            )}
          </div>

          {/* Camera — video simple, sin transformaciones CSS */}
          <div className="relative flex-1 overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Guía: dos líneas horizontales rectas, strip de 80% */}
            <div className="absolute inset-0 pointer-events-none flex flex-col">
              <div className="bg-black/50" style={{ height: '10%' }} />
              <div className="relative flex-1 border-y-2 border-orange-500">
                <div className="absolute -top-px left-4 w-10 h-6 border-t-2 border-l-2 border-orange-400" />
                <div className="absolute -top-px right-4 w-10 h-6 border-t-2 border-r-2 border-orange-400" />
                <div className="absolute -bottom-px left-4 w-10 h-6 border-b-2 border-l-2 border-orange-400" />
                <div className="absolute -bottom-px right-4 w-10 h-6 border-b-2 border-r-2 border-orange-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/35 text-xs font-semibold tracking-widest uppercase">
                    205/55 R16
                  </span>
                </div>
              </div>
              <div className="bg-black/50" style={{ height: '10%' }} />
            </div>

            {/* Hint de rotación — aparece si el teléfono está en portrait, se toca para cerrar */}
            {showRotateHint && (
              <button
                onClick={() => setShowRotateHint(false)}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-5 z-10"
              >
                {/* Ícono teléfono rotando */}
                <div className="relative">
                  <svg viewBox="0 0 48 80" className="w-16 h-24 text-white/70" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="6" y="2" width="36" height="76" rx="6" />
                    <circle cx="24" cy="70" r="3" fill="currentColor" strokeWidth="0" />
                    <line x1="16" y1="12" x2="32" y2="12" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {/* Flecha de rotación */}
                  <svg className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-white font-bold text-xl">Girá el teléfono</p>
                <p className="text-white/55 text-sm text-center px-8 leading-relaxed">
                  Mejor resultado en horizontal. Tocá para continuar igual.
                </p>
              </button>
            )}
          </div>

          {/* Botón de captura + estado */}
          <div className="absolute bottom-0 left-0 right-0 pb-10 pt-6 z-20 flex flex-col items-center gap-3 bg-gradient-to-t from-black/80 to-transparent">
            {isScanning && (
              <span className="text-white/80 text-sm font-medium">{scanProgress}</span>
            )}
            <button
              onClick={captureAndScan}
              disabled={isScanning}
              className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40"
            >
              {isScanning ? (
                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <div className="w-16 h-16 rounded-full bg-white" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setSearchMode("medida")} 
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${searchMode === "medida" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-navy-800 text-navy-300 hover:text-white border border-transparent hover:border-navy-700"}`}
        >
          <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Por Medida
        </button>
        <button 
          onClick={() => setSearchMode("vehiculo")} 
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${searchMode === "vehiculo" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-navy-800 text-navy-300 hover:text-white border border-transparent hover:border-navy-700"}`}
        >
          <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Por Vehículo
        </button>
      </div>

      {/* VEHICLE SEARCH FORM */}
      {searchMode === "vehiculo" && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect 
              label="Marca" 
              value={vehBrand} 
              onChange={(v) => { setVehBrand(v); setVehModel(""); setVehActiveDropdown("model"); }} 
              placeholder="Marca" 
              options={availableBrands}
              isOpen={vehActiveDropdown === "brand"}
              onToggle={() => setVehActiveDropdown(v => v === "brand" ? null : "brand")}
              isActive={vehActiveDropdown === "brand"}
            />
            <CustomSelect 
              label="Modelo" 
              value={vehModel} 
              onChange={(v) => { setVehModel(v); setVehActiveDropdown(null); }} 
              placeholder="Modelo" 
              disabled={!vehBrand}
              options={availableModels}
              isOpen={vehActiveDropdown === "model"}
              onToggle={() => setVehActiveDropdown(v => v === "model" ? null : "model")}
              isActive={vehActiveDropdown === "model"}
            />
          </div>
          
          {selectedVehicle && (
            <div className="mt-4 p-5 bg-navy-800/50 rounded-2xl border border-navy-700/50">
              <p className="text-white font-bold mb-4 text-center">Seleccioná la medida para tu {selectedVehicle.model}:</p>
              <div className="flex flex-col gap-2">
                {selectedVehicle.sizes.map((s, i) => (
                   <button 
                     key={i}
                     onClick={() => router.push(`/buscar?medida=${s.w}-${s.p}-r${s.r}`)}
                     className="bg-navy-800 hover:bg-navy-700 hover:text-orange-400 text-white py-3.5 px-4 rounded-xl font-mono text-sm border border-navy-700 hover:border-orange-500 transition-all shadow-inner flex items-center justify-between group"
                   >
                     <span>{s.w}/{s.p} R{s.r}</span>
                     <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </button>
                ))}
              </div>
              <p className="text-slate-400 text-xs text-center mt-4 leading-relaxed">
                * Las medidas pueden variar según la versión específica. Verificá tu manual o rueda actual.
              </p>
            </div>
          )}
        </div>
      )}

      {/* REGULAR SEARCH FORM */}
      {searchMode === "medida" && (
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
      )}
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
