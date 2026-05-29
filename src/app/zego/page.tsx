"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function page() {
  const { userData } = useSelector((state: RootState) => state.user);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const startCall = async () => {
    try {
      if (!containerRef.current) return;

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
        "test-room",
        userData?._id?.toString() || "guest",
        "joylon",
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  return (
    <div ref={containerRef} className="h-screen">
      <button onClick={startCall}>click</button>
    </div>
  );
}

export default page;
