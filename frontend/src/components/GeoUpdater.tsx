"use client";
import { getSocket } from "@/lib/socket";
import React, { useEffect, useRef } from "react";
function GeoUpdater({ userId }: { userId?: string }) {
  const socketRef = useRef<any>(null);
  useEffect(() => {
    if (!userId) return;
    if (!navigator.geolocation) return;

    socketRef.current = getSocket();
    socketRef.current.emit("identity", userId);

    const watcher = navigator.geolocation.watchPosition(({ coords }) => {
      socketRef.current.emit(
        "updateLocation",
        {
          userId,
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        (error: any) => {
          console.error("Error updating location:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
        },
      );
    });
    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [userId]);

  return null;
}

export default GeoUpdater;
