"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import maplibregl, { type GeoJSONSource, type Map, type Marker } from "maplibre-gl";
import type { Branch } from "@/lib/config";
import { useBranch } from "@/contexts/branch-context";

type BranchesMapProps = {
  branches: Branch[];
};

type UserLocation = {
  lat: number;
  lng: number;
};

const MAPTILER_KEY = "rZs55HHnOgNdmSMB2Jkn";
const MAP_STYLE_URL = `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`;
const ARGENTINA_MIN_ZOOM = 3.5;
const BRANCH_SOURCE_ID = "trivium-branches";
const BRANCH_HALO_LAYER_ID = "trivium-branch-halos";
const BRANCH_POINT_LAYER_ID = "trivium-branch-points";
const BRANCH_DOT_LAYER_ID = "trivium-branch-dots";
const BRANCH_LABEL_LAYER_ID = "trivium-branch-labels";
const MAP_LOCALE = {
  "CooperativeGesturesHandler.WindowsHelpText": "Usa Ctrl + scroll para acercar o alejar el mapa",
  "CooperativeGesturesHandler.MacHelpText": "Usa ⌘ + scroll para acercar o alejar el mapa",
  "CooperativeGesturesHandler.MobileHelpText": "Usa dos dedos para mover el mapa",
};

type BranchFeatureProperties = {
  id: string;
  shortName: string;
  isActive: boolean;
};

type BranchFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point, BranchFeatureProperties>;

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

function createBranchFeatureCollection(
  branches: Branch[],
  activeBranchId: string
): BranchFeatureCollection {
  return {
    type: "FeatureCollection",
    features: branches.map((branch) => ({
      type: "Feature",
      properties: {
        id: branch.id,
        shortName: branch.shortName,
        isActive: branch.id === activeBranchId,
      },
      geometry: {
        type: "Point",
        coordinates: getBranchLngLat(branch),
      },
    })),
  };
}

function getBranchSource(map: Map) {
  return map.getSource(BRANCH_SOURCE_ID) as GeoJSONSource | undefined;
}

function addBranchLayers(map: Map, branches: Branch[], activeBranchId: string) {
  if (getBranchSource(map)) return;

  map.addSource(BRANCH_SOURCE_ID, {
    type: "geojson",
    data: createBranchFeatureCollection(branches, activeBranchId),
  });

  map.addLayer({
    id: BRANCH_HALO_LAYER_ID,
    type: "circle",
    source: BRANCH_SOURCE_ID,
    paint: {
      "circle-radius": ["case", ["get", "isActive"], 20, 17],
      "circle-color": "#ffffff",
      "circle-stroke-color": ["case", ["get", "isActive"], "#ff1e00", "#0a1a30"],
      "circle-stroke-width": ["case", ["get", "isActive"], 3, 2],
      "circle-opacity": 0.98,
    },
  });

  map.addLayer({
    id: BRANCH_POINT_LAYER_ID,
    type: "circle",
    source: BRANCH_SOURCE_ID,
    paint: {
      "circle-radius": ["case", ["get", "isActive"], 13, 11],
      "circle-color": ["case", ["get", "isActive"], "#ff1e00", "#0a1a30"],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2,
    },
  });

  map.addLayer({
    id: BRANCH_DOT_LAYER_ID,
    type: "circle",
    source: BRANCH_SOURCE_ID,
    paint: {
      "circle-radius": 4,
      "circle-color": "#ffffff",
      "circle-opacity": 0.95,
    },
  });

  map.addLayer({
    id: BRANCH_LABEL_LAYER_ID,
    type: "symbol",
    source: BRANCH_SOURCE_ID,
    layout: {
      "text-field": ["get", "shortName"],
      "text-anchor": "top",
      "text-offset": [0, 1.65],
      "text-size": 12,
      "text-font": ["Noto Sans Bold"],
      "text-allow-overlap": true,
    },
    paint: {
      "text-color": "#0a1a30",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
    },
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
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
        isActive
          ? "border-orange-500 shadow-xl shadow-orange-500/10"
          : "border-slate-200 hover:border-navy-200"
      }`}
    >
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
        <a
          href={`https://wa.me/${branch.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-black text-white shadow-sm shadow-[#25d366]/20 transition-colors hover:bg-[#1fbd59]"
        >
          WhatsApp
        </a>
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm font-black text-navy-900 shadow-sm transition-colors hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700"
        >
          Como llegar
        </a>
      </div>
    </article>
  );
}

export function BranchesMap({ branches }: BranchesMapProps) {
  const { selectedBranch } = useBranch();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
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
      zoom: 11,
      minZoom: ARGENTINA_MIN_ZOOM,
      maxZoom: 17,
      cooperativeGestures: true,
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
      addBranchLayers(map, branches, activeBranch.id);
      map.on("click", BRANCH_POINT_LAYER_ID, (event) => {
        const branchId = event.features?.[0]?.properties?.id;
        const branch = branches.find((currentBranch) => currentBranch.id === branchId);
        if (branch) selectBranch(branch);
      });
      map.on("mouseenter", BRANCH_POINT_LAYER_ID, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", BRANCH_POINT_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
      });
    });

    mapRef.current = map;
    window.setTimeout(() => map.resize(), 0);

    return () => {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [activeBranch.id, branches]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const source = getBranchSource(map);
    source?.setData(createBranchFeatureCollection(branches, activeBranch.id));
  }, [activeBranch.id, branches]);

  useEffect(() => {
    if (activeBranchId) return;

    mapRef.current?.flyTo({
      center: getBranchLngLat(activeBranch),
      zoom: Math.max(mapRef.current.getZoom(), 11),
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
        mapRef.current?.fitBounds(bounds, {
          padding: {
            top: 110,
            right: 110,
            bottom: 110,
            left: 110,
          },
          maxZoom: 13,
          essential: true,
        });
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
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
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
