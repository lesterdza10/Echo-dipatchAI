"use client";
import React from "react";
import { motion } from "motion/react";

const KPI_CONFIG: Record<
  string,
  { iconBg: string; iconColor: string; carddHover: string; glow: string }
> = {
  TotalPartners: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
    carddHover: "hover:border-purple-300 hover:shadow-purple-100",
    glow: "from-purple-300/70  to-transparent",
  },
  Approved: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    carddHover: "hover:border-emerald-300 hover:shadow-emerald-100",
    glow: "from-emerald-200/40 to-transparent",
  },
  Pending: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    carddHover: "hover:border-amber-300 hover:shadow-amber-100",
    glow: "from-amber-200/40 to-transparent",
  },
  Rejected: {
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    carddHover: "hover:border-rose-300 hover:shadow-rose-100",
    glow: "from-rose-200/40 to-transparent",
  },
};

type KeyPiProps = {
  label: string;
  value?: number | null;
  icon: React.ReactNode;
  variants: keyof typeof KPI_CONFIG;
};

function KeyPi({ label, value, icon, variants }: KeyPiProps) {
  const cfg = KPI_CONFIG[variants];

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 24px 56px rgba(0,0,0,0.14)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5
        shadow-[0_10px_30px_rgba(0,0,0,0.06)] cursor-default group ${cfg.carddHover}`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${cfg.glow} opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {value ?? 0}
          </p>
        </div>
        <div className="relative">
          <div
            className={`absolute -inset-2 rounded-2xl blur-lg opacity-60 ${cfg.iconBg}`}
          />
          <div
            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default KeyPi;
