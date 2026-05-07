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

  const [searchMode, setSearchMode] = useState<"medida" | "vehiculo">("medida");
  const [vehBrand, setVehBrand] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehActiveDropdown, setVehActiveDropdown] = useState<string | null>(null);

  // Custom Camera Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);
  const [lastImage, setLastImage] = useState<string | null>(null);
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

  function captureFrame(): { original: string; processed: string } {
    const video = videoRef.current!;
    const MAX_W = 1280;
    const s = Math.min(1, MAX_W / Math.max(video.videoWidth, 1));

    // Full frame at reduced scale
    const fullW = Math.round(video.videoWidth * s);
    const fullH = Math.round(video.videoHeight * s);
    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = fullW;
    fullCanvas.height = fullH;
    const fullCtx = fullCanvas.getContext("2d")!;
    fullCtx.drawImage(video, 0, 0, fullW, fullH);

    // Compute the crop that matches the orange guide (10%-90% of visible height).
    // The guide is an HTML overlay; we need to map those screen pixels back to
    // native video coordinates, accounting for object-cover scaling.
    const dispW = video.clientWidth || fullW;
    const dispH = video.clientHeight || fullH;
    const natW = video.videoWidth;
    const natH = video.videoHeight;
    const covScale = Math.max(dispW / natW, dispH / natH);
    // How many native pixels are hidden above/below due to object-cover crop
    const offsetYNative = Math.max(0, (natH - dispH / covScale) / 2);
    const rawTop = Math.max(0, offsetYNative + 0.10 * dispH / covScale);
    const rawBot = Math.min(natH, offsetYNative + 0.90 * dispH / covScale);
    const cropY = Math.round(rawTop * s);
    const cropH = Math.max(1, Math.round((rawBot - rawTop) * s));
    const cropW = fullW;

    // --- Image 1: cropped original (grayscale + contrast boost) ---
    const origCanvas = document.createElement("canvas");
    origCanvas.width = cropW;
    origCanvas.height = cropH;
    const origCtx = origCanvas.getContext("2d")!;
    origCtx.drawImage(fullCanvas, 0, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const origImg = origCtx.getImageData(0, 0, cropW, cropH);
    for (let i = 0; i < origImg.data.length; i += 4) {
      const g = 0.299 * origImg.data[i] + 0.587 * origImg.data[i + 1] + 0.114 * origImg.data[i + 2];
      const b = Math.min(255, Math.max(0, (g - 128) * 1.8 + 128));
      origImg.data[i] = origImg.data[i + 1] = origImg.data[i + 2] = b;
    }
    origCtx.putImageData(origImg, 0, 0);

    // --- Image 2: Sobel edge detection + adaptive binarization ---
    const procCanvas = document.createElement("canvas");
    procCanvas.width = cropW;
    procCanvas.height = cropH;
    const procCtx = procCanvas.getContext("2d")!;
    procCtx.drawImage(fullCanvas, 0, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const procImg = procCtx.getImageData(0, 0, cropW, cropH);
    const W = cropW, H = cropH;

    // Grayscale pass
    const gray = new Float32Array(W * H);
    for (let i = 0; i < procImg.data.length; i += 4) {
      gray[i >> 2] = 0.299 * procImg.data[i] + 0.587 * procImg.data[i + 1] + 0.114 * procImg.data[i + 2];
    }

    // Sobel edge detection
    const edges = new Float32Array(W * H);
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const gx =
          -gray[(y-1)*W+(x-1)] + gray[(y-1)*W+(x+1)]
          - 2*gray[y*W+(x-1)] + 2*gray[y*W+(x+1)]
          - gray[(y+1)*W+(x-1)] + gray[(y+1)*W+(x+1)];
        const gy =
          -gray[(y-1)*W+(x-1)] - 2*gray[(y-1)*W+x] - gray[(y-1)*W+(x+1)]
          + gray[(y+1)*W+(x-1)] + 2*gray[(y+1)*W+x] + gray[(y+1)*W+(x+1)];
        edges[y*W+x] = Math.min(255, Math.sqrt(gx*gx + gy*gy) * 0.5);
      }
    }

    // Adaptive binarization via integral image (O(n), handles uneven lighting)
    const integral = new Float64Array((W+1)*(H+1));
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        integral[(y+1)*(W+1)+(x+1)] =
          gray[y*W+x]
          + integral[y*(W+1)+(x+1)]
          + integral[(y+1)*(W+1)+x]
          - integral[y*(W+1)+x];
      }
    }
    const HALF = 24; // 48×48 px neighborhood
    const BIAS = 5;  // pixel must be BIAS points above local mean to be "white"
    const binarized = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const x0 = Math.max(0, x-HALF), x1 = Math.min(W-1, x+HALF);
        const y0 = Math.max(0, y-HALF), y1 = Math.min(H-1, y+HALF);
        const area = (x1-x0+1)*(y1-y0+1);
        const sum = integral[(y1+1)*(W+1)+(x1+1)]
                  - integral[y0*(W+1)+(x1+1)]
                  - integral[(y1+1)*(W+1)+x0]
                  + integral[y0*(W+1)+x0];
        binarized[y*W+x] = gray[y*W+x] > (sum / area) + BIAS ? 255 : 0;
      }
    }

    // Combine: white if strong Sobel edge OR adaptive binarization says bright
    for (let i = 0; i < procImg.data.length; i += 4) {
      const idx = i >> 2;
      const v = Math.max(edges[idx] > 40 ? 255 : 0, binarized[idx]);
      procImg.data[i] = procImg.data[i+1] = procImg.data[i+2] = v;
      procImg.data[i+3] = 255;
    }
    procCtx.putImageData(procImg, 0, 0);

    return {
      original: origCanvas.toDataURL("image/jpeg", 0.90),
      processed: procCanvas.toDataURL("image/jpeg", 0.90),
    };
  }

  async function tryScan(images: { original: string; processed: string }) {
    const res = await fetch("/api/scan-tire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image: images.original, base64Processed: images.processed }),
    });
    return res.json() as Promise<{ found: boolean; width?: number; profile?: number; rim?: number }>;
  }

  // Burst: 2 attempts with camera live, stop only when done
  async function captureAndScan() {
    if (!videoRef.current || isScanning) return;
    setIsScanning(true);
    setScanError(null);
    setLastImage(null);
    let found = false;
    let images = { original: "", processed: "" };

    for (let attempt = 1; attempt <= 2; attempt++) {
      setScanProgress(attempt === 1 ? "Analizando..." : "Segundo intento...");
      try {
        images = captureFrame();
        const data = await tryScan(images);
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

    if (!found) {
      setScanError("No se detectó la medida.");
      setLastImage(images.original);
    }
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
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          Por Medida
        </button>
        <button 
          onClick={() => setSearchMode("vehiculo")} 
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${searchMode === "vehiculo" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-navy-800 text-navy-300 hover:text-white border border-transparent hover:border-navy-700"}`}
        >
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2m10 0h-6m10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
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

        {scanError && lastImage && (
          <div className="bg-navy-800 p-4 rounded-xl border border-orange-500/30 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
            <p className="text-orange-400 font-bold text-sm text-center">
              No pudimos leer la medida automáticamente.
            </p>
            <div className="flex gap-4 items-center">
               <img src={lastImage} className="w-16 h-16 rounded-lg object-cover border border-white/10 shadow-lg" alt="Foto tomada" />
               <p className="text-white text-xs leading-relaxed flex-1">
                 Mandanos la foto de tu neumático a la sucursal de {selectedBranch.shortName} y un asesor experto te ayudará en el acto.
               </p>
            </div>
            <button
              onClick={async () => {
                const waText = encodeURIComponent(`Hola Trivium ${selectedBranch.shortName}! Estoy intentando buscar mis neumáticos pero el escáner no los detecta. ¿Me ayudan a identificar la medida con esta foto?`);
                try {
                  const res = await fetch(lastImage);
                  const blob = await res.blob();
                  const file = new File([blob], "neumatico.jpg", { type: "image/jpeg" });
                  if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                      files: [file],
                      title: "Trivium - Medida Neumático",
                      text: `Hola Trivium ${selectedBranch.shortName}! Estoy buscando esta medida de neumático.`,
                    });
                  } else {
                    window.open(`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`, "_blank");
                  }
                } catch (e) {
                  window.open(`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`, "_blank");
                }
              }}
              type="button"
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2 text-sm shadow-lg shadow-[#25D366]/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Enviar foto a la sucursal
            </button>
          </div>
        )}

        {scanError && !lastImage && (
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
