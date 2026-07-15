"use client";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
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
    </div>
  );
}

export default page;
