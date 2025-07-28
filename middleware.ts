import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "./lib/supabase-server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};