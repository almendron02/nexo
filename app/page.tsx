import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";

export const metadata: Metadata = {
  title: "Nexo — Spanish that finally connects",
  description: "A complete, structured Spanish course for serious beginners. Learn in the right order, understand how it works, and practice until you can use it yourself.",
};

export default function Home() {
  return <HomePage />;
}
