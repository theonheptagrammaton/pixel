export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { ApiResponse, SiteConfig } from "@/types";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

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

    const rl = checkRateLimit(`publish:${session.user.id}`, 10, 60_000);
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
    const { action } = body as { action: "publish" | "unpublish" };

    if (action === "unpublish") {
      const updated = await prisma.site.update({
        where: { id: params.id },
        data: { isPublished: false },
      });
      return NextResponse.json<ApiResponse>({ success: true, data: { site: updated } });
    }

    if (action !== "publish") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gecersiz islem." },
        { status: 400 }
      );
    }

    // Publish validations
    const config = site.config as unknown as SiteConfig;

    if (!config?.global?.general?.businessName?.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "isletme adi bos olamaz." },
        { status: 400 }
      );
    }

    if (!config?.global?.seo?.title?.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "SEO basligi bos olamaz." },
        { status: 400 }
      );
    }

    const allSections = (config?.pages ?? []).flatMap((p) => p.sections ?? []);
    const visibleSections = allSections.filter((s) => s.isVisible);
    if (visibleSections.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "En az 1 gorunen bolum olmalidir." },
        { status: 400 }
      );
    }

    const updated = await prisma.site.update({
      where: { id: params.id },
      data: { isPublished: true },
    });

    const publishedUrl = site.customDomain && site.domainVerified
      ? `https://${site.customDomain}`
      : `https://${site.subdomain}.${ROOT_DOMAIN.split(":")[0]}`;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { site: updated, publishedUrl },
    });
  } catch (error) {
    console.error("[PUT /api/sites/[id]/publish]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
