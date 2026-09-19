"use client";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Navigation2 } from "lucide-react";

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
  const [route, setRoute] = React.useState<[number, number][]>([]);
  const [km, setKm] = React.useState<number>(0);
  const [ready, setReady] = React.useState(false);

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
  const reverseGeoCoding = async (lat: number, lon: number) => {
    const { data } = await axios.get(
      `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`,
    );

    if (!data.features.length) return;
    const p = data.features[0].properties;
    return [p.name, p.street, p.city, p.state, p.country]
      .filter(Boolean)
      .join(", ");
  };
  const LoadRoute = async (p: [number, number], d: [number, number]) => {
    try {
      const { data } = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`,
      );
      if (!data?.routes?.length) {
        return;
      }
      setRoute(
        data.routes[0].geometry.coordinates.map(
          ([lon, lat]: [number, number]) => [lat, lon],
        ),
      );
      setKm(parseFloat((data.routes[0].distance / 1000).toFixed(2)));
      onDistance(parseFloat((data.routes[0].distance / 1000).toFixed(2)));
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  const dragPickup = async (lat: number, lon: number) => {
    const address = await reverseGeoCoding(lat, lon);
    setP1([lat, lon]);
    if (p2) LoadRoute([lat, lon], p2!);
    onChange(address || "", drop);
  };
  const dragDrop = async (lat: number, lon: number) => {
    const address = await reverseGeoCoding(lat, lon);
    setP2([lat, lon]);
    if (p1) LoadRoute(p1, [lat, lon]);
    onChange(pickup, address || "");
  };
  useEffect(() => {
    setReady(false);
    if (pickup && drop) {
      (async () => {
        const a = await geoCoding(pickup);
        const b = await geoCoding(drop);

        if (!a || !b) return;
        await LoadRoute(a, b);

        setP1(a);
        setP2(b);
        setReady(true);
      })();
    }
  }, [pickup, drop]);
  return (
    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={p1 ?? [0, 0]}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png?key=cb1_3q0a_1_32352826820161e2dc5ef110"
        />
        {p1 && p2 && <FitBounds p1={p1} p2={p2} />}
        {p1 && (
          <Marker
            position={p1}
            icon={pickupIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragPickup(m.lat, m.lng);
              },
            }}
          />
        )}
        {p2 && (
          <Marker
            position={p2}
            icon={dropIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragDrop(m.lat, m.lng);
              },
            }}
          />
        )}
        {route.length > 0 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#0a0a0a",
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}
      </MapContainer>
      <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-[999] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <div className="relative h-14 w-14 flex items-center justify-center">
              <motion.div
                initial={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-900"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-300"
              />
              <MapPin size={15} className="text-zinc-900" />
            </div>
            <div className="text-center">
              <p className="text-xs font-black tracking-[0.22em] uppercase text-zinc-900">
                Loading Map...
              </p>
              <p className="text-[10px] font-medium tracking-wider mt-0.5 text-zinc-400">
                Plotting route...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {ready && km != null && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-15 left-4 z-[500] flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-lg"
          >
            <Navigation2 size={13} className="text-zinc-900" />
            <span className="text-xs font-bold text-zinc-900">{km} km</span>
            <span className="w-px h-3 bg-zinc-200" />
            <span className="text-xs font-medium text-zinc-400">
              ~{Math.max(3, Math.round((km! / 25) * 60))} min
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchMap;
