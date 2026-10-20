import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const recentHits = new Map<string, number>();

// Cleanup every 2 minutes
setInterval(() => {
  const now = Date.now();
  recentHits.forEach((ts, key) => {
    if (now - ts > 30_000) recentHits.delete(key);
  });
}, 120_000);

const BOT_PATTERN = /bot|crawler|spider|slurp|mediapartners|facebookexternalhit|bingpreview/i;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteSubdomain, path, referrer } = body as {
      siteSubdomain?: string;
      path?: string;
      referrer?: string;
    };

    if (!siteSubdomain || !path) {
      return new Response(null, { status: 204 });
    }

    const ua = req.headers.get("user-agent") || "";
    if (BOT_PATTERN.test(ua)) {
      return new Response(null, { status: 204 });
    }

    // Rate-limit: same IP+path within 30s
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const dedupeKey = `${ip}:${siteSubdomain}:${path}`;
    const lastHit = recentHits.get(dedupeKey);
    if (lastHit && Date.now() - lastHit < 30_000) {
      return new Response(null, { status: 204 });
    }
    recentHits.set(dedupeKey, Date.now());

    const site = await prisma.site.findUnique({
      where: { subdomain: siteSubdomain },
      select: { id: true, isPublished: true },
    });

    if (!site || !site.isPublished) {
      return new Response(null, { status: 204 });
    }

    await prisma.pageView.create({
      data: {
        siteId: site.id,
        path,
        referrer: referrer || "",
        userAgent: ua,
      },
    });

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
}
