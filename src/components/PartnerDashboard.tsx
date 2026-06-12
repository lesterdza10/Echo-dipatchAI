"use client";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { Check, Clock, Lock, Video, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import RejectionCard from "./RejectionCard";
import StatusCard from "./StatusCard";
import ActionCard from "./ActionCard";
import axiosClient from "@/lib/axiosClient";
import PricingModal from "./PricingModal";
import { IVehicle } from "@/models/vehicle.model";

type step = {
  id: number;
  title: string;
  route?: string;
};

const steps: step[] = [
  { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
  { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
  { id: 3, title: "Bank Details", route: "/partner/onboarding/bank" },
  { id: 4, title: "Review" },
  { id: 5, title: "video KYC" },
  { id: 6, title: "Pricing" },
  { id: 7, title: "Final Review" },
  { id: 8, title: "Live" },
];
const TotalSteps = steps.length;

function PartnerDashboard() {
  const [activeStep, setActiveStep] = React.useState(0);
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [requestLoading, setRequestLoading] = React.useState(false);
  const [showPricing, setShowPricing] = React.useState(false);
  const [vehicleData, setVehicleData] = React.useState<IVehicle | null>(null);

  useEffect(() => {
    if (userData) {
      const onboardingStep = userData.partnerOnboardingSteps ?? 0;
      setActiveStep(onboardingStep + 1);
    }
  }, [userData]);

  const handleGetPricingData = async () => {
    try {
      const { data } = await axiosClient.get("/api/partner/onboarding/pricing");
      console.log(data);
      setVehicleData(data.vehicle);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPricingData();
  }, []);
  const goToStep = (step: step) => {
    if (
      step.id === 6 &&
      userData?.partnerStatus === "approved" &&
      userData?.videoKycStatus === "approved"
    ) {
      setShowPricing(true);
      return;
    }

    if (step.route && step.id <= activeStep) {
      router.push(step.route);
    }
  };
  const progressPercentage = ((activeStep - 1) / (TotalSteps - 1)) * 100;
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20">
      <div className="max-w-7xl mx-auto space-x-16">
        <div>
          <h1 className="text-4xl font-bold">Partner Dashboard</h1>
          <p className="text-gray-600 mt-3">
            Complete all steps to activate your account.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-10 shadow-xl border overflow-x-auto">
          <div className="relative min-w-[800px]">
            <div className="absolute top-7 left-0 w-full h-[3px] bg-gray-200 rounded-full" />
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6 }}
              className="absolute top-7 left-0 h-[3px] bg-black rounded-full"
            />
            <div className="flex justify-between relative">
              {steps.map((step, index) => {
                const completed = step.id < activeStep;
                const active = step.id === activeStep;
                const locked = step.id > activeStep;
                return (
                  <motion.div
                    key={step.id}
                    whileHover={!locked ? { scale: 1.1 } : {}}
                    className="flex flex-col items-center z-10 cursor-pointer"
                    onClick={() => goToStep(step)}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all
                      ${
                        completed
                          ? "bg-black border-black text-white"
                          : active
                            ? "border-black bg-white"
                            : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {completed ? (
                        <Check size={20} />
                      ) : locked ? (
                        <Lock size={20} />
                      ) : (
                        step.id
                      )}
                    </div>
                    <p className="text-sm font-semibold mt-3 text-center">
                      {step.title}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {activeStep == 4 && userData?.partnerStatus === "rejected" && (
          <RejectionCard
            title="Your application has been rejected"
            reason={userData.rejectionReason}
            actionLabel={`Review and Resubmit`}
            onAction={() => router.push("/partner/onboarding/vehicle")}
          />
        )}
        {activeStep == 4 && userData?.partnerStatus === "pending" && (
          <StatusCard
            icon={<Clock size={18} />}
            title={"Document under review"}
            description={"Admin is reviewing your application."}
          />
        )}

        {activeStep == 5 &&
          (userData?.videoKycStatus === "approved" ? (
            <StatusCard
              icon={<CheckCircle2 size={18} />}
              title={"Video KYC Approved"}
              description={"You can now proceed to pricing."}
            />
          ) : userData?.videoKycStatus === "rejected" ? (
            <RejectionCard
              title="Video KYC Rejected"
              reason={userData?.videoKycRejectionReason}
              actionLabel={
                requestLoading ? "Sending Request..." : "Request Again"
              }
              onAction={async () => {
                setRequestLoading(true);
                await axiosClient.get("/api/partner/video-kyc/request");
                setRequestLoading(false);
              }}
            />
          ) : userData?.videoKycStatus === "in_progress" &&
            userData?.videoKycRoomId ? (
            <ActionCard
              icon={<Video size={18} />}
              title={"Admin started video KYC"}
              button={"Join Call"}
              onClick={() =>
                router.push(`/video-kyc/${userData.videoKycRoomId}`)
              }
            />
          ) : (
            <StatusCard
              icon={<Clock size={18} />}
              title="waiting for admin to start video KYC"
              description="Admin will start the video KYC process soon. Please wait."
            />
          ))}
      </div>
      <PricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
        data={vehicleData}
      />
    </div>
  );
}
export default PartnerDashboard;
