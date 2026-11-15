import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root to this folder, so a lockfile elsewhere on the machine is not picked up.
  turbopack: { root: process.cwd() },
  images: {
    // Project images are loaded from Behance for now. Remove this once they live in public/assets.
    remotePatterns: [{ protocol: "https", hostname: "mir-s3-cdn-cf.behance.net" }],
  },
};

export default nextConfig;
