import { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";

// A curated list of "interesting" numbers worth pre-listing in the sitemap.
// The site itself supports ANY integer dynamically; this list just gives
// search engines strong starting points (small numbers, famous primes,
// round numbers, etc).
const FEATURED_NUMBERS: number[] = [
  0, 1, -1, 2, 3, 7, 10, 13, 21, 42, 69, 100, 101, 123, 144, 200, 365, 404,
  500, 666, 777, 786, 1000, 1071, 1453, 1923, 2024, 2025, 2026, 9999, 10000,
  1000000,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sayilar.net";
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Locale home pages
  for (const locale of LOCALES) {
    entries.push({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  // Featured number pages per locale
  for (const locale of LOCALES) {
    for (const n of FEATURED_NUMBERS) {
      entries.push({
        url: `${base}/${locale}/${n}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
