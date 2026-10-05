"use client";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

type HeatPoint = { lat: number; lng: number; intensity?: number };

interface Props {
  points: HeatPoint[];
}

// Renders each request point as a hollow circle (ring) — no fill, just a border
class CircleLayer extends L.Layer {
  private _markers: L.CircleMarker[] = [];
  private _points: HeatPoint[] = [];

  setPoints(points: HeatPoint[]) {
    this._points = points;
    this._redraw();
  }

  onAdd(map: L.Map): this {
    this._redraw();
    return this;
  }

  onRemove(map: L.Map): this {
    this._clearMarkers();
    return this;
  }

  _clearMarkers() {
    const map = (this as any)._map as L.Map | undefined;
    this._markers.forEach((m) => {
      if (map) m.removeFrom(map);
    });
    this._markers = [];
  }

  _redraw() {
    const map = (this as any)._map as L.Map | undefined;
    if (!map) return;

    this._clearMarkers();

    this._points.forEach((p) => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 14,
        color: "#f97316",       // orange border
        weight: 2,
        fillOpacity: 0,         // hollow — no fill
        opacity: 0.75,
      });

      // Inner dot
      const dot = L.circleMarker([p.lat, p.lng], {
        radius: 3,
        color: "#f97316",
        weight: 0,
        fillColor: "#f97316",
        fillOpacity: 0.9,
        opacity: 0,
      });

      marker.addTo(map);
      dot.addTo(map);
      this._markers.push(marker, dot);
    });
  }
}

export function HeatmapLayer({ points }: Props) {
  const map = useMap();
  const layerRef = useRef<CircleLayer | null>(null);

  useEffect(() => {
    const layer = new CircleLayer();
    layerRef.current = layer;
    layer.addTo(map);
    return () => {
      layer.removeFrom(map);
    };
  }, [map]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setPoints(points);
    }
  }, [points]);

  return null;
}
