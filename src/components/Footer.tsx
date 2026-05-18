"use client";
import { motion } from "motion/react";
import React from "react";

function Footer() {
  return (
    <div className="w-full bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 tracking-wide">
              ECHO-DISPATCH
            </h2>
            <p className="mt-4 text-gray-400 text-sm landing-relaxed">
              Real-time vehicle tracking and fleet management platform for
              optimized operations and enhanced efficiency.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 flex items-center justify-center mt-12">
          <p className="text-gray-400 flex items-center justify-center text-sm mt-8">
            © {new Date().getFullYear()} ECHO-DISPATCH. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Footer;
