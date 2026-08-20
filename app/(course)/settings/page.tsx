import type { Metadata } from "next";
import { SettingsPage } from "@/components/SettingsPage";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage Nexo course preferences, Spanish audio, and local or account-linked learner data.",
  robots: { index: false, follow: false },
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
