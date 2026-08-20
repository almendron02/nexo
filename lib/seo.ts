import type { Metadata } from "next";

export function publicPageMetadata(
  title: string,
  description: string,
  path: string,
  options: { absoluteTitle?: boolean } = {},
): Metadata {
  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: "website", url: path },
    twitter: { title, description },
  };
}

export function privateLessonMetadata(id: string, title: string): Metadata {
  return {
    title: `Lesson ${id}: ${title}`,
    robots: { index: false, follow: false },
  };
}
