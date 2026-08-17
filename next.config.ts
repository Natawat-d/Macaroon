import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle so the Docker runtime stage stays small.
  output: "standalone",
};

export default nextConfig;
