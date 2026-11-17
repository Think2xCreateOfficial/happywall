import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/database.types";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Only run auth checks on /admin routes
  if (!pathname.startsWith("/admin")) {
    return response;
  }

  // If Supabase is not configured yet, allow viewing login page with setup notice
  if (!isSupabaseConfigured()) {
    if (pathname !== "/admin/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  // getUser() securely validates the JWT with Supabase Auth on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin/login";

  if (!user && !isLoginPage) {
    // Unauthenticated visitor trying to access /admin or /admin/*
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    // Authenticated user accessing /admin/login
    // Verify admin privileges before redirecting to /admin
    const { data: isRpcAdmin } = await supabase.rpc("is_admin");
    if (isRpcAdmin === true) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.delete("redirect");
      return NextResponse.redirect(url);
    }
    // If authenticated user is NOT an admin, allow them on /admin/login to sign out or see message
    return response;
  }

  if (user && !isLoginPage) {
    // Server-side authorization verification on /admin routes
    const { data: isRpcAdmin, error: rpcErr } = await supabase.rpc("is_admin");
    if (!rpcErr && isRpcAdmin === false) {
      // Authenticated account is confirmed NOT an administrator
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return response;
}
