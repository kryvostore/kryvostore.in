import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { fetchProductHandlesForSitemap } from "@/lib/shopify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const lastMod = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: base, lastModified: lastMod, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/collections`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/about`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/contact`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/track-order`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/privacy`,
      lastModified: lastMod,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/terms`,
      lastModified: lastMod,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/refund`,
      lastModified: lastMod,
      changeFrequency: "yearly",
      priority: 0.35,
    },
  ];

  const products = await fetchProductHandlesForSitemap();
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/product/${p.handle}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticPaths, ...productEntries];
}
