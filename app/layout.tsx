import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { InterfaceSoundController } from "@/components/InterfaceSoundController";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nexo — Spanish, understood.",
  description: "A complete Spanish course, built in the right order.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <InterfaceSoundController />
        <AppShell userEmail={user?.email ?? null}>{children}</AppShell>
      </body>
    </html>
  );
}
