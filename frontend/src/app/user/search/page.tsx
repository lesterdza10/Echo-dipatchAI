"use client";
import { ArrowLeft, MapPin, Navigation2, Search } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchMap from "@/components/SearchMap";

function page() {
  const router = useRouter();
  const params = useSearchParams();

  const [pickup, setPickup] = React.useState(params.get("pickup") || "");
  const [drop, setDrop] = React.useState(params.get("drop") || "");
  const [km, setKm] = React.useState<number>();
  const mobile = params.get("mobile") || "";
  const pickupLat = Number(params.get("pickupLat") || "");
  const pickupLon = Number(params.get("pickupLon") || "");
  const dropLat = Number(params.get("dropLat") || "");
  const dropLon = Number(params.get("dropLon") || "");
  const vehicle = params.get("vehicle") || "";

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-100 overflow-x-hidden">
      <div className="absolute top-5 left-5 z-50">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => {
            router.back();
          }}
          className="w-11 h-11 rounded-full bg-white border border-zinc-200
          shadow-md flex items-center justify-center hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft size={24} className="text-zinc-900" />
        </motion.button>
      </div>
      <div className="relative w-full h-[52vh] z-0">
        <SearchMap
          pickup={pickup}
          drop={drop}
          onChange={(pickup, drop) => {
            setPickup(pickup);
            setDrop(drop);
          }}
          onDistance={setKm}
        />
      </div>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="relative z-20 -mt-10 bg-white rounded-t-[28px] border-t border-zinc-200 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] pt-5
      pb-20 min-h-[52vh]"
      >
        <div className="px-5 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden mb-5"
          >
            <div className="flex gap-3 px-4 py-3 border-b border-zinc-100">
              <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                <div
                  className="w-px flex-1 bg-zinc-300 my-1"
                  style={{ minHeight: 14 }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-0.5">
                  PickUp
                </p>
                <p className="text-sm text-zinc-900 font-semibold leading-sung truncate">
                  {pickup || "-"}
                </p>
              </div>
              <MapPin
                size={14}
                className="text-zinc-400 flex-shrink-0 mt-1.5"
              />
            </div>
            <div className="flex gap-3 px-4 py-3 border-b border-zinc-100">
              <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                <div
                  className="w-px flex-1 bg-zinc-300 my-1"
                  style={{ minHeight: 14 }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-0.5">
                  Drop
                </p>
                <p className="text-sm text-zinc-900 font-semibold leading-sung truncate">
                  {drop || "-"}
                </p>
              </div>
              <Navigation2
                size={14}
                className="text-zinc-400 flex-shrink-0 mt-1.5"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default page;
