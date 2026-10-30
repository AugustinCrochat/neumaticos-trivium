"use client";

import { useState, useRef, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "@/components/ui/Link";
import { sizeCatalogHref } from "@/lib/size-href";
import { flotationToMetric, formatFlotationLabel } from "@/lib/flotation";
import { TireDiagram } from "./TireDiagram";
import { MedidaHelpDialog } from "./MedidaHelpDialog";
import { WhatsAppLink } from "./WhatsAppLink";
import { BRANCHES } from "@/lib/config";
import type { MedidaCatalogo } from "@/app/api/medidas/route";
import { irA } from "@/lib/navigate";

// Medidas del catálogo (ver /api/medidas): se piden una sola vez por pestaña, la
// primera vez que alguien enfoca el buscador. Si falla, el buscador sigue con la
// lista fija de medidas populares.
let medidasPromise: Promise<MedidaCatalogo[] | null> | null = null;
function cargarMedidas(): Promise<MedidaCatalogo[] | null> {
  medidasPromise ??= fetch("/api/medidas")
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { medidas: MedidaCatalogo[] } | null) => d?.medidas ?? null)
    .catch(() => null);
  return medidasPromise.then((m) => {
    if (!m) medidasPromise = null; // reintentar en la próxima apertura
    return m;
  });
}

type Opcion = { w: string; p: string; r: string; c: boolean; t: MedidaCatalogo["t"]; info?: MedidaCatalogo };

const TIPO_ORDEN = { n: 0, a: 1, c: 2 } as const;

const diametroMm = (w: number, p: number, r: number) => r * 25.4 + (2 * w * p) / 100;
const formatPrecio = (n: number) => `$${n.toLocaleString("es-AR")}`;

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

/**
 * Rodado más probable cuando se escribió uno fuera de 13-24 (ej. "74" por "14").
 * Primero el que cambia menos dígitos de lo escrito; si hay empate, el que
 * existe en el catálogo para ese ancho y perfil; y después el de diámetro
 * total más razonable (175/65 R14 mide ~58 cm, R24 ~89 cm).
 */
function rodadoProbable(rim: string, width: string, profile: string, opciones: { w: string; p: string; r: string }[]): number {
  const diff = (n: number) => String(n).split("").reduce((acc, ch, i) => acc + (ch === rim[i] ? 0 : 1), 0);
  const existe = (n: number) => opciones.some((o) => o.w === width && o.p === profile && o.r === String(n));
  const w = Number(width);
  const p = Number(profile);
  const diametro = (n: number) => n * 25.4 + 2 * w * (p / 100);
  const candidatos = Array.from({ length: 12 }, (_, i) => 13 + i);
  return candidatos.sort(
    (a, b) =>
      diff(a) - diff(b) ||
      Number(existe(b)) - Number(existe(a)) ||
      (Number.isFinite(diametro(a)) ? Math.abs(diametro(a) - 640) - Math.abs(diametro(b) - 640) : 0)
  )[0];
}

