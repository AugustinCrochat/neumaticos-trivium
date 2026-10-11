"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map } from "maplibre-gl";
import type { Branch } from "@/lib/config";

const MAPTILER_KEY = "rZs55HHnOgNdmSMB2Jkn";
const MAP_STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

function createBranchPin(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "display:flex;flex-direction:column;align-items:center;pointer-events:none";

  const badge = document.createElement("div");
  badge.style.cssText =
    "display:flex;align-items:center;justify-content:center;width:54px;height:54px;padding:8px;border-radius:16px;background:#ffffff;border:2px solid #000000;box-shadow:0 4px 12px rgba(10,26,48,0.35)";

  const img = document.createElement("img");
  img.src = "/pin-trivium.png";
  img.alt = "Neumáticos Trivium";
  img.style.cssText = "width:100%;height:100%;object-fit:contain;display:block";
  badge.appendChild(img);

  const pointer = document.createElement("div");
  pointer.style.cssText =
    "width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid #000000;margin-top:-1px";

  wrapper.appendChild(badge);
  wrapper.appendChild(pointer);
  return wrapper;
}

export function BranchMiniMap({ branch }: { branch: Branch }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || branch.googleMapsEmbedUrl) return;
    const center: [number, number] = [branch.coordinates.lng, branch.coordinates.lat];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center,
      zoom: 14,
      minZoom: 9,
      maxZoom: 17,
      cooperativeGestures: true,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }),
      "top-right"
    );
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

    map.on("load", () => {
      map.resize();
      new maplibregl.Marker({ element: createBranchPin(), anchor: "bottom" })
        .setLngLat(center)
        .addTo(map);
    });

    mapRef.current = map;
    window.setTimeout(() => map.resize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [branch]);

  if (branch.googleMapsEmbedUrl) {
    return (
      <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm md:h-[560px] lg:h-[640px]">
        <iframe
          src={branch.googleMapsEmbedUrl}
          title={`Mapa de ${branch.name}`}
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm md:h-[560px] lg:h-[640px]">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
