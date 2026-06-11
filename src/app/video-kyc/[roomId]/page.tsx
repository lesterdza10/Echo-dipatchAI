"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/legacy/image";
import { div } from "motion/react-client";
import { motion } from "motion/react";
import {
  CheckCircle,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOffIcon,
  X,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { AnimatePresence, MotionConfig } from "motion/react";

function page() {
  const { userData } = useSelector((state: RootState) => state.user);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [joined, setJoined] = React.useState(false);

  const PreviewRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = React.useState(true);
  const [isAudioOn, setIsAudioOn] = React.useState(true);
  const { roomId } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [aLoading, setALoading] = React.useState(false);
  const [rloading, setRLoading] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [showApproveModal, setShowApproveModal] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    if (joined) return;
    let localStream: MediaStream;
    const init = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (PreviewRef.current) {
          PreviewRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.log(error);
      }

      init();
    };
  }, []);
  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !isCameraOn;
    });
    setIsCameraOn(!isCameraOn);
  };

  const toggleAudio = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !isAudioOn;
    });
    setIsAudioOn(!isAudioOn);
  };

  const handleApproved = async () => {
    setALoading(true);
    try {
      const { data } = await axiosClient.post("/api/admin/video-kyc/complete", {
        roomId,
        action: "approved",
      });
      console.log(data);
      setALoading(false);
      router.push("/");
    } catch (error: any) {
      console.error(error.response?.data || error);
      setALoading(false);
    }
  };

  const handleRejected = async () => {
    setRLoading(true);
    try {
      const { data } = await axiosClient.post("/api/admin/video-kyc/complete", {
        roomId,
        action: "rejected",
        reason,
      });
      console.log(data);
      setRLoading(false);
      router.push("/");
    } catch (error: any) {
      console.error(error.response?.data || error);
      setRLoading(false);
    }
  };

  const startCall = async () => {
    setLoading(true);
    try {
      if (!containerRef.current) return;

      const displayName =
        userData?.role === "admin"
          ? "Admin"
          : `${userData?.name} (${userData?.email})}`;

      const appIDRaw = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
      if (!appIDRaw || !serverSecret) {
        console.error("Missing ZEGOCLOUD env vars.");
        return;
      }

      const appID = Number(appIDRaw);
      if (!Number.isFinite(appID) || appID <= 0) {
        console.error("Invalid ZEGOCLOUD app ID.");
        return;
      }

      const { ZegoUIKitPrebuilt } =
        await import("@zegocloud/zego-uikit-prebuilt");

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId?.toString()!,
        userData?._id?.toString() || "guest",
        displayName,
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
      setJoined(true);
      setLoading(false);
    } catch (error) {
      console.error("Error starting call:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <div
        className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between
    items-start sm:items-center gap-4"
      >
        <div>
          <Image src={"/logo.png"} alt="logo" width={44} height={44} priority />
          <p className="text-xs text-gray-400">
            {userData?.role == "admin"
              ? "Admin Verification"
              : "Partner Video KYC"}
          </p>
        </div>
        {joined && (
          <div className="flex flex-wrap gap-3">
            {userData?.role === "admin" && (
              <>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 
                rounded-full flex text-sm items-center gap-2"
                >
                  <CheckCircle size={24} /> Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 
                rounded-full flex text-sm items-center gap-2"
                >
                  <XCircle size={24} /> Reject
                </button>
              </>
            )}
            <button
              onClick={() => router.push("/")}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 
                rounded-full flex text-sm items-center gap-2"
            >
              <PhoneOff size={24} /> End Call
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className={`absolute inset-0 ${joined ? "block" : "hidden"}`}
        />
        {!joined && (
          <div className="h-full flex items-center justify-center px-0 py-10">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white">
                <video
                  ref={PreviewRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                />
                {!isCameraOn && (
                  <div>
                    <VideoOffIcon
                      size={48}
                      className="absolute inset-0 bg-black flex items-center justify-center"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Secure Video KYC
                </h1>
                <div className="flex justify-center lg:justify-start gap-6">
                  <button
                    onClick={toggleCamera}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition${
                      isCameraOn
                        ? " bg-white text-black"
                        : " bg-white/10 border border-white/20 "
                    }`}
                  >
                    {isCameraOn ? <Video /> : <VideoOffIcon />}
                  </button>
                  <button
                    onClick={toggleAudio}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition${
                      isAudioOn
                        ? " bg-white text-black"
                        : " bg-white/10 border border-white/20 "
                    }`}
                  >
                    {isAudioOn ? <Mic /> : <MicOff />}
                  </button>
                </div>
                <button
                  disabled={loading}
                  onClick={startCall}
                  className="w-full bg-white text-black py-4 rounded-xl font-semibold"
                >
                  {loading ? "Connecting..." : "Join Secure Call"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showApproveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 text-gray-400"
                onClick={() => setShowApproveModal(false)}
              >
                <X size={16} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Confirm Approval</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 border rounded-xl py-2"
                >
                  Cancel
                </button>
                <button
                  disabled={aLoading}
                  onClick={handleApproved}
                  className="flex-1 bg-green-600  py-2 rounded-xl "
                >
                  {aLoading ? "Processing..." : "Approve"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 text-gray-400"
                onClick={() => setShowRejectModal(false)}
              >
                <X size={16} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Reject Partner</h2>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter rejection reason"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mb-4 text-sm"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 border rounded-xl py-2"
                >
                  Cancel
                </button>
                <button
                  disabled={rloading}
                  onClick={handleRejected}
                  className="flex-1 bg-green-600  py-2 rounded-xl "
                >
                  {rloading ? "Processing..." : "Reject"}
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
