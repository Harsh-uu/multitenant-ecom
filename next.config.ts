import { withPayload } from "@payloadcms/next/withPayload";

import type { NextConfig } from "next";

const serverUrl = new URL(
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimized images are immutable per URL; cache them for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: serverUrl.protocol === "https:" ? "https" : "http",
        hostname: serverUrl.hostname,
      },
      {
        // Media uploaded via @payloadcms/storage-vercel-blob
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    // Tree-shake barrel imports from these packages.
    optimizePackageImports: ["lucide-react", "date-fns", "recharts"],
    // Inline CSS into the HTML so first paint doesn't wait on a separate
    // stylesheet request (it was starved by scripts on slow mobile links).
    inlineCss: true,
  },
};

const config = withPayload(nextConfig);

// Payload sends Accept-CH/Critical-CH: Sec-CH-Prefers-Color-Scheme on every
// route so its admin panel can pick a theme. Critical-CH makes the browser
// re-request the whole page once to attach the hint (~600ms on mobile), and
// the storefront doesn't use it, so keep those headers on /admin only.
const payloadHeaders = config.headers;
config.headers = async () =>
  ((await payloadHeaders?.()) ?? []).map((rule) =>
    rule.source === "/:path*" && rule.headers.some((h) => h.key === "Critical-CH")
      ? { ...rule, source: "/admin/:path*" }
      : rule
  );

export default config;
