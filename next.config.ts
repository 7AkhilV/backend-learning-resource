import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
