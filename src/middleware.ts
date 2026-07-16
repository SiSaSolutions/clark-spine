import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { buildContentSecurityPolicy } from "@/lib/security/headers";
import { defaultLocale, isLocale, locales } from "@/i18n/locales";

const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Middleware responsibilities:
 *  1. Locale routing — redirect locale-less paths to a locale-prefixed URL.
 *     The destination locale is chosen ONLY from the allow-list (cookie →
 *     Accept-Language → default). No part of the redirect target is taken from
 *     user-controlled input, so this cannot be abused as an open redirect.
 *  2. Per-request CSP nonce — generate a fresh nonce, expose it to the app via
 *     the `x-nonce` request header, and set a strict Content-Security-Policy.
 */
export function middleware(request: NextRequest): NextResponse {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV !== "production";
  const csp = buildContentSecurityPolicy(nonce, isDev);

  const { pathname } = request.nextUrl;

  // 1. Locale routing (page routes only; API and assets are excluded by matcher).
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocale) {
    const locale = resolveLocale(request);
    const url = request.nextUrl.clone();
    // Build a locale-prefixed pathname; `pathname` is same-origin by construction.
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const redirect = NextResponse.redirect(url);
    applySecurityHeaders(redirect, csp);
    redirect.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: false,
      secure: !isDev,
    });
    return redirect;
  }

  // 2. Forward the nonce (and the validated active locale, used by the
  //    localized not-found boundary) to the app, and set the CSP on the response.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const activeLocale = pathname.split("/")[1];
  if (isLocale(activeLocale)) {
    requestHeaders.set("x-locale", activeLocale);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  applySecurityHeaders(response, csp);
  return response;
}

function applySecurityHeaders(response: NextResponse, csp: string): void {
  response.headers.set("Content-Security-Policy", csp);
}

function resolveLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const accept = request.headers.get("accept-language");
  if (accept) {
    // Parse "es-MX,es;q=0.9,en;q=0.8" → first supported base language.
    const preferred = accept
      .split(",")
      .map((part) => part.split(";")[0]?.trim().slice(0, 2).toLowerCase())
      .find((lang) => isLocale(lang));
    if (preferred) return preferred;
  }
  return defaultLocale;
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export const config = {
  // Run on everything except Next internals, the API, and static assets.
  matcher: [
    "/((?!_next/static|_next/image|api/|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico|css|js|txt|xml|woff2?)$).*)",
  ],
};
