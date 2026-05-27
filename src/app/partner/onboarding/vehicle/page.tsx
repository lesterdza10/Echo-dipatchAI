"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CarFront,
  Truck,
  Trash2,
  Van,
  CircleDashed,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { useSession } from "next-auth/react";

const vehicleTypes = [
  {
    id: "compactor",
    label: "Compactor Truck",
    icon: Truck,
    desc: "For large-scale garbage collection and transport.",
  },
  {
    id: "pickup",
    label: "Pickup Truck",
    icon: CarFront,
    desc: "Best for neighborhood waste pickup routes.",
  },
  {
    id: "mini-truck",
    label: "Mini Truck",
    icon: Van,
    desc: "Suitable for narrow streets and light waste loads.",
  },
  {
    id: "dump-truck",
    label: "Dump Truck",
    icon: Trash2,
    desc: "Useful for bulk garbage and debris collection.",
  },
];

function page() {
  const router = useRouter();
  const { status } = useSession();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleVehicle = async () => {
    setError("");
    try {
      setLoading(true);
      const { data } = await axiosClient.post(
        "/api/partner/onboarding/vehicle",
        {
          type: selectedVehicle,
          number: vehicleNumber,
          vehicleModel: vehicleModel,
        },
      );
      setLoading(false);
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className="text-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-xs text-gray-500 font-medium">step 1 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Vehicle Details</h1>
          <p className="text-sm text-gray-600 mt-2">
            Please provide the details of your vehicle.
          </p>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">
              Vehicle Type
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicleTypes.map((v, i) => {
                const Icon = v.icon;
                const active = selectedVehicle === v.id;

                return (
                  <motion.div
                    key={v.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`p-4 rounded-2xl border gap-2 items-center flex-col transition
                    ${
                      active
                        ? "bg-black text-white border-black"
                        : "border-gray-200  hover:border-black"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center
                      ${
                        active ? "bg-white text-black" : "bg-black text-white"
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="text-sm font-semibold">{v.label}</div>
                    <p
                      className={`text-xs ${active ? "text-gray-300" : "text-gray-500"}`}
                    >
                      {v.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div>
            <label htmlFor="vn" className="text-xs font-semibold text-gray-500">
              Vehicle Number
            </label>
            <input
              type="text"
              id="vn"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="ex: KA-01-AB-1234"
              className="mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition"
            />
          </div>
          <div>
            <label htmlFor="vm" className="text-xs font-semibold text-gray-500">
              Vehicle Model
            </label>
            <input
              type="text"
              id="vm"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              placeholder="ex: Toyota Camry"
              className="mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">*{error}</p>}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleVehicle}
          disabled={loading}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold items-center justify-center gap-2 disabled:opacity-40 transition flex"
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
