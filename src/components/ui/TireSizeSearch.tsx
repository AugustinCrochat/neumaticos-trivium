"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sizeSearchHref } from "@/lib/size-href";
import { flotationToMetric, formatFlotationLabel } from "@/lib/flotation";
import { TireDiagram } from "./TireDiagram";

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
  embedded = false,
}: {
  initialMedida?: string;
  compact?: boolean;
  forceVoiceButton?: boolean;
  hideLearnLink?: boolean;
  /** Sin fondo/borde/padding propios — para cuando ya está dentro de otra tarjeta (ver SizeOrVehicleSearch). */
  embedded?: boolean;
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

  // Adivinamos el formato por la cantidad de dígitos del primer campo: un
  // ancho métrico real siempre tiene 3 cifras (125 a 355 mm), un diámetro
  // flotation siempre tiene 2 (24 a 40 pulgadas) — no hay superposición
  // posible, así que no hace falta que el usuario elija el modo a mano.
  const isFlotation = width.length === 2;

  const sizeWarning = useMemo(() => {
    if (isFlotation) {
      const d = Number(width);
      if (d < 24 || d > 40) {
        return `Diámetro no estándar. Los diámetros flotation van de 24" a 40" (ej: 28, 31, 33)`;
      }
      return null;
    }
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
  }, [isFlotation, width, profile, rim]);

  const widthRef = useRef<HTMLInputElement | null>(null);
  const profileRef = useRef<HTMLInputElement | null>(null);
  const rimRef = useRef<HTMLInputElement | null>(null);
  const tireEditorRef = useRef<HTMLDivElement | null>(null);
  const diagramFreshSelectionRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const autoAdvancingRef = useRef(false);

  const [focused, setFocused] = useState<MeasureSegment | null>(null);
  const [listening, setListening] = useState(false);

  // Equivalente métrico cuando adivinamos flotation (ancho = diámetro en
  // pulgadas, perfil = ancho de sección en pulgadas con decimal, rodado
  // igual en los dos formatos).
  const flotWidthNum = parseFloat(profile.replace(",", "."));
  const flotationComplete = isFlotation && rim.length === 2 && profile.trim() !== "" && !Number.isNaN(flotWidthNum);
  const flotationEquivalent = flotationComplete
    ? flotationToMetric({ diameterIn: Number(width), widthIn: flotWidthNum, rim: Number(rim) })
    : null;

  // Auto-search cuando los tres campos están completos, adivinando el
  // formato por la cantidad de dígitos del primero (ver isFlotation).
  useEffect(() => {
    if (shouldClearInitialOnEdit) return; // values came from the initialMedida prop
    const metricComplete = width.length === 3 && profile.length === 2 && rim.length === 2;
    if (!metricComplete && !flotationEquivalent) return;
    const t = setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      setShowPopular(false);
      const href = flotationEquivalent
        ? sizeSearchHref(String(flotationEquivalent.width), String(flotationEquivalent.profile), String(flotationEquivalent.rim))
        : sizeSearchHref(width, profile, rim);
      router.push(href);
    }, 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, profile, rim, flotationEquivalent]);

  const performSearch = (w: string, p: string, rVal: string) => {
    if (!w && !p && !rVal) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setShowPopular(false); // Ocultar dropdown después de búsqueda
    router.push(sizeSearchHref(w, p, rVal));
  };

  function executeSearch() {
    if (flotationEquivalent) {
      performSearch(String(flotationEquivalent.width), String(flotationEquivalent.profile), String(flotationEquivalent.rim));
    } else {
      performSearch(width, profile, rim);
    }
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
      router.push(sizeSearchHref(w, p, rVal));
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
    <div className={embedded ? "relative group w-full" : `bg-slate-100 rounded-2xl border border-slate-200 ${compact ? 'p-4' : 'p-6'} shadow-xl shadow-slate-300/40 relative group w-full`}>
      {!embedded && (
        <p className={`font-black text-navy-900 ${compact ? 'text-sm mb-2' : 'text-base mb-3'}`}>
          Buscar por medida
        </p>
      )}
      {!hideLearnLink && (
        <p className={`text-slate-600 ${compact ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
          ¿No sabés tu medida?{" "}
          <Link href="/blog/como-leer-medida-neumatico" className="font-bold text-red-600 underline underline-offset-2 hover:text-red-700">
            Aprendé a leerla acá
          </Link>
        </p>
      )}

      <p className={`text-slate-600 ${compact ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
        Escribí la medida como viene en el flanco (ej. <strong>205/55 R16</strong>) o, si es de
        camioneta, en formato flotation (ej. <strong>31x10.5 R15</strong>) — la detectamos sola.
      </p>

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
                  // Sin punto: perfil métrico normal, 2 cifras, avanza solo.
                  // Con punto: ancho de sección flotation (ej. "10.5"), el
                  // usuario pasa al rodado a mano (Enter/Tab/click).
                  const v = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.').slice(0, 5);
                  setProfile(v);
                  if (!v.includes('.') && v.length >= 2 && rimRef.current) { autoAdvancingRef.current = true; rimRef.current.focus(); }
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
                      <circle cx="11" cy="11" r="7" strokeWidth={3} />
                      <path strokeLinecap="round" strokeWidth={3} d="M21 21l-4.3-4.3" />
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
                    <circle cx="11" cy="11" r="7" strokeWidth={3} />
                    <path strokeLinecap="round" strokeWidth={3} d="M21 21l-4.3-4.3" />
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
                  <circle cx="11" cy="11" r="7" strokeWidth={3} />
                  <path strokeLinecap="round" strokeWidth={3} d="M21 21l-4.3-4.3" />
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

        {isFlotation && flotationEquivalent && (
          <p className={`font-bold text-navy-900 ${compact ? 'text-xs' : 'text-sm'}`}>
            {formatFlotationLabel({ diameterIn: Number(width), widthIn: flotWidthNum, rim: Number(rim) })}
            {" "}≈ equivalente métrico {flotationEquivalent.width}/{flotationEquivalent.profile} R{flotationEquivalent.rim}
          </p>
        )}

        {sizeWarning && (
          <p className="flex items-start gap-1.5 text-orange-700 text-[11px] font-medium leading-snug">
            <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {sizeWarning}
          </p>
        )}

      </div>
    </div>
  );
}