export function TireSizeSearch({
  initialMedida,
  compact = false,
  hideLearnLink = false,
  embedded = false,
  economicos = false,
  autoFocus = false,
  onNavigate,
  onLiveChange,
}: {
  initialMedida?: string;
  compact?: boolean;
  forceVoiceButton?: boolean;
  hideLearnLink?: boolean;
  /** Sin fondo/borde/padding propios — para cuando ya está dentro de otra tarjeta (ver SizeOrVehicleSearch). */
  embedded?: boolean;
  /** Si está activo, la búsqueda va a /buscar con el filtro de económicos. */
  economicos?: boolean;
  /** Al montarse deja el cursor en "ancho" (buscador que se abre en un modal). */
  autoFocus?: boolean;
  /** Se llama justo antes de navegar a los resultados (el modal del buscador flotante se cierra con esto). */
  onNavigate?: () => void;
  /** Se llama a cada tecla con lo escrito, para listados que filtran en vivo (catálogo). */
  onLiveChange?: (v: { w: string; p: string; r: string }) => void;
}) {
  // Ref y no closure: el reconocimiento de voz y el auto-search capturan la
  // función al arrancar, y el toggle puede cambiar después.
  const economicosRef = useRef(economicos);
  useEffect(() => {
    economicosRef.current = economicos;
  }, [economicos]);

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
  // Avisa cada cambio al listado, salvo lo que vino de la URL: ahí el listado ya
  // está filtrado y avisarle de nuevo lo pisaría con lo mismo.
  const onLiveChangeRef = useRef(onLiveChange);
  useEffect(() => {
    onLiveChangeRef.current = onLiveChange;
  }, [onLiveChange]);
  const liveInitial = useRef(init);
  useEffect(() => {
    const i = liveInitial.current;
    if (width === i.w && profile === i.p && rim === i.r) return;
    onLiveChangeRef.current?.({ w: width, p: profile, r: rim });
  }, [width, profile, rim]);
  const [shouldClearInitialOnEdit, setShouldClearInitialOnEdit] = useState(Boolean(initialMedida));
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const [showPopular, setShowPopular] = useState(false);
  const [catalogo, setCatalogo] = useState<MedidaCatalogo[] | null>(null);
  // Índice resaltado con las flechas del teclado (-1 = ninguno).
  // Atado a lo escrito: al cambiar la medida la lista se filtra y el índice viejo deja de valer.
  const [activeState, setActiveState] = useState({ key: "", index: -1 });
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (autoFocus) widthRef.current?.focus();
    // Solo al montar: no debe robar el foco en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Autos que vienen con la medida completa (para confirmar que es la correcta).
  const [voiceError, setVoiceError] = useState<string | null>(null);
  // Última medida buscada en este navegador ("195-65-15"), para repetirla con un
  // toque. En el servidor es null, así no hay diferencia de hidratación.
  const ultima = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return localStorage.getItem("trivium:ultima-medida");
      } catch {
        return null; // Sin localStorage (modo privado): no se ofrece.
      }
    },
    () => null
  );

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

  const prefijoCoincide = (o: { w: string; p: string; r: string }) =>
    (!width || o.w.startsWith(width)) && (!profile || o.p.startsWith(profile)) && (!rim || o.r.startsWith(rim));

  // Con el catálogo cargado se sugieren las medidas que realmente tenemos, con
  // stock primero; mientras tanto (o si falla el pedido) vale la lista fija.
  const opciones: Opcion[] = catalogo
    ? [...catalogo]
        .sort((a, b) => Number(b.s > 0) - Number(a.s > 0) || b.n - a.n || a.r - b.r || a.w - b.w)
        .map((m) => ({ w: String(m.w), p: String(m.p), r: String(m.r), c: m.c, t: m.t, info: m }))
    : POPULAR_SIZES.map((m) => ({ ...m, c: false, t: "n" as const }));

  const filteredSizes = opciones
    .filter((o) => !(width === o.w && profile === o.p && rim === o.r) && prefijoCoincide(o))
    .slice(0, 8);

  // Medida completa que ya está en la lista: no hace falta sugerir nada.
  const isComplete = opciones.some((o) => o.w === width && o.p === profile && o.r === rim);
  const shouldShowDropdown = showPopular && filteredSizes.length > 0 && !isComplete;
  const queryKey = `${width}|${profile}|${rim}`;
  const activeOption = activeState.key === queryKey ? activeState.index : -1;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((index) => index + 1);
    }, 1800);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showPopular || catalogo) return;
    let vivo = true;
    cargarMedidas().then((m) => {
      if (vivo && m) setCatalogo(m);
    });
    return () => {
      vivo = false;
    };
  }, [showPopular, catalogo]);

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
  // Las medidas de ejemplo que giran en el diagrama respetan lo ya escrito: con
  // 235 en el ancho sólo rotan combinaciones que existen con ese ancho.
  const ejemplos = (() => {
    const lista = hasInput ? opciones.filter((o) => !o.c && prefijoCoincide(o)).slice(0, 12) : [];
    return lista.length > 0 ? lista : POPULAR_SIZES;
  })();
  const placeholderSize = ejemplos[placeholderIndex % ejemplos.length];

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

  // Si lo escrito no es una medida estándar, la más cercana que sí lo es.
  const sizeFix = useMemo(() => {
    if (isFlotation) return null;
    const cerca = (n: number, paso: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(n / paso) * paso));
    if (width.length >= 3) {
      const w = Number(width);
      if (w < 135 || w > 355 || w % 5 !== 0) return { seg: "width" as const, value: String(cerca(w, 5, 135, 355)) };
    }
    if (profile.length >= 2) {
      const pr = Number(profile);
      if (pr < 25 || pr > 85 || pr % 5 !== 0) return { seg: "aspect" as const, value: String(cerca(pr, 5, 25, 85)) };
    }
    if (rim.length >= 2) {
      const r = Number(rim);
      if (r < 13 || r > 24) return { seg: "rim" as const, value: String(rodadoProbable(rim, width, profile, opciones)) };
    }
    return null;
  }, [isFlotation, width, profile, rim, opciones]);

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

  // Le avisa a la landing /neumaticos/[medida] que la búsqueda que la trajo
  // fue en flotation, para que muestre esa medida como protagonista y el
  // equivalente métrico como aclaración — no al revés. No usamos un query
  // param porque esa ruta es 100% estática (sin leer cookies/searchParams)
  // para poder prerenderizarse e ir por CDN; sessionStorage es la forma de
  // pasarle el dato sin volverla dinámica. Se guarda el label tal como lo
  // escribió el usuario (no se reconstruye desde el métrico al llegar,
  // porque el redondeo de flotationToMetric/metricToFlotation no siempre es
  // reversible — 31x10.5R15 puede volver como 30.5x10.5R15).
  function rememberFlotationOrigin() {
    if (!flotationEquivalent) return;
    try {
      sessionStorage.setItem(
        "trivium:flotation-origin",
        JSON.stringify({
          label: formatFlotationLabel({ diameterIn: Number(width), widthIn: flotWidthNum, rim: Number(rim) }),
          width: flotationEquivalent.width,
          profile: flotationEquivalent.profile,
          rim: flotationEquivalent.rim,
        })
      );
    } catch {
      // Safari en modo privado puede tirar QuotaExceededError — no es crítico.
    }
  }

  // Medida completa (métrica o equivalente de una flotation) que no tenemos en
  // el catálogo: en vez de mandar a una landing vacía, el buscador explica qué
  // pasa y ofrece alternativas con stock (ver el panel más abajo).
  const medidaObjetivo = flotationEquivalent
    ? { w: flotationEquivalent.width, p: flotationEquivalent.profile, r: flotationEquivalent.rim }
    : width.length === 3 && profile.length === 2 && rim.length === 2
      ? { w: Number(width), p: Number(profile), r: Number(rim) }
      : null;
  // Todas las versiones de esta medida (calle, A/T, carga) que tenemos.
  const entradas = (
    catalogo && medidaObjetivo
      ? catalogo.filter((m) => m.w === medidaObjetivo.w && m.p === medidaObjetivo.p && m.r === medidaObjetivo.r)
      : []
  ).sort((a, b) => TIPO_ORDEN[a.t] - TIPO_ORDEN[b.t]);
  const sinCatalogo = catalogo !== null && medidaObjetivo !== null && entradas.length === 0;
  const stockTotal = entradas.reduce((acc, m) => acc + m.s, 0);
  const sinStock = entradas.length > 0 && stockTotal === 0;
  // La vista previa aparece sólo cuando la medida se escribió (no cuando vino prellenada).
  const previewOk = entradas.length > 0 && !shouldClearInitialOnEdit;
  const alternativas = (sinCatalogo || sinStock) && medidaObjetivo && catalogo
    ? (() => {
        const d0 = diametroMm(medidaObjetivo.w, medidaObjetivo.p, medidaObjetivo.r);
        return catalogo
          .filter((m) => !m.c && m.s > 0 && m.r === medidaObjetivo.r)
          .filter((m, i, todas) => todas.findIndex((o) => o.w === m.w && o.p === m.p) === i)
          .map((m) => ({ m, dif: Math.abs(diametroMm(m.w, m.p, m.r) - d0) / d0 }))
          .filter((x) => x.dif <= 0.03)
          .sort((a, b) => a.dif - b.dif)
          .slice(0, 3)
          .map((x) => x.m);
      })()
    : [];

  const mw = medidaObjetivo?.w;
  const mp = medidaObjetivo?.p;
  const mr = medidaObjetivo?.r;

  // Registro de búsquedas sin resultado (no está en catálogo o no tiene stock):
  // dice qué medidas piden y no tenemos. Una vez por medida y por sesión, y con
  // un respiro para no anotar lo que se corrige enseguida. Ver la ruta de la API.
  const tipoSinResultado = sinCatalogo ? "sin_catalogo" : sinStock ? "sin_stock" : null;
  const huboAdvertencia = !!sizeWarning;
  const esFlotation = !!flotationEquivalent;
  useEffect(() => {
    if (!tipoSinResultado || !mw || !mp || !mr || shouldClearInitialOnEdit) return;
    const medida = `${mw}-${mp}-r${mr}`;
    const t = setTimeout(() => {
      const key = `trivium:sin-resultado:${tipoSinResultado}:${medida}`;
      try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {
        // Sin sessionStorage: se anota igual (puede repetirse en la sesión).
      }
      fetch("/api/busqueda-sin-resultado", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medida, tipo: tipoSinResultado, estandar: !huboAdvertencia, flotation: esFlotation, origen: window.location.pathname }),
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [tipoSinResultado, mw, mp, mr, shouldClearInitialOnEdit, huboAdvertencia, esFlotation]);

  // Perfiles y rodados que existen para lo ya escrito, con stock marcado.
  const perfilesConStock = new Map<number, boolean>(); // perfil -> ¿hay stock con este ancho?
  if (catalogo && !isFlotation && width.length === 3) {
    for (const m of catalogo) if (!m.c && String(m.w) === width) perfilesConStock.set(m.p, (perfilesConStock.get(m.p) ?? false) || m.s > 0);
  }
  const rodadosDisponibles = (() => {
    const mapa = new Map<number, { s: number; n: number }>();
    if (catalogo && !isFlotation && width.length === 3 && profile.length === 2) {
      for (const m of catalogo) {
        if (m.c || String(m.w) !== width || String(m.p) !== profile) continue;
        const e = mapa.get(m.r) ?? { s: 0, n: 0 };
        e.s += m.s;
        e.n += m.n;
        mapa.set(m.r, e);
      }
    }
    return [...mapa.entries()].sort((a, b) => a[0] - b[0]);
  })();

  const performSearch = (w: string, p: string, rVal: string) => {
    if (!w && !p && !rVal) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setShowPopular(false); // Ocultar dropdown después de búsqueda
    if (w.length === 3 && p.length === 2 && rVal.length === 2) {
      try {
        localStorage.setItem("trivium:ultima-medida", `${w}-${p}-${rVal}`);
      } catch {
        // Sin localStorage: no se recuerda, no es crítico.
      }
    }
    const href = sizeCatalogHref(w, p, rVal, economicosRef.current);
    onNavigate?.();
    irA(href);
    // Buscar de nuevo estando en /buscar cambia solo el ?query: Next conserva el scroll.
    window.scrollTo(0, 0);
  };

  // Al completar una medida estándar se busca sola (y se guarda el teclado en
  // el celular, porque performSearch saca el foco). Con una medida rara que no
  // tenemos no: queda la corrección sugerida.
  function autoBuscarAlCompletar(rimValue: string) {
    if (isFlotation || rimValue.length !== 2 || width.length !== 3 || profile.length !== 2) return;
    const w = Number(width);
    const p = Number(profile);
    const r = Number(rimValue);
    const estandar = w >= 135 && w <= 355 && w % 5 === 0 && p >= 25 && p <= 85 && p % 5 === 0 && r >= 13 && r <= 24;
    const enCatalogo = !!catalogo?.some((m) => m.w === w && m.p === p && m.r === r);
    if (estandar || enCatalogo) performSearch(width, profile, rimValue);
  }

  function executeSearch() {
    if (flotationEquivalent) {
      rememberFlotationOrigin();
      performSearch(String(flotationEquivalent.width), String(flotationEquivalent.profile), String(flotationEquivalent.rim));
    } else {
      performSearch(width, profile, rim);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (shouldShowDropdown && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const n = filteredSizes.length;
      setActiveState({ key: queryKey, index: e.key === "ArrowDown" ? (activeOption + 1) % n : (activeOption <= 0 ? n - 1 : activeOption - 1) });
      return;
    }
    if (e.key === "Escape") {
      setShowPopular(false);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const picked = shouldShowDropdown ? filteredSizes[activeOption] : undefined;
      if (picked) pickPopular(picked);
      else executeSearch();
    }
  };

  function pickPopular(s: Opcion) {
    setWidth(s.w);
    setProfile(s.p);
    setRim(s.r);
    setShowPopular(false);
    if (s.c) {
      // La medida C tiene su propia landing (otra carcasa, otro índice de carga).
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      onNavigate?.();
      irA(`/neumaticos/carga/${s.w}-${s.p}-r${s.r}c`);
      return;
    }
    performSearch(s.w, s.p, s.r);
  }

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

  // Pegar "205/55R16", "205 55 16" o "205-55-R16" en cualquier campo carga los tres.
  function handlePaste(e: React.ClipboardEvent) {
    const m = e.clipboardData.getData("text").match(/(\d{3})\s*[/\-x ]\s*(\d{2})\s*(?:zr|r|-)?\s*(\d{2})/i);
    if (!m) return;
    e.preventDefault();
    setShouldClearInitialOnEdit(false);
    setWidth(m[1]);
    setProfile(m[2]);
    setRim(m[3]);
  }

  const measureInputClass = "w-full min-w-0 bg-white border-2 border-slate-300 rounded-xl px-2 sm:px-3 py-3 text-navy-950 font-black text-center shadow-sm transition-all outline-none placeholder:text-slate-600 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-lg focus:shadow-orange-500/10";
  const measureSeparatorClass = "flex h-[52px] items-center justify-center text-lg font-black text-slate-500";
  
  const selectInputText = (e: React.SyntheticEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  function startVoiceForMeasure() {
    const Speech = (window as SpeechRecognitionWindow).SpeechRecognition || (window as SpeechRecognitionWindow).webkitSpeechRecognition;
    if (!Speech) {
      // Antes era un alert() que bloqueaba la página (y ya había borrado lo escrito).
      setVoiceError("Tu navegador no permite ingresar la medida por voz. Escribila o buscá por tu auto.");
      return;
    }
    setVoiceError(null);
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; setListening(false); return; }
    // Lo escrito se reemplaza recién cuando llega algo dicho, no al tocar el micrófono.
    let limpiado = false;
    const r = new Speech(); r.lang = 'es-AR'; r.interimResults = false; r.maxAlternatives = 1;
    r.continuous = true;
    
    let searchTimeout: ReturnType<typeof setTimeout> | undefined;
    let hasNavigated = false;

    const navigate = (w: string, p: string, rVal: string) => {
      if (hasNavigated) return;
      if (!w || !p || !rVal) return;
      hasNavigated = true;
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      onNavigate?.();
      irA(sizeCatalogHref(w, p, rVal, economicosRef.current));
    };

    r.onresult = (ev) => {
      if (!limpiado) { limpiado = true; setWidth(""); setProfile(""); setRim(""); }
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
    <div className={embedded ? "@container relative group w-full" : `@container bg-slate-100 rounded-2xl border border-slate-200 ${compact ? 'p-4' : 'p-6'} shadow-xl shadow-slate-300/40 relative group w-full`}>
      {!embedded && (
        <p className={`font-black text-navy-900 ${compact ? 'text-sm mb-2' : 'text-base mb-3'}`}>
          Buscar por medida
        </p>
      )}
      {!hideLearnLink && (
        <div className={compact ? "mb-2" : "mb-3"}>
          <MedidaHelpDialog compact={compact} />
        </div>
      )}

      <div className={compact ? undefined : "grid gap-4 @xl:grid-cols-[250px_minmax(0,1fr)] @xl:items-center @xl:gap-6"}>
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
          slim
          onSegmentSelect={focusDiagramSegment}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div ref={containerRef} className="relative" onPaste={handlePaste}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-1.5 sm:gap-3">
              <label className="block min-w-0">
                <span className="mb-1.5 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff1e00" }} />
                  Ancho <span className="font-bold normal-case text-slate-400">(mm)</span>
                </span>
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
                  className={`${measureInputClass} ${compact ? "h-14 text-xl !px-1" : "h-16 text-2xl"} placeholder:text-base placeholder:font-bold`}
                />
              </label>
              <span aria-hidden="true" className={`${measureSeparatorClass} ${compact ? "!h-14 !text-lg" : "!h-16 !text-2xl"}`}>/</span>
              <label className="block min-w-0">
                <span className="mb-1.5 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: "#6ba0d8" }} />
                  Perfil <span className="font-bold normal-case text-slate-400">(%)</span>
                </span>
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
                    // En flotation el ancho de sección es decimal (ej. "10.5"): avanzar
                    // al llegar a 2 cifras le comía la chance de escribir el punto. Solo
                    // avanzamos solo en modo métrico (perfil entero de 2 cifras).
                    const v = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.').slice(0, 5);
                    setProfile(v);
                    if (!isFlotation && v.length >= 2 && rimRef.current) { autoAdvancingRef.current = true; rimRef.current.focus(); }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="perfil"
                  aria-label="Perfil del neumático"
                  className={`${measureInputClass} ${compact ? "h-14 text-xl !px-1" : "h-16 text-2xl"} placeholder:text-base placeholder:font-bold`}
                />
              </label>
              <span aria-hidden="true" className={`${measureSeparatorClass} ${compact ? "!h-14 !text-lg" : "!h-16 !text-2xl"}`}>R</span>
              <label className="block min-w-0">
                <span className="mb-1.5 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff8066" }} />
                  Rodado <span className="font-bold normal-case text-slate-400">(″)</span>
                </span>
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
                  onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2); setRim(v); autoBuscarAlCompletar(v); }}
                  onKeyDown={handleKeyDown}
                  placeholder="rodado"
                  aria-label="Rodado del neumático"
                  className={`${measureInputClass} ${compact ? "h-14 text-xl !px-1" : "h-16 text-2xl"} placeholder:text-base placeholder:font-bold`}
                />
              </label>

            </div>

          {(
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => (hasInput ? executeSearch() : widthRef.current?.focus())}
                className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-orange-400 bg-orange-500 px-5 text-base font-black text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-400"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" strokeWidth={3} />
                  <path strokeLinecap="round" strokeWidth={3} d="M21 21l-4.3-4.3" />
                </svg>
                {compact ? "Buscar" : "Buscar neumáticos"}
              </button>
              <button
                type="button"
                onClick={startVoiceForMeasure}
                aria-label="Ingresar medida por voz"
                className={`flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-black transition-colors ${listening ? "border-red-400 bg-red-700 text-white" : "border-slate-300 bg-white text-navy-900 hover:border-red-400 hover:text-red-600"}`}
              >
                <svg className="h-4 w-4" viewBox="0 0 82.05 122.88" fill="currentColor" aria-hidden="true">
                  <path d="M59.89,20.83V52.3c0,27-37.73,27-37.73,0V20.83c0-27.77,37.73-27.77,37.73,0Zm-14.18,76V118.2a4.69,4.69,0,0,1-9.37,0V96.78a40.71,40.71,0,0,1-12.45-3.51A41.63,41.63,0,0,1,12.05,85L12,84.91A41.31,41.31,0,0,1,3.12,71.68,40.73,40.73,0,0,1,0,56a4.67,4.67,0,0,1,8-3.31l.1.1A4.68,4.68,0,0,1,9.37,56a31.27,31.27,0,0,0,2.4,12.06A32,32,0,0,0,29,85.28a31.41,31.41,0,0,0,24.13,0,31.89,31.89,0,0,0,10.29-6.9l.08-.07a32,32,0,0,0,6.82-10.22A31.27,31.27,0,0,0,72.68,56a4.69,4.69,0,0,1,9.37,0,40.65,40.65,0,0,1-3.12,15.65A41.45,41.45,0,0,1,70,85l-.09.08a41.34,41.34,0,0,1-11.75,8.18,40.86,40.86,0,0,1-12.46,3.51Z" />
                </svg>
                <span className="hidden sm:inline">{listening ? "Escuchando…" : "Por voz"}</span>
              </button>
            </div>
          )}

          {ultima && !hasInput && /^\d{3}-\d{2}-\d{2}$/.test(ultima) && (
            <button
              type="button"
              onClick={() => {
                const [w, p, r] = ultima.split("-");
                setShouldClearInitialOnEdit(false);
                setWidth(w);
                setProfile(p);
                setRim(r);
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-bold text-navy-800 hover:border-orange-400 hover:text-orange-600"
            >
              <span aria-hidden="true">↺</span> Tu última medida: {ultima.split("-")[0]}/{ultima.split("-")[1]} R{ultima.split("-")[2]}
            </button>
          )}

          {perfilesConStock.size > 0 && profile.length < 2 && (
            <div className="mt-2" aria-label={`Perfiles disponibles con ancho ${width}`}>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">Perfiles que hay con {width}</p>
              <div className="flex flex-wrap gap-1.5">
                {[...perfilesConStock.entries()].sort((a, b) => a[0] - b[0]).map(([pf, hay]) => (
                  <button
                    key={pf}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setProfile(String(pf));
                      if (rimRef.current) { autoAdvancingRef.current = true; rimRef.current.focus(); }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-black text-navy-800 hover:border-orange-400 hover:text-orange-600"
                  >
                    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${hay ? "bg-emerald-500" : "bg-slate-300"}`} />
                    {pf}
                  </button>
                ))}
              </div>
            </div>
          )}

          {rodadosDisponibles.length > 0 && rim.length < 2 && (
            <div className="mt-2" aria-label={`Rodados disponibles para ${width}/${profile}`}>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">Rodados para {width}/{profile}</p>
              <div className="flex flex-wrap gap-1.5">
                {rodadosDisponibles.map(([rd, e]) => (
                  <button
                    key={rd}
                    type="button"
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={() => setRim(String(rd))}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-black text-navy-800 hover:border-orange-400 hover:text-orange-600"
                  >
                    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${e.s > 0 ? "bg-emerald-500" : "bg-slate-300"}`} />
                    R{rd}
                    <span className="text-xs font-bold text-slate-500">{e.s > 0 ? `${e.s} con stock` : "sin stock"}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(sinCatalogo || (sinStock && previewOk)) && medidaObjetivo && (
            <div role="status" className="mt-2 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lg">
              <p className="font-black text-navy-900">
                {sinCatalogo
                  ? `Hoy no tenemos la ${medidaObjetivo.w}/${medidaObjetivo.p} R${medidaObjetivo.r} en catálogo`
                  : `La ${medidaObjetivo.w}/${medidaObjetivo.p} R${medidaObjetivo.r} no tiene stock hoy`}
              </p>
              <p className="mt-1 text-slate-600">
                {sizeWarning
                  ? "Además, no parece una medida estándar: revisá en el lateral del neumático o en la calcomanía de la puerta del conductor que la hayas leído bien."
                  : sinCatalogo
                    ? "Es una medida válida, pero no está entre las que vendemos ahora. Podemos consultarla o conseguirla."
                    : "La tenemos en catálogo pero hoy está agotada. Podemos conseguirla; mientras tanto, estas equivalentes sí tienen stock."}
              </p>
              {alternativas.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Medidas equivalentes con stock
                  </p>
                  <ul className="mt-1 divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {alternativas.map((m) => (
                      <li key={`${m.w}-${m.p}-${m.r}`}>
                        <Link
                          href={`/neumaticos/${m.w}-${m.p}-r${m.r}`}
                          className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-orange-50"
                        >
                          <span className="font-bold text-navy-900">
                            {m.w}/{m.p} R{m.r}
                          </span>
                          <span className="text-xs font-bold text-emerald-700">
                            {m.s} {m.s === 1 ? "modelo" : "modelos"} · desde {formatPrecio(m.d ?? 0)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-xs text-slate-500">
                    Diámetro total a menos de 3% de diferencia: verificá con tu taller que sirva para tu vehículo.
                  </p>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <WhatsAppLink
                  href={`https://wa.me/${BRANCHES[0].whatsapp}?text=${encodeURIComponent(`Hola! Busco neumáticos ${medidaObjetivo.w}/${medidaObjetivo.p} R${medidaObjetivo.r}, ¿los pueden conseguir?`)}`}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#ff1e00] px-4 text-sm font-black text-white"
                >
                  Consultar por WhatsApp
                </WhatsAppLink>
                <Link
                  href={sizeCatalogHref(String(medidaObjetivo.w), String(medidaObjetivo.p), String(medidaObjetivo.r), economicos)}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:border-slate-500"
                >
                  Ver igual esta medida
                </Link>
              </div>
            </div>
          )}

          {showPopular && catalogo && !sinCatalogo && !shouldShowDropdown && !isComplete && hasInput && !sizeWarning && !medidaObjetivo && (
            <p role="status" className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-lg">
              No tenemos medidas que empiecen así. Revisá los números o consultanos por WhatsApp.
            </p>
          )}

          {shouldShowDropdown && (
            // En el flujo y no `absolute`: el hero (overflow-hidden) y el modal
            // del buscador flotante (overflow-y-auto) recortaban la lista
            // cuando se pasaba del borde del contenedor.
            <div role="listbox" aria-label="Medidas populares" className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 bg-slate-50">
                {catalogo ? "Medidas en catálogo" : "Medidas populares"}
              </p>
              <div className="max-h-[240px] overflow-y-auto">
                {filteredSizes.map((s, i) => (
                  <button
                    key={`${s.w}-${s.p}-${s.r}${s.t}`}
                    type="button"
                    role="option"
                    aria-selected={i === activeOption}
                    onMouseDown={(e) => {
                      // Use onMouseDown to prevent blur before click
                      e.preventDefault();
                      pickPopular(s);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center justify-between group border-b border-slate-100 last:border-0 ${i === activeOption ? "bg-orange-50" : ""}`}
                  >
                    <span className="text-navy-900 font-bold">
                      {s.w} / {s.p} <span className="text-slate-500 font-medium">R</span>{s.r}{s.c ? "C" : ""}{s.t === "a" ? " A/T" : ""}
                    </span>
                    {s.info && (
                      s.info.s > 0 ? (
                        <span className="ml-auto mr-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {s.info.s} {s.info.s === 1 ? "modelo" : "modelos"} · desde {formatPrecio(s.info.d ?? 0)}
                        </span>
                      ) : (
                        <span className="ml-auto mr-2 text-xs font-medium text-slate-500">Sin stock hoy</span>
                      )
                    )}
                    <svg className={`w-4 h-4 text-orange-500 transition-opacity ${i === activeOption ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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

        {sizeFix && (
          <button
            type="button"
            onClick={() => {
              if (sizeFix.seg === "width") setWidth(sizeFix.value);
              else if (sizeFix.seg === "aspect") setProfile(sizeFix.value);
              else setRim(sizeFix.value);
            }}
            className="self-start rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-black text-orange-800 hover:bg-orange-100"
          >
            ¿Quisiste decir {sizeFix.value}? Corregir
          </button>
        )}

        {voiceError && (
          <p role="alert" className="text-xs font-medium leading-snug text-red-700">
            {voiceError}
          </p>
        )}

      </div>
      </div>
    </div>
  );
}
