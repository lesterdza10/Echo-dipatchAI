"use client";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import axios from "axios";

function FitBounds({ p1, p2 }: { p1: [number, number]; p2: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.fitBounds([p1, p2], {
      padding: [50, 50],
      maxZoom: 15,
      animate: true,
      duration: 1.5,
    });
  }, [p1, p2, map]);
  return null;
}
const pickupIcon = new L.DivIcon({
  className: "pickup-marker-wrapper",
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22));">
      <div style="background:#0a0a0a;color:#fff;padding:5px 14px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;white-space:nowrap;font-family:-apple-system, system-ui, sans-serif;box-shadow:0 2px 12px rgba(0,0,0,0.25);">PICKUP</div>
      <div style="width:2px;height:10px;background:#0a0a0a;opacity:0.4"></div>
      <div style="width:13px;height:13px;background:#0a0a0a;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);"></div>
    </div>
  `,
  iconSize: [120, 52],
  iconAnchor: [60, 46],
  popupAnchor: [0, -30],
});

const dropIcon = new L.DivIcon({
  className: "drop-marker-wrapper",
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22));">
      <div style="background:#ef4444;color:#fff;padding:5px 14px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;white-space:nowrap;font-family:-apple-system, system-ui, sans-serif;box-shadow:0 2px 12px rgba(0,0,0,0.25);">DROP</div>
      <div style="width:2px;height:10px;background:#ef4444;opacity:0.4"></div>
      <div style="width:13px;height:13px;background:#ef4444;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px rgba(239,68,68,0.15), 0 3px 10px rgba(239,68,68,0.3);"></div>
    </div>
  `,
  iconSize: [120, 52],
  iconAnchor: [60, 46],
  popupAnchor: [0, -30],
});

function SearchMap({
  pickup,
  drop,
  onChange,
  onDistance,
}: {
  pickup: string;
  drop: string;
  onChange: (pickup: string, drop: string) => void;
  onDistance: (km: number) => void;
}) {
  const [p1, setP1] = React.useState<[number, number]>();
  const [p2, setP2] = React.useState<[number, number]>();

  const geoCoding = async (q: string): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`,
      );

      if (!data?.features?.length) {
        return null;
      }

      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lat, lon];
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (pickup && drop) {
      (async () => {
        const a = await geoCoding(pickup);
        const b = await geoCoding(drop);

        if (!a || !b) return;

        setP1(a);
        setP2(b);
      })();
    }
  }, [pickup, drop]);
  return (
    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
      <MapContainer className="w-full h-full" center={p1 ?? [0, 0]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png?key=cb1_3q0a_1_32352826820161e2dc5ef110"
        />
        {p1 && p2 && <FitBounds p1={p1} p2={p2} />}
        {p1 && <Marker position={p1} icon={pickupIcon} />}
        {p2 && <Marker position={p2} icon={dropIcon} />}
      </MapContainer>
    </div>
  );
}

export default SearchMap;
