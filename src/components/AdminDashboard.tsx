"use client";
import axiosClient from "@/lib/axiosClient";
import { User, CheckCircle2, Clock, XCircle } from "lucide-react";
import NextImage from "next/image";
import React, { useEffect } from "react";
import KeyPi from "./KeyPi";

type Stats = {
  TotalPartners: number;
  TotalApproved: number;
  TotalPending: number;
  TotalRejected: number;
};
function AdminDashboard() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const handleGetData = async () => {
    try {
      const { data } = await axiosClient.get("/api/admin/dashboard");
      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b z-40">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NextImage
              src={"/logo.png"}
              alt="Logo"
              width={100}
              height={100}
              priority
            />
          </div>

          <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-black text-white">
            <User size={16} />
            Admin Dashboard
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-12 px-6 space-y-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <KeyPi
            label="Total Partners"
            value={stats?.TotalPartners}
            icon={<User size={24} />}
            variants="TotalPartners"
          />
          <KeyPi
            label="Total Approved"
            value={stats?.TotalApproved}
            icon={<CheckCircle2 size={24} />}
            variants="Approved"
          />
          <KeyPi
            label="Total Pending"
            value={stats?.TotalPending}
            icon={<Clock size={24} />}
            variants="Pending"
          />
          <KeyPi
            label="Total Rejected"
            value={stats?.TotalRejected}
            icon={<XCircle size={24} />}
            variants="Rejected"
          />
        </div>
        <div className="bg-white rounded-2xl p-2 border shadow-lg border-gray-200 flex flex-wrap gap-2"></div>
      </main>
    </div>
  );
}
export default AdminDashboard;
