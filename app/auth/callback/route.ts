import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth-navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(new URL(next, request.url));
      response.cookies.delete("nexo-auth-next");
      return response;
    }
  }

  const errorUrl = new URL("/auth/sign-in", request.url);
  errorUrl.searchParams.set("error", "confirmation");
  const response = NextResponse.redirect(errorUrl);
  response.cookies.delete("nexo-auth-next");
  return response;
}
