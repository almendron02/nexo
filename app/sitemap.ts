import type { MetadataRoute } from "next";
import { libraryEntries } from "@/content/library";
import { preModule04LessonDefinitions } from "@/content/spanish-foundations/stage-01";
import { absoluteUrl } from "@/lib/site";

const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/start", priority: 0.95, changeFrequency: "monthly" },
  { path: "/course", priority: 0.9, changeFrequency: "monthly" },
  { path: "/library", priority: 0.85, changeFrequency: "weekly" },
  { path: "/about", priority: 0.75, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/open-source", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.35, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.35, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-19T00:00:00.000Z");

  return [
    ...publicRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...libraryEntries.map((entry) => ({
      url: absoluteUrl(`/library/${entry.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    {
      url: absoluteUrl("/module/0"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...preModule04LessonDefinitions
      .filter((lesson) => lesson.id.startsWith("0."))
      .map((lesson) => ({
        url: absoluteUrl(`/lesson/${lesson.id}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
  ];
}
