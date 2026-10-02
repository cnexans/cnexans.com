// HTTP Basic Auth for the private contacts panel.
//
// The panel is served at a secret path (ADMIN_PATH) that the middleware
// rewrites to the internal routes below; the internal routes 404 when hit
// directly. The repo is public, so the real path only lives in env vars.
//
// Env (server only): ADMIN_PATH, ADMIN_USER, ADMIN_PASSWORD.
// Edge-compatible: used from middleware and from route handlers.

export const INTERNAL_PAGE_PATH = "/panel-internal";
export const INTERNAL_API_PATH = "/api/panel-internal";

export function adminBasePath(): string | null {
  const slug = process.env.ADMIN_PATH?.replace(/^\/+|\/+$/g, "");
  return slug ? `/${slug}` : null;
}

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    diff |= (x[i % x.length] ?? 0) ^ (y[i % y.length] ?? 0);
  }
  return diff === 0;
}

export function isAuthorized(authorization: string | null): boolean {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!user || !password || !authorization?.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = atob(authorization.slice(6).trim());
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return false;
  // Evaluate both to keep timing independent of which one fails
  const userOk = safeEqual(decoded.slice(0, sep), user);
  const passwordOk = safeEqual(decoded.slice(sep + 1), password);
  return userOk && passwordOk;
}

export const PRIVATE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
};

export function unauthorizedResponse(): Response {
  return new Response("Authentication required", {
    status: 401,
    headers: { ...PRIVATE_HEADERS, "WWW-Authenticate": 'Basic realm="private", charset="UTF-8"' },
  });
}
