import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: [
    '192.168.1.2',
    '192.168.1.2:8000',
    '192.168.1.*',
    'localhost',
    'localhost:8000',
    '127.0.0.1',
    '127.0.0.1:8000',
  ],
};

export default nextConfig;
