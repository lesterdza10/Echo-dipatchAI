"use client";
import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import {
  ArrowLeft,
  CircleDashed,
  CheckCircle,
  CreditCard,
  Landmark,
  BadgeCheck,
  Phone,
} from "lucide-react";
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function page() {
  const router = useRouter();
  const [accountHolderName, setAccountHolderName] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [ifscCode, setIfscCode] = React.useState("");
  const [upi, setUpi] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const sanitizedIfsc = ifscCode.trim().toUpperCase();
  const isAccountNumberValid = accountNumber.trim().length >= 9;
  const isNameValid = accountHolderName.trim().length >= 3;
  const isIfscValid = IFSC_REGEX.test(sanitizedIfsc);
  const isMobileValid = mobileNumber.trim().length == 10;
  const CanSubmit =
    isNameValid && isIfscValid && isMobileValid && isAccountNumberValid;

  const handleBank = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosClient.post("/api/partner/onboarding/bank", {
        accountHolderName,
        accountNumber,
        ifscCode: sanitizedIfsc,
        upi,
        mobileNumber,
      });
      setLoading(false);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to save bank details. Please try again.",
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleGetBank = async () => {
      try {
        const { data } = await axiosClient.get("/api/partner/onboarding/bank");
        setAccountHolderName(data.partnerBank?.accountHolderName || "");
        setAccountNumber(data.partnerBank?.accountNumber || "");
        setIfscCode(data.partnerBank?.ifscCode || "");
        setUpi(data.partnerBank?.upi || "");
        setMobileNumber(data.mobileNumber || "");
      } catch (error: any) {
        console.log(error);
      }
    };
    handleGetBank();
  }, []);

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
                className={`flex-1 border-b pb-2 text-sm focus:outline-none
                  ${!isNameValid && accountHolderName.length > 0 ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"}
         `}
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
            </div>
            {!isNameValid && accountHolderName.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                Enter valid account holder name
              </p>
            )}
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
                className={`flex-1 border-b pb-2 text-sm focus:outline-none
                  ${!isAccountNumberValid && accountNumber.length > 0 ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"}
         `}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            {!isAccountNumberValid && accountNumber.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                Enter valid bank account number
              </p>
            )}
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
                className={`flex-1 border-b pb-2 text-sm focus:outline-none
                  ${!isIfscValid && ifscCode.length > 0 ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"}
         `}
                value={ifscCode.toUpperCase()}
                onChange={(e) => setIfscCode(e.target.value)}
              />
            </div>
            {!isIfscValid && ifscCode.length > 0 && (
              <p className="mt-1 text-xs text-red-500">Enter valid IFSC code</p>
            )}
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
                className={`flex-1 border-b pb-2 text-sm focus:outline-none
                  ${!isMobileValid && mobileNumber.length > 0 ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"}
         `}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            {!isMobileValid && mobileNumber.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                Enter valid mobile number
              </p>
            )}
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
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
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
        {error && <div className="mt-4 text-sm text-red-500">*{error}</div>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBank}
          disabled={!CanSubmit || loading}
          className="mt-8 w-full h-14 bg-black text-white font-semibold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 transition"
        >
          {loading ? (
            <CircleDashed className="text-white animate-spin" />
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default page;
