import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // A stray package-lock.json in the user's home folder confuses root detection.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
