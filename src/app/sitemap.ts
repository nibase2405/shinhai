import type { MetadataRoute } from "next";
import { articles, attractions, hotels, restaurants } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shinehai-travel.vercel.app";
  const now = new Date();

  const staticRoutes = ["", "/blog", "/attractions", "/food", "/hotels", "/map"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  const articleRoutes = articles
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: new Date(article.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }));

  const placeRoutes = [
    ...attractions.map((item) => ({ url: `${siteUrl}/attractions/${item.slug}`, priority: 0.7 })),
    ...restaurants.map((item) => ({ url: `${siteUrl}/food/${item.slug}`, priority: 0.65 })),
    ...hotels.map((item) => ({ url: `${siteUrl}/hotels/${item.slug}`, priority: 0.65 }))
  ].map((route) => ({
    ...route,
    lastModified: now,
    changeFrequency: "monthly" as const
  }));

  return [...staticRoutes, ...articleRoutes, ...placeRoutes];
}
