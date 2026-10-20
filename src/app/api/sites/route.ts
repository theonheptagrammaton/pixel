export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";
import { generateSiteConfig, SECTORS } from "@/lib/ai-site-generator";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { templateId } = body as { templateId: string };

    if (!templateId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "templateId zorunludur." },
        { status: 400 }
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template || !template.isActive) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gecersiz sablon." },
        { status: 404 }
      );
    }

    // Generate a full site config from the matching sector
    const defaultConfig = template.defaultConfig as Record<string, unknown>;
    let siteConfig: object;

    if (defaultConfig && Array.isArray((defaultConfig as { pages?: unknown }).pages) && ((defaultConfig as { pages: unknown[] }).pages).length > 0) {
      siteConfig = defaultConfig;
    } else {
      // Find the first sector that maps to this template slug and generate config
      const matchingSector = SECTORS.find((s) => s.templateSlug === template.slug);
      if (matchingSector) {
        siteConfig = generateSiteConfig("İşletme Adınız", matchingSector.id);
      } else {
        // Fallback: use first sector
        siteConfig = generateSiteConfig("İşletme Adınız", SECTORS[0].id);
      }
    }

    const subdomain = session.user.username.toLowerCase().trim();

    // Upsert: if user already has a site, update it; otherwise create
    const existingSite = await prisma.site.findFirst({
      where: { userId: session.user.id },
    });

    let site;
    if (existingSite) {
      site = await prisma.site.update({
        where: { id: existingSite.id },
        data: {
          templateId: template.id,
          config: siteConfig as object,
          isPublished: false,
        },
      });
    } else {
      // Check subdomain availability (another user might have taken it)
      const subdomainTaken = await prisma.site.findFirst({
        where: { subdomain, userId: { not: session.user.id } },
      });
      const finalSubdomain = subdomainTaken
        ? `${subdomain}-${Math.random().toString(36).slice(2, 6)}`
        : subdomain;

      site = await prisma.site.create({
        data: {
          userId: session.user.id,
          templateId: template.id,
          subdomain: finalSubdomain,
          config: siteConfig as object,
          isPublished: false,
        },
      });
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { site } },
      { status: existingSite ? 200 : 201 }
    );
  } catch (error) {
    console.error("[POST /api/sites]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
