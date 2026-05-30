"use client";
import React, { useEffect } from "react";
import axiosClient from "@/lib/axiosClient";
import { useParams, useRouter } from "next/navigation";
import { div } from "motion/react-client";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { IUser } from "@/types/user";

function page() {
  const { id } = useParams();
  const [data, setData] = React.useState<IUser | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const handleGetData = async () => {
    try {
      const { data } = await axiosClient.get(
        `/api/admin/reviews/partner/${id}`,
      );
      setData(data.partner);
      setLoading(false);
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
        <div className="lg:col-span-2 space-y-8"></div>
      </main>
    </div>
  );
}

export default page;
