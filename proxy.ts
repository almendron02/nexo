import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth-navigation";
import { updateSession } from "@/lib/supabase/proxy";

function requiresAccount(pathname: string) {
  if (["/dashboard", "/review", "/settings"].some((path) => pathname === path || pathname.startsWith(`${path}/`))) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { authenticated, response } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  const confirmationCode = pathname === "/" ? request.nextUrl.searchParams.get("code") : null;
  if (confirmationCode) {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.searchParams.set("code", confirmationCode);
    callbackUrl.searchParams.set("next", safeNextPath(request.cookies.get("nexo-auth-next")?.value));
    const redirect = NextResponse.redirect(callbackUrl);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  if (!authenticated && requiresAccount(pathname)) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/auth/sign-in";
    signInUrl.search = "";
    signInUrl.searchParams.set("next", safeNextPath(`${pathname}${search}`));
    const redirect = NextResponse.redirect(signInUrl);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  if (authenticated && (pathname === "/auth/sign-in" || pathname === "/auth/sign-up")) {
    const next = safeNextPath(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(next, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
