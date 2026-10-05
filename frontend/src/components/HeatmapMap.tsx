"use client";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { HeatmapLayer } from "./HeatmapLayer";
import L from "leaflet";

type HeatPoint = { lat: number; lng: number; intensity?: number };

interface Props {
  points: HeatPoint[];
}

// Default center — India
const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];

// Automatically fits the map to the bounding box of all points
function AutoFitBounds({ points }: { points: HeatPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14, { animate: true });
      return;
    }

    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const bounds = L.latLngBounds(
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    );
    map.fitBounds(bounds, { padding: [60, 60], animate: true, maxZoom: 14 });
  }, [points, map]);

  return null;
}

function HeatmapMap({ points }: Props) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={5}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png?key=cb1_3q0a_1_32352826820161e2dc5ef110"
        />
        <ZoomControl position="bottomright" />
        <HeatmapLayer points={points} />
        <AutoFitBounds points={points} />
      </MapContainer>
    </div>
  );
}

export default HeatmapMap;
