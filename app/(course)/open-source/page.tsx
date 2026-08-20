import type { Metadata } from "next";
import { OpenSourcePage } from "@/components/OpenSourcePage";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Free and Open-Source Spanish Course",
  "Nexo is a complete free Spanish course with MIT-licensed code, CC BY-SA 4.0 curriculum content, and account-backed progress with no paid tier.",
  "/open-source",
);

export default function OpenSourceRoute() {
  return <OpenSourcePage />;
}
