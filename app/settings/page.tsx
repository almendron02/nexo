import type { Metadata } from "next";
import { SettingsPage } from "@/components/SettingsPage";

export const metadata: Metadata = {
  title: "Settings — Nexo",
  description: "Course preferences and local prototype data.",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
