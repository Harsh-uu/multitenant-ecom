import { withPayload } from "@payloadcms/next/withPayload";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: (
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
        ).startsWith("https")
          ? "https"
          : "http",
        hostname: new URL(
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
        ).hostname,
      },
    ],
  },
  /* config options here */
};

export default withPayload(nextConfig);
