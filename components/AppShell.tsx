"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/(course)/auth/actions";
import { NexoMark } from "@/components/NexoMark";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/library", label: "Library" },
  { href: "/course", label: "Course" },
  { href: "/about", label: "About" },
  { href: "/open-source", label: "Open source" },
  { href: "/review", label: "Review" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children, userEmail }: { children: React.ReactNode; userEmail: string | null }) {
  const pathname = usePathname();
  const marketing = pathname === "/";
  const immersive = pathname.startsWith("/lesson/") || pathname.startsWith("/checkpoint/") || pathname === "/review";

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/course") return pathname === "/course" || pathname.startsWith("/module/") || pathname.startsWith("/lesson/") || pathname.startsWith("/checkpoint/");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (marketing) {
    return <div className="app-shell is-marketing">{children}</div>;
  }

  return (
    <div className={immersive ? "app-shell is-immersive" : "app-shell"}>
      {!immersive ? (
        <header className="app-header">
          <div className={userEmail ? "app-menu is-authenticated" : "app-menu"}>
            <NexoMark />
            <nav className="app-menu__links" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={active ? "app-menu__item is-active" : "app-menu__item"}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            );
          })}
            </nav>
            {userEmail ? (
              <div className="app-menu__account">
                <span title={userEmail}>{userEmail}</span>
                <form action={signOutAction}><button type="submit">Sign out</button></form>
              </div>
            ) : (
              <Link className="app-menu__sign-in" href="/auth/sign-in">Sign in</Link>
            )}
          </div>
        </header>
      ) : null}
      <main className="app-main">{children}</main>
      {!immersive ? (
        <footer className="app-legal-footer">
          <p>© 2026 Nexo · Free and open source</p>
          <nav aria-label="Legal and support">
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </footer>
      ) : null}
    </div>
  );
}
