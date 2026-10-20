export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { validateSubdomain, sanitizeSubdomain } from "@/lib/sanitize";
import { ApiResponse } from "@/types";

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
    const raw = (body?.subdomain as string) ?? "";
    const subdomain = sanitizeSubdomain(raw);

    const validation = validateSubdomain(subdomain);
    if (!validation.valid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: validation.reason },
        { status: 400 }
      );
    }

    const conflict = await prisma.site.findFirst({
      where: { subdomain, NOT: { id: params.id } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu subdomain zaten kullaniliyor." },
        { status: 409 }
      );
    }

    const domainChanged = subdomain !== site.subdomain;

    const updated = await prisma.site.update({
      where: { id: params.id },
      data: {
        subdomain,
        ...(domainChanged ? { isPublished: false } : {}),
      },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: { site: updated } });
  } catch (error) {
    console.error("[PUT /api/sites/[id]/subdomain]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
