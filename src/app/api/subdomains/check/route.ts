export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { validateSubdomain } from "@/lib/sanitize";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const subdomain = req.nextUrl.searchParams.get("subdomain") ?? "";
    const excludeSiteId = req.nextUrl.searchParams.get("excludeSiteId") ?? undefined;

    const validation = validateSubdomain(subdomain);
    if (!validation.valid) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { available: false, reason: validation.reason },
      });
    }

    const existing = await prisma.site.findFirst({
      where: {
        subdomain,
        ...(excludeSiteId ? { NOT: { id: excludeSiteId } } : {}),
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { available: false, reason: "Bu subdomain zaten kullaniliyor." },
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { available: true },
    });
  } catch (error) {
    console.error("[GET /api/subdomains/check]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
