import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/auth/",
        "/dashboard",
        "/review",
        "/settings",
        "/checkpoint/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl.origin,
  };
}
