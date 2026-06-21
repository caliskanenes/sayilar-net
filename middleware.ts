import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

function detectLocale(req: NextRequest): string {
  const acceptLang = req.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang.split(",")[0].split("-")[0].toLowerCase();
    if ((LOCALES as string[]).includes(preferred)) return preferred;
  }
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    const locale = detectLocale(req);
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
