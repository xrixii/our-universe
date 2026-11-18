import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '192.168.1.2',
    '192.168.1.2:8000',
    'localhost',
    'localhost:8000',
  ],
};

export default nextConfig;
