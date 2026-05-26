import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/login/", "/portal/"],
    },
    sitemap: "https://gopraxis.ai/sitemap.xml",
  }
}
