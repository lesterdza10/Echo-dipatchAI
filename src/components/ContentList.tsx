"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";

function ContentList({ data, type }: any) {
  const router = useRouter();

  const handleStartVideoKyc = async (id: any) => {
    try {
      const result = await axiosClient.get(`/api/admin/video-kyc/start/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (data?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl py-16 text-center border border-dashed border-gray-200 shadow-sm"
      >
        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={22} className="text-green-400" />
        </div>
        <p className="text-base font-bold text-gray-800">All caught up!</p>
        <p className="text-gray-400 text-sm mt-1">
          There are no {type} reviews to display.
        </p>
      </motion.div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-centerjustify-between px-1 mb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {type == "partner"
            ? "Partner Reviews Queue"
            : type == "kyc"
              ? " Pending video KYC Queue"
              : "Vehicle Reviews Queue"}
        </p>
        <p className="text-xs text-gray-400">{data?.length} items</p>
      </div>
      {data?.map((item: any, index: number) => {
        const name = item.name;
        const email = item.email;

        return (
          <motion.div
            key={item._id ?? item.id ?? item.email ?? `${type}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.5 }}
            whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
            className="
            bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center
            justify-between gap-4 shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl  flex items-center justify-center text-sm font-bold shrink-0
              bg-purple-100 text-purple-800"
              >
                {name.charAt(0).toUpperCase() ?? <User size={14} />}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{name}</p>
                <p className="text-gray-400 truncate text-sm">{email}</p>
              </div>
            </div>
            <div className="shrink-0">
              {type === "kyc" ? (
                item.videoKycStatus === "pending" ? (
                  <motion.button
                    onClick={() => handleStartVideoKyc(item._id)}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950
                hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
                  >
                    Start video KYC <ArrowRight size={16} />
                  </motion.button>
                ) : item.videoKycStatus === "in_progress" ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      router.push(`/video-kyc/${item.videoKycRoomId}`)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950
                hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
                  >
                    Join Call <ArrowRight size={16} />
                  </motion.button>
                ) : null
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    type == "partner"
                      ? router.push(`/admin/reviews/partner/${item._id}`)
                      : router.push(`/admin/reviews/vehicle/${item._id}`)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950
                hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
                >
                  Review <ArrowRight size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ContentList;
