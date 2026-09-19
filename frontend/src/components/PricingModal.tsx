"use client";
import { IVehicle } from "@/models/vehicle.model";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImagePlus, IndianRupee } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type PropsType = {
  open: boolean;
  onClose: () => void;
  data: IVehicle | null;
};

function PricingModal({ open, onClose, data }: PropsType) {
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [baseFare, setBaseFare] = React.useState("");
  const [pricePerKm, setPricePerKm] = React.useState("");
  const [waitingCharge, setWaitingCharge] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setPreview(data?.imageUrl || null);
      setBaseFare(data.baseFare?.toString() || "");
      setPricePerKm(data.pricePerKm?.toString() || "");
      setWaitingCharge(data.waitingCharge?.toString() || "");
    }
  }, [data]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("baseFare", baseFare);
      formData.append("pricePerKm", pricePerKm);
      formData.append("waitingCharge", waitingCharge);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axiosClient.post(
        "/api/partner/onboarding/pricing",
        formData,
      );
      console.log(data);
      setLoading(false);
      onClose();
    } catch (error: any) {
      console.log(error.response?.data || error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Pricing And Vehicle Image</h2>
            </div>
            <div className="p-6 space-y-6">
              <label
                htmlFor="imageLabel"
                className="relative h-44 border-2 border-dashed rounded-2xl flex items-center justify-center
                cursor-pointer"
              >
                {!preview ? (
                  <ImagePlus size={28} />
                ) : (
                  <img
                    src={preview}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="imageLabel"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>
              <div>
                <p className="text-sm mb-1 font-semibold">Base Fare</p>
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 bg-white">
                  <IndianRupee size={20} />
                  <input
                    type="text"
                    placeholder="Enter base fare"
                    className="outline-none w-full"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm mb-1 font-semibold">
                  Price Per Kilometer
                </p>
                <div className="flex items-center gap-2 mt-2 border rounded-xl px-4 py-3 bg-white">
                  <IndianRupee size={20} />
                  <input
                    type="text"
                    placeholder="Enter price per km"
                    className="outline-none w-full"
                    value={pricePerKm}
                    onChange={(e) => setPricePerKm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm mb-1 font-semibold">Waiting Charge</p>
                <div className="flex items-center gap-2 mt-2 border rounded-xl px-4 py-3 bg-white">
                  <IndianRupee size={20} />
                  <input
                    type="text"
                    placeholder="Enter waiting charge"
                    className="outline-none w-full"
                    value={waitingCharge}
                    onChange={(e) => setWaitingCharge(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex  gap-4">
              <button
                onClick={onClose}
                className="flex-1 border rounded-xl py-3 transition-transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-black text-white rounded-xl py-3 transition-transform hover:scale-105"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PricingModal;
