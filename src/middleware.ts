import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

function getSubdomain(hostname: string, rootDomain: string): string | null {
  const host = hostname.split(":")[0];
  const root = rootDomain.split(":")[0];
  if (hostname === rootDomain || host === root) return null;
  if (hostname.endsWith(`.${rootDomain}`) || host.endsWith(`.${root}`)) {
    return host.replace(`.${root}`, "");
  }
  return null;
}

const PROTECTED_PATHS = ["/dashboard", "/editor", "/templates", "/settings", "/onboarding", "/yardim", "/blog", "/submissions", "/analytics"];
const AUTH_PATHS = ["/login"];

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  // Rewrite /uploads/* to /api/uploads/* (standalone mode can't serve static uploads)
  if (pathname.startsWith("/uploads/")) {
    const url = req.nextUrl.clone();
    url.pathname = `/api${pathname}`;
    return NextResponse.rewrite(url);
  }

  const subdomain = getSubdomain(hostname, ROOT_DOMAIN);

  // www → main domain redirect
  if (subdomain === "www") {
    const url = req.nextUrl.clone();
    url.host = ROOT_DOMAIN.split(":")[0];
    return NextResponse.redirect(url, 301);
  }

  // Custom domain check — before the "no subdomain" block
  // If hostname is not a subdomain of ROOT_DOMAIN and not ROOT_DOMAIN itself, check DB
  if (!subdomain) {
    const host = hostname.split(":")[0];
    const rootHost = ROOT_DOMAIN.split(":")[0];

    if (host !== rootHost && host !== "localhost") {
      try {
        const lookupUrl = `http://localhost:${process.env.PORT || 3000}/api/internal/domain-lookup?domain=${encodeURIComponent(host)}`;
        const res = await fetch(lookupUrl);
        const { site } = await res.json();

        if (site && site.isPublished && site.domainVerified) {
          if (req.headers.get("Next-Action")) {
            return new NextResponse(null, { status: 404 });
          }
          const url = req.nextUrl.clone();
          url.pathname = `/sites/${site.subdomain}${pathname === "/" ? "" : pathname}`;
          const requestHeaders = new Headers(req.headers);
          requestHeaders.set("x-subdomain-rewrite", "1");
          return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
        }
      } catch (err) {
        console.error("[middleware] Custom domain lookup failed:", err);
      }
    }
  }

  // No subdomain or 'app' → standard routing with auth
  if (!subdomain || subdomain === "app" || subdomain === "pixel") {
    let token = null;
    try {
      token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    } catch {
      // Secret missing or token decode failed — treat as unauthenticated
    }

    // Redirect authenticated users away from auth pages
    if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && token) {
      const dest = token.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    }

    const isProtected =
      PROTECTED_PATHS.some((p) => pathname.startsWith(p)) ||
      pathname.startsWith("/admin");

    if (isProtected && !token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isProtected && token) {
      // Admin: SUPER_ADMIN only
      if (pathname.startsWith("/admin") && token.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // Onboarding check
      if (
        token.onboarded === false &&
        !pathname.startsWith("/onboarding") &&
        !pathname.startsWith("/admin")
      ) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }

    return NextResponse.next();
  }

  // Any other subdomain → public site rewrite
  // Don't rewrite Next.js server-action POSTs — public site pages have no
  // server actions, so these are always stale-browser requests that should
  // 404 cleanly rather than causing a confusing "workers" error.
  if (req.headers.get("Next-Action")) {
    return new NextResponse(null, { status: 404 });
  }

  const url = req.nextUrl.clone();
  url.pathname = `/sites/${subdomain}${pathname === "/" ? "" : pathname}`;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-subdomain-rewrite", "1");
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|css|js|woff2?)$).*)",
  ],
};
