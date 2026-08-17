import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle so the Docker runtime stage stays small.
  output: "standalone",
  // Served at the root of hellomacaron.com — no basePath. The old
  // <ip>/macaroon path is a 302 to this domain, handled in Caddy.
};

export default nextConfig;
