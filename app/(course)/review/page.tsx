import type { Metadata } from "next";
import { ReviewSession } from "@/components/ReviewSession";

export const metadata: Metadata = {
  title: "Review",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return <ReviewSession />;
}
