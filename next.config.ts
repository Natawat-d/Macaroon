import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle so the Docker runtime stage stays small.
  output: "standalone",
  // The app is fronted by Caddy at <host>/macaroon and owns that prefix itself
  // (the proxy uses `handle`, not `handle_path`, so it forwards the path intact).
  basePath: "/macaroon",
};

export default nextConfig;
