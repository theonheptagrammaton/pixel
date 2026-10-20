export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { validateDomain } from "@/lib/sanitize";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  addDomainToApplication,
  removeDomainFromApplication,
} from "@/lib/traefik";
import { ApiResponse } from "@/types";

const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP ?? "";

/* ── Helper: DNS check via system resolver ──────────── */
// Uses Node's built-in dns module (container's DNS resolver) — no outbound
// HTTP required. Accepts any A record or CNAME; we don't enforce a specific IP
// because Cloudflare proxy returns its own IPs.
async function checkDns(domain: string): Promise<boolean> {
  const resolver = new dns.promises.Resolver();
  // Prefer system resolver; also try Cloudflare as fallback if reachable
  try {
    const addresses = await resolver.resolve4(domain);
    if (addresses.length > 0) return true;
  } catch {
    // No A record — try CNAME
  }
  try {
    const cnames = await resolver.resolveCname(domain);
    if (cnames.length > 0) return true;
  } catch {
    // No CNAME either
  }
  return false;
}

/* ── PUT — Set custom domain ─────────────────────────── */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const rl = checkRateLimit(`domain:${session.user.id}`, 10, 60_000);
    if (!rl.allowed) return rateLimitResponse(rl.resetAt);

    const site = await prisma.site.findUnique({ where: { id: params.id } });
    if (!site) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }
    if (site.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu siteyi duzenleme yetkiniz yok." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const rawDomain = ((body?.domain as string) ?? "").toLowerCase().trim();
    const validation = validateDomain(rawDomain);
    if (!validation.valid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: validation.reason },
        { status: 400 }
      );
    }

    // Check uniqueness
    const conflict = await prisma.site.findFirst({
      where: { customDomain: rawDomain, NOT: { id: params.id } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu domain zaten baska bir site tarafindan kullaniliyor." },
        { status: 409 }
      );
    }

    // Remove old domain from Traefik if changing
    if (site.customDomain && site.customDomain !== rawDomain) {
      try {
        await removeDomainFromApplication(site.customDomain);
      } catch (err) {
        console.error("[domain] Failed to remove old domain from Traefik:", err);
      }
    }

    // Save domain — NOT verified yet, user must configure DNS first
    const updated = await prisma.site.update({
      where: { id: params.id },
      data: { customDomain: rawDomain, domainVerified: false },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        site: updated,
        serverIp: SERVER_IP,
      },
    });
  } catch (error) {
    console.error("[PUT /api/sites/[id]/domain]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

/* ── GET — Verify DNS ────────────────────────────────── */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const rl = checkRateLimit(`dns-check:${session.user.id}`, 20, 60_000);
    if (!rl.allowed) return rateLimitResponse(rl.resetAt);

    const site = await prisma.site.findUnique({ where: { id: params.id } });
    if (!site || site.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }
    if (!site.customDomain) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Ozel domain ayarlanmamis." },
        { status: 400 }
      );
    }

    const domain = site.customDomain;

    // Already verified — ensure Traefik config exists (may be missing after redeploy)
    if (site.domainVerified) {
      try {
        await addDomainToApplication(domain);
      } catch (err) {
        console.error("[domain] Traefik config ensure failed:", err);
      }
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { dnsVerified: true, domainActive: true },
      });
    }
    const dnsOk = await checkDns(domain);

    if (dnsOk) {
      // DNS correct — write Traefik config (optional) and mark verified
      try {
        await addDomainToApplication(domain);
      } catch (err) {
        console.error("[domain] Traefik config failed (non-blocking):", err);
      }

      await prisma.site.update({
        where: { id: params.id },
        data: { domainVerified: true },
      });

      return NextResponse.json<ApiResponse>({
        success: true,
        data: { dnsVerified: true, domainActive: true },
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { dnsVerified: false, domainActive: false },
    });
  } catch (error) {
    console.error("[GET /api/sites/[id]/domain]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

/* ── DELETE — Remove custom domain ───────────────────── */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const site = await prisma.site.findUnique({ where: { id: params.id } });
    if (!site || site.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }

    if (site.customDomain) {
      try {
        await removeDomainFromApplication(site.customDomain);
      } catch (err) {
        console.error("[domain] Traefik remove failed:", err);
      }
    }

    const updated = await prisma.site.update({
      where: { id: params.id },
      data: { customDomain: null, domainVerified: false },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { site: updated },
    });
  } catch (error) {
    console.error("[DELETE /api/sites/[id]/domain]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
