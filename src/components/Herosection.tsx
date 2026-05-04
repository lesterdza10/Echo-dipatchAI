"use client";
import { Bike, Car, Trash, Truck } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

function Herosection({ onAuthRequired }: { onAuthRequired: () => void }) {
  return (
    <div className="w-full relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white font-extrabold text-4xl sm:text-5xl mid:text-7xl"
        >
          ECHO-DISPATCH
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300 mt-4 max-w-2xl"
        >
          Platform for real-time vehicle tracking and fleet management,
          providing dispatchers with live updates on vehicle locations, routes,
          and statuses to optimize operations and enhance efficiency.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-8 text-gray-300"
        >
          <div className="flex gap-8">
            <Bike size={30} />
            <Car size={30} />
            <Truck size={30} />
            <Trash size={30} />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white text-black rounded-full font-semibold shadow-xl hover:bg-blue-700 transition-colors"
            onClick={onAuthRequired}
          >
            BOOK NOW
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Herosection;
