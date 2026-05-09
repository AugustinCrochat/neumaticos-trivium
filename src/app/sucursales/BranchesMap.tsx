"use client";

import { useMemo, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import Image from "next/image";
import type { Branch } from "@/lib/config";
import { useBranch } from "@/contexts/branch-context";

type BranchesMapProps = {
  branches: Branch[];
};

type Point = {
  x: number;
  y: number;
};

type UserLocation = {
  lat: number;
  lng: number;
};

const TILE_SIZE = 256;
const MIN_ZOOM = 5;
const MAX_ZOOM = 16;
const MAPTILER_KEY = "rZs55HHnOgNdmSMB2Jkn";
const MAP_STYLES = [
  { id: "streets-v4", label: "Calles" },
  { id: "bright-v2", label: "Claro" },
  { id: "basic-v2", label: "Simple" },
] as const;

function cleanPhone(phone: string) {
  return phone.replace(/\s/g, "");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function latLngToWorld(lat: number, lng: number, zoom: number): Point {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((lat * Math.PI) / 180);

  return {
    x: ((lng + 180) / 360) * scale,
    y:
      (0.5 -
        Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
      scale,
  };
}

function worldToLatLng(point: Point, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (point.x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * point.y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return { lat, lng };
}

function makeTileUrl(x: number, y: number, z: number, styleId: string) {
  return `https://api.maptiler.com/maps/${styleId}/256/${z}/${x}/${y}.png?key=${MAPTILER_KEY}`;
}

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

export function BranchesMap({ branches }: BranchesMapProps) {
  const { selectedBranch, setSelectedBranch } = useBranch();
  const [activeBranchId, setActiveBranchId] = useState(branches[0]?.id ?? "");
  const [center, setCenter] = useState({ lat: -32.9, lng: -61.6 });
  const [zoom, setZoom] = useState(6);
  const [mapStyle, setMapStyle] = useState<(typeof MAP_STYLES)[number]["id"]>("streets-v4");
  const [mapSize, setMapSize] = useState({ width: 960, height: 560 });
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [geoError, setGeoError] = useState("");
  const dragRef = useRef<{
    pointerId: number;
    start: Point;
    centerWorld: Point;
  } | null>(null);

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === activeBranchId) ?? branches[0],
    [activeBranchId, branches]
  );

  const centerWorld = useMemo(
    () => latLngToWorld(center.lat, center.lng, zoom),
    [center.lat, center.lng, zoom]
  );

  const tiles = useMemo(() => {
    const topLeft = {
      x: centerWorld.x - mapSize.width / 2,
      y: centerWorld.y - mapSize.height / 2,
    };
    const maxTile = 2 ** zoom;
    const minTileX = Math.floor(topLeft.x / TILE_SIZE) - 1;
    const maxTileX = Math.floor((topLeft.x + mapSize.width) / TILE_SIZE) + 1;
    const minTileY = Math.floor(topLeft.y / TILE_SIZE) - 1;
    const maxTileY = Math.floor((topLeft.y + mapSize.height) / TILE_SIZE) + 1;
    const nextTiles = [];

    for (let x = minTileX; x <= maxTileX; x += 1) {
      for (let y = minTileY; y <= maxTileY; y += 1) {
        if (y < 0 || y >= maxTile) continue;

        const wrappedX = ((x % maxTile) + maxTile) % maxTile;
        nextTiles.push({
          id: `${zoom}-${wrappedX}-${y}`,
          url: makeTileUrl(wrappedX, y, zoom, mapStyle),
          left: x * TILE_SIZE - topLeft.x,
          top: y * TILE_SIZE - topLeft.y,
        });
      }
    }

    return nextTiles;
  }, [centerWorld.x, centerWorld.y, mapSize.height, mapSize.width, mapStyle, zoom]);

  const branchMarkers = useMemo(
    () =>
      branches.map((branch) => {
        const world = latLngToWorld(
          branch.coordinates.lat,
          branch.coordinates.lng,
          zoom
        );

        return {
          branch,
          left: world.x - centerWorld.x + mapSize.width / 2,
          top: world.y - centerWorld.y + mapSize.height / 2,
        };
      }),
    [branches, centerWorld.x, centerWorld.y, mapSize.height, mapSize.width, zoom]
  );

  const userMarker = useMemo(() => {
    if (!userLocation) return null;

    const world = latLngToWorld(userLocation.lat, userLocation.lng, zoom);
    return {
      left: world.x - centerWorld.x + mapSize.width / 2,
      top: world.y - centerWorld.y + mapSize.height / 2,
    };
  }, [centerWorld.x, centerWorld.y, mapSize.height, mapSize.width, userLocation, zoom]);

  if (!activeBranch) return null;

  function selectBranch(branch: Branch) {
    setActiveBranchId(branch.id);
    setCenter(branch.coordinates);
    setZoom((currentZoom) => Math.max(currentZoom, 13));
  }

  function locateUser() {
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

        setUserLocation(nextLocation);
        setCenter(nextLocation);
        setZoom(13);
        setActiveBranchId(nearestBranch.id);
        setGeoStatus("ready");
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

  function zoomBy(delta: number) {
    setZoom((currentZoom) => clamp(currentZoom + delta, MIN_ZOOM, MAX_ZOOM));
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    zoomBy(event.deltaY > 0 ? -1 : 1);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      centerWorld,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const nextWorld = {
      x: drag.centerWorld.x - (event.clientX - drag.start.x),
      y: drag.centerWorld.y - (event.clientY - drag.start.y),
    };
    setCenter(worldToLatLng(nextWorld, zoom));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] gap-6 lg:gap-8 items-stretch">
          <div
            ref={(node) => {
              if (!node) return;
              const rect = node.getBoundingClientRect();
              if (
                Math.round(rect.width) !== Math.round(mapSize.width) ||
                Math.round(rect.height) !== Math.round(mapSize.height)
              ) {
                setMapSize({
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                });
              }
            }}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative min-h-[430px] touch-none overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-xl shadow-slate-200/80 md:min-h-[560px]"
            aria-label="Mapa interactivo de sucursales"
          >
            {tiles.map((tile) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={tile.id}
                src={tile.url}
                alt=""
                draggable={false}
                className="absolute h-64 w-64 select-none"
                style={{ left: tile.left, top: tile.top }}
              />
            ))}

            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5" />

            <div className="absolute left-4 top-4 z-20 rounded-xl border border-white/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                Mapa real
              </p>
              <p className="text-sm font-black text-navy-900">
                Arrastra para mover, rueda para zoom
              </p>
            </div>

            <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => zoomBy(1)}
                className="h-10 w-10 text-xl font-black text-navy-900 transition-colors hover:bg-navy-50"
                aria-label="Acercar mapa"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => zoomBy(-1)}
                className="h-10 w-10 border-t border-slate-200 text-xl font-black text-navy-900 transition-colors hover:bg-navy-50"
                aria-label="Alejar mapa"
              >
                -
              </button>
            </div>

            <div className="absolute right-4 top-[100px] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setMapStyle(style.id)}
                  className={`block w-full px-3 py-2 text-left text-xs font-bold transition-colors ${
                    mapStyle === style.id
                      ? "bg-navy-900 text-white"
                      : "text-navy-900 hover:bg-navy-50"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={locateUser}
              className="absolute left-4 top-[92px] z-20 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-navy-900 shadow-lg transition-colors hover:bg-navy-50 disabled:cursor-wait disabled:opacity-70"
              disabled={geoStatus === "loading"}
            >
              {geoStatus === "loading" ? "Buscando..." : "Mi ubicacion"}
            </button>

            {branchMarkers.map(({ branch, left, top }) => {
              const isActive = branch.id === activeBranch.id;

              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => selectBranch(branch)}
                  className="group absolute z-30 -translate-x-1/2 -translate-y-full outline-none"
                  style={{ left, top }}
                  aria-label={`Ver sucursal ${branch.shortName}`}
                >
                  <span
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white shadow-2xl transition-all duration-200 group-hover:-translate-y-1 group-focus-visible:ring-4 group-focus-visible:ring-orange-500/30 ${
                      isActive
                        ? "border-orange-500 shadow-orange-500/30"
                        : "border-white shadow-navy-900/20"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 rounded-full ${
                        isActive ? "animate-ping bg-orange-500/20" : ""
                      }`}
                    />
                    <Image
                      src="/icon.svg"
                      alt=""
                      width={42}
                      height={42}
                      className="relative h-10 w-10 object-contain"
                    />
                  </span>
                  <span
                    className={`mx-auto block h-5 w-5 -translate-y-2 rotate-45 border-b-4 border-r-4 bg-white transition-colors ${
                      isActive ? "border-orange-500" : "border-white"
                    }`}
                  />
                  <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    {branch.shortName}
                  </span>
                </button>
              );
            })}

            {userMarker && (
              <div
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: userMarker.left, top: userMarker.top }}
                aria-label="Tu ubicacion"
              >
                <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-500/20" />
                <span className="relative block h-5 w-5 rounded-full border-4 border-white bg-navy-600 shadow-lg shadow-navy-900/30" />
              </div>
            )}

            <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur md:left-auto md:w-[360px]">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Sucursal seleccionada
              </p>
              <h2 className="mt-1 text-xl font-black text-navy-900">
                {activeBranch.name}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {activeBranch.address}, {activeBranch.city}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBranch(activeBranch)}
                  className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-navy-800"
                >
                  Elegir esta
                </button>
                <a
                  href={activeBranch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                >
                  Como llegar
                </a>
                <a
                  href={`https://wa.me/${activeBranch.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#25d366]/15 px-4 py-2 text-sm font-bold text-[#1f9f4b] transition-colors hover:bg-[#25d366]/25"
                >
                  WhatsApp
                </a>
              </div>
              {selectedBranch.id === activeBranch.id && (
                <p className="mt-3 text-xs font-bold text-orange-600">
                  Es tu sucursal seleccionada
                </p>
              )}
              {geoError && (
                <p className="mt-3 text-xs font-semibold text-orange-700">
                  {geoError}
                </p>
              )}
            </div>

            <a
              href="https://www.maptiler.com/copyright/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-1 left-2 z-20 rounded bg-white/90 px-1.5 py-0.5 text-[10px] text-slate-600"
            >
              © MapTiler © OpenStreetMap contributors
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {branches.map((branch) => {
              const isActive = branch.id === activeBranch.id;

              return (
                <article
                  key={branch.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
                    isActive
                      ? "border-orange-500 shadow-xl shadow-orange-500/10"
                      : "border-slate-200 hover:border-navy-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectBranch(branch)}
                    className="flex w-full items-start gap-4 text-left"
                  >
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50">
                      <Image
                        src="/icon.svg"
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-black text-navy-900">
                        {branch.name}
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        {branch.address}
                      </span>
                      <span className="block text-sm text-slate-600">
                        {branch.city}
                      </span>
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

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBranch(branch)}
                      className="rounded-lg bg-navy-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-navy-800"
                    >
                      Elegir esta
                    </button>
                    <a
                      href={`tel:${cleanPhone(branch.phone)}`}
                      className="rounded-lg bg-navy-100 px-3 py-2 text-xs font-bold text-navy-900 transition-colors hover:bg-navy-200"
                    >
                      Llamar
                    </a>
                    <a
                      href={`https://wa.me/${branch.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#25d366]/15 px-3 py-2 text-xs font-bold text-[#1f9f4b] transition-colors hover:bg-[#25d366]/25"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-orange-100 px-3 py-2 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-200"
                    >
                      Ver mapa
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
