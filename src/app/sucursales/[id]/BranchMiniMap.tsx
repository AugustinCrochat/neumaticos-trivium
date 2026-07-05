"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map } from "maplibre-gl";
import type { Branch } from "@/lib/config";

const MAPTILER_KEY = "rZs55HHnOgNdmSMB2Jkn";
const MAP_STYLE_URL = `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`;

function createBranchPin(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "width:26px;height:26px;border-radius:50% 50% 50% 0;background:#ff1e00;transform:rotate(-45deg);border:3px solid #ffffff;box-shadow:0 3px 8px rgba(10,26,48,0.35)";
  const dot = document.createElement("div");
  dot.style.cssText =
    "width:8px;height:8px;border-radius:50%;background:#ffffff;position:absolute;top:6px;left:6px";
  wrapper.appendChild(dot);
  return wrapper;
}

export function BranchMiniMap({ branch }: { branch: Branch }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
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

  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm md:h-[340px]">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
