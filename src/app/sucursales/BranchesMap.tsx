"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import maplibregl, { type Map, type Marker } from "maplibre-gl";
import type { Branch } from "@/lib/config";
import { useBranch } from "@/contexts/branch-context";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

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

// Marcador HTML con el logo de Trivium sobre una insignia navy (para que el
// logo blanco se lea sobre el mapa claro) y una etiqueta con el nombre corto.
function createBranchMarkerElement(shortName: string) {
  // anchor:"bottom" del Marker pinea el borde inferior de ESTE div al punto
  // geográfico exacto — tiene que ser la puntita del "pointer", no el fondo
  // del texto de abajo. Antes el label estaba en el flujo normal debajo del
  // pointer, así que el borde inferior real era el fondo del texto: un
  // desfasaje fijo en píxeles que de cerca no se nota (representa pocos
  // metros) pero de lejos, con el mismo mapa mostrando kilómetros por
  // pantalla, hace que el pin quede visiblemente corrido de la ubicación
  // real. El label ahora es absolute (fuera del flujo) para que no cuente en
  // la caja del wrapper.
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none";

  const badge = document.createElement("div");
  badge.dataset.role = "badge";
  badge.style.cssText =
    "display:flex;align-items:center;justify-content:center;width:52px;height:52px;padding:6px;border-radius:15px;background:#ffffff;border:2px solid #000000;box-shadow:0 4px 12px rgba(10,26,48,0.35);transition:transform .15s ease,border-color .15s ease";

  const img = document.createElement("img");
  img.src = "/pin-trivium.png";
  img.alt = "Neumáticos Trivium";
  img.style.cssText = "width:100%;height:100%;object-fit:contain;display:block";
  badge.appendChild(img);

  const pointer = document.createElement("div");
  pointer.dataset.role = "pointer";
  pointer.style.cssText =
    "width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #000000;margin-top:-1px";

  const label = document.createElement("div");
  label.textContent = shortName;
  label.style.cssText =
    "position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:3px;font-weight:800;font-size:12px;color:#000000;white-space:nowrap;text-shadow:0 0 2px #fff,0 0 2px #fff,0 0 2px #fff,0 0 2px #fff";

  wrapper.appendChild(badge);
  wrapper.appendChild(pointer);
  wrapper.appendChild(label);
  return { wrapper, badge, pointer };
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
          WhatsApp
        </WhatsAppLink>
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm font-black text-navy-900 shadow-sm transition-colors hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700"
        >
          Como llegar
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

export function BranchesMap({ branches, comingSoon = [] }: BranchesMapProps) {
  const { selectedBranch } = useBranch();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const branchMarkersRef = useRef<Record<string, { marker: Marker; badge: HTMLElement; pointer: HTMLElement }>>({});
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

      for (const branch of branches) {
        const { wrapper, badge, pointer } = createBranchMarkerElement(branch.shortName);
        wrapper.addEventListener("click", () => selectBranch(branch));
        const marker = new maplibregl.Marker({ element: wrapper, anchor: "bottom" })
          .setLngLat(getBranchLngLat(branch))
          .addTo(map);
        branchMarkersRef.current[branch.id] = { marker, badge, pointer };
      }

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
      for (const { marker } of Object.values(branchMarkersRef.current)) marker.remove();
      branchMarkersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, [branches, comingSoon]);

  // Resalta el marcador de la sucursal activa.
  useEffect(() => {
    for (const [id, { badge, pointer }] of Object.entries(branchMarkersRef.current)) {
      const isActive = id === activeBranch.id;
      badge.style.borderColor = isActive ? "#ff1e00" : "#000000";
      badge.style.transform = isActive ? "scale(1.12)" : "scale(1)";
      pointer.style.borderTopColor = isActive ? "#ff1e00" : "#000000";
    }
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
              className="absolute left-4 top-4 z-10 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-navy-900 shadow-lg transition-colors hover:bg-navy-50 disabled:cursor-wait disabled:opacity-70"
              disabled={geoStatus === "loading"}
            >
              {geoStatus === "loading" ? "Buscando..." : "Sucursal mas cercana"}
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
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
                  </svg>
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
