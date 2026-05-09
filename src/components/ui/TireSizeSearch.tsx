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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<"medida" | "vehiculo">("medida");
  const [vehBrand, setVehBrand] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehQuery, setVehQuery] = useState("");
  const [vehYear, setVehYear] = useState("");
  const [vehActiveDropdown, setVehActiveDropdown] = useState<string | null>(null);



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

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const availableWidths = useMemo(() => unique(PRODUCTS.map((p) => p.size.width)), []);
  const availableProfiles = useMemo(() => {
    if (!width) return unique(PRODUCTS.map((p) => p.size.profile));
    return unique(PRODUCTS.filter((p) => p.size.width === Number(width)).map((p) => p.size.profile));
  }, [width]);
  const availableRims = useMemo(() => unique(PRODUCTS.filter((p) => (!width || p.size.width === Number(width)) && (!profile || p.size.profile === Number(profile))).map((p) => p.size.rim)), [width, profile]);

  const availableBrands = useMemo(() => Array.from(new Set(VEHICLE_DB.map(v => v.brand))), []);
  const availableModels = useMemo(() => {
    if (!vehBrand) return [];
    return VEHICLE_DB.filter(v => v.brand === vehBrand).map(v => v.model);
  }, [vehBrand]);

  const filteredVehicles = useMemo(() => {
    const q = vehQuery.trim().toLowerCase();
    if (!q) return VEHICLE_DB.slice(0, 50);
    return VEHICLE_DB.filter(v => v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)).slice(0, 50);
  }, [vehQuery]);
  const selectedVehicle = useMemo(() => VEHICLE_DB.find(v => v.brand === vehBrand && v.model === vehModel), [vehBrand, vehModel]);

  function handleSearch() {
    if (!width && !profile && !rim) return;
    router.push(`/buscar?medida=${width}-${profile}-r${rim}`);
  }

  useEffect(() => {
    if (width && profile && rim && !activeDropdown) handleSearch();
  }, [width, profile, rim, activeDropdown]);

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

  function onWidthChange(v: string) { setWidth(v); setProfile(""); setRim(""); setActiveDropdown("profile"); }
  function onProfileChange(v: string) { setProfile(v); setRim(""); setActiveDropdown("rim"); }
  function onRimChange(v: string) { setRim(v); setActiveDropdown(null); }



  async function startCamera() {
    setShowScanner(true); setScanError(null); setLowLight(false);
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    } catch { }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      if (capabilities.torch) setHasTorch(true);
    } catch (err) { setScanError("No pudimos acceder a tu cámara."); setShowScanner(false); }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch { }
    setShowScanner(false); setHasTorch(false); setTorchOn(false); setLowLight(false);
  }

  async function toggleTorch() {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try { await track.applyConstraints({ advanced: [{ torch: !torchOn }] } as any); setTorchOn(t => !t); } catch { }
  }

  function captureFrame(): { original: string; processed: string } {
    const video = videoRef.current!;
    const natW = video.videoWidth; const natH = video.videoHeight;
    const shortSide = Math.min(natW, natH);
    const cropSize = Math.round(shortSide * 0.98);
    const cropX = Math.round((natW - cropSize) / 2);
    const cropY = Math.round((natH - cropSize) / 2);
    const TARGET_SIZE = 1027; 
    const canvas1 = document.createElement("canvas"); canvas1.width = TARGET_SIZE; canvas1.height = TARGET_SIZE;
    const ctx1 = canvas1.getContext("2d")!;
    ctx1.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, TARGET_SIZE, TARGET_SIZE);
    const original = canvas1.toDataURL("image/jpeg", 0.75);
    const canvas2 = document.createElement("canvas"); canvas2.width = TARGET_SIZE; canvas2.height = TARGET_SIZE;
    const ctx2 = canvas2.getContext("2d")!;
    ctx2.filter = "contrast(1.6) brightness(1.1) saturate(0)"; 
    ctx2.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, TARGET_SIZE, TARGET_SIZE);
    const processed = canvas2.toDataURL("image/jpeg", 0.75);
    return { original, processed };
  }

  async function tryScan(images: { original: string; processed: string }) {
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch("/api/scan-tire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ base64Image: images.original, base64Processed: images.processed }), signal: controller.signal });
      return res.json() as Promise<any>;
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
        setActiveDropdown(null); stopCamera();
      } else { 
        setScanError(data.message || "No pudimos detectar la medida automáticamente."); 
        stopCamera();
      }
    } catch (err) { 
      setScanError("La IA tardó demasiado."); 
      stopCamera();
    }
    finally { setIsScanning(false); setScanProgress(""); }
  }

  const isValid = !!(width && profile && rim);
  const canSearch = !!(width || profile || rim);

  function startVoiceForVehicle() {
    const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Speech) return alert('Tu navegador no soporta reconocimiento de voz');
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; setListening(false); return; }
    const r = new Speech();
    r.lang = 'es-AR';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev: any) => {
      const txt = ev.results[0][0].transcript || '';
      // detect year 4 digits
      const yearMatch = txt.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) setVehYear(yearMatch[0]);
      setVehQuery(txt);
    };
    r.onend = () => { recognitionRef.current = null; setListening(false); };
    recognitionRef.current = r; setListening(true); r.start();
  }

  function startVoiceForMeasure() {
    const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Speech) return alert('Tu navegador no soporta reconocimiento de voz');
    const r = new Speech(); r.lang = 'es-AR'; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = (ev: any) => {
      const txt = (ev.results[0][0].transcript || '').replace(/[^0-9 ]/g, ' ').trim();
      const nums = txt.split(/\s+/).filter(Boolean);
      if (nums.length >= 1) setWidth(nums[0].slice(0,3));
      if (nums.length >= 2) setProfile(nums[1].slice(0,2));
      if (nums.length >= 3) setRim(nums[2].slice(0,2));
      // focus next
      if (nums.length >= 1 && profileRef.current) profileRef.current.focus();
      if (nums.length >= 2 && rimRef.current) rimRef.current.focus();
    };
    r.onend = () => {};
    r.start();
  }

  return (
    <>
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

      </div>

      {searchMode === "medida" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <input ref={widthRef} value={width} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0,3); setWidth(v); if (v.length >= 3 && profileRef.current) profileRef.current.focus(); }} placeholder="Ancho" className="w-full bg-navy-800 border-2 rounded-xl px-3 py-3 text-white font-bold text-center" />
            <input ref={profileRef} value={profile} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2); setProfile(v); if (v.length >= 2 && rimRef.current) rimRef.current.focus(); }} placeholder="Perfil" className="w-full bg-navy-800 border-2 rounded-xl px-3 py-3 text-white font-bold text-center" />
            <input ref={rimRef} value={rim} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2); setRim(v); }} placeholder="Rodado" className="w-full bg-navy-800 border-2 rounded-xl px-3 py-3 text-white font-bold text-center" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={startVoiceForMeasure} className="flex-1 bg-navy-700 text-white font-bold py-3 rounded-xl">🎤 Voz</button>
            <button type="button" onClick={startCamera} className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl">📷 Escanear</button>
          </div>

          {scanError && (
            <div className="bg-navy-800 p-5 rounded-xl border border-orange-500/30 flex flex-col gap-4 animate-in fade-in zoom-in duration-300 mt-2">
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

          <button
            type="submit"
            disabled={!canSearch}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-navy-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-900/20 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            BUSCAR NEUMÁTICOS
          </button>
        </div>
      )}

      {searchMode === "vehiculo" && (
        <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if (selectedVehicle) { const s = selectedVehicle.sizes[0]; router.push(`/buscar?medida=${s.w}-${s.p}-r${s.r}`); } }}>
          <input type="text" placeholder="Buscar por marca o modelo" value={vehQuery} onChange={(e) => { setVehQuery(e.target.value); setVehBrand(""); setVehModel(""); }} className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white font-bold" />
          <div className="bg-navy-800 border border-navy-700 rounded-xl max-h-48 overflow-y-auto">
            {filteredVehicles.map((v) => (
              <button type="button" key={`${v.brand}-${v.model}`} onClick={() => { setVehBrand(v.brand); setVehModel(v.model); setVehQuery(""); }} className="w-full text-left px-4 py-3 border-b border-navy-700 hover:bg-navy-700 transition-colors text-white">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold">{v.brand}</span>
                  <span className="font-bold text-sm text-white/80">{v.model}</span>
                </div>
              </button>
            ))}
            {filteredVehicles.length === 0 && (
              <div className="p-4 text-white/70">No hay resultados</div>
            )}
          </div>

          {selectedVehicle && (
            <div className="bg-navy-800 p-4 rounded-xl border border-navy-700">
              <p className="text-white font-bold mb-2 text-center">Medidas recomendadas para {selectedVehicle.brand} {selectedVehicle.model}{vehYear ? ` — año ${vehYear}` : ''}</p>
              {vehYear && !(selectedVehicle as any).years && (
                <p className="text-white/60 text-xs mb-3 text-center">No tenemos datos por año para este modelo en la base; seleccioná la versión/trim o consultanos si dudás.</p>
              )}

              {selectedVehicle.sizes.length > 1 ? (
                <>
                  <p className="text-white/60 text-sm mb-3 text-center">Este modelo tiene varias versiones. Si conocés la versión/trim, elegila; si no, elegí la medida correspondiente abajo.</p>
                  <div className="flex flex-col gap-2">
                    {selectedVehicle.sizes.map((s, i) => (
                      <button key={i} onClick={() => router.push(`/buscar?medida=${s.w}-${s.p}-r${s.r}${vehYear ? `&year=${vehYear}` : ''}`)} className="w-full text-white py-3 px-4 rounded-lg bg-navy-900 border border-navy-700 text-left hover:border-orange-500 transition-colors font-mono flex items-center justify-between">
                        <span>Versión {i + 1}</span>
                        <span className="text-xs text-white/70">{s.w}/{s.p} R{s.r}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedVehicle.sizes.map((s, i) => (
                    <button key={i} onClick={() => router.push(`/buscar?medida=${s.w}-${s.p}-r${s.r}${vehYear ? `&year=${vehYear}` : ''}`)} className="w-full text-white py-3 px-4 rounded-lg bg-navy-900 border border-navy-700 text-left hover:border-orange-500 transition-colors font-mono">
                      {s.w}/{s.p} R{s.r}
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}
        </form>
      )}


    </>
  );
}

function CustomSelect({ label, value, onChange, placeholder, options, formatOption, isOpen, onToggle, isActive, disabled }: any) {
  return (
    <div className="flex-1 relative">
      <button type="button" onClick={onToggle} disabled={disabled} className={`w-full bg-navy-800 border-2 rounded-xl px-2 py-3 text-sm font-bold text-white transition-all ${isActive ? "border-orange-500 shadow-lg shadow-orange-500/10" : "border-navy-700"} ${disabled ? "opacity-30" : ""}`}>
        {value ? (formatOption ? formatOption(value) : value) : placeholder}
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-navy-800 border-2 border-navy-700 rounded-xl z-50 max-h-40 overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((opt: string) => (
            <button key={opt} onClick={() => { onChange(opt); }} className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${value === opt ? "text-orange-500 bg-navy-700" : "text-white hover:bg-navy-700"}`}>
              {formatOption ? formatOption(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
