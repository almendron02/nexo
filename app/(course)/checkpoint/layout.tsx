import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course checkpoint",
  robots: { index: false, follow: false },
};

export default function CheckpointLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
