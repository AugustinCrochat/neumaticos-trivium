"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link";
import maplibregl, { type ExpressionSpecification, type Map, type Marker } from "maplibre-gl";
import type { Branch } from "@/lib/config";
import { useBranch } from "@/contexts/branch-context";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type ComingSoonBranch = {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
};

type BranchesMapProps = {
  branches: Branch[];
  /** Sucursales anunciadas pero todavía sin abrir — pin propio, punteado, sin
      las interacciones de una sucursal real (no tiene POS, teléfono ni
      horarios: no se puede seleccionar como sucursal activa). */
  comingSoon?: ComingSoonBranch[];
};

type UserLocation = {
  lat: number;
  lng: number;
};

const MAPTILER_KEY = "rZs55HHnOgNdmSMB2Jkn";
const MAP_STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
const ARGENTINA_MIN_ZOOM = 3.5;
const MAP_LOCALE = {
  "CooperativeGesturesHandler.WindowsHelpText": "Usa Ctrl + scroll para acercar o alejar el mapa",
  "CooperativeGesturesHandler.MacHelpText": "Usa ⌘ + scroll para acercar o alejar el mapa",
  "CooperativeGesturesHandler.MobileHelpText": "Usa dos dedos para mover el mapa",
};

// Valor por defecto estable: un `= []` en los parámetros crea un array nuevo en
// cada render, y como `comingSoon` está en las dependencias del efecto que crea
// el mapa, cada cambio de estado (p. ej. al ubicar la sucursal más cercana)
// destruía el mapa y lo recreaba centrado en la sucursal inicial.
const NO_COMING_SOON: ComingSoonBranch[] = [];

function getDistanceInKm(from: UserLocation, to: UserLocation) {
  const earthRadiusKm = 6371;
  const latDelta = ((to.lat - from.lat) * Math.PI) / 180;
  const lngDelta = ((to.lng - from.lng) * Math.PI) / 180;
  const fromLat = (from.lat * Math.PI) / 180;
  const toLat = (to.lat * Math.PI) / 180;
  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getBranchLngLat(branch: Branch): [number, number] {
  return [branch.coordinates.lng, branch.coordinates.lat];
}

// Pines de sucursal como capas nativas del mapa (fuente GeoJSON + symbol
// layers), NO como maplibregl.Marker: el Marker reposiciona un <div> por CSS en
// cada frame y su smartWrap podía dejar el pin corrido de su ubicación real en
// un zoom-out rápido (se vio con San Justo, dos veces). Una capa GL la
// posiciona el renderer a partir de la fuente + cámara, sin estado en JS.
const pinImageExpr = (activeId: string): ExpressionSpecification => [
  "case", ["==", ["get", "id"], activeId], "pin-sucursal-activa", "pin-sucursal",
];
const pinSizeExpr = (activeId: string): ExpressionSpecification => [
  "case", ["==", ["get", "id"], activeId], 1.12, 1,
];
const PIN_BORDER = "#000000";
const PIN_BORDER_ACTIVE = "#ff1e00";

// Dibuja la insignia (cuadrado blanco redondeado con borde, logo y puntero) a
// 2x para pantallas retina; se registra con pixelRatio 2 (52×60 px CSS).
function drawPinImage(logo: HTMLImageElement, borderColor: string) {
  const ratio = 2;
  const w = 56;
  const h = 66;
  const canvas = document.createElement("canvas");
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(ratio, ratio);
  const box = 52;
  const x0 = (w - box) / 2;
  const y0 = 2;
  ctx.shadowColor = "rgba(10,26,48,0.35)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x0 + 1, y0 + 1, box - 2, box - 2, 15);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.stroke();
  const pad = 8;
  const inner = box - pad * 2;
  const scale = Math.min(inner / logo.naturalWidth, inner / logo.naturalHeight);
  const lw = logo.naturalWidth * scale;
  const lh = logo.naturalHeight * scale;
  ctx.drawImage(logo, x0 + (box - lw) / 2, y0 + (box - lh) / 2, lw, lh);
  ctx.fillStyle = borderColor;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 6, y0 + box - 1);
  ctx.lineTo(w / 2 + 6, y0 + box - 1);
  ctx.lineTo(w / 2, y0 + box + 8);
  ctx.closePath();
  ctx.fill();
  return { data: ctx.getImageData(0, 0, canvas.width, canvas.height), ratio };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function createUserMarkerElement() {
  const wrapper = document.createElement("div");
  wrapper.className = "trivium-user-pin";
  wrapper.setAttribute("aria-label", "Tu ubicacion");
  return wrapper;
}

type BranchSummaryProps = {
  branch: Branch;
  isActive: boolean;
  isSelected: boolean;
  onSelectBranch: (branch: Branch) => void;
};

function BranchSummary({
  branch,
  isActive,
  isSelected,
  onSelectBranch,
}: BranchSummaryProps) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
        isActive
          ? "border-orange-500 shadow-xl shadow-orange-500/10"
          : "border-slate-200 hover:border-navy-200"
      }`}
    >
      {branch.facadePhoto && (
        // aspect-[4/3]: es la proporción real de la foto — con una altura fija
        // (antes h-44) se recortaba de más según el ancho de la tarjeta.
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={branch.facadePhoto}
            alt={`Fachada del local de Neumáticos Trivium ${branch.shortName}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 512px"
          />
        </div>
      )}
      <div className="p-5">
      <button
        type="button"
        onClick={() => onSelectBranch(branch)}
        className="flex w-full items-start gap-4 text-left"
      >
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50">
          <Image src="/icon.svg" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="block text-lg font-black text-navy-900">{branch.name}</span>
            {isSelected && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                Tu sucursal
              </span>
            )}
          </span>
          <span className="mt-1 block text-sm text-slate-600">{branch.address}</span>
          <span className="block text-sm text-slate-600">{branch.city}</span>
        </span>
      </button>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Horarios
          </dt>
          <dd className="mt-0.5 text-slate-700">{branch.hours}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Telefono
          </dt>
          <dd className="mt-0.5 text-slate-700">{branch.phone}</dd>
        </div>
      </dl>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <WhatsAppLink
          href={`https://wa.me/${branch.whatsapp}`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-black text-white shadow-sm shadow-[#25d366]/20 transition-colors hover:bg-[#1fbd59]"
        >
          <WhatsAppIcon className="mr-2 h-5 w-5" />
          WhatsApp
        </WhatsAppLink>
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm font-black text-navy-900 shadow-sm transition-colors hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700"
        >
          <DirectionsIcon className="mr-2 h-6 w-6" />
          Cómo llegar
        </a>
      </div>

      <Link
        href={`/sucursales/${branch.id}`}
        className="mt-2 inline-flex w-full min-h-11 items-center justify-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-black"
      >
        Ver información de la sucursal
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
      </div>
    </article>
  );
}

