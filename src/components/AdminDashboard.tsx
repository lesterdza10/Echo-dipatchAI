"use client";
import { motion } from "motion/react";
import axiosClient from "@/lib/axiosClient";
import {
  User,
  CheckCircle2,
  Clock,
  XCircle,
  User2,
  Video,
  Truck,
} from "lucide-react";
import NextImage from "next/image";
import React, { useEffect } from "react";
import KeyPi from "./KeyPi";
import TabButton from "./TabButton";
import { AnimatePresence } from "motion/react";
import ContentList from "./ContentList";

type Stats = {
  TotalPartners: number;
  TotalApproved: number;
  TotalPending: number;
  TotalRejected: number;
};
type Tab = "partner" | "kyc" | "vehicle";
function AdminDashboard() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [activeTab, setActiveTab] = React.useState<Tab>("partner");
  const [partnerReviews, setPartnerReviews] = React.useState<any>();
  const [pendingKycReviews, setPendingKycReviews] = React.useState<any>();
  const [pendingVehicleReviews, setPendingVehicleReviews] =
    React.useState<any>();
  const handleGetData = async () => {
    try {
      const { data } = await axiosClient.get("/api/admin/dashboard");
      setStats(data.stats);
      setPartnerReviews(data.PendingPartnersReviews);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetPendingKyc = async () => {
    try {
      const { data } = await axiosClient.get("/api/admin/video-kyc/pending");
      setPendingKycReviews(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetData();
    handleGetPendingKyc();
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
        <div className="bg-white rounded-2xl p-2 border shadow-lg border-gray-200 flex flex-wrap gap-2">
          <TabButton
            active={activeTab === "partner"}
            count={partnerReviews?.length ?? 0}
            icon={<User2 size={15} />}
            onClick={() => setActiveTab("partner")}
          >
            pending Partner Reviews
          </TabButton>

          <TabButton
            active={activeTab === "kyc"}
            count={pendingKycReviews?.length ?? 0}
            icon={<Video size={15} />}
            onClick={() => setActiveTab("kyc")}
          >
            Pending KYC Reviews
          </TabButton>

          <TabButton
            active={activeTab === "vehicle"}
            count={pendingVehicleReviews?.length ?? 0}
            icon={<Truck size={15} />}
            onClick={() => setActiveTab("vehicle")}
          >
            Pending Vehicle Reviews
          </TabButton>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-3"
          >
            {activeTab === "partner" && (
              <ContentList data={partnerReviews ?? []} type="partner" />
            )}
            {activeTab === "kyc" && (
              <ContentList data={pendingKycReviews ?? []} type="kyc" />
            )}
            {activeTab === "vehicle" && (
              <ContentList data={pendingVehicleReviews ?? []} type="vehicle" />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
export default AdminDashboard;
