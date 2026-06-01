"use client";
import React, { useEffect } from "react";
import axiosClient from "@/lib/axiosClient";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import {
  ArrowLeft,
  Car,
  CheckCircle,
  CircleDashed,
  Clock,
  FileText,
  Landmark,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { IUser } from "@/types/user";
import AnimatedCard from "@/components/AnimatedCard";
import { IVehicle } from "@/types/vehicle";
import DocPreview from "@/components/DocPreview";
import { IPartnerDocs } from "@/models/PartnerDocs.models";
import { IPartnerBank } from "@/models/partnerBank.model";

function page() {
  const { id } = useParams();
  const [data, setData] = React.useState<IUser | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [vehicleData, setVehicleData] = React.useState<IVehicle | null>(null);
  const [partnerDocs, setPartnerDocs] = React.useState<IPartnerDocs | null>(
    null,
  );
  const [bankData, setBankData] = React.useState<IPartnerBank | null>(null);
  const [showApprove, setShowApprove] = React.useState<boolean>(false);
  const [showReject, setShowReject] = React.useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [approveLoading, setApproveLoading] = React.useState<boolean>(false);
  const [rejectLoading, setRejectLoading] = React.useState<boolean>(false);

  const router = useRouter();
  const handleGetData = async () => {
    try {
      const { data } = await axiosClient.get(
        `/api/admin/reviews/partner/${id}`,
      );
      setData(data.partner);
      setLoading(false);
      setVehicleData(data.vehicle);
      setPartnerDocs(data.documents);
      setBankData(data.bank);
    } catch (error) {
      console.log("Error fetching partner data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Loading Partner...
      </div>
    );
  }
  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      const { data } = await axiosClient.get(
        `/api/admin/reviews/partner/${id}/approve`,
      );
      console.log(data);
      setApproveLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    try {
      const { data } = await axiosClient.post(
        `/api/admin/reviews/partner/${id}/reject`,
        {
          rejectionReason,
        },
      );
      console.log(data);
      setRejectLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setRejectLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 ">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="font-semibold text-lg">{data?.name}</div>
            <div className="text-xs text-gray-500">{data?.email}</div>
          </div>
          {data?.partnerStatus === "approved" ? (
            <div
              className="px-4 py-2 rounded-full text-xs font font-semibold inline-flex items-center
              gap-2 bg-green-100 text-green-700"
            >
              <CheckCircle size={14} />
              Approved
            </div>
          ) : data?.partnerStatus === "rejected" ? (
            <div
              className="px-4 py-2 rounded-full text-xs font font-semibold inline-flex items-center
              gap-2 bg-red-100 text-red-700"
            >
              <XCircle size={14} />
              Rejected
            </div>
          ) : (
            <div
              className="px-4 py-2 rounded-full text-xs font font-semibold inline-flex items-center
              gap-2 bg-yellow-100 text-yellow-700"
            >
              <Clock size={14} />
              Pending
            </div>
          )}
        </div>
      </div>
      <main className="max-w-7xl mx-auto p-4 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <AnimatedCard title="Vehicle Details" icon={<Car size={18} />}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Type</span>
              <span className="font-semibold">{vehicleData?.type || "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Registration Number</span>
              <span className="font-semibold">
                {vehicleData?.number || "-"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Model</span>
              <span className="font-semibold">
                {vehicleData?.vehicleModel || "-"}
              </span>
            </div>
          </AnimatedCard>
          <AnimatedCard title="Documents" icon={<FileText size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <DocPreview label={"Aadhar"} url={partnerDocs?.aadharUrl} />
              <DocPreview
                label={"Registration Certificate"}
                url={partnerDocs?.rcUrl}
              />
              <DocPreview
                label={"Driving License"}
                url={partnerDocs?.licenceUrl}
              />
            </div>
          </AnimatedCard>
        </div>
        <div className="space-y-8">
          <AnimatedCard title="Bank Details" icon={<Landmark size={18} />}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Holder</span>
              <span className="font-semibold">
                {bankData?.accountHolderName || "-"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Number</span>
              <span className="font-semibold">
                {bankData?.accountNumber || "-"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IFSC Code</span>
              <span className="font-semibold">{bankData?.ifscCode || "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">UPI ID</span>
              <span className="font-semibold">{bankData?.upi || "-"}</span>
            </div>
          </AnimatedCard>
          {data?.partnerStatus === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 shadow-xl space-y-6"
            >
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={24} />
                Admin Check
              </div>
              <p className="text-gray-500 text-sm">
                Verify documents carefully before approving.
              </p>
              <div className="flex flex-col gap-4">
                <button
                  className="py-3 rounded-2xl bg-gradient-to-r from-black to-gray-600 text-white px-4 font-semibold hover:opacity-90 hover:scale-105 transition"
                  onClick={() => setShowApprove(true)}
                >
                  Approve
                </button>
                <button
                  className="py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white px-4 font-semibold hover:opacity-90 hover:scale-105 transition"
                  onClick={() => setShowReject(true)}
                >
                  Reject
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showApprove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <h2 className="text-lg font-bold">Approve Partner?</h2>
              <p className="text-sm mt-2 text-gray-500">
                Confirm all information has been verified.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  className="flex-1 py-2 rounded-xl hover:scale-95 border"
                  onClick={() => setShowApprove(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 flex rounded-xl items-center justify-center bg-black hover:scale-95 text-white"
                  onClick={handleApprove}
                  disabled={approveLoading}
                >
                  {approveLoading ? (
                    <CircleDashed className="text-white animate-spin" />
                  ) : (
                    "Yes, Approve"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showReject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <h2 className="text-lg font-bold">Reject Partner?</h2>
              <p className="text-sm mt-2 text-gray-500">
                <textarea
                  placeholder="Enter reason for rejection(required)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2 border rounded-xl p-3 text-sm"
                />
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  className="flex-1 py-2 rounded-xl hover:scale-95 border"
                  onClick={() => setShowReject(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 flex rounded-xl items-center justify-center bg-black hover:scale-95 text-white"
                  onClick={handleReject}
                  disabled={rejectLoading}
                >
                  {rejectLoading ? (
                    <CircleDashed className="text-black animate-spin" />
                  ) : (
                    "Yes, Reject"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default page;
