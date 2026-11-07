import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/library"] },
    sitemap: `${getAppUrl()}/sitemap.xml`,
  };
}
