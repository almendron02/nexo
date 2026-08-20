import type { Metadata } from "next";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Nexo — Spanish that finally connects",
    template: "%s | Nexo",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Angel Gonzalez" }],
  creator: "Angel Gonzalez",
  publisher: siteName,
  category: "education",
  keywords: [
    "learn Spanish",
    "Spanish course for beginners",
    "Latin American Spanish",
    "Spanish grammar",
    "free Spanish course",
    "open source education",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
