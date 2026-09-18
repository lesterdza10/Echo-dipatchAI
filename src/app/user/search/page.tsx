"use client";
import { ArrowLeft, Search } from "lucide-react";
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
    </div>
  );
}

export default page;
