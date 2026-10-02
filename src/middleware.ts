import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import {
  INTERNAL_API_PATH,
  INTERNAL_PAGE_PATH,
  PRIVATE_HEADERS,
  adminBasePath,
  isAuthorized,
  unauthorizedResponse,
} from "./lib/admin-auth";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Internal panel routes are only reachable through the secret path
  if (pathname.startsWith(INTERNAL_PAGE_PATH) || pathname.startsWith(INTERNAL_API_PATH)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const base = adminBasePath();
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    if (!isAuthorized(request.headers.get("authorization"))) return unauthorizedResponse();

    const rest = pathname.slice(base.length);
    const target = rest.startsWith("/api/")
      ? `${INTERNAL_API_PATH}${rest.slice(4)}`
      : `${INTERNAL_PAGE_PATH}${rest}`;
    const response = NextResponse.rewrite(new URL(`${target}${search}`, request.url));
    for (const [k, v] of Object.entries(PRIVATE_HEADERS)) response.headers.set(k, v);
    return response;
  }

  if (pathname.startsWith("/api/")) return NextResponse.next();
  return intlMiddleware(request);
}

export const config = {
  // Skip internal paths and static files, but handle everything else
  matcher: ["/api/panel-internal/:path*", "/((?!og|rss|api|_next|.*\\.).*)"],
};
