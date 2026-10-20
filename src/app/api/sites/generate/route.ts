export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { ApiResponse } from "@/types";
import { generateSiteConfig, getSectorById, SiteGenerationOptions } from "@/lib/ai-site-generator";
import { sanitizeSubdomain } from "@/lib/sanitize";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 63)
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    // Rate limit: 5 per minute per user
    const rl = checkRateLimit(`generate:${session.user.id}`, 5, 60_000);
    if (!rl.allowed) {
      return rateLimitResponse(rl.resetAt);
    }

    const body = await req.json();
    const { businessName, sectorId, description, options } = body as {
      businessName?: string;
      sectorId?: string;
      description?: string;
      options?: SiteGenerationOptions;
    };

    if (!businessName || !businessName.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Isletme adi zorunludur." },
        { status: 400 }
      );
    }

    if (!sectorId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Sektor secimi zorunludur." },
        { status: 400 }
      );
    }

    const sector = getSectorById(sectorId);
    if (!sector) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gecersiz sektor." },
        { status: 400 }
      );
    }

    // Find the template by slug
    const template = await prisma.template.findFirst({
      where: { slug: sector.templateSlug, isActive: true },
    });

    if (!template) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Ilgili sablon bulunamadi." },
        { status: 404 }
      );
    }

    // Generate site config
    const config = generateSiteConfig(
      businessName.trim(),
      sectorId,
      description?.trim() || undefined,
      options
    );

    // Generate subdomain
    let subdomain = sanitizeSubdomain(slugify(businessName.trim()));
    if (subdomain.length < 3) {
      subdomain = sanitizeSubdomain(
        slugify(businessName.trim()) + "-site"
      );
    }

    // Check uniqueness
    const existing = await prisma.site.findFirst({
      where: { subdomain },
    });
    if (existing) {
      subdomain = `${subdomain}-${Math.random().toString(36).slice(2, 6)}`;
    }

    // Upsert: if user already has a site, update; otherwise create
    const existingSite = await prisma.site.findFirst({
      where: { userId: session.user.id },
    });

    let site;
    if (existingSite) {
      site = await prisma.site.update({
        where: { id: existingSite.id },
        data: {
          templateId: template.id,
          config: config as unknown as object,
          isPublished: false,
        },
      });
    } else {
      site = await prisma.site.create({
        data: {
          userId: session.user.id,
          templateId: template.id,
          subdomain,
          config: config as unknown as object,
          isPublished: false,
        },
      });
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { site } },
      { status: existingSite ? 200 : 201 }
    );
  } catch (error) {
    console.error("[POST /api/sites/generate]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
