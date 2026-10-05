"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  ArrowLeft,
  Clock,
  Flame,
  MapPin,
  Radio,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { getSocket } from "@/lib/socket";

const HeatmapMap = dynamic(() => import("./HeatmapMap"), { ssr: false });

type HeatPoint = { lat: number; lng: number; intensity?: number };
type TimeFilter = "1" | "6" | "24";

export default function HeatmapDashboard() {
  const [points, setPoints] = useState<HeatPoint[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("24");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const socketSetup = useRef(false);

  const fetchPoints = useCallback(async (hours: TimeFilter) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/heatmap?hours=${hours}`);
      setPoints(data.points ?? []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch heatmap data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints(timeFilter);
  }, [timeFilter, fetchPoints]);

  useEffect(() => {
    if (socketSetup.current) return;
    socketSetup.current = true;
    const socket = getSocket();
    socket.emit("join-admin");
    socket.on("new-booking-point", (data: HeatPoint) => {
      setPoints((prev) => [...prev, data]);
      setLiveCount((c) => c + 1);
      setLastUpdated(new Date());
    });
    return () => { socket.off("new-booking-point"); };
  }, []);

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      })
    : null;

  const timeLabels: Record<TimeFilter, string> = {
    "1": "1h", "6": "6h", "24": "24h",
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">

      {/* ── Top bar ─────────────────────────────────── */}
      <header className="flex-none bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow">
              <Flame size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Live Heatmap</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Request density map</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live pulse badge */}
          <AnimatePresence>
            {liveCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-semibold px-2.5 py-1 rounded-full"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                </span>
                {liveCount} live
              </motion.div>
            )}
          </AnimatePresence>

          {/* Time filter */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {(["1", "6", "24"] as TimeFilter[]).map((h) => (
              <button
                key={h}
                onClick={() => setTimeFilter(h)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all ${
                  timeFilter === h
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {timeLabels[h]}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchPoints(timeFilter)}
            disabled={loading}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all disabled:opacity-40"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + map ──────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Sidebar */}
        <aside className="flex-none w-64 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">

          {/* Stats */}
          <div className="p-4 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overview</p>

            {[
              {
                label: "Total Requests",
                value: points.length,
                sub: timeFilter === "1" ? "Last hour" : timeFilter === "6" ? "Last 6 hours" : "Last 24 hours",
                icon: <MapPin size={14} />,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Live This Session",
                value: liveCount,
                sub: "Via real-time socket",
                icon: <Radio size={14} />,
                color: "bg-rose-50 text-rose-500",
              },
              {
                label: "Activity",
                value: liveCount > 0 ? "Live" : "Monitoring",
                sub: liveCount > 0 ? "Receiving updates" : "Waiting…",
                icon: <Activity size={14} />,
                color: "bg-emerald-50 text-emerald-600",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-50 rounded-xl p-3 border border-gray-100"
              >
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 mb-2 ${s.color}`}>
                  {s.icon}
                  {s.label}
                </div>
                <p className="text-2xl font-bold text-gray-900 font-mono leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-gray-100" />

          {/* Legend */}
          <div className="p-4 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Legend</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-5 h-5 rounded-full border-2 border-orange-400 flex items-center justify-center flex-none">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              </div>
              <span className="text-xs text-gray-500">Pick-up request location</span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-gray-100" />

          {/* Last updated */}
          {formattedTime && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <Clock size={11} />
                Updated {formattedTime}
              </div>
            </div>
          )}
        </aside>

        {/* Map */}
        <div className="flex-1 relative min-w-0">
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm"
              >
                <div className="w-9 h-9 border-[3px] border-orange-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-semibold text-gray-600">Loading heatmap…</p>
                <p className="text-xs text-gray-400 mt-1">Fetching pick-up data</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state overlay */}
          <AnimatePresence>
            {!loading && points.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3">
                    <Flame size={22} className="text-orange-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">No requests yet</p>
                  <p className="text-xs text-gray-400 mt-1">Bookings will appear here in real-time</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <HeatmapMap points={points} />
        </div>
      </div>
    </div>
  );
}
