import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://sayilar.net/sitemap.xml",
    host: "https://sayilar.net",
  };
}
