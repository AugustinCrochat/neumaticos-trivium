"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBranch } from "@/contexts/branch-context";
import { PRODUCTS } from "@/lib/data";

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)].sort((a, b) => Number(a) - Number(b));
}

import { VEHICLE_DB } from "@/lib/vehicles";

export function TireSizeSearch({
  initialMedida,
}: {
  initialMedida?: string;
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

  // 'width' | 'profile' | 'rim' | null
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [searchMode, setSearchMode] = useState<"medida" | "vehiculo" | "patente">("medida");
  const [vehBrand, setVehBrand] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehActiveDropdown, setVehActiveDropdown] = useState<string | null>(null);

  // Patente state
  const [patente, setPatente] = useState("");
  const [patenteLoading, setPatenteLoading] = useState(false);
  const [patenteError, setPatenteError] = useState<string | null>(null);

  // Custom Camera Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);

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

  // --- PATENTE LOGIC ---
  async function searchByPatente(e: React.FormEvent) {
    e.preventDefault();
    if (!patente) return;
    
    setPatenteLoading(true);
    setPatenteError(null);
    
    try {
      const res = await fetch("/api/patente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patente })
      });
      
      if (!res.ok) throw new Error("Error obteniendo datos");
      
      const data = await res.json();
      
      if (data.brand && data.model) {
        setVehBrand(data.brand);
        setVehModel(data.model);
        setSearchMode("vehiculo");
      } else {
        setPatenteError("No encontramos un modelo asociado a esta patente.");
      }
    } catch (err) {
      setPatenteError("Hubo un problema consultando la patente.");
    } finally {
      setPatenteLoading(false);
    }
  }

  // --- CAMERA LOGIC ---

  async function startCamera() {
    setShowScanner(true);
    setScanError(null);

    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    } catch { /* iOS ignores */ }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      if (capabilities.torch) setHasTorch(true);
      if (capabilities.zoom) {
        const minZoom = capabilities.zoom.min || 1;
        try {
          await track.applyConstraints({ advanced: [{ zoom: minZoom }] } as any);
        } catch { /* ignored */ }
      }

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

  function captureFrame(): { original: string; processed: string } {
    const video = videoRef.current!;
    const natW = video.videoWidth;
    const natH = video.videoHeight;
    const shortSide = Math.min(natW, natH);
    const cropSize = Math.round(shortSide * 0.98);
    const cropX = Math.round((natW - cropSize) / 2);
    const cropY = Math.round((natH - cropSize) / 2);

    const TARGET_SIZE = 1600; 

    const canvas1 = document.createElement("canvas");
    canvas1.width = TARGET_SIZE;
    canvas1.height = TARGET_SIZE;
    const ctx1 = canvas1.getContext("2d")!;
    ctx1.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, TARGET_SIZE, TARGET_SIZE);
    const original = canvas1.toDataURL("image/jpeg", 0.90);

    const canvas2 = document.createElement("canvas");
    canvas2.width = TARGET_SIZE;
    canvas2.height = TARGET_SIZE;
    const ctx2 = canvas2.getContext("2d")!;
    ctx2.filter = "contrast(1.6) brightness(1.1) saturate(0)"; 
    ctx2.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, TARGET_SIZE, TARGET_SIZE);
    const processed = canvas2.toDataURL("image/jpeg", 0.85);

    return { original, processed };
  }

  async function tryScan(images: { original: string; processed: string }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch("/api/scan-tire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image: images.original, base64Processed: images.processed }),
        signal: controller.signal,
      });
      return res.json() as Promise<{ found: boolean; width?: number; profile?: number; rim?: number; error?: string; status?: number; raw?: string; message?: string }>;
    } finally {
      clearTimeout(timeout);
    }
  }

  function saveFailedSample(images: { original: string; processed: string }, reason: string, status?: number) {
    if (!images.original) return;
    fetch("/api/scan-tire", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base64Image: images.original,
        base64Processed: images.processed,
        saveFailed: true,
        failReason: reason,
        failStatus: status,
      }),
    }).catch(console.error);
  }

  async function captureAndScan() {
    if (!videoRef.current || isScanning) return;
    setIsScanning(true);
    setScanError(null);
    let found = false;
    let images = { original: "", processed: "" };

    setScanProgress("Analizando...");
    try {
      images = captureFrame();
      const data = await tryScan(images);
      if (data.found && data.width) {
        const detected = { width: data.width!, profile: data.profile!, rim: data.rim! };
        fetch("/api/scan-tire", {
          method: "POST",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Image: images.original,
            base64Processed: images.processed,
            confirmLabel: `${detected.width}-${detected.profile}-${detected.rim}`,
          }),
        }).catch(console.error);
        setWidth(String(detected.width));
        setProfile(String(detected.profile));
        setRim(String(detected.rim));
        setActiveDropdown(null);
        setScanError(null);
        found = true;
      } else if (data.error === "quota") {
        setScanError(data.message || "Cuota de IA agotada temporalmente. Probá de nuevo en 1 minuto.");
        saveFailedSample(images, "quota", data.status);
        found = true;
      } else if (data.error === "debug") {
        setScanError("No logramos identificar la medida. Intentá acercarte un poco más a los números o mejorar la iluminación.");
        saveFailedSample(images, "debug", data.status);
        found = true; 
      }
    } catch (err: any) {
      console.error(err);
      if (err.name === 'AbortError') {
        setScanError("La IA tardó demasiado. Probá de nuevo con mejor luz.");
        saveFailedSample(images, "timeout");
        found = true;
      }
    }

    if (!found) {
      setScanError("No pudimos detectar la medida automáticamente.");
      saveFailedSample(images, "not_found");
    }
    stopCamera();
    setIsScanning(false);
    setScanProgress("");
  }

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
            <div className="flex items-center gap-2">
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
          </div>

          {/* Camera Viewport */}
          <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Circle Guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="rounded-full border-4 border-orange-500 border-dashed flex items-center justify-center animate-[spin_20s_linear_infinite]"
                style={{ width: '90vmin', height: '90vmin', boxShadow: '0 0 0 9999px #000' }}
              ></div>
              
              <div className="absolute flex items-center justify-center top-1/2 -translate-y-1/2">
                <span className="text-white font-black text-sm tracking-widest uppercase bg-black/70 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-xl whitespace-nowrap">
                  Centrá el neumático
                </span>
              </div>
            </div>
          </div>

          {/* Botón de captura + estado */}
          <div className="absolute bottom-0 left-0 right-0 pb-10 pt-6 z-20 flex flex-col items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
            {!isScanning && (
              <span className="text-white text-xs font-bold uppercase tracking-widest animate-pulse">
                Presioná para escanear
              </span>
            )}
            {isScanning && (
              <span className="text-white/80 text-sm font-medium">{scanProgress}</span>
            )}
            <button
              onClick={captureAndScan}
              disabled={isScanning}
              className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40 shadow-2xl"
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
      <div className="flex bg-navy-800/50 p-1.5 rounded-2xl mb-6 shadow-inner border border-navy-700/50">
        <button 
          type="button" 
          onClick={() => setSearchMode("medida")} 
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${searchMode === "medida" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-transparent text-navy-300 hover:text-white"}`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <span className="hidden sm:inline">Por Medida</span>
          <span className="sm:hidden">Medida</span>
        </button>
        <button 
          type="button" 
          onClick={() => setSearchMode("vehiculo")} 
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${searchMode === "vehiculo" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-transparent text-navy-300 hover:text-white"}`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2m10 0h-6m10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
          <span className="hidden sm:inline">Por Vehículo</span>
          <span className="sm:hidden">Auto</span>
        </button>
        <button 
          type="button" 
          onClick={() => setSearchMode("patente")} 
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${searchMode === "patente" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-transparent text-navy-300 hover:text-white"}`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="8" width="18" height="8" rx="2" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M7 8v8M17 8v8" />
          </svg>
          Patente
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
            className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 text-white font-black py-3 px-4 rounded-xl border border-red-300/30 transition-all flex items-center justify-center gap-1 text-sm shadow-lg shadow-red-900/30"
          >
            {isScanning ? (
              <svg className="animate-spin h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <span>Reconocer medida con IA</span>
                <span className="relative -ml-0.5 inline-flex w-5 h-5 items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z" />
                  </svg>
                  <svg className="absolute -bottom-0.5 -right-0.5 w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2 4.8L19 9l-5 2.2L12 16l-2-4.8L5 9l5-2.2L12 2z" />
                  </svg>
                </span>
              </>
            )}
            {isScanning ? (scanProgress || "Analizando foto...") : null}
          </button>
        </div>

        {scanError && (
          <div className="bg-navy-800 p-5 rounded-xl border border-orange-500/30 flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
            <div>
              <p className="text-orange-400 font-bold text-sm">No pudimos leer la medida.</p>
              <p className="text-white/70 text-xs leading-relaxed mt-1">
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

      {/* PATENTE MODE */}
      {searchMode === "patente" && (
        <form onSubmit={searchByPatente} className="flex flex-col gap-4">
          <div className="bg-navy-800/80 p-4 rounded-xl border border-navy-700/50 backdrop-blur-sm">
            <div className="flex flex-col gap-2 relative">
              <label className="text-navy-300 font-semibold text-sm">Patente del vehículo</label>
              <input
                type="text"
                placeholder="Ej: AD762AA o AB123CD"
                value={patente}
                onChange={(e) => setPatente(e.target.value.toUpperCase())}
                className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3.5 text-white font-bold text-center text-lg tracking-widest uppercase placeholder:text-navy-500 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                maxLength={7}
              />
              <div className="absolute top-[34px] left-2 bottom-2 w-4 bg-blue-600 rounded-l-lg border-r border-white/20"></div>
            </div>
            
            {patenteError && (
              <p className="text-red-400 text-xs mt-3 text-center">{patenteError}</p>
            )}
            
            <p className="text-navy-400 text-xs text-center mt-4">
              Consultaremos bases de datos públicas para obtener tu modelo exacto.
            </p>
          </div>

          <button
            type="submit"
            disabled={patente.length < 6 || patenteLoading}
            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              patente.length >= 6 && !patenteLoading
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-orange-500"
                : "bg-navy-800 text-navy-400 cursor-not-allowed border border-navy-700/50"
            }`}
          >
            {patenteLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar Vehículo
              </>
            )}
          </button>
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
