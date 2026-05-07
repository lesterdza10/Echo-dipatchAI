import React from "react";
import { Bike, CarFront, Package, Trash2, Truck, Boxes } from "lucide-react";
import { motion } from "motion/react";

const vehicles = [
  {
    title: "Mini Pickup",
    desc: "Best for small household waste and quick curbside pickups.",
    Icon: Truck,
    tag: "Compact",
  },
  {
    title: "Waste Van",
    desc: "Ideal for apartment collections and medium-sized bookings.",
    Icon: Boxes,
    tag: "Popular",
  },
  {
    title: "Skip Bin Truck",
    desc: "Suitable for bulky waste, renovation debris, and cleanouts.",
    Icon: Package,
    tag: "Heavy Duty",
  },
  {
    title: "Eco Bike",
    desc: "Fast local collection for light waste and urgent pickups.",
    Icon: Bike,
    tag: "Eco",
  },
  {
    title: "City Car",
    desc: "Great for single-item disposal and short-distance dispatches.",
    Icon: CarFront,
    tag: "Fast",
  },
  {
    title: "General Waste Cart",
    desc: "Flexible option for mixed waste and scheduled collection routes.",
    Icon: Trash2,
    tag: "Flexible",
  },
];

function Vehicleslider() {
  return (
    <div className="w-full bg-white py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-zinc-900" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Fleet
              </span>
            </div>
            <h2 className="text-3xl font-black sm:text-4xl tracking-tight text-zinc-900">
              Vehicles <br />
              <span className="relative inline-block">
                Categories
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.4,
                  }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-zinc-900 origin-left"
                />
              </span>
            </h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Vehicleslider;