export function BranchesMap({ branches, comingSoon = NO_COMING_SOON }: BranchesMapProps) {
  const { selectedBranch, hasConfirmedBranch } = useBranch();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const activeIdRef = useRef<string>("");
  const initialBranchRef = useRef<Branch | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [geoError, setGeoError] = useState("");

  const activeBranch = useMemo(
    () =>
      branches.find((branch) => branch.id === (activeBranchId ?? selectedBranch.id)) ??
      branches[0],
    [activeBranchId, branches, selectedBranch.id]
  );

  const sortedBranches = useMemo(() => {
    return [...branches].sort((a, b) => {
      if (a.id === activeBranch.id) return -1;
      if (b.id === activeBranch.id) return 1;
      return a.shortName.localeCompare(b.shortName);
    });
  }, [activeBranch.id, branches]);

  if (!initialBranchRef.current && activeBranch) {
    initialBranchRef.current = activeBranch;
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const initialBranch = initialBranchRef.current ?? branches[0];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: getBranchLngLat(initialBranch),
      zoom: 12,
      minZoom: ARGENTINA_MIN_ZOOM,
      maxZoom: 17,
      cooperativeGestures: true,
      // Sin copias del mundo, Marker no corre su lngLat ±360° (smartWrap) en
      // un zoom-out rápido: ese salto dejaba el pin de San Justo a cientos de
      // km de su ubicación real. Sólo se muestra Argentina, no hacen falta.
      renderWorldCopies: false,
      locale: MAP_LOCALE,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      "top-right"
    );
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
    map.touchZoomRotate.enable();
    map.dragPan.enable();
    map.scrollZoom.enable();
    map.on("load", () => {
      map.resize();

      loadImage("/pin-trivium.png")
        .then((logo) => {
          const normal = drawPinImage(logo, PIN_BORDER);
          const active = drawPinImage(logo, PIN_BORDER_ACTIVE);
          if (!map.hasImage("pin-sucursal")) map.addImage("pin-sucursal", normal.data, { pixelRatio: normal.ratio });
          if (!map.hasImage("pin-sucursal-activa")) map.addImage("pin-sucursal-activa", active.data, { pixelRatio: active.ratio });

          map.addSource("branches", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: branches.map((branch) => ({
                type: "Feature",
                properties: { id: branch.id, name: branch.shortName },
                geometry: { type: "Point", coordinates: getBranchLngLat(branch) },
              })),
            },
          });
          map.addLayer({
            id: "branches-label",
            type: "symbol",
            source: "branches",
            layout: {
              "text-field": ["get", "name"],
              "text-size": 12,
              "text-offset": [0, 0.6],
              "text-anchor": "top",
              "text-allow-overlap": true,
            },
            paint: { "text-color": "#000000", "text-halo-color": "#ffffff", "text-halo-width": 2 },
          });
          map.addLayer({
            id: "branches-icon",
            type: "symbol",
            source: "branches",
            layout: {
              "icon-image": pinImageExpr(activeIdRef.current),
              "icon-size": pinSizeExpr(activeIdRef.current),
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
            },
          });
          map.on("click", "branches-icon", (e) => {
            const id = e.features?.[0]?.properties?.id;
            const branch = branches.find((b) => b.id === id);
            if (branch) selectBranch(branch);
          });
          map.on("mouseenter", "branches-icon", () => { map.getCanvas().style.cursor = "pointer"; });
          map.on("mouseleave", "branches-icon", () => { map.getCanvas().style.cursor = ""; });
        })
        .catch(() => {});

      // El pin de "próximamente" se renderiza como capa nativa del mapa
      // (fuente GeoJSON + circle/symbol layers), NO como maplibregl.Marker.
      // Se vio en un video que el Marker de San Justo saltaba a cientos de
      // km de su lngLat real durante un zoom-out rápido y se quedaba ahí —
      // revisando el código fuente de maplibre-gl, Marker recalcula su
      // posición en cada frame reposicionando un <div> por CSS (incluyendo
      // una lógica de "smart wrap" que puede mutar la lngLat interna del
      // marker), y un resync manual en zoomend/moveend no alcanzó a
      // corregirlo. Una capa GL no tiene ese problema: la posiciona
      // directamente el renderer WebGL a partir de la fuente + la cámara
      // actual en cada frame, sin ningún estado intermedio en JS que se
      // pueda desincronizar.
      if (comingSoon.length > 0) {
        map.addSource("coming-soon", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: comingSoon.map((soon) => ({
              type: "Feature",
              properties: { name: soon.name, address: soon.address },
              geometry: { type: "Point", coordinates: [soon.coordinates.lng, soon.coordinates.lat] },
            })),
          },
        });

        map.addLayer({
          id: "coming-soon-label",
          type: "symbol",
          source: "coming-soon",
          layout: {
            "text-field": ["concat", "Próximamente · ", ["get", "name"]],
            "text-size": 11,
            "text-offset": [0, 0.6],
            "text-anchor": "top",
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": "#c2410c",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2,
          },
        });

        // pin-proximamente.png es una insignia pre-compuesta (fondo redondeado
        // + borde naranja + triangulo puntero + logo semitransparente) del
        // mismo estilo que el pin de sucursal real, para poder usarla como
        // icono de una capa GL (un circle layer no puede dibujar la forma
        // redondeada con puntero). Es de 208×240px (4x de 52×60px) para verse
        // nítida en pantallas retina; icon-size 0.25 la renderiza a 52px de
        // ancho, igual que el badge de las sucursales reales.
        map.loadImage("/pin-proximamente.png").then(({data}) => {
          if (!map.hasImage("pin-proximamente")) map.addImage("pin-proximamente", data);
          map.addLayer({
            id: "coming-soon-icon",
            type: "symbol",
            source: "coming-soon",
            layout: {
              "icon-image": "pin-proximamente",
              "icon-size": 0.25,
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
            },
          });

          const soonPopup = new maplibregl.Popup({ offset: 16, closeButton: true });
          map.on("click", "coming-soon-icon", (e) => {
            const feature = e.features?.[0];
            if (!feature || feature.geometry.type !== "Point") return;
            const [lng, lat] = feature.geometry.coordinates;
            soonPopup
              .setLngLat([lng, lat])
              .setHTML(`<strong>${feature.properties?.name} — próximamente</strong><br/>${feature.properties?.address}`)
              .addTo(map);
          });
          map.on("mouseenter", "coming-soon-icon", () => { map.getCanvas().style.cursor = "pointer"; });
          map.on("mouseleave", "coming-soon-icon", () => { map.getCanvas().style.cursor = ""; });
        }).catch(() => {});
      }
    });

    mapRef.current = map;
    window.setTimeout(() => map.resize(), 0);

    return () => {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [branches, comingSoon]);

  // Resalta el pin de la sucursal activa: las expresiones de la capa leen el id
  // activo, así que se vuelven a setear con el valor nuevo.
  useEffect(() => {
    activeIdRef.current = activeBranch.id;
    const map = mapRef.current;
    if (!map || !map.getLayer("branches-icon")) return;
    map.setLayoutProperty("branches-icon", "icon-image", pinImageExpr(activeBranch.id));
    map.setLayoutProperty("branches-icon", "icon-size", pinSizeExpr(activeBranch.id));
  }, [activeBranch.id]);

  useEffect(() => {
    if (activeBranchId) return;

    mapRef.current?.flyTo({
      center: getBranchLngLat(activeBranch),
      zoom: Math.max(mapRef.current.getZoom(), 12),
      essential: true,
    });
  }, [activeBranch, activeBranchId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    userMarkerRef.current?.remove();
    userMarkerRef.current = new maplibregl.Marker({
      element: createUserMarkerElement(),
      anchor: "center",
    })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map);
  }, [userLocation]);

  if (!activeBranch) return null;

  function selectBranch(branch: Branch) {
    setActiveBranchId(branch.id);
    mapRef.current?.flyTo({
      center: getBranchLngLat(branch),
      zoom: Math.max(mapRef.current.getZoom(), 13),
      essential: true,
    });
  }

  function locateNearestBranch() {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setGeoError("Tu navegador no permite obtener ubicacion.");
      return;
    }

    setGeoStatus("loading");
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const nearestBranch = branches.reduce((nearest, branch) => {
          const currentDistance = getDistanceInKm(nextLocation, branch.coordinates);
          const nearestDistance = getDistanceInKm(nextLocation, nearest.coordinates);
          return currentDistance < nearestDistance ? branch : nearest;
        }, branches[0]);
        const bounds = new maplibregl.LngLatBounds()
          .extend([nextLocation.lng, nextLocation.lat])
          .extend(getBranchLngLat(nearestBranch));

        setUserLocation(nextLocation);
        setActiveBranchId(nearestBranch.id);
        setGeoStatus("ready");
        // Con un padding fijo de 110px, un mapa más bajo/angosto que 220px no
        // puede "contener" los bounds y MapLibre deja la cámara quieta sin
        // avisar: la tarjeta se marcaba pero el mapa no se movía. El padding
        // se limita a una fracción del tamaño real del contenedor.
        const map = mapRef.current;
        if (map) {
          const { clientWidth, clientHeight } = map.getContainer();
          const padX = Math.min(110, Math.floor(clientWidth * 0.2));
          const padY = Math.min(110, Math.floor(clientHeight * 0.2));
          map.resize();
          map.fitBounds(bounds, {
            padding: { top: padY, right: padX, bottom: padY, left: padX },
            maxZoom: 13,
            essential: true,
          });
        }
      },
      () => {
        setGeoStatus("error");
        setGeoError("No pudimos acceder a tu ubicacion.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 gap-6">
          <div className="relative h-[54vh] min-h-[360px] max-h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-xl shadow-slate-200/80 md:h-[720px] md:max-h-none">
            <div ref={mapContainerRef} className="absolute inset-0 min-h-full w-full" />
            <button
              type="button"
              onClick={locateNearestBranch}
              className={`absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black shadow-xl transition-all active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 ${
                hasConfirmedBranch
                  ? "bg-black text-white hover:bg-zinc-800"
                  : "bg-[#ff1e00] text-white ring-4 ring-[#ff1e00]/30 hover:bg-[#cc1800]"
              }`}
              disabled={geoStatus === "loading"}
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
              </svg>
              {geoStatus === "loading" ? "Buscando..." : "Sucursal más cercana"}
            </button>
            {/* Mobile: popup compacto con "Cómo llegar" a mano apenas se toca un
                pin — antes solo existía la tarjeta completa de abajo (hidden
                lg:block), así que en el celular había que bajar a buscarla. */}
            <div className="pointer-events-auto absolute inset-x-4 bottom-4 z-10 lg:hidden">
              <div className="flex items-center gap-3 rounded-2xl border border-orange-500 bg-white p-3 shadow-xl shadow-orange-500/10">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50">
                  <Image src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-navy-900">{activeBranch.shortName}</p>
                  <p className="truncate text-xs text-slate-500">{activeBranch.address}</p>
                </div>
                <a
                  href={activeBranch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cómo llegar"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3.5 text-xs font-black text-white transition-colors hover:bg-orange-600"
                >
                  <DirectionsIcon className="h-5 w-5" />
                  Cómo llegar
                </a>
              </div>
            </div>

            <div className="pointer-events-auto absolute bottom-5 right-5 z-10 hidden w-[min(390px,calc(100%-40px))] lg:block">
              <BranchSummary
                branch={activeBranch}
                isActive
                isSelected={selectedBranch.id === activeBranch.id}
                onSelectBranch={selectBranch}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 content-start gap-4 lg:grid-cols-2">
            {geoError && (
              <p className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                {geoError}
              </p>
            )}

            {sortedBranches.map((branch) => {
              const isActive = branch.id === activeBranch.id;
              const isSelected = selectedBranch.id === branch.id;

              return (
                <BranchSummary
                  key={branch.id}
                  branch={branch}
                  isActive={isActive}
                  isSelected={isSelected}
                  onSelectBranch={selectBranch}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
