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
  const [searchMode, setSearchMode] = useState<"medida" | "vehiculo" | "patente">("medida");
  const [vehBrand, setVehBrand] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehActiveDropdown, setVehActiveDropdown] = useState<string | null>(null);

  const [patente, setPatente] = useState("");
  const [patenteLoading, setPatenteLoading] = useState(false);
  const [patenteError, setPatenteError] = useState<string | null>(null);

  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

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
  const selectedVehicle = useMemo(() => VEHICLE_DB.find(v => v.brand === vehBrand && v.model === vehModel), [vehBrand, vehModel]);

  function handleSearch() {
    if (!width && !profile && !rim) return;
    router.push(`/buscar?medida=${width}-${profile}-r${rim}`);
  }

  useEffect(() => {
    if (width && profile && rim && !activeDropdown) handleSearch();
  }, [width, profile, rim, activeDropdown]);

  function onWidthChange(v: string) { setWidth(v); setProfile(""); setRim(""); setActiveDropdown("profile"); }
  function onProfileChange(v: string) { setProfile(v); setRim(""); setActiveDropdown("rim"); }
  function onRimChange(v: string) { setRim(v); setActiveDropdown(null); }

  async function searchByPatente(e: React.FormEvent) {
    e.preventDefault();
    if (!patente) return;
    setPatenteLoading(true); setPatenteError(null);
    try {
      const res = await fetch("/api/patente", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patente }) });
      if (!res.ok) throw new Error("Error obteniendo datos");
      const data = await res.json();
      if (data.brand && data.model) { setVehBrand(data.brand); setVehModel(data.model); setSearchMode("vehiculo"); }
      else setPatenteError("No encontramos un modelo asociado a esta patente.");
    } catch (err) { setPatenteError("Hubo un problema consultando la patente."); }
    finally { setPatenteLoading(false); }
  }

  async function startCamera() {
    setShowScanner(true); setScanError(null);
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
    setShowScanner(false); setHasTorch(false); setTorchOn(false);
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
    const TARGET_SIZE = 1600; 
    const canvas1 = document.createElement("canvas"); canvas1.width = TARGET_SIZE; canvas1.height = TARGET_SIZE;
    const ctx1 = canvas1.getContext("2d")!;
    ctx1.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, TARGET_SIZE, TARGET_SIZE);
    const original = canvas1.toDataURL("image/jpeg", 0.90);
    const canvas2 = document.createElement("canvas"); canvas2.width = TARGET_SIZE; canvas2.height = TARGET_SIZE;
    const ctx2 = canvas2.getContext("2d")!;
    ctx2.filter = "contrast(1.6) brightness(1.1) saturate(0)"; 
    ctx2.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, TARGET_SIZE, TARGET_SIZE);
    const processed = canvas2.toDataURL("image/jpeg", 0.85);
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
      } else { setScanError("No pudimos detectar la medida."); }
    } catch (err) { setScanError("La IA tardó demasiado."); }
    finally { setIsScanning(false); setScanProgress(""); }
  }

  return (
    <>
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={stopCamera} className="bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm">Cancelar</button>
            {hasTorch && (
              <button onClick={toggleTorch} className={`px-5 py-2.5 rounded-full font-bold text-sm ${torchOn ? 'bg-yellow-400 text-black' : 'bg-yellow-400/20 text-yellow-300'}`}>
                {torchOn ? 'Flash ON' : 'Flash'}
              </button>
            )}
          </div>

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
            {!isScanning && (
              <div className="absolute top-[75%] left-1/2 -translate-x-1/2 z-30">
                <span className="text-white text-xs font-bold uppercase tracking-widest animate-pulse bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                  Presioná para escanear
                </span>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 pb-10 pt-6 z-20 flex flex-col items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
            {isScanning && <span className="text-white/80 text-sm font-medium">{scanProgress}</span>}
            <button onClick={captureAndScan} disabled={isScanning} className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center active:scale-95 disabled:opacity-40">
              {isScanning ? <svg className="w-8 h-8 text-white animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : <div className="w-16 h-16 rounded-full bg-white" />}
            </button>
          </div>
        </div>
      )}

      <div className="flex bg-navy-800/50 p-1.5 rounded-2xl mb-6 shadow-inner border border-navy-700/50">
        {["medida", "vehiculo", "patente"].map(mode => (
          <button key={mode} onClick={() => setSearchMode(mode as any)} className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${searchMode === mode ? "bg-orange-500 text-white" : "text-navy-300"}`}>
            {mode === "medida" ? "Medida" : mode === "vehiculo" ? "Auto" : "Patente"}
          </button>
        ))}
      </div>

      {searchMode === "medida" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
             <CustomSelect label="Ancho" value={width} onChange={onWidthChange} placeholder="Ancho" options={availableWidths.map(String)} isOpen={activeDropdown === "width"} onToggle={() => setActiveDropdown(activeDropdown === "width" ? null : "width")} isActive={activeDropdown === "width"} />
             <CustomSelect label="Perfil" value={profile} onChange={onProfileChange} placeholder="Perfil" options={availableProfiles.map(String)} isOpen={activeDropdown === "profile"} onToggle={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")} isActive={activeDropdown === "profile"} />
             <CustomSelect label="Rodado" value={rim} onChange={onRimChange} placeholder="Rodado" options={availableRims.map(String)} formatOption={(v: string) => `R${v}`} isOpen={activeDropdown === "rim"} onToggle={() => setActiveDropdown(activeDropdown === "rim" ? null : "rim")} isActive={activeDropdown === "rim"} />
          </div>
          <button type="button" onClick={startCamera} className="w-full bg-red-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2">
            Reconocer medida con IA
          </button>
          {scanError && <div className="text-orange-500 text-sm font-bold text-center mt-2">{scanError}</div>}
          <button onClick={handleSearch} disabled={!width || !profile || !rim} className="w-full bg-orange-500 text-white font-black py-4 rounded-xl mt-2 shadow-lg shadow-orange-500/20">BUSCAR NEUMÁTICOS</button>
        </div>
      )}

      {searchMode === "vehiculo" && (
        <div className="grid grid-cols-2 gap-3">
           <CustomSelect label="Marca" value={vehBrand} onChange={(v: string) => { setVehBrand(v); setVehModel(""); }} placeholder="Marca" options={availableBrands} isOpen={vehActiveDropdown === "brand"} onToggle={() => setVehActiveDropdown(vehActiveDropdown === "brand" ? null : "brand")} isActive={vehActiveDropdown === "brand"} />
           <CustomSelect label="Modelo" value={vehModel} onChange={setVehModel} placeholder="Modelo" options={availableModels} isOpen={vehActiveDropdown === "model"} onToggle={() => setVehActiveDropdown(vehActiveDropdown === "model" ? null : "model")} isActive={vehActiveDropdown === "model"} disabled={!vehBrand} />
           {selectedVehicle && (
             <div className="col-span-2 mt-4 bg-navy-800 p-4 rounded-xl border border-navy-700">
               <p className="text-white font-bold mb-4 text-center">Seleccioná la medida:</p>
               <div className="flex flex-col gap-2">
                 {selectedVehicle.sizes.map((s, i) => (
                   <button key={i} onClick={() => router.push(`/buscar?medida=${s.w}-${s.p}-r${s.r}`)} className="w-full text-white py-3 px-4 rounded-lg bg-navy-900 border border-navy-700 text-left hover:border-orange-500 transition-colors font-mono">{s.w}/{s.p} R{s.r}</button>
                 ))}
               </div>
             </div>
           )}
        </div>
      )}

      {searchMode === "patente" && (
        <form onSubmit={searchByPatente} className="flex flex-col gap-4">
          <input type="text" placeholder="ABC 123" value={patente} onChange={e => setPatente(e.target.value.toUpperCase())} className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-4 text-white font-bold text-center text-xl tracking-widest uppercase" maxLength={7} />
          <button type="submit" disabled={patente.length < 6 || patenteLoading} className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20">
            {patenteLoading ? "Buscando..." : "Buscar Vehículo"}
          </button>
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
            <button key={opt} onClick={() => { onChange(opt); onToggle(); }} className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${value === opt ? "text-orange-500 bg-navy-700" : "text-white hover:bg-navy-700"}`}>
              {formatOption ? formatOption(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
