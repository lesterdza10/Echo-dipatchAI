import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.33", "192.168.1.34"],
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: process.env.NEXT_PUBLIC_ZEGO_APP_ID,
    NEXT_PUBLIC_ZEGO_SERVER_SECRET: process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET,
  },
};

export default nextConfig;
