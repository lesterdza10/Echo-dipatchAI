"use client";
import React from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  CreditCard,
  Landmark,
  Phone,
} from "lucide-react";

function page() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className="text-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-xs text-gray-500 font-medium">step 3 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Bank and Payout Setup</h1>
          <p className="text-sm text-gray-600 mt-2">
            Used for partner payouts.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="ahn"
              className="text-xs font-semibold text-gray-500"
            >
              Account Holder Name
            </label>
            <div className="flex  items-center mt-2 gap-4">
              <div className="text-gray-400">
                <BadgeCheck />
              </div>
              <input
                id="ahn"
                type="text"
                placeholder="Enter account holder name"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="ban"
              className="text-xs font-semibold text-gray-500"
            >
              Bank Account Number
            </label>
            <div className="flex  items-center mt-2 gap-4">
              <div className="text-gray-400">
                <CreditCard />
              </div>
              <input
                id="ban"
                type="text"
                placeholder="Enter bank account number"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="ifsc"
              className="text-xs font-semibold text-gray-500"
            >
              IFSC Code
            </label>
            <div className="flex  items-center mt-2 gap-4">
              <div className="text-gray-400">
                <Landmark />
              </div>
              <input
                id="ifsc"
                type="text"
                placeholder="Enter IFSC code"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="mn" className="text-xs font-semibold text-gray-500">
              Mobile Number
            </label>
            <div className="flex  items-center mt-2 gap-4">
              <div className="text-gray-400">
                <Phone />
              </div>
              <input
                id="mn"
                type="text"
                placeholder="Enter mobile number"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="upi"
              className="text-xs font-semibold text-gray-500"
            >
              UPI ID (optional)
            </label>
            <div className="flex  items-center mt-2 gap-4">
              <input
                id="upi"
                type="text"
                placeholder="Enter UPI ID"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <CheckCircle />
          <p>
            Bank details are verified before payouts are processed.This usually
            takes 1-2 business days.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 w-full h-14 bg-black text-white font-semibold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 transition"
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
}

export default page;
